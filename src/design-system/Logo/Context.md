# Logo

The Zarinpal brandmark. Renders the official logo artwork as a full lockup, a cropped logomark, or a badge (mark on a solid rounded plate) for busy or low-contrast backgrounds.

## Usage

```tsx
import { Logo } from 'components/Logo'

<Logo />                                   // full lockup, brand color, md
<Logo variant="mark" size="lg" />          // logomark only
<Logo variant="badge" badgeBackground="black" tone="white" size="xl" />
<Logo tone="white" />                      // on a dark surface
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'lockup' \| 'mark' \| 'badge'` | `'lockup'` | Lockup = mark + logotype; mark = square crop of the logomark; badge = mark centered on a solid plate. |
| `tone` | `'color' \| 'black' \| 'white'` | `'color'` | Ink treatment. Use `white` on dark surfaces, `black` for single-ink contexts. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Height of the mark: 20 / 28 / 40 / 56 px. |
| `badgeBackground` | `'white' \| 'black'` | `'white'` | Plate color, `badge` variant only. |
| `label` | `string` | `'Zarinpal'` | Accessible name. Pass `''` when the logo is decorative next to visible brand text. |
| `className` | `string` | `''` | Extra classes on the wrapper. |

## Notes

- Badge corner radius follows the brand rule `3a`, where `a = height / 14`.
- The logotype is right-to-left; the mark crop is anchored to the trailing (right) edge of the artwork.
- Always keep clear space of at least the mark height around the lockup.
