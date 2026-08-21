import { Select } from './index';
import type { ComponentPreviewModule } from '../previewTypes';

const gateways = [
{ label: 'درگاه پرداخت اینترنتی', value: 'ipg' },
{ label: 'پرداخت مستقیم', value: 'direct' },
{ label: 'پرداخت اقساطی', value: 'installment' },
{ label: 'پرداخت بین‌المللی', value: 'intl', disabled: true }];


const periods = [
{ label: '۷ روز گذشته', value: '7d' },
{ label: '۳۰ روز گذشته', value: '30d' },
{ label: '۱۲ ماه گذشته', value: '12m' }];


const previews: ComponentPreviewModule = {
  componentName: 'Select',
  importPath: 'components/Select',
  previews: [
  {
    name: 'Default',
    description: 'Labelled select with placeholder and RTL chevron',
    render: () =>
    <div style={{ width: 320 }}>
          <Select
        label="نوع سرویس"
        placeholder="یک گزینه را انتخاب کنید"
        options={gateways} />
      
        </div>

  },
  {
    name: 'With value and hint',
    description: 'Pre-selected value with helper text',
    render: () =>
    <div style={{ width: 320 }}>
          <Select
        label="بازه زمانی"
        defaultValue="30d"
        hint="گزارش‌ها بر اساس این بازه محاسبه می‌شوند."
        options={periods} />
      
        </div>

  },
  {
    name: 'Error',
    description: 'Invalid state with error message',
    render: () =>
    <div style={{ width: 320 }}>
          <Select
        label="نوع سرویس"
        placeholder="یک گزینه را انتخاب کنید"
        error="انتخاب نوع سرویس الزامی است."
        required
        options={gateways} />
      
        </div>

  },
  {
    name: 'Sizes',
    description: 'Small, medium, and large fields',
    render: () =>
    <div
      style={{
        width: 320,
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}>
      
          <Select size="sm" defaultValue="7d" options={periods} />
          <Select size="md" defaultValue="30d" options={periods} />
          <Select size="lg" defaultValue="12m" options={periods} />
        </div>

  },
  {
    name: 'Disabled',
    description: 'Non-interactive state',
    render: () =>
    <div style={{ width: 320 }}>
          <Select
        label="نوع سرویس"
        defaultValue="ipg"
        disabled
        options={gateways} />
      
        </div>

  }]

};

export default previews;