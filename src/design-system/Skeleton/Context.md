# Skeleton

Loading placeholder blocks used while data is being fetched. Includes a base `Skeleton` primitive plus composed layouts for cards, table rows, and charts.

## When to use
- Replace content areas during initial data loads (dashboards, tables, charts).
- Prefer skeletons over spinners when the final layout is known, so the page does not shift.

## Exports
- `Skeleton` — base block.
- `SkeletonText` — stacked text lines.
- `SkeletonCard` — card with optional avatar/media.
- `SkeletonTable` — header + rows grid.
- `SkeletonChart` — bar chart with header and axis labels.

## Props

### Skeleton
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'rect' \| 'text' \| 'circle'` | `'rect'` | Shape of the block. |
| `width` | `string \| number` | – | CSS width. |
| `height` | `string \| number` | – | CSS height. |
| `animate` | `boolean` | `true` | Pulse animation. |
| `label` | `string` | `'Loading'` | Accessible label. |

### SkeletonText
`lines` (3), `lastLineWidth` ('60%'), `animate`, `className`.

### SkeletonCard
`avatar` (true), `media` (false), `lines` (3), `animate`, `className`.

### SkeletonTable
`rows` (5), `columns` (4), `header` (true), `animate`, `className`.

### SkeletonChart
`bars` (7), `height` ('14rem'), `header` (true), `animate`, `className`.

## Usage

```tsx
import { Skeleton, SkeletonCard, SkeletonTable, SkeletonChart } from 'components/Skeleton'

{isLoading ? <SkeletonTable rows={6} columns={5} /> : <TransactionsTable data={data} />}

{isLoading ? <SkeletonChart bars={8} /> : <RevenueChart data={data} />}

<Skeleton variant="circle" width="2.5rem" height="2.5rem" />
```

## Accessibility
Each composite exposes `role="status"` with a descriptive `aria-label`; inner blocks are `aria-hidden` so screen readers announce a single loading message. Set `animate={false}` for reduced-motion contexts.
