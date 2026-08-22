# ADR-0007: Benchmarks & confounder control — cohorts and mix-adjustment

## Status
Accepted 2026-08-21

## Context
challenge.md L36–37: comparison with similar merchants; segmentation; **control for
confounding variables**. Profiling §4: PSP usage correlates with merchant; M250 is 51 % of
sessions but 8 % of revenue — naive league tables are confounded twice (volume
concentration, merchant mix). Brainstorm: naive "PSP-08 is bad" claims are exactly what
loses depth points.

## Decision

**Peer cohorts.** A merchant's benchmark population = same `category_id` × similar monthly
successful-session volume (band by order of magnitude) × similar median amount band
(tunable; ETL computes cohort membership once). Benchmarks report median and top-quartile
of the cohort, never the whole-dataset average.

**Mix adjustment (the default comparison method).** For any segment comparison
(PSP×merchant, hour, amount band):
```
expected_rate(segment) = Σₛ (segment_traffic_share(s) × cohort_rate(s))   // s = merchant (or merchant×amount-band)
gap = observed_rate − expected_rate
```
A PSP is flagged only when its gap survives mix adjustment and the eligible attempt count
clears the sufficiency gate (default n ≥ 1,000 attempts and ≥ 3 merchants contributing —
CONFIG, surfaced in evidence).

**Decomposition for changes.** Revenue changes decompose multiplicatively:
`Δrevenue ≈ Δsessions × Δsuccess_rate × Δavg_successful_amount` plus mix shifts across
merchants/categories/PSP/hour/amount-band (each dimension reports its contribution share).
Success-rate changes additionally decompose into within-segment change vs. mix shift
(shift-share), so "June's drop" is attributed to segments.

**Statistical hygiene.** Rate comparisons report Wilson 95 % intervals; "unusual" =
outside the interval of its baseline (period-over-period or expected-value). No causal
language anywhere: correlation/association only, per challenge honesty rules.

**Known-limitation labels.** Every benchmark insight carries its cohort definition and n;
6-month window means no year-over-year claims; Nowruz effects labeled single-observation.

## Consequences
- The three most judge-visible analyses (PSP ranking, June drop, hour-of-day) each get
  depth: naive number → adjusted number → what changed the conclusion.
- Shift-share and mix-adjustment functions are shared engine utilities with tests — the
  analytical-depth rubric is served by two well-tested primitives used everywhere.
