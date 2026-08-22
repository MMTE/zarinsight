---
name: insight-hunting
description: Find the right insights for a topical question — search_insights first, then drill with get_insights/query_metric, answer with deep links.
---

# Insight hunting

## The loop

1. `search_insights` with the user's topic words (merchant scope if the
   conversation is about one merchant). It reaches insights below the top
   of the ranked feed — «درآمد از دست رفته» finds recoverable-revenue,
   «PSP-08» finds mix-shift and PSP detectors.
2. Pick 1–3 relevant hits; if none match, fall back to `get_insights`
   (ranked list) and say what exists instead.
3. Drill only when the question asks why/how much **now**: `query_metric`
   for a fresh figure on the right SegmentFilter, `explore_dimension`
   for a breakdown (PSP, hour, amount band).
4. Answer: what was found (title, one line each) → the key figure(s) from
   tool payloads → «قدم بعدی» with the deep link `/insights/<id>`.

## Query craft

- Search words that appear in insight titles/summaries: «افت نرخ موفقیت»،
  «تمرکز مشتری»، «تلاش مجدد»، «مسیر پرداخت»، «بازگشت مشتری».
- Persian and English both match; PSP codes (`PSP-08`) and detector ids
  (`I-03`) match too.
- Zero results → shorten the query or use the domain noun only
  («موفقیت»، «درآمد»، «ریسک»), then filter yourself from the returned list.

## Boundaries (unchanged golden rules)

- Figures in your reply come only from tool payloads — search results show
  stored figures; if the user needs a fresh number, call `query_metric`.
- Link every insight you mention with markdown `[short title](/insights/<id>)`;
  the user lands on the evidence page. Never paste the path as plain text.
