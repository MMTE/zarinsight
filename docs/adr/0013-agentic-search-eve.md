# ADR-0013: Agentic search for the eve analyst — knowledge corpus + insight retrieval

## Status
Accepted 2026-08-22 · Extends ADR-0011 (eve analyst) and ADR-0004 (numbers only from the engine)

## Context
The Task-7 agent answers from the ranked insight feed and metric queries. Two gaps
vs. the liara-proven agentic pattern (`eve@0.42`, deployed and working):

1. **Knowledge is unreachable.** Methodology, eligibility rules, the insight catalog
   with feasibility verdicts, and the official data-guide semantics live in `docs/`.
   When a merchant asks «چرا تحلیل بازگشت مشتری جدید/قدیم وجود ندارد؟», the agent has
   no grounded source — it either guesses or refuses. Liara solved this with
   BM25 retrieval over a chunked corpus + `search_docs`/`read_doc` tools +
   cite-the-deep-link instructions.
2. **Insight discovery is rank-ordered only.** `get_insights` returns top-N by
   `rank_score`. Topical questions («کجا پول از دست رفته؟», «وضعیت PSP-08؟») can't
   reach relevant insights that sit below the top of the feed.

ADR-0011 already names the model-selection pattern (`CHAT_PROVIDER` over
OpenAI-compatible gateways, provider fallback chain) — Task 7 shipped only the
`CHAT_MODEL` string shortcut.

## Decision
Port the liara retrieval pattern, adapted to a local corpus (no network fetch):

1. **`src/lib/search/`** — ported primitives, verbatim semantics: Persian
   normalization + tokenization (ZWNJ/ی/ک/digits), Okapi BM25 (k1=1.5, b=0.75),
   Reciprocal Rank Fusion. No embeddings, no external service — retrieval is
   deterministic and offline, in the ADR-0004 spirit.
2. **Knowledge corpus** = the repo's own docs tree (`docs/adr`, `docs/specs`,
   `docs/research`, `docs/INSIGHT-CATALOG.md`, `docs/CONTRACTS.md`; `plans/` and
   demo scripts excluded — internal task lists, not answer material). Chunked by
   headings at first use, in-memory, rebuilt per process start: no committed
   artifact, no staleness, no build step.
3. **Three new read-only tools** (ADR-0011 rules unchanged — no writes, no SQL):
   - `search_knowledge` — BM25 over doc chunks; returns title/path/section
     anchor/snippet and demands citation.
   - `read_knowledge` — full text of one doc by path.
   - `search_insights` — BM25 over published insight payloads
     (title+summary+recommendation+type), merchant-scoped like `get_insights`;
     title hits and body hits RRF-fused. Returns insight ids + deep links.
4. **Grounding rules in `instructions.md`**: methodology/definition/«چرا وجود
   ندارد» questions call `search_knowledge` first and cite sources («منابع»);
   topical discovery calls `search_insights` before `get_insights`. The golden
   rule is unchanged: figures still come only from engine tools — search results
   carry ids and citations, never new numbers.
5. **Model chain** (liara `agent/lib/model-chain` port): `CHAT_PROVIDER` /
   `CHAT_MODEL_CHAIN="provider:model,…"` resolve an ordered
   OpenAI-compatible chain (avalai · liara · openrouter · openai); a failing
   provider is benched 5 min and the next serves. No provider env → keep the
   gateway model string default (judges' zero-config path unchanged).
6. **Skills** `agent/skills/knowledge-search.md` + `insight-hunting.md` teach
   query reformulation (fa/en), when to read full docs, and the
   search→drill→cite loop.

## Alternatives rejected
- **Embeddings + vector store** — needs a key/service and adds nondeterministic
  infra; the corpus is ~100 KB of markdown — BM25 with Persian normalization is
  sufficient (liara ships the semantic channel as *optional* for the same reason).
- **Stuffing methodology into the system prompt** — token cost on every turn and
  no per-claim precision; retrieval keeps citations exact.
- **SQL `LIKE` over insights** — no Persian normalization, no ranking, and it
  would blur the "SegmentFilter is the only query language" boundary.

## Consequences
- Knowledge questions cost 1–2 extra tool calls; acceptable latency for grounded
  answers.
- Corpus freshness = docs tree at process start; docs change only with releases.
- Ask page renders assistant replies as markdown so citations and `/insights/:id`
  deep links are clickable (ReactMarkdown already a dependency).
- Tests (`tests/search.test.mjs`): tokenizer normalization, BM25 ordering, RRF,
  corpus warm-up against the real `docs/` tree, insight search on the fixture DB.
  Digit post-check (Task 7) unchanged — search adds no numeric path.
