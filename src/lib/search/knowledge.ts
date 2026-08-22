/**
 * Knowledge corpus for the eve analyst (ADR-0013): BM25 retrieval over the
 * repo's own docs tree. Chunked by headings at first use, in-memory, rebuilt
 * per process start — no committed artifact, no staleness.
 *
 * Corpus: docs/adr, docs/specs, docs/research (recursive) + docs/INSIGHT-CATALOG.md
 * + docs/CONTRACTS.md. Plans and demo scripts excluded (internal task lists).
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { BM25Index } from './bm25.ts';
import { rrfFuse } from './rrf.ts';
import { normalizeFa } from './persian.ts';

const MAX_CHUNK = 1200;
const DIRS = ['adr', 'specs', 'research'];
const FILES = ['INSIGHT-CATALOG.md', 'CONTRACTS.md'];

export interface KnowledgeChunk {
  id: string;
  /** repo-relative doc path, e.g. "adr/0006-fee-multiplier-handling.md" */
  path: string;
  url: string;
  title: string;
  sectionPath: string;
  /** slug of the nearest heading — deep-link anchor */
  anchor: string | null;
  text: string;
}

export interface KnowledgeHit extends Omit<KnowledgeChunk, 'text'> {
  snippet: string;
  deepUrl: string;
}

interface Corpus {
  root: string;
  chunks: KnowledgeChunk[];
  byPath: Map<string, { title: string; url: string; text: string }>;
  body: BM25Index;
  head: BM25Index;
}

let corpus: Corpus | null = null;

/** eve compiles tool modules into a cache dir, so import.meta.url is
 *  unreliable — resolve from cwd walking up to the repo that owns docs/. */
function findRepoRoot(): string {
  let dir = resolve(process.cwd());
  for (let i = 0; i < 6; i++) {
    if (existsSync(join(dir, 'package.json')) && existsSync(join(dir, 'docs'))) return dir;
    const parent = resolve(dir, '..');
    if (parent === dir) break;
    dir = parent;
  }
  return resolve(process.cwd());
}

/** GitHub-style heading slug: lowercase, punctuation stripped (Unicode
 *  letters/digits/hyphen kept), whitespace → hyphen. Persian survives. */
function slugify(heading: string): string {
  return normalizeFa(heading)
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');
}

/** Split section lines into atomic blocks: fenced code stays whole, the rest
 *  groups into paragraphs. (liara chunker port.) */
function toBlocks(lines: string[]): string[] {
  const blocks: string[] = [];
  let buf: string[] = [];
  let fence: string[] | null = null;
  const flush = () => {
    const text = buf.join('\n').trim();
    if (text) blocks.push(text);
    buf = [];
  };
  for (const line of lines) {
    if (fence !== null) {
      fence.push(line);
      if (/^\s*```/.test(line)) {
        blocks.push(fence.join('\n'));
        fence = null;
      }
    } else if (/^\s*```/.test(line)) {
      flush();
      fence = [line];
    } else if (line.trim() === '') {
      flush();
    } else {
      buf.push(line);
    }
  }
  if (fence !== null) blocks.push(fence.join('\n'));
  flush();
  return blocks;
}

/** Greedily pack blocks into ≤ MAX_CHUNK chars; oversized blocks stay whole. */
function packBlocks(blocks: string[]): string[] {
  const out: string[] = [];
  let cur = '';
  for (const raw of blocks) {
    const block = raw.trim();
    if (!block) continue;
    if (block.length > MAX_CHUNK) {
      if (cur) out.push(cur);
      out.push(block);
      cur = '';
    } else if (cur && cur.length + block.length + 2 > MAX_CHUNK) {
      out.push(cur);
      cur = block;
    } else {
      cur = cur ? `${cur}\n\n${block}` : block;
    }
  }
  if (cur) out.push(cur);
  return out;
}

/** One markdown doc → chunks split at H2/H3 headings (liara chunker port,
 *  anchors synthesized from heading slugs). */
function chunkDoc(path: string, url: string, text: string): KnowledgeChunk[] {
  const lines = (text ?? '').replace(/\r\n?/g, '\n').split('\n');
  const title =
    (lines.find((l) => /^#\s+\S/.test(l)) ?? '').replace(/^#\s+/, '').trim()
    || path;

  interface Section { path: string; heading: string | null; anchor: string | null; body: string[] }
  const sections: Section[] = [];
  let h2 = '';
  let cur: Section = { path: '', heading: null, anchor: null, body: [] };
  const pushSection = () => {
    if (cur.body.some((l) => l.trim() !== '') || cur.heading) sections.push(cur);
    cur = { path: '', heading: null, anchor: null, body: [] };
  };
  for (const line of lines) {
    const m = line.match(/^(#{2,3})\s+(.*\S)\s*$/);
    if (m) {
      pushSection();
      const name = m[2].trim();
      if (m[1].length === 2) h2 = name;
      cur = {
        path: m[1].length === 2 ? name : [h2, name].filter(Boolean).join(' > '),
        heading: `${m[1]} ${name}`,
        anchor: slugify(name) || null,
        body: [],
      };
    } else {
      cur.body.push(line);
    }
  }
  pushSection();

  const chunks: KnowledgeChunk[] = [];
  const pendingHeadings: string[] = [];
  const addChunk = (sectionPath: string, anchor: string | null, chunkText: string) => {
    chunks.push({
      id: `${path}#${chunks.length}`, path, url, title,
      sectionPath, anchor, text: chunkText,
    });
  };
  for (const section of sections) {
    if (!section.body.some((l) => l.trim() !== '')) {
      if (section.heading) pendingHeadings.push(section.heading);
      continue;
    }
    const parts = packBlocks(toBlocks(section.body));
    parts.forEach((chunkText, i) => {
      const prefix = i === 0
        ? [...pendingHeadings, section.heading].filter(Boolean).join('\n\n')
        : '';
      addChunk(section.path, section.anchor, prefix ? `${prefix}\n\n${chunkText}` : chunkText);
    });
    pendingHeadings.length = 0;
  }
  return chunks;
}

function listCorpusFiles(docsRoot: string): Array<{ path: string; abs: string }> {
  const out: Array<{ path: string; abs: string }> = [];
  const walk = (dir: string, rel: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.name.startsWith('.')) continue;
      const abs = join(dir, e.name);
      const rel2 = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) walk(abs, rel2);
      else if (/\.md$/i.test(e.name)) out.push({ path: rel2, abs });
    }
  };
  for (const d of DIRS) {
    const abs = join(docsRoot, d);
    if (existsSync(abs)) walk(abs, d);
  }
  for (const f of FILES) {
    const abs = join(docsRoot, f);
    if (existsSync(abs)) out.push({ path: f, abs });
  }
  return out;
}

export function warmKnowledge(root?: string): Corpus {
  if (corpus && (!root || corpus.root === resolve(root))) return corpus;
  const repo = root ?? findRepoRoot();
  const docsRoot = join(repo, 'docs');
  const chunks: KnowledgeChunk[] = [];
  const byPath = new Map<string, { title: string; url: string; text: string }>();
  for (const { path, abs } of listCorpusFiles(docsRoot)) {
    const text = readFileSync(abs, 'utf8');
    byPath.set(path, { title: '', url: `docs/${path}`, text });
    chunks.push(...chunkDoc(path, `docs/${path}`, text));
  }
  for (const [path, entry] of byPath) {
    entry.title = chunks.find((c) => c.path === path)?.title ?? path;
  }
  corpus = {
    root: resolve(repo),
    chunks,
    byPath,
    body: new BM25Index(chunks.map((c) => ({ id: c.id, text: `${c.title} ${c.sectionPath} ${c.text}` }))),
    head: new BM25Index(chunks.map((c) => ({ id: c.id, text: `${c.title} ${c.sectionPath}` }))),
  };
  return corpus;
}

function snippet(text: string, len = 240): string {
  const t = text.replace(/\s+/g, ' ').trim();
  return t.length <= len ? t : `${t.slice(0, len)}…`;
}

/** BM25 over chunk bodies fused (RRF) with a heading-only pass — heading
 *  hits boost precision the way liara's semantic channel would. */
export function searchKnowledge(query: string, k = 6, root?: string): KnowledgeHit[] {
  const c = warmKnowledge(root);
  const fused = rrfFuse([c.body.search(query, 20), c.head.search(query, 20)]);
  const byId = new Map(c.chunks.map((ch) => [ch.id, ch]));
  return fused.slice(0, k).flatMap(({ id }) => {
    const ch = byId.get(id);
    if (!ch) return [];
    return [{
      path: ch.path, url: ch.url, title: ch.title, sectionPath: ch.sectionPath,
      anchor: ch.anchor, deepUrl: ch.anchor ? `${ch.url}#${ch.anchor}` : ch.url,
      snippet: snippet(ch.text),
    }];
  });
}

/** Full text of one corpus doc by repo-relative path (validated against the
 *  corpus — no traversal). */
export function readKnowledge(
  path: string,
  maxChars = 12_000,
  root?: string,
): { path: string; title: string; url: string; text: string } | null {
  const c = warmKnowledge(root);
  const entry = c.byPath.get(path);
  if (!entry) return null;
  return {
    path, url: entry.url, title: entry.title,
    text: entry.text.length > maxChars ? `${entry.text.slice(0, maxChars)}…` : entry.text,
  };
}

export function knowledgeStats(root?: string): { docs: number; chunks: number } {
  const c = warmKnowledge(root);
  return { docs: c.byPath.size, chunks: c.chunks.length };
}
