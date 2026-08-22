// ADR-0013 search layer: Persian normalization, BM25, RRF, knowledge corpus,
// insight search. Run: node --test tests/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import { buildFixtureDb } from './fixture.mjs';
import { normalizeFa, tokenize } from '../src/lib/search/persian.ts';
import { BM25Index } from '../src/lib/search/bm25.ts';
import { rrfFuse } from '../src/lib/search/rrf.ts';
import { searchKnowledge, readKnowledge, knowledgeStats } from '../src/lib/search/knowledge.ts';
import { searchInsights } from '../src/lib/search/insights.ts';

const repoRoot = join(fileURLToPath(new URL('.', import.meta.url)), '..');

test('persian: normalization folds glyphs, digits, ZWNJ', () => {
  assert.equal(normalizeFa('می\u200cشود'), 'میشود');           // ZWNJ removed
  assert.equal(normalizeFa('ي ك'), 'ی ک');                     // Arabic yeh/kaf
  assert.equal(normalizeFa('۰۹-٠١'), '09-01');                 // Persian + Arabic-Indic digits
  assert.equal(normalizeFa('  PSP-08  '), 'psp-08');           // collapse + lowercase
  assert.deepEqual(tokenize('نرخ موفقیت PSP-08 است'), ['نرخ', 'موفقیت', 'psp-08', 'است']);
  assert.deepEqual(tokenize('a ب'), []);                        // single-char tokens dropped
});

test('bm25: ranks by relevance, silent on absent terms', () => {
  const idx = new BM25Index([
    { id: 'a', text: 'افت نرخ موفقیت موفقیت موفقیت در ژوئن' },
    { id: 'b', text: 'درآمد قابل بازیابی از تلاش‌های مجدد' },
    { id: 'c', text: 'نرخ موفقیت پایدار در اردیبهشت' },
  ]);
  const hits = idx.search('موفقیت');
  assert.deepEqual(hits.map((h) => h.id)[0], 'a');              // highest tf wins
  assert.ok(hits.length >= 2);
  assert.deepEqual(idx.search('زرین'), []);                     // unknown term
});

test('rrf: fused list interleaves sources by rank', () => {
  const fused = rrfFuse([
    [{ id: 'x' }, { id: 'y' }],
    [{ id: 'y' }, { id: 'z' }],
  ]);
  assert.deepEqual(fused.map((f) => f.id), ['y', 'x', 'z']);    // y appears high in both
});

test('knowledge: corpus warms over docs/ with citable anchors', () => {
  const stats = knowledgeStats(repoRoot);
  assert.ok(stats.docs >= 20, `docs=${stats.docs}`);
  assert.ok(stats.chunks >= stats.docs);

  const hits = searchKnowledge('fee multiplier adjusted_fee', 3, repoRoot);
  assert.ok(hits.length > 0);
  assert.match(hits[0].path, /0006-fee-multiplier-handling\.md$/);
  assert.ok(hits[0].anchor, 'heading anchor present');
  assert.match(hits[0].deepUrl, /^docs\/adr\/0006-fee-multiplier-handling\.md#/);

  const persian = searchKnowledge('قاعده واجد شرایط بودن کدام فیلدها', 5, repoRoot);
  assert.ok(persian.length > 0, 'persian query returns results');

  const doc = readKnowledge('adr/0006-fee-multiplier-handling.md', undefined, repoRoot);
  assert.ok(doc && /multiplier/i.test(doc.text));
  assert.equal(readKnowledge('../../secret', undefined, repoRoot), null); // no traversal
});

test('insight search: finds published insights, respects merchant scope', async () => {
  const { dbPath } = await buildFixtureDb();
  const db = new Database(dbPath);
  try {
    const ins = db.prepare(`INSERT INTO insights
      (id, detector_id, scope_type, scope_key, period_key, payload, rank_score, lifecycle, created_ms)
      VALUES (?,?,?,?,?,?,?,?,?)`);
    const row = (id, detector, merchant, title, summary) => ins.run(
      id, detector, 'merchant', merchant, '2026-06',
      JSON.stringify({
        id, detectorId: detector,
        scope: { type: 'merchant', key: merchant },
        period: { key: '2026-06', start: '2026-06-01', end: '2026-06-30' },
        title, summary,
        metric: { name: 'success_rate', value: 0.41 },
        impact: { amountIrr: 120_000_000 },
        confidence: 'medium',
        recommendation: { text: 'مسیر پرداخت پیشنهادی را فعال کنید' },
      }),
      1, 'published', 0);
    row('I-03:M156:2026-06', 'I-03', 'M156',
      'افت ۹ درصدی نرخ موفقیت ژوئن', 'نرخ موفقیت در ژوئن افت کرد؛ PSP-05 سهم بیشتری گرفته است');
    row('I-08:M42:2026-06', 'I-08', 'M42',
      'درآمد قابل بازیابی از تلاش‌های مجدد', 'بخشی از تلاش‌های ناموفق با مسیر دیگر قابل بازیابی است');
    row('I-27:M156:2026-06', 'I-27', 'M156',
      'تمرکز درآمد بر یک مشتری', 'سهم بالای یک مشتری از درآمد ماهانه ریسک تمرکز ایجاد می‌کند');

    const byTopic = searchInsights(db, 'fixture', { query: 'تلاش مجدد قابل بازیابی' });
    assert.equal(byTopic[0]?.id, 'I-08:M42:2026-06');
    assert.equal(byTopic[0]?.deepUrl, '/insights/I-08:M42:2026-06');

    const scoped = searchInsights(db, 'fixture', { query: 'افت موفقیت', merchantKey: 'M156' });
    assert.equal(scoped.length, 1);
    assert.equal(scoped[0]?.id, 'I-03:M156:2026-06');
    assert.equal(scoped[0]?.impactIrr, 120_000_000);

    assert.deepEqual(searchInsights(db, 'fixture', { query: 'زرین‌پال' }), []);
  } finally {
    db.close();
  }
});
