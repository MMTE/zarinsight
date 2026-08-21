# Select

RTL dropdown field for filters and forms. Wraps a native `<select>` (full keyboard and mobile support) with an appearance-none shell, brand focus ring, and a chevron pinned to the logical end of the field — which renders on the left in RTL, matching the Zarinpal site.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `SelectOption[]` | — | Required. `{ label, value, disabled? }` entries. |
| `label` | `string` | — | Visible field label. |
| `placeholder` | `string` | — | Disabled empty option shown when no value is selected. |
| `hint` | `string` | — | Helper text under the field. |
| `error` | `string` | — | Error message; switches the field to the error state and sets `aria-invalid`. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Field height and typography. |
| `fullWidth` | `boolean` | `true` | Stretch to the container width. |
| `disabled`, `required`, `value`, `defaultValue`, `onChange`, … | native `select` props | — | Forwarded to the underlying element. |

Ref is forwarded to the `<select>` element.

## Usage

```tsx
import { Select } from 'components/Select'

<Select
  label="نوع سرویس"
  placeholder="یک گزینه را انتخاب کنید"
  options={[
    { label: 'درگاه پرداخت اینترنتی', value: 'ipg' },
    { label: 'پرداخت مستقیم', value: 'direct' },
  ]}
  onChange={(e) => setService(e.target.value)}
/>
```

Error state:

```tsx
<Select
  label="بازه زمانی"
  required
  error="انتخاب بازه زمانی الزامی است."
  options={periods}
/>
```

## Notes

- The wrapper sets `dir="rtl"`, so labels, options, and messages align right by default.
- Use `hint` for guidance and `error` for validation; when both are set, `error` wins.
- Keep option labels short so they fit the field at `sm`.
