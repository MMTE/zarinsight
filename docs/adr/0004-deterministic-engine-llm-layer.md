# ADR-0004: Deterministic insight engine; the LLM only explains

## Status
Accepted 2026-08-21

## Context
Challenge L16/L58: every number and claim must be traceable to source and calculation. An
LLM that invents numbers fails the 75-pt correctness criterion and the fee caveat (L23–25).
Brainstorm §20: GA/Stripe-style products compute findings deterministically; AI adds the
conversational explanation layer.

## Decision
Two strictly separated layers:

1. **Insight engine (TypeScript, deterministic, tested).** Detectors consume `agg_*`
   tables, apply the quality gate (meaningfulness → data sufficiency → impact), emit typed
   `Insight` objects (CONTRACTS.md) containing every number, the exact filter, the formula,
   and the eligible population. Insight generation is a pure function of the DB → same
   output every run. No LLM in this path, ever.
2. **Explanation layer (optional LLM).** Renders an Insight into richer plain Persian,
   answers "چرا؟" questions strictly against the insight's evidence payload, and proposes
   recommendation wording drafts. Input = the JSON insight + whitelisted context; output =
   prose only. If numbers appear in prose, they must be copied verbatim from the payload
   (template constraint enforced by prompt + post-check that regex-extracts digits and
   verifies each against the payload). **No API key configured → deterministic Persian
   templates render the same information**; the product is fully functional LLM-optional.

Insight lifecycle recorded in DB: `DETECTED → VALIDATED → RANKED → PUBLISHED → OPENED →
ACTIONED/DISMISSED` (demo shows the funnel; dismissed insights stay inspectable).

## Consequences
- Correctness rubric is defensible line-by-line: every displayed number has a formula and
  a SQL/agg provenance.
- LLM costs are trivial and failure-tolerant; judges without keys lose nothing.
- Free-form "chat with data" is explicitly out of scope — "Investigate" flows are
  parameterized drill-downs over insight evidence instead.
