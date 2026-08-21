import { Breadcrumbs } from './index';
import type { ComponentPreviewModule } from '../previewTypes';

const previews: ComponentPreviewModule = {
  componentName: 'Breadcrumbs',
  importPath: 'components/Breadcrumbs',
  previews: [
  {
    name: 'Default',
    description: 'Two-level trail with the current page emphasized.',
    render: () =>
    <Breadcrumbs
      items={[
      { label: 'داشبورد', href: '#' },
      { label: 'تراکنش‌ها' }]
      } />


  },
  {
    name: 'With home icon',
    description: 'Deeper path with a home icon on the root item.',
    render: () =>
    <Breadcrumbs
      showHomeIcon
      items={[
      { label: 'خانه', href: '#' },
      { label: 'درگاه پرداخت', href: '#' },
      { label: 'تنظیمات', href: '#' },
      { label: 'وب‌هوک‌ها' }]
      } />


  },
  {
    name: 'Collapsed',
    description: 'Long trail collapsed to the first and last levels.',
    render: () =>
    <Breadcrumbs
      showHomeIcon
      maxItems={3}
      items={[
      { label: 'خانه', href: '#' },
      { label: 'کسب‌وکارها', href: '#' },
      { label: 'زرین‌پال', href: '#' },
      { label: 'گزارش‌ها', href: '#' },
      { label: 'تسویه حساب' }]
      } />


  },
  {
    name: 'Single level',
    description: 'Root-only trail, rendered as the current page.',
    render: () => <Breadcrumbs items={[{ label: 'داشبورد' }]} />
  }]

};

export default previews;