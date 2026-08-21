export const salesKpis = [
{
  id: 'revenue',
  label: 'درآمد موفق',
  value: '۲٫۸۴ میلیارد تومان',
  delta: -8.4,
  unit: 'percent' as const,
  positiveWhen: 'up' as const,
  note: 'نسبت به دوره قبل'
},
{
  id: 'growth',
  label: 'رشد درآمد',
  value: '−۸٫۴٪',
  delta: -8.4,
  unit: 'percent' as const,
  positiveWhen: 'up' as const,
  note: 'نسبت به دوره قبل'
},
{
  id: 'count',
  label: 'تعداد پرداخت موفق',
  value: '۱۸٬۴۲۱',
  delta: 4.1,
  unit: 'percent' as const,
  positiveWhen: 'up' as const,
  note: 'نسبت به دوره قبل'
},
{
  id: 'avg',
  label: 'میانگین مبلغ پرداخت',
  value: '۱۴۲ هزار تومان',
  delta: 6.1,
  unit: 'percent' as const,
  positiveWhen: 'up' as const,
  note: 'نسبت به دوره قبل'
}];


export const salesSummary =
'درآمد موفق در این بازه ۸٫۴٪ کم شده است. بیش‌ترین سهم این تغییر از افت نرخ موفقیت پرداخت آمده، نه از کاهش تعداد تلاش‌ها.';

export const salesTrend = [
{ label: 'هفته ۱', current: 726_000_000, previous: 742_000_000, anomaly: false },
{ label: 'هفته ۲', current: 638_000_000, previous: 771_000_000, anomaly: true },
{ label: 'هفته ۳', current: 688_000_000, previous: 786_000_000, anomaly: false },
{ label: 'هفته ۴', current: 664_000_000, previous: 779_000_000, anomaly: false }];


export const anomalyNote =
'هفته ۲ بیرون از دامنه معمول شماست: ۱۷٪ پایین‌تر از میانگین چهار هفته قبل. بقیه هفته‌ها در دامنه نوسان عادی قرار دارند.';

export const decomposition = [
{ label: 'درآمد دوره قبل', value: 3_100_000_000, type: 'total' as const },
{ label: 'اثر تعداد پرداخت', value: 74_000_000, type: 'delta' as const },
{ label: 'اثر نرخ موفقیت', value: -418_000_000, type: 'delta' as const },
{ label: 'اثر مبلغ پرداخت', value: 84_000_000, type: 'delta' as const },
{ label: 'درآمد دوره فعلی', value: 2_840_000_000, type: 'total' as const }];


export const decompositionNote =
'دلیل اصلی کاهش فروش، افت نرخ موفقیت پرداخت بوده است. تعداد تلاش‌ها و میانگین مبلغ هر دو کمی رشد کرده‌اند.';

export const revenueByCategory = [
{ key: 'کالای دیجیتال', value: 1_082_000_000, share: 38.1 },
{ key: 'خدمات', value: 728_000_000, share: 25.6 },
{ key: 'خدمات مالی', value: 641_000_000, share: 22.6 },
{ key: 'سایر', value: 389_000_000, share: 13.7 }];


export const revenueByMerchant = [
{ key: 'زرین‌شاپ', value: 1_248_000_000, share: 43.9 },
{ key: 'زرین‌سرویس', value: 812_000_000, share: 28.6 },
{ key: 'زرین‌پی', value: 496_000_000, share: 17.5 },
{ key: 'سایر', value: 284_000_000, share: 10.0 }];


export const concentration = [
{
  id: 'customer',
  label: 'مشتری',
  top1: 31.5,
  top5: 52.4,
  top10: 67.8,
  note: 'فقط مشتریان قابل شناسایی؛ پوشش شناسه مشتری ۴۶٪ است.'
},
{
  id: 'category',
  label: 'دسته‌بندی',
  top1: 22.1,
  top5: 58.9,
  top10: 74.2,
  note: 'برای همه رکوردها موجود است.'
},
{
  id: 'merchant',
  label: 'کسب‌وکار',
  top1: 18.4,
  top5: 44.6,
  top10: 61.3,
  note: 'برای همه رکوردها موجود است.'
}];


export const concentrationNote =
'بخش بزرگی از درآمد شما در تعداد کمی از بخش‌ها متمرکز است. این تمرکز به‌خودی‌خود مشکل نیست، اما ریسک نوسان را بالا می‌برد.';