# Input

Single-line text field for forms. Defaults to RTL and uses logical spacing (`ps-*` / `pe-*`, `start-*` / `end-*`) so labels, icons, and text align correctly in both RTL and LTR.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | – | Visible label above the field |
| `helperText` | `string` | – | Hint below the field (hidden when `error` is set) |
| `error` | `string` | – | Error message; switches the field to its error state |
| `startIcon` | `ReactNode` | – | Icon at the logical start (right in RTL) |
| `endIcon` | `ReactNode` | – | Icon at the logical end (left in RTL) |
| `inputSize` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height and type scale |
| `fullWidth` | `boolean` | `true` | Stretch to the container width |
| `dir` | `'rtl' \| 'ltr'` | `'rtl'` | Text direction |
| ...rest | `input` attributes | – | `value`, `onChange`, `disabled`, `required`, `type`, etc. |

Forwards its ref to the underlying `<input>`.

## Usage

```tsx
import { Input } from 'components/Input'
import { SearchIcon } from 'lucide-react'

<Input
  label="جستجو"
  placeholder="جستجو در تراکنش‌ها"
  startIcon={<SearchIcon size={18} />}
/>

<Input
  label="شماره موبایل"
  required
  error="شماره موبایل باید ۱۱ رقم باشد."
/>
```

## Accessibility

- Label is bound with `htmlFor` / `id`; an id is generated when not supplied.
- Helper and error text are linked via `aria-describedby`; errors set `aria-invalid` and `role="alert"`.
- Focus ring uses the brand blue (red in the error state).
