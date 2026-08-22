// Detector runner: atoms → quality gate → rank → persist (+ composer merge).
// ADR-0004 (deterministic), catalog "Composition pattern", CONTRACTS §1 Insight.
import type Database from 'better-sqlite3';
import type {
  Insight, InsightAction, MetricReading, Comparison, DiagnosisStep, Impact,
  SegmentFilter, InsightType, Confidence, DatasetManifest,
} from '../types.ts';
import { wilsonInterval } from './wilson.ts';

export interface DetectorContext {
  db: Database.Database;
  manifest: DatasetManifest;
  months: Array<{ key: string; start: string; end: string }>;
  weeks: Array<{ key: string; start: string; end: string }>;
}

/** A detector's candidate output before gating/ranking. */
export interface Atom {
  detectorId: string;
  type: InsightType;
  scopeKey: string;                         // merchant key | 'portfolio'
  periodKey: string;
  periodStart: string;
  periodEnd: string;
  metric: MetricReading;
  filter: SegmentFilter;                    // reproduces the number
  eligibleRows: number;
  ruleId: string;
  caveats?: string[];
  comparison?: Comparison;
  diagnosis?: DiagnosisStep[];
  impact?: Impact;
  n: number;                                // population behind the headline number
  title: string;
  summary: string;
  recommendation: string;
  actions?: InsightAction[];
  urgency: number;                          // 0..1 (runner multiplies)
  actionability: number;                    // 0..1
  mergeKey?: string;                        // composer: atoms sharing scope+period merge
}

export const GATE = { MIN_N: 1000, MIN_MERCHANTS: 3, PSP_ARM_N: 500, GAP_PP: 3 };

/** Wilson-width confidence for rates; deviation-based for absolute metrics. */
export function rateConfidence(successes: number, n: number): Confidence {
  if (!n) return 'low';
  const [lo, hi] = wilsonInterval(successes, n);
  const widthPp = (hi - lo) * 100;
  if (widthPp <= 5) return 'high';
  if (widthPp <= 10) return 'medium';
  return 'low';
}

function rankScore(a: Atom, confidence: Confidence): number {
  const impactNorm = a.impact ? Math.log10(1 + Math.abs(a.impact.amountIrr)) / 12 : 0.15;
  const conf = confidence === 'high' ? 1 : confidence === 'medium' ? 0.6 : 0.3;
  return Number((impactNorm * conf * a.urgency * a.actionability).toFixed(6));
}

function atomToInsight(a: Atom, confidence: Confidence, score: number,
  composedFrom: string[] | undefined): Insight {
  return {
    id: `${a.detectorId}:${a.scopeKey}:${a.periodKey}`,
    detectorId: a.detectorId,
    type: a.type,
    scope: { type: a.scopeKey === 'portfolio' ? 'portfolio' : 'merchant', key: a.scopeKey },
    period: { key: a.periodKey, start: a.periodStart, end: a.periodEnd },
    title: a.title,
    summary: a.summary,
    metric: a.metric,
    ...(a.comparison ? { comparison: a.comparison } : {}),
    ...(a.diagnosis ? { diagnosis: a.diagnosis } : {}),
    ...(a.impact ? { impact: a.impact } : {}),
    confidence,
    evidence: {
      eligiblePopulation: { rows: a.eligibleRows, sessions: a.n, ruleId: a.ruleId },
      filter: a.filter,
      sql: `-- ${a.detectorId} over ${JSON.stringify(a.filter)}`,
      dataCaveats: a.caveats ?? [],
    },
    recommendation: { text: a.recommendation, basis: `${a.detectorId}+evidence` },
    actions: a.actions ?? [{ kind: 'investigate', label: 'بررسی', target: a.filter }],
    ...(composedFrom ? { composedFrom } : {}),
    lifecycle: 'published',
    rankScore: score,
  };
}

/**
 * Gate → rank → compose → persist. Deterministic: same DB + manifests → same rows.
 * Returns persisted insights sorted by rankScore desc.
 */
export function runDetectors(ctx: DetectorContext, detectors: Array<(c: DetectorContext) => Atom[]>): Insight[] {
  const all: Atom[] = [];
  for (const det of detectors) all.push(...det(ctx));

  // gate: sufficient population per atom (merchant scope n, portfolio >= MIN_MERCHANTS)
  const gated = all.filter((a) =>
    a.scopeKey === 'portfolio' ? a.n >= GATE.MIN_MERCHANTS : a.n >= GATE.MIN_N);

  // rank
  const scored = gated
    .map((a) => {
      // rate metrics carry successes in metric.value*? — detectors pass n + rate n via
      // eligibleRows; confidence uses successes when available (metric.previousValue trick avoided)
      const conf = a.metric.unit === 'rate'
        ? rateConfidence(Math.round(a.metric.value * a.n), a.n)
        : (a.n >= 5000 ? 'high' : a.n >= 1000 ? 'medium' : 'low');
      return { atom: a, confidence: conf, score: rankScore(a, conf) };
    })
    .sort((x, y) => y.score - x.score || x.atom.detectorId.localeCompare(y.atom.detectorId));

  // compose: primary atoms absorb same-scope/period diagnostic atoms sharing a mergeKey
  const byKey = new Map<string, { atom: Atom; confidence: Confidence; score: number; composed: string[] }>();
  for (const s of scored) {
    const key = s.atom.mergeKey ?? `${s.atom.detectorId}|${s.atom.scopeKey}|${s.atom.periodKey}`;
    const existing = byKey.get(key);
    if (existing && s.atom.type === 'diagnostic') {
      existing.composed.push(`${s.atom.detectorId}:${s.atom.scopeKey}:${s.atom.periodKey}`);
      existing.atom.diagnosis = [...(existing.atom.diagnosis ?? []), ...(s.atom.diagnosis ?? [])];
    } else if (!existing) {
      byKey.set(key, { ...s, composed: [] });
    }
  }

  const insights = [...byKey.values()].map(({ atom, confidence, score, composed }) =>
    atomToInsight(atom, confidence, score, composed.length ? composed : undefined));

  // persist (idempotent per id: replace)
  const tx = ctx.db.transaction(() => {
    const del = ctx.db.prepare('DELETE FROM insights WHERE id = ?');
    const ins = ctx.db.prepare(`INSERT INTO insights
      (id, detector_id, scope_type, scope_key, period_key, payload, rank_score, lifecycle, created_ms)
      VALUES (?,?,?,?,?,?,?,?,?)`);
    const ev = ctx.db.prepare(
      'INSERT INTO insight_events (insight_id, event, at_ms) VALUES (?,?,?)');
    for (const i of insights) {
      del.run(i.id);
      ins.run(i.id, i.detectorId, i.scope.type, i.scope.key, i.period.key,
        JSON.stringify(i), i.rankScore, i.lifecycle, 0);
      ev.run(i.id, 'published', 0);
    }
  });
  tx();
  return insights.sort((a, b) => b.rankScore - a.rankScore);
}
