# Zarinsight Implementation Plan (r2 — 2026-08-22)

> **For agentic workers:** implement task-by-task in order; each task ends green
> (its own verification) and committed with `CHANGELOG.md` updated same-commit. Steps
> use checkbox (`- [ ]`) tracking. Deviations → record in the task's Notes, never
> silently.
>
> r2 changes: stack amended (ADR-0009: Vite + Node API + eve child, not Next.js);
> pluggable datasources + dataset registry (ADR-0010); eve analyst agent (ADR-0011);
> UI tasks re-scoped from "build pages" to "bind landed pages to real data".

**Goal:** ship the Zarinsight insight engine + RTL Persian web app per
`docs/specs/2026-08-21-zarinpal-insights-spec.md` (r2), runnable by judges in <2 min,
with pluggable datasources (challenge CSV + user's live ZarinPal merchant account).

**Canonical references:** ADRs 0001–0011 · INSIGHT-CATALOG.md · CONTRACTS.md (§1–§7) ·
docs/research/2026-08-21-dataset-profiling.md (full-file numbers) · landed UI baseline
in `zarinsight/` (14 routes, mock `src/data/` to be replaced).

**Stack (ADR-0009):** Vite 5 + React 18 + React Router (as landed) · Node API server
(express + better-sqlite3; Vite middleware in dev) · eve agent child proxied at `/eve/*`
· Tailwind v3 · `node:test`. Node ≥20 (dev machine 26).

## Global constraints

- CSV (`other_challenge_data.csv`, 473 MB, **CRLF**) stays gitignored; `data/seed.db.gz`
  committed (<100 MB gate at Task 1). Datasets live under `data/datasets/<id>/`.
- Engine is pure TS over SQLite; **no LLM in any numeric path** (ADR-0004) — the eve
  agent gets figures only via read-only engine tools (ADR-0011).
- No absolute `adjusted_fee` in any API/UI surface (ADR-0006) — contract test at Task 4.
- All merchant-facing numbers merchant-scoped; portfolio scope only in operator views;
  eligibility is manifest-driven per dataset (ADR-0003/0010).
- Every task: tests green → `CHANGELOG.md` entry → commit citing ADR/catalog IDs.

## Tasks

### Task 0 — Scaffold ✅ done 2026-08-22 (commits 142a172…88b2ec6)
- [x] Vite + React Router + Tailwind app; 14 spec routes; official DS vendored;
      browser-verified desktop + 375 px RTL.
- **Deviation (accepted):** Vite instead of Next.js; Tailwind v3 instead of v4 →
  ADR-0009.

### Task 1 — ETL core + csv-attempts provider + registry (`zarinsight/scripts/`)
Shared core: canonical model (ADR-0002), manifest write, eligibility views (ADR-0003),
`csv-attempts` provider streaming the CSV (CRLF-safe, quoted-Persian-titles-safe).
- [ ] `scripts/etl.mjs` (+ `scripts/lib/core.mjs`, `scripts/lib/provider-csv.mjs`):
      staging-DB session reduction, constancy/quarantine, try_seq density assert,
      dims (Jalali via Intl, weekday, Nowruz flag), aggs (daily/hourly/psp_merchant/
      amount_band incl. q1–q4+top10, cohort membership), `meta` + manifest.
- [ ] Hard gates on full CSV: 2,213,289 rows / 2,062,839 sessions / 343 merchants /
      8 PSPs / 5 categories (profiling §1) — else exit 1 (`--no-gates` for fixtures).
- [ ] Fixture unit tests (`node --test tests/`): multi-attempt session, NoAttempt row,
      Paid session, success-only fields, Persian comma in quoted title, quarantine
      (amount mismatch, try_seq gap), Jalali date check, band/cohort membership.
- [ ] `npm run data:build` (CSV discovery: `../other_challenge_data.csv`, repo root,
      `ZARINSIGHT_CSV`), `npm run seed` (gunzip), `npm test`.
- [ ] `data/datasets/challenge-2026h1/` + `data/seed.db.gz` (`gzip -9`); record size
      (<100 MB; fallback per plan risk table); update `zarinsight/.gitignore`
      (`data/*` except seed).

### Task 2 — Metrics + analytics primitives (`src/lib/engine/`)
- [ ] `metrics.ts` (CONTRACTS §2 ids) + `wilson.ts`, `shiftShare.ts`, `mixAdjust.ts`,
      `decompose.ts` with unit tests on hand-computed fixtures.
- [ ] `cohorts.ts` (category × volume band × amount band); benchmark medians/quartiles;
      external-reference-population mode (ADR-0010) as a flagged variant.
- [ ] F-01…F-04 impact formulas, capped as specified.
- [ ] `src/lib/types.ts` from CONTRACTS §1/§4/§7 (drift check test).

### Task 3 — Detector framework + P0 detectors (12)
- [ ] `detector.ts` runner: candidates → quality gate (meaningfulness n/CI, sufficiency
      n≥1000 / ≥3 merchants) → rank (impact × confidence × urgency × actionability)
      → persist to `insights` + lifecycle events; skips analyses whose required fields
      are absent from the active manifest (ADR-0010).
- [ ] I-01, I-02, I-03, I-04, I-05, I-06, I-07, I-08, I-14, I-18, I-11, I-27 — each:
      unit test with synthetic agg fixtures; on the real DB each must emit ≥1 published
      insight (June drop, PSP-08, M156 concentration are known-present anchors).
- [ ] Composer (merge atoms sharing a segment; keep evidence chain).

### Task 4 — Node API server + dataset registry (`server/`)
- [ ] express app (CONTRACTS §5–§7): insights/overview/explore/benchmarks/methodology/
      records (pagination cap 200) / datasets (+activate) / explain fallback; mounted
      as Vite middleware in dev, standalone `npm start` in prod; `/eve/*` proxy hook.
- [ ] Contract tests: ineligible filter → 400 with ruleId; no `adjusted_fee` key
      anywhere in any response (deep scan); insight reproducibility (filter count ==
      metric n); manifest round-trip into `meta`.

### Task 5 — UI binding pass 1 (real data behind core pages)
- [ ] API client (`src/lib/api.ts`) + swap mock `src/data/{overview,insights}.ts` →
      live endpoints; merchant switcher populated from `dim_merchant` (343, search);
      period selector → dateRange; «بررسی»/«محاسبه» actions wired.
- [ ] Browser-verified desktop + 375 px (RTL); loading/empty states from DS.

### Task 6 — UI binding pass 2 (domain pages + honesty surfaces)
- [ ] Sales/Customers/Payments/Benchmarks/Explore/DataQuality/Methodology/Panel bound
      to real endpoints; cell→SegmentFilter linkage; Methodology + DataQuality render
      per active manifest; dataset switcher (ADR-0010) in top bar.
- [ ] Browser verification both widths.

### Task 7 — eve analyst agent + parity + smoke
- [ ] `agent/` per ADR-0011 (instructions.md fa, agent.ts provider env, 5 read-only
      tools over the engine module, eve channel auth localDev+none); Ask page uses
      `useEveAgent` via `/eve/*` proxy (dev vite.config, prod server proxy);
      `concurrently` in `npm run dev`; FAQ fallback when no key.
- [ ] Digit post-check: replies with numbers must match tool results (test).
- [ ] Parity: seed DB vs fresh ETL → identical insight JSON (hash compare).
- [ ] `scripts/smoke.mjs`: all P0 detectors published ≥1; records endpoint consistent;
      /api/methodology + /api/datasets render.

### Task 8 — zarinpal-live provider (user's merchant account)
- [ ] Mapping spike with the user's real API key against REST v3 report endpoints
      (`report/webserviceTransactions.json`, `purseTransactions.json`); record actual
      response schema → `docs/research/2026-08-22-zarinpal-live-mapping.md`; adapter
      `server/providers/zarinpal-live.ts` + pagination + incremental sync.
- [ ] Connect flow in `/more`: key → session/env (never committed), "sync now",
      dataset appears in switcher as `live-<merchant>`; key handling audited (no key
      in agent context, no client-side storage beyond session).
- [ ] Manifest: `grain: session`, `merchantScope: single`; eligibility rendering for
      missing attempt-grain fields; benchmarks via external-reference mode with caveat
      chip. Unit tests on a recorded+redacted fixture response.

### Task 9 — README + demo script + release
- [ ] README: quickstart contract (clone → i → seed → dev), architecture diagram
      (spec §3 r2), doc map, rubric mapping, roadmap, dataset/provider guide
      (bring-your-own-key), demo-video pass incl. mobile + live-dataset scenario 8.
- [ ] `docs/demo/DEMO-SCRIPT.md` from spec §5; record ≥5-min video.
- [ ] Final: fresh clone in clean dir runs <2 min; vendor `docs/` into the repo for
      judges; tag.

## Stretch (only after Task 9 green)
P1 detectors (I-10…I-30 table), P2 showpieces (I-35…I-39), eve schedules daily digest
(GA-style alerts, ADR-0011 §6), operator persona extras (I-32/I-33).

## Risks / pre-mitigations

| Risk | Mitigation |
|---|---|
| seed.db.gz >100 MB | measure at Task 1; fallback = per-table gz or slimmer fact schema → ADR-0012 if needed |
| REST v3 docs thin/stale; live schema drift | Task 8 spike against real key first; adapter logs unmapped fields; recorded fixture tests |
| eve child + vite orchestration friction | `concurrently` + health-wait in dev script; liara dev.sh precedent |
| better-sqlite3 native on judge machines | prebuilt binaries darwin/linux; Node pinned in `engines` |
| Recharts RTL quirks | evidence-only charts; fallback hand-rolled SVG sparklines |
| Live dataset lacks attempt grain | manifest-driven eligibility (ADR-0010) — degraded features labeled, never broken |
