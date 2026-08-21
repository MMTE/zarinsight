# Modal

Centered dialog for confirmations and focused tasks (e.g. settlement confirmation). Renders into `document.body` via a portal, dims the page with a blurred overlay, locks body scroll, and animates in with framer-motion. Defaults to RTL to match the Persian product UI.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | — | Controls visibility. |
| `onClose` | `() => void` | — | Called on overlay click, Escape, or close button. |
| `title` | `ReactNode` | — | Header title. |
| `description` | `ReactNode` | — | Supporting text under the title. |
| `children` | `ReactNode` | — | Body content. |
| `footer` | `ReactNode` | — | Action row at the bottom. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Max width of the dialog. |
| `showCloseButton` | `boolean` | `true` | Show the header X button. |
| `dismissible` | `boolean` | `true` | Allow overlay click / Escape to close. |
| `dir` | `'rtl' \| 'ltr'` | `'rtl'` | Text direction of the dialog. |

## Usage

```tsx
const [open, setOpen] = useState(false)

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="تأیید تسویه حساب"
  description="مبلغ قابل تسویه به حساب بانکی ثبت‌شده واریز می‌شود."
  footer={
    <>
      <button className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white">تأیید</button>
      <button onClick={() => setOpen(false)} className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-600 ring-1 ring-slate-200">انصراف</button>
    </>
  }
>
  مبلغ ۱٬۲۴۰٬۰۰۰ تومان به حساب شما واریز خواهد شد.
</Modal>
```

## Notes

- Use `dismissible={false}` with `showCloseButton={false}` for destructive or irreversible flows that require an explicit choice.
- The dialog panel receives focus on open and closes on Escape; place the primary action first in `footer` (right-most in RTL).
