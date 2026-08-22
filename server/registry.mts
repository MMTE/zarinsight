// Dataset registry (ADR-0010): scans data/datasets/*, reads manifests, caches
// readonly DB handles, tracks the active dataset.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import Database from 'better-sqlite3';

export interface DatasetEntry {
  id: string;
  manifest: Record<string, unknown>;
  dbPath: string;
  db: Database.Database;
}

export class Registry {
  private entries = new Map<string, DatasetEntry>();
  private activeId: string;
  private root: string;

  constructor(root: string) {
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

  list(): DatasetEntry[] {
    return [...this.entries.values()].sort((a, b) => a.id.localeCompare(b.id));
  }

  active(): DatasetEntry {
    return this.entries.get(this.activeId)!;
  }

  activate(id: string): boolean {
    if (!this.entries.has(id)) return false;
    this.activeId = id;
    return true;
  }

  get(id: string): DatasetEntry | undefined {
    return this.entries.get(id);
  }
}
