# ADR-0002: Canonical data model — session grain, SQLite, precomputed

## Status
Accepted 2026-08-21

## Context
The CSV is attempt-grain (2,213,289 rows) over 2,062,839 sessions × 343 merchants
(profiling §1–2). Challenge L58 demands respect for payment-attempt granularity and volume
concentration. 473 MB cannot load in a browser; judges must run quickly (L18).

## Decision
One build-time ETL (`scripts/etl`) streams the CSV into a **SQLite** database
(`data/zarinsight.db`) with a canonical, typed model:

```
dim_merchant(merchant_key, category_id, …)        dim_psp(psp_code)
dim_date(date_id, jalali, weekday, holiday_flag)   dim_card(merchant_key + payer_card_key, issuer_bank_code)  // composite PK — keys are merchant-scoped [G n4]
fact_attempt(row fields: session_key, try_seq, psp_code, try_status,
             switch_response_code, init_time_ms, try_created_at …)
fact_session(session_key, merchant_key, terminal_key, category_id, amount,
             adjusted_fee, session_status, is_success /* =Verified only */, is_captured /* Verified|Paid */,
             created_at→date_id, hour, n_attempts, verify_type, verify_time_ms,
             verified_at, settled_at, payer_card_key …)
agg_*  precomputed aggregates: daily/hourly merchant metrics, psp×merchant, amount
       bands, card cohorts, benchmarks per cohort — the only tables the runtime queries
       for insight generation; fact tables serve "view records" drill-downs.
```

Rules:
- **Session is the unit of payment outcome** (`is_success` = session_status = `Verified`
  — ADR-0003; `Paid` captured-unverified kept via `is_captured`); attempts are its
  children. Session-level attributes (`amount`, `adjusted_fee`, `merchant_key`,
  `category_id`) are taken from the session's first row and validated constant across its
  rows (ETL asserts; violations logged to a quarantine table).
- **Attempt sequences are complete**: `try_seq` dense 1..n, `0` = NoAttempt (profiling
  §1, verified on full file + [G]); ETL asserts density per session.
- Persian category titles stored UTF-8 as-is; `switch_response_code` stored as the full
  PSP-namespaced string [G n2].
- Determinism: same CSV → same DB (sorted inserts, fixed float rounding).

## Alternatives rejected
- **DuckDB/Parquet at runtime** — heavier setup, worse judge story than a committed DB.
- **Client-side computation** — impossible at 473 MB; also violates traceability (numbers
  must be reproducible server-side).
- **Postgres** — external service; kills "clone and run".

## Consequences
- Runtime = read-only SQLite queries over precomputed aggs (ms-fast, ADR-0005).
- Evidence drill-downs query fact tables with the exact filter that produced the insight.
- ETL is the single place eligibility rules (ADR-0003) are enforced.
- DB ships compressed in-repo (`data/seed.db.gz`, GitHub <100 MB constraint) so judges
  skip the ETL; `npm run data:build` regenerates from the CSV when present.
