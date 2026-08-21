# Avatar

Circular (or rounded-square) user representation used in the top bar, menus, tables, and comment threads. Shows a photo when available, otherwise falls back to initials, then to a generic user glyph.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | `string` | – | Image URL. Falls back to initials if missing or if loading fails. |
| `name` | `string` | – | Full name; used for alt text, tooltip, and derived initials. |
| `initials` | `string` | – | Explicit initials override (e.g. `"+3"` for overflow counts). |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | 24 / 32 / 40 / 48 / 64 px. |
| `square` | `boolean` | `false` | Rounded square instead of a circle. |
| `status` | `'online' \| 'offline' \| 'busy' \| 'away'` | – | Presence dot in the bottom-right corner. |
| `ring` | `boolean` | `false` | White ring, for overlapping/stacked groups. |
| `onClick` | `() => void` | – | Renders as a focusable button (top-bar account menu trigger). |
| `className` | `string` | `''` | Extra classes on the avatar surface. |

Also exports `getInitials(name)` for deriving initials elsewhere.

## Usage

```tsx
import { Avatar } from 'components/Avatar'

// Top bar account trigger
<Avatar src={user.photoUrl} name={user.fullName} onClick={openMenu} />

// Initials fallback with presence
<Avatar name="Sara Ahmadi" status="online" />

// Stacked group
<div className="flex -space-x-2">
  <Avatar name="Sara Ahmadi" size="sm" ring />
  <Avatar name="Ali Karimi" size="sm" ring />
  <Avatar initials="+3" size="sm" ring />
</div>
```

## Notes

- Keyboard focus shows a brand-blue focus ring only when the avatar is interactive.
- Neutral slate surface keeps the avatar quiet against the light top bar; the brand blue is reserved for actions.
