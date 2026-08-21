# Table

RTL data table for payment transactions. Columns run right-to-left: payment ID → Jalali date → amount → status pill.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `rows` | `TransactionRow[]` | — | Transaction rows to render. |
| `loading` | `boolean` | `false` | Renders skeleton rows. |
| `error` | `string` | — | Replaces the body with an error message. |
| `emptyMessage` | `string` | `'تراکنشی یافت نشد.'` | Shown when `rows` is empty. |
| `caption` | `string` | `'فهرست تراکنش‌ها'` | Screen-reader caption. |
| `currencyLabel` | `string` | `'تومان'` | Suffix after each amount. |
| `onRowClick` | `(row) => void` | — | Makes rows clickable/keyboard focusable. |
| `className` | `string` | `''` | Extra classes on the wrapper. |

`TransactionRow`: `{ id: string; date: string; amount: number; status: 'success' | 'pending' | 'failed' | 'refunded' }`

Amounts are formatted with `fa-IR` digit grouping. Dates are passed in already-formatted Jalali strings.

## Usage

```tsx
import { Table } from 'components/Table'

<Table
  rows={[{ id: 'A00000000123456789', date: '۱۴۰۳/۰۵/۲۱', amount: 1250000, status: 'success' }]}
  onRowClick={(row) => open(row.id)}
/>
```

Also exports `StatusPill` and `formatAmount` for reuse in adjacent transaction UI.
