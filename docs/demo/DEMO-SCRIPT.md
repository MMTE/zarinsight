# Demo Script — Zarinsight (≥5 min, desktop + mobile from the same build)

Setup before recording: `npm i && npm run seed && npm run agent:build`,
`npm run agent:start & npx vite` → http://localhost:5173

1. **Overview (M156)** — 0:00–0:50
   - Land on وضعیت کسب و کار: live KPIs (۱٫۹۵ تریلیون ریال، ۵۵٬۹۴۰ جلسه).
   - Top-3 cards from the engine; open the June success-drop headline.
   - «بررسی این تغییر» → investigate flow.
2. **Insights feed** — 0:50–1:40
   - بینش‌های مهم: ranked cards with ریال impacts; filter by دسته/موضوع.
   - Open one card: decomposition steps («تعداد پرداخت» vs «نرخ موفقیت»).
   - «محاسبه»: filter + eligible population + row sample — traceability story.
3. **Merchant switcher** — 1:40–2:20
   - Switch M156 → M250 in the top bar: KPIs swap live (۴۲۴٫۷ میلیارد ریال).
   - Point out the concentration caveat — M250 = half the sessions, 8% of revenue.
4. **Payments + Benchmarks** — 2:20–3:20
   - پرداخت‌ها: funnel + PSP table (naive beside mix-adjusted, ADR-0007).
   - مقایسه: cohort definition, M156 vs median/quartiles («گروه مشابه: N کسب‌وکار»).
5. **Ask + agent** — 3:20–4:10
   - پرسش و پاسخ: ask «چرا نرخ موفقیت ژوئن افت کرد؟»
   - If a model key is configured: the eve analyst answers via read-only tools.
   - Without a key: deterministic FAQ fallback — same honesty, zero cost.
6. **Bring your own data** — 4:10–4:40
   - بیش‌تر → connect ZarinPal account (key stays in memory); dataset appears.
7. **Methodology + mobile** — 4:40–5:30
   - روش تحلیل: eligibility rules, fee multiplier, infeasible analyses — honesty page.
   - Resize to 375px (or device emulator): same flows, RTL reading, hamburger nav.
