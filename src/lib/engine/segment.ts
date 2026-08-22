// SegmentFilter → SQL. The single compiler behind every number: metrics, evidence
// drill-downs («محاسبه»), records pagination and agent tools all build predicates
// here, so a number and its reproducible filter can never diverge (CONTRACTS §4).
import type { SegmentFilter } from '../types';

export interface SessionWhere {
  sql: string;          // boolean SQL over alias `s` (fact_session)
  params: Record<string, unknown>;
  needsDateJoin: boolean;
}

const STATUS_SESSION_SQL: Record<string, string> = {
  success: 's.is_success = 1',
  captured_unverified: "s.session_status = 'Paid'",
  failed: "s.session_status = 'Failed'",
  inbank: "EXISTS (SELECT 1 FROM fact_attempt a WHERE a.session_key = s.session_key AND a.try_status = 'InBank')",
  noattempt: 's.n_real_attempts = 0',
};

export function sessionWhere(f: SegmentFilter): SessionWhere {
  const clauses: string[] = [];
  const params: Record<string, unknown> = {};
  let needsDateJoin = false;

  if (!f.dateRange || f.dateRange.length !== 2) {
    throw new Error('SegmentFilter.dateRange is required');
  }
  clauses.push('s.date_id >= @d0 AND s.date_id <= @d1');
  params.d0 = f.dateRange[0];
  params.d1 = f.dateRange[1];

  if (f.merchantKeys?.length) {
    clauses.push(`s.merchant_key IN (${f.merchantKeys.map((_, i) => `@mk${i}`).join(',')})`);
    f.merchantKeys.forEach((m, i) => { params[`mk${i}`] = m; });
  }
  if (f.categoryIds?.length) {
    clauses.push(`s.category_id IN (${f.categoryIds.map((_, i) => `@ci${i}`).join(',')})`);
    f.categoryIds.forEach((c, i) => { params[`ci${i}`] = c; });
  }
  if (f.hourOfDay) {
    clauses.push('s.hour >= @h0 AND s.hour <= @h1');
    params.h0 = f.hourOfDay[0];
    params.h1 = f.hourOfDay[1];
  }
  if (f.weekdays?.length) {
    needsDateJoin = true;
    clauses.push(`d.weekday IN (${f.weekdays.map((_, i) => `@wd${i}`).join(',')})`);
    f.weekdays.forEach((w, i) => { params[`wd${i}`] = w; });
  }
  if (f.amountBand) {
    clauses.push(f.amountBand === 'top10' ? 's.is_top10 = 1' : 's.band = @band');
    if (f.amountBand !== 'top10') params.band = f.amountBand;
  }
  if (f.statuses?.length) {
    clauses.push('(' + f.statuses.map((st) => STATUS_SESSION_SQL[st]).join(' OR ') + ')');
  }
  if (f.cardRepeat === 'returning') clauses.push('s.card_seq >= 2');
  if (f.cardRepeat === 'new') clauses.push('s.card_seq = 1');
  if (f.pspCodes?.length) {
    clauses.push(`EXISTS (SELECT 1 FROM fact_attempt ap WHERE ap.session_key = s.session_key
      AND ap.psp_code IN (${f.pspCodes.map((_, i) => `@ps${i}`).join(',')}))`);
    f.pspCodes.forEach((p, i) => { params[`ps${i}`] = p; });
  }
  if (f.responseCodes?.length) {
    clauses.push(`EXISTS (SELECT 1 FROM fact_attempt ac WHERE ac.session_key = s.session_key
      AND ac.switch_response_code IN (${f.responseCodes.map((_, i) => `@rc${i}`).join(',')}))`);
    f.responseCodes.forEach((c, i) => { params[`rc${i}`] = c; });
  }
  return { sql: clauses.join('\n  AND '), params, needsDateJoin };
}

export function sessionFrom(w: SessionWhere): string {
  return w.needsDateJoin
    ? 'fact_session s JOIN dim_date d ON d.date_id = s.date_id'
    : 'fact_session s';
}

/** Attempt-grain predicate: joins attempts to their session for session-level fields. */
export function attemptWhere(f: SegmentFilter): { sql: string; params: Record<string, unknown> } {
  const clauses: string[] = [];
  const params: Record<string, unknown> = {};
  const sw = sessionWhere(f);
  // reuse session predicates verbatim (they reference s.*)
  clauses.push(sw.sql.replace(/\bs\./g, 's.').replace(/\bd\./g, 'd.'));
  Object.assign(params, sw.params);
  if (f.pspCodes?.length) {
    // at attempt grain the EXISTS would be wrong — filter on the row's own psp
    clauses.push(`a.psp_code IN (${f.pspCodes.map((_, i) => `@ap${i}`).join(',')})`);
    f.pspCodes.forEach((p, i) => { params[`ap${i}`] = p; });
  }
  if (f.responseCodes?.length) {
    clauses.push(`a.switch_response_code IN (${f.responseCodes.map((_, i) => `@ac${i}`).join(',')})`);
    f.responseCodes.forEach((c, i) => { params[`ac${i}`] = c; });
  }
  if (f.statuses?.length) {
    const attemptStatus: Record<string, string> = {
      success: "a.try_status = 'Verified'",
      captured_unverified: "a.try_status = 'Paid'",
      failed: "a.try_status = 'Failed'",
      inbank: "a.try_status = 'InBank'",
      noattempt: "a.try_status = 'NoAttempt'",
    };
    clauses.push('(' + f.statuses.map((st) => attemptStatus[st]).join(' OR ') + ')');
  }
  return { sql: clauses.join('\n  AND '), params };
}

export function attemptFrom(): string {
  return 'fact_attempt a JOIN fact_session s ON s.session_key = a.session_key '
    + 'JOIN dim_date d ON d.date_id = s.date_id';
}
