# EmptyState

Centered placeholder block for tables, panels, and lists that have no data yet. Shows a circular glyph, a title, an optional description, and up to two actions. Defaults to RTL to match the brand's Persian UI.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | Required. Short reason the area is empty. |
| `description` | `string` | — | Supporting sentence explaining the next step. |
| `icon` | `ReactNode` | inbox glyph | Custom icon/illustration rendered inside the circle. |
| `action` | `{ label, onClick?, href? }` | — | Primary blue pill button. |
| `secondaryAction` | `{ label, onClick?, href? }` | — | Low-emphasis text button. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Vertical density and glyph/text scale. |
| `bordered` | `boolean` | `false` | Dashed placeholder border around the block. |
| `dir` | `'rtl' \| 'ltr'` | `'rtl'` | Text direction. |
| `className` | `string` | `''` | Extra classes on the wrapper. |
| `children` | `ReactNode` | — | Extra content between the copy and the actions. |

## Usage

```tsx
import { EmptyState } from 'components/EmptyState'

<EmptyState
  bordered
  title="هنوز تراکنشی ثبت نشده است"
  description="پس از اولین پرداخت موفق، تراکنش‌ها اینجا نمایش داده می‌شوند."
  action={{ label: 'ایجاد درگاه جدید', onClick: createGateway }}
  secondaryAction={{ label: 'راهنمای شروع', href: '/docs' }}
/>
```

## Guidance

- Use inside an empty table body or card, not as a full-page state.
- Keep the title under ~6 words and the description to one sentence.
- Only include an action when there is a real next step; otherwise title + description is enough.
- The wrapper carries `role="status"` so screen readers announce the empty result.
