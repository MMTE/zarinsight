# StatusPill

Compact, RTL-first pill for showing a payment's state in transaction tables, receipts, and dashboards.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `status` | `'success' \| 'pending' \| 'failed' \| 'refunded' \| 'inProgress'` | — | Payment state. Drives label, color, and icon. |
| `label` | `string` | status default | Override the built-in Persian label. |
| `hideIcon` | `boolean` | `false` | Replace the icon with a small colored dot. |
| `size` | `'sm' \| 'md'` | `'md'` | `sm` for dense tables. |
| `className` | `string` | `''` | Extra classes. |

## Default labels

- `success` → پرداخت موفق (green)
- `pending` → در انتظار پرداخت (amber)
- `failed` → پرداخت ناموفق (red)
- `refunded` → بازگشت وجه (slate)
- `inProgress` → در حال بررسی (blue, spinning icon)

## Usage

```tsx
import { StatusPill } from 'components/StatusPill'

<StatusPill status="success" />
<StatusPill status="failed" size="sm" />
<StatusPill status="pending" hideIcon label="منتظر تایید" />
```

Renders `dir="rtl"` with `role="status"` so screen readers announce state changes.
