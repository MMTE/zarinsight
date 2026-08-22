# ADR-0008: Persian-first RTL UX for nontechnical merchants; mobile+desktop

## Status
Accepted 2026-08-21

## Context
challenge.md L17 (nontechnical merchants must grasp core findings without interpreting raw
data/complex charts), L47–49 (demo video must show mobile AND desktop), L64–66 (45 pts UX).

## Decision
- `<html lang="fa" dir="rtl">`; **IRANYekanX variable font** (from the challenge-provided
  brand archive `زرین_پال-Design-System/assets/raw/IRANYekanXVFaNumVF.woff` — FaNum digits
  match our Persian-numeral rule) with **Vazirmatn (OFL) fallback**; no 600 weight exists —
  strong text = 700; Persian letter-spacing stays 0; body line-height 1.7; digits stay
  Latin + tabular inside tables/charts; mono stack in «محاسبه» SQL view.
- **Insight cards are sentences, not charts**: title = plain Persian claim with the number
  inside («نرخ موفقیت پرداخت این هفته ۷ واحد درصد افت کرد»); chart optional, collapsed by
  default behind «نمودار».
- Reading order per card: what happened → why it matters (impact ریال) → confidence →
  actions («بررسی» = filtered drill-down, «محاسبه» = calculation view). Maximum 3 primary
  actions; everything else in the detail drawer.
- Overview = "سه تغییر مهم از بازدید قبل شما" (GA generated-insights pattern).
- Money humanized: «۵٫۲ میلیارد ریال», never `5282015249477`. تومان conversion avoided
  (source is IRR; converting invites rounding claims).
- Responsive: single column ≤768 px, cards reorder so impact-ranked insights stay on top;
  all drill-downs usable one-handed. Demo video records both widths from the same build.
- Empty/no-data states are full insight cards with the eligibility explanation (ADR-0003)
  — honesty visible, not hidden.
- **Official design system provided** (`زرین_پال-Design-System/`, from کتاب هویت بصری
  ۰.۱ — research doc §0): app consumes a copy of `system/variables.css` (218 `--brand-*`
  tokens, light + `.dark`) as the single token source. Key rules adopted: posture
  ۶۰٪ white/black · ۲۵٪ neutrals · ۱۰٪ Pal `#0A33FF` · ۵٪ other+gradients; severity colors
  = official semantic scales (Danger Red-600 / Warning Orange-600 / Success Green-600 /
  Info Blue-600) mapped to insight types; gold `#FFD60A` for the impact chip and brand
  moments only; golden-ratio type scale 16/21/34/55; radius 8 / border 1 / 4px-base
  spacing; outline icons 24-grid @1.5 stroke (2.5 at 40px); motion 0.1/0.2/0.3s with the
  official beziers; master gradient only as specified (≤5% surface). Bank-logo SVG pack
  (37 banks) for issuer-bank displays. Responsive contract = the archive's viewport
  matrix (360→1920; demo records 375 + desktop from one build).

## Consequences
- Chart library renders as evidence only; every screen answers "so what?" in text first.
- Copy is a deliverable: Persian strings live in one module (`src/copy/fa.ts`) reviewed as
  prose, not scattered JSX.
