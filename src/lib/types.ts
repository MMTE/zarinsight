// Engine type layer — mirrors docs/CONTRACTS.md §1/§4/§7 exactly (drift is a bug).
// ADR-0004: every number a detector emits comes from these shapes.

export type InsightType =
  | 'anomaly' | 'trend' | 'opportunity' | 'risk'
  | 'benchmark' | 'behavior' | 'diagnostic' | 'seasonal';
export type Confidence = 'high' | 'medium' | 'low';
export type Lifecycle =
  | 'detected' | 'validated' | 'ranked' | 'published'
  | 'opened' | 'actioned' | 'dismissed';

export interface MetricReading {
  name: MetricId;
  value: number;
  previousValue?: number;
  changePct?: number;
  changePp?: number;
  unit: 'irr' | 'rate' | 'count' | 'ms' | 'index';
}

export interface Comparison {
  kind: 'baseline' | 'cohort' | 'previous_period' | 'merchant_other_routes';
  population: string;
  value: number;
  deltaPp?: number;
  deltaPct?: number;
  method: 'naive' | 'mix_adjusted';
}

export interface Impact {
  amountIrr: number;
  period: 'month' | 'week' | 'quarter';
  method: 'F-01' | 'F-02' | 'F-03' | 'F-04';
  capPp?: number;
  label: 'opportunity' | 'risk' | 'estimated_gain';
}

export interface DiagnosisStep {
  kind: 'decomposition' | 'shift_share' | 'benchmark' | 'impact';
  label: string;
  rows: Array<Record<string, number | string | null>>;
}

export type MetricId =
  | 'revenue' | 'demand_sessions' | 'success_rate' | 'capture_rate'
  | 'unverified_capture_rate' | 'unverified_capture_irr'
  | 'attempt_success_rate' | 'avg_success_amount' | 'fee_index' | 'retry_rate'
  | 'p95_verify_latency' | 'p95_init_latency' | 'concentration_top5'
  | 'concentration_top_decile' | 'recoverable_irr';

export type AmountBand = 'q1' | 'q2' | 'q3' | 'q4' | 'top10';

export interface SegmentFilter {
  merchantKeys?: string[];
  pspCodes?: string[];
  categoryIds?: number[];
  hourOfDay?: [number, number];
  weekdays?: number[];                    // 0=شنبه … 6=جمعه (dim_date.weekday)
  amountBand?: AmountBand;
  dateRange: [string, string];            // ISO dates
  statuses?: Array<'success' | 'captured_unverified' | 'failed' | 'inbank' | 'noattempt'>;
  cardRepeat?: 'new' | 'returning';       // success-conditioned, same-merchant (ADR-0003)
  responseCodes?: string[];               // full PSP-namespaced strings [G n2]
}

export interface Evidence {
  eligiblePopulation: { rows: number; sessions: number; ruleId: string };
  filter: SegmentFilter;
  series?: SeriesPoint[];
  sql: string;
  dataCaveats: string[];
}

export interface SeriesPoint { x: string; y: number }

export interface Recommendation { text: string; basis: string }

export interface InsightAction {
  kind: 'investigate' | 'calculation' | 'explore' | 'methodology';
  label: string;
  target: SegmentFilter | string;         // filter | insight id | 'methodology'
}

export interface Insight {
  id: string;                             // `${detectorId}:${scopeKey}:${periodKey}`
  detectorId: string;
  type: InsightType;
  scope: { type: 'merchant' | 'terminal' | 'portfolio'; key: string };
  period: { key: string; start: string; end: string };
  title: string;
  summary: string;
  metric: MetricReading;
  comparison?: Comparison;
  diagnosis?: DiagnosisStep[];
  impact?: Impact;
  confidence: Confidence;
  evidence: Evidence;
  recommendation: Recommendation;
  actions: InsightAction[];
  composedFrom?: string[];
  lifecycle: Lifecycle;
  rankScore: number;
}

// CONTRACTS §7 — datasets
export interface DatasetManifest {
  id: string;
  label: string;
  provider: 'csv-attempts' | 'zarinpal-live';
  grain: 'attempt' | 'session';
  merchantScope: 'portfolio' | 'single';
  availableFields: string[];
  dateRange: [string, string];
  counts: {
    rows: number; sessions: number; merchants: number;
    psps: number; cards: number;
  };
  builtAt: string;
  sourceSha256?: string;
}
