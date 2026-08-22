#!/usr/bin/env node
// Task 7 smoke (plan r2): P0 detectors published, records endpoint consistent,
// methodology + datasets render, digit post-check guards agent replies.
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import { ungroundedFigures } from '../src/lib/engine/digitCheck.ts';
import { createServer } from 'node:http';

const repoRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const { createApiApp } = await import('../server/index.mts');
const server = createServer(createApiApp());
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const get = async (p) => (await fetch(base + p)).json();

// 1) every P0 detector published ≥1
const db = new Database(join(repoRoot, 'data/datasets/challenge-2026h1/db.sqlite'), { readonly: true });
const per = db.prepare('SELECT detector_id, COUNT(*) c FROM insights GROUP BY detector_id').all();
const counts = Object.fromEntries(per.map((r) => [r.detector_id, r.c]));
const required = ['I-01', 'I-02', 'I-03', 'I-04', 'I-05', 'I-06', 'I-07', 'I-08', 'I-11'];
// retuned zero-emitters (see CHANGELOG): must publish non-trivial volumes
const requiredMin = { 'I-14': 15, 'I-18': 15, 'I-27': 10 };
const missing = required.filter((id) => !counts[id]);
const thin = Object.entries(requiredMin).filter(([id, min]) => (counts[id] ?? 0) < min)
  .map(([id, min]) => `${id}<${min}`);
if (missing.length || thin.length) {
  console.error('[smoke] zero/thin detectors:', [...missing, ...thin].join(', '), JSON.stringify(counts));
  process.exit(1);
}
console.log('[smoke] detectors', JSON.stringify(counts));

// 2) records endpoint consistent for the top insight
const insights = await get('/api/insights?limit=5');
const top = insights[0];
const rec = await get(`/api/insights/${encodeURIComponent(top.id)}/records`);
if (rec.total !== top.evidence.eligiblePopulation.rows) {
  console.error('[smoke] records mismatch', rec.total, top.evidence.eligiblePopulation.rows);
  process.exit(1);
}
console.log('[smoke] records consistent for', top.id, '=', rec.total);

// 3) methodology + datasets render
const methodology = await get('/api/methodology');
const datasets = await get('/api/datasets');
if (!methodology.rules?.length || !datasets.datasets?.length) {
  console.error('[smoke] methodology/datasets broken');
  process.exit(1);
}
console.log('[smoke] methodology rules:', methodology.rules.length, '| datasets:', datasets.datasets.length);

// 4) digit post-check: reply figures must exist in the tool payload
const toolPayload = JSON.stringify({ eligibleRows: top.evidence.eligiblePopulation.rows, value: top.metric.value });
const bad = ungroundedFigures(`${top.title} ${top.summary}`, toolPayload + top.title + top.summary);
const good = ungroundedFigures('میزان ۱۲۳۴۵', toolPayload);
if (good.length === 0 || bad.length > 0) {
  console.error('[smoke] digitCheck broken', { good, bad });
  process.exit(1);
}
console.log('[smoke] digit post-check OK (catches', good.length, 'ungrounded figure(s))');

server.close();
db.close();
console.log('[smoke] ALL GREEN');
