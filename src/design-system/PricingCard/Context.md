# PricingCard

Plan card for marketing pricing sections: plan name, price block, feature list, and a pill-shaped CTA. Defaults to RTL (Persian) content, matching the Zarinpal site.

## Variants
- **Default** — white surface, light border, blue pill CTA.
- **Featured** — dark navy surface (`#161B2E`) with a blue badge, used for the highlighted plan.

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | Plan name (required) |
| `description` | `string` | — | Short supporting line under the name |
| `price` | `string` | — | Formatted price, e.g. `"۱۹۹٬۰۰۰"` or `"رایگان"` |
| `currency` | `string` | — | Currency suffix, e.g. `"تومان"` |
| `period` | `string` | — | Billing period, e.g. `"ماهانه"` |
| `features` | `PricingCardFeature[]` | — | `{ label, included? }`; `included: false` renders muted + struck-through |
| `ctaLabel` | `string` | `'شروع کنید'` | CTA text |
| `onCtaClick` | `() => void` | — | CTA handler |
| `featured` | `boolean` | `false` | Dark emphasized variant |
| `badge` | `string` | `'پیشنهاد ویژه'` | Badge text (featured only) |
| `disabled` | `boolean` | `false` | Disables the CTA |
| `dir` | `'rtl' \| 'ltr'` | `'rtl'` | Content direction |
| `className` | `string` | `''` | Extra classes on the card |

## Usage
```tsx
<PricingCard
  featured
  name="حرفه‌ای"
  price="۴۹۹٬۰۰۰"
  currency="تومان"
  period="ماهانه"
  features={[{ label: 'تسویه آنی' }, { label: 'گزارش پیشرفته' }]}
  onCtaClick={() => console.log('selected')}
/>
```

Cards stretch to `max-w-sm`; place several in a `grid gap-6 md:grid-cols-3` for a pricing row.
