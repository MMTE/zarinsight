# RadioGroup

Single-choice group for settlement, payout, and settings options. Composed of `RadioGroup` (container, label, error) and `RadioGroupItem` (individual option). Works controlled or uncontrolled.

## Props — RadioGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | – | Group label rendered above the options |
| `description` | `string` | – | Helper text under the label |
| `value` | `string` | – | Controlled selected value |
| `defaultValue` | `string` | – | Initial value when uncontrolled |
| `name` | `string` | auto | Shared radio input name |
| `disabled` | `boolean` | `false` | Disables all options |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout direction |
| `error` | `string` | – | Error message; marks the group invalid |
| `onChange` | `(value: string) => void` | – | Fired on selection change |
| `className` | `string` | – | Extra classes on the wrapper |

## Props — RadioGroupItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | – | Option value (required) |
| `label` | `ReactNode` | – | Primary label (required) |
| `description` | `ReactNode` | – | Secondary line |
| `trailing` | `ReactNode` | – | Trailing content (amount, badge) |
| `disabled` | `boolean` | `false` | Disables the single option |
| `variant` | `'plain' \| 'card'` | `'plain'` | Card renders a bordered, selectable surface |

## Usage

```tsx
import { RadioGroup, RadioGroupItem } from 'components/RadioGroup'

const [cycle, setCycle] = useState('daily')

<RadioGroup label="Settlement cycle" value={cycle} onChange={setCycle}>
  <RadioGroupItem value="daily" label="Daily" description="Every business day" />
  <RadioGroupItem value="weekly" label="Weekly" />
</RadioGroup>
```

## Notes

- Native radio inputs keep arrow-key navigation and form submission working; the container uses `role="radiogroup"` with the label and error wired via `aria-labelledby` / `aria-describedby`.
- Selection uses the brand blue; focus shows a visible blue focus ring.
- Use `variant="card"` for higher-stakes choices such as picking a settlement bank account.
