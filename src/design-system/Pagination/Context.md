# Pagination

Page navigation control for tables and lists. Defaults to RTL (Persian) with mirrored prev/next arrows and Persian digits; supports LTR via `dir="ltr"`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `page` | `number` | — | Current page, 1-indexed. |
| `totalPages` | `number` | — | Total page count. |
| `onPageChange` | `(page: number) => void` | — | Called with the requested page (clamped to range). |
| `siblingCount` | `number` | `1` | Pages shown on each side of the current page. |
| `dir` | `'rtl' \| 'ltr'` | `'rtl'` | Direction; RTL mirrors arrows and uses Persian digits/labels. |
| `size` | `'sm' \| 'md'` | `'md'` | Compact or default control height. |
| `disabled` | `boolean` | `false` | Disables all controls. |
| `ariaLabel` | `string` | localized | Label for the `nav` landmark. |
| `className` | `string` | `''` | Extra classes on the nav wrapper. |

## Usage

```tsx
const [page, setPage] = useState(1)

<Pagination page={page} totalPages={12} onPageChange={setPage} />
```

## Notes

- Active page uses the brand blue fill; other pages are neutral outlined buttons.
- The active button carries `aria-current="page"`; ellipses are non-interactive.
- Prev/next labels collapse to icon-only below the `sm` breakpoint.
- `getPageRange(page, totalPages, siblingCount)` is exported for custom layouts.
