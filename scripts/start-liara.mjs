// Liara boot: seed the db on first start. Seed parts (172MB) ship as
// GitHub release assets — downloaded once into data/datasets/ when the db
// is missing, then restored exactly like `npm run seed`. Without model keys
// the /ask page degrades to the deterministic FAQ (ADR-0011).
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";

const DB = new URL("../data/datasets/challenge-2026h1/db.sqlite", import.meta.url).pathname;
const ASSET_BASE =
  process.env.SEED_ASSET_BASE ||
  "https://github.com/MMTE/zarinsight/releases/download/submission-2026-08-22/seed.db.gz.";

if (!existsSync(DB)) {
  console.log("[start-liara] db missing — fetching seed parts from GitHub release…");
  const dataDir = new URL("../data/", import.meta.url).pathname;
  mkdirSync(dataDir, { recursive: true });
  for (let i = 0; i < 8; i++) {
    const part = `${dataDir}seed.db.gz.00${i}`;
    if (existsSync(part)) continue;
    const url = `${ASSET_BASE}00${i}`;
    console.log(`  fetching ${url}`);
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) throw new Error(`seed part ${i}: HTTP ${res.status}`);
    await pipeline(res.body, createWriteStream(part));
  }
  console.log("[start-liara] restoring db from parts…");
  execSync("node scripts/seed.mjs", { stdio: "inherit" });
}
await import("../server/index.mts");
