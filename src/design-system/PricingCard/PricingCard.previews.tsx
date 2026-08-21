import { PricingCard } from './index';
import type { ComponentPreviewModule } from '../previewTypes';

const baseFeatures = [
{ label: 'درگاه پرداخت اینترنتی' },
{ label: 'تسویه روزانه' },
{ label: 'پشتیبانی ۲۴ ساعته' },
{ label: 'گزارش‌های پیشرفته', included: false }];


const previews: ComponentPreviewModule = {
  componentName: 'PricingCard',
  importPath: 'components/PricingCard',
  previews: [
  {
    name: 'Default',
    description: 'Standard plan card on a light surface',
    render: () =>
    <PricingCard
      name="پایه"
      description="مناسب کسب‌وکارهای تازه‌کار"
      price="۱۹۹٬۰۰۰"
      currency="تومان"
      period="ماهانه"
      features={baseFeatures} />


  },
  {
    name: 'Featured',
    description: 'Emphasized dark plan with badge and full feature set',
    render: () =>
    <PricingCard
      featured
      badge="محبوب‌ترین"
      name="حرفه‌ای"
      description="برای فروشگاه‌های پرتراکنش"
      price="۴۹۹٬۰۰۰"
      currency="تومان"
      period="ماهانه"
      ctaLabel="ورود یا ثبت‌نام"
      features={[
      { label: 'همه امکانات پلن پایه' },
      { label: 'تسویه آنی' },
      { label: 'مدیر حساب اختصاصی' },
      { label: 'گزارش‌های پیشرفته' }]
      } />


  },
  {
    name: 'Free / Disabled CTA',
    description: 'Free tier with a disabled call to action',
    render: () =>
    <PricingCard
      name="رایگان"
      description="برای تست و توسعه"
      price="رایگان"
      features={[
      { label: 'محیط آزمایشی' },
      { label: 'مستندات توسعه‌دهندگان' },
      { label: 'تسویه خودکار', included: false }]
      }
      ctaLabel="پلن فعلی شما"
      disabled />


  }]

};

export default previews;