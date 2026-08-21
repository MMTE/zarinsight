# CTASection

Closing marketing band that pairs a bold headline with a full-pill call-to-action button. Used at the end of landing pages to drive sign-ups. Defaults to RTL and the brand's dark navy band with a blue pill button.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `headline` | `string \| string[]` | — | Headline text. Pass an array to force line breaks. |
| `description` | `string` | — | Optional supporting paragraph. |
| `ctaLabel` | `string` | — | Button label. |
| `ctaHref` | `string` | — | Renders the CTA as a link when provided. |
| `onCtaClick` | `() => void` | — | Click handler used when no `ctaHref` is set. |
| `tone` | `'dark' \| 'light'` | `'dark'` | Band treatment. |
| `align` | `'start' \| 'center'` | `'center'` | Content alignment inside the band. |
| `dir` | `'rtl' \| 'ltr'` | `'rtl'` | Text direction. |
| `className` | `string` | `''` | Extra classes on the outer section. |

## Usage

```tsx
import { CTASection } from 'components/CTASection'

<CTASection
  headline={['بیش از ۱۵ سال انتخاب مطمئن', 'کسب‌وکارهای آنلاین']}
  description="زرین‌پال، اولین پرداخت‌یار کشور."
  ctaLabel="ورود یا ثبت‌نام"
  ctaHref="/signup"
/>
```

## Notes

- The band is a rounded container inside a full-width section, matching the site's inset card layout.
- Use `tone="light"` for mid-page CTAs so the dark band stays reserved for the page close.
