// Cohort benchmarks (ADR-0007, ADR-0010 §5): a merchant is compared against its
// cohort (category × volume-quartile × amount-quartile, membership from agg_cohort).
// Single-merchant (live) datasets benchmark only against an explicitly-labeled
// EXTERNAL REFERENCE population — never silently mixed.
import type { SegmentFilter, MetricId } from '../types.ts';
import { computeMetric } from './metrics.ts';

interface Db {
  prepare(sql: string): {
    get(...a: unknown[]): Record<string, unknown>;
    all(...a: unknown[]): Array<Record<string, unknown>>;
  };
}

export interface CohortBenchmark {
  cohortId: string;
  cohortMerchants: number;
  metric: MetricId;
  merchantValue: number;
  median: number;
  q1: number;
  q3: number;
  reference: 'cohort' | 'external_reference';
}

function quantile(sorted: number[], q: number): number {
  if (!sorted.length) return 0;
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return lo === hi ? sorted[lo] : sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

/**
 * Benchmark merchant vs cohort peers for one metric over one filter window.
 * `referenceDb` differs from `db` only in external-reference mode (live dataset
 * benchmarked against the challenge dataset — caller labels it in the UI).
 */
export function benchmark(
  db: Db, merchantKey: string, metric: MetricId, filter: SegmentFilter,
  referenceDb?: Db,
): CohortBenchmark | null {
  const row = db.prepare(
    'SELECT cohort_id FROM agg_cohort WHERE merchant_key = ?').get(merchantKey);
  if (!row?.cohort_id) return null;
  const cohortId = String(row.cohort_id);
  const peers = db.prepare(
    'SELECT merchant_key FROM agg_cohort WHERE cohort_id = ?').all(cohortId)
    .map((r) => String(r.merchant_key));

  const src = referenceDb ?? db;
  const values: number[] = [];
  for (const peer of peers) {
    if (peer === merchantKey && !referenceDb) continue;   // exclude self in true cohort mode
    const r = computeMetric(src, metric, { ...filter, merchantKeys: [peer] });
    if (r != null && Number.isFinite(r.value)) values.push(r.value);
  }
  if (values.length < 2) return null;                     // quality gate: ≥2 peers
  values.sort((a, b) => a - b);

  const mine = computeMetric(db, metric, { ...filter, merchantKeys: [merchantKey] });
  if (mine == null) return null;

  return {
    cohortId,
    cohortMerchants: peers.length,
    metric,
    merchantValue: mine.value,
    median: quantile(values, 0.5),
    q1: quantile(values, 0.25),
    q3: quantile(values, 0.75),
    reference: referenceDb ? 'external_reference' : 'cohort',
  };
}
