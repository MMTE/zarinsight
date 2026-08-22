# Zarinsight — هوش تجاری پذیرندگان زرین‌پال

An insight engine + RTL Persian web app for ZarinPal merchants: detects the most
important changes, opportunities and risks in payment data, quantifies the ریال
impact, exposes the evidence, and recommends the next action.

**چه شد → چرا → چقدر پول → شواهد → چه کاری** — every insight.

## Quickstart (judges — under 2 minutes)

```bash
git clone <repo> && cd zarinsight
npm install
npm run seed        # decompress the committed dataset (8 gzip parts, ~5s)
npm run agent:build # build the eve analyst agent (optional, ~5s)
npm run agent:start & npx vite   # or: npm run dev
```

Open **http://localhost:5173** — app + API + agent on one origin.
No CSV, no API keys, no DB server. `npm test` runs the full suite (25 tests).

Bring your own data:
- **Another CSV** with the challenge schema: `npm run data:build -- --csv path.csv --dataset-id mydata`
- **Your live ZarinPal merchant account**: صفحهٔ «بیش‌تر» → connect (needs your
  merchant API key; the key is used in-memory only, never stored).

## Architecture

```
datasources (ADR-0010)
  ├─ csv-attempts ── other_challenge_data.csv (2.21M attempts, 343 merchants)
  └─ zarinpal-live ─ api.zarinpal.com/rest/v3 (merchant API key, session grain)
        ▼ canonical rows
  shared ETL core (scripts/) ──▶ data/datasets/<id>/{db.sqlite, manifest.json}
        ▼ agg_* + facts + insights + meta
  src/lib/engine/  12 P0 detectors (gate → rank → persist) · metrics · stats
        ▼ typed Insight[]
  server/ express API (CONTRACTS §5–§7) + dataset registry
        ├──▶ Vite UI (RTL fa, 14 pages) — merchant + dataset switchers
        └──▶ /eve → eve agent «تحلیلگر بینش» (agent/, 8 read-only tools;
            BM25 knowledge corpus over docs/ + insight search — ADR-0013)
```

One-directional: source → provider → ETL → DB → engine → API/agent → UI.
Numbers come only from the deterministic engine (ADR-0004); the LLM writes prose.

## Repo map

| Path | What |
|---|---|
| `src/lib/engine/` | metrics (16 canonical ids), segment compiler, wilson/shift-share/mix-adjust, impact F-01..F-04, cohorts, detector runner + 12 detectors |
| `src/lib/types.ts` | CONTRACTS mirror (Insight, SegmentFilter, manifest) |
| `server/` | API + dataset registry + zarinpal-live provider |
| `agent/` | eve analyst agent (instructions, 8 tools, 2 skills, model chain, channel) |
| `src/lib/search/` | Persian tokenizer, Okapi BM25, RRF, docs knowledge corpus, insight search (ADR-0013) |
| `scripts/` | etl / seed / detect / smoke |
| `tests/` | 30 tests: ETL fixtures, engine math, API contracts, live provider, search |
| `docs/` | vendored project docs (spec, ADRs 0001–0013, contracts, catalog, profiling) |
| `data/seed.db.gz.*` | committed dataset parts (<100MB each, ADR-0012) |

## Honesty rules baked in

- Success = `Verified` only; `Paid` is reported separately as unverified capture.
- `adjusted_fee` is multiplied by a confidential constant — only ratios ever
  leave the engine (ADR-0006, enforced by a contract test).
- Card keys are merchant-scoped; customer analytics stay within one merchant.
- Eligibility rules are manifest-driven per dataset and rendered in روش تحلیل.
- Every insight carries its reproducing `SegmentFilter` + SQL + row sample.

## Rubric mapping

| Criterion | Where |
|---|---|
| Actionability (90) | ranked feed + ریال impact on every card; composition; payment-native detectors (retry friction, mix-adjusted PSP, recoverable revenue) |
| Correctness & traceability (75) | deterministic engine; «محاسبه» view = filter + SQL + rows; fee rule; guide-semantic labeling |
| Analytical depth (60) | decomposition, shift-share drivers, mix-adjusted benchmarks, Wilson intervals, cohort retention |
| Nontechnical UX (45) | Persian sentence-cards, collapsed charts, top-3 changes, guided «بررسی» |
| Technical quality (30) | clone→seed→dev <2min, typed contracts, 25 tests, docs in-repo |

## Roadmap

P1 detectors (INSIGHT-CATALOG), eve digest schedules, live-dataset parity run,
year-over-year when data allows. See `docs/plans/` for the working backlog.
