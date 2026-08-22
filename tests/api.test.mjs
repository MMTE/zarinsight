// API contract tests (CONTRACTS §5–§7) — spin the express app on an ephemeral port.
// Covers: no-fee leakage (ADR-0006, deep scan), manifest round-trip, insight
// reproducibility (filter count == eligible population), methodology, 404/400 shapes.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createServer } from 'node:http';

const { createApiApp } = await import('../server/index.mts');
const app = createApiApp();
const server = createServer(app);
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

async function get(path) {
  const res = await fetch(base + path);
  return { status: res.status, body: await res.json() };
}

after(() => server.close());

test('datasets: manifest surfaces + active default', async () => {
  const { status, body } = await get('/api/datasets');
  assert.equal(status, 200);
  assert.equal(body.active, 'challenge-2026h1');
  const ds = body.datasets.find((d) => d.id === 'challenge-2026h1');
  assert.equal(ds.provider, 'csv-attempts');
  assert.equal(ds.grain, 'attempt');
  assert.equal(ds.merchantScope, 'portfolio');
  assert.equal(ds.counts.merchants, 343);
});

test('manifest ↔ meta round-trip (ADR-0005 parity surface)', async () => {
  const manifest = JSON.parse(readFileSync(
    join(import.meta.dirname, '../data/datasets/challenge-2026h1/manifest.json'), 'utf8'));
  const { body } = await get('/api/methodology');
  assert.equal(body.counts.count_rows, String(manifest.counts.rows));
  assert.equal(body.counts.count_sessions, String(manifest.counts.sessions));
  assert.equal(body.dataset.provider, manifest.provider);
  assert.ok(body.rules.length >= 5, 'rule table rendered');
});

test('ADR-0006: no absolute adjusted_fee key anywhere in any response', async () => {
  // key-walk (values) — the manifest's availableFields may NAME the column
  // (metadata powering manifest-driven eligibility, ADR-0010); values must not leak.
  for (const path of ['/api/datasets', '/api/overview', '/api/overview?scope=M156',
    '/api/insights?limit=50', '/api/methodology', '/api/merchants',
    '/api/explore/metrics?dim=month&scope=M18', '/api/insights/I-03:M156:2026-04/records']) {
    const body = await (await fetch(base + path)).json();
    const leaked = [];
    const walk = (node, trail) => {
      if (Array.isArray(node)) { node.forEach((x) => walk(x, trail)); return; }
      if (node && typeof node === 'object') {
        for (const [k, v] of Object.entries(node)) {
          if (k === 'adjusted_fee' || k === 'adjustedFee') leaked.push(trail + '.' + k);
          walk(v, trail + '.' + k);
        }
      }
    };
    walk(body, path);
    assert.deepEqual(leaked, [], path + ' leaked fee values');
  }
  const rows = await fetch(base + '/api/insights?limit=5');
  assert.ok(!(await rows.text()).includes('adjusted_fee'));
});

test('insight reproducibility: records total == eligible population (session grain)', async () => {
  const { body } = await get('/api/insights?scope=M156&limit=50');
  const anomaly = body.find((i) => i.detectorId === 'I-03');
  assert.ok(anomaly, 'I-03 published for M156');
  const rec = await get(`/api/insights/${encodeURIComponent(anomaly.id)}/records`);
  assert.equal(rec.status, 200);
  assert.equal(rec.body.total, anomaly.evidence.eligiblePopulation.rows);
  assert.ok(rec.body.rows.length <= 20);
  // rows carry no fee column
  assert.ok(!('adjusted_fee' in (rec.body.rows[0] ?? {})));
});

test('unknown insight → 404 with fa error; bad lifecycle → 400 without write', async () => {
  const miss = await get('/api/insights/nope:1:2');
  assert.equal(miss.status, 404);
  assert.ok(miss.body.error.fa);
  const res = await fetch(`${base}/api/insights/nope:1:2/lifecycle`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ event: 'explode' }),
  });
  assert.equal(res.status, 400);
});

test('overview KPIs match profiling anchors at portfolio scope', async () => {
  const { body } = await get('/api/overview');
  assert.equal(body.kpis.sessions, 2062839);
  assert.equal(body.kpis.revenue, 5165464690799);
  assert.ok(Math.abs(body.kpis.successRate - 0.497205550215) < 1e-9); // 49.72%
  assert.ok(body.top3.length >= 1);
});
