# ChartCard

Dashboard card that houses a revenue line/area chart with a title block, optional summary value and trend badge, and a period selector in the header. RTL by default, using the Zarinpal surface, border, text, and status tokens. Built on `recharts`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | Card heading (also used as the tooltip series name). |
| `description` | `string` | — | Supporting text under the title. |
| `value` | `string` | — | Preformatted summary value. |
| `change` | `number` | — | Percent change; positive = success badge, negative = failed badge. |
| `periods` | `ChartCardPeriod[]` | ۷ روز / ۳۰ روز / ۱۲ ماه | Options in the header segmented selector. |
| `selectedPeriod` | `string` | — | Controlled selected period id. |
| `defaultPeriod` | `string` | first period | Uncontrolled initial period. |
| `onPeriodChange` | `(id: string) => void` | — | Fired when a period is chosen. |
| `data` | `ChartCardPoint[]` | — | `{ label, value }` series points. |
| `variant` | `'area' \| 'line'` | `'area'` | Chart rendering style. |
| `height` | `number` | `260` | Chart area height in px. |
| `formatValue` | `(v: number) => string` | fa-IR locale | Formats y-axis ticks and tooltip values. |
| `loading` | `boolean` | `false` | Shows the loading state. |
| `error` | `string` | — | Shows the error state with this message. |
| `className` | `string` | `''` | Extra classes on the card root. |

An empty `data` array renders a built-in empty state.

## Usage

```tsx
import { ChartCard } from 'components/ChartCard'

<ChartCard
  title="درآمد کل"
  value="۲۷٬۸۰۰٬۰۰۰ تومان"
  change={12.4}
  data={points}
  selectedPeriod={period}
  onPeriodChange={setPeriod}
/>
```
