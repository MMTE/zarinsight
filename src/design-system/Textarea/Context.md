# Textarea

Multi-line text field for longer form entries such as support notes, refund reasons, and descriptions. Matches the Input component's border, radius, focus ring, and label/hint/error anatomy.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | – | Visible label rendered above the field |
| `hint` | `string` | – | Helper text below the field (hidden when `error` is set) |
| `error` | `string` | – | Error message; switches the field to the invalid state |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Padding, type scale, and minimum height |
| `fullWidth` | `boolean` | `true` | Stretch to the parent's width |
| `showCount` | `boolean` | `false` | Show a live character counter (requires `maxLength`) |
| `resize` | `'none' \| 'vertical' \| 'both'` | `'vertical'` | Resize behaviour |

All native `<textarea>` attributes (`rows`, `maxLength`, `placeholder`, `disabled`, `required`, `value`, `onChange`, …) are forwarded, and the ref is forwarded to the underlying element.

## Usage

```tsx
import { Textarea } from 'components/Textarea'

<Textarea
  label="Support note"
  placeholder="Describe the issue in detail…"
  hint="Include transaction IDs where possible."
  maxLength={500}
  showCount
/>
```

Controlled:

```tsx
const [note, setNote] = useState('')

<Textarea
  label="Refund reason"
  value={note}
  onChange={(e) => setNote(e.target.value)}
  error={note.length < 20 ? 'Please provide at least 20 characters.' : undefined}
/>
```

## Accessibility

- Label is associated via `htmlFor` / `id`; an id is generated when not supplied.
- `aria-invalid` is set in the error state and `aria-describedby` points at the hint or error text.
- Required fields render a visual asterisk plus the native `required` attribute.
