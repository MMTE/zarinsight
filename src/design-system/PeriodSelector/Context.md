# PeriodSelector

RTL segmented control for switching a chart's date range (۷ روز, ۳۰ روز, …). Renders as an accessible `radiogroup` with pill-shaped segments; the active segment uses the brand blue fill.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `PeriodOption[]` | — | Ranges to show. `PeriodOption = { value, label, disabled? }` |
| `value` | `string` | — | Currently selected range value (controlled) |
| `onChange` | `(value: string) => void` | — | Called when a range is selected |
| `label` | `string` | `'بازه زمانی'` | Accessible group label |
| `size` | `'sm' \| 'md'` | `'md'` | Density |
| `disabled` | `boolean` | `false` | Disables the whole control |
| `loading` | `boolean` | `false` | Pulses the control while data refreshes |
| `className` | `string` | — | Extra classes on the wrapper |

## Usage

```tsx
const [range, setRange] = useState('30d')

<PeriodSelector
  value={range}
  onChange={setRange}
  options={[
    { value: '7d', label: '۷ روز' },
    { value: '30d', label: '۳۰ روز' },
    { value: '90d', label: '۹۰ روز' },
  ]}
/>
```

## Notes

- Controlled only — always pass `value` and `onChange`.
- Arrow keys move between segments with RTL direction (ArrowLeft advances), `Home`/`End` jump to the ends.
- Pair it with the chart it controls and reflect `loading` while the new range is fetching.
