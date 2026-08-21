# Navbar

Top application bar for the Zarinpal design system. Right-to-left layout: hamburger toggle and logo on the leading (right) side, tickets / notifications / avatar cluster on the trailing (left) side.

## Usage

```tsx
import { Navbar } from 'components/Navbar'

<Navbar
  ticketCount={2}
  notificationCount={12}
  userName="سارا محمدی"
  onMenuToggle={(open) => setSidebarOpen(open)}
/>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `menuOpen` | `boolean` | – | Controlled hamburger state. Omit for uncontrolled. |
| `onMenuToggle` | `(open: boolean) => void` | – | Fired with the next open state when the hamburger is pressed. |
| `notificationCount` | `number` | `0` | Unread notifications; `0` hides the badge, `>99` shows `+۹۹`. |
| `ticketCount` | `number` | `0` | Open support tickets; `0` hides the badge. |
| `userName` | `string` | `حساب کاربری` | Name shown next to the avatar and used for initials fallback. |
| `avatarUrl` | `string` | – | Avatar image; falls back to initials on a tinted brand circle. |
| `onTicketsClick` / `onNotificationsClick` / `onAvatarClick` | `() => void` | – | Action handlers. |
| `className` | `string` | `''` | Extra classes on the `<header>` element. |

## Notes

- Renders a semantic `<header>` + `<nav aria-label="اصلی">` with `dir="rtl"`.
- Fixed 64px height, white surface, `border-slate-200` hairline bottom border.
- Brand blue `#1652F0` is used for badges, focus rings, and the initials avatar tint.
- Username and chevron collapse below the `sm` breakpoint; icons stay visible.
