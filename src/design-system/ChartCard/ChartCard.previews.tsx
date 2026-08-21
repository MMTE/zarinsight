import { ChartCard } from './index';
import type { ComponentPreviewModule } from '../previewTypes';

const data = [
{ label: 'فروردین', value: 12400000 },
{ label: 'اردیبهشت', value: 15800000 },
{ label: 'خرداد', value: 14200000 },
{ label: 'تیر', value: 19600000 },
{ label: 'مرداد', value: 23100000 },
{ label: 'شهریور', value: 21500000 },
{ label: 'مهر', value: 27800000 }];


const compact = (v: number) => `${Math.round(v / 1_000_000).toLocaleString('fa-IR')}م`;

const previews: ComponentPreviewModule = {
  componentName: 'ChartCard',
  importPath: 'components/ChartCard',
  previews: [
  {
    name: 'Area (default)',
    description: 'Revenue area chart with summary value, trend badge, and period selector.',
    render: () =>
    <ChartCard
      title="درآمد کل"
      description="مجموع تراکنش‌های موفق درگاه پرداخت"
      value="۲۷٬۸۰۰٬۰۰۰ تومان"
      change={12.4}
      data={data}
      formatValue={compact} />


  },
  {
    name: 'Line variant',
    description: 'Line chart style with a negative trend badge.',
    render: () =>
    <ChartCard
      title="درآمد کل"
      value="۲۱٬۵۰۰٬۰۰۰ تومان"
      change={-4.8}
      variant="line"
      data={data}
      formatValue={compact} />


  },
  {
    name: 'Loading',
    description: 'Skeleton state while chart data is being fetched.',
    render: () => <ChartCard title="درآمد کل" loading data={[]} />
  },
  {
    name: 'Error & empty',
    description: 'Error state, and an empty state when no data is returned.',
    render: () =>
    <div className="flex w-full flex-col gap-4">
          <ChartCard title="درآمد کل" error="بارگذاری داده‌ها ناموفق بود" data={[]} height={180} />
          <ChartCard title="درآمد کل" data={[]} height={180} />
        </div>

  }]

};

export default previews;