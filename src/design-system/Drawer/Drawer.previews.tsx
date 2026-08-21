import { useState } from 'react';
import { Drawer } from './index';
import type { ComponentPreviewModule } from '../previewTypes';

function DrawerDemo({
  label,
  ...props
}: {label: string;} & Omit<React.ComponentProps<typeof Drawer>, 'open' | 'onClose'>) {
  const [open, setOpen] = useState(false);
  return (
    <div
      dir="rtl"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-blue-700 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
        
        {label}
      </button>
      <Drawer open={open} onClose={() => setOpen(false)} {...props} />
    </div>);

}

const previews: ComponentPreviewModule = {
  componentName: 'Drawer',
  importPath: 'components/Drawer',
  previews: [
  {
    name: 'Default',
    description: 'پنل کشویی از سمت راست با عنوان و توضیح',
    render: () =>
    <DrawerDemo
      label="مشاهده جزئیات تراکنش"
      title="جزئیات تراکنش"
      description="شناسه پرداخت ۱۴۰۳۰۹۲۲-۸۸۴۵۱">
      
          <dl className="space-y-4">
            {[
        ['مبلغ', '۱٬۲۵۰٬۰۰۰ ریال'],
        ['وضعیت', 'پرداخت موفق'],
        ['درگاه', 'زرین‌پال'],
        ['تاریخ', '۲۲ آذر ۱۴۰۳ - ۱۴:۳۲']].
        map(([term, value]) =>
        <div key={term} className="flex items-center justify-between gap-4">
                <dt className="text-slate-500">{term}</dt>
                <dd className="font-bold text-slate-900">{value}</dd>
              </div>
        )}
          </dl>
        </DrawerDemo>

  },
  {
    name: 'With footer actions',
    description: 'حالت ویرایش با دکمه‌های عملیات در پایین پنل',
    render: () =>
    <DrawerDemo
      label="ویرایش کسب‌وکار"
      title="ویرایش کسب‌وکار"
      description="اطلاعات درگاه پرداخت خود را به‌روزرسانی کنید."
      size="lg"
      footer={
      <div className="flex justify-end gap-3">
              <button
          type="button"
          className="rounded-full px-5 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200">
          
                انصراف
              </button>
              <button
          type="button"
          className="rounded-full bg-blue-700 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-800">
          
                ذخیره تغییرات
              </button>
            </div>
      }>
      
          <form className="space-y-5">
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-slate-800">نام کسب‌وکار</span>
              <input
            defaultValue="فروشگاه اینترنتی نمونه"
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600" />
          
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-slate-800">آدرس وب‌سایت</span>
              <input
            defaultValue="https://example.ir"
            dir="ltr"
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600" />
          
            </label>
          </form>
        </DrawerDemo>

  },
  {
    name: 'Left anchored, small',
    description: 'پنل باریک لنگرشده به سمت چپ بدون امکان بستن با کلیک روی پس‌زمینه',
    render: () =>
    <DrawerDemo
      label="فیلترها"
      title="فیلترها"
      side="left"
      size="sm"
      closeOnOverlayClick={false}>
      
          <ul className="space-y-3">
            {['پرداخت موفق', 'در انتظار تأیید', 'بازگشت وجه', 'ناموفق'].map((item) =>
        <li key={item} className="flex items-center gap-3">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-700" />
                <span>{item}</span>
              </li>
        )}
          </ul>
        </DrawerDemo>

  }]

};

export default previews;