import { useState } from 'react';
import { Toast, ToastViewport, type ToastItem } from './index';
import type { ComponentPreviewModule } from '../previewTypes';

function StackDemo() {
  const [toasts, setToasts] = useState<ToastItem[]>([
  { id: '1', variant: 'success', title: 'پرداخت با موفقیت انجام شد', duration: 0 },
  {
    id: '2',
    variant: 'error',
    title: 'تراکنش ناموفق بود',
    description: 'موجودی حساب کافی نیست.',
    duration: 0
  }]
  );

  const add = () =>
  setToasts((current) => [
  ...current,
  {
    id: `t-${Date.now()}`,
    variant: 'info',
    title: 'در حال بررسی تراکنش',
    description: 'نتیجه تا لحظاتی دیگر اعلام می‌شود.',
    duration: 3000
  }]
  );

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-center">
        <button
          type="button"
          onClick={add}
          className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800">
          
          نمایش اعلان جدید
        </button>
      </div>
      <ToastViewport
        toasts={toasts}
        onDismiss={(id) => setToasts((c) => c.filter((t) => t.id !== id))}
        fixed={false} />
      
    </div>);

}

const previews: ComponentPreviewModule = {
  componentName: 'Toast',
  importPath: 'components/Toast',
  previews: [
  {
    name: 'Success',
    description: 'Confirms a completed action.',
    render: () =>
    <div className="flex w-full justify-center">
          <Toast
        variant="success"
        title="پرداخت با موفقیت انجام شد"
        description="رسید تراکنش به ایمیل شما ارسال شد."
        onClose={() => {}} />
      
        </div>

  },
  {
    name: 'Error with action',
    description: 'Failure feedback with an inline retry action.',
    render: () =>
    <div className="flex w-full justify-center">
          <Toast
        variant="error"
        title="تراکنش ناموفق بود"
        description="اتصال به درگاه پرداخت برقرار نشد."
        action={{ label: 'تلاش دوباره', onClick: () => {} }}
        onClose={() => {}} />
      
        </div>

  },
  {
    name: 'Warning & info',
    description: 'Lower-priority intents without a description.',
    render: () =>
    <div className="flex w-full flex-col items-center gap-3">
          <Toast variant="warning" title="احراز هویت شما ناقص است" onClose={() => {}} />
          <Toast variant="info" title="در حال بررسی تراکنش" />
        </div>

  },
  {
    name: 'Stacked viewport',
    description: 'Animated top-anchored stack with auto-dismiss.',
    render: () => <StackDemo />
  }]

};

export default previews;