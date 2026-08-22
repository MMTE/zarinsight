#!/usr/bin/env node
/**
 * Deploy zarinsight to Liara's Node platform (type=node): source upload
 * (repo minus heavy local state, seed parts INCLUDED — under the 256MB
 * source cap), platform runs npm ci + npm run build (vite), then
 * scripts/start-liara.mjs seeds the db on first boot and starts Express.
 * The eve agent stays OPTIONAL: without model keys /ask serves the
 * deterministic FAQ (ADR-0011).
 */
import { execSync } from "node:child_process";
import { mkdtempSync, cpSync, writeFileSync, rmSync, readFileSync, existsSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const API = "https://api.iran.liara.ir";
const APP = process.env.LIARA_APP_NAME || "zarinsight";

function envFromDotenv() {
  try {
    const raw = readFileSync(new URL("../.env", import.meta.url), "utf8");
    const out = {};
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) out[m[1]] = m[2];
    }
    return out;
  } catch {
    return {};
  }
}
const dotenv = envFromDotenv();
const TOKEN = process.env.DEMO_LIARA_TOKEN || dotenv.DEMO_LIARA_TOKEN;
const TEAM = process.env.LIARA_TEAM_ID || dotenv.LIARA_TEAM_ID;
if (!TOKEN || !TEAM) {
  console.error("need DEMO_LIARA_TOKEN and LIARA_TEAM_ID (env or .env)");
  process.exit(1);
}

const api = (pathname, init) =>
  fetch(`${API}/${pathname.replace(/^\//, "")}?teamID=${TEAM}`, {
    ...init,
    headers: {
      "User-Agent": "liara-cli/9.5.1 (darwin arm64; x64)",
      authorization: `Bearer ${TOKEN}`,
      ...(init?.headers || {}),
    },
  });

const EXCLUDE = new Set([
  ".git", "node_modules", ".env", "dist", "data", "tests", "captures",
  ".DS_Store", "coverage", "docs", "screenshots", ".eve", ".output",
]);

function buildTarball() {
  const stage = mkdtempSync(path.join(tmpdir(), "zarinsight-"));
  const root = new URL("..", import.meta.url).pathname;
  const entries = readdirSync(root).filter((n) => !EXCLUDE.has(n) && !/\.log$/.test(n));
  for (const name of entries) {
    cpSync(path.join(root, name), path.join(stage, name), { recursive: true, verbatimSymlinks: true });
  }
  // seed parts back in (data/ excluded wholesale above, restore just the parts)
  mkdirSyncSafe(path.join(stage, "data"));
  const dataDir = readdirSync(path.join(root, "data")).filter((f) => /^seed\.db\.gz\.\d+$/.test(f));
  for (const f of dataDir) cpSync(path.join(root, "data", f), path.join(stage, "data", f));
  const tarPath = `${stage}.tar.gz`;
  execSync(`tar -czf ${tarPath} -C ${stage} .`, { stdio: "inherit" });
  rmSync(stage, { recursive: true, force: true });
  return tarPath;
}
function mkdirSyncSafe(p) { if (!existsSync(p)) execSync(`mkdir -p ${p}`); }

async function main() {
  const tarPath = buildTarball();
  try {
    const buf = readFileSync(tarPath);
    console.log(`tarball: ${(buf.length / 1e6).toFixed(1)}MB`);
    const form = new FormData();
    form.append("file", new Blob([buf], { type: "application/gzip" }), "source.tar.gz");
    const up = await api(`v2/projects/${APP}/sources`, { method: "POST", body: form });
    if (!up.ok) throw new Error(`upload ${up.status} ${(await up.text()).slice(0, 200)}`);
    const { sourceID } = await up.json();
    console.log(`source: ${sourceID}`);
    const res = await api(`v2/projects/${APP}/releases`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sourceID, port: 3000, type: "node", build: {}, message: "zarinsight — full deploy" }),
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`release ${res.status} ${text.slice(0, 300)}`);
    const { releaseID } = JSON.parse(text);
    console.log(`release: ${releaseID}`);
    const start = Date.now();
    for (;;) {
      await new Promise((r) => setTimeout(r, 5000));
      const r = await api(`v1/releases/${releaseID}`);
      if (!r.ok) throw new Error(`poll ${r.status}`);
      const { release } = await r.json();
      process.stdout.write(`\r[${Math.round((Date.now() - start) / 1000)}s] ${release.state}          \x1b[K`);
      if (release.state === "READY") {
        console.log(`\nREADY → https://${APP}.liara.run`);
        return;
      }
      if (["FAILED", "UNHEALTHY", "TIMEDOUT"].includes(release.state)) {
        throw new Error(`release ${release.state}: ${release.failReason || "see build-logs"}`);
      }
    }
  } finally {
    rmSync(tarPath, { force: true });
  }
}
main().catch((e) => {
  console.error(String(e));
  process.exit(1);
});
