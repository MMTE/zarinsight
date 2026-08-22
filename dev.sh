#!/bin/bash
# Dev orchestration (ADR-0009/0011, liara dev.sh precedent — plan risk table):
#   1. build the eve agent (model env must be present at build time — ADR-0013
#      note: eve freezes the model into the build artifact),
#   2. start it on :2319 (the port vite's /eve proxy targets),
#   3. health-wait, then vite dev on :5173.
# Graceful: if the agent can't start, vite still runs and /ask degrades to the
# deterministic FAQ fallback (spec §4.12).
set -u
cd "$(dirname "$0")"

echo "[dev.sh] building agent…"
npm run --silent agent:build || echo "[dev.sh] agent build failed — continuing (FAQ fallback)"

npx eve start --port 2319 --host 127.0.0.1 &
EVE_PID=$!
trap 'kill "$EVE_PID" 2>/dev/null || true' EXIT

for i in $(seq 1 60); do
  curl -sf -o /dev/null http://127.0.0.1:2319/eve/v1/health && break
  sleep 1
done
if curl -sf -o /dev/null http://127.0.0.1:2319/eve/v1/health; then
  echo "[dev.sh] agent ready on :2319 — starting vite"
else
  echo "[dev.sh] agent NOT ready after 60s — starting vite anyway (FAQ fallback)"
fi

npx vite --host 127.0.0.1 --port 5173
