// P0 detectors I-01…I-27 (INSIGHT-CATALOG). Each returns atoms; the runner gates,
// ranks and persists. Weekly/monthly rollups come from one agg_daily pass per
// detector over all merchants — no per-merchant query storms.
import type Database from 'better-sqlite3';
import type { Atom, DetectorContext } from './detector.ts';
import { GATE } from './detector.ts';
import { computeMetric, sessionMetrics, RULES } from './metrics.ts';
// benchmark() superseded here by cohortStats/peerQuantiles (set-based)
// import { benchmark } from './cohorts.ts';
import { f01Recoverable, f03Concentration } from './impact.ts';
import { wilsonInterval } from './wilson.ts';
import { copy, faPct, faPp, faIrr } from '../../copy/fa.ts';

export interface WeekRow {
  merchant: string; week: string;
  sessions: number; success: number; revenue: number; failedIrr: number;
}
export interface MonthRow {
  merchant: string; month: string;
  sessions: number; success: number; revenue: number; failedIrr: number; retries: number;
}

type Row = Record<string, unknown>;

const num = (v: unknown) => Number(v ?? 0);

export function weekRows(db: Database.Database): WeekRow[] {
  const rows = db.prepare(`SELECT merchant_key, strftime('%G-W%V', date_id) AS week,
      SUM(sessions) AS sessions, SUM(success) AS success, SUM(revenue) AS revenue,
      SUM(failed_irr) AS failed_irr
    FROM agg_daily GROUP BY merchant_key, week ORDER BY merchant_key, week`).all();
  return (rows as unknown as Array<Record<string, unknown>>).map((r) => ({
    merchant: String(r.merchant_key), week: String(r.week),
    sessions: num(r.sessions), success: num(r.success),
    revenue: num(r.revenue), failedIrr: num(r.failed_irr),
  }));
}

export function monthRows(db: Database.Database): MonthRow[] {
  const rows = db.prepare(`SELECT merchant_key, substr(date_id,1,7) AS month,
      SUM(sessions) AS sessions, SUM(success) AS success, SUM(revenue) AS revenue,
      SUM(failed_irr) AS failed_irr, SUM(retries) AS retries
    FROM agg_daily GROUP BY merchant_key, substr(date_id,1,7) ORDER BY merchant_key, month`).all();
  return (rows as unknown as Array<Record<string, unknown>>).map((r) => ({
    merchant: String(r.merchant_key), month: String(r.month),
    sessions: num(r.sessions), success: num(r.success), revenue: num(r.revenue),
    failedIrr: num(r.failed_irr), retries: num(r.retries),
  }));
}

function median(xs: number[]): number {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const mid = s.length >> 1;
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function monthBounds(ctx: DetectorContext, month: string): { start: string; end: string } {
  const hit = ctx.months.find((x) => x.key === month);
  return hit ?? { start: `${month}-01`, end: `${month}-31` };
}

/** I-01 — weekly revenue anomaly vs median of prior 8 weeks (catalog: ≥15% dev). */
export function i01RevenueAnomaly(ctx: DetectorContext): Atom[] {
  const atoms: Atom[] = [];
  const rows = weekRows(ctx.db);
  const byMerchant = new Map<string, WeekRow[]>();
  for (const r of rows) {
    const list = byMerchant.get(r.merchant) ?? [];
    list.push(r);
    byMerchant.set(r.merchant, list);
  }
  for (const [merchant, weeks] of byMerchant) {
    weeks.forEach((w, i) => {
      if (w.sessions < GATE.MIN_N) return;
      const prior = weeks.slice(Math.max(0, i - 8), i).map((x) => x.revenue);
      if (prior.length < 4) return;
      const base = median(prior);
      if (!base) return;
      const dev = (w.revenue - base) / base;
      if (Math.abs(dev) < 0.15) return;
      const dir = dev < 0 ? 'down' : 'up';
      atoms.push({
        detectorId: 'I-01', type: 'anomaly', scopeKey: merchant,
        periodKey: w.week, periodStart: w.week, periodEnd: w.week,
        metric: { name: 'revenue', value: w.revenue, unit: 'irr' },
        filter: { dateRange: ['2026-01-01', '2026-06-30'], merchantKeys: [merchant] },
        eligibleRows: w.sessions, n: w.sessions, ruleId: RULES.SUCCESS,
        impact: { amountIrr: Math.round(dev * w.revenue * (30 / 7)), period: 'month',
          method: 'F-04', label: dev < 0 ? 'risk' : 'estimated_gain' },
        title: copy.i01Title(dir, w.week, faIrr(Math.abs(dev * w.revenue))),
        summary: copy.i01Summary(faIrr(Math.abs(dev * w.revenue)), faPct(Math.abs(dev))),
        recommendation: 'هفته‌های پرانحراف را در بررسی داده‌ها باز کنید و ترکیب ترافیک همان هفته را ببینید.',
        urgency: dev < 0 ? 0.9 : 0.5, actionability: 0.8,
      });
    });
  }
  return atoms;
}

/** I-02 — multiplicative revenue decomposition (count × rate × avg value), monthly. */
export function i02RevenueDecomposition(ctx: DetectorContext): Atom[] {
  const atoms: Atom[] = [];
  const rows = monthRows(ctx.db);
  const byMerchant = new Map<string, MonthRow[]>();
  for (const r of rows) {
    const list = byMerchant.get(r.merchant) ?? [];
    list.push(r);
    byMerchant.set(r.merchant, list);
  }
  for (const [merchant, months] of byMerchant) {
    for (let i = 1; i < months.length; i++) {
      const a = months[i - 1];
      const b = months[i];
      if (a.sessions < GATE.MIN_N || b.sessions < GATE.MIN_N) continue;
      if (!a.revenue || !b.revenue) continue;
      const r0 = a.success / a.sessions;
      const r1 = b.success / b.sessions;
      const avg0 = a.revenue / a.success;
      const avg1 = b.revenue / b.success;
      const countEff = (b.sessions - a.sessions) * r0 * avg0;
      const rateEff = b.sessions * (r1 - r0) * avg0;
      const valueEff = b.sessions * r1 * (avg1 - avg0);
      const total = b.revenue - a.revenue;
      if (Math.abs(total) < 0.05 * a.revenue) continue;   // only explain real moves
      const parts = [
        { label: 'تعداد پرداخت', v: countEff },
        { label: 'نرخ موفقیت', v: rateEff },
        { label: 'میانگین مبلغ', v: valueEff },
      ].sort((x, y) => Math.abs(y.v) - Math.abs(x.v));
      atoms.push({
        detectorId: 'I-02', type: 'diagnostic', scopeKey: merchant,
        periodKey: b.month, ...monthBounds(ctx, b.month),
        metric: { name: 'revenue', value: total, unit: 'irr' },
        filter: { dateRange: [`${a.month}-01`, `${b.month}-31`], merchantKeys: [merchant] },
        eligibleRows: b.sessions, n: b.sessions, ruleId: RULES.ALL,
        diagnosis: [{
          kind: 'decomposition', label: 'تجزیهٔ تغییر درآمد',
          rows: parts.map((p) => ({ driver: p.label, irr: Math.round(p.v),
            sharePct: total ? Math.round((p.v / total) * 100) : null })),
        }],
        title: copy.i02Title(parts[0].label,
          faPct(Math.abs(total ? parts[0].v / total : 0), 0)),
        summary: `تغییر ${faIrr(total)} عمدتاً از ${parts[0].label} است.`,
        recommendation: 'به بزرگ‌ترین عامل، در بررسی داده‌ها ادامه دهید.',
        urgency: 0.5, actionability: 0.8,
        mergeKey: `anomaly|${merchant}|${b.month}`,
      });
    }
  }
  return atoms;
}

/** I-03 — monthly/weekly success-rate anomaly (June drop is the canonical anchor). */
export function i03SuccessAnomaly(ctx: DetectorContext): Atom[] {
  const atoms: Atom[] = [];
  const rows = monthRows(ctx.db);
  const byMerchant = new Map<string, MonthRow[]>();
  for (const r of rows) {
    const list = byMerchant.get(r.merchant) ?? [];
    list.push(r);
    byMerchant.set(r.merchant, list);
  }
  const emit = (scopeKey: string, months: MonthRow[], portfolio = false) => {
    for (let i = 2; i < months.length; i++) {
      const cur = months[i];
      const prior = months.slice(0, i);
      if (cur.sessions < (portfolio ? 3 : GATE.MIN_N)) continue;
      const base = median(prior.filter((p) => p.sessions > 0).map((p) => p.success / p.sessions));
      const rate = cur.success / cur.sessions;
      const deltaPp = (rate - base) * 100;
      if (deltaPp > -3 && deltaPp < 3) continue;
      const recover = f01Recoverable({
        failedAmountIrr: cur.failedIrr, benchmarkRate: base, observedRate: rate,
        periodDays: 30,
      });
      atoms.push({
        detectorId: 'I-03', type: 'anomaly', scopeKey,
        periodKey: cur.month, ...monthBounds(ctx, cur.month),
        metric: { name: 'success_rate', value: rate, unit: 'rate',
          previousValue: base, changePp: deltaPp },
        filter: { dateRange: [`${cur.month}-01`, `${cur.month}-31`],
          ...(portfolio ? {} : { merchantKeys: [scopeKey] }) },
        eligibleRows: cur.sessions, n: cur.sessions,
        ruleId: portfolio ? RULES.ALL : RULES.ALL,
        comparison: { kind: 'baseline', population: 'میانهٔ ماه‌های قبل', value: base,
          deltaPp, method: 'naive' },
        impact: recover.amountIrr > 0 ? { amountIrr: recover.amountIrr, period: 'month',
          method: 'F-01', capPp: recover.capPp, label: 'opportunity' } : undefined,
        title: copy.i03Title(cur.month, faPct(rate), faPp(deltaPp)),
        summary: copy.i03Summary(cur.month, faPct(rate), faPct(base),
          faIrr(recover.amountIrr)),
        recommendation: 'مسیرهای پرداخت و ساعات پرریسک همین ماه را در بررسی باز کنید.',
        urgency: 0.95, actionability: 0.9,
        mergeKey: `anomaly|${scopeKey}|${cur.month}`,
        caveats: ['نرخ موفقیت فقط شامل جلسه‌های Verified است (Paid جداگانه گزارش می‌شود).'],
      });
    }
  };
  for (const [merchant, months] of byMerchant) emit(merchant, months);
  // portfolio rollup
  const portfolio = new Map<string, { sessions: number; success: number; failedIrr: number }>();
  for (const r of rows) {
    const acc = portfolio.get(r.month) ?? { sessions: 0, success: 0, failedIrr: 0 };
    acc.sessions += r.sessions; acc.success += r.success; acc.failedIrr += r.failedIrr;
    portfolio.set(r.month, acc);
  }
  const portfolioMonths: MonthRow[] = [...portfolio.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, v]) => ({ merchant: 'portfolio', month, ...v, revenue: 0, retries: 0 }));
  emit('portfolio', portfolioMonths, true);
  return atoms;
}

/** I-04 — conversion opportunity: segment materially below merchant's own rate. */
export function i04ConversionOpportunity(ctx: DetectorContext): Atom[] {
  const atoms: Atom[] = [];
  const psp = ctx.db.prepare(`SELECT merchant_key, psp_code,
      SUM(attempts) attempts, SUM(verified) verified
    FROM agg_psp_merchant GROUP BY merchant_key, psp_code`).all() as unknown as Row[];
  for (const r of psp) {
    const merchant = String(r.merchant_key);
    const pspCode = String(r.psp_code);
    const n = num(r.attempts);
    if (n < GATE.MIN_N) continue;
    const rate = num(r.verified) / n;
    const others = ctx.db.prepare(`SELECT SUM(attempts) a, SUM(verified) v
      FROM agg_psp_merchant WHERE merchant_key = ? AND psp_code <> ?`).get(merchant, pspCode) as Row;
    const on = num(others?.a);
    if (on < GATE.MIN_N) continue;
    const otherRate = num(others?.v) / on;
    const gapPp = (otherRate - rate) * 100;
    if (gapPp < GATE.GAP_PP) continue;
    const successValue = ctx.db.prepare(`SELECT SUM(success_value) v
      FROM agg_psp_merchant WHERE merchant_key = ? AND psp_code = ?`).get(merchant, pspCode) as Row;
    atoms.push({
      detectorId: 'I-04', type: 'opportunity', scopeKey: merchant,
      periodKey: '2026-H1', periodStart: '2026-01-01', periodEnd: '2026-06-30',
      metric: { name: 'attempt_success_rate', value: rate, unit: 'rate' },
      filter: { dateRange: ['2026-01-01', '2026-06-30'], merchantKeys: [merchant],
        pspCodes: [pspCode], statuses: ['success', 'failed', 'inbank', 'captured_unverified'] },
      eligibleRows: n, n, ruleId: RULES.ATTEMPT,
      comparison: { kind: 'merchant_other_routes', population: 'سایر مسیرهای همین کسب‌وکار',
        value: otherRate, deltaPp: -gapPp, method: 'naive' },
      impact: { amountIrr: Math.round(num(successValue?.v) * Math.min(gapPp, 10) / 100),
        period: 'month', method: 'F-02', capPp: Math.min(gapPp, 10), label: 'opportunity' },
      title: copy.i04Title('مسیر پرداخت', pspCode, faPp(gapPp)),
      summary: copy.i04Summary(pspCode, faPp(gapPp),
        faIrr(Math.round(num(successValue?.v) * Math.min(gapPp, 10) / 100))),
      recommendation: `ترافیک ${pspCode} را به مسیرهای بهتر همین کسب‌وکار نزدیک کنید و کدهای پاسخ همین مسیر را ببینید.`,
      urgency: 0.7, actionability: 1,
    });
  }
  return atoms;
}

/** I-05 — PSP performance, mix-adjusted (PSP-08 is the demo anchor). */
export function i05PspMixAdjusted(ctx: DetectorContext): Atom[] {
  const atoms: Atom[] = [];
  const pspTotals = ctx.db.prepare(`SELECT psp_code,
      SUM(attempts) attempts, SUM(verified) verified FROM agg_psp_merchant
    GROUP BY psp_code`).all() as unknown as Row[];
  for (const p of pspTotals) {
    const pspCode = String(p.psp_code);
    const attempts = num(p.attempts);
    if (attempts < GATE.MIN_N) continue;
    const naive = num(p.verified) / attempts;
    // merchant-mix adjustment: expected rate given the merchants this PSP serves,
    // computed from those merchants' rates on OTHER PSPs (survives-gate verdict)
    const perMerchant = ctx.db.prepare(`SELECT merchant_key,
        SUM(CASE WHEN psp_code = ? THEN attempts ELSE 0 END) own_a,
        SUM(CASE WHEN psp_code = ? THEN verified ELSE 0 END) own_v,
        SUM(CASE WHEN psp_code <> ? THEN attempts ELSE 0 END) rest_a,
        SUM(CASE WHEN psp_code <> ? THEN verified ELSE 0 END) rest_v
      FROM agg_psp_merchant GROUP BY merchant_key
      HAVING own_a >= ? AND rest_a >= ?`).all(pspCode, pspCode, pspCode, pspCode,
      GATE.MIN_N, GATE.MIN_N) as unknown as Row[];
    if (perMerchant.length < GATE.MIN_MERCHANTS) continue;
    let expectedNum = 0;
    let weightSum = 0;
    for (const m of perMerchant) {
      const w = num(m.own_a);
      expectedNum += w * (num(m.rest_v) / num(m.rest_a));
      weightSum += w;
    }
    const expected = weightSum ? expectedNum / weightSum : naive;
    const adjGapPp = (expected - naive) * 100;
    if (adjGapPp < GATE.GAP_PP) continue;
    const value = ctx.db.prepare(`SELECT SUM(success_value) v FROM agg_psp_merchant
      WHERE psp_code = ?`).get(pspCode) as Row;
    atoms.push({
      detectorId: 'I-05', type: 'benchmark', scopeKey: 'portfolio',
      periodKey: '2026-H1', periodStart: '2026-01-01', periodEnd: '2026-06-30',
      metric: { name: 'attempt_success_rate', value: naive, unit: 'rate' },
      filter: { dateRange: ['2026-01-01', '2026-06-30'], pspCodes: [pspCode],
        statuses: ['success', 'failed', 'inbank', 'captured_unverified'] },
      eligibleRows: attempts, n: perMerchant.length, ruleId: RULES.ATTEMPT,
      comparison: { kind: 'baseline', population: 'نرخ مورد انتظار با ترکیب همین پذیرنده‌ها',
        value: expected, deltaPp: -adjGapPp, method: 'mix_adjusted' },
      impact: { amountIrr: Math.round(num(value?.v) * Math.min(adjGapPp, 10) / 100),
        period: 'month', method: 'F-02', capPp: Math.min(adjGapPp, 10), label: 'opportunity' },
      title: copy.i05Title(pspCode, faPp(adjGapPp)),
      summary: copy.i05Summary(pspCode, faPct(naive), faPct(expected),
        faIrr(Math.round(num(value?.v) * Math.min(adjGapPp, 10) / 100))),
      recommendation: 'ترکیب مسیرهای پرداخت پذیرنده‌های این مسیر را بازبینی کنید.',
      urgency: 0.6, actionability: 0.8,
    });
  }
  return atoms;
}

/** I-06 — merchant-relative PSP anomaly (PSP bad specifically for this merchant). */
export function i06MerchantPsp(ctx: DetectorContext): Atom[] {
  const atoms: Atom[] = [];
  const rows = ctx.db.prepare(`SELECT merchant_key, psp_code,
      SUM(attempts) a, SUM(verified) v, SUM(success_value) val
    FROM agg_psp_merchant GROUP BY merchant_key, psp_code`).all() as unknown as Row[];
  for (const r of rows) {
    const merchant = String(r.merchant_key);
    const pspCode = String(r.psp_code);
    const a = num(r.a);
    if (a < GATE.PSP_ARM_N) continue;
    const others = ctx.db.prepare(`SELECT SUM(attempts) a, SUM(verified) v
      FROM agg_psp_merchant WHERE merchant_key = ? AND psp_code <> ?`)
      .get(merchant, pspCode) as Row;
    if (num(others?.a) < GATE.PSP_ARM_N) continue;
    const rate = num(r.v) / a;
    const otherRate = num(others?.v) / num(others?.a);
    const gapPp = (otherRate - rate) * 100;
    if (gapPp < GATE.GAP_PP) continue;
    atoms.push({
      detectorId: 'I-06', type: 'diagnostic', scopeKey: merchant,
      periodKey: '2026-H1', periodStart: '2026-01-01', periodEnd: '2026-06-30',
      metric: { name: 'attempt_success_rate', value: rate, unit: 'rate' },
      filter: { dateRange: ['2026-01-01', '2026-06-30'], merchantKeys: [merchant],
        pspCodes: [pspCode] },
      eligibleRows: a, n: a, ruleId: RULES.ATTEMPT,
      diagnosis: [{ kind: 'benchmark', label: 'مقایسه با سایر مسیرها',
        rows: [{ psp: pspCode, ratePct: Math.round(rate * 1000) / 10,
          otherPspPct: Math.round(otherRate * 1000) / 10, gapPp: Math.round(gapPp * 10) / 10 }] }],
      title: copy.i06Title(pspCode, merchant, faPp(gapPp)),
      summary: `نرخ موفقیت ${pspCode} برای ${merchant} ${faPct(rate)} است در حالی که سایر مسیرهای همین کسب‌وکار ${faPct(otherRate)} دارند.`,
      recommendation: 'فهرست تلاش‌های ناموفق همین مسیر را ببینید.',
      urgency: 0.7, actionability: 0.9,
      mergeKey: `anomaly|${merchant}|2026-H1`,
    });
  }
  return atoms;
}

/** I-07 — retry friction: multi-attempt rate + eventual recovery. */
export function i07RetryFriction(ctx: DetectorContext): Atom[] {
  const atoms: Atom[] = [];
  const rows = monthRows(ctx.db);
  // set-based: one pass each instead of per-(merchant,month) scans
  const recovery = new Map<string, number>();
  for (const r of ctx.db.prepare(`SELECT merchant_key m, substr(date_id,1,7) mo,
        SUM(is_success) * 1.0 / COUNT(*) AS rec
      FROM fact_session WHERE n_attempts > 1 GROUP BY m, mo`).all() as unknown as Row[]) {
    recovery.set(`${r.m}|${r.mo}`, num(r.rec));
  }
  const retryPsp = new Map<string, string>();
  for (const r of ctx.db.prepare(`SELECT s.merchant_key m, substr(s.date_id,1,7) mo,
        a.psp_code p, COUNT(*) c
      FROM fact_attempt a JOIN fact_session s ON s.session_key = a.session_key
      WHERE s.n_attempts > 1 AND a.psp_code IS NOT NULL
      GROUP BY m, mo, p ORDER BY c DESC`).all() as unknown as Row[]) {
    const key = `${r.m}|${r.mo}`;
    if (!retryPsp.has(key)) retryPsp.set(key, String(r.p));   // first = max (ORDER BY)
  }
  for (const r of rows) {
    if (r.sessions < GATE.MIN_N) continue;
    const retryRate = r.retries / r.sessions;
    if (retryRate < 0.03) continue;
    const key = `${r.merchant}|${r.month}`;
    atoms.push({
      detectorId: 'I-07', type: 'behavior', scopeKey: r.merchant,
      periodKey: r.month, ...monthBounds(ctx, r.month),
      metric: { name: 'retry_rate', value: retryRate, unit: 'rate' },
      filter: { dateRange: [`${r.month}-01`, `${r.month}-31`], merchantKeys: [r.merchant] },
      eligibleRows: r.sessions, n: r.sessions, ruleId: RULES.ALL,
      title: copy.i07Title(faPct(retryRate), retryPsp.get(key) ?? '—'),
      summary: copy.i07Summary(faPct(retryRate), faPct(recovery.get(key) ?? 0)),
      recommendation: 'ترافیک تلاش مجدد روی کدام مسیر و ساعت متمرکز است؟',
      urgency: 0.4, actionability: 0.6,
      caveats: ['توالی تلاش‌ها کامل است (try_seq پیوسته ۱..n).'],
    });
  }
  return atoms;
}

/** Cohort stats precomputed from monthRows (no per-pair SQL). */
function cohortStats(rows: MonthRow[], month: string, db: Database.Database): {
  byMerchant: Map<string, { rate: number; sessions: number; failedIrr: number }>;
  cohorts: Map<string, string[]>;
} {
  const byMerchant = new Map<string, { rate: number; sessions: number; failedIrr: number }>();
  for (const r of rows) {
    if (r.month !== month || !r.sessions) continue;
    byMerchant.set(r.merchant, { rate: r.success / r.sessions, sessions: r.sessions,
      failedIrr: r.failedIrr });
  }
  const cohorts = new Map<string, string[]>();
  for (const r of db.prepare('SELECT cohort_id, merchant_key FROM agg_cohort').all() as unknown as Row[]) {
    const list = cohorts.get(String(r.cohort_id)) ?? [];
    list.push(String(r.merchant_key));
    cohorts.set(String(r.cohort_id), list);
  }
  return { byMerchant, cohorts };
}

function peerQuantiles(members: string[], me: string,
  byMerchant: Map<string, { rate: number }>): { median: number; q1: number; q3: number; n: number } | null {
  const vals = members.filter((m) => m !== me)
    .map((m) => byMerchant.get(m)).filter(Boolean).map((v) => v!.rate);
  if (vals.length < 2) return null;
  vals.sort((a, b) => a - b);
  const q = (p: number) => {
    const pos = (vals.length - 1) * p;
    const lo = Math.floor(pos);
    const hi = Math.ceil(pos);
    return lo === hi ? vals[lo] : vals[lo] + (vals[hi] - vals[lo]) * (pos - lo);
  };
  return { median: q(0.5), q1: q(0.25), q3: q(0.75), n: vals.length };
}

/** I-08 — recoverable failed-payment value vs cohort benchmark. */
export function i08Recoverable(ctx: DetectorContext): Atom[] {
  const atoms: Atom[] = [];
  const rows = monthRows(ctx.db);
  const last = ctx.months[ctx.months.length - 1];
  const { byMerchant, cohorts } = cohortStats(rows, last.key, ctx.db);
  const cohortOf = new Map<string, string[]>();
  for (const [cid, members] of cohorts) for (const m of members) cohortOf.set(m, members);
  for (const r of rows) {
    if (r.month !== last.key || r.sessions < GATE.MIN_N) continue;
    const members = cohortOf.get(r.merchant);
    if (!members) continue;
    const peers = peerQuantiles(members, r.merchant, byMerchant);
    if (!peers) continue;
    const rate = r.success / r.sessions;
    const gapPp = (peers.median - rate) * 100;
    if (gapPp < GATE.GAP_PP) continue;
    const rec = f01Recoverable({ failedAmountIrr: r.failedIrr,
      benchmarkRate: peers.median, observedRate: rate, periodDays: 30 });
    atoms.push({
      detectorId: 'I-08', type: 'opportunity', scopeKey: r.merchant,
      periodKey: r.month, ...monthBounds(ctx, r.month),
      metric: { name: 'success_rate', value: rate, unit: 'rate' },
      filter: { dateRange: [last.start, last.end], merchantKeys: [r.merchant] },
      eligibleRows: r.sessions, n: r.sessions, ruleId: RULES.SUCCESS,
      comparison: { kind: 'cohort', population: `گروه مشابه (${peers.n} کسب‌وکار)`,
        value: peers.median, deltaPp: -gapPp, method: 'naive' },
      impact: { amountIrr: rec.amountIrr, period: 'month', method: 'F-01',
        capPp: rec.capPp, label: 'opportunity' },
      title: copy.i08Title(faIrr(rec.amountIrr)),
      summary: copy.i08Summary(faPp(gapPp), faIrr(rec.amountIrr)),
      recommendation: 'پرداخت‌های ناموفق این ماه را در بررسی داده‌ها ببینید.',
      urgency: 0.75, actionability: 1,
    });
  }
  return atoms;
}

/** I-14 — emerging trend: ≥6 consecutive weekly moves in one direction. */
export function i14Trend(ctx: DetectorContext): Atom[] {
  const atoms: Atom[] = [];
  const rows = weekRows(ctx.db);
  const byMerchant = new Map<string, WeekRow[]>();
  for (const r of rows) {
    const list = byMerchant.get(r.merchant) ?? [];
    list.push(r);
    byMerchant.set(r.merchant, list);
  }
  for (const [merchant, weeks] of byMerchant) {
    let streak = 0;
    let dir = 0;
    for (let i = 1; i < weeks.length; i++) {
      const prev = weeks[i - 1].success / Math.max(1, weeks[i - 1].sessions);
      const cur = weeks[i].success / Math.max(1, weeks[i].sessions);
      const d = Math.sign(cur - prev);
      if (d !== 0 && d === dir) streak++;
      else { dir = d; streak = 1; }
      if (streak >= 6 && weeks[i].sessions >= GATE.MIN_N) {
        atoms.push({
          detectorId: 'I-14', type: 'trend', scopeKey: merchant,
          periodKey: weeks[i].week, periodStart: weeks[i].week, periodEnd: weeks[i].week,
          metric: { name: 'success_rate', value: cur, unit: 'rate',
            previousValue: prev, changePp: (cur - prev) * 100 },
          filter: { dateRange: ['2026-01-01', '2026-06-30'], merchantKeys: [merchant] },
          eligibleRows: weeks[i].sessions, n: weeks[i].sessions, ruleId: RULES.ALL,
          title: copy.i14Title('نرخ موفقیت', '۶', dir > 0 ? 'رو به بهبود' : 'رو به افت'),
          summary: `نرخ موفقیت ۶ هفتهٔ متوالی ${dir > 0 ? 'بهبود' : 'افت'} داشته است.`,
          recommendation: 'روند را در بررسی داده‌ها دنبال کنید.',
          urgency: 0.5, actionability: 0.6,
        });
        break;   // one atom per merchant per direction-run
      }
    }
  }
  return atoms;
}
export function i18BenchmarkGap(ctx: DetectorContext): Atom[] {
  const atoms: Atom[] = [];
  const last = ctx.months[ctx.months.length - 1];
  const rows = monthRows(ctx.db);
  const { byMerchant, cohorts } = cohortStats(rows, last.key, ctx.db);
  for (const [cid, members] of cohorts) {
    for (const merchant of members) {
      const mine = byMerchant.get(merchant);
      const peers = peerQuantiles(members, merchant, byMerchant);
      if (!mine || !peers) continue;
      const gapPp = Math.abs((mine.rate - peers.median) * 100);
      if (gapPp < 1) continue;
      const position = mine.rate < peers.q1 ? ' پایین‌تر از میانهٔ'
        : mine.rate > peers.q3 ? ' بالاتر از خانهٔ چهارم' : ' نزدیک میانهٔ';
      const belowMedian = mine.rate < peers.median;
      atoms.push({
        detectorId: 'I-18', type: 'benchmark', scopeKey: merchant,
        periodKey: last.key, periodStart: last.start, periodEnd: last.end,
        metric: { name: 'success_rate', value: mine.rate, unit: 'rate' },
        filter: { dateRange: [last.start, last.end], merchantKeys: [merchant] },
        eligibleRows: peers.n, n: peers.n, ruleId: RULES.ALL,
        comparison: { kind: 'cohort', population: `گروه مشابه (${peers.n} کسب‌وکار)`,
          value: peers.median, deltaPp: (mine.rate - peers.median) * 100,
          method: 'mix_adjusted' },
        title: copy.i18Title('نرخ موفقیت', position),
        summary: copy.i18Summary('نرخ موفقیت', faPct(mine.rate),
          faPct(peers.median), faPct(peers.q3)),
        recommendation: belowMedian
          ? 'فاصله تا میانهٔ گروه مشابه را با اولویت‌های I-08 ببندید.'
          : 'عملکرد بالای گروه مشابه را در پیام‌های فروشتان به کار ببرید.',
        urgency: belowMedian ? 0.6 : 0.3, actionability: 0.7,
      });
    }
    void cid;
  }
  return atoms;
}

/** I-11 — customer cohort retention (merchant-scoped card keys, success-conditioned). */
export function i11Retention(ctx: DetectorContext): Atom[] {
  const atoms: Atom[] = [];
  const last = ctx.months[ctx.months.length - 1];
  // set-based: one scan for returning shares, one for repeat-card rates
  const returning = new Map<string, { denom: number; ret: number }>();
  for (const r of ctx.db.prepare(`SELECT merchant_key m,
        SUM(card_seq >= 1) denom, SUM(card_seq >= 2) ret
      FROM fact_session WHERE is_success = 1 AND payer_card_key IS NOT NULL
        AND date_id <= ? GROUP BY m`).all(last.end) as unknown as Row[]) {
    returning.set(String(r.m), { denom: num(r.denom), ret: num(r.ret) });
  }
  const repeat = new Map<string, number>();
  for (const r of ctx.db.prepare(`SELECT merchant_key m,
        SUM(n >= 2) * 1.0 / COUNT(*) AS rate FROM (
          SELECT merchant_key, payer_card_key, COUNT(*) n
          FROM fact_session WHERE is_success = 1 AND payer_card_key IS NOT NULL
          GROUP BY merchant_key, payer_card_key) GROUP BY m`)
    .all() as unknown as Row[]) {
    repeat.set(String(r.m), num(r.rate));
  }
  for (const [merchant, v] of returning) {
    if (v.denom < GATE.MIN_N) continue;
    const rate = repeat.get(merchant);
    if (rate == null) continue;
    const returningShare = v.ret / v.denom;
    atoms.push({
      detectorId: 'I-11', type: 'behavior', scopeKey: merchant,
      periodKey: last.key, periodStart: last.start, periodEnd: last.end,
      metric: { name: 'returning_session_share', value: returningShare, unit: 'rate' },
      filter: { dateRange: ['2026-01-01', last.end], merchantKeys: [merchant],
        statuses: ['success'] },
      eligibleRows: v.denom, n: v.denom, ruleId: RULES.CARD,
      title: copy.i11Title(faPct(returningShare)),
      summary: copy.i11Summary(faPct(rate), faPct(returningShare)),
      recommendation: 'ماتریس بازگشت ماه‌به‌ماه را در بررسی داده‌ها ببینید.',
      urgency: 0.4, actionability: 0.5,
      caveats: ['کارت‌ها شناسه‌های مخصوص همین پذیرنده‌اند (ADR-0003/G n4)؛ تحلیل فقط روی پرداخت‌های موفق تعریف شده است.'],
    });
  }
  return atoms;
}

/** I-27 — revenue concentration risk (top-5 card share, top-1 downside). */
export function i27Concentration(ctx: DetectorContext): Atom[] {
  const atoms: Atom[] = [];
  const last = ctx.months[ctx.months.length - 1];
  // set-based: one scan — card revenues for the last month, ranked per merchant
  const monthlyRev = new Map<string, number>();
  for (const r of ctx.db.prepare(`SELECT merchant_key m, SUM(revenue) v FROM agg_daily
      WHERE date_id >= ? AND date_id <= ? GROUP BY m`).all(last.start, last.end) as unknown as Row[]) {
    monthlyRev.set(String(r.m), num(r.v));
  }
  const byMerchant = new Map<string, Array<{ card: string; irr: number }>>();
  for (const r of ctx.db.prepare(`SELECT merchant_key m, payer_card_key card, SUM(amount) irr
      FROM fact_session WHERE is_success = 1 AND payer_card_key IS NOT NULL
        AND date_id >= ? AND date_id <= ?
      GROUP BY m, card`).all(last.start, last.end) as unknown as Row[]) {
    const merchant = String(r.m);
    const list = byMerchant.get(merchant) ?? [];
    list.push({ card: String(r.card), irr: num(r.irr) });
    byMerchant.set(merchant, list);
  }
  for (const [merchant, cards] of byMerchant) {
    if (cards.length < 5) continue;
    const rev = monthlyRev.get(merchant) ?? 0;
    if (!rev) continue;
    const sorted = cards.map((c) => c.irr).sort((a, b) => b - a);
    const cardTotal = sorted.reduce((a, b) => a + b, 0);
    const top5Share = (sorted[0] + sorted[1] + sorted[2] + sorted[3] + sorted[4]) / cardTotal;
    if (top5Share < 0.3) continue;                        // not material
    const top1Share = sorted[0] / cardTotal;
    const downside = f03Concentration(top1Share, rev);
    const window: [string, string] = [last.start, last.end];
    atoms.push({
      detectorId: 'I-27', type: 'risk', scopeKey: merchant,
      periodKey: last.key, periodStart: last.start, periodEnd: last.end,
      metric: { name: 'concentration_top5', value: top5Share, unit: 'rate' },
      filter: { dateRange: window, merchantKeys: [merchant], statuses: ['success'] },
      eligibleRows: cards.length, n: cards.length, ruleId: RULES.MERCHANT_SCOPE,
      impact: { amountIrr: downside.amountIrr, period: 'month', method: 'F-03',
        label: 'risk' },
      title: copy.i27Title(faPct(top5Share)),
      summary: copy.i27Summary(faPct(top5Share), faPct(top1Share),
        faIrr(downside.amountIrr)),
      recommendation: 'جدول تمرکز درآمد را ببینید و برای مشتریان کلیدی برنامه بچینید.',
      urgency: 0.6, actionability: 0.8,
      caveats: ['تمرکز فقط روی کارت‌های شناخته‌شده محاسبه می‌شود.'],
    });
  }
  return atoms;
}

export const P0_DETECTORS = [i01RevenueAnomaly, i02RevenueDecomposition, i03SuccessAnomaly,
  i04ConversionOpportunity, i05PspMixAdjusted, i06MerchantPsp, i07RetryFriction,
  i08Recoverable, i14Trend, i18BenchmarkGap, i11Retention, i27Concentration];
