# ADR-0009: Runtime stack amendment — Vite app + Node API server + eve agent child

## Status
Accepted 2026-08-22 · Amends ADR-0005 (Next.js App Router → Vite + Node); ADR-0005's
zero-external-services and judge-quickstart contracts are unchanged and still binding.

## Context
ADR-0005 pinned Next.js App Router before any UI existed. On 2026-08-22 the full UI
baseline landed in `zarinsight/` as a **Vite + React Router** app (Magic Patterns
prototype: 14 routes, official ZarinPal design system, verified desktop + 375 px RTL,
zero console errors; CHANGELOG 2026-08-22). Porting to Next would discard verified UX
work and re-open the browser-verification bar with no rubric gain. Separately, the
agentic layer (ADR-0011) uses eve, whose native adapters are Next/Nuxt/SvelteKit —
eve runs fine as a standalone child that we reverse-proxy, the exact dev pattern proven
in the liara challenge (`dev.sh`: app server proxying `/eve/*` to the eve child).

## Decision
Three processes behind **one origin** (the Vite dev server in dev, a Node server in
prod), orchestrated by one command:

| Concern | Choice |
|---|---|
| UI | Vite 5 + React 18 + React Router 6 + Tailwind **v3** (as landed; plan's "v4" was never built) |
| Engine host | Node API server (`server/index.mjs`, express) serving CONTRACTS §5 routes over better-sqlite3; in dev mounted as a Vite middleware plugin (no second port), in prod serves `dist/` + `/api/*` |
| Agent | eve standalone child (ADR-0011); dev: `vite.config.ts` proxies `/eve/*` → child; prod: `server/index.mjs` proxies `/eve/*` |
| Orchestration | `npm run dev` = concurrently(vite + eve child); `npm run build && npm start` = express serving dist + API + eve proxy |
| Tests | `node:test` (unchanged); `node --test tests/` |

Judge quickstart (unchanged from ADR-0005): `npm i && npm run seed && npm run dev` —
no CSV, no keys, no DB server.

## Alternatives rejected
- **Port UI to Next.js** for `withEve()` same-origin — discards the verified UI baseline;
  the proxy pattern achieves the same integration with less risk.
- **Static-only Vite + separate API origin** — CORS + env drift; single origin keeps
  `useEveAgent()` route discovery and API fetches same-origin.

## Consequences
- Dev runs two children (vite, eve) — `concurrently` hides this; kill via one Ctrl-C.
- `server/index.mjs` is the only prod entrypoint; it must not depend on Vite.
- better-sqlite3 stays Node-only; the browser bundle never imports the engine (it goes
  through `/api/*`), preserving ADR-0002's traceability rule.
- If eve later ships a Vite adapter, swap the proxy for it without touching this ADR's
  process model.
