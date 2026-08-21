# Zarinsight — UI (work in progress)

ZarinPal merchant-analytics product UI. Persian RTL, Vite + React 18 + TypeScript + Tailwind.

## Run

```bash
npm install
npm run dev   # http://localhost:5173
```

## Structure

- `src/pages/` — analytics pages (Overview, Insights, InsightDetail, Sales, Customers,
  Payments, Benchmarks, Explore, DataQuality, Methodology, Ask, Notifications) +
  `PanelDashboard` (ZarinPal panel-style gateway dashboard)
- `src/components/layout/` — app shell: DS-styled SideNav (collapsible), TopBar,
  mobile Drawer navigation
- `src/design-system/` — ZarinPal design-system component library (34 documented
  components with `.previews.tsx` usage examples; source of truth for new UI)
- `src/components/` — re-exports from the bundled `_designSystem` library used by
  the analytics pages
- `src/data/` — mock data layer (will be replaced by the real engine API)
- `src/contexts/AnalysisContext.tsx` — period/compare/notification scope

## Design sources

- Component library + shell styling modeled on the official ZarinPal panel
  (header/navbar/sidebar patterns) — `src/design-system/`
- Analytics page designs from the Magic Patterns prototype — all preserved
