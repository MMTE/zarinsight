// Engine unit tests on the shared fixture DB — every number hand-computed.
// Run: node --test tests/*.test.mjs  (TS engine loaded via Node type stripping)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import Database from 'better-sqlite3';
import { buildFixtureDb } from './fixture.mjs';
import { computeMetric, RULES } from '../src/lib/engine/metrics.ts';
import { sessionWhere, attemptWhere } from '../src/lib/engine/segment.ts';
import { wilsonInterval, wilsonLower } from '../src/lib/engine/wilson.ts';
import { shiftShare } from '../src/lib/engine/shiftShare.ts';
import { mixAdjust } from '../src/lib/engine/mixAdjust.ts';
import { f01Recoverable, f02Reroute, f03Concentration, f04TrendRunrate } from '../src/lib/engine/impact.ts';
import { benchmark } from '../src/lib/engine/cohorts.ts';

const WINDOW = ['2026-01-01', '2026-03-31'];
const M1 = { dateRange: WINDOW, merchantKeys: ['M1'] };
const ALL = { dateRange: WINDOW };

test('segment: session predicates compile and filter', async () => {
  const { dbPath } = await buildFixtureDb();
  const db = new Database(dbPath, { readonly: true });
  try {
    const w = sessionWhere({ ...M1, amountBand: 'q1', hourOfDay: [0, 12] });
    assert.match(w.sql, /s\.merchant_key IN \(@mk0\)/);
    assert.match(w.sql, /s\.band = @band/);
    assert.match(w.sql, /s\.hour >= @h0/);
    const rows = db.prepare(
      `SELECT COUNT(*) c FROM fact_session s WHERE ${w.sql}`).get(w.params);
    assert.ok(rows.c >= 0);   // compiles + binds

    const aw = attemptWhere({ ...M1, pspCodes: ['PSP-02'], statuses: ['success'] });
    assert.match(aw.sql, /a\.psp_code IN \(@ap0\)/);
    assert.match(aw.sql, /a\.try_status = 'Verified'/);
    const a = db.prepare(`SELECT COUNT(*) c FROM fact_attempt a
      JOIN fact_session s ON s.session_key = a.session_key
      JOIN dim_date d ON d.date_id = s.date_id WHERE ${aw.sql}`)
      .get(aw.params);
    assert.equal(a.c, 1);     // only S1 try 3
  } finally { db.close(); }
});

test('metrics: session-grain ids on M1 (hand-computed)', async () => {
  const { dbPath } = await buildFixtureDb();
  const db = new Database(dbPath, { readonly: true });
  try {
    const m = (id) => computeMetric(db, id, M1);
    assert.equal(m('demand_sessions')?.value, 6);
    assert.equal(m('demand_sessions')?.ruleId, RULES.ALL);
    assert.equal(m('success_rate')?.value, 0.5);               // 3 of 6
    assert.equal(m('revenue')?.value, 380000);                 // 100k+200k+80k
    assert.equal(m('revenue')?.ruleId, RULES.SUCCESS);
    assert.equal(m('revenue')?.n, 3);
    assert.ok(Math.abs((m('avg_success_amount')?.value ?? 0) - 380000 / 3) < 1e-9);
    assert.equal(m('capture_rate')?.value, 4 / 6);             // + Paid S4
    assert.equal(m('unverified_capture_rate')?.value, 1 / 6);
    assert.equal(m('unverified_capture_irr')?.value, 300000);
    assert.equal(m('retry_rate')?.value, 0.5);                 // S1,S5,S6
    assert.equal(m('returning_session_share')?.value, 0);      // all card_seq=1
    assert.equal(m('repeat_card_rate')?.value, 0);
    // fee_index is a RATIO (ADR-0006): 4560/380000
    assert.ok(Math.abs((m('fee_index')?.value ?? 1) - 4560 / 380000) < 1e-12);
    assert.equal(m('fee_index')?.ruleId, RULES.SUCCESS);
    // concentration: 3 cards, all in top-5 → share 1.0
    assert.ok(Math.abs((m('concentration_top5')?.value ?? 0) - 1) < 1e-12);
  } finally { db.close(); }
});

test('metrics: attempt-grain ids on M1 (hand-computed)', async () => {
  const { dbPath } = await buildFixtureDb();
  const db = new Database(dbPath, { readonly: true });
  try {
    const asr = computeMetric(db, 'attempt_success_rate', M1);
    assert.equal(asr?.ruleId, RULES.ATTEMPT);
    assert.ok(Math.abs((asr?.value ?? 1) - 3 / 9) < 1e-12);    // 3 verified of 9 real
    const p95 = computeMetric(db, 'p95_verify_latency', M1);
    assert.equal(p95?.value, 800);                              // [700,800,900] idx1
    assert.equal(p95?.n, 3);
    assert.equal(p95?.ruleId, RULES.VERIFY_LATENCY);
    const p95i = computeMetric(db, 'p95_init_latency', M1);
    assert.equal(p95i?.n, 9);                                   // all real attempts carry init
    // ineligible population → null, not a biased number (ADR-0003)
    assert.equal(computeMetric(db, 'revenue',
      { dateRange: WINDOW, merchantKeys: ['M1'], statuses: ['failed'] }), null);
  } finally { db.close(); }
});

test('wilson: interval brackets the point estimate', () => {
  const [lo, hi] = wilsonInterval(3, 6);
  assert.ok(lo < 0.5 && hi > 0.5);
  assert.ok(Math.abs(hi - lo - 0.618) < 0.01);                  // known width ≈ 0.618
  assert.ok(wilsonLower(0, 0) === 0);
  assert.ok(wilsonLower(5, 10000) > 0 && wilsonLower(5, 10000) < 0.0008);
});

test('shiftShare: mix-only and rate-only decompositions sum exactly', () => {
  // rates constant, volume shifts toward the weak segment → pure mix effect −12pp
  const mixOnly = shiftShare([
    { key: 'P0', volume0: 100, successes0: 50, volume1: 200, successes1: 100 },
    { key: 'P1', volume0: 100, successes0: 90, volume1: 50, successes1: 45 },
  ]);
  assert.ok(Math.abs(mixOnly.mixPp - -12) < 1e-9);
  assert.ok(Math.abs(mixOnly.ratePp) < 1e-9);
  assert.ok(Math.abs(mixOnly.totalPp - -12) < 1e-9);

  // shares constant, one segment improves → pure rate effect +5pp
  const rateOnly = shiftShare([
    { key: 'P0', volume0: 100, successes0: 50, volume1: 100, successes1: 60 },
    { key: 'P1', volume0: 100, successes0: 80, volume1: 100, successes1: 80 },
  ]);
  assert.ok(Math.abs(rateOnly.ratePp - 5) < 1e-9);
  assert.ok(Math.abs(rateOnly.mixPp) < 1e-9);
});

test('mixAdjust: direct standardization narrows the confounded gap', () => {
  const r = mixAdjust([
    { key: 'A', merchantVolume: 80, merchantSuccesses: 40, cohortVolume: 50, cohortSuccesses: 30 },
    { key: 'B', merchantVolume: 20, merchantSuccesses: 18, cohortVolume: 50, cohortSuccesses: 40 },
  ]);
  assert.ok(Math.abs(r.merchantNaive - 0.58) < 1e-12);
  assert.ok(Math.abs(r.cohortNaive - 0.70) < 1e-12);
  assert.ok(Math.abs(r.naiveGapPp - -12) < 1e-9);
  assert.ok(Math.abs(r.merchantAdjusted - 0.64) < 1e-12);       // .8×.6 + .2×.8
  assert.ok(Math.abs(r.adjustedGapPp - -6) < 1e-9);
});

test('impact: F-01..F-04 with caps', () => {
  const f01 = f01Recoverable({ failedAmountIrr: 1_000_000, benchmarkRate: 0.6, observedRate: 0.5, periodDays: 30 });
  assert.equal(f01.amountIrr, 100_000);                          // capped at 10pp
  assert.equal(f01.capPp, 10);
  const f01uncapped = f01Recoverable({ failedAmountIrr: 1_000_000, benchmarkRate: 0.75, observedRate: 0.5, periodDays: 30 });
  assert.equal(f01uncapped.capPp, 10);                           // gap 25pp → capped
  const f01monthly = f01Recoverable({ failedAmountIrr: 500_000, benchmarkRate: 0.5, observedRate: 0.4, periodDays: 60 });
  assert.equal(f01monthly.amountIrr, 25_000);                    // 500k×10%×(30/60)
  assert.equal(f02Reroute({ adjustedGapPp: 3, pspSuccessValueIrr: 10_000_000 }).amountIrr, 300_000);
  assert.equal(f03Concentration(0.4, 10_000_000).amountIrr, 4_000_000);
  assert.equal(f04TrendRunrate(-7, 10_000_000).amountIrr, -700_000);
});

test('cohorts: quality gate — <2 peers yields null', async () => {
  const { dbPath } = await buildFixtureDb();
  const db = new Database(dbPath, { readonly: true });
  try {
    // fixture cohorts split M1/M2 into different cohort ids → no peers → null
    assert.equal(benchmark(db, 'M1', 'success_rate', ALL), null);
  } finally { db.close(); }
});
