import { HeroSection } from './index';
import type { ComponentPreviewModule } from '../previewTypes';

const previews: ComponentPreviewModule = {
  componentName: 'HeroSection',
  importPath: 'components/HeroSection',
  previews: [
  {
    name: 'Default (RTL)',
    description: 'Marketing hero with two-line headline, subcopy, and pill CTA.',
    render: () =>
    <HeroSection
      title={['بیش از ۱۵ سال انتخاب مطمئن', 'کسب‌وکارهای آنلاین']}
      description="زرین‌پال، به عنوان اولین پرداخت‌یار کشور، با به‌کارگیری استانداردهای جدید در ارائه خدمات درگاه پرداخت اینترنتی، سرویس‌های متنوعی در حوزه‌ی پرداخت الکترونیک را برای کسب و کارها ارائه می‌کند."
      ctaLabel="ورود یا ثبت‌نام"
      ctaHref="#signup" />


  },
  {
    name: 'Headline only',
    description: 'Minimal variant without subcopy, CTA, or scroll cue.',
    render: () =>
    <HeroSection title="پرداخت آنلاین، ساده و مطمئن" showScrollCue={false} />

  },
  {
    name: 'LTR',
    description: 'Left-to-right layout for English content.',
    render: () =>
    <HeroSection
      dir="ltr"
      title={['15+ years of trusted payments', 'for online businesses']}
      description="Zarinpal provides a complete suite of electronic payment services, from internet payment gateways to developer-friendly APIs."
      ctaLabel="Sign in or register"
      onCtaClick={() => {}} />


  }]

};

export default previews;