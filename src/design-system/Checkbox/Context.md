# Checkbox

Binary selection control for forms and table row selection. Supports checked, unchecked, indeterminate, disabled, and error states, with an optional label and description.

## Usage

```tsx
import { Checkbox } from 'components/Checkbox'

<Checkbox
  label="Enable instant settlement"
  description="Funds are transferred within minutes."
  checked={enabled}
  onChange={(e) => setEnabled(e.target.checked)}
/>
```

Select-all pattern for tables:

```tsx
<Checkbox
  label="Select all"
  checked={allSelected}
  indeterminate={someSelected && !allSelected}
  onChange={(e) => toggleAll(e.target.checked)}
/>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | — | Visible label next to the control |
| `description` | `ReactNode` | — | Supporting text under the label |
| `error` | `string` | — | Error message; renders the control in an error state |
| `indeterminate` | `boolean` | `false` | Partially selected state for "select all" controls |
| `size` | `'sm' \| 'md'` | `'md'` | `sm` for dense tables, `md` for forms |
| `disabled` | `boolean` | `false` | Disables interaction |
| ...rest | `input` attributes | — | All native checkbox props (`checked`, `defaultChecked`, `onChange`, `name`, `value`, …) |

Forwards a ref to the underlying `<input type="checkbox">`.

## Behavior & accessibility

- Uses a real native checkbox input, so keyboard (Space) and form submission work by default.
- Label is associated via `htmlFor`; an id is generated automatically when not provided.
- `description` and `error` are wired through `aria-describedby`; the error state also sets `aria-invalid`.
- Visible focus ring on keyboard focus; brand blue (`blue-600`) is used for the selected fill.
