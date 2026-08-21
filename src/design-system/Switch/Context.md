# Switch

Toggle control for boolean settings such as notification preferences, feature flags, and account options. Uses the brand blue for the "on" state and a neutral slate track when off.

## When to use

- Immediate on/off settings that apply without a save action.
- Settings rows where a short label and optional description explain the toggle.

For choices that require confirming a form, use a checkbox instead.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `checked` | `boolean` | — | Controlled state. Omit for uncontrolled usage. |
| `defaultChecked` | `boolean` | `false` | Initial state when uncontrolled. |
| `onChange` | `(checked: boolean) => void` | — | Called with the next state on toggle. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Track and thumb size. |
| `disabled` | `boolean` | `false` | Blocks interaction and dims the control. |
| `label` | `string` | — | Visible label rendered beside the switch. |
| `description` | `string` | — | Helper text below the label. |
| `aria-label` | `string` | — | Accessible name when no visible `label` is set. |
| `id`, `name`, `className` | `string` | — | Standard passthroughs. |

## Usage

```tsx
import { Switch } from 'components/Switch'

// Uncontrolled
<Switch label="Push notifications" description="Alert me on new payments." />

// Controlled
const [enabled, setEnabled] = useState(false)
<Switch checked={enabled} onChange={setEnabled} aria-label="Enable notifications" />
```

## Accessibility

- Rendered as a `<button role="switch">` with `aria-checked`, so it is keyboard operable with Space/Enter.
- Provide either `label` or `aria-label`; `description` is wired via `aria-describedby`.
- Visible focus ring uses the brand blue with an offset.
