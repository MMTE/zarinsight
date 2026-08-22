/**
 * Free-text search over published insights for the eve analyst (ADR-0013).
 * BM25 title pass + body pass, RRF-fused; merchant-scoped like get_insights.
 * Search results carry ids and links — never new figures (ADR-0004).
 */
import type { Database as Db } from 'better-sqlite3';
import { BM25Index } from './bm25.ts';
import { rrfFuse } from './rrf.ts';
import type { Insight } from '../types.ts';

export interface InsightDoc {
  id: string;
  type: string;
  period: string | null;
  title: string;
  summary: string;
  merchant: string | null;
  impactIrr: number | null;
  confidence: string;
  recommendation: string | null;
  deepUrl: string;
}

export interface InsightSearchArgs {
  query: string;
  merchantKey?: string | undefined;
  limit?: number | undefined;
}

interface IndexCache {
  /** `${merchantKey ?? '*'}:${publishedCount}` — rebuild when either shifts */
  key: string;
  docs: Map<string, InsightDoc>;
  title: BM25Index;
  body: BM25Index;
}

interface Row { payload: string }

const cache = new Map<string, IndexCache>();

function buildIndex(db: Db, merchantKey: string | undefined, publishedCount: number): IndexCache {
  const rows = (merchantKey
    ? db.prepare('SELECT payload FROM insights WHERE lifecycle = ? AND scope_key = ?')
      .all('published', merchantKey)
    : db.prepare('SELECT payload FROM insights WHERE lifecycle = ?').all('published')
  ) as Row[];
  const docs = new Map<string, InsightDoc>();
  const titleDocs: Array<{ id: string; text: string }> = [];
  const bodyDocs: Array<{ id: string; text: string }> = [];
  for (const r of rows) {
    // Boundary cast: payload column is Insight JSON persisted by runDetectors.
    const i = JSON.parse(r.payload) as Insight;
    const doc: InsightDoc = {
      id: i.id,
      type: i.type,
      period: i.period?.key ?? null,
      title: i.title,
      summary: i.summary ?? '',
      merchant: i.scope?.key ?? null,
      impactIrr: i.impact?.amountIrr ?? null,
      confidence: i.confidence,
      recommendation: i.recommendation?.text ?? null,
      deepUrl: `/insights/${i.id}`,
    };
    docs.set(i.id, doc);
    titleDocs.push({ id: i.id, text: doc.title });
    bodyDocs.push({
      id: i.id,
      text: `${doc.summary} ${doc.recommendation ?? ''} ${i.detectorId} ${doc.type} ${doc.merchant ?? ''}`,
    });
  }
  return {
    key: `${merchantKey ?? '*'}:${publishedCount}`,
    docs,
    title: new BM25Index(titleDocs),
    body: new BM25Index(bodyDocs),
  };
}

function indexFor(db: Db, datasetId: string, merchantKey?: string): IndexCache {
  const cacheKey = `${datasetId}:${merchantKey ?? '*'}`;
  const count = (db.prepare('SELECT COUNT(*) c FROM insights WHERE lifecycle = ?')
    .get('published') as { c: number }).c;
  const hit = cache.get(cacheKey);
  if (hit && hit.key.endsWith(`:${count}`)) return hit;
  const fresh = buildIndex(db, merchantKey, count);
  cache.set(cacheKey, fresh);
  return fresh;
}

export function searchInsights(
  db: Db,
  datasetId: string,
  { query, merchantKey, limit = 8 }: InsightSearchArgs,
): InsightDoc[] {
  const idx = indexFor(db, datasetId, merchantKey);
  const fused = rrfFuse([idx.title.search(query, 20), idx.body.search(query, 20)]);
  return fused.slice(0, limit).flatMap(({ id }) => {
    const d = idx.docs.get(id);
    return d ? [{ ...d, summary: d.summary.slice(0, 200) }] : [];
  });
}
