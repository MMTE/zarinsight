// Benchmark precompute (ADR-0007 cohorts): one set-based pass per metric over
// the whole portfolio, then in-memory cohort quantiles — no per-pair queries.
// Persisted to benchmark_cache; /api/benchmarks becomes a single indexed read.
// Mirrors computeMetric semantics (metrics.ts) for the four surfaced metrics.
import type Database from 'better-sqlite3';
import type { MetricId } from '../types.ts';

const num = (v: unknown) => Number(v ?? 0);

function quantile(sorted: number[], q: number): number {
  if (!sorted.length) return 0;
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return lo === hi ? sorted[lo] : sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

/** Per-merchant metric values for the window — set-based, one query each. */
function merchantValues(db: Database.Database, metric: MetricId,
  start: string, end: string): Map<string, number> {
  const out = new Map<string, number>();
  const put = (rows: Array<Record<string, unknown>>) => {
    for (const r of rows) {
      const v = r.v == null ? null : Number(r.v);
      if (v != null && Number.isFinite(v)) out.set(String(r.merchant_key), v);
    }
  };
  if (metric === 'returning_session_share') {
    put(db.prepare(`SELECT merchant_key, SUM(card_seq >= 2) * 1.0
        / NULLIF(SUM(card_seq >= 1), 0) AS v
      FROM fact_session
      WHERE is_success = 1 AND payer_card_key IS NOT NULL
        AND date_id >= ? AND date_id <= ?
      GROUP BY merchant_key`).all(start, end));
    return out;
  }
  const expr = metric === 'success_rate' ? 'SUM(success) * 1.0 / NULLIF(SUM(sessions), 0)'
    : metric === 'retry_rate' ? 'SUM(retries) * 1.0 / NULLIF(SUM(sessions), 0)'
    : metric === 'avg_success_amount' ? 'SUM(revenue) * 1.0 / NULLIF(SUM(success), 0)'
    : null;
  if (!expr) return out;
  put(db.prepare(`SELECT merchant_key, ${expr} AS v
    FROM agg_daily WHERE date_id >= ? AND date_id <= ? GROUP BY merchant_key`)
    .all(start, end) as Array<Record<string, unknown>>);
  return out;
}

export const BENCH_METRICS: MetricId[] = [
  'success_rate', 'retry_rate', 'avg_success_amount', 'returning_session_share',
];

/**
 * Fill benchmark_cache for every (merchant, metric) with ≥2 measurable cohort
 * peers (same quality gate as benchmark()). Idempotent: rebuilds the table.
 * Returns the number of cached rows.
 */
export function precomputeBenchmarks(db: Database.Database): number {
  const range = db.prepare('SELECT MIN(date_id) a, MAX(date_id) b FROM dim_date')
    .get() as { a: string; b: string };
  const cohorts = new Map<string, string[]>();
  for (const r of db.prepare('SELECT cohort_id, merchant_key FROM agg_cohort')
    .all() as unknown as Array<Record<string, unknown>>) {
    const cid = String(r.cohort_id);
    const list = cohorts.get(cid) ?? [];
    list.push(String(r.merchant_key));
    cohorts.set(cid, list);
  }
  const cohortOf = new Map<string, { id: string; members: string[] }>();
  for (const [id, members] of cohorts) for (const m of members) cohortOf.set(m, { id, members });

  db.exec(`CREATE TABLE IF NOT EXISTS benchmark_cache (
    merchant_key TEXT NOT NULL,
    metric TEXT NOT NULL,
    merchant_value REAL NOT NULL,
    median REAL NOT NULL, q1 REAL NOT NULL, q3 REAL NOT NULL,
    cohort_id TEXT NOT NULL, cohort_merchants INTEGER NOT NULL,
    window_start TEXT NOT NULL, window_end TEXT NOT NULL,
    PRIMARY KEY (merchant_key, metric)) WITHOUT ROWID`);

  const ins = db.prepare(`INSERT INTO benchmark_cache
    (merchant_key, metric, merchant_value, median, q1, q3, cohort_id,
     cohort_merchants, window_start, window_end)
    VALUES (?,?,?,?,?,?,?,?,?,?)`);
  let count = 0;
  const tx = db.transaction(() => {
    db.exec('DELETE FROM benchmark_cache');
    for (const metric of BENCH_METRICS) {
      const values = merchantValues(db, metric, range.a, range.b);
      for (const [merchant, value] of values) {
        const cohort = cohortOf.get(merchant);
        if (!cohort) continue;
        const peers = cohort.members
          .filter((m) => m !== merchant)
          .map((m) => values.get(m))
          .filter((v): v is number => v != null)
          .sort((a, b) => a - b);
        if (peers.length < 2) continue;                    // benchmark() quality gate
        ins.run(merchant, metric, value, quantile(peers, 0.5),
          quantile(peers, 0.25), quantile(peers, 0.75),
          cohort.id, cohort.members.length, range.a, range.b);
        count++;
      }
    }
  });
  tx();
  return count;
}

export function readBenchmarks(db: Database.Database, merchantKey: string): Array<{
  metric: string; merchantValue: number; median: number; q1: number; q3: number;
  cohortId: string; cohortMerchants: number; windowStart: string; windowEnd: string;
}> {
  return (db.prepare('SELECT metric, merchant_value, median, q1, q3, cohort_id,'
    + ' cohort_merchants, window_start, window_end FROM benchmark_cache'
    + ' WHERE merchant_key = ?').all(merchantKey) as unknown as Array<Record<string, unknown>>)
    .map((r) => ({
      metric: String(r.metric), merchantValue: num(r.merchant_value),
      median: num(r.median), q1: num(r.q1), q3: num(r.q3),
      cohortId: String(r.cohort_id), cohortMerchants: num(r.cohort_merchants),
      windowStart: String(r.window_start), windowEnd: String(r.window_end),
    }));
}
