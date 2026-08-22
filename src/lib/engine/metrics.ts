// Canonical metrics (CONTRACTS §2) over the canonical model. Every metric declares
// its eligibility rule (ADR-0003) and returns the exact SQL that produced it, so
// evidence.sql == the query run (traceability contract).
import type { MetricId, SegmentFilter } from '../types.ts';
import { sessionWhere, sessionFrom, attemptWhere, attemptFrom } from './segment.ts';

export const RULES = {
  ALL: 'R-ALL',
  SUCCESS: 'R-SUCCESS',            // Verified sessions only
  ATTEMPT: 'R-ATTEMPT',            // real attempts (excl. NoAttempt)
  CARD: 'R-CARD',                  // success-conditioned, same-merchant cards [G n4]
  CODED: 'R-CODED',                // failed/InBank attempts carrying a PSP-namespaced code
  VERIFY_LATENCY: 'R-VERIFY-MS',   // verified attempts, PSP API time [G n5]
  INIT_LATENCY: 'R-INIT-MS',       // attempts with init_time_ms [G n5]
  MERCHANT_SCOPE: 'R-MERCHANT-ONLY',
} as const;

export interface MetricResult {
  name: MetricId;
  value: number;
  n: number;                         // eligible rows behind the number
  ruleId: string;
  sql: string;
  params: Record<string, unknown>;
}

type Row = Record<string, unknown>;
interface Db { prepare(sql: string): { get(...a: unknown[]): Row; all(...a: unknown[]): Row[] } }

function one(db: Db, sql: string, params: Record<string, unknown>): Row {
  return db.prepare(sql).get(params) as Row;
}


/** All session-grain metrics. Returns null for structurally ineligible (no population). */
export function sessionMetrics(db: Db, f: SegmentFilter) {
  const w = sessionWhere(f);
  const from = sessionFrom(w);
  const base = `SELECT
      COUNT(*) AS sessions,
      SUM(s.is_success) AS success,
      SUM(s.session_status = 'Paid') AS paid,
      SUM(s.is_captured) AS captured,
      SUM(s.session_status = 'Failed') AS failed,
      SUM(CASE WHEN s.is_success THEN s.amount ELSE 0 END) AS revenue,
      SUM(CASE WHEN s.session_status = 'Paid' THEN s.amount ELSE 0 END) AS paid_irr,
      SUM(CASE WHEN s.session_status = 'Failed' THEN s.amount ELSE 0 END) AS failed_irr,
      SUM(s.n_attempts > 1) AS retries,
      SUM(s.card_seq = 1) AS card_new,
      SUM(s.card_seq >= 2) AS card_returning
    FROM ${from} WHERE ${w.sql}`;
  const r = one(db, base, w.params);
  const sessions = Number(r.sessions ?? 0);
  return { raw: r, sessions, sql: base, params: w.params };
}

export function computeMetric(db: Db, metric: MetricId, f: SegmentFilter): MetricResult | null {
  const sm = sessionMetrics(db, f);
  

  switch (metric) {
    case 'demand_sessions':
      return { name: metric, value: sm.sessions, n: sm.sessions, ruleId: RULES.ALL,
        sql: `SELECT COUNT(*) AS value FROM ${sessionFrom(sessionWhere(f))} WHERE ${sessionWhere(f).sql}`,
        params: sm.params };
    case 'revenue': {
      if (!Number(sm.raw.success)) return null;
      return { name: metric, value: Number(sm.raw.revenue), n: Number(sm.raw.success),
        ruleId: RULES.SUCCESS, sql: sm.sql, params: sm.params };
    }
    case 'success_rate':
      return { name: metric, value: sm.sessions ? Number(sm.raw.success) / sm.sessions : 0,
        n: sm.sessions, ruleId: RULES.ALL, sql: sm.sql, params: sm.params };
    case 'capture_rate':
      return { name: metric, value: sm.sessions ? Number(sm.raw.captured) / sm.sessions : 0,
        n: sm.sessions, ruleId: RULES.ALL, sql: sm.sql, params: sm.params };
    case 'unverified_capture_rate':
      return { name: metric, value: sm.sessions ? Number(sm.raw.paid) / sm.sessions : 0,
        n: sm.sessions, ruleId: RULES.ALL, sql: sm.sql, params: sm.params };
    case 'unverified_capture_irr':
      return { name: metric, value: Number(sm.raw.paid_irr), n: Number(sm.raw.paid),
        ruleId: RULES.ALL, sql: sm.sql, params: sm.params };
    case 'avg_success_amount':
      return Number(sm.raw.success)
        ? { name: metric, value: Number(sm.raw.revenue) / Number(sm.raw.success), n: Number(sm.raw.success),
            ruleId: RULES.SUCCESS, sql: sm.sql, params: sm.params }
        : null;
    case 'retry_rate':
      return { name: metric, value: sm.sessions ? Number(sm.raw.retries) / sm.sessions : 0,
        n: sm.sessions, ruleId: RULES.ALL, sql: sm.sql, params: sm.params };
    case 'returning_session_share': {
      const denom = Number(sm.raw.card_new) + Number(sm.raw.card_returning);
      return denom ? { name: metric, value: Number(sm.raw.card_returning) / denom, n: denom,
        ruleId: RULES.CARD, sql: sm.sql, params: sm.params } : null;
    }
    case 'fee_index': {
      // ratio only — absolute adjusted_fee never leaves the engine (ADR-0006)
      const w = sessionWhere(f);
      const sql = `SELECT SUM(CASE WHEN s.is_success THEN s.adjusted_fee ELSE 0 END) * 1.0
        / NULLIF(SUM(CASE WHEN s.is_success THEN s.amount ELSE 0 END), 0) AS value,
        SUM(s.is_success) AS n FROM ${sessionFrom(w)} WHERE ${w.sql}`;
      const r = one(db, sql, w.params);
      return r.value != null ? { name: metric, value: Number(r.value), n: Number(r.n),
        ruleId: RULES.SUCCESS, sql, params: w.params } : null;
    }
    case 'repeat_card_rate': {
      const w = sessionWhere(f);
      const sql = `SELECT
        SUM(cards.n >= 2) AS repeat, COUNT(*) AS total FROM (
          SELECT s.payer_card_key, COUNT(*) AS n
          FROM ${sessionFrom(w)} WHERE ${w.sql} AND s.is_success = 1
            AND s.payer_card_key IS NOT NULL
          GROUP BY s.merchant_key, s.payer_card_key) cards`;
      const r = one(db, sql, w.params);
      return Number(r.total) ? { name: metric, value: Number(r.repeat) / Number(r.total), n: Number(r.total),
        ruleId: RULES.CARD, sql, params: w.params } : null;
    }
    case 'attempt_success_rate': {
      const aw = attemptWhere(f);
      const sql = `SELECT SUM(a.try_status = 'Verified') * 1.0
        / NULLIF(SUM(a.try_status <> 'NoAttempt'), 0) AS value,
        SUM(a.try_status <> 'NoAttempt') AS n
        FROM ${attemptFrom()} WHERE ${aw.sql}`;
      const r = one(db, sql, aw.params);
      return r.value != null ? { name: metric, value: Number(r.value), n: Number(r.n),
        ruleId: RULES.ATTEMPT, sql, params: aw.params } : null;
    }
    case 'p95_verify_latency':
      return percentileMetric(db, f, 'a.verify_time_ms', RULES.VERIFY_LATENCY,
        "a.try_status = 'Verified'");
    case 'p95_init_latency':
      return percentileMetric(db, f, 'a.init_time_ms', RULES.INIT_LATENCY,
        'a.init_time_ms IS NOT NULL');
    case 'concentration_top5': {
      const w = sessionWhere(f);
      const sql = `WITH cardrev AS (
          SELECT s.merchant_key, s.payer_card_key, SUM(s.amount) AS rev
          FROM ${sessionFrom(w)} WHERE ${w.sql} AND s.is_success = 1
            AND s.payer_card_key IS NOT NULL
          GROUP BY s.merchant_key, s.payer_card_key),
        ranked AS (SELECT *, ROW_NUMBER() OVER (
          PARTITION BY merchant_key ORDER BY rev DESC, payer_card_key) AS rk FROM cardrev)
        SELECT (SELECT SUM(rev) FROM ranked WHERE rk <= 5) * 1.0
          / NULLIF((SELECT SUM(rev) FROM ranked), 0) AS value,
          (SELECT COUNT(*) FROM ranked) AS n`;
      const r = one(db, sql, w.params);
      return r.value != null ? { name: metric, value: Number(r.value), n: Number(r.n),
        ruleId: RULES.MERCHANT_SCOPE, sql, params: w.params } : null;
    }
    default:
      throw new Error(`metric ${metric} not implemented in computeMetric`);
  }
}

function percentileMetric(db: Db, f: SegmentFilter, col: string, ruleId: string,
  extra: string): MetricResult | null {
  const aw = attemptWhere(f);
  const countSql = `SELECT COUNT(*) AS n FROM ${attemptFrom()} WHERE ${aw.sql} AND (${extra})`;
  const cnt = one(db, countSql, aw.params);
  const n = Number(cnt.n);
  if (!n) return null;
  const idx = Math.floor(0.95 * (n - 1));           // nearest-rank p95, deterministic
  const sql = `SELECT ${col} AS value FROM ${attemptFrom()}
    WHERE ${aw.sql} AND (${extra}) ORDER BY ${col} LIMIT 1 OFFSET ${idx}`;
  const r = one(db, sql, aw.params);
  return { name: col.includes('verify') ? 'p95_verify_latency' : 'p95_init_latency',
    value: Number(r.value), n, ruleId, sql, params: aw.params };
}

