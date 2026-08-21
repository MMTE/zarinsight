import { EmptyState } from './index';
import { CreditCardIcon, SearchXIcon } from 'lucide-react';
import type { ComponentPreviewModule } from '../previewTypes';

const previews: ComponentPreviewModule = {
  componentName: 'EmptyState',
  importPath: 'components/EmptyState',
  previews: [
  {
    name: 'Default',
    description: 'Title and description only, for a panel with no data yet.',
    render: () =>
    <EmptyState
      title="هنوز تراکنشی ثبت نشده است"
      description="پس از اولین پرداخت موفق، تراکنش‌های شما در این جدول نمایش داده می‌شود." />


  },
  {
    name: 'With actions',
    description: 'Primary and secondary calls to action inside a dashed placeholder panel.',
    render: () =>
    <EmptyState
      bordered
      icon={<CreditCardIcon className="h-7 w-7" strokeWidth={1.75} />}
      title="درگاه پرداختی ندارید"
      description="برای دریافت پرداخت آنلاین، یک درگاه جدید بسازید و آن را به کسب‌وکار خود متصل کنید."
      action={{ label: 'ایجاد درگاه جدید' }}
      secondaryAction={{ label: 'راهنمای شروع' }} />


  },
  {
    name: 'Compact search result',
    description: 'Small size, English LTR content for a filtered table with no matches.',
    render: () =>
    <EmptyState
      size="sm"
      dir="ltr"
      bordered
      icon={<SearchXIcon className="h-5 w-5" strokeWidth={1.75} />}
      title="No results found"
      description="Try adjusting your filters or search with a different transaction ID."
      action={{ label: 'Clear filters' }} />


  }]

};

export default previews;