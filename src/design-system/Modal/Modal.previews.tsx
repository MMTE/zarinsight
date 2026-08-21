import { useState } from 'react';
import { Modal, type ModalProps } from './index';
import type { ComponentPreviewModule } from '../previewTypes';

const primaryButton =
'inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2';
const secondaryButton =
'inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-600 ring-1 ring-slate-200 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2';

function ModalDemo({
  trigger = 'باز کردن',
  defaultOpen = true,
  ...props



}: Omit<ModalProps, 'open' | 'onClose'> & {trigger?: string;defaultOpen?: boolean;}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      dir="rtl"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: 220
      }}>
      
      <button type="button" className={primaryButton} onClick={() => setOpen(true)}>
        {trigger}
      </button>
      <Modal {...props} open={open} onClose={() => setOpen(false)} />
    </div>);

}

const previews: ComponentPreviewModule = {
  componentName: 'Modal',
  importPath: 'components/Modal',
  previews: [
  {
    name: 'Settlement confirmation',
    description: 'Centered dialog with title, body copy and action row.',
    render: () =>
    <ModalDemo
      trigger="تسویه حساب"
      title="تأیید تسویه حساب"
      description="مبلغ قابل تسویه به حساب بانکی ثبت‌شده واریز می‌شود."
      footer={
      <>
              <button type="button" className={primaryButton}>
                تأیید و تسویه
              </button>
              <button type="button" className={secondaryButton}>
                انصراف
              </button>
            </>
      }>
      
          <dl className="space-y-3">
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">مبلغ تسویه</dt>
              <dd className="font-bold text-slate-900">۱٬۲۴۰٬۰۰۰ تومان</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">شماره شبا</dt>
              <dd className="font-medium text-slate-900">IR۵۲۰۵۴۰۱۰۲۶۸۰</dd>
            </div>
          </dl>
        </ModalDemo>

  },
  {
    name: 'Simple message',
    description: 'Small dialog with a single action and no body content.',
    render: () =>
    <ModalDemo
      size="sm"
      trigger="نمایش پیام"
      title="درخواست ثبت شد"
      description="نتیجه بررسی از طریق پیامک اطلاع‌رسانی می‌شود."
      footer={
      <button type="button" className={primaryButton}>
              متوجه شدم
            </button>
      } />


  },
  {
    name: 'Closed (trigger only)',
    description: 'Non-dismissible large dialog, opened from the trigger button.',
    render: () =>
    <ModalDemo
      defaultOpen={false}
      size="lg"
      dismissible={false}
      showCloseButton={false}
      trigger="شروع فرآیند"
      title="احراز هویت کسب‌وکار"
      description="برای ادامه، اطلاعات هویتی خود را تکمیل کنید."
      footer={
      <button type="button" className={primaryButton}>
              ادامه
            </button>
      }>
      
          این مرحله قابل بازگشت نیست و تا پایان بررسی، امکان ویرایش اطلاعات وجود
          ندارد.
        </ModalDemo>

  }]

};

export default previews;