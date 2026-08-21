# Breadcrumbs

RTL-ordered path trail for nested dashboard pages. Renders a `nav` landmark with an ordered list, chevrons pointing left (the RTL "forward" direction), and the current page marked with `aria-current="page"`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `BreadcrumbItem[]` | — | Ordered trail from root to current page. The last item is always rendered as the current page. |
| `showHomeIcon` | `boolean` | `false` | Shows a home icon before the first item. |
| `maxItems` | `number` | — | Collapses the middle of the trail behind an ellipsis when the trail is longer than this. |
| `ariaLabel` | `string` | `'مسیر صفحه'` | Accessible label for the nav landmark. |
| `className` | `string` | `''` | Extra classes on the `nav` element. |

`BreadcrumbItem`: `{ label: string; href?: string; onClick?: () => void }`. Items without `href`/`onClick` (and the last item) render as plain text.

## Usage

```tsx
import { Breadcrumbs } from 'components/Breadcrumbs'

<Breadcrumbs
  showHomeIcon
  maxItems={4}
  items={[
    { label: 'خانه', href: '/' },
    { label: 'درگاه پرداخت', onClick: () => navigate('/gateways') },
    { label: 'تنظیمات' },
  ]}
/>
```

## Notes

- Always place this above the page title in dashboard layouts; keep labels short since they truncate.
- Use `onClick` for client-side routing — the component calls `preventDefault()` automatically.
- Links use the brand blue hover state; the current page is slate-900 semibold.
