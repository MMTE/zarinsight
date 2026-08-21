# Badge

Small tinted label used for counts and general status tags outside payment flows (e.g. list counters, feature states, table row tags).

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'neutral' \| 'brand' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'neutral'` | Tonal color of the badge |
| `size` | `'sm' \| 'md'` | `'md'` | Compact or default size |
| `dot` | `boolean` | `false` | Shows a leading status dot in the current tone |
| `icon` | `ReactNode` | — | Optional leading icon (sized to 14px) |
| `children` | `ReactNode` | — | Label text or count |

Also accepts any `span` HTML attributes, including `className` for layout overrides.

## Usage

```tsx
import { Badge } from 'components/Badge'

<Badge variant="success" dot>Active</Badge>
<Badge variant="danger" size="sm">99+</Badge>
<Badge variant="brand" icon={<CheckIcon />}>Verified</Badge>
```

## Guidance

- Keep labels to one or two words; use counts for numbers.
- Use `danger`/`warning` sparingly so failure states stay noticeable.
- For payment-specific statuses, use the dedicated payment status component instead.
