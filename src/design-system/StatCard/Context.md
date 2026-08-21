# StatCard

RTL metric card showing a monetary amount in Persian numerals with a small currency-unit chip, plus an optional label icon and trend indicator.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Metric label (Persian copy). |
| `amount` | `number` | — | Value; formatted with thousands separators and Persian digits. |
| `unit` | `string` | `'ریال'` | Currency unit rendered in the chip. |
| `trend` | `{ direction: 'up' \| 'down' \| 'neutral'; value: number; caption?: string }` | — | Optional trend pill with percentage and comparison caption. |
| `icon` | `ReactNode` | — | Optional icon rendered in a soft blue tile. |
| `loading` | `boolean` | `false` | Shows a skeleton in place of the value. |
| `className` | `string` | `''` | Extra classes on the card root. |

## Usage

```tsx
import { WalletIcon } from 'lucide-react'
import { StatCard } from 'components/StatCard'

<StatCard
  label="درآمد امروز"
  amount={3820500}
  icon={<WalletIcon className="h-5 w-5" />}
  trend={{ direction: 'up', value: 12.4, caption: 'نسبت به دیروز' }}
/>
```

## Notes

- The card sets `dir="rtl"` itself, so it works inside LTR layouts.
- `toPersianDigits` and `formatPersianAmount` are exported for reuse elsewhere.
- Use in a responsive grid (e.g. `grid gap-4 sm:grid-cols-2 lg:grid-cols-4`) for dashboard summaries.
