import type { Kpi } from '../types/analytics';

export const business = { name: 'فروشگاه زرین', meta: 'zarinshop.ir', user: 'سارا محمدی' };

export const periodOptions = [
{ value: '7', label: '۷ روز اخیر' },
{ value: '30', label: '۳۰ روز اخیر' },
{ value: '90', label: '۹۰ روز اخیر' },
{ value: '180', label: '۶ ماه اخیر' },
{ value: 'custom', label: 'بازه دلخواه' }];


export const compareOptions = [
{ value: 'previous', label: 'مقایسه با دوره قبل' },
{ value: 'lastYear', label: 'مقایسه با همین بازه در گذشته' },
{ value: 'none', label: 'بدون مقایسه' }];


export const prototypeNotice =
'اعداد از موتور تحلیل روی مجموعه‌دادهٔ متصل می‌آیند؛ فیلتر و پرس‌وجوی هر عدد در «محاسبه» هست.';

export const summary = {
  headline: 'درآمد موفق شما در ۳۰ روز اخیر ۸٫۴٪ کاهش داشته است.',
  body: 'بیش‌ترین بخش این تغییر با افت نرخ موفقیت پرداخت در ساعت‌های پرتراکنش مرتبط است.',
  findings: '۳ یافته مهم برای بررسی پیدا کرده‌ایم.'
};

export const biggestChange = {
  metric: 'نرخ موفقیت پرداخت',
  from: '۷۹٫۶٪',
  to: '۷۱٫۴٪',
  note: 'بین همه معیارهای کلیدی، این بزرگ‌ترین تغییر نسبت به دوره قبل است.',
  insightId: 'psp08-drop'
};

export const kpis: Kpi[] = [
{
  id: 'revenue',
  label: 'درآمد موفق',
  value: '۲٫۸۴',
  unit: 'میلیارد تومان',
  delta: -8.4,
  deltaUnit: 'percent',
  positiveWhen: 'up',
  note: 'نسبت به ۳۰ روز قبل'
},
{
  id: 'success-count',
  label: 'تعداد پرداخت موفق',
  value: '۱۸٬۴۲۱',
  unit: 'پرداخت',
  delta: 4.1,
  deltaUnit: 'percent',
  positiveWhen: 'up',
  note: 'نسبت به ۳۰ روز قبل'
},
{
  id: 'success-rate',
  label: 'نرخ موفقیت پرداخت',
  value: '۷۱٫۴٪',
  delta: -8.2,
  deltaUnit: 'points',
  positiveWhen: 'up',
  note: 'نسبت به ۳۰ روز قبل'
},
{
  id: 'repeat',
  label: 'مشتریان تکراری',
  value: '۲۴٫۸٪',
  delta: 3.2,
  deltaUnit: 'points',
  positiveWhen: 'up',
  note: 'فقط پرداخت‌های دارای شناسه مشتری'
},
{
  id: 'avg-amount',
  label: 'میانگین مبلغ پرداخت',
  value: '۱۴۲',
  unit: 'هزار تومان',
  delta: 6.1,
  deltaUnit: 'percent',
  positiveWhen: 'up',
  note: 'نسبت به ۳۰ روز قبل'
}];


export const opportunities = [
{ label: 'بهبود نرخ موفقیت پرداخت', amount: 86_000_000, insightId: 'psp08-drop' },
{ label: 'مشتریان تکراری', amount: 54_000_000, insightId: 'repeat-customers' },
{ label: 'کاهش رها شدن پرداخت', amount: 31_000_000, insightId: 'retry-abandon' },
{ label: 'کاهش وابستگی به مشتریان بزرگ', amount: 15_000_000, insightId: 'revenue-concentration' }];


export const opportunityTotal = opportunities.reduce((sum, item) => sum + item.amount, 0);

export interface TrendPoint {
  label: string;
  revenue: number;
  successRate: number;
  successCount: number;
  marker?: {type: 'anomaly' | 'trend' | 'peak';label: string;insightId: string;};
}

export const trendSeries: TrendPoint[] = [
{ label: '۱ خرداد', revenue: 104_200_000, successRate: 79.8, successCount: 1402 },
{ label: '۳ خرداد', revenue: 108_600_000, successRate: 80.2, successCount: 1448 },
{
  label: '۵ خرداد',
  revenue: 121_900_000,
  successRate: 81.4,
  successCount: 1561,
  marker: { type: 'peak', label: 'نقطه اوج بازه', insightId: 'weekend-growth' }
},
{ label: '۷ خرداد', revenue: 101_700_000, successRate: 79.4, successCount: 1386 },
{
  label: '۹ خرداد',
  revenue: 88_100_000,
  successRate: 75.2,
  successCount: 1274,
  marker: { type: 'anomaly', label: 'افت غیرعادی نرخ موفقیت', insightId: 'psp08-drop' }
},
{ label: '۱۱ خرداد', revenue: 90_200_000, successRate: 74.9, successCount: 1281 },
{
  label: '۱۳ خرداد',
  revenue: 89_600_000,
  successRate: 73.4,
  successCount: 1259,
  marker: { type: 'trend', label: 'شروع روند نزولی', insightId: 'psp08-drop' }
},
{ label: '۱۵ خرداد', revenue: 94_700_000, successRate: 72.8, successCount: 1302 },
{ label: '۱۷ خرداد', revenue: 93_300_000, successRate: 72.2, successCount: 1288 },
{
  label: '۱۹ خرداد',
  revenue: 106_400_000,
  successRate: 72.9,
  successCount: 1421,
  marker: { type: 'trend', label: 'رشد فروش پایان هفته', insightId: 'weekend-growth' }
},
{ label: '۲۱ خرداد', revenue: 95_800_000, successRate: 71.9, successCount: 1311 },
{ label: '۲۳ خرداد', revenue: 90_100_000, successRate: 71.4, successCount: 1264 },
{ label: '۲۵ خرداد', revenue: 94_300_000, successRate: 71.5, successCount: 1298 },
{ label: '۲۷ خرداد', revenue: 99_200_000, successRate: 71.6, successCount: 1352 },
{ label: '۳۰ خرداد', revenue: 95_600_000, successRate: 71.4, successCount: 1310 }];


export const quickQuestions = [
'چرا فروشم کم شده؟',
'کدام مسیر پرداخت بهتر عمل می‌کند؟',
'مشتریان تکراری چقدر ارزش دارند؟',
'این ماه چه چیزی تغییر کرده است؟',
'کدام بخش بیش‌ترین فرصت رشد را دارد؟'];


export const loadingSteps = [
'روند فروش',
'عملکرد پرداخت',
'مقایسه با کسب‌وکارهای مشابه',
'رفتار مشتریان'];