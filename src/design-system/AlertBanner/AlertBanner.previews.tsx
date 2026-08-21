import { AlertBanner } from './index';
import type { ComponentPreviewModule } from '../previewTypes';

const previews: ComponentPreviewModule = {
  componentName: 'AlertBanner',
  importPath: 'components/AlertBanner',
  previews: [
  {
    name: 'Warning',
    description: 'Amber account notice with an outlined action button.',
    render: () =>
    <AlertBanner
      tone="warning"
      title="احراز هویت ناقص است"
      actionLabel="تکمیل اطلاعات"
      onAction={() => {}}>
      
          برای فعال‌سازی درگاه پرداخت، اطلاعات هویتی خود را تکمیل کنید.
        </AlertBanner>

  },
  {
    name: 'Danger',
    description: 'Red banner for blocking errors, with dismiss.',
    render: () =>
    <AlertBanner
      tone="danger"
      title="تراکنش ناموفق بود"
      actionLabel="تلاش مجدد"
      dismissible
      onAction={() => {}}
      onDismiss={() => {}}>
      
          مبلغ از حساب شما کسر نشده است. لطفاً چند دقیقه دیگر دوباره تلاش کنید.
        </AlertBanner>

  },
  {
    name: 'Message only',
    description: 'Simple notice without title or action button.',
    render: () =>
    <AlertBanner tone="warning">
          تسویه‌حساب‌های امروز با تأخیر انجام می‌شوند.
        </AlertBanner>

  },
  {
    name: 'LTR',
    description: 'Left-to-right layout for English content.',
    render: () =>
    <AlertBanner
      tone="danger"
      dir="ltr"
      title="Payment gateway disabled"
      actionLabel="Contact support"
      onAction={() => {}}>
      
          Your gateway was suspended due to unusual activity.
        </AlertBanner>

  }]

};

export default previews;