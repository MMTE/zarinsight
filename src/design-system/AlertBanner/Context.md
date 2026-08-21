# AlertBanner

A tinted, full-width banner for warnings and account notices. Shows a leading icon, optional bold title, body copy, an optional outlined pill action button, and an optional dismiss button. Defaults to RTL to match the brand.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tone` | `'danger' \| 'warning'` | `'warning'` | Light red or light amber tint. |
| `title` | `string` | – | Bold headline above the body copy. |
| `children` | `ReactNode` | – | Body copy (required). |
| `actionLabel` | `string` | – | Label for the outlined action button; omit to hide it. |
| `onAction` | `() => void` | – | Action button handler. |
| `dismissible` | `boolean` | `false` | Shows a close button. |
| `onDismiss` | `() => void` | – | Close button handler. |
| `icon` | `ReactNode` | tone default | Override the leading icon. |
| `dir` | `'rtl' \| 'ltr'` | `'rtl'` | Text direction. |
| `className` | `string` | `''` | Extra classes on the container. |

## Usage

```tsx
import { AlertBanner } from 'components/AlertBanner'

<AlertBanner
  tone="warning"
  title="احراز هویت ناقص است"
  actionLabel="تکمیل اطلاعات"
  onAction={openKyc}
>
  برای فعال‌سازی درگاه پرداخت، اطلاعات هویتی خود را تکمیل کنید.
</AlertBanner>
```

## Notes

- Renders as `role="status"` with `aria-live="polite"`; use for non-blocking page-level notices.
- Stacks vertically on small screens and becomes a single row from `sm` up.
