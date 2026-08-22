# ADR-0012: Seed packaging — split gzip parts under the 100 MB GitHub limit

## Status
Accepted 2026-08-22 · Resolves the Task-1 risk pre-mitigated in the plan r2 risk table.

## Context
`data/datasets/challenge-2026h1/db.sqlite` is 691 MB (2.21 M attempts, 2.06 M sessions,
dims + 5 aggregates + eligibility views). `gzip -9` yields 169 MB — above GitHub's
100 MB-per-file hard limit, so a single `seed.db.gz` cannot ship in-repo (ADR-0002/0005
promise: judges clone and run with no CSV).

## Decision
Ship the seed as **split gzip parts** `data/seed.db.gz.000 … .007` (each ≤25 MB actual,
bounded by 90 MB split size). Each part is an independent gzip member; `scripts/seed.mjs`
streams them in lexical order through gunzip into the dataset dir — byte-for-byte
restoration is verified (cmp against the ETL output). A legacy single-file
`data/seed.db.gz` is still accepted when present.

## Alternatives rejected
- **Slimmer fact schema** (drop `try_created_at`/`verified_at`/`settled_at`, intern
  status strings) — risks the «محاسبه» traceability contract and ETL parity for a
  packaging problem; saves maybe 30 % raw, not the required 41 %.
- **Git LFS** — judges' clone then depends on LFS availability; worse quickstart story.
- **Ship aggregates only, rebuild facts from CSV** — breaks the no-CSV promise.
- **zstd/xz single file** — still >100 MB at these ratios; adds a non-stdlib dependency.

## Consequences
- Repo carries ~172 MB of parts; clone weight is the cost of the no-CSV quickstart.
- `npm run seed` output is bit-identical to `npm run data:build` output (Task-7 parity
  test re-verifies insight-level identity).
- If a future schema change shrinks the DB below the limit, collapse back to a single
  `seed.db.gz` — seed.mjs already supports both.
