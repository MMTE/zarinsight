/** Standard Okapi BM25 (k1 = 1.5, b = 0.75) over tokenized docs.
 *  Ported from the liara docs search (ADR-0013). */
import { tokenize } from './persian.ts';

export interface Bm25Doc {
  id: string;
  text: string;
}

export interface Bm25Hit {
  id: string;
  score: number;
}

export class BM25Index {
  k1 = 1.5;
  b = 0.75;
  private docLen = new Map<string, number>();
  private postings = new Map<string, Map<string, number>>();
  N = 0;
  avgdl = 0;

  constructor(docs: Bm25Doc[]) {
    for (const { id, text } of docs) {
      const tokens = tokenize(text);
      this.docLen.set(id, tokens.length);
      const tf = new Map<string, number>();
      for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
      for (const [term, n] of tf) {
        let posting = this.postings.get(term);
        if (!posting) this.postings.set(term, (posting = new Map()));
        posting.set(id, n);
      }
    }
    this.N = this.docLen.size;
    this.avgdl = this.N
      ? [...this.docLen.values()].reduce((a, b) => a + b, 0) / this.N
      : 0;
  }

  /** Hits sorted by descending BM25 score. */
  search(q: string, k = 10): Bm25Hit[] {
    const scores = new Map<string, number>();
    for (const term of new Set(tokenize(q))) {
      const posting = this.postings.get(term);
      if (!posting) continue;
      const df = posting.size;
      const idf = Math.log(1 + (this.N - df + 0.5) / (df + 0.5));
      for (const [id, tf] of posting) {
        const dl = this.docLen.get(id) ?? 0;
        const denom = tf + this.k1 * (1 - this.b + this.b * (dl / (this.avgdl || 1)));
        scores.set(id, (scores.get(id) ?? 0) + (idf * tf * (this.k1 + 1)) / denom);
      }
    }
    return [...scores.entries()]
      .map(([id, score]) => ({ id, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, k);
  }
}
