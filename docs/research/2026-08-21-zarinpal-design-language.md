# ZarinPal Design Language — tokens for the UI spec

Date: 2026-08-21 · **§0 supersedes everything below** · Feeds ADR-0008 + the UI spec.

## 0. OFFICIAL DESIGN SYSTEM PROVIDED (2026-08-21, later) — source of truth

Archive at `زرین_پال-Design-System/` — machine-readable distillation of the official
**کتاب هویت بصری نسخه عمومی ۰.۱ (دی ۱۴۰۲)** (`zarinpal-visual-Identity-guidelines_0.1-_2_.pdf`)
+ live zarinpal.com + the old story-book repo. My earlier scraping (§1–3) is retained
for provenance only; where they differ, the archive wins. Everything checked: the scrape
was accurate on hex values; the archive adds the *rules*.

| Concern | Official rule (archive) |
|---|---|
| Entry points | `system/variables.css` (218 tokens, light + `.dark`), `system/kit.html`/`kit.dark.html` (component showcase), `DESIGN.md`/`guide.md` (rules), `DESIGN-HANDOFF.md` (implementation contract + viewport matrix 360→1920), `system/theme.json` (antd), `brand.json` (regeneration seed) |
| Brand colors | **Pal `#0A33FF` = رنگ کلیدی** (the key color, max 10 % of surface); **Gold `#FFD60A`** (زرین, Gold-400) and **Gray `#19191A`** (مشکی برند, Gray-950) complete the primary trio |
| Posture | **۶۰٪ سفید و مشکی / ۲۵٪ خنثی / ۱۰٪ رنگ کلیدی / ۵٪ سایر و گرادیان** — the rule our insight-UI must obey |
| Full palette | 14 product colors (Gray, Red, Orange, Gold, Crowd, Green, Express, Lend, Blue, Neo, Pal, Plus, Academy, Brown) × 11 steps (50–950, APCA) as `--brand-palette-{name}-{step}` |
| Semantic | Danger=Red `#F20C0C`(600) · Warning=Orange `#F27F0C`(600) · Success=Green `#00A661`(600) · Info=Blue `#1967D2`(600), each with bg/border scales → maps 1:1 to our insight severity colors |
| Gradients | «گردینت جامع» = master gradient over all key colors (blue-dominant; CSS approx `--brand-gradient-master`); other gradients: ≤ 2 steps, SAME color family only (e.g. Pal-700→Pal-200); gradients ≤ 5 % of surface |
| Type | **IRANYekanX** Regular/Medium/Bold/Black; golden-ratio scale 16→21(H3,Bold)→34(H2,Black)→55(H1,Black)→89→144; body line-height 170 % (150–190 allowed), headings 1.25; **no 600 weight exists** (700 = strong); **letter-spacing in Persian: 0 (never increase)**. Font file provided: `assets/raw/IRANYekanXVFaNumVF.woff` (variable, FaNum digits) |
| Icons | outline style, soft caps, fixed stroke; 24×24 grid @1.5 stroke base; sizes 20/24/32/40/48 ↔ stroke 1.25/1.5/2/2.5/3; min gap between parts = stroke width |
| Layout | radius 8 px (logo badge 3), border 1 px, spacing 4 px base / 8 px grid (site scale 8/12/16/24/40/64/80/120) |
| Motion | 0.1 / 0.2 / 0.3 s; `cubic-bezier(0.645,0.045,0.355,1)` in-out, `(0.215,0.61,0.355,1)` out |
| Logo | mark+type built on x-unit 14x/1x @68°; safe space = 14x all sides; light bg → black type, dark → white, low contrast → badge (flat white/black, radius 3); never recolor/effects |
| Assets | 37 bank-logo SVGs (old story-book) + logos/ + brandbook page PNGs |
| Voice | مطمئن، مهندسی‌شده، شفاف، سریع — professional, direct, no hype; vocabulary: درگاه پرداخت، تسویه، پوشش بانکی (avoid: اغراق فروش، اصطلاحات مبهم) |

**Implementation stance:** copy `system/variables.css` into the app as the single token
source (brand-* custom properties); do not link into the archive at runtime. Fonts: bundle
the provided `IRANYekanXVFaNumVF.woff` (challenge-provided archive; FaNum digits match our
Persian-numeral rule) with Vazirmatn fallback — licensing note in ADR-0008.

---

## 1–3. Earlier live-scrape extraction (provenance; values confirmed by §0)

## 1. Is there an official design system?

**No current public one.** GitHub org (`github.com/ZarinPal`) holds only:

| Repo | What | Status |
|---|---|---|
| `ZarinPal/story-book` | SCSS design system + Storybook: fonts (IRANYekan fanum family, YekanBakh, Roboto Mono), custom `ZarinPal` icon font, **37 Iranian bank logo SVGs** (`src/images/Logo-bank/`) | last push Jun 2021, pre-rebrand |
| `ZarinPal/web-components-storybook` | "showcase of ZarinPal new web components" (HTML) | Feb 2022 |
| `ZarinPal/Panel` | old merchant panel, Vue 2 + Vuex | archived (2021) |

Everything else is SDKs/docs. The 2024 rebrand identity has no published token sheet —
so we extract from live properties.

## 2. Extracted brand tokens (current, post-rebrand «بدون مرز»)

Verified from inline SVG fills on next.zarinpal.com/beta/panel and zarinpal.com:

| Token | Value | Where observed |
|---|---|---|
| Brand gold (gradient) | `#FFD60A → #F0BA09` | new-panel logo mark |
| Electric blue | `#0A33FF` (+ deep gradient `#051A80 → #0A33FF`) | panel logo mark; marketing-site check icons |
| Ink | `#2E2E38` (wordmark), `#19191A` (line-icon strokes) | panel wordmark; site icons |
| Neutral surface | `#F1F1F3` fills on white | marketing site |
| Star/rating gold | `#FFD60A` | site testimonials |
| Typeface | **IRANYekanX** (`IRANYekanXVF` variable font) on the new panel; legacy system: IRANYekan + YekanBakh, **Roboto Mono for digits** | panel HTML class; story-book fonts |

Identity concept (rebrand statement, dmboard 2024-01): the eternal **yellow now finds
meaning alongside a spectrum of colors and geometric shapes** — "بدون مرز" (borderless).
Practical read for us: warm gold brand moment + a per-domain color spectrum is on-brand;
strict single-accent monochrome is not.

## 3. What we adopt (ADR-0008 addendum)

- **Palette**: ink-on-light base (`#19191A` text, white cards, `#F1F1F3` page fill);
  gold `#FFD60A` reserved for brand moments + the impact chip tint; electric blue
  `#0A33FF` for primary actions/links; insight severity uses its own semantic set
  (red ↓risk/anomaly, green ↑positive, amber watch, blue benchmark) — spectrum, per the
  rebrand concept.
- **Type**: brand font IRANYekanX is **commercially licensed — we must not bundle it**.
  Substitute: **Vazirmatn (OFL)** — same geometric-humanist Persian genre; ADR-0008's
  choice stands, now with provenance. Digits: Latin + tabular in tables/charts; mono
  stack (`ui-monospace`) in the «محاسبه» SQL view (their own old system used Roboto Mono
  for numbers — same convention).
- **Asset steal**: bank logo pack (37 SVGs, `story-book/src/images/Logo-bank/`) →
  `public/banks/` for issuer-bank displays (check license note in repo; MIT-style usage
  in their own public repo, attribute in README).
- **Shape language**: rounded cards, 2.5px-stroke line icons at 40px (matches site icon
  set), geometric accent shapes for empty states.

## Sources (fetched 2026-08-21)

- https://www.zarinpal.com/ (live; icon strokes `#19191A`, check `#0A33FF`, stars `#FFD60A`)
- https://next.zarinpal.com/beta/panel (live; logo SVG gradient stops `#FFD60A/#F0BA09`,
  `#051A80/#0A33FF`, wordmark `#2E2E38`, font class `IRANYekanXVF`)
- https://github.com/orgs/ZarinPal/repositories (27 repos, UI repos listed above)
- https://github.com/ZarinPal/story-book (file tree: fonts, bank logos)
- https://dmboard.media/news/zarrinpal-rebrand/ (rebrand statement «بدون مرز», 2024-01)
