# FeatureCard

Icon + heading + description card used in marketing feature grids. Supports light and dark surfaces, start/center alignment, an optional action slot, and an optional link wrapper.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | `LucideIcon` | — | Icon component rendered in the tinted icon tile. Omit for a text-only card. |
| `title` | `string` | required | Card heading (renders as `h3`). |
| `description` | `string` | required | Supporting copy under the heading. |
| `action` | `ReactNode` | — | Optional CTA/link rendered below the description. |
| `variant` | `'light' \| 'dark'` | `'light'` | Surface treatment. Use `dark` over deep navy sections. |
| `align` | `'start' \| 'center'` | `'start'` | Content alignment. `start` is RTL-safe via logical text alignment. |
| `href` | `string` | — | Renders the card as an anchor so the whole card is clickable. |
| `className` | `string` | — | Extra classes for layout overrides. |

## Usage

```tsx
import { ShieldCheckIcon } from 'lucide-react'
import { FeatureCard } from 'components/FeatureCard'

<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  <FeatureCard
    icon={ShieldCheckIcon}
    title="Secure payments"
    description="Bank-grade encryption on every transaction."
  />
</div>
```

## Notes

- Cards use `h-full` so siblings in a grid stay equal height.
- Headings render as `h3`; place them under a section `h2` to keep hierarchy correct.
- The icon tile is `aria-hidden`, so the title and description carry all meaning.
