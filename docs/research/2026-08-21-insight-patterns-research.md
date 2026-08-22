# Insight-Pattern Research — what established products surface (and we adapt)

Date: 2026-08-21 · From the 2026-08-21 brainstorm (local://paste-1.md) · Feeds ADR-0001, INSIGHT-CATALOG.md

## 1. Pattern inventory

| Product | Signature mechanism | What we take |
|---|---|---|
| Google Analytics | **Automated insights** ≠ reporting: anomaly detection + emerging trends; **Generated insights** (2026-02) summarize top changes since last visit incl. seasonality & config changes; **custom insights** = user-defined conditions | The split "insights vs. dashboard"; "top N changes since last visit"; anomaly vs. persistent-trend as separate detection classes |
| Google Search Console | **Recommendations**: optimization opportunities with suggested actions derived from underlying data | Recommendations must be downstream of evidence, never free-floating advice |
| Microsoft Clarity | Auto-detected friction signals (rage clicks, dead clicks, quickbacks, errors, abandonment) **linked to recordings** | Every insight ends in an "Investigate" action that filters to the affected records — the strongest UX pattern for our traceability criterion |
| Shopify | Auto-surfaced sales trends: orders, AOV, returning-customer rate, conversion; **cohort analysis** for repeat purchase | Cohort retention by first-success month; plain-language trend cards for nontechnical merchants |
| Stripe | **Acceptance/decline rates** treated as revenue leakage; payment-method performance; processing time; failed-payment→churn linkage | Payment-success as the merchant's core leak metric; "recoverable revenue" framing for impact estimation |
| Amplitude | Retention cohorts, behavioral cohorts, journeys, **conversion drivers** (behaviors associated with retention) | New-vs-returning value comparison; "what distinguishes your best customers" analysis |

## 2. The common pipeline (all six products converge on it)

```
Data → Detection → Diagnosis → Impact estimation → Recommendation → Evidence
```

Our differentiator per the brainstorm: **payment-native + financially quantified** — every
insight carries a ریال impact estimate and an eligible-population statement, which generic
web-analytics products don't do.

## 3. Insight taxonomy adopted (8 classes)

`ANOMALY` · `TREND` · `OPPORTUNITY` · `RISK` · `BENCHMARK` · `BEHAVIOR` · `DIAGNOSTIC` ·
`SEASONAL`

## 4. Insight quality gate (prevents "Tuesday was 4.2 % above Monday" garbage)

```
candidate → statistically/practically meaningful? → enough eligible data? → impact quantifiable?
                 no → discard                        no → discard              no → lower priority
```

Plus explicit confidence (high/medium/low) from sample size, effect consistency, and
comparison-population quality. Ranking: `priority = impact × confidence × urgency × actionability`.

## 5. Composition is the differentiator

Single detectors are table stakes; the winning pattern chains them:
success ↓ → segment (PSP-08 × evening × high-value) → merchant M31 → retry ↑ → response
code X → **one composed insight with 86M ریال/month impact**, not seven cards.
→ INSIGHT-CATALOG §"composition".

## 6. AI's role (from brainstorm §20)

The deterministic engine owns every number. The LLM is the **explanation & interaction
layer**: it renders an insight object into plain Persian, answers "why?" questions against
the evidence payload, and never produces numeric claims. Deterministic templates are the
fallback when no API key is configured — the product must be fully functional without an
LLM.
