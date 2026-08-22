// Liara boot (v3 — ADR-0012): LISTEN FIRST, seed in the background.
// The release pipeline caps at ~300s and image prep alone eats ~3min, so the
// container must accept connections the moment it starts. Seed parts come
// from the GitHub release assets (v2 sources rejects ~180MB tarballs). Until
// the dataset is restored, /api/health reports {status:"seeding"} (HTTP 200)
// plus a live seed-progress object (phase/part/bytes/err — the runtime logs
// API does not surface app stdout, so health IS the observability), other
// /api routes return 503, and the UI serves normally. Without model keys
// /ask serves the deterministic FAQ (ADR-0011).
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, createWriteStream, cpSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Transform } from "node:stream";

const repoRoot = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const dataDir = join(repoRoot, "data");
const DB = join(dataDir, "datasets", "challenge-2026h1", "db.sqlite");
const PART_PATH = "MMTE/zarinsight/releases/download/submission-2026-08-22/seed.db.gz.";
// Hosts tried in order per part: GitHub direct, Liara's internal nexus
// github-proxy (same mirror the builder uses), then a public gh proxy.
const HOSTS = [
  "https://github.com/",
  "http://10.16.100.42/repository/github-proxy/https://github.com/",
  "https://gh-proxy.com/https://github.com/",
];

const express = (await import("express")).default;
const sirv = (await import("sirv")).default;
const { createApiApp } = await import("../server/index.mts");

const seed = { phase: "idle", part: -1, bytes: 0, host: null, err: null };

// The persistent disk mounts over /app/data, shadowing anything staged there,
// so the manifest ships at seed/manifest.json and is copied into place before
// the Registry scans the dataset dir.
function ensureManifest() {
  const target = join(dataDir, "datasets", "challenge-2026h1", "manifest.json");
  if (!existsSync(target)) {
    mkdirSync(join(dataDir, "datasets", "challenge-2026h1"), { recursive: true });
    cpSync(join(repoRoot, "seed", "manifest.json"), target);
  }
}
let api = existsSync(DB) ? (ensureManifest(), createApiApp()) : null;

const app = express();
app.get("/api/health", (_req, res) =>
  res.status(200).json({ status: api ? "ok" : "seeding", seed }));
app.use((req, res, next) => {
  if (!req.path.startsWith("/api")) return next();
  // Dispatcher, not a boot-time mount: api flips null->live once the
  // background restore finishes, so re-check it on every request.
  if (api) return api(req, res, next);
  res.status(503).json({ error: "seeding", detail: "اولین اجرا: بازیابی دیتاست؛ کمی بعد دوباره تلاش کنید", seed });
});
const dist = join(repoRoot, "dist");
if (existsSync(dist)) app.use(sirv(dist, { single: true }));
const port = Number(process.env.PORT ?? 3000);
app.listen(port, () =>
  console.log(`[zarinsight] listening on :${port} (dataset ${api ? "ready" : "seeding…"})`));

async function fetchPart(i) {
  const part = join(dataDir, `seed.db.gz.00${i}`);
  if (existsSync(part)) return;
  const errors = [];
  for (const host of HOSTS) {
    const url = `${host}${PART_PATH}00${i}`;
    try {
      seed.host = host;
      const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(120_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const counter = new Transform({
        transform(chunk, _enc, cb) { seed.bytes += chunk.length; cb(null, chunk); },
      });
      const { pipeline } = await import("node:stream/promises");
      await pipeline(res.body, counter, createWriteStream(part));
      console.log(`[start-liara] part ${i} ok via ${host} (${seed.bytes}B total)`);
      return;
    } catch (e) {
      errors.push(`${host}: ${e?.message || e}`);
    }
  }
  throw new Error(`part ${i} failed everywhere — ${errors.join(" | ")}`);
}

async function restore() {
  if (!existsSync(DB)) {
    mkdirSync(dataDir, { recursive: true });
    for (let i = 0; i < 8; i++) {
      seed.phase = "downloading";
      seed.part = i;
      seed.bytes = 0;
      await fetchPart(i);
    }
    seed.phase = "restoring";
    console.log("[start-liara] restoring db from parts…");
    // Async spawn: execSync would block the event loop and starve the
    // readiness probes that must pass while the db restores.
    await new Promise((resolve, reject) => {
      const p = spawn("node", ["scripts/seed.mjs"], { cwd: repoRoot, stdio: "inherit" });
      p.on("error", reject);
      p.on("exit", (c) => (c === 0 ? resolve() : reject(new Error(`seed.mjs exit ${c}`))));
    });
  }
  ensureManifest();
  api = createApiApp();
  seed.phase = "done";
  console.log("[start-liara] dataset restored — API live");
}

if (!api) {
  restore().catch((e) => {
    seed.phase = "error";
    seed.err = String(e?.message || e);
    console.error("[start-liara] seed failed:", seed.err);
  });
}
