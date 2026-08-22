# ADR-0001: Product thesis — an insight engine, not a dashboard

## Status
Accepted 2026-08-21

## Context
challenge.md L5–18: merchants don't use their transaction data; the product must turn the
dataset into *actionable* insights with specific numbers and actions (L15), traceable
(L16), understandable by nontechnical merchants (L17). Judging: actionability/originality
90 pts + analytical depth 60 pts dwarf chart-oriented UX.

User brainstorm (2026-08-21, local://paste-1.md) converged on: don't build "ZarinPal
Analytics", build **"ZarinPal Insights"** — an automated system that finds the most
important changes/opportunities/risks/anomalies, quantifies business impact, explains the
evidence, and recommends next actions. External products (GA, Search Console, Clarity,
Shopify, Stripe, Amplitude) all moved the same direction (docs/research/2026-08-21-insight-patterns-research.md).

## Decision
The product's primary surface is a ranked **Insights feed**; dashboards/explore pages are
its evidence layer. Information architecture:

```
Insights        ← primary product (feed + investigate flows)
Overview        ← top-3 changes since last period (GA "generated insights" pattern)
Explore         ← Sales · Customers · Payments · Benchmarks (evidence layer)
Methodology     ← eligibility rules, fee-multiplier caveats, dataset facts
```

Every insight object follows: **What happened → Why → Impact → Evidence → Action**.

Insight/Recommendation/Action are distinct concepts: insight = what the data says;
recommendation = what to consider; action = an operation in the product (open the filtered
segment, view calculation).

## Consequences
- UI renders one Insight contract (CONTRACTS.md) instead of bespoke widgets per feature.
- Charts are demoted to evidence views; a chart with no insight sentence is not a feature.
- Ranking (impact × confidence × urgency × actionability) is a product subsystem, not UI
  cosmetics.
- The demo narrative writes itself: land on ranked insights → investigate one end-to-end →
  show the calculation → show the methodology.
