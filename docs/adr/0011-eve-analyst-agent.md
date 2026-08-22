# ADR-0011: Agentic layer — eve analyst agent with read-only engine tools

## Status
Accepted 2026-08-22 · Extends ADR-0004 (deterministic engine; LLM never produces figures)

## Context
Spec §4.6 defines an Ask surface: answers grounded in the evidence payload, deterministic
FAQ fallback. A plain prompt endpoint under-delivers vs. what the challenge rewards
(novel analysis, guided investigation) and what we already proved in the liara
challenge with **eve** (`eve@0.42`: `agent/` dir with instructions.md, `defineAgent`,
`defineTool` + zod, channels with auth, durable schedules; app integration via
`/eve/*` reverse proxy — liara `dev.sh`/`gateway-loader.mjs` pattern; model selection
via `CHAT_PROVIDER` env over OpenAI-compatible gateways).

## Decision
Ship an in-product Persian analyst agent **«تحلیلگر بینش»** as an eve agent directory
inside this repo:

```
agent/
  instructions.md      # identity, Persian tone, ADR rules: numbers only from tools
  agent.ts             # defineAgent: model from CHAT_PROVIDER/CHAT_MODEL (liara pattern)
  tools/               # read-only, typed, engine-backed:
    get_insights.ts        # ranked feed / one Insight by id
    query_metric.ts        # SegmentFilter → engine metric (CONTRACTS §2) + eligible n
    explore_dimension.ts   # dim aggregations behind Explore tables
    dataset_facts.ts       # manifest, counts, caveats, infeasible-analyses list
    read_methodology.ts    # rule table prose (same source as the Methodology page)
  channels/eve.ts      # web channel; auth: localDev() + none() for judges
```

Rules:
1. **ADR-0004 boundary is absolute**: every figure in an agent reply comes from a tool
   result (deterministic engine over SQLite). The agent composes prose, chooses tools,
   explains — it never computes. Digit consistency post-check runs on replies that
   contain numbers (Task 7 parity test).
2. **No write tools, no raw SQL tool.** The agent cannot mutate datasets or run
   arbitrary queries; `SegmentFilter` is the only query language it can speak
   (ineligible filters return 400 + ruleId, CONTRACTS §5 — same as the UI).
3. **Dataset/merchant scoping** flows through the same scope context as the UI; the
   agent answers within the active dataset + merchant scope.
4. **Cost guardrails** (liara precedent): `limits.maxInputTokensPerSession`,
   `maxOutputTokensPerSession` in `agent.ts`; no default spend without an env key.
5. **Graceful degradation**: no `CHAT_PROVIDER` key configured → Ask falls back to the
   deterministic FAQ templates from the evidence payload (spec §4.6 unchanged); the
   agent is additive, never load-bearing for the demo video.
6. **Stretch→eve schedules**: daily/weekly digest of newly published insights
   (GA-style custom alerts from the plan's stretch list) becomes an eve
   `schedules/*.md` cron job once Task 9 is green.

## Alternatives rejected
- **Plain /api/explain prompt call** (original Task 7) — kept as the fallback path, but
  no tool grounding, no channel story, weaker rubric fit.
- **Agent with direct DB/SQL access** — violates traceability (numbers must map to
  SegmentFilter + SQL the *UI* can reproduce) and ADR-0004.
- **LangChain-style custom loop** — more code, no durability/channels/schedules; eve is
  already proven in our liara deployment.

## Consequences
- New process child + `/eve/*` proxy (ADR-0009 handles the wiring).
- `agent/tools` import the engine through the same server module the API uses — one
  implementation, two surfaces (no drift).
- Eval story: minimal `evals/` smoke eval (ask → expect tool call + grounded digits)
  added at Task 7; not a judge dependency.
- Security posture: read-only tools + session-scoped auth; API keys (live provider)
  are never exposed to the agent context.
