# Demo Script — Zarinsight (6–8 min, desktop + mobile from the same build)

Setup before recording:

```
npm i && npm run seed && node scripts/detect.mjs && npm run build
npm start            # http://localhost:3000  (UI + /api from one origin)
# optional, for the live analyst instead of the FAQ fallback:
npm run agent:build && npm run agent:start &
```

`detect.mjs` publishes the insights and the benchmark cache — without it the
feed and the مقایسه tab fall back to prototype data.

Default scope on first load is M156. All numbers below were verified on the
challenge-2026h1 dataset; live values will match what the engine computed.

1. **Overview — وضعیت کسب و کار** — 0:00–0:50
   - Live KPI cards (درآمد موفق، نرخ موفقیت، نرخ تلاش مجدد، سهم بازگشتی‌ها) from
     `/api/overview`; note «هر عددی که می‌بینید، محاسبه و جامعه داده‌اش یک کلیک
     با شما فاصله دارد».
   - «سه یافته مهم»: top-3 engine cards by rank. Open the success-drop headline
     (e.g. «نرخ موفقیت 2026-04: ۴۹٫۵٪ (−۴٫۴ واحد درصد نسبت به قبل)»).
2. **Insight detail — the traceability story** — 0:50–2:10
   - From `/insights` (filters: دسته / موضوع), open any card — the detail page
     is the live engine payload: real metric, comparison, ریال impact, monthly
     trend chart.
   - «چطور به این نتیجه رسیدیم؟»: reproducible segment filter (dates, merchant,
     statuses), the engine SQL, eligible population, and a sample of the actual
     records behind the number; «رکوردهای کنارگذاشته‌شده» says either the real
     count or why the delta does not apply.
   - «مشاهده محاسبه»: the F-01…F-04 formula in plain Persian + step values.
   - «روش تحلیل» → جزئیات فنی: detector id, eligibility rule, SQL.
   - Set the finding's status (در حال بررسی / بررسی‌شده / نادیده گرفتن).
3. **New detectors — actionability breadth** — 2:10–2:50
   - In the feed filter by دسته → روند: I-14 cards («نرخ موفقیت ۳ هفتهٔ متوالی
     رو به بهبود/افت است» — material cumulative change, ≥1,000-session runs).
   - دسته → ریسک: I-27 concentration («X٪ درآمد موفق به ۱۰٪ مشتریان بزرگ
     وابسته است»), e.g. M27: ۷۷٫۶٪ with the top-customer downside in ریال.
   - دسته → وضعیت مثبت: I-18 benchmark gaps vs گروه مشابه.
4. **Merchant switcher** — 2:50–3:20
   - Switch M156 → M250 (or M27) in the top bar: KPIs, feed and charts swap to
     the new scope's live data.
5. **تحلیل tabs** — 3:20–4:30
   - `/analysis/payments` (پرداخت): funnel + PSP table with the raw ↔
     تعدیل‌شده toggle; related live PSP insights beside it.
   - `/analysis/benchmarks` (مقایسه): cohort card («گروه مشابه: N کسب‌وکار»,
     quartiles of volume/amount), your position per metric vs median and top
     quartile, نقاط قوت and فاصله‌های قابل بهبود — each gap deep-links to the
     merchant's published insight with its real impact. Served from the
     precomputed cache (<5 ms).
6. **Ask + agent** — 4:30–5:20
   - `/ask`: «چرا نرخ موفقیت ژوئن افت کرد؟»
   - With a model key: the eve analyst answers from read-only tools with
     citations and `/insights/:id` deep links. Without a key: deterministic FAQ
     fallback — same honesty, zero cost.
7. **Bring your own data** — 5:20–5:50
   - `/more` (بیش‌تر): connect a ZarinPal account — the API key stays in memory,
     rows are built into a new dataset and the app switches to it.
8. **Mobile — same build** — 5:50–6:30
   - Resize to 375 px (or device emulator): repeat steps 1–2 — RTL reading,
     collapsible nav, the evidence drill and records sample table scroll
     horizontally instead of breaking.
