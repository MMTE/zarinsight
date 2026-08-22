# ADR-0005: Tech stack — Next.js + SQLite, zero external services

## Status
Accepted 2026-08-21

## Context
Challenge L18: "genuinely runnable and quick for judges to set up and inspect"; L69–70
technical quality 30 pts (architecture, setup). Dataset is static, so the whole analytical
surface can be precomputed. Team precedent: liara challenge shipped the same shape
successfully (Next.js App Router, single deployable).

## Decision
Single **Next.js (App Router, TypeScript)** app, server components + route handlers, no
external services:

| Concern | Choice | Why |
|---|---|---|
| Data store | SQLite via `better-sqlite3` (sync, read-only at runtime) | file-based, committed seed, ms-fast agg queries |
| ETL | Node script, streaming (`csv-parse`), builds `data/zarinsight.db` | one command, deterministic |
| Charts | Recharts (evidence views only) | light, RTL-tolerant; charts never primary |
| Styling | Tailwind CSS v4 | fast, consistent RTL |
| Font | Vazirmatn woff2, bundled locally | no CDN at runtime (Iran-safe) |
| LLM (optional) | OpenAI-compatible chat endpoint via env (base URL + key + model) | provider-agnostic; works with any gateway judges have |
| Tests | `node:test` on the engine (detectors, eligibility, ranking) | correctness rubric |
| Direction | `dir="rtl"`, `lang="fa"` root; Persian-first copy | nontechnical-UX rubric |

Judge quickstart contract (README must honor it):
`git clone && npm i && npm run seed` (decompress committed `data/seed.db.gz`) `&& npm run
dev` — under 2 minutes, no CSV, no keys, no DB server. `npm run data:build` regenerates
the DB from the CSV when supplied.

Deployment target: any Node host (Liara/Vercel/local). Static-friendly: all pages are
server-rendered from precomputed data; only the optional chat is dynamic.

## Alternatives rejected
- Python/Streamlit or Dash — weaker RTL/mobile story, slower judges' setup, poor "product"
  feel vs a real web app.
- Client-side DuckDB-WASM — 473 MB payload or heavy preprocessing; worse traceability
  story.

## Consequences
- One repo, one process, one file DB — minimal failure surface for judges.
- better-sqlite3 is a native module: pin Node version in README/engines; prebuilt
  binaries cover macOS/Linux.
- Seed DB (compressed, <100 MB) is a committed artifact; ETL and seed must produce
  identical insight output (checked by a parity test).
