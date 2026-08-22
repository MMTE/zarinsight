// Zarinsight API server — CONTRACTS §5–§7. Express app usable both as a Vite dev
// middleware (vite.config.ts) and standalone (npm start: serves dist + /api).
// ADR-0009 (stack), ADR-0003 (eligibility), ADR-0006 (no absolute fee leaves the box).
import express from 'express';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { Registry } from './registry.mjs';
import { computeMetric, sessionMetrics, RULES } from '../src/lib/engine/metrics.ts';
import { sessionWhere, sessionFrom } from '../src/lib/engine/segment.ts';
import { benchmark } from '../src/lib/engine/cohorts.ts';

const repoRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');

/** ADR-0006 guard: no absolute adjusted_fee key ever crosses the wire. */
function scrubFee(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(scrubFee);
  if (obj && typeof obj === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      if (k === 'adjusted_fee' || k === 'adjustedFee') continue;
      out[k] = scrubFee(v);
    }
    return out;
  }
  return obj;
}

const RULE_TABLE = [
  { ruleId: RULES.ALL, requires: [], fa: 'همهٔ جلسه‌های پرداخت (هر وضعیتی)',
    note: 'مبنای تقاضا و نرخ‌های کل' },
  { ruleId: RULES.SUCCESS, requires: ['session_status'], fa: 'فقط جلسه‌های Verified',
    note: 'درآمد و میانگین مبلغ فقط روی موفق‌ها' },
  { ruleId: RULES.ATTEMPT, requires: ['try_status', 'psp_code'],
    fa: 'تلاش‌های واقعی پرداخت (بدون NoAttempt)', note: 'نرخ موفقیت در سطح تلاش' },
  { ruleId: RULES.CARD, requires: ['payer_card_key'],
    fa: 'کارت‌های شناخته‌شده نزد همین پذیرنده، فقط پرداخت موفق',
    note: 'شناسه کارت‌ها به ازای هر پذیرنده است (G n4)' },
  { ruleId: RULES.CODED, requires: ['switch_response_code'],
    fa: 'تلاش‌های ناموفق دارای کد پاسخ (≈۶٪ شکست‌ها)', note: 'کدها PSP-دوداتی‌اند (G n2)' },
  { ruleId: RULES.VERIFY_LATENCY, requires: ['verify_time_ms'],
    fa: 'تلاش‌های موفق دارای زمان verify', note: 'زمان پاسخ PSP، نه اقامت کاربر (G n5)' },
  { ruleId: RULES.MERCHANT_SCOPE, requires: ['payer_card_key'],
    fa: 'فقط در دامنهٔ یک پذیرنده', note: 'تمرکز درآمد معنا ندارد در سطح کل' },
];

export function createApiApp() {
  const registry = new Registry(join(repoRoot, 'data', 'datasets'));
  const registryReload = () => registry.reload();
  const app = express();
  app.use(express.json({ limit: '256kb' }));

  const ok = (res: express.Response, payload: unknown) =>
    res.json(scrubFee(payload));
  const fail = (res: express.Response, code: number, fa: string) =>
    res.status(code).json({ error: { code, fa } });

  // ---- datasets (CONTRACTS §7) ----
  app.get('/api/datasets', (_req, res) => {
    ok(res, {
      active: registry.active().id,
      datasets: registry.list().map((d) => ({ ...d.manifest, id: d.id })),
    });
  });
  app.post('/api/datasets/:id/activate', (req, res) => {
    if (!registry.activate(req.params.id)) return fail(res, 404, 'چنین مجموعه‌داده‌ای پیدا نشد');
    ok(res, { active: registry.active().id });
  });

  // connect live ZarinPal merchant account (ADR-0010 §3): key never persisted;
  // rows pulled via the provider, built into data/datasets/live-<merchant>/
  app.post('/api/datasets/connect', async (req, res) => {
    const { apiKey, merchantKey } = (req.body ?? {}) as { apiKey?: string; merchantKey?: string };
    if (!apiKey || !merchantKey) {
      return fail(res, 400, 'کلید API و شناسه پذیرنده هر دو لازم است');
    }
    const { listLiveRows } = await import('./providers/zarinpal-live.mjs');
    const { buildDataset } = await import('../scripts/lib/core.mjs');
    let rows;
    try {
      rows = await listLiveRows({ apiKey, merchantKey });
    } catch (e) {
      return fail(res, 502, `اتصال به زرین‌پال ناموفق بود: ${String((e as Error).message)}`);
    }
    if (!rows.length) return fail(res, 422, 'تراکنشی برای این حساب دریافت نشد');
    const datasetId = `live-${merchantKey}`;
    const result = await buildDataset({
      datasetId, provider: 'zarinpal-live',
      rows: (async function* () { yield* rows; })(),
      sha256: '', availableFields: [
        'session_key', 'merchant_key', 'amount', 'session_status', 'created_at',
        'payer_card_key', 'switch_response_code'],
      grain: 'session', merchantScope: 'single',
      outDir: join(repoRoot, 'data', 'datasets', datasetId), gates: null,
    });
    registryReload();                                   // pick up the new dataset dir
    ok(res, { datasetId, counts: result.counts });
  });
  app.get('/api/merchants', (req, res) => {
    const ds = registry.get(String(req.query.dataset)) ?? registry.active();
    const rows = ds.db.prepare(`SELECT m.merchant_key, m.category_title,
        COALESCE(SUM(a.sessions), 0) sessions, COALESCE(SUM(a.revenue), 0) revenue
      FROM dim_merchant m LEFT JOIN agg_daily a ON a.merchant_key = m.merchant_key
      GROUP BY m.merchant_key ORDER BY revenue DESC`).all();
    ok(res, { dataset: ds.id, merchants: rows });
  });

  // ---- insights ----
  app.get('/api/insights', (req, res) => {
    const ds = registry.get(String(req.query.dataset)) ?? registry.active();
    const scope = req.query.scope ? String(req.query.scope) : null;
    const type = req.query.type ? String(req.query.type) : null;
    const limit = Math.min(Number(req.query.limit ?? 50), 200);
    let sql = 'SELECT payload FROM insights WHERE lifecycle = ?';
    const params: unknown[] = ['published'];
    if (scope) { sql += ' AND scope_key = ?'; params.push(scope); }
    if (type) { sql += " AND json_extract(payload, '$.type') = ?"; params.push(type); }
    sql += ' ORDER BY rank_score DESC LIMIT ?'; params.push(limit);
    const rows = ds.db.prepare(sql).all(...params) as Array<{ payload: string }>;
    ok(res, rows.map((r) => JSON.parse(r.payload)));
  });
  app.get('/api/insights/:id', (req, res) => {
    const ds = registry.active();
    const row = ds.db.prepare('SELECT payload FROM insights WHERE id = ?')
      .get(req.params.id) as { payload: string } | undefined;
    if (!row) return fail(res, 404, 'بینش مورد نظر پیدا نشد');
    ok(res, JSON.parse(row.payload));
  });
  app.post('/api/insights/:id/lifecycle', (req, res) => {
    const ds = registry.active();
    const event = String((req.body as { event?: string }).event ?? '');
    if (!['opened', 'actioned', 'dismissed'].includes(event)) {
      return fail(res, 400, 'رویداد چرخهٔ عمر نامعتبر است');
    }
    ds.db.prepare('INSERT INTO insight_events (insight_id, event, at_ms) VALUES (?,?,?)')
      .run(req.params.id, event, Date.now());
    ds.db.prepare('UPDATE insights SET lifecycle = ? WHERE id = ?').run(event, req.params.id);
    ok(res, { id: req.params.id, lifecycle: event });
  });

  // records drill-down («محاسبه» evidence rows) — filter from the insight payload
  app.get('/api/insights/:id/records', async (req, res) => {
    const ds = registry.active();
    const row = ds.db.prepare('SELECT payload FROM insights WHERE id = ?')
      .get(req.params.id) as { payload: string } | undefined;
    if (!row) return fail(res, 404, 'بینش مورد نظر پیدا نشد');
    const insight = JSON.parse(row.payload);
    const page = Math.max(1, Number(req.query.page ?? 1));
    const pageSize = Math.min(Number(req.query.size ?? 20), 200);
    const w = sessionWhere(insight.evidence.filter);
    const from = sessionFrom(w);
    const total = (ds.db.prepare(`SELECT COUNT(*) c FROM ${from} WHERE ${w.sql}`)
      .get(w.params) as { c: number }).c;
    const rows = ds.db.prepare(`SELECT session_key, merchant_key, terminal_key, amount,
        session_status, date_id, hour, n_attempts, payer_card_key, band
      FROM ${from} WHERE ${w.sql} ORDER BY date_id, session_key LIMIT ? OFFSET ?`)
      .all(w.params, pageSize, (page - 1) * pageSize);
    ok(res, { total, page, pageSize, rows, filter: insight.evidence.filter });
  });

  // ---- overview (reads agg_daily — never scans facts; ADR-0002 runtime rule) ----
  app.get('/api/overview', (req, res) => {
    const ds = registry.get(String(req.query.dataset)) ?? registry.active();
    const scope = req.query.scope ? String(req.query.scope) : 'portfolio';
    const range = (ds.db.prepare('SELECT MIN(date_id) a, MAX(date_id) b FROM dim_date')
      .get() as { a: string; b: string });
    const aggWhere = scope !== 'portfolio' ? 'merchant_key = ?' : '1=1';
    const aggParams: unknown[] = scope !== 'portfolio' ? [scope] : [];
    const a = ds.db.prepare(`SELECT SUM(sessions) sessions, SUM(success) success,
        SUM(revenue) revenue, SUM(retries) retries, SUM(paid) paid
      FROM agg_daily WHERE ${aggWhere}`).get(...aggParams) as Record<string, number>;
    const returning = ds.db.prepare(`SELECT SUM(new_s) new_s, SUM(ret_s) ret_s
      FROM agg_merchant_kpi ${scope !== 'portfolio' ? 'WHERE merchant_key = ?' : ''}`)
      .get(...aggParams) as Record<string, number>;
    const sessions = Number(a.sessions ?? 0);
    const cardDenom = Number(returning.new_s ?? 0) + Number(returning.ret_s ?? 0);
    const kpis = {
      revenue: Number(a.revenue ?? 0),
      successRate: sessions ? Number(a.success ?? 0) / sessions : 0,
      retryRate: sessions ? Number(a.retries ?? 0) / sessions : 0,
      returningShare: cardDenom ? Number(returning.ret_s ?? 0) / cardDenom : 0,
      sessions,
      eligibleRuleId: RULES.ALL,
    };
    const top3 = (ds.db.prepare(
      `SELECT payload FROM insights WHERE scope_key = ? AND lifecycle = 'published'
       ORDER BY rank_score DESC LIMIT 3`).all(scope) as Array<{ payload: string }>)
      .map((r) => JSON.parse(r.payload));
    ok(res, { dataset: ds.id, scope, dateRange: [range.a, range.b], kpis, top3 });
  });

  // ---- explore (agg_daily for time dims; agg_psp_merchant for psp) ----
  app.get('/api/explore/metrics', (req, res) => {
    const ds = registry.get(String(req.query.dataset)) ?? registry.active();
    const dim = String(req.query.dim ?? 'month');
    const scope = req.query.scope ? String(req.query.scope) : null;
    const merchantWhere = scope && scope !== 'portfolio' ? 'merchant_key = ?' : '1=1';
    const params: unknown[] = scope && scope !== 'portfolio' ? [scope] : [];
    const queries: Record<string, string> = {
      date: `SELECT date_id d, COUNT(*) sessions, SUM(success) success, SUM(revenue) revenue
             FROM agg_daily WHERE ${merchantWhere} GROUP BY date_id ORDER BY d`,
      month: `SELECT substr(date_id,1,7) d, COUNT(*) days, SUM(sessions) sessions,
                SUM(success) success, SUM(revenue) revenue
              FROM agg_daily WHERE ${merchantWhere} GROUP BY d ORDER BY d`,
      hour: `SELECT hour d, SUM(sessions) sessions, SUM(success) success, SUM(revenue) revenue
             FROM agg_hourly WHERE ${merchantWhere} GROUP BY hour ORDER BY d`,
      psp: `SELECT month_id d, psp_code psp, SUM(attempts) sessions, SUM(verified) success,
                SUM(success_value) revenue
              FROM agg_psp_merchant WHERE ${merchantWhere} GROUP BY d, psp ORDER BY d, psp`,
    };
    if (!queries[dim]) return fail(res, 400, 'بعد تحلیل نامعتبر است');
    const rows = ds.db.prepare(queries[dim]).all(...params);
    ok(res, { dataset: ds.id, dim, series: rows });
  });

  // ---- benchmarks ----
  app.get('/api/benchmarks', (req, res) => {
    const ds = registry.get(String(req.query.dataset)) ?? registry.active();
    const merchantKey = String(req.query.merchantKey ?? '');
    const metric = String(req.query.metric ?? 'success_rate');
    const range = (ds.db.prepare('SELECT MIN(date_id) a, MAX(date_id) b FROM fact_session')
      .get() as { a: string; b: string });
    const bench = benchmark(ds.db, merchantKey, metric as never,
      { dateRange: [range.a, range.b] });
    if (!bench) return fail(res, 404, 'گروه مشابه کافی برای مقایسه پیدا نشد');
    ok(res, bench);
  });

  // ---- methodology (the honesty page data) ----
  app.get('/api/methodology', (req, res) => {
    const ds = registry.get(String(req.query.dataset)) ?? registry.active();
    const metaRows = ds.db.prepare('SELECT key, value FROM meta').all() as Array<{ key: string; value: string }>;
    const meta = Object.fromEntries(metaRows.map((r) => [r.key, r.value]));
    ok(res, {
      dataset: { ...ds.manifest },
      rules: RULE_TABLE,
      caveats: [
        'موفقیت فقط یعنی Verified؛ Paid به‌صورت «برداشت تاییدنشده» جداگانه گزارش می‌شود.',
        'adjusted_fee با ضریب محرمانه ضرب شده؛ فقط نسبت‌ها معتبرند، نه مقادیر مطلق (ADR-0006).',
        'شناسه کارت‌ها به ازای هر پذیرنده است؛ مقایسهٔ مشتری بین پذیرنده‌ها ممکن نیست (G n4).',
        'کدهای پاسخ PSP-دوداتی‌اند و دیکشنری ندارند؛ بدون تفسیر نمایش داده می‌شوند (G n2).',
        'stداده‌ها ۶ ماه است؛ ادعای سال‌به‌سال معتبر نیست.',
      ],
      counts: meta,
    });
  });

  // ---- ask fallback (deterministic FAQ; LLM layer = eve agent, ADR-0011) ----
  app.post('/api/explain', (req, res) => {
    const { insightId } = (req.body ?? {}) as { insightId?: string };
    const ds = registry.active();
    const row = insightId
      ? (ds.db.prepare('SELECT payload FROM insights WHERE id = ?').get(insightId) as { payload: string } | undefined)
      : undefined;
    if (!row) return fail(res, 404, 'بینش مورد نظر پیدا نشد');
    const insight = JSON.parse(row.payload);
    ok(res, {
      insightId,
      prose: `${insight.title} — ${insight.summary} جمعیت واجد شرایط: ${insight.evidence.eligiblePopulation.rows} ردیف.`,
    });
  });

  return app;
}

// standalone: serve API + built UI (npm start)
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const app = express();
  app.use(createApiApp());
  const dist = join(repoRoot, 'dist');
  if (existsSync(dist)) {
    const sirv = (await import('sirv')).default;
    app.use(sirv(dist, { single: true }));            // SPA history fallback (deep links)
  }
  const port = Number(process.env.PORT ?? 3000);
  app.listen(port, () => console.log(`[zarinsight] http://localhost:${port}`));
}
