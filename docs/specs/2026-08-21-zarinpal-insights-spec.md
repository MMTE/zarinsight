# Zarinsight — ZarinPal Merchant Intelligence · Design Spec

Date: 2026-08-21 · Status: Approved (brainstorm 2026-08-21, local://paste-1.md + full-dataset profiling)
Working title **«بینش» (Zarinsight)** — name is a marketing decision, not architectural.

## 1. Problem & product

challenge.md: merchants own rich transaction data and don't use it. We build an **insight
engine** (ADR-0001), not a dashboard:

> Zarinsight continuously detects the most important changes, opportunities, risks and
> anomalies in a merchant's payment data, quantifies the ریال impact, exposes the
> evidence, and recommends the next action.

Every insight: **چه شد → چرا → چقدر پول → شواهد → چه کاری**.

### Personas
- **Merchant** (primary demo persona): scoped to one `merchant_key`; sees only own data +
  peer benchmarks (cohort, never peer identities beyond counts).
- **Operator/portfolio** (ZarinPal-side): all-merchant scope; concentration & merchant
  outlier views (I-27/I-28/I-32/I-33 live here).

Merchant switcher in the header (demo affordance; dataset has 343 merchants).

## 2. Rubric mapping (300 pts)

| Criterion | Pts | How earned |
|---|---|---|
| Actionability & originality | 90 | ranked insight feed with ریال impact + action on every card (catalog P0 12 detectors); composition pattern; payment-native analyses (retry friction, PSP mix-adjustment, recoverable revenue) beyond challenge examples |
| Correctness & traceability | 75 | deterministic engine (ADR-0004); eligibility rules enforced + visible (ADR-0003); «محاسبه» view = filter + SQL + rows; fee-multiplier rule (ADR-0006); guide-semantic labeling (Verified-only success, merchant-scoped card keys, PSP-namespaced codes) |
| Analytical depth | 60 | decomposition (I-02), shift-share drivers (I-36), mix-adjusted benchmarks (ADR-0007), cohort retention (I-11), Wilson intervals, hypothesis-test view (I-39) |
| Nontechnical UX | 45 | Persian sentence-cards, collapsed charts, top-3 changes, guided «بررسی» flows, humanized ریال (ADR-0008) |
| Technical quality | 30 | clone→seed→dev in <2 min, typed contracts, tests on engine, clean docs (this tree) |

## 3. Architecture

```
datasources (ADR-0010)
  ├─ provider csv-attempts ── other_challenge_data.csv (473 MB, gitignored, CRLF)
  └─ provider zarinpal-live ─ api.zarinpal.com/rest/v3 report endpoints (merchant key)
        │ canonical rows (typed, provider-declared availableFields)
        ▼
  shared ETL core ──▶ data/datasets/<id>/{db.sqlite, manifest.json}
        │               agg_* + facts + insights + meta   (demo: challenge-2026h1)
        │               committed as data/seed.db.gz  ◀── "npm run seed" decompress
        ▼
  src/lib/engine/  detectors I-01…I-39  (pure TS: gate → rank → compose)
        │ typed Insight[]
        ▼
  Node API server (/api/*, better-sqlite3, CONTRACTS §5–7)
        ├──▶ Vite UI (RTL fa, React Router) — pages below; dataset + merchant switchers
        └──▶ /eve/* ──▶ eve agent child «تحلیلگر بینش» (ADR-0011) ◀── Ask page chat
```

Data flow is one-directional: source → provider → ETL → DB → engine → API/agent → UI.
The agent reads the same engine through read-only tools (never raw SQL, never
figures of its own — ADR-0004). No runtime writes except insight lifecycle events
(opened/actioned/dismissed → `insight_events`) and dataset sync (live provider pull).

### 3.1 Datasets & multi-merchant scope (ADR-0009/0010)

- **Dataset switcher** beside the merchant switcher (top bar): demo dataset
  `challenge-2026h1` (343 merchants, 2.06 M sessions) or a connected `zarinpal-live`
  dataset (the merchant's own account, key entered in /more, never committed).
- Inside a portfolio dataset the **merchant switcher** scopes every page to one
  `merchant_key`; the operator/portfolio scope (all merchants) powers concentration
  and outlier views (I-27/I-28/I-32/I-33).
- Single-merchant (live) datasets: portfolio views mark infeasible; peer benchmarks
  either render with the **external reference population** caveat (vs `challenge-2026h1`
  cohort) or are marked ineligible — per the manifest's `availableFields`, never silently.

## 4. Pages & key flows (routes as landed in `zarinsight/`, bound per ADR-0010/0011)

1. **`/panel` داشبورد درگاه** — gateway KPIs for the active merchant + period: demand,
   success rate, verified revenue, live session table (agg_daily + fact_session).
2. **`/` وضعیت کسب و کار (Overview)** — «سه تغییر مهم از بازدید قبل» + 4 KPIs
   (revenue, success rate, retry rate, returning share) with deltas and sparklines.
3. **`/insights` بینش‌های مهم** — ranked feed from `insights`; filters by type; each
   card: Persian sentence title with the number, summary, impact chip, confidence,
   «بررسی» + «محاسبه». Composer-merged cards show their evidence chain. Dismiss →
   lifecycle recorded, card collapses with undo.
4. **`/insights/:id` investigate flow** — stepper: decomposition → segment attribution
   → benchmark → impact → recommendation; every step shows its eligible population;
   final step = filtered records table (paginated sample, cap 200).
5. **`/sales` فروش** — revenue & demand trends (agg_daily), amount-band and category
   splits (agg_amount_band), Nowruz annotation (single-event labeled).
6. **`/customers` مشتریان** — success-conditioned, same-merchant card analytics:
   repeat-card rate, returning-session share, cohort matrix; ADR-0003 labels
   («کارت شناخته‌شده نزد این پذیرنده») on every number.
7. **`/payments` پرداخت‌ها** — payment funnel (sessions → attempts → verified), PSP
   table (agg_psp_merchant; naive shown only beside mix-adjusted — ADR-0007),
   unverified-capture diagnostic (I-40), response-code drill-down (full PSP:code
   strings only).
8. **`/benchmarks` مقایسه با کسب‌وکارهای مشابه** — cohort definition + merchant vs
   median/quartiles; external-reference-population caveat on live datasets.
9. **`/explore` بررسی داده‌ها** — dimension tables + trend charts per domain; every
   aggregation row exports its SegmentFilter (cell click → investigate context).
10. **`/data-quality` کیفیت داده** — field availability & missingness rendered from
    the active dataset's manifest + meta (the honesty facts of profiling §5).
11. **`/methodology` روش تحلیل** — generated from eligibility rules, fee-multiplier
    explanation, cohort definitions, confounder methods, infeasible-analyses list —
    regenerated per active dataset.
12. **`/ask` پرسش و پاسخ** — eve analyst chat («تحلیلگر بینش»); deterministic FAQ
    fallback from the evidence payload when no chat key is configured.
13. **`/notifications`** — insight lifecycle events + new-insight digest (eve schedule,
    stretch).
14. **`/more`** — dataset management (connect ZarinPal API key, sync now, remove),
    period defaults, about.

## 5. Demo scenarios (feed the ≥5-min video; script written at plan Task 9)

1. Land on Overview as M156: top-3 changes; open June success drop.
2. Investigate end-to-end: decomposition → PSP-05/PSP-08 mix-shift driver → filtered
   records → «محاسبه» SQL view.
3. Benchmark: M156 vs cohort (cosmetics category, similar volume) with mix-adjusted gap.
4. Retention: cohort matrix; 61.1 % returning-session share; repeat-rate vs cohort.
5. Risk: concentration card; top-customer downside simulation.
6. Methodology: eligibility rules; why new-vs-returning success comparison doesn't exist.
7. Mobile width pass over the same flows; Persian RTL reading.
8. Live dataset: connect the merchant API key in /more, sync, switch dataset — own
   business dashboard renders with external-reference benchmark caveat; dataset
   switcher returns to demo data without reload.

## 6. Verification

- Engine unit tests (`node:test`): detectors on fixture DB slices; quality gate; ranking;
  shift-share & mix-adjustment math; eligibility enforcement (ineligible filter → rule id).
- Parity test: `npm run seed` DB and freshly ETL-built DB produce identical insight JSON.
- E2E smoke script: assert each P0 detector emitted ≥1 published insight on the real DB;
  `/api/insights/:id/records` returns rows matching the filter count.
- Browser verification (desktop + 375 px) before each release tag.

## 7. Out of scope (roadmap, stated in README)

Real-time ingestion (live sync is pull-based), integrations/actions beyond in-product
drill-downs (campaigns, exports at scale), English UI, year-over-year claims (data ends
2026-06-30), absolute-fee anything (ADR-0006). Custom user-defined alerts (GA-style)
moved from out-of-scope to **stretch**: eve daily/weekly digest schedules (ADR-0011).
