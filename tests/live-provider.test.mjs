// zarinpal-live provider tests — recorded+synthetic fixture shapes (redacted);
// the live spike with the user's real key extends this file (plan Task 8).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mapStatus, normalizeTransaction, listLiveRows } from '../server/providers/zarinpal-live.mjs';
import { buildDataset } from '../scripts/lib/core.mjs';

test('mapStatus: REST vocabulary → canonical', () => {
  assert.equal(mapStatus('SUCCESS'), 'Verified');
  assert.equal(mapStatus('verified'), 'Verified');
  assert.equal(mapStatus('PAID'), 'Paid');
  assert.equal(mapStatus('REVERSED'), 'Reversed');
  assert.equal(mapStatus('FAILED'), 'Failed');
  assert.equal(mapStatus(undefined), 'Failed');
});

test('normalizeTransaction: canonical row + irreducible rows dropped', () => {
  const row = normalizeTransaction(
    { id: 'A12', amount: 250000, status: 'SUCCESS', card_pan: '6037-99**-1234', created_at: '2026-08-01 10:00:00', bank: 'melli' },
    'MYMERCHANT');
  assert.equal(row[0], 'LA12');            // session_key namespace
  assert.equal(row[3], 'MYMERCHANT');
  assert.equal(row[6], 250000);
  assert.equal(row[8], 'Verified');
  assert.equal(row[18], '2026-08-01 10:00:00');
  assert.equal(normalizeTransaction({ amount: 100 }, 'M'), null);   // no id
  assert.equal(normalizeTransaction({ id: 'X' }, 'M'), null);       // no amount
});

test('listLiveRows: pagination stop + fetch injection', async () => {
  const pages = [
    { ok: true, json: async () => ({ data: Array.from({ length: 3 }, (_, i) => ({ id: `p1-${i}`, amount: 1000, status: 'success' })) }) },
    { ok: true, json: async () => ({ data: [{ id: 'p2-0', amount: 2000, status: 'failed' }] }) },
  ];
  let call = 0;
  const rows = await listLiveRows({
    apiKey: 'test-key', merchantKey: 'M', pageSize: 3,
    fetchImpl: async () => pages[Math.min(call++, 1)],
  });
  assert.equal(rows.length, 4);
  assert.equal(rows[3][8], 'Failed');
});

test('live rows build a session-grain dataset with manifest fields', async () => {
  const rows = [
    ['L1', 1, null, 'MY', null, null, 100000, null, 'Verified', 'Verified', null, null, null, 'CARD1', null, null, null, '2026-07-01 10:00:00', '2026-07-01 10:00:00', '2026-07-01 10:00:02', null],
    ['L2', 1, null, 'MY', null, null, 50000, null, 'Failed', 'Failed', '51', null, null, null, null, null, null, '2026-07-02 11:00:00', '2026-07-02 11:00:00', null, null],
  ];
  const { mkdtempSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const dir = mkdtempSync(join(tmpdir(), 'zarinsight-live-'));
  const result = await buildDataset({
    datasetId: 'live-fixture', provider: 'zarinpal-live',
    rows: (async function* () { yield* rows; })(),
    sha256: '', availableFields: ['session_key', 'merchant_key', 'amount', 'session_status'],
    grain: 'session', merchantScope: 'single',
    outDir: join(dir, 'ds'), gates: null,
  });
  assert.equal(result.manifest.grain, 'session');
  assert.equal(result.manifest.merchantScope, 'single');
  assert.equal(result.counts.sessions, 2);
  assert.equal(result.counts.merchants, 1);
});
