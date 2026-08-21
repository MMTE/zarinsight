# IconButton

Square, icon-only button for toolbars, table row actions, and compact controls. Uses an 8px radius (`rounded-lg`), fixed square hit areas, and mirrors directional icons in RTL layouts.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Required accessible label (used for `aria-label` and tooltip `title`). |
| `icon` | `ReactNode` | — | Icon element, typically a `lucide-react` icon. Sized automatically. |
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'secondary'` | Visual style. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 32 / 40 / 48px square. |
| `loading` | `boolean` | `false` | Shows a spinner and disables the button. |
| `directional` | `boolean` | `false` | Horizontally mirrors the icon when inside `dir="rtl"`. |
| `disabled` | `boolean` | `false` | Non-interactive state. |

All other `<button>` attributes (`onClick`, `form`, `data-*`, …) are forwarded, and the ref points at the underlying `<button>`.

## Usage

```tsx
import { IconButton } from 'components/IconButton'
import { Trash2Icon, ChevronLeftIcon } from 'lucide-react'

<IconButton variant="danger" label="حذف ردیف" icon={<Trash2Icon />} onClick={remove} />

// Directional icon inside an RTL page
<IconButton directional label="قبلی" icon={<ChevronLeftIcon />} />
```

## Guidance

- Always pass a meaningful `label` — there is no visible text.
- Use `ghost` inside table rows, `secondary` in toolbars, `primary` for the single main action.
- Set `directional` only for arrows/chevrons so they flip with the reading direction.
