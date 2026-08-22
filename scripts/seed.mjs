#!/usr/bin/env node
// Decompress the committed seed into the demo dataset dir (ADR-0005 judge quickstart).
// The seed ships as split gzip parts data/seed.db.gz.000… (each <100 MB, ADR-0012);
// each part is an independent gzip stream, restored in order (byte-for-byte verified).
import { createReadStream, existsSync, createWriteStream, readdirSync } from 'node:fs';
import { mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createGunzip } from 'node:zlib';

const repoRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const dataDir = join(repoRoot, 'data');
const outDir = join(dataDir, 'datasets', 'challenge-2026h1');
const outPath = join(outDir, 'db.sqlite');

function seedSources() {
  const single = join(dataDir, 'seed.db.gz');
  if (existsSync(single)) return [single];
  const parts = readdirSync(dataDir)
    .filter((f) => /^seed\.db\.gz\.\d+$/.test(f))
    .sort()
    .map((f) => join(dataDir, f));
  return parts.length ? parts : null;
}

const sources = seedSources();
if (!sources) {
  console.error('seed parts missing (data/seed.db.gz.*) — run `npm run data:build` '
    + 'with the CSV, or re-clone the repo.');
  process.exit(2);
}
mkdirSync(outDir, { recursive: true });

const ws = createWriteStream(outPath);
for (const src of sources) {
  const decoded = createReadStream(src).pipe(createGunzip());
  for await (const chunk of decoded) {
    if (!ws.write(chunk)) await new Promise((r) => ws.once('drain', r));
  }
}
await new Promise((r) => ws.end(r));
console.log(`[seed] ${outPath} from ${sources.length} part(s)`);
