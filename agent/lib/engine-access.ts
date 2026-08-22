// Shared engine access for eve tools — one Registry, one source of numbers
// (ADR-0004/0011: tools are the ONLY way the agent sees figures).
// Path note: eve compiles tool modules into a cache dir, so import.meta.url is
// unreliable here; resolve from cwd walking up to the repo that owns package.json.
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { Registry } from '../../server/registry.mjs';

function repoRoot(): string {
  let dir = resolve(process.cwd());
  for (let i = 0; i < 6; i++) {
    if (existsSync(join(dir, 'package.json'))
      && existsSync(join(dir, 'data', 'datasets'))) return dir;
    const parent = resolve(dir, '..');
    if (parent === dir) break;
    dir = parent;
  }
  return resolve(process.cwd());
}

export const registry = new Registry(join(repoRoot(), 'data', 'datasets'));
