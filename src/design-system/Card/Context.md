# Card

Base surface container for dashboard panels: white background, 1px hairline gray border, rounded corners, and a minimal shadow. Use it to group related content, stats, or forms.

## Props (`Card`)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Inner padding of the surface. |
| `elevation` | `'flat' \| 'low' \| 'medium'` | `'low'` | Shadow depth. |
| `interactive` | `boolean` | `false` | Adds hover border/shadow lift and a visible focus ring for clickable panels. |
| `as` | `'div' \| 'section' \| 'article' \| 'li'` | `'div'` | Rendered element for semantics. |
| `className` | `string` | – | Extra classes, merged last. |

All other `div` props (`onClick`, `role`, `tabIndex`, ...) are forwarded.

## Subcomponents

- `CardHeader` – flex row for title block plus trailing action/badge.
- `CardTitle` – heading (`as`: `h2 | h3 | h4`, defaults to `h3`).
- `CardDescription` – muted supporting text.
- `CardContent` – main body area with top spacing.
- `CardFooter` – right-aligned actions with a top divider.

## Usage

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from 'components/Card'

<Card>
  <CardHeader>
    <div>
      <CardTitle>Settlement summary</CardTitle>
      <CardDescription>Pending payouts for this week.</CardDescription>
    </div>
  </CardHeader>
  <CardContent>...</CardContent>
  <CardFooter>
    <button type="button">Settle now</button>
  </CardFooter>
</Card>
```

Use `padding="none"` when the card wraps edge-to-edge content such as a table or image.
