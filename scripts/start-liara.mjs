// Liara boot: seed the db on first start (seed parts ship in the source),
// then serve. Without model keys the /ask page degrades to the FAQ (ADR-0011).
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";

const DB = new URL("../data/datasets/challenge-2026h1/db.sqlite", import.meta.url).pathname;
if (!existsSync(DB)) {
  console.log("[start-liara] seeding db from committed parts…");
  execSync("node scripts/seed.mjs", { stdio: "inherit" });
}
await import("../server/index.mts");
