import { Sidebar, defaultSidebarItems } from './index';
import type { ComponentPreviewModule } from '../previewTypes';

const frame = (children: React.ReactNode) =>
<div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
    <div className="h-[520px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
      {children}
    </div>
  </div>;


const previews: ComponentPreviewModule = {
  componentName: 'Sidebar',
  importPath: 'components/Sidebar',
  previews: [
  {
    name: 'Expanded',
    description: 'Default expanded rail with the active gateway header.',
    render: () => frame(<Sidebar activeId="dashboard" />)
  },
  {
    name: 'Collapsed',
    description: 'Icon-only rail for narrow layouts.',
    render: () => frame(<Sidebar defaultCollapsed activeId="transactions" />)
  },
  {
    name: 'Custom items',
    description: 'Trimmed navigation with a different active section and gateway.',
    render: () =>
    frame(
      <Sidebar
        items={defaultSidebarItems.slice(0, 4)}
        activeId="wallet"
        gatewayName="دیجی‌مارکت"
        gatewayMeta="digimarket.com" />

    )
  }]

};

export default previews;