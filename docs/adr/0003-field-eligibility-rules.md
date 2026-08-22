# ADR-0003: Field-eligibility rules — missingness is structure, not noise

## Status
Accepted 2026-08-21

## Context
Profiling §5: missingness is systematic — `payer_card_key`/`issuer_bank_code`/
`verify_time_ms` exist ⇔ session success (402,172/402,173); `psp_code`/`try_created_at`
missing exactly on NoAttempt rows; `switch_response_code` exists only on ~6.3 % of failed
attempts; `verified_at`/`settled_at` success-only. Challenge L26 and L58 require missing
values to be handled honestly; naive "54 % of customers are missing" conclusions are
forbidden. The official `data-guide.md` (2026-08-21) confirms the mechanisms: card data
returns only when the bank completes the payment [G n3]; response codes are
PSP-namespaced with no dictionary [G n2]; card keys are aliases unique **per merchant**
[G n4]; ms-columns are PSP API latency, not user dwell time [G n5].

## Decision
Every metric in CONTRACTS.md declares an **eligibility rule** (a WHERE clause over the
canonical model). The metric layer refuses to compute over ineligible rows; the UI renders
the eligible population next to every affected number ("بر اساس N ردیف واجد شرایط").

| Analysis family | Eligible population |
|---|---|
| Revenue / volume / trends | `Verified` sessions for revenue (see success definition below); all sessions for demand |
| Payment success rate | success = **`Verified` only** [G: final complete state; `Paid` = captured-unverified tracked separately as `unverified_capture`]; attempts analysis excludes NoAttempt (try_seq=0) |
| PSP performance | attempts with `psp_code` present (= all real attempts), merchant-scoped |
| Customer retention / repeat | successful sessions with card, **computed within one merchant** — card keys are merchant-scoped aliases [G n4], cross-merchant customer identity is invalid; conditioned on success, labeled as such |
| New-vs-returning **success-rate** comparison | **INFEASIBLE** (cards absent on failures, [G n3]) — the catalog marks it ineligible rather than computing a biased number |
| Response-code diagnosis | failed/InBank attempts carrying a code (57,593 rows) — grouped by full `PSP-xx:code` string (cross-PSP numeric comparison invalid [G n2]); never a dataset-level rate; codes surfaced without semantic labels (no dictionary) |
| Verify latency | verified attempts with `verify_time_ms` (PSP API time [G n5]) |
| Init latency | attempts with `init_time_ms` present (PSP API time [G n5]) |
| Settlement time | successful sessions with `settled_at` |

Enforcement lives in the ETL/metric layer (typed, tested); insight cards inherit the
statement automatically via the Insight contract's `evidence.eligiblePopulation`.

## Consequences
- No silent bias in customer analytics; the constraint "we only see customers who paid" is
  a first-class, user-visible caveat.
- Portfolio-level "customer" counts are impossible in principle (merchant-scoped keys) —
  the UI labels them «کارت شناخته‌شده نزد این پذیرنده».
- The Methodology page is generated from these rules — traceability points for judges.
- One brainstorm idea (I-09 new-vs-returning success comparison) is explicitly killed by
  data, which is itself a depth signal we surface in the Methodology page.
