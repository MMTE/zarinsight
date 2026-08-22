// ETL fixture tests — exercises provider-csv (CRLF, quoted Persian commas, sha256)
// and the shared core (facts, quarantine, dims incl. Jalali, aggs, meta, manifest).
// Run: node --test tests/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path'; // manifest read
import Database from 'better-sqlite3';

import { buildFixtureDb } from './fixture.mjs';

const buildFixture = buildFixtureDb;

test('ETL core: facts, flags, attempt counts', async () => {
  const { dbPath } = await buildFixture();
  const db = new Database(dbPath, { readonly: true });
  try {
    assert.equal(db.prepare('SELECT COUNT(*) c FROM fact_session').get().c, 8);
    assert.equal(db.prepare('SELECT COUNT(*) c FROM fact_attempt').get().c, 12);
    const s1 = db.prepare('SELECT * FROM fact_session WHERE session_key=?').get('S1');
    assert.equal(s1.is_success, 1);
    assert.equal(s1.is_captured, 1);
    assert.equal(s1.n_attempts, 3);
    assert.equal(s1.n_real_attempts, 3);
    assert.equal(s1.date_id, '2026-03-20');
    assert.equal(s1.hour, 23);
    assert.equal(s1.payer_card_key, 'CARD1');
    const s3 = db.prepare('SELECT * FROM fact_session WHERE session_key=?').get('S3');
    assert.equal(s3.is_success, 0);
    assert.equal(s3.n_real_attempts, 0);
    const s4 = db.prepare('SELECT * FROM fact_session WHERE session_key=?').get('S4');
    assert.equal(s4.is_success, 0);      // Paid ≠ success (ADR-0003 / data-guide)
    assert.equal(s4.is_captured, 1);
    // NoAttempt row carries no psp in fact_attempt
    const na = db.prepare(
      `SELECT psp_code, try_status FROM fact_attempt WHERE session_key='S3'`).get();
    assert.equal(na.psp_code, null);
    assert.equal(na.try_status, 'NoAttempt');
  } finally { db.close(); }
});

test('ETL core: quarantine — constancy + try_seq density', async () => {
  const { dbPath } = await buildFixture();
  const db = new Database(dbPath, { readonly: true });
  try {
    const reasons = db.prepare('SELECT session_key, reason FROM etl_quarantine ORDER BY reason')
      .all().map((r) => `${r.session_key}:${r.reason}`);
    assert.ok(reasons.includes('S5:attr_not_constant:amount'), String(reasons));
    assert.ok(reasons.includes('S6:try_seq_not_dense'), String(reasons));
    // quarantined sessions keep first-row values (not dropped)
    const s5 = db.prepare('SELECT amount FROM fact_session WHERE session_key=?').get('S5');
    assert.equal(s5.amount, 70000);
  } finally { db.close(); }
});

test('ETL core: dim_date Jalali (Nowruz) and weekday', async () => {
  const { dbPath } = await buildFixture();
  const db = new Database(dbPath, { readonly: true });
  try {
    const nowruz = db.prepare('SELECT * FROM dim_date WHERE date_id=?').get('2026-03-21');
    assert.equal(nowruz.jalali_year, 1405);
    assert.equal(nowruz.jalali_month, 1);
    assert.equal(nowruz.jalali_day, 1);
    assert.equal(nowruz.weekday, 0);      // Saturday
    assert.equal(nowruz.is_holiday, 1);   // Nowruz
    const jan = db.prepare('SELECT * FROM dim_date WHERE date_id=?').get('2026-01-05');
    assert.equal(jan.is_holiday, 0);      // Monday
    assert.equal(jan.weekday, 2);
  } finally { db.close(); }
});

test('ETL core: aggregates daily / psp_merchant / amount bands / cohorts', async () => {
  const { dbPath } = await buildFixture();
  const db = new Database(dbPath, { readonly: true });
  try {
    const d = db.prepare(
      `SELECT * FROM agg_daily WHERE date_id='2026-03-20' AND merchant_key='M1'`).get();
    assert.equal(d.sessions, 1);          // S1 created 03-20 23:59:59
    assert.equal(d.success, 1);
    assert.equal(d.revenue, 100000);
    assert.equal(d.attempts, 3);
    assert.equal(d.verified_attempts, 1);
    const p = db.prepare(
      `SELECT * FROM agg_psp_merchant WHERE month_id='2026-03' AND psp_code='PSP-02' AND merchant_key='M1'`).get();
    assert.equal(p.attempts, 2);
    assert.equal(p.verified, 1);
    // M1 has 6 sessions → bands q1..q4 (2,2,1,1). top10 needs ≥10 sessions
    // (NTILE(10) yields no 10th group below that) — documented rule, absent here.
    const bands = db.prepare(
      `SELECT band, sessions FROM agg_amount_band WHERE merchant_key='M1' ORDER BY band`).all();
    assert.deepEqual(bands.map((b) => b.band), ['q1', 'q2', 'q3', 'q4']);
    assert.equal(bands.reduce((a, b) => a + b.sessions, 0), 6);
    assert.equal(db.prepare(
      `SELECT COUNT(*) c FROM agg_amount_band WHERE band='top10'`).get().c, 0);
    // cohort membership: each merchant exactly once; ids are category|vol|amt.
    // With only 2 merchants the quartile ranks differ → 2 distinct cohorts.
    const memberships = db.prepare(
      `SELECT cohort_id, merchant_key FROM agg_cohort ORDER BY merchant_key`).all();
    assert.equal(memberships.length, 2);
    assert.deepEqual(memberships.map((m) => m.merchant_key), ['M1', 'M2']);
    for (const m of memberships) assert.match(m.cohort_id, /^48160002\|vol\d\|amt\d$/);
  } finally { db.close(); }
});

test('ETL core: meta + manifest round-trip incl. source sha256', async () => {
  const { dbPath, manifestPath } = await buildFixture();
  const db = new Database(dbPath, { readonly: true });
  try {
    assert.equal(db.prepare(`SELECT value FROM meta WHERE key='count_rows'`).get().value, '12');
    assert.equal(db.prepare(`SELECT value FROM meta WHERE key='count_sessions'`).get().value, '8');
    assert.equal(db.prepare(`SELECT value FROM meta WHERE key='count_merchants'`).get().value, '2');
    assert.equal(db.prepare(`SELECT value FROM meta WHERE key='provider'`).get().value, 'csv-attempts');
    const sha = db.prepare(`SELECT value FROM meta WHERE key='source_sha256'`).get().value;
    assert.match(sha, /^[0-9a-f]{64}$/);
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    assert.equal(manifest.provider, 'csv-attempts');
    assert.equal(manifest.grain, 'attempt');
    assert.equal(manifest.merchantScope, 'portfolio');
    assert.equal(manifest.counts.rows, 12);
    assert.equal(manifest.sourceSha256, sha);
    assert.deepEqual(manifest.dateRange, ['2026-01-05', '2026-03-23']);
    assert.ok(manifest.availableFields.includes('try_seq'));
  } finally { db.close(); }
});

test('ETL core: eligibility views filter correctly', async () => {
  const { dbPath } = await buildFixture();
  const db = new Database(dbPath, { readonly: true });
  try {
    assert.equal(db.prepare('SELECT COUNT(*) c FROM v_success_sessions').get().c, 4);
    assert.equal(db.prepare('SELECT COUNT(*) c FROM v_real_attempts').get().c, 11);
    assert.equal(db.prepare('SELECT COUNT(*) c FROM v_card_customers').get().c, 4);
  } finally { db.close(); }
});

test('ETL core: band + card_seq materialization', async () => {
  const { dbPath } = await buildFixture();
  const db = new Database(dbPath, { readonly: true });
  try {
    // bands assigned for every session; q1..q4 partition M1's 6 sessions
    const nullBands = db.prepare(
      `SELECT COUNT(*) c FROM fact_session WHERE band IS NULL`).get().c;
    assert.equal(nullBands, 0);
    const m1bands = db.prepare(
      `SELECT band, COUNT(*) c FROM fact_session WHERE merchant_key='M1' GROUP BY band ORDER BY band`).all();
    assert.equal(m1bands.reduce((a, b) => a + b.c, 0), 6);
    // card_seq: CARD2 (S2) is its merchant's first success → 1
    const s2 = db.prepare(`SELECT card_seq FROM fact_session WHERE session_key='S2'`).get();
    assert.equal(s2.card_seq, 1);
    // no second success for CARD2 in this fixture → no seq-2 rows
    const seqs = db.prepare(
      `SELECT COUNT(*) c FROM fact_session WHERE card_seq >= 2`).get().c;
    assert.equal(seqs, 0);
  } finally { db.close(); }
});
