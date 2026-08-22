// Dataset registry (ADR-0010): scans data/datasets/*, reads manifests, caches
// readonly DB handles, tracks the active dataset.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import Database from 'better-sqlite3';

export class Registry {
  entries = new Map();
  activeId;
  root;

  constructor(root) {
    this.root = root;
    if (existsSync(root)) {
      for (const name of readdirSync(root)) {
        const dir = join(root, name);
        const manifestPath = join(dir, 'manifest.json');
        const dbPath = join(dir, 'db.sqlite');
        if (!existsSync(manifestPath) || !existsSync(dbPath)) continue;
        const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
        this.entries.set(name, {
          id: name, manifest, dbPath,
          db: new Database(dbPath, { readonly: true }),
        });
      }
    }
    if (!this.entries.size) {
      throw new Error(`no datasets under ${root} — run \`npm run seed\` or \`npm run data:build\``);
    }
    this.activeId = this.entries.has('challenge-2026h1')
      ? 'challenge-2026h1'
      : [...this.entries.keys()][0];
  }

  list() {
    return [...this.entries.values()].sort((a, b) => a.id.localeCompare(b.id));
  }

  active() {
    return this.entries.get(this.activeId);
  }

activate(id) {
    if (!this.entries.has(id)) return false;
    this.activeId = id;
    return true;
  }

get(id) {
    return this.entries.get(id);
  }

  /** Re-scan the datasets dir after a live sync added a dataset (closes old handles). */
  reload() {
    for (const entry of this.entries.values()) {
      try { entry.db.close(); } catch { /* already closed */ }
    }
    const fresh = new Registry(this.root);
    this.entries = fresh.entries;
    this.activeId = fresh.activeId;
  }
}
