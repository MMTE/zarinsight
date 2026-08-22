# ADR-0010: Pluggable datasources — dataset registry, provider adapters, manifest-driven eligibility

## Status
Accepted 2026-08-22

## Context
The product must not be a locked demo bound to `other_challenge_data.csv`: merchants
must be able to point Zarinsight at **their own data** — first the supplied challenge
CSV (343 merchants), later a live ZarinPal merchant account (user-supplied API key).
Different sources expose different fields: the CSV is attempt-grain with PSP codes,
try sequences and merchant-scoped card keys; ZarinPal's REST v3 report endpoints
(`api.zarinpal.com/rest/v3/report/webserviceTransactions.json`,
`…/purseTransactions.json`) return a merchant's own transactions with a different
schema and no attempt grain. ADR-0003's eligibility rules are stated against CSV
fields — they must generalize or silently break on other sources.

## Decision
1. **Canonical model is the only seam** (extends ADR-0002). Every source is normalized
   by a *provider adapter* into the same `fact_attempt`/`fact_session`/dims/ags model;
   the engine never knows which provider produced a dataset.
2. **Dataset registry.** A dataset = `data/datasets/<id>/` holding `db.sqlite` +
   `manifest.json`. Shipped demo dataset: `challenge-2026h1` (the CSV; also committed
   as `data/seed.db.gz`). `meta` table inside each DB mirrors the manifest (parity
   check unchanged). UI gets a dataset switcher next to the merchant switcher;
   `/api/datasets` lists registries + manifests (CONTRACTS §7).
3. **Provider adapters** (`server/providers/`): `csv-attempts` (challenge schema, ETL
   of ADR-0002) and `zarinpal-live` (REST v3 report endpoints, pagination, API key
   from env/session — never committed). A provider emits canonical rows + a
   field-availability map; the shared ETL core builds DB, manifest and aggs.
4. **Manifest-driven eligibility.** `manifest.json` records `availableFields`,
   `grain` (`attempt` | `session`), `merchantScope` (`portfolio` | `single`),
   `dateRange`, counts, source id. ADR-0003 rules compile to field predicates:
   a metric/analysis is eligible iff its required fields are present. Missing
   attempt grain (live provider) ⇒ retry/attempt/PSP analyses render as
   *«برای این منبع داده تعریف‌نشده»* in the Methodology page — same honesty pattern
   as infeasible catalog items.
5. **Benchmarks across datasets.** Cohort benchmarks need a peer population. Inside a
   portfolio dataset: unchanged (ADR-0007). A single-merchant live dataset may be
   benchmarked **only** against an explicitly-labeled *external reference population*
   (default: `challenge-2026h1` cohort), shown with a permanent caveat chip; never
   silently mixed.
6. **Provider mapping tables are docs.** Each provider ships a mapping table
   (`docs/research/…-mapping.md`) recording source field → canonical field,
   transformations, and unmapped source fields. `zarinpal-live` v1 mapping is
   finalized during a spike with the user's real key (plan Task 8); REST-v3 docs are
   thin (zarinpal-lab/API-Docs), so the adapter logs unmapped fields at ingest.

## Alternatives rejected
- **Hardcode challenge dataset** — the locked demo this ADR exists to kill.
- **Per-provider engines** — duplicates every detector; violates single-truth ADR-0004.
- **Federated queries at runtime (no normalization)** — kills determinism, parity test
  and the <2-min judge setup.

## Consequences
- ETL gains a provider interface; `scripts/etl.mjs` becomes the `csv-attempts` provider
  driving the shared core (no behavior change for the challenge dataset).
- Datasets are additive: judges get `challenge-2026h1` from seed; a merchant adds their
  own without touching the demo path.
- Manifest is a new contract surface (CONTRACTS §7) and must round-trip into `meta`.
- Live ingestion is pull-based (manual/"sync now" button); no webhooks in v1.
