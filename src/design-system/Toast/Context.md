# Toast

Transient notification for action feedback (success, error, warning, info), anchored to the top of the screen. RTL by default to match Zarinpal's Persian UI.

## Parts

- `Toast` — the visual notification card (use directly if you manage placement yourself).
- `ToastViewport` — animated, top-anchored stack; handles enter/exit motion and per-toast auto-dismiss timers.
- `ToastProvider` + `useToast()` — app-level queue. Wrap the app once, then call `toast({...})` anywhere.

## Props — `Toast`

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `title` | `string` | — | Required headline. |
| `description` | `string` | — | Optional supporting line. |
| `variant` | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | Sets icon and accent ring. |
| `onClose` | `() => void` | — | Shows the close button when provided. |
| `action` | `{ label: string; onClick: () => void }` | — | Inline action such as "تلاش دوباره". |
| `dir` | `'rtl' \| 'ltr'` | `'rtl'` | Text direction. |
| `className` | `string` | `''` | Extra classes. |

`ToastItem` = `ToastProps & { id: string; duration?: number }`. `duration` is ms (default `4000`, `0` disables auto-dismiss).

`ToastViewport` props: `toasts`, `onDismiss(id)`, `align` (`'start' | 'center' | 'end'`, default `center`), `fixed` (default `true`).

## Usage

```tsx
import { ToastProvider, useToast } from 'components/Toast'

function App() {
  return (
    <ToastProvider>
      <Checkout />
    </ToastProvider>
  )
}

function Checkout() {
  const { toast } = useToast()
  return (
    <button
      onClick={() =>
        toast({ variant: 'success', title: 'پرداخت با موفقیت انجام شد', duration: 4000 })
      }
    >
      پرداخت
    </button>
  )
}
```

Standalone card:

```tsx
<Toast
  variant="error"
  title="تراکنش ناموفق بود"
  description="موجودی حساب کافی نیست."
  action={{ label: 'تلاش دوباره', onClick: retry }}
  onClose={close}
/>
```

## Accessibility

- `role="alert"` / `aria-live="assertive"` for errors, `role="status"` / `polite` otherwise.
- Close button is keyboard focusable with a visible focus ring; icons are `aria-hidden`.
