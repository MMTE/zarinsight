# Sidebar

Right-hand (RTL) collapsible navigation rail for the Zarinpal dashboard. Shows the brand logo, a Pal-blue active gateway card, outline nav icons with optional badges, and a support action pinned to the bottom.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `SidebarItem[]` | `defaultSidebarItems` | Nav entries: `{ id, label, icon, badge? }` (icon is a lucide-react component). |
| `activeId` | `string` | — | Controlled active item id. Omit for internal state. |
| `gatewayName` | `string` | `'فروشگاه زرین'` | Name in the blue gateway header card. |
| `gatewayMeta` | `string` | `'zarinshop.ir'` | Secondary line (domain/status). |
| `logoUrl` | `string` | Zarinpal logo | Logo image source. |
| `collapsed` | `boolean` | — | Controlled collapsed state. |
| `defaultCollapsed` | `boolean` | `false` | Initial collapsed state when uncontrolled. |
| `onCollapsedChange` | `(collapsed: boolean) => void` | — | Fired when the toggle is pressed. |
| `onSelect` | `(id: string) => void` | — | Fired when a nav item is chosen. |
| `className` | `string` | `''` | Extra classes on the `<aside>`. |

## Usage

```tsx
import { Sidebar } from 'components/Sidebar'

<div className="flex h-screen flex-row-reverse">
  <Sidebar activeId={section} onSelect={setSection} />
  <main className="flex-1 overflow-y-auto">{children}</main>
</div>
```

## Notes

- Width animates between `w-64` (expanded) and `w-[76px]` (collapsed); collapsed items expose their label via `title`.
- Active item uses `bg-blue-50` / `text-blue-700`; the gateway card uses solid `bg-blue-600`.
- The `<aside>` is `dir="rtl"` and labeled for screen readers; the toggle exposes `aria-expanded`.
