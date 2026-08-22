# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to Semantic Versioning.

## [Unreleased]

### Added — agentic eve search & insights (ADR-0013, plan Task 10)
- `src/lib/search/` — retrieval primitives ported from the liara deployment:
  Persian normalization/tokenization (ZWNJ, Arabic yeh/kaf, digit folding),
  Okapi BM25, Reciprocal Rank Fusion. Deterministic and offline.
- Knowledge corpus for the eve analyst: `docs/` (ADRs, spec, research,
  INSIGHT-CATALOG, CONTRACTS; plans/demo excluded) chunked by headings
  in-memory at first use, with section anchors and citable deep links.
- Three new read-only agent tools: `search_knowledge`, `read_knowledge`,
  `search_insights` (merchant-scoped BM25 over published insight payloads,
  RRF title/body fusion, `/insights/:id` deep links).
- Agent skills `knowledge-search` and `insight-hunting`; instructions gain
  search-first rules: methodology questions cite «منابع», topical questions
  search insights before the ranked feed. Golden rules unchanged (ADR-0004).
- Provider fallback chain (`agent/lib/model-chain.ts`, liara port):
  `CHAT_PROVIDER` / `CHAT_MODEL_CHAIN` over OpenAI-compatible gateways
  (avalai · liara · openrouter · openai) with 5-minute benching; gateway
  model string remains the zero-config default.
- Ask page renders assistant replies as markdown — citations and
  `/insights/:id` deep links are clickable (desktop + 375 px RTL verified).
- `tests/search.test.mjs` — 5 suites: tokenizer normalization, BM25
  ordering, RRF fusion, corpus warm-up against the real docs tree with
  anchors, insight search with merchant scoping (suite: 30 tests).

### Fixed
- Ask page live-agent path never surfaced a reply (Task 7 regression found
  during ADR-0013 verification): `readReply` parsed a `parts[]` event shape
  eve 0.44 does not emit. Now reads `message.completed{message}` with
  `message.appended{messageDelta}` fallback; per-line NDJSON parse no longer
  throws on truncated tails. Previously every live turn silently degraded to
  the deterministic FAQ fallback.
- `npm run dev` never reached the agent: `eve start` bound its default port
  (:3000) while vite proxies `/eve` to :2319, so the Ask page always showed
  «عامل تحلیلگر در دسترس نیست» and answered from the FAQ fallback. New
  `dev.sh` (liara pattern): build agent → start on :2319 → health-wait →
  vite. `agent:start` now pins `--port 2319 --host 127.0.0.1`; quickstart
  documents the optional provider key.
- Long agentic replies truncated or flipped to the FAQ fallback: `readReply`
  capped the event stream at 200K chars, but tool-using turns emit ~1.4 MB of
  reasoning deltas before the reply — cap raised to 5M and completion is only
  detected on a line-terminated `turn.completed` event (bare-substring breaks
  cut the final message mid-transit).

### Security
- `.env` / `.env.*` gitignored — provider keys never enter the repo.
