# Tabs

Segmented view switcher for dashboard sections and settings pages. Supports a filled `segmented` style and a `underline` style, optional badges/icons, and full keyboard navigation (Arrow keys, Home, End) with RTL-aware arrow direction.

## Props — `Tabs`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `TabItem[]` | — | Tabs to render. `TabItem = { value, label, icon?, badge?, disabled? }` |
| `value` | `string` | — | Controlled active tab value |
| `defaultValue` | `string` | first enabled item | Initial value when uncontrolled |
| `onValueChange` | `(value: string) => void` | — | Fires when the active tab changes |
| `variant` | `'segmented' \| 'underline'` | `'segmented'` | Visual style |
| `size` | `'sm' \| 'md'` | `'md'` | Control density |
| `fullWidth` | `boolean` | `false` | Stretch tabs to fill the container |
| `aria-label` | `string` | — | Accessible name for the tablist |
| `children` | `ReactNode` | — | Usually `TabPanel` elements |

## Props — `TabPanel`

| Prop | Type | Description |
| --- | --- | --- |
| `value` | `string` | Matching tab value |
| `children` | `ReactNode` | Panel content (only rendered when active) |

## Usage

```tsx
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
```

Controlled:

```tsx
const [tab, setTab] = useState('overview')
<Tabs items={items} value={tab} onValueChange={setTab} />
```
