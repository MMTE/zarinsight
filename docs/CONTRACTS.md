# CONTRACTS — typed interfaces between engine, API, and UI

Date: 2026-08-21 · Single source of truth for shapes; code imports types from here, docs
reference IDs from here. TypeScript-syntax; all types live in `src/lib/types.ts` at
implementation time (no drift allowed — CI check compares).

## 1. Insight object

```ts
type InsightType = "anomaly" | "trend" | "opportunity" | "risk" |
                   "benchmark" | "behavior" | "diagnostic" | "seasonal";
type Confidence  = "high" | "medium" | "low";   // ADR-0007 gates

interface Insight {
  id: string;                    // `${detectorId}:${scopeKey}:${periodKey}` — stable
  detectorId: string;            // e.g. "I-03" (catalog ID)
  type: InsightType;
  scope: Scope;                  // merchant | terminal | portfolio
  period: { key: string; start: string; end: string };      // e.g. 2026-W23
  title: string;                 // Persian sentence WITH the number
  summary: string;               // 1–2 sentences, plain Persian
  metric: MetricReading;         // below
  comparison?: Comparison;       // baseline / cohort / previous period
  diagnosis?: DiagnosisStep[];   // decomposition / shift-share rows (I-02, I-36)
  impact?: Impact;               // ریال estimate + method + cap
  confidence: Confidence;
  evidence: Evidence;            // below — the traceability payload
  recommendation: Recommendation;
  actions: InsightAction[];      // max 3 (ADR-0008)
  composedFrom?: string[];       // insight ids merged by the composer
  lifecycle: "detected" | "validated" | "ranked" | "published"
           | "opened" | "actioned" | "dismissed";
  rankScore: number;             // impact × confidence × urgency × actionability
}

interface MetricReading {
  name: string;                  // canonical metric id, §2
  value: number; previousValue?: number; changePct?: number; changePp?: number;
  unit: "irr" | "rate" | "count" | "ms" | "index";
}

interface Comparison {
  kind: "baseline" | "cohort" | "previous_period" | "merchant_other_routes";
  population: string;            // human-readable + machine cohort id
  value: number; deltaPp?: number; deltaPct?: number;
  method: "naive" | "mix_adjusted";   // ADR-0007 — naive shown only alongside adjusted
}

interface Impact {
  amountIrr: number; period: "month" | "week" | "quarter";
  method: string;                // formula id from §3
  capPp?: number;                // conservative cap applied (I-08: 10pp)
  label: "opportunity" | "risk" | "estimated_gain";
}

interface Evidence {
  eligiblePopulation: { rows: number; sessions: number; ruleId: string }; // ADR-0003 rule id
  filter: SegmentFilter;         // exact predicate reproducing the number — below
  series?: SeriesPoint[];        // for charts (collapsed by default)
  sql: string;                   // the actual query run (shown in «محاسبه»)
  dataCaveats: string[];         // e.g. "success-conditioned", "card keys are merchant-scoped"
}

interface Recommendation { text: string; basis: string /* detector + evidence ids */ }
interface InsightAction {
  kind: "investigate" | "calculation" | "explore" | "methodology";
  label: string;                 // «بررسی» / «محاسبه»
  target: SegmentFilter | Insight["id"] | "methodology";
}
```

## 2. Canonical metrics (ids are permanent)

| id | definition | grain | eligibility |
|---|---|---|---|
| `revenue` | Σ `amount` over `Verified` sessions (`is_success`) | session | success |
| `demand_sessions` | count sessions (all outcomes) | session | all |
| `success_rate` | `Verified` sessions ÷ sessions [G: Verified = final complete state] | session | all |
| `capture_rate` | (`Verified`+`Paid`) sessions ÷ sessions — comparison metric only | session | all |
| `unverified_capture_rate` | `Paid` sessions ÷ sessions; plus `unverified_capture_irr` | session | all — operator diagnostic (8,706 sessions / 116.6 B IRR portfolio-wide, Automated flow) |
| `attempt_success_rate` | `Verified` attempts ÷ real attempts (try_status ≠ NoAttempt); InBank attempts count as not-yet-successful (indeterminate) | attempt | excl. NoAttempt |
| `avg_success_amount` | mean `amount` over successful sessions | session | success |
| `fee_index` | Σ `adjusted_fee` ÷ Σ `amount` (ADR-0006, ratio-only) | session | success |
| `retry_rate` | sessions with >1 attempt ÷ sessions (try_seq dense 1..n) | session | all |
| `repeat_card_rate` | card keys with ≥2 successful sessions ÷ card keys with ≥1 — **within one merchant** (keys are merchant-scoped [G n4]) | card | success-cond. |
| `returning_session_share` | successful sessions with prior successful session (same card key, same merchant) ÷ successful sessions | session | success-cond. |
| `p95_verify_latency` / `p95_init_latency` | percentile of `verify_time_ms` / `init_time_ms` — PSP API response time [G n5], never user dwell time | attempt | per ADR-0003 |
| `concentration_top5` | top-5 share of `revenue` by card key — merchant scope only | card | success |
| `recoverable_irr` | failed-session Σamount × min(gapPp, 10)/100 | session | formula §3 |

## 3. Impact formulas (ids referenced by `Impact.method`)

- `F-01 recoverable`: `(Σ amount over failed sessions in segment) × min(benchmark_rate −
  observed_rate, 0.10)`, expressed monthly via trailing-30d run-rate.
- `F-02 reroute`: `(adjusted_gapPp/100) × (successful value carried by underperforming PSP)`
  — merchant-scoped (I-05/I-22).
- `F-03 concentration_downside`: `top_customer_share × monthly revenue` (I-27/I-13).
- `F-04 trend_runrate`: `Δ% × current monthly revenue` (I-14/I-01).

## 4. SegmentFilter — the traceability predicate

```ts
interface SegmentFilter {
  merchantKeys?: string[]; pspCodes?: string[]; categoryIds?: string[];
  hourOfDay?: [number, number]; weekdays?: number[]; amountBand?: "q1"|"q2"|"q3"|"q4"|"top10";
  dateRange: [string, string];          // ISO
  statuses?: ("success" | "captured_unverified" | "failed" | "inbank" | "noattempt")[];
  cardRepeat?: "new" | "returning";     // success-conditioned, same-merchant only (ADR-0003)
  responseCodes?: string[];             // FULL PSP-namespaced values, e.g. "PSP-03:51" [G n2] — never bare numerics
}
```
Every number in an Insight MUST be reproducible by applying `evidence.filter` to the
canonical model — the «محاسبه» view renders filter + SQL + a 20-row sample of the
underlying rows (paginated, capped at 200 rows per request).

## 5. API surface (route handlers, all GET, JSON)

| Route | Returns |
|---|---|
| `/api/insights?scope=&period=&type=&limit=` | `Insight[]` (ranked, lifecycle ≥ published) |
| `/api/insights/:id` | full `Insight` incl. diagnosis + evidence |
| `/api/insights/:id/records?page=` | underlying rows for `evidence.filter` |
| `/api/overview?scope=` | top-3 changes since previous period + KPI deltas |
| `/api/explore/metrics?metric=&dims=&filter=` | aggregated series for evidence charts |
| `/api/benchmarks?merchantKey=&metric=` | cohort definition + merchant vs median/quartile |
| `/api/methodology` | eligibility rules, caveats, dataset facts (ADR-0003/0006/0007 rendered) |
| `/api/datasets` (+ `POST /:id/activate`) | dataset registry + manifests; switches active dataset (ADR-0010) |
| `/api/explain` (POST, optional LLM) | `{ insightId, question } → { prose }` — prose-only, payload-grounded (ADR-0004) |

Errors: `{ error: { code, fa } }`; 404 for unknown insight; 400 with the violated rule id
for ineligible filters. No absolute `adjusted_fee` field exists anywhere in responses
(ADR-0006).

## 6. ETL output contract

`data/datasets/<id>/db.sqlite` tables (active dataset; the shipped demo dataset is
committed as `data/seed.db.gz`, ADR-0002/0010): `dim_merchant, dim_psp, dim_date,
fact_attempt, fact_session, agg_daily, agg_hourly, agg_psp_merchant, agg_amount_band,
agg_cohort, insights, insight_events (lifecycle), meta (etl run hash, row counts,
rule versions)`. `meta` powers the seed-vs-ETL parity test (ADR-0005).
## 7. Datasets, manifests & providers (ADR-0009/0010/0011)

```ts
interface DatasetManifest {
  id: string;                       // "challenge-2026h1" | "live-<merchantKey>"
  label: string;                    // Persian display name
  provider: "csv-attempts" | "zarinpal-live";
  grain: "attempt" | "session";     // attempt grain ⇒ retry/PSP analyses eligible
  merchantScope: "portfolio" | "single";
  availableFields: string[];        // canonical fields present (drives eligibility)
  dateRange: [string, string];
  counts: { rows: number; sessions: number; merchants: number; psps: number; cards: number };
  builtAt: string; sourceSha256?: string;   // csv provider only
}

// GET /api/datasets → { active: string, datasets: DatasetManifest[] }
// POST /api/datasets/:id/activate → switches scope (UI switcher)
// GET  /api/methodology renders per-active-dataset eligibility from availableFields.
```

Provider adapter contract: `listRows(provider config) → AsyncIterable<CanonicalRow>`
+ `availableFields`; the shared ETL core is provider-agnostic and writes manifest +
`meta` in one transaction. Eligibility rule ids from ADR-0003 gain a
`requires: Field[]` predicate so the same rule table serves every dataset.

Agent tools (ADR-0011) speak `SegmentFilter` + metric ids only — the `/api/explain`
POST route remains as the no-key FAQ fallback.

