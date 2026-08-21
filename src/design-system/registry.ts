// AUTO-GENERATED — do not edit manually.
// Re-run the design system builder to regenerate.

import type { ComponentPreviewModule } from './previewTypes';
import __AlertBannerPreviews from './AlertBanner/AlertBanner.previews';
import __AvatarPreviews from './Avatar/Avatar.previews';
import __BadgePreviews from './Badge/Badge.previews';
import __BreadcrumbsPreviews from './Breadcrumbs/Breadcrumbs.previews';
import __ButtonPreviews from './Button/Button.previews';
import __CTASectionPreviews from './CTASection/CTASection.previews';
import __CardPreviews from './Card/Card.previews';
import __ChartCardPreviews from './ChartCard/ChartCard.previews';
import __CheckboxPreviews from './Checkbox/Checkbox.previews';
import __DrawerPreviews from './Drawer/Drawer.previews';
import __EmptyStatePreviews from './EmptyState/EmptyState.previews';
import __FeatureCardPreviews from './FeatureCard/FeatureCard.previews';
import __HeroSectionPreviews from './HeroSection/HeroSection.previews';
import __IconButtonPreviews from './IconButton/IconButton.previews';
import __InputPreviews from './Input/Input.previews';
import __LogoPreviews from './Logo/Logo.previews';
import __ModalPreviews from './Modal/Modal.previews';
import __NavbarPreviews from './Navbar/Navbar.previews';
import __PaginationPreviews from './Pagination/Pagination.previews';
import __PeriodSelectorPreviews from './PeriodSelector/PeriodSelector.previews';
import __PricingCardPreviews from './PricingCard/PricingCard.previews';
import __RadioGroupPreviews from './RadioGroup/RadioGroup.previews';
import __SelectPreviews from './Select/Select.previews';
import __SidebarPreviews from './Sidebar/Sidebar.previews';
import __SkeletonPreviews from './Skeleton/Skeleton.previews';
import __StatCardPreviews from './StatCard/StatCard.previews';
import __StatusPillPreviews from './StatusPill/StatusPill.previews';
import __SwitchPreviews from './Switch/Switch.previews';
import __TablePreviews from './Table/Table.previews';
import __TabsPreviews from './Tabs/Tabs.previews';
import __TextareaPreviews from './Textarea/Textarea.previews';
import __ToastPreviews from './Toast/Toast.previews';
import __TooltipPreviews from './Tooltip/Tooltip.previews';
const __contextMd: Record<string, string> = {
  "AlertBanner": `# AlertBanner

A tinted, full-width banner for warnings and account notices. Shows a leading icon, optional bold title, body copy, an optional outlined pill action button, and an optional dismiss button. Defaults to RTL to match the brand.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`tone\` | \`'danger' \\| 'warning'\` | \`'warning'\` | Light red or light amber tint. |
| \`title\` | \`string\` | – | Bold headline above the body copy. |
| \`children\` | \`ReactNode\` | – | Body copy (required). |
| \`actionLabel\` | \`string\` | – | Label for the outlined action button; omit to hide it. |
| \`onAction\` | \`() => void\` | – | Action button handler. |
| \`dismissible\` | \`boolean\` | \`false\` | Shows a close button. |
| \`onDismiss\` | \`() => void\` | – | Close button handler. |
| \`icon\` | \`ReactNode\` | tone default | Override the leading icon. |
| \`dir\` | \`'rtl' \\| 'ltr'\` | \`'rtl'\` | Text direction. |
| \`className\` | \`string\` | \`''\` | Extra classes on the container. |

## Usage

\`\`\`tsx
import { AlertBanner } from 'components/AlertBanner'

<AlertBanner
  tone="warning"
  title="احراز هویت ناقص است"
  actionLabel="تکمیل اطلاعات"
  onAction={openKyc}
>
  برای فعال‌سازی درگاه پرداخت، اطلاعات هویتی خود را تکمیل کنید.
</AlertBanner>
\`\`\`

## Notes

- Renders as \`role="status"\` with \`aria-live="polite"\`; use for non-blocking page-level notices.
- Stacks vertically on small screens and becomes a single row from \`sm\` up.
`,
  "Avatar": `# Avatar

Circular (or rounded-square) user representation used in the top bar, menus, tables, and comment threads. Shows a photo when available, otherwise falls back to initials, then to a generic user glyph.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`src\` | \`string\` | – | Image URL. Falls back to initials if missing or if loading fails. |
| \`name\` | \`string\` | – | Full name; used for alt text, tooltip, and derived initials. |
| \`initials\` | \`string\` | – | Explicit initials override (e.g. \`"+3"\` for overflow counts). |
| \`size\` | \`'xs' \\| 'sm' \\| 'md' \\| 'lg' \\| 'xl'\` | \`'md'\` | 24 / 32 / 40 / 48 / 64 px. |
| \`square\` | \`boolean\` | \`false\` | Rounded square instead of a circle. |
| \`status\` | \`'online' \\| 'offline' \\| 'busy' \\| 'away'\` | – | Presence dot in the bottom-right corner. |
| \`ring\` | \`boolean\` | \`false\` | White ring, for overlapping/stacked groups. |
| \`onClick\` | \`() => void\` | – | Renders as a focusable button (top-bar account menu trigger). |
| \`className\` | \`string\` | \`''\` | Extra classes on the avatar surface. |

Also exports \`getInitials(name)\` for deriving initials elsewhere.

## Usage

\`\`\`tsx
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
\`\`\`

## Notes

- Keyboard focus shows a brand-blue focus ring only when the avatar is interactive.
- Neutral slate surface keeps the avatar quiet against the light top bar; the brand blue is reserved for actions.
`,
  "Badge": `# Badge

Small tinted label used for counts and general status tags outside payment flows (e.g. list counters, feature states, table row tags).

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`variant\` | \`'neutral' \\| 'brand' \\| 'success' \\| 'warning' \\| 'danger' \\| 'info'\` | \`'neutral'\` | Tonal color of the badge |
| \`size\` | \`'sm' \\| 'md'\` | \`'md'\` | Compact or default size |
| \`dot\` | \`boolean\` | \`false\` | Shows a leading status dot in the current tone |
| \`icon\` | \`ReactNode\` | — | Optional leading icon (sized to 14px) |
| \`children\` | \`ReactNode\` | — | Label text or count |

Also accepts any \`span\` HTML attributes, including \`className\` for layout overrides.

## Usage

\`\`\`tsx
import { Badge } from 'components/Badge'

<Badge variant="success" dot>Active</Badge>
<Badge variant="danger" size="sm">99+</Badge>
<Badge variant="brand" icon={<CheckIcon />}>Verified</Badge>
\`\`\`

## Guidance

- Keep labels to one or two words; use counts for numbers.
- Use \`danger\`/\`warning\` sparingly so failure states stay noticeable.
- For payment-specific statuses, use the dedicated payment status component instead.
`,
  "Breadcrumbs": `# Breadcrumbs

RTL-ordered path trail for nested dashboard pages. Renders a \`nav\` landmark with an ordered list, chevrons pointing left (the RTL "forward" direction), and the current page marked with \`aria-current="page"\`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`items\` | \`BreadcrumbItem[]\` | — | Ordered trail from root to current page. The last item is always rendered as the current page. |
| \`showHomeIcon\` | \`boolean\` | \`false\` | Shows a home icon before the first item. |
| \`maxItems\` | \`number\` | — | Collapses the middle of the trail behind an ellipsis when the trail is longer than this. |
| \`ariaLabel\` | \`string\` | \`'مسیر صفحه'\` | Accessible label for the nav landmark. |
| \`className\` | \`string\` | \`''\` | Extra classes on the \`nav\` element. |

\`BreadcrumbItem\`: \`{ label: string; href?: string; onClick?: () => void }\`. Items without \`href\`/\`onClick\` (and the last item) render as plain text.

## Usage

\`\`\`tsx
import { Breadcrumbs } from 'components/Breadcrumbs'

<Breadcrumbs
  showHomeIcon
  maxItems={4}
  items={[
    { label: 'خانه', href: '/' },
    { label: 'درگاه پرداخت', onClick: () => navigate('/gateways') },
    { label: 'تنظیمات' },
  ]}
/>
\`\`\`

## Notes

- Always place this above the page title in dashboard layouts; keep labels short since they truncate.
- Use \`onClick\` for client-side routing — the component calls \`preventDefault()\` automatically.
- Links use the brand blue hover state; the current page is slate-900 semibold.
`,
  "Button": `# Button

Primary interactive control for actions across the product. Uses the Pal blue fill for primary
actions, Gold for secondary emphasis (promotions, upgrades), and an ~8px (\`rounded-lg\`) radius
for in-app surfaces.

## When to use

- **primary** — the single main action of a screen, form, or dialog (Pal blue \`#1652F0\`).
- **secondary** — accent/emphasis action such as an upgrade or promo (Gold \`#FFC72C\`, dark label). Use sparingly, at most one per view.
- **outline** — neutral secondary action next to a primary button.
- **ghost** — low-emphasis or tertiary actions (cancel, inline actions).
- **destructive** — irreversible actions (delete, revoke).

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`variant\` | \`'primary' \\| 'secondary' \\| 'outline' \\| 'ghost' \\| 'destructive'\` | \`'primary'\` | Visual emphasis. |
| \`size\` | \`'sm' \\| 'md' \\| 'lg'\` | \`'md'\` | Heights: 36 / 44 / 52px. |
| \`loading\` | \`boolean\` | \`false\` | Shows a spinner, sets \`aria-busy\`, and disables the button. |
| \`leadingIcon\` | \`ReactNode\` | — | Icon rendered before the label (hidden while loading). |
| \`trailingIcon\` | \`ReactNode\` | — | Icon rendered after the label (hidden while loading). |
| \`fullWidth\` | \`boolean\` | \`false\` | Stretches to the container width. |
| \`disabled\` | \`boolean\` | \`false\` | Disables interaction and dims to 50% opacity. |
| \`className\` | \`string\` | — | Merged with the internal classes via \`tailwind-merge\`. |

All other native \`<button>\` attributes (\`onClick\`, \`type\`, \`form\`, \`aria-*\`, …) are forwarded.
\`type\` defaults to \`"button"\` — pass \`type="submit"\` inside forms.

## Usage

\`\`\`tsx
import { Button } from 'components/Button'
import { PlusIcon } from 'lucide-react'

<Button onClick={handleSignup}>Sign up</Button>

<Button variant="outline" leadingIcon={<PlusIcon className="h-4 w-4" />}>
  New payment link
</Button>

<Button variant="destructive" loading={isDeleting}>
  Delete gateway
</Button>
\`\`\`

## Notes

- Icons use \`gap-2\` spacing and flip automatically in RTL layouts because spacing is gap-based.
- Focus is always visible via a 2px ring offset from the button surface.
- Pair icons at \`h-4 w-4\` for \`sm\`/\`md\` and \`h-5 w-5\` for \`lg\`.
`,
  "CTASection": `# CTASection

Closing marketing band that pairs a bold headline with a full-pill call-to-action button. Used at the end of landing pages to drive sign-ups. Defaults to RTL and the brand's dark navy band with a blue pill button.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`headline\` | \`string \\| string[]\` | — | Headline text. Pass an array to force line breaks. |
| \`description\` | \`string\` | — | Optional supporting paragraph. |
| \`ctaLabel\` | \`string\` | — | Button label. |
| \`ctaHref\` | \`string\` | — | Renders the CTA as a link when provided. |
| \`onCtaClick\` | \`() => void\` | — | Click handler used when no \`ctaHref\` is set. |
| \`tone\` | \`'dark' \\| 'light'\` | \`'dark'\` | Band treatment. |
| \`align\` | \`'start' \\| 'center'\` | \`'center'\` | Content alignment inside the band. |
| \`dir\` | \`'rtl' \\| 'ltr'\` | \`'rtl'\` | Text direction. |
| \`className\` | \`string\` | \`''\` | Extra classes on the outer section. |

## Usage

\`\`\`tsx
import { CTASection } from 'components/CTASection'

<CTASection
  headline={['بیش از ۱۵ سال انتخاب مطمئن', 'کسب‌وکارهای آنلاین']}
  description="زرین‌پال، اولین پرداخت‌یار کشور."
  ctaLabel="ورود یا ثبت‌نام"
  ctaHref="/signup"
/>
\`\`\`

## Notes

- The band is a rounded container inside a full-width section, matching the site's inset card layout.
- Use \`tone="light"\` for mid-page CTAs so the dark band stays reserved for the page close.
`,
  "Card": `# Card

Base surface container for dashboard panels: white background, 1px hairline gray border, rounded corners, and a minimal shadow. Use it to group related content, stats, or forms.

## Props (\`Card\`)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`padding\` | \`'none' \\| 'sm' \\| 'md' \\| 'lg'\` | \`'md'\` | Inner padding of the surface. |
| \`elevation\` | \`'flat' \\| 'low' \\| 'medium'\` | \`'low'\` | Shadow depth. |
| \`interactive\` | \`boolean\` | \`false\` | Adds hover border/shadow lift and a visible focus ring for clickable panels. |
| \`as\` | \`'div' \\| 'section' \\| 'article' \\| 'li'\` | \`'div'\` | Rendered element for semantics. |
| \`className\` | \`string\` | – | Extra classes, merged last. |

All other \`div\` props (\`onClick\`, \`role\`, \`tabIndex\`, ...) are forwarded.

## Subcomponents

- \`CardHeader\` – flex row for title block plus trailing action/badge.
- \`CardTitle\` – heading (\`as\`: \`h2 | h3 | h4\`, defaults to \`h3\`).
- \`CardDescription\` – muted supporting text.
- \`CardContent\` – main body area with top spacing.
- \`CardFooter\` – right-aligned actions with a top divider.

## Usage

\`\`\`tsx
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
\`\`\`

Use \`padding="none"\` when the card wraps edge-to-edge content such as a table or image.
`,
  "ChartCard": `# ChartCard

Dashboard card that houses a revenue line/area chart with a title block, optional summary value and trend badge, and a period selector in the header. RTL by default, using the Zarinpal surface, border, text, and status tokens. Built on \`recharts\`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`title\` | \`string\` | — | Card heading (also used as the tooltip series name). |
| \`description\` | \`string\` | — | Supporting text under the title. |
| \`value\` | \`string\` | — | Preformatted summary value. |
| \`change\` | \`number\` | — | Percent change; positive = success badge, negative = failed badge. |
| \`periods\` | \`ChartCardPeriod[]\` | ۷ روز / ۳۰ روز / ۱۲ ماه | Options in the header segmented selector. |
| \`selectedPeriod\` | \`string\` | — | Controlled selected period id. |
| \`defaultPeriod\` | \`string\` | first period | Uncontrolled initial period. |
| \`onPeriodChange\` | \`(id: string) => void\` | — | Fired when a period is chosen. |
| \`data\` | \`ChartCardPoint[]\` | — | \`{ label, value }\` series points. |
| \`variant\` | \`'area' \\| 'line'\` | \`'area'\` | Chart rendering style. |
| \`height\` | \`number\` | \`260\` | Chart area height in px. |
| \`formatValue\` | \`(v: number) => string\` | fa-IR locale | Formats y-axis ticks and tooltip values. |
| \`loading\` | \`boolean\` | \`false\` | Shows the loading state. |
| \`error\` | \`string\` | — | Shows the error state with this message. |
| \`className\` | \`string\` | \`''\` | Extra classes on the card root. |

An empty \`data\` array renders a built-in empty state.

## Usage

\`\`\`tsx
import { ChartCard } from 'components/ChartCard'

<ChartCard
  title="درآمد کل"
  value="۲۷٬۸۰۰٬۰۰۰ تومان"
  change={12.4}
  data={points}
  selectedPeriod={period}
  onPeriodChange={setPeriod}
/>
\`\`\`
`,
  "Checkbox": `# Checkbox

Binary selection control for forms and table row selection. Supports checked, unchecked, indeterminate, disabled, and error states, with an optional label and description.

## Usage

\`\`\`tsx
import { Checkbox } from 'components/Checkbox'

<Checkbox
  label="Enable instant settlement"
  description="Funds are transferred within minutes."
  checked={enabled}
  onChange={(e) => setEnabled(e.target.checked)}
/>
\`\`\`

Select-all pattern for tables:

\`\`\`tsx
<Checkbox
  label="Select all"
  checked={allSelected}
  indeterminate={someSelected && !allSelected}
  onChange={(e) => toggleAll(e.target.checked)}
/>
\`\`\`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`label\` | \`ReactNode\` | — | Visible label next to the control |
| \`description\` | \`ReactNode\` | — | Supporting text under the label |
| \`error\` | \`string\` | — | Error message; renders the control in an error state |
| \`indeterminate\` | \`boolean\` | \`false\` | Partially selected state for "select all" controls |
| \`size\` | \`'sm' \\| 'md'\` | \`'md'\` | \`sm\` for dense tables, \`md\` for forms |
| \`disabled\` | \`boolean\` | \`false\` | Disables interaction |
| ...rest | \`input\` attributes | — | All native checkbox props (\`checked\`, \`defaultChecked\`, \`onChange\`, \`name\`, \`value\`, …) |

Forwards a ref to the underlying \`<input type="checkbox">\`.

## Behavior & accessibility

- Uses a real native checkbox input, so keyboard (Space) and form submission work by default.
- Label is associated via \`htmlFor\`; an id is generated automatically when not provided.
- \`description\` and \`error\` are wired through \`aria-describedby\`; the error state also sets \`aria-invalid\`.
- Visible focus ring on keyboard focus; brand blue (\`blue-600\`) is used for the selected fill.
`,
  "Drawer": `# Drawer

Right-anchored slide-over panel for contextual detail and edit views in RTL layouts. Renders in a portal on \`document.body\` with an overlay, spring slide animation (framer-motion), focus trap, Escape-to-close, and body scroll lock.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`open\` | \`boolean\` | — | Whether the panel is visible. |
| \`onClose\` | \`() => void\` | — | Called on overlay click, Escape, or close button. |
| \`title\` | \`ReactNode\` | — | Header title. |
| \`description\` | \`ReactNode\` | — | Secondary line under the title. |
| \`children\` | \`ReactNode\` | — | Scrollable body content. |
| \`footer\` | \`ReactNode\` | — | Sticky action area at the bottom. |
| \`side\` | \`'right' \\| 'left'\` | \`'right'\` | Anchored edge. |
| \`size\` | \`'sm' \\| 'md' \\| 'lg'\` | \`'md'\` | Panel max width (full width below \`sm\`). |
| \`showCloseButton\` | \`boolean\` | \`true\` | Toggle header close button. |
| \`closeOnOverlayClick\` | \`boolean\` | \`true\` | Dismiss by clicking the overlay. |
| \`dir\` | \`'rtl' \\| 'ltr'\` | \`'rtl'\` | Text direction of panel content. |
| \`className\` | \`string\` | \`''\` | Extra classes on the panel. |

## Usage

\`\`\`tsx
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
\`\`\`

## Notes

- Keep the trigger button focus-visible; focus returns to it automatically on close.
- Use \`size="lg"\` for forms, \`size="sm"\` for filter panels.
- Only render one Drawer at a time; nest content instead of stacking panels.
`,
  "EmptyState": `# EmptyState

Centered placeholder block for tables, panels, and lists that have no data yet. Shows a circular glyph, a title, an optional description, and up to two actions. Defaults to RTL to match the brand's Persian UI.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`title\` | \`string\` | — | Required. Short reason the area is empty. |
| \`description\` | \`string\` | — | Supporting sentence explaining the next step. |
| \`icon\` | \`ReactNode\` | inbox glyph | Custom icon/illustration rendered inside the circle. |
| \`action\` | \`{ label, onClick?, href? }\` | — | Primary blue pill button. |
| \`secondaryAction\` | \`{ label, onClick?, href? }\` | — | Low-emphasis text button. |
| \`size\` | \`'sm' \\| 'md' \\| 'lg'\` | \`'md'\` | Vertical density and glyph/text scale. |
| \`bordered\` | \`boolean\` | \`false\` | Dashed placeholder border around the block. |
| \`dir\` | \`'rtl' \\| 'ltr'\` | \`'rtl'\` | Text direction. |
| \`className\` | \`string\` | \`''\` | Extra classes on the wrapper. |
| \`children\` | \`ReactNode\` | — | Extra content between the copy and the actions. |

## Usage

\`\`\`tsx
import { EmptyState } from 'components/EmptyState'

<EmptyState
  bordered
  title="هنوز تراکنشی ثبت نشده است"
  description="پس از اولین پرداخت موفق، تراکنش‌ها اینجا نمایش داده می‌شوند."
  action={{ label: 'ایجاد درگاه جدید', onClick: createGateway }}
  secondaryAction={{ label: 'راهنمای شروع', href: '/docs' }}
/>
\`\`\`

## Guidance

- Use inside an empty table body or card, not as a full-page state.
- Keep the title under ~6 words and the description to one sentence.
- Only include an action when there is a real next step; otherwise title + description is enough.
- The wrapper carries \`role="status"\` so screen readers announce the empty result.
`,
  "FeatureCard": `# FeatureCard

Icon + heading + description card used in marketing feature grids. Supports light and dark surfaces, start/center alignment, an optional action slot, and an optional link wrapper.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`icon\` | \`LucideIcon\` | — | Icon component rendered in the tinted icon tile. Omit for a text-only card. |
| \`title\` | \`string\` | required | Card heading (renders as \`h3\`). |
| \`description\` | \`string\` | required | Supporting copy under the heading. |
| \`action\` | \`ReactNode\` | — | Optional CTA/link rendered below the description. |
| \`variant\` | \`'light' \\| 'dark'\` | \`'light'\` | Surface treatment. Use \`dark\` over deep navy sections. |
| \`align\` | \`'start' \\| 'center'\` | \`'start'\` | Content alignment. \`start\` is RTL-safe via logical text alignment. |
| \`href\` | \`string\` | — | Renders the card as an anchor so the whole card is clickable. |
| \`className\` | \`string\` | — | Extra classes for layout overrides. |

## Usage

\`\`\`tsx
import { ShieldCheckIcon } from 'lucide-react'
import { FeatureCard } from 'components/FeatureCard'

<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  <FeatureCard
    icon={ShieldCheckIcon}
    title="Secure payments"
    description="Bank-grade encryption on every transaction."
  />
</div>
\`\`\`

## Notes

- Cards use \`h-full\` so siblings in a grid stay equal height.
- Headings render as \`h3\`; place them under a section \`h2\` to keep hierarchy correct.
- The icon tile is \`aria-hidden\`, so the title and description carry all meaning.
`,
  "HeroSection": `# HeroSection

Dark navy marketing hero used at the top of landing pages. Rounded card surface with a soft navy glow, a bold multi-line headline, muted subcopy, a full-pill primary CTA, and an optional scroll-down cue. Defaults to RTL (Persian).

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`title\` | \`string \\| string[]\` | — | Headline. Pass an array to render explicit line breaks. |
| \`description\` | \`string\` | — | Supporting paragraph below the headline. |
| \`ctaLabel\` | \`string\` | — | Primary CTA label. CTA is hidden when omitted. |
| \`ctaHref\` | \`string\` | — | Renders the CTA as an anchor when provided, otherwise a button. |
| \`onCtaClick\` | \`() => void\` | — | Click handler for the CTA. |
| \`dir\` | \`'rtl' \\| 'ltr'\` | \`'rtl'\` | Text direction; flips content alignment and the glow. |
| \`showScrollCue\` | \`boolean\` | \`true\` | Shows the scroll-down tab at the bottom edge. |
| \`className\` | \`string\` | \`''\` | Extra classes on the section element. |

## Usage

\`\`\`tsx
<HeroSection
  title={['بیش از ۱۵ سال انتخاب مطمئن', 'کسب‌وکارهای آنلاین']}
  description="زرین‌پال، اولین پرداخت‌یار کشور."
  ctaLabel="ورود یا ثبت‌نام"
  ctaHref="/signup"
/>
\`\`\`

## Notes

- Content is right-aligned on large screens in RTL, and stacks full-width on mobile.
- The headline renders as \`<h1>\`; use only one per page.
- Set \`showScrollCue={false}\` when the hero is not the full-viewport section.
`,
  "IconButton": `# IconButton

Square, icon-only button for toolbars, table row actions, and compact controls. Uses an 8px radius (\`rounded-lg\`), fixed square hit areas, and mirrors directional icons in RTL layouts.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`label\` | \`string\` | — | Required accessible label (used for \`aria-label\` and tooltip \`title\`). |
| \`icon\` | \`ReactNode\` | — | Icon element, typically a \`lucide-react\` icon. Sized automatically. |
| \`variant\` | \`'primary' \\| 'secondary' \\| 'ghost' \\| 'danger'\` | \`'secondary'\` | Visual style. |
| \`size\` | \`'sm' \\| 'md' \\| 'lg'\` | \`'md'\` | 32 / 40 / 48px square. |
| \`loading\` | \`boolean\` | \`false\` | Shows a spinner and disables the button. |
| \`directional\` | \`boolean\` | \`false\` | Horizontally mirrors the icon when inside \`dir="rtl"\`. |
| \`disabled\` | \`boolean\` | \`false\` | Non-interactive state. |

All other \`<button>\` attributes (\`onClick\`, \`form\`, \`data-*\`, …) are forwarded, and the ref points at the underlying \`<button>\`.

## Usage

\`\`\`tsx
import { IconButton } from 'components/IconButton'
import { Trash2Icon, ChevronLeftIcon } from 'lucide-react'

<IconButton variant="danger" label="حذف ردیف" icon={<Trash2Icon />} onClick={remove} />

// Directional icon inside an RTL page
<IconButton directional label="قبلی" icon={<ChevronLeftIcon />} />
\`\`\`

## Guidance

- Always pass a meaningful \`label\` — there is no visible text.
- Use \`ghost\` inside table rows, \`secondary\` in toolbars, \`primary\` for the single main action.
- Set \`directional\` only for arrows/chevrons so they flip with the reading direction.
`,
  "Input": `# Input

Single-line text field for forms. Defaults to RTL and uses logical spacing (\`ps-*\` / \`pe-*\`, \`start-*\` / \`end-*\`) so labels, icons, and text align correctly in both RTL and LTR.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`label\` | \`string\` | – | Visible label above the field |
| \`helperText\` | \`string\` | – | Hint below the field (hidden when \`error\` is set) |
| \`error\` | \`string\` | – | Error message; switches the field to its error state |
| \`startIcon\` | \`ReactNode\` | – | Icon at the logical start (right in RTL) |
| \`endIcon\` | \`ReactNode\` | – | Icon at the logical end (left in RTL) |
| \`inputSize\` | \`'sm' \\| 'md' \\| 'lg'\` | \`'md'\` | Height and type scale |
| \`fullWidth\` | \`boolean\` | \`true\` | Stretch to the container width |
| \`dir\` | \`'rtl' \\| 'ltr'\` | \`'rtl'\` | Text direction |
| ...rest | \`input\` attributes | – | \`value\`, \`onChange\`, \`disabled\`, \`required\`, \`type\`, etc. |

Forwards its ref to the underlying \`<input>\`.

## Usage

\`\`\`tsx
import { Input } from 'components/Input'
import { SearchIcon } from 'lucide-react'

<Input
  label="جستجو"
  placeholder="جستجو در تراکنش‌ها"
  startIcon={<SearchIcon size={18} />}
/>

<Input
  label="شماره موبایل"
  required
  error="شماره موبایل باید ۱۱ رقم باشد."
/>
\`\`\`

## Accessibility

- Label is bound with \`htmlFor\` / \`id\`; an id is generated when not supplied.
- Helper and error text are linked via \`aria-describedby\`; errors set \`aria-invalid\` and \`role="alert"\`.
- Focus ring uses the brand blue (red in the error state).
`,
  "Logo": `# Logo

The Zarinpal brandmark. Renders the official logo artwork as a full lockup, a cropped logomark, or a badge (mark on a solid rounded plate) for busy or low-contrast backgrounds.

## Usage

\`\`\`tsx
import { Logo } from 'components/Logo'

<Logo />                                   // full lockup, brand color, md
<Logo variant="mark" size="lg" />          // logomark only
<Logo variant="badge" badgeBackground="black" tone="white" size="xl" />
<Logo tone="white" />                      // on a dark surface
\`\`\`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`variant\` | \`'lockup' \\| 'mark' \\| 'badge'\` | \`'lockup'\` | Lockup = mark + logotype; mark = square crop of the logomark; badge = mark centered on a solid plate. |
| \`tone\` | \`'color' \\| 'black' \\| 'white'\` | \`'color'\` | Ink treatment. Use \`white\` on dark surfaces, \`black\` for single-ink contexts. |
| \`size\` | \`'sm' \\| 'md' \\| 'lg' \\| 'xl'\` | \`'md'\` | Height of the mark: 20 / 28 / 40 / 56 px. |
| \`badgeBackground\` | \`'white' \\| 'black'\` | \`'white'\` | Plate color, \`badge\` variant only. |
| \`label\` | \`string\` | \`'Zarinpal'\` | Accessible name. Pass \`''\` when the logo is decorative next to visible brand text. |
| \`className\` | \`string\` | \`''\` | Extra classes on the wrapper. |

## Notes

- Badge corner radius follows the brand rule \`3a\`, where \`a = height / 14\`.
- The logotype is right-to-left; the mark crop is anchored to the trailing (right) edge of the artwork.
- Always keep clear space of at least the mark height around the lockup.
`,
  "Modal": `# Modal

Centered dialog for confirmations and focused tasks (e.g. settlement confirmation). Renders into \`document.body\` via a portal, dims the page with a blurred overlay, locks body scroll, and animates in with framer-motion. Defaults to RTL to match the Persian product UI.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`open\` | \`boolean\` | — | Controls visibility. |
| \`onClose\` | \`() => void\` | — | Called on overlay click, Escape, or close button. |
| \`title\` | \`ReactNode\` | — | Header title. |
| \`description\` | \`ReactNode\` | — | Supporting text under the title. |
| \`children\` | \`ReactNode\` | — | Body content. |
| \`footer\` | \`ReactNode\` | — | Action row at the bottom. |
| \`size\` | \`'sm' \\| 'md' \\| 'lg'\` | \`'md'\` | Max width of the dialog. |
| \`showCloseButton\` | \`boolean\` | \`true\` | Show the header X button. |
| \`dismissible\` | \`boolean\` | \`true\` | Allow overlay click / Escape to close. |
| \`dir\` | \`'rtl' \\| 'ltr'\` | \`'rtl'\` | Text direction of the dialog. |

## Usage

\`\`\`tsx
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
\`\`\`

## Notes

- Use \`dismissible={false}\` with \`showCloseButton={false}\` for destructive or irreversible flows that require an explicit choice.
- The dialog panel receives focus on open and closes on Escape; place the primary action first in \`footer\` (right-most in RTL).
`,
  "Navbar": `# Navbar

Top application bar for the Zarinpal design system. Right-to-left layout: hamburger toggle and logo on the leading (right) side, tickets / notifications / avatar cluster on the trailing (left) side.

## Usage

\`\`\`tsx
import { Navbar } from 'components/Navbar'

<Navbar
  ticketCount={2}
  notificationCount={12}
  userName="سارا محمدی"
  onMenuToggle={(open) => setSidebarOpen(open)}
/>
\`\`\`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`menuOpen\` | \`boolean\` | – | Controlled hamburger state. Omit for uncontrolled. |
| \`onMenuToggle\` | \`(open: boolean) => void\` | – | Fired with the next open state when the hamburger is pressed. |
| \`notificationCount\` | \`number\` | \`0\` | Unread notifications; \`0\` hides the badge, \`>99\` shows \`+۹۹\`. |
| \`ticketCount\` | \`number\` | \`0\` | Open support tickets; \`0\` hides the badge. |
| \`userName\` | \`string\` | \`حساب کاربری\` | Name shown next to the avatar and used for initials fallback. |
| \`avatarUrl\` | \`string\` | – | Avatar image; falls back to initials on a tinted brand circle. |
| \`onTicketsClick\` / \`onNotificationsClick\` / \`onAvatarClick\` | \`() => void\` | – | Action handlers. |
| \`className\` | \`string\` | \`''\` | Extra classes on the \`<header>\` element. |

## Notes

- Renders a semantic \`<header>\` + \`<nav aria-label="اصلی">\` with \`dir="rtl"\`.
- Fixed 64px height, white surface, \`border-slate-200\` hairline bottom border.
- Brand blue \`#1652F0\` is used for badges, focus rings, and the initials avatar tint.
- Username and chevron collapse below the \`sm\` breakpoint; icons stay visible.
`,
  "Pagination": `# Pagination

Page navigation control for tables and lists. Defaults to RTL (Persian) with mirrored prev/next arrows and Persian digits; supports LTR via \`dir="ltr"\`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`page\` | \`number\` | — | Current page, 1-indexed. |
| \`totalPages\` | \`number\` | — | Total page count. |
| \`onPageChange\` | \`(page: number) => void\` | — | Called with the requested page (clamped to range). |
| \`siblingCount\` | \`number\` | \`1\` | Pages shown on each side of the current page. |
| \`dir\` | \`'rtl' \\| 'ltr'\` | \`'rtl'\` | Direction; RTL mirrors arrows and uses Persian digits/labels. |
| \`size\` | \`'sm' \\| 'md'\` | \`'md'\` | Compact or default control height. |
| \`disabled\` | \`boolean\` | \`false\` | Disables all controls. |
| \`ariaLabel\` | \`string\` | localized | Label for the \`nav\` landmark. |
| \`className\` | \`string\` | \`''\` | Extra classes on the nav wrapper. |

## Usage

\`\`\`tsx
const [page, setPage] = useState(1)

<Pagination page={page} totalPages={12} onPageChange={setPage} />
\`\`\`

## Notes

- Active page uses the brand blue fill; other pages are neutral outlined buttons.
- The active button carries \`aria-current="page"\`; ellipses are non-interactive.
- Prev/next labels collapse to icon-only below the \`sm\` breakpoint.
- \`getPageRange(page, totalPages, siblingCount)\` is exported for custom layouts.
`,
  "PeriodSelector": `# PeriodSelector

RTL segmented control for switching a chart's date range (۷ روز, ۳۰ روز, …). Renders as an accessible \`radiogroup\` with pill-shaped segments; the active segment uses the brand blue fill.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`options\` | \`PeriodOption[]\` | — | Ranges to show. \`PeriodOption = { value, label, disabled? }\` |
| \`value\` | \`string\` | — | Currently selected range value (controlled) |
| \`onChange\` | \`(value: string) => void\` | — | Called when a range is selected |
| \`label\` | \`string\` | \`'بازه زمانی'\` | Accessible group label |
| \`size\` | \`'sm' \\| 'md'\` | \`'md'\` | Density |
| \`disabled\` | \`boolean\` | \`false\` | Disables the whole control |
| \`loading\` | \`boolean\` | \`false\` | Pulses the control while data refreshes |
| \`className\` | \`string\` | — | Extra classes on the wrapper |

## Usage

\`\`\`tsx
const [range, setRange] = useState('30d')

<PeriodSelector
  value={range}
  onChange={setRange}
  options={[
    { value: '7d', label: '۷ روز' },
    { value: '30d', label: '۳۰ روز' },
    { value: '90d', label: '۹۰ روز' },
  ]}
/>
\`\`\`

## Notes

- Controlled only — always pass \`value\` and \`onChange\`.
- Arrow keys move between segments with RTL direction (ArrowLeft advances), \`Home\`/\`End\` jump to the ends.
- Pair it with the chart it controls and reflect \`loading\` while the new range is fetching.
`,
  "PricingCard": `# PricingCard

Plan card for marketing pricing sections: plan name, price block, feature list, and a pill-shaped CTA. Defaults to RTL (Persian) content, matching the Zarinpal site.

## Variants
- **Default** — white surface, light border, blue pill CTA.
- **Featured** — dark navy surface (\`#161B2E\`) with a blue badge, used for the highlighted plan.

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`name\` | \`string\` | — | Plan name (required) |
| \`description\` | \`string\` | — | Short supporting line under the name |
| \`price\` | \`string\` | — | Formatted price, e.g. \`"۱۹۹٬۰۰۰"\` or \`"رایگان"\` |
| \`currency\` | \`string\` | — | Currency suffix, e.g. \`"تومان"\` |
| \`period\` | \`string\` | — | Billing period, e.g. \`"ماهانه"\` |
| \`features\` | \`PricingCardFeature[]\` | — | \`{ label, included? }\`; \`included: false\` renders muted + struck-through |
| \`ctaLabel\` | \`string\` | \`'شروع کنید'\` | CTA text |
| \`onCtaClick\` | \`() => void\` | — | CTA handler |
| \`featured\` | \`boolean\` | \`false\` | Dark emphasized variant |
| \`badge\` | \`string\` | \`'پیشنهاد ویژه'\` | Badge text (featured only) |
| \`disabled\` | \`boolean\` | \`false\` | Disables the CTA |
| \`dir\` | \`'rtl' \\| 'ltr'\` | \`'rtl'\` | Content direction |
| \`className\` | \`string\` | \`''\` | Extra classes on the card |

## Usage
\`\`\`tsx
<PricingCard
  featured
  name="حرفه‌ای"
  price="۴۹۹٬۰۰۰"
  currency="تومان"
  period="ماهانه"
  features={[{ label: 'تسویه آنی' }, { label: 'گزارش پیشرفته' }]}
  onCtaClick={() => console.log('selected')}
/>
\`\`\`

Cards stretch to \`max-w-sm\`; place several in a \`grid gap-6 md:grid-cols-3\` for a pricing row.
`,
  "RadioGroup": `# RadioGroup

Single-choice group for settlement, payout, and settings options. Composed of \`RadioGroup\` (container, label, error) and \`RadioGroupItem\` (individual option). Works controlled or uncontrolled.

## Props — RadioGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`label\` | \`string\` | – | Group label rendered above the options |
| \`description\` | \`string\` | – | Helper text under the label |
| \`value\` | \`string\` | – | Controlled selected value |
| \`defaultValue\` | \`string\` | – | Initial value when uncontrolled |
| \`name\` | \`string\` | auto | Shared radio input name |
| \`disabled\` | \`boolean\` | \`false\` | Disables all options |
| \`orientation\` | \`'vertical' \\| 'horizontal'\` | \`'vertical'\` | Layout direction |
| \`error\` | \`string\` | – | Error message; marks the group invalid |
| \`onChange\` | \`(value: string) => void\` | – | Fired on selection change |
| \`className\` | \`string\` | – | Extra classes on the wrapper |

## Props — RadioGroupItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`value\` | \`string\` | – | Option value (required) |
| \`label\` | \`ReactNode\` | – | Primary label (required) |
| \`description\` | \`ReactNode\` | – | Secondary line |
| \`trailing\` | \`ReactNode\` | – | Trailing content (amount, badge) |
| \`disabled\` | \`boolean\` | \`false\` | Disables the single option |
| \`variant\` | \`'plain' \\| 'card'\` | \`'plain'\` | Card renders a bordered, selectable surface |

## Usage

\`\`\`tsx
import { RadioGroup, RadioGroupItem } from 'components/RadioGroup'

const [cycle, setCycle] = useState('daily')

<RadioGroup label="Settlement cycle" value={cycle} onChange={setCycle}>
  <RadioGroupItem value="daily" label="Daily" description="Every business day" />
  <RadioGroupItem value="weekly" label="Weekly" />
</RadioGroup>
\`\`\`

## Notes

- Native radio inputs keep arrow-key navigation and form submission working; the container uses \`role="radiogroup"\` with the label and error wired via \`aria-labelledby\` / \`aria-describedby\`.
- Selection uses the brand blue; focus shows a visible blue focus ring.
- Use \`variant="card"\` for higher-stakes choices such as picking a settlement bank account.
`,
  "Select": `# Select

RTL dropdown field for filters and forms. Wraps a native \`<select>\` (full keyboard and mobile support) with an appearance-none shell, brand focus ring, and a chevron pinned to the logical end of the field — which renders on the left in RTL, matching the Zarinpal site.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`options\` | \`SelectOption[]\` | — | Required. \`{ label, value, disabled? }\` entries. |
| \`label\` | \`string\` | — | Visible field label. |
| \`placeholder\` | \`string\` | — | Disabled empty option shown when no value is selected. |
| \`hint\` | \`string\` | — | Helper text under the field. |
| \`error\` | \`string\` | — | Error message; switches the field to the error state and sets \`aria-invalid\`. |
| \`size\` | \`'sm' \\| 'md' \\| 'lg'\` | \`'md'\` | Field height and typography. |
| \`fullWidth\` | \`boolean\` | \`true\` | Stretch to the container width. |
| \`disabled\`, \`required\`, \`value\`, \`defaultValue\`, \`onChange\`, … | native \`select\` props | — | Forwarded to the underlying element. |

Ref is forwarded to the \`<select>\` element.

## Usage

\`\`\`tsx
import { Select } from 'components/Select'

<Select
  label="نوع سرویس"
  placeholder="یک گزینه را انتخاب کنید"
  options={[
    { label: 'درگاه پرداخت اینترنتی', value: 'ipg' },
    { label: 'پرداخت مستقیم', value: 'direct' },
  ]}
  onChange={(e) => setService(e.target.value)}
/>
\`\`\`

Error state:

\`\`\`tsx
<Select
  label="بازه زمانی"
  required
  error="انتخاب بازه زمانی الزامی است."
  options={periods}
/>
\`\`\`

## Notes

- The wrapper sets \`dir="rtl"\`, so labels, options, and messages align right by default.
- Use \`hint\` for guidance and \`error\` for validation; when both are set, \`error\` wins.
- Keep option labels short so they fit the field at \`sm\`.
`,
  "Sidebar": `# Sidebar

Right-hand (RTL) collapsible navigation rail for the Zarinpal dashboard. Shows the brand logo, a Pal-blue active gateway card, outline nav icons with optional badges, and a support action pinned to the bottom.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`items\` | \`SidebarItem[]\` | \`defaultSidebarItems\` | Nav entries: \`{ id, label, icon, badge? }\` (icon is a lucide-react component). |
| \`activeId\` | \`string\` | — | Controlled active item id. Omit for internal state. |
| \`gatewayName\` | \`string\` | \`'فروشگاه زرین'\` | Name in the blue gateway header card. |
| \`gatewayMeta\` | \`string\` | \`'zarinshop.ir'\` | Secondary line (domain/status). |
| \`logoUrl\` | \`string\` | Zarinpal logo | Logo image source. |
| \`collapsed\` | \`boolean\` | — | Controlled collapsed state. |
| \`defaultCollapsed\` | \`boolean\` | \`false\` | Initial collapsed state when uncontrolled. |
| \`onCollapsedChange\` | \`(collapsed: boolean) => void\` | — | Fired when the toggle is pressed. |
| \`onSelect\` | \`(id: string) => void\` | — | Fired when a nav item is chosen. |
| \`className\` | \`string\` | \`''\` | Extra classes on the \`<aside>\`. |

## Usage

\`\`\`tsx
import { Sidebar } from 'components/Sidebar'

<div className="flex h-screen flex-row-reverse">
  <Sidebar activeId={section} onSelect={setSection} />
  <main className="flex-1 overflow-y-auto">{children}</main>
</div>
\`\`\`

## Notes

- Width animates between \`w-64\` (expanded) and \`w-[76px]\` (collapsed); collapsed items expose their label via \`title\`.
- Active item uses \`bg-blue-50\` / \`text-blue-700\`; the gateway card uses solid \`bg-blue-600\`.
- The \`<aside>\` is \`dir="rtl"\` and labeled for screen readers; the toggle exposes \`aria-expanded\`.
`,
  "Skeleton": `# Skeleton

Loading placeholder blocks used while data is being fetched. Includes a base \`Skeleton\` primitive plus composed layouts for cards, table rows, and charts.

## When to use
- Replace content areas during initial data loads (dashboards, tables, charts).
- Prefer skeletons over spinners when the final layout is known, so the page does not shift.

## Exports
- \`Skeleton\` — base block.
- \`SkeletonText\` — stacked text lines.
- \`SkeletonCard\` — card with optional avatar/media.
- \`SkeletonTable\` — header + rows grid.
- \`SkeletonChart\` — bar chart with header and axis labels.

## Props

### Skeleton
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`variant\` | \`'rect' \\| 'text' \\| 'circle'\` | \`'rect'\` | Shape of the block. |
| \`width\` | \`string \\| number\` | – | CSS width. |
| \`height\` | \`string \\| number\` | – | CSS height. |
| \`animate\` | \`boolean\` | \`true\` | Pulse animation. |
| \`label\` | \`string\` | \`'Loading'\` | Accessible label. |

### SkeletonText
\`lines\` (3), \`lastLineWidth\` ('60%'), \`animate\`, \`className\`.

### SkeletonCard
\`avatar\` (true), \`media\` (false), \`lines\` (3), \`animate\`, \`className\`.

### SkeletonTable
\`rows\` (5), \`columns\` (4), \`header\` (true), \`animate\`, \`className\`.

### SkeletonChart
\`bars\` (7), \`height\` ('14rem'), \`header\` (true), \`animate\`, \`className\`.

## Usage

\`\`\`tsx
import { Skeleton, SkeletonCard, SkeletonTable, SkeletonChart } from 'components/Skeleton'

{isLoading ? <SkeletonTable rows={6} columns={5} /> : <TransactionsTable data={data} />}

{isLoading ? <SkeletonChart bars={8} /> : <RevenueChart data={data} />}

<Skeleton variant="circle" width="2.5rem" height="2.5rem" />
\`\`\`

## Accessibility
Each composite exposes \`role="status"\` with a descriptive \`aria-label\`; inner blocks are \`aria-hidden\` so screen readers announce a single loading message. Set \`animate={false}\` for reduced-motion contexts.
`,
  "StatCard": `# StatCard

RTL metric card showing a monetary amount in Persian numerals with a small currency-unit chip, plus an optional label icon and trend indicator.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`label\` | \`string\` | — | Metric label (Persian copy). |
| \`amount\` | \`number\` | — | Value; formatted with thousands separators and Persian digits. |
| \`unit\` | \`string\` | \`'ریال'\` | Currency unit rendered in the chip. |
| \`trend\` | \`{ direction: 'up' \\| 'down' \\| 'neutral'; value: number; caption?: string }\` | — | Optional trend pill with percentage and comparison caption. |
| \`icon\` | \`ReactNode\` | — | Optional icon rendered in a soft blue tile. |
| \`loading\` | \`boolean\` | \`false\` | Shows a skeleton in place of the value. |
| \`className\` | \`string\` | \`''\` | Extra classes on the card root. |

## Usage

\`\`\`tsx
import { WalletIcon } from 'lucide-react'
import { StatCard } from 'components/StatCard'

<StatCard
  label="درآمد امروز"
  amount={3820500}
  icon={<WalletIcon className="h-5 w-5" />}
  trend={{ direction: 'up', value: 12.4, caption: 'نسبت به دیروز' }}
/>
\`\`\`

## Notes

- The card sets \`dir="rtl"\` itself, so it works inside LTR layouts.
- \`toPersianDigits\` and \`formatPersianAmount\` are exported for reuse elsewhere.
- Use in a responsive grid (e.g. \`grid gap-4 sm:grid-cols-2 lg:grid-cols-4\`) for dashboard summaries.
`,
  "StatusPill": `# StatusPill

Compact, RTL-first pill for showing a payment's state in transaction tables, receipts, and dashboards.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`status\` | \`'success' \\| 'pending' \\| 'failed' \\| 'refunded' \\| 'inProgress'\` | — | Payment state. Drives label, color, and icon. |
| \`label\` | \`string\` | status default | Override the built-in Persian label. |
| \`hideIcon\` | \`boolean\` | \`false\` | Replace the icon with a small colored dot. |
| \`size\` | \`'sm' \\| 'md'\` | \`'md'\` | \`sm\` for dense tables. |
| \`className\` | \`string\` | \`''\` | Extra classes. |

## Default labels

- \`success\` → پرداخت موفق (green)
- \`pending\` → در انتظار پرداخت (amber)
- \`failed\` → پرداخت ناموفق (red)
- \`refunded\` → بازگشت وجه (slate)
- \`inProgress\` → در حال بررسی (blue, spinning icon)

## Usage

\`\`\`tsx
import { StatusPill } from 'components/StatusPill'

<StatusPill status="success" />
<StatusPill status="failed" size="sm" />
<StatusPill status="pending" hideIcon label="منتظر تایید" />
\`\`\`

Renders \`dir="rtl"\` with \`role="status"\` so screen readers announce state changes.
`,
  "Switch": `# Switch

Toggle control for boolean settings such as notification preferences, feature flags, and account options. Uses the brand blue for the "on" state and a neutral slate track when off.

## When to use

- Immediate on/off settings that apply without a save action.
- Settings rows where a short label and optional description explain the toggle.

For choices that require confirming a form, use a checkbox instead.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`checked\` | \`boolean\` | — | Controlled state. Omit for uncontrolled usage. |
| \`defaultChecked\` | \`boolean\` | \`false\` | Initial state when uncontrolled. |
| \`onChange\` | \`(checked: boolean) => void\` | — | Called with the next state on toggle. |
| \`size\` | \`'sm' \\| 'md' \\| 'lg'\` | \`'md'\` | Track and thumb size. |
| \`disabled\` | \`boolean\` | \`false\` | Blocks interaction and dims the control. |
| \`label\` | \`string\` | — | Visible label rendered beside the switch. |
| \`description\` | \`string\` | — | Helper text below the label. |
| \`aria-label\` | \`string\` | — | Accessible name when no visible \`label\` is set. |
| \`id\`, \`name\`, \`className\` | \`string\` | — | Standard passthroughs. |

## Usage

\`\`\`tsx
import { Switch } from 'components/Switch'

// Uncontrolled
<Switch label="Push notifications" description="Alert me on new payments." />

// Controlled
const [enabled, setEnabled] = useState(false)
<Switch checked={enabled} onChange={setEnabled} aria-label="Enable notifications" />
\`\`\`

## Accessibility

- Rendered as a \`<button role="switch">\` with \`aria-checked\`, so it is keyboard operable with Space/Enter.
- Provide either \`label\` or \`aria-label\`; \`description\` is wired via \`aria-describedby\`.
- Visible focus ring uses the brand blue with an offset.
`,
  "Table": `# Table

RTL data table for payment transactions. Columns run right-to-left: payment ID → Jalali date → amount → status pill.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`rows\` | \`TransactionRow[]\` | — | Transaction rows to render. |
| \`loading\` | \`boolean\` | \`false\` | Renders skeleton rows. |
| \`error\` | \`string\` | — | Replaces the body with an error message. |
| \`emptyMessage\` | \`string\` | \`'تراکنشی یافت نشد.'\` | Shown when \`rows\` is empty. |
| \`caption\` | \`string\` | \`'فهرست تراکنش‌ها'\` | Screen-reader caption. |
| \`currencyLabel\` | \`string\` | \`'تومان'\` | Suffix after each amount. |
| \`onRowClick\` | \`(row) => void\` | — | Makes rows clickable/keyboard focusable. |
| \`className\` | \`string\` | \`''\` | Extra classes on the wrapper. |

\`TransactionRow\`: \`{ id: string; date: string; amount: number; status: 'success' | 'pending' | 'failed' | 'refunded' }\`

Amounts are formatted with \`fa-IR\` digit grouping. Dates are passed in already-formatted Jalali strings.

## Usage

\`\`\`tsx
import { Table } from 'components/Table'

<Table
  rows={[{ id: 'A00000000123456789', date: '۱۴۰۳/۰۵/۲۱', amount: 1250000, status: 'success' }]}
  onRowClick={(row) => open(row.id)}
/>
\`\`\`

Also exports \`StatusPill\` and \`formatAmount\` for reuse in adjacent transaction UI.
`,
  "Tabs": `# Tabs

Segmented view switcher for dashboard sections and settings pages. Supports a filled \`segmented\` style and a \`underline\` style, optional badges/icons, and full keyboard navigation (Arrow keys, Home, End) with RTL-aware arrow direction.

## Props — \`Tabs\`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`items\` | \`TabItem[]\` | — | Tabs to render. \`TabItem = { value, label, icon?, badge?, disabled? }\` |
| \`value\` | \`string\` | — | Controlled active tab value |
| \`defaultValue\` | \`string\` | first enabled item | Initial value when uncontrolled |
| \`onValueChange\` | \`(value: string) => void\` | — | Fires when the active tab changes |
| \`variant\` | \`'segmented' \\| 'underline'\` | \`'segmented'\` | Visual style |
| \`size\` | \`'sm' \\| 'md'\` | \`'md'\` | Control density |
| \`fullWidth\` | \`boolean\` | \`false\` | Stretch tabs to fill the container |
| \`aria-label\` | \`string\` | — | Accessible name for the tablist |
| \`children\` | \`ReactNode\` | — | Usually \`TabPanel\` elements |

## Props — \`TabPanel\`

| Prop | Type | Description |
| --- | --- | --- |
| \`value\` | \`string\` | Matching tab value |
| \`children\` | \`ReactNode\` | Panel content (only rendered when active) |

## Usage

\`\`\`tsx
import { Tabs, TabPanel } from 'components/Tabs'

<Tabs
  variant="underline"
  items={[
    { value: 'profile', label: 'Profile' },
    { value: 'api', label: 'API keys', badge: 3 },
  ]}
  aria-label="Account settings"
>
  <TabPanel value="profile">Profile settings</TabPanel>
  <TabPanel value="api">API keys</TabPanel>
</Tabs>
\`\`\`

Controlled:

\`\`\`tsx
const [tab, setTab] = useState('overview')
<Tabs items={items} value={tab} onValueChange={setTab} />
\`\`\`
`,
  "Textarea": `# Textarea

Multi-line text field for longer form entries such as support notes, refund reasons, and descriptions. Matches the Input component's border, radius, focus ring, and label/hint/error anatomy.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`label\` | \`string\` | – | Visible label rendered above the field |
| \`hint\` | \`string\` | – | Helper text below the field (hidden when \`error\` is set) |
| \`error\` | \`string\` | – | Error message; switches the field to the invalid state |
| \`size\` | \`'sm' \\| 'md' \\| 'lg'\` | \`'md'\` | Padding, type scale, and minimum height |
| \`fullWidth\` | \`boolean\` | \`true\` | Stretch to the parent's width |
| \`showCount\` | \`boolean\` | \`false\` | Show a live character counter (requires \`maxLength\`) |
| \`resize\` | \`'none' \\| 'vertical' \\| 'both'\` | \`'vertical'\` | Resize behaviour |

All native \`<textarea>\` attributes (\`rows\`, \`maxLength\`, \`placeholder\`, \`disabled\`, \`required\`, \`value\`, \`onChange\`, …) are forwarded, and the ref is forwarded to the underlying element.

## Usage

\`\`\`tsx
import { Textarea } from 'components/Textarea'

<Textarea
  label="Support note"
  placeholder="Describe the issue in detail…"
  hint="Include transaction IDs where possible."
  maxLength={500}
  showCount
/>
\`\`\`

Controlled:

\`\`\`tsx
const [note, setNote] = useState('')

<Textarea
  label="Refund reason"
  value={note}
  onChange={(e) => setNote(e.target.value)}
  error={note.length < 20 ? 'Please provide at least 20 characters.' : undefined}
/>
\`\`\`

## Accessibility

- Label is associated via \`htmlFor\` / \`id\`; an id is generated when not supplied.
- \`aria-invalid\` is set in the error state and \`aria-describedby\` points at the hint or error text.
- Required fields render a visual asterisk plus the native \`required\` attribute.
`,
  "Toast": `# Toast

Transient notification for action feedback (success, error, warning, info), anchored to the top of the screen. RTL by default to match Zarinpal's Persian UI.

## Parts

- \`Toast\` — the visual notification card (use directly if you manage placement yourself).
- \`ToastViewport\` — animated, top-anchored stack; handles enter/exit motion and per-toast auto-dismiss timers.
- \`ToastProvider\` + \`useToast()\` — app-level queue. Wrap the app once, then call \`toast({...})\` anywhere.

## Props — \`Toast\`

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| \`title\` | \`string\` | — | Required headline. |
| \`description\` | \`string\` | — | Optional supporting line. |
| \`variant\` | \`'success' \\| 'error' \\| 'warning' \\| 'info'\` | \`'info'\` | Sets icon and accent ring. |
| \`onClose\` | \`() => void\` | — | Shows the close button when provided. |
| \`action\` | \`{ label: string; onClick: () => void }\` | — | Inline action such as "تلاش دوباره". |
| \`dir\` | \`'rtl' \\| 'ltr'\` | \`'rtl'\` | Text direction. |
| \`className\` | \`string\` | \`''\` | Extra classes. |

\`ToastItem\` = \`ToastProps & { id: string; duration?: number }\`. \`duration\` is ms (default \`4000\`, \`0\` disables auto-dismiss).

\`ToastViewport\` props: \`toasts\`, \`onDismiss(id)\`, \`align\` (\`'start' | 'center' | 'end'\`, default \`center\`), \`fixed\` (default \`true\`).

## Usage

\`\`\`tsx
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
\`\`\`

Standalone card:

\`\`\`tsx
<Toast
  variant="error"
  title="تراکنش ناموفق بود"
  description="موجودی حساب کافی نیست."
  action={{ label: 'تلاش دوباره', onClick: retry }}
  onClose={close}
/>
\`\`\`

## Accessibility

- \`role="alert"\` / \`aria-live="assertive"\` for errors, \`role="status"\` / \`polite\` otherwise.
- Close button is keyboard focusable with a visible focus ring; icons are \`aria-hidden\`.
`,
  "Tooltip": `# Tooltip

Short hover/focus hint for icon-only controls and truncated labels. Renders a dark bubble with an arrow, positioned relative to its trigger, animated with framer-motion.

## Usage

\`\`\`tsx
import { Tooltip } from 'components/Tooltip'

<Tooltip content="Notifications">
  <button aria-label="Notifications">
    <BellIcon className="h-5 w-5" />
  </button>
</Tooltip>
\`\`\`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`content\` | \`ReactNode\` | — | Text or nodes shown in the bubble. |
| \`children\` | \`ReactElement\` | — | Single trigger element; must accept DOM event handlers. |
| \`placement\` | \`'top' \\| 'bottom' \\| 'left' \\| 'right'\` | \`'top'\` | Side of the trigger to anchor to. |
| \`delay\` | \`number\` | \`150\` | Hover open delay in ms (focus always opens instantly). |
| \`disabled\` | \`boolean\` | \`false\` | Suppresses the tooltip. |
| \`className\` | \`string\` | \`''\` | Extra classes on the bubble. |

## Behavior & accessibility

- Opens on hover (after \`delay\`) and instantly on keyboard focus; closes on mouse leave, blur, or \`Escape\`.
- Bubble uses \`role="tooltip"\` and is wired to the trigger via \`aria-describedby\`.
- The bubble is \`pointer-events-none\`, so it never blocks the trigger.
- Tooltips are hints only — never put essential or interactive content inside; always keep an \`aria-label\` on icon-only buttons.
`
};

export const componentRegistry: ComponentPreviewModule[] = [
__AlertBannerPreviews,
__AvatarPreviews,
__BadgePreviews,
__BreadcrumbsPreviews,
__ButtonPreviews,
__CTASectionPreviews,
__CardPreviews,
__ChartCardPreviews,
__CheckboxPreviews,
__DrawerPreviews,
__EmptyStatePreviews,
__FeatureCardPreviews,
__HeroSectionPreviews,
__IconButtonPreviews,
__InputPreviews,
__LogoPreviews,
__ModalPreviews,
__NavbarPreviews,
__PaginationPreviews,
__PeriodSelectorPreviews,
__PricingCardPreviews,
__RadioGroupPreviews,
__SelectPreviews,
__SidebarPreviews,
__SkeletonPreviews,
__StatCardPreviews,
__StatusPillPreviews,
__SwitchPreviews,
__TablePreviews,
__TabsPreviews,
__TextareaPreviews,
__ToastPreviews,
__TooltipPreviews].

filter((m) => m && m.componentName).
map((m) => ({ ...m, contextMd: __contextMd[m.componentName] ?? m.contextMd })).
sort((a, b) => a.componentName.localeCompare(b.componentName));