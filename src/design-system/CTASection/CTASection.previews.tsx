import { CTASection } from './index';
import type { ComponentPreviewModule } from '../previewTypes';

const previews: ComponentPreviewModule = {
  componentName: 'CTASection',
  importPath: 'components/CTASection',
  previews: [
  {
    name: 'Dark centered',
    description: 'Default closing band with headline, description and pill CTA.',
    render: () =>
    <CTASection
      headline={['بیش از ۱۵ سال انتخاب مطمئن', 'کسب‌وکارهای آنلاین']}
      description="زرین‌پال، به عنوان اولین پرداخت‌یار کشور، سرویس‌های متنوعی در حوزه‌ی پرداخت الکترونیک را برای کسب‌وکارها ارائه می‌کند."
      ctaLabel="ورود یا ثبت‌نام"
      ctaHref="#signup" />


  },
  {
    name: 'Headline only',
    description: 'Compact band without supporting copy.',
    render: () =>
    <CTASection
      headline="همین حالا درگاه پرداخت خود را بسازید"
      ctaLabel="شروع کنید"
      onCtaClick={() => {}} />


  },
  {
    name: 'Light, start aligned',
    description: 'Light tone with right-aligned content for in-page sections.',
    render: () =>
    <CTASection
      tone="light"
      align="start"
      headline="پشتیبانی ۲۴ ساعته در کنار شماست"
      description="تیم پشتیبانی زرین‌پال در تمام روزهای هفته پاسخگوی سوالات شماست."
      ctaLabel="تماس با ما"
      ctaHref="#contact" />


  },
  {
    name: 'LTR',
    description: 'Left-to-right variant for English content.',
    render: () =>
    <CTASection
      dir="ltr"
      headline={['Trusted by online businesses', 'for over 15 years']}
      description="Start accepting payments with the first payment facilitator in the country."
      ctaLabel="Get started"
      ctaHref="#start" />


  }]

};

export default previews;