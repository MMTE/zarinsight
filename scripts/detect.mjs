#!/usr/bin/env node
// Run all P0 detectors over a built dataset, persisting per-detector (incremental,
// idempotent per insight id). Usage: node scripts/detect.mjs [datasetDir]
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import { runDetectors } from '../src/lib/engine/detector.ts';
import { P0_DETECTORS } from '../src/lib/engine/detectors.ts';

const repoRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const datasetDir = resolve(process.argv[2] ?? join(repoRoot, 'data/datasets/challenge-2026h1'));
const db = new Database(join(datasetDir, 'db.sqlite'));
const manifest = JSON.parse(readFileSync(join(datasetDir, 'manifest.json'), 'utf8'));

const months = db.prepare(`SELECT DISTINCT substr(date_id,1,7) key,
    MIN(date_id) start, MAX(date_id) end FROM fact_session GROUP BY key ORDER BY key`).all();
const weeks = db.prepare(`SELECT DISTINCT strftime('%G-W%V', date_id) key,
    MIN(date_id) start, MAX(date_id) end FROM fact_session GROUP BY key ORDER BY key`).all();
const ctx = { db, manifest, months, weeks };

const perDetector = {};
const missing = [];
for (let i = 0; i < P0_DETECTORS.length; i++) {
  const fn = P0_DETECTORS[i];
  const id = `I-${['01','02','03','04','05','06','07','08','14','18','11','27'][i]}`;
  const t = Date.now();
  try {
    const insights = runDetectors(ctx, [fn]);
    perDetector[id] = insights.length;
    console.log(`[detect] ${id}: ${insights.length} insights (${((Date.now()-t)/1000).toFixed(1)}s)`);
    if (!insights.length) missing.push(id);
  } catch (e) {
    console.error(`[detect] ${id} ERROR: ${e.message}`);
    missing.push(id);
  }
}
const total = Object.values(perDetector).reduce((a, b) => a + b, 0);
console.log(`[detect] ${total} insights persisted from ${manifest.id}`);
if (missing.length) {
  console.error(`[detect] zero-insight detectors: ${missing.join(', ')}`);
}
db.close();
