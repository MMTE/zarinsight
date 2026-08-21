# Button

Primary interactive control for actions across the product. Uses the Pal blue fill for primary
actions, Gold for secondary emphasis (promotions, upgrades), and an ~8px (`rounded-lg`) radius
for in-app surfaces.

## When to use

- **primary** — the single main action of a screen, form, or dialog (Pal blue `#1652F0`).
- **secondary** — accent/emphasis action such as an upgrade or promo (Gold `#FFC72C`, dark label). Use sparingly, at most one per view.
- **outline** — neutral secondary action next to a primary button.
- **ghost** — low-emphasis or tertiary actions (cancel, inline actions).
- **destructive** — irreversible actions (delete, revoke).

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'destructive'` | `'primary'` | Visual emphasis. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Heights: 36 / 44 / 52px. |
| `loading` | `boolean` | `false` | Shows a spinner, sets `aria-busy`, and disables the button. |
| `leadingIcon` | `ReactNode` | — | Icon rendered before the label (hidden while loading). |
| `trailingIcon` | `ReactNode` | — | Icon rendered after the label (hidden while loading). |
| `fullWidth` | `boolean` | `false` | Stretches to the container width. |
| `disabled` | `boolean` | `false` | Disables interaction and dims to 50% opacity. |
| `className` | `string` | — | Merged with the internal classes via `tailwind-merge`. |

All other native `<button>` attributes (`onClick`, `type`, `form`, `aria-*`, …) are forwarded.
`type` defaults to `"button"` — pass `type="submit"` inside forms.

## Usage

```tsx
import { Button } from 'components/Button'
import { PlusIcon } from 'lucide-react'

<Button onClick={handleSignup}>Sign up</Button>

<Button variant="outline" leadingIcon={<PlusIcon className="h-4 w-4" />}>
  New payment link
</Button>

<Button variant="destructive" loading={isDeleting}>
  Delete gateway
</Button>
```

## Notes

- Icons use `gap-2` spacing and flip automatically in RTL layouts because spacing is gap-based.
- Focus is always visible via a 2px ring offset from the button surface.
- Pair icons at `h-4 w-4` for `sm`/`md` and `h-5 w-5` for `lg`.
