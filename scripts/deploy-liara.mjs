#!/usr/bin/env node
/**
 * Deploy zarinsight to Liara's Node platform (type=node): slim source upload
 * (prebuilt dist/, runtime-only manifest — express/better-sqlite3/sirv — so
 * npm ci dodges playwright browser downloads), then scripts/start-liara.mjs
 * LISTENS FIRST and restores the dataset in the background from the GitHub
 * release (ADR-0012). The eve agent is not deployed: /ask serves the
 * deterministic FAQ (ADR-0011).
 */
import { execSync } from "node:child_process";
import { mkdtempSync, cpSync, writeFileSync, rmSync, readFileSync, existsSync, readdirSync, mkdirSync } from "node:fs";
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
  ".git", "node_modules", ".env", "data", "tests", "captures",
  ".DS_Store", "coverage", "docs", "screenshots", ".eve", ".output",
]);

// Runtime-only deps for the deployed tree. Liara's node22 builder has a ~300s
// cap; the full tree (playwright browser downloads, 45MB eve) can't finish
// npm ci inside it. The UI ships prebuilt in dist/, so the platform only
// installs what the Express server imports (server/index.mts, registry.mjs).
const RUNTIME_DEPS = ["express", "better-sqlite3", "sirv"];

function slimManifest(stage) {
  const pkgPath = path.join(stage, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  pkg.dependencies = Object.fromEntries(
    Object.entries(pkg.dependencies || {}).filter(([n]) => RUNTIME_DEPS.includes(n)),
  );
  delete pkg.devDependencies;
  pkg.scripts = { ...pkg.scripts, build: "node -e 0" }; // dist is prebuilt
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  execSync("npm install --package-lock-only --ignore-scripts --no-audit --no-fund", {
    cwd: stage, stdio: "inherit",
  });
}

function buildTarball() {
  const stage = mkdtempSync(path.join(tmpdir(), "zarinsight-"));
  const root = new URL("..", import.meta.url).pathname;
  const entries = readdirSync(root).filter((n) => !EXCLUDE.has(n) && !/\.log$/.test(n));
  for (const name of entries) {
    cpSync(path.join(root, name), path.join(stage, name), { recursive: true, verbatimSymlinks: true });
  }
  // Ship the dataset manifest at seed/manifest.json (NOT data/: the persistent
  // disk mounts over /app/data and shadows it). Registry requires the manifest
  // beside the db, seed.mjs does not write it, and v2 sources rejects ~180MB
  // tarballs — so the 172MB seed parts download from the GitHub release at
  // first boot, in the background (listen-first: scripts/start-liara.mjs).
  const manifest = path.join(root, "data", "datasets", "challenge-2026h1", "manifest.json");
  mkdirSync(path.join(stage, "seed"), { recursive: true });
  if (existsSync(manifest)) cpSync(manifest, path.join(stage, "seed", "manifest.json"));
  else throw new Error("manifest.json missing - Registry would find no dataset");
  slimManifest(stage);
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
      body: JSON.stringify({
        sourceID, port: 3000, type: "node", build: { cache: true },
        disks: [{ name: "data", mountTo: "/app/data" }],
        message: "zarinsight — slim deploy",
      }),
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
