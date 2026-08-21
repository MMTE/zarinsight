import { SearchIcon, MailIcon } from 'lucide-react';
import { Input } from './index';
import type { ComponentPreviewModule } from '../previewTypes';

const previews: ComponentPreviewModule = {
  componentName: 'Input',
  importPath: 'components/Input',
  previews: [
  {
    name: 'Default',
    description: 'Label with helper text, RTL aligned',
    render: () =>
    <div style={{ width: 320 }}>
          <Input
        label="نام کاربری"
        placeholder="نام خود را وارد کنید"
        helperText="نام نمایشی شما در پنل زرین‌پال" />
      
        </div>

  },
  {
    name: 'With icons',
    description: 'Logical start/end icon slots',
    render: () =>
    <div style={{ width: 320, display: 'grid', gap: 16 }}>
          <Input
        label="جستجو"
        placeholder="جستجو در تراکنش‌ها"
        startIcon={<SearchIcon size={18} />} />
      
          <Input
        label="ایمیل"
        placeholder="you@example.com"
        endIcon={<MailIcon size={18} />} />
      
        </div>

  },
  {
    name: 'Error',
    description: 'Invalid value with error message',
    render: () =>
    <div style={{ width: 320 }}>
          <Input
        label="شماره موبایل"
        required
        defaultValue="0912"
        error="شماره موبایل باید ۱۱ رقم باشد." />
      
        </div>

  },
  {
    name: 'Sizes & disabled',
    description: 'sm / md / lg and disabled state',
    render: () =>
    <div style={{ width: 320, display: 'grid', gap: 16 }}>
          <Input inputSize="sm" placeholder="کوچک" />
          <Input inputSize="md" placeholder="متوسط" />
          <Input inputSize="lg" placeholder="بزرگ" />
          <Input label="کد ملی" disabled placeholder="غیرفعال" />
        </div>

  }]

};

export default previews;