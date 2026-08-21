import { Table } from './index';
import type { TransactionRow } from './index';
import type { ComponentPreviewModule } from '../previewTypes';

const rows: TransactionRow[] = [
{ id: 'A00000000123456789', date: '۱۴۰۳/۰۵/۲۱', amount: 1250000, status: 'success' },
{ id: 'A00000000123456790', date: '۱۴۰۳/۰۵/۲۰', amount: 480000, status: 'pending' },
{ id: 'A00000000123456791', date: '۱۴۰۳/۰۵/۱۹', amount: 96000, status: 'failed' },
{ id: 'A00000000123456792', date: '۱۴۰۳/۰۵/۱۸', amount: 3200000, status: 'refunded' }];


const previews: ComponentPreviewModule = {
  componentName: 'Table',
  importPath: 'components/Table',
  previews: [
  {
    name: 'Default',
    description: 'Transaction list with all status states',
    render: () => <Table rows={rows} />
  },
  {
    name: 'Interactive rows',
    description: 'Rows are clickable and keyboard focusable',
    render: () => <Table rows={rows.slice(0, 3)} onRowClick={() => {}} />
  },
  {
    name: 'Loading',
    description: 'Skeleton rows while transactions load',
    render: () => <Table rows={[]} loading />
  },
  {
    name: 'Empty',
    description: 'No transactions match the current filters',
    render: () => <Table rows={[]} />
  },
  {
    name: 'Error',
    description: 'Data could not be fetched',
    render: () => <Table rows={[]} error="خطا در دریافت تراکنش‌ها. دوباره تلاش کنید." />
  }]

};

export default previews;