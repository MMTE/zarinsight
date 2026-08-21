# Tooltip

Short hover/focus hint for icon-only controls and truncated labels. Renders a dark bubble with an arrow, positioned relative to its trigger, animated with framer-motion.

## Usage

```tsx
import { Tooltip } from 'components/Tooltip'

<Tooltip content="Notifications">
  <button aria-label="Notifications">
    <BellIcon className="h-5 w-5" />
  </button>
</Tooltip>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `content` | `ReactNode` | — | Text or nodes shown in the bubble. |
| `children` | `ReactElement` | — | Single trigger element; must accept DOM event handlers. |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Side of the trigger to anchor to. |
| `delay` | `number` | `150` | Hover open delay in ms (focus always opens instantly). |
| `disabled` | `boolean` | `false` | Suppresses the tooltip. |
| `className` | `string` | `''` | Extra classes on the bubble. |

## Behavior & accessibility

- Opens on hover (after `delay`) and instantly on keyboard focus; closes on mouse leave, blur, or `Escape`.
- Bubble uses `role="tooltip"` and is wired to the trigger via `aria-describedby`.
- The bubble is `pointer-events-none`, so it never blocks the trigger.
- Tooltips are hints only — never put essential or interactive content inside; always keep an `aria-label` on icon-only buttons.
