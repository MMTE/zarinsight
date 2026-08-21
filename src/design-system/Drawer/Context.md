# Drawer

Right-anchored slide-over panel for contextual detail and edit views in RTL layouts. Renders in a portal on `document.body` with an overlay, spring slide animation (framer-motion), focus trap, Escape-to-close, and body scroll lock.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | — | Whether the panel is visible. |
| `onClose` | `() => void` | — | Called on overlay click, Escape, or close button. |
| `title` | `ReactNode` | — | Header title. |
| `description` | `ReactNode` | — | Secondary line under the title. |
| `children` | `ReactNode` | — | Scrollable body content. |
| `footer` | `ReactNode` | — | Sticky action area at the bottom. |
| `side` | `'right' \| 'left'` | `'right'` | Anchored edge. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Panel max width (full width below `sm`). |
| `showCloseButton` | `boolean` | `true` | Toggle header close button. |
| `closeOnOverlayClick` | `boolean` | `true` | Dismiss by clicking the overlay. |
| `dir` | `'rtl' \| 'ltr'` | `'rtl'` | Text direction of panel content. |
| `className` | `string` | `''` | Extra classes on the panel. |

## Usage

```tsx
const [open, setOpen] = useState(false)

<Drawer
  open={open}
  onClose={() => setOpen(false)}
  title="جزئیات تراکنش"
  description="شناسه پرداخت ۱۴۰۳۰۹۲۲-۸۸۴۵۱"
  footer={
    <div className="flex justify-end gap-3">
      <button className="rounded-full bg-blue-700 px-5 py-2 text-sm font-bold text-white">
        ذخیره
      </button>
    </div>
  }
>
  محتوای پنل
</Drawer>
```

## Notes

- Keep the trigger button focus-visible; focus returns to it automatically on close.
- Use `size="lg"` for forms, `size="sm"` for filter panels.
- Only render one Drawer at a time; nest content instead of stacking panels.
