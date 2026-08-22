# Insight Catalog — v1.0

Date: 2026-08-21 · Sources: brainstorm catalog v0.1 (local://paste-1.md) cross-checked
against full-dataset profiling (docs/research/2026-08-21-dataset-profiling.md), external-
product research, and the official `data-guide.md` [G] (2026-08-21).

Selection: **12 detectors ship in the MVP** (P0), 15 more are stretch (P1, incl. the
guide-motivated I-40) — implemented only after the P0 pipeline is solid. Feasibility
verdicts are data-driven, not guesses.

Shared mechanics (apply to every entry): eligibility rules (ADR-0003), mix adjustment +
Wilson intervals (ADR-0007), quality gate meaningful→sufficient→impactful (research
patterns §4), Insight contract (CONTRACTS.md).

---

## P0 — ships in MVP (12)

### I-01 Revenue anomaly — `ANOMALY`
- **Q:** did successful-session revenue change unusually vs the expected baseline?
- **Detect:** weekly `Σamount(is_success)` vs baseline = median of prior 8 weeks
  (same-weekday-aware); flag when outside Wilson-style band of baseline.
- **Scope:** per merchant; Overview shows portfolio top-3.
- **Impact:** deviation × annualized-week → ریال/ماه.
- **Evidence:** daily series, baseline band, decomposition link → I-02.
- **Action:** «بررسی» opens the affected weeks in Explore.

### I-02 Revenue decomposition — `DIAGNOSTIC`
- **Q:** why did revenue move? count × success × avg-value × mix.
- **Compute:** multiplicative decomposition `Δrev ≈ Δsessions × Δsuccess_rate ×
  Δavg_amount`; then shift-share across merchant/category/PSP/hour/amount-band; report
  each dimension's contribution share («۶۸٪ افت ناشی از نرخ موفقیت است، نه تعداد»).
- **Impact:** inherits the anomaly's ریال figure, attributed.
- **Action:** jump to the largest contributing segment.

### I-03 Payment success-rate anomaly — `ANOMALY`
- **Q:** did success rate (sessions) break its band?
- **Detect:** weekly rate vs prior-8-week baseline with Wilson 95 % CI; June 2026
  (54.7 %→47.0 %) is the canonical demo case.
- **Impact:** gap × eligible session value → recoverable ریال (shares math with I-08).
- **Action:** «بررسی» → I-36-style driver drill-down (which merchant/PSP/hour/amount-band).

### I-04 Payment-conversion opportunity — `OPPORTUNITY`
- **Q:** which segment converts materially below the merchant's own baseline?
- **Detect:** per dimension (hour × weekday × amount-band × PSP), observed vs
  mix-adjusted expected (ADR-0007); require gap ≥ 3 pp, n ≥ 1,000 eligible sessions.
- **Impact:** `gap × segment_sessions × avg_amount` → ریال/ماه potential.
- **Action:** open filtered segment; template recommendation text.

### I-05 PSP performance, mix-adjusted — `BENCHMARK`
- **Q:** which PSP under/over-performs *for comparable traffic*?
- **Compute:** naive rate per PSP (demo shows PSP-08 15.6 % vs PSP-06 61.6 %) →
  mix-adjusted gap vs merchant-mix-expected → survives-gate verdict.
- **Impact:** rerouting estimate = closing adjusted gap × affected successful value.
- **Action:** PSP detail + per-merchant breakdown (→ I-06).

### I-06 Merchant-relative PSP anomaly — `DIAGNOSTIC`
- **Q:** does a PSP behave badly *specifically for this merchant*?
- **Compute:** per merchant × PSP: rate vs merchant's other PSPs (n ≥ 500 attempts per
  arm); flags PSPs whose merchant-local gap ≫ portfolio gap.
- **Impact:** as I-05, merchant-scoped.
- **Action:** filtered attempt list + response codes where eligible (→ I-23).

### I-07 Retry / payment friction — `BEHAVIOR`
- **Q:** how often do sessions need multiple attempts, and what happens to them?
- **Compute:** multi-attempt rate (3.74 % of sessions portfolio-wide); among them,
  eventual-success share; median inter-attempt gap from `try_created_at`.
- **Data support:** try_seq is dense 1..n (profiling §1) — attempt sequences complete;
  62,409 InBank attempts live inside eventually-Verified sessions → real retry-recovery
  funnel for I-26.
- **Impact:** if retries concentrate in one PSP/segment → recovery estimate.
- **Action:** retry-session drill-down.

### I-08 Recoverable failed-payment value — `OPPORTUNITY`
- **Q:** ریال left on the table by below-benchmark success?
- **Compute:** `Σ_amount(failed sessions in segment) × min(gap, realistic_cap)` where gap
  = cohort-benchmark − observed success, capped at 10 pp (conservative); monthly at
  current run-rate. Always «برآورد فرصت», never guaranteed revenue.
- **Action:** segment view listing the failed sessions (evidence rows).

### I-14 Emerging trend — `TREND`
- **Q:** persistent direction, not one-off anomaly?
- **Detect:** ≥ 6 consecutive weekly moves in the same direction on success rate /
  revenue / repeat rate, magnitude ≥ 1 pp (rates) or ≥ 5 % (revenue).
- **Action:** trend explorer with the streak visualized.

### I-18 Industry benchmark gap — `BENCHMARK`
- **Q:** merchant vs cohort (same category × volume band × amount band, ADR-0007).
- **Metrics:** success rate, repeat rate, avg successful amount, revenue growth.
- **Compute:** gap vs cohort median and top-quartile (I-19 folded in — same screen).
- **Impact:** closing gap-to-median on success rate → ریال (I-08 math).
- **Action:** cohort composition view («مشابهان شما: N کسب‌وکار»).

### I-11 Customer cohort retention — `BEHAVIOR`
- **Q:** do customers acquired in month M return?
- **Compute:** cohort = card **keys** (merchant-scoped [G n4]) by first successful month;
  month-k repeat rate matrix (k = 1..5). Success-conditioned (ADR-0003) — labeled.
- **Merchant facts to reproduce:** per-merchant analogs of the portfolio's 402,172 keys /
  31.7 % repeat / 61.1 % returning-session share.
- **Impact:** Δ repeat rate × avg successful amount × cohort size.
- **Action:** cohort matrix drill-down.

### I-27 Revenue concentration risk — `RISK`
- **Q:** dependency on few customers/segments.
- **Compute:** top-1/top-5 customer share of successful revenue (card-level), HHI; plus
  merchant-level view for the operator persona. Demo fact: M156 = 38 % revenue from
  2.7 % sessions; M250 = 51 % sessions, 8 % revenue (→ I-28 overlap).
- **Impact:** downside simulation: top-customer loss = X ریال/month.
- **Action:** concentration table.

### I-36 Success-rate driver analysis — `DIAGNOSTIC`
- **Q:** what explains an aggregate success change?
- **Compute:** shift-share: within-segment change vs mix shift, across PSP / hour /
  amount-band / merchant («۶۲٪ افت ناشی از جابه‌جایی ترافیک به مسیر پرریسک است»).
- **Action:** contribution table with each driver's share.

---

## P1 — stretch (built only after P0 is solid)

| ID | Type | One-liner | Feasibility note |
|---|---|---|---|
| I-10 | OPPORTUNITY | repeat-customer rate vs cohort; «۱۲٪ دوباره پرداخت می‌کنند اما ۳٫۴× درآمد» | success-conditioned; same-merchant keys only |
| I-12 | BEHAVIOR | top-decile customers: revenue share, repeat rate, what they share | strong demo; card keys merchant-scoped |
| I-13 | RISK | customer revenue concentration (top 1/5/10 %) | card-level, merchant scope only |
| I-15 | OPPORTUNITY | hour-of-day conversion gaps (00:00 45.4 % vs 20:00 52.8 %) | mix-adjust |
| I-16 | SEASONAL | weekday volume/success patterns | 26 weekly cycles → solid |
| I-17 | SEASONAL | Nowruz window (Esfand 20–1) vs baseline; labeled single-event | one observation, honest label |
| I-21 | RISK | PSP concentration + degradation simulation (−10 pp on top PSP → ریال) | strong |
| I-22 | OPPORTUNITY | reroute opportunity: better PSP already used on comparable traffic | merges with I-05 impact |
| I-23 | DIAGNOSTIC | response-code concentration in a failure segment | eligible pop = 57,593 rows; group by full `PSP-xx:code` [G n2]; **no dictionary** → show codes, never invented meanings |
| I-24 | ANOMALY | p95 init/verify latency degradation (robust percentiles) | verify: success-only; both are PSP API times [G n5] |
| I-26 | BEHAVIOR | failure→retry→convert vs abandon funnel | dense try_seq; 62,409 InBank-in-Verified = recovery evidence |
| I-28 | DIAGNOSTIC | volume/value mismatch screen (session share vs revenue share) | demo fact ready |
| I-29 | TREND | avg successful amount shift; growth = count vs value | — |
| I-30 | OPPORTUNITY | amount-band success gap (top-decile values often worse) | check high-value bands |
| I-40 | DIAGNOSTIC | unverified captures (`Paid`): 8,706 sessions / 116.6 B IRR portfolio-wide, 2.21 % of revenue from 0.42 % of sessions; avg 2.6× amount; 8,705/8,706 `verify_type=Automated` | operator-facing (automated-flow anomaly); high-value skew makes it material despite small n |

(I-19 top-quartile gap is folded into I-18; I-34 mix-adjustment is the *method*, not a
separate insight — it powers I-04/I-05/I-15/I-30.)

## P2 — analytical-depth showpieces (time permitting)

| ID | One-liner |
|---|---|
| I-35 | merchant-adjusted performance index (observed/expected ≈ 1.00) → health score |
| I-37 | structural break detection (Jun drop onset localization) |
| I-38 | association discovery (amount↔success, latency↔success, PSP↔code) as hypothesis cards |
| I-39 | explicit hypothesis test view: H₀/H₁, test, effect size, verdict — the rubric's own words |

## Explicitly infeasible (kept visible in Methodology — honesty is a feature)

| ID | Why dead |
|---|---|
| I-09 new-vs-returning *success-rate* comparison | cards exist only on successful sessions ([G n3]: card data returns only when the bank completes the payment) — comparison population undefined |
| cross-merchant customer identity/journeys | card keys are aliases unique per merchant [G n4] — one card at two merchants is two keys |
| refund/reversal analytics | 1 Reversed row in 2.2 M |
| YoY seasonality | 6-month window |
| response-code semantic labeling | no code dictionary provided [G n2] — codes surface as-is |

## Composition pattern (the differentiator)

Detectors emit atomic insights; a **composer** merges atoms sharing a segment into one
card: success ↓ (I-03) ∩ PSP-08 (I-05) ∩ evening hours (I-15) ∩ merchant M31 (I-06) ∩
retry ↑ (I-07) ∩ response code X (I-23) → one insight: «افت موفقیت در ترافیک شبانه M31
از طریق PSP-08؛ برآورد ماهانه ۸۶M ریال». Composer runs after ranking; merged atoms stay
inspectable as the card's evidence chain.
