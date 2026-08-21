# HeroSection

Dark navy marketing hero used at the top of landing pages. Rounded card surface with a soft navy glow, a bold multi-line headline, muted subcopy, a full-pill primary CTA, and an optional scroll-down cue. Defaults to RTL (Persian).

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string \| string[]` | — | Headline. Pass an array to render explicit line breaks. |
| `description` | `string` | — | Supporting paragraph below the headline. |
| `ctaLabel` | `string` | — | Primary CTA label. CTA is hidden when omitted. |
| `ctaHref` | `string` | — | Renders the CTA as an anchor when provided, otherwise a button. |
| `onCtaClick` | `() => void` | — | Click handler for the CTA. |
| `dir` | `'rtl' \| 'ltr'` | `'rtl'` | Text direction; flips content alignment and the glow. |
| `showScrollCue` | `boolean` | `true` | Shows the scroll-down tab at the bottom edge. |
| `className` | `string` | `''` | Extra classes on the section element. |

## Usage

```tsx
<HeroSection
  title={['بیش از ۱۵ سال انتخاب مطمئن', 'کسب‌وکارهای آنلاین']}
  description="زرین‌پال، اولین پرداخت‌یار کشور."
  ctaLabel="ورود یا ثبت‌نام"
  ctaHref="/signup"
/>
```

## Notes

- Content is right-aligned on large screens in RTL, and stacks full-width on mobile.
- The headline renders as `<h1>`; use only one per page.
- Set `showScrollCue={false}` when the hero is not the full-viewport section.
