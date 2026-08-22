# Dataset Profiling — other_challenge_data.csv

Date: 2026-08-21 · Sources: full-file aggregation (awk, this machine) + official
`data-guide.md` (provided 2026-08-21 by the challenge; semantics below cite it as [G]).
Grain: attempt rows unless noted.

All numbers below are computed from the **full 473 MB file** (2,213,289 data rows), not the
4.6 MB sample (`other_challenge_data_sample.csv`). Where the earlier sample-based brainstorm
numbers differ, the full-file number is canonical.

## 1. Shape

| Fact | Value |
|---|---|
| Attempt rows | 2,213,289 |
| Distinct sessions (`session_key`) | 2,062,839 |
| Date range | 2026-01-01 00:00:08 → 2026-06-30 23:59:55 (6 full months, Tehran time assumed) |
| Distinct merchants | 343 |
| Distinct terminals | 348 |
| Distinct categories | 5 (see §7) |
| Distinct PSPs | 8 (`PSP-01`…`PSP-08`) |
| Distinct card keys (`payer_card_key`) | 402,173 — **per-merchant aliases, not global customers** [G n4]; cross-merchant overlap unknown |
| Verified revenue (Σ `amount`, success — §2) | **5,165,464,690,799 IRR** (≈ 5.17 T ریال / 6 months) — *corrected 2026-08-22: the ETL canonical model and a fresh first-occurrence awk pass both yield this; the figure previously recorded here (5,165,464,966,299) differed by 275,500 IRR (5×10⁻⁶) and could not be reproduced; engine value is canonical (AGENTS rule 1)* |

Multi-attempt sessions: 77,152 sessions (3.74 %) have >1 attempt row; the 150,450 extra
rows beyond one-per-session belong to them. Tail reaches ≥10 attempts.

**`try_seq` is dense 1..n per session** (verified: `try_seq=0` ⇔ NoAttempt exactly —
263,936 rows, zero exceptions; every multi-row session's max(try_seq) equals its row
count). [G] confirms numbering from 1. The gaps seen earlier (81, 88, 95, …) were an
artifact of the 0.96 % row **sample** dropping sibling attempts — the full file contains
complete attempt sequences, so "attempts per session" needs no *recorded* qualifier.

## 2. Outcome distributions

Session grain (first row per session):

| session_status | Share | Count |
|---|---:|---:|
| Verified | 49.72 % | 1,025,655 |
| Failed | 49.86 % | 1,028,477 |
| Paid | 0.42 % | 8,706 |
| Reversed | ~0 | 1 |

**Success (canonical) = `Verified` only** [G: «حالت نهایی و کامل»] = **49.72 %**
(1,025,655 sessions). `Paid` (0.42 %) = money captured from the card but never verified —
tracked as a separate *unverified-capture* bucket, not merged into success. Legacy
"Verified+Paid" capture rate = 50.14 % is kept only for comparison. Reversed (true
refund) is 1 row — refund analysis is infeasible.

Attempt grain (`try_status`):

| try_status | Share of rows | Meaning [G] |
|---|---:|---|
| Verified | 46.34 % | attempt verified — final complete state |
| InBank | 39.92 % | redirected to bank, **no result returned — indeterminate at attempt level**: 62,409 InBank attempts sit inside eventually-`Verified` sessions, 820,787 inside `Failed` |
| NoAttempt | 11.93 % | session row with no payment attempt (try_seq=0) |
| Failed | 1.42 % | explicit failure |
| Paid | 0.39 % | card charged, not verified (8,705 of 8,706 are `verify_type=Automated` — an automated-flow anomaly, not merchant negligence) |
| Reversed | 1 row | — |

## 3. Time structure

Monthly session success rate: Jan 44.23 % → Feb 48.55 % → Mar 50.02 % → Apr 54.27 %
May 54.74 % → **Jun 47.04 %**. A 7.7 pp June drop after a five-month improvement — the
single best demo anomaly.

*Reconciled 2026-08-22 (canonical ETL): the series above is the legacy **Verified+Paid**
(capture) definition. Canonical success (`Verified` only, per [G] / ADR-0003):
Jan 43.64 % → Feb 48.08 % → Mar 49.82 % → Apr 53.87 % → May 54.32 % → **Jun 46.52 %**;
June drop −7.8 pp. Both series reproduce exactly from `data/datasets/challenge-2026h1`.*

Hour-of-day success (session grain): trough 00:00 (45.40 %) through 07:00 (~48 %), peak
20:00 (52.76 %), 21:00 (52.40 %). Swing ≈ 7.4 pp, stable across months. Volume peak is
12:00–16:00 and 21:00–23:00. (Values under the legacy capture definition; canonical
Verified-only equivalents recompute from `agg_hourly` at Task 2.)

Seasonality: only 6 months of history. **Nowruz (≈2026-03-20) is inside the window** —
Esfand/Nowruz-prep uplift vs. holiday-week behavior is analyzable; annual-cycle claims are
not (single observation). Weekly (weekday) patterns are analyzable everywhere.

## 4. Concentration (the challenge's explicit caveat)

Sessions by merchant: M250 51.19 %, M31 15.16 %, M18 7.84 %, M62 4.17 %, M156 2.71 % →
**top-5 = 81.1 % of sessions**. Long tail: 343 merchants.

Successful revenue by merchant: **M156 38.11 %, M18 18.48 %** (top-2 = 56.6 %) while M250 —
over half of all sessions — contributes **8.04 %** of revenue. Volume ≠ value; any
whole-dataset average is M250-dominated and must be shown per-merchant.
*Reconciled 2026-08-22: 38.11 % is the share of captured (Verified+Paid) revenue; the
canonical Verified-only share is 37.77 % — reproduced exactly from the canonical model.*

PSP share is also concentrated (PSP-03 + PSP-01 + PSP-05 carry ~68 % of attempts), and PSP
usage is merchant-correlated (e.g. PSP-08 traffic concentrates in a few merchants) → naive
PSP league tables are confounded by merchant mix (ADR-0007).

## 5. Field availability (drives eligibility rules, ADR-0003)

Missing share of the 22 columns, all rows:

| Column | Missing | Structure discovered |
|---|---:|---|
| `switch_response_code` | 97.40 % | values are **PSP-namespaced (`PSP-xx:code`)** with **no code dictionary provided** [G n2] — same numeric code ≠ same meaning across PSPs; exists only on failures (80.7 % of coded rows InBank, 19.3 % Failed; 0 % Verified) and covers only ~6.3 % of failed/InBank attempts |
| `payer_card_key` | 53.27 % | present ⇔ session success (402,172 of 402,173 card-bearing rows are successful sessions) |
| `issuer_bank_code` | 53.27 % | missing exactly when `payer_card_key` missing (card ⇒ issuer) |
| `verify_time_ms` | 53.27 % | success-only |
| `verified_at` | 50.84 % | success-only |
| `settled_at` | 50.42 % | success-only |
| `init_time_ms` | 15.67 % | NoAttempt + explicit failures + part of InBank |
| `psp_code` | 11.93 % | missing **exactly** on NoAttempt rows — present on every real attempt |
| `try_created_at` | 11.93 % | ≡ NoAttempt |
| 12 identity/time columns | 0 % | — |

Consequences:
- **Customer analysis is conditioned on success.** New-vs-returning *success-rate*
  comparison is impossible (no cards on failed sessions) — [G n3] confirms officially:
  card data returns only when the bank completes the payment. Retention = repeat
  *successful* payments, labeled as such.
- **Card keys are merchant-scoped** [G n4]: one physical card gets different keys at
  different merchants → cross-merchant customer dedup/identity is invalid; all card
  metrics computed within one merchant scope (ADR-0003).
- **PSP analysis is fully eligible** (every real attempt carries a PSP).
- **Response-code diagnosis** is a small eligible population (57,593 rows) — usable for
  root-cause drill-downs, never dataset-level rates. Group by full `PSP-xx:code` string
  only; top concentrations PSP-03 (`51`, `56`, `-3`, `59`) and PSP-05 (`12`, `15`,
  `-100`, `18`). No semantic labels available — surface codes, never invented meanings.
- Latency analysis: `init_time_ms`/`verify_time_ms` are **PSP API response times, not
  user dwell time** [G n5] — eligible on attempts that reached that stage
  (`verify_time_ms`: verified attempts).

## 6. Customer behavior (success population)

- 402,172 distinct card **keys** (merchant-scoped, §5) with ≥1 successful session.
- 127,580 card keys (31.7 %) have ≥2 successful sessions **within their merchant**.
- 61.1 % of successful sessions come from card keys that already had a prior successful
  session at the same merchant (file-order approximation of "returning"; production
  computes by timestamp).
- The 21k-row sample estimated 5.6 % repeat cards — **row-sampling destroys session
  grouping AND card linking**; never reuse sample numbers.

## 7. Categories (all 5)

| category_id | title |
|---|---|
| 48160002 | ارائه دهنده خدمات اینترنت |
| — | مراکز آموزشی مجازی |
| — | کیف و کفش فروشی |
| — | خدمات شبکه‌های کامپیوتری و اینترنت |
| — | فروشگاه لوازم آرایشی و بهداشتی |

(five distinct `category_title` values; ids not enumerated in this pass — ETL records the
mapping table.)

## 8. Money

- `amount` is session-level (identical across a session's rows), IRR.
- `adjusted_fee` = real fee × **fixed confidential multiplier** → absolute values are
  meaningless and must never be presented as ZarinPal's fee (ADR-0006). Ratios, shares,
  ranks and trends remain valid.
- Reversed/refund flow is absent (1 row) — no refund analytics.

## 9. Prioritized risks for the product

1. M250 dominates every naive aggregate → all merchant-facing numbers computed within a
   merchant scope; benchmarks computed peer-weighted.
2. Success-only fields silently bias customer analytics → eligibility rules enforced in
   the metric layer, surfaced in UI methodology panels.
3. Card keys are merchant-scoped → any portfolio-level "customer" number must be labeled
   «کارت شناخته‌شده نزد این پذیرنده»; cross-merchant journeys are analytically closed.
4. 6-month window → no year-over-year claims; Nowruz = one observed event, labeled as such.
5. Single `InBank` bucket hides failure reasons → response codes (PSP-namespaced, no
   dictionary) are the only drill-down, eligible on ~6 % of failures only.
6. `Paid` captures without verify (8.7 k, all Automated) → operational anomaly worth one
   operator-facing diagnostic insight, not a merchant action.
