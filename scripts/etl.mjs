#!/usr/bin/env node
// ETL CLI — builds a dataset from a source via a provider (ADR-0009/0010).
// Usage: node scripts/etl.mjs [--csv <path>] [--dataset-id <id>] [--out <dir>] [--no-gates]
// CSV discovery: --csv flag > ZARINSIGHT_CSV env > repo-root/other_challenge_data.csv >
// parent-dir/other_challenge_data.csv.
import { existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDataset } from './lib/core.mjs';
import { listRows, AVAILABLE_FIELDS } from './lib/provider-csv.mjs';

const here = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = resolve(here, '..');

function discoverCsv(flagged) {
  if (flagged) return flagged;
  const candidates = [
    process.env.ZARINSIGHT_CSV,
    join(repoRoot, 'other_challenge_data.csv'),
    join(repoRoot, '..', 'other_challenge_data.csv'),
  ].filter(Boolean);
  for (const c of candidates) if (existsSync(c)) return c;
  console.error('CSV not found. Pass --csv, set ZARINSIGHT_CSV, or place '
    + 'other_challenge_data.csv at the repo root.');
  process.exit(2);
}

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const csvPath = discoverCsv(flag('--csv'));
const datasetId = flag('--dataset-id') ?? 'challenge-2026h1';
const outDir = flag('--out') ?? join(repoRoot, 'data', 'datasets', datasetId);
const gates = args.includes('--no-gates') ? null : undefined; // undefined = defaults

const t0 = Date.now();
console.log(`[etl] csv: ${csvPath} (${(statSync(csvPath).size / 1e6).toFixed(1)} MB)`);
console.log(`[etl] dataset: ${datasetId} → ${outDir}`);

const { rows, sha256 } = listRows({ csvPath });
const { counts, manifest } = await buildDataset({
  datasetId, provider: 'csv-attempts', rows, sha256,
  availableFields: AVAILABLE_FIELDS,
  grain: 'attempt', merchantScope: 'portfolio',
  outDir,
  ...(gates === null ? { gates: null } : {}),
  log: (m) => console.log(`[etl] ${m}`),
});

console.log('[etl] counts:', counts);
console.log(`[etl] done in ${((Date.now() - t0) / 1000).toFixed(1)}s → ${manifest.dateRange.join('…')}`);
