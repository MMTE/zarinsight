export const paymentKpis = [
{
  id: 'success',
  label: 'نرخ موفقیت',
  value: '۷۱٫۴٪',
  delta: -8.2,
  unit: 'points' as const,
  positiveWhen: 'up' as const,
  note: 'نسبت به دوره قبل'
},
{
  id: 'failure',
  label: 'نرخ شکست',
  value: '۲۸٫۶٪',
  delta: 8.2,
  unit: 'points' as const,
  positiveWhen: 'down' as const,
  note: 'نسبت به دوره قبل'
},
{
  id: 'retry',
  label: 'نرخ تلاش مجدد',
  value: '۱۲٫۵٪',
  delta: 1.4,
  unit: 'points' as const,
  positiveWhen: 'down' as const,
  note: 'نسبت به دوره قبل'
},
{
  id: 'latency',
  label: 'میانه زمان پردازش',
  value: '۱٫۳ ثانیه',
  delta: 8.3,
  unit: 'percent' as const,
  positiveWhen: 'down' as const,
  note: 'میانگین گزارش نمی‌شود'
}];


export const successTrend = [
{ label: 'هفته ۱', current: 79.9, previous: 79.4, success: 3910, failed: 986, anomaly: false },
{ label: 'هفته ۲', current: 75.4, previous: 79.8, success: 3742, failed: 1218, anomaly: true },
{ label: 'هفته ۳', current: 73.5, previous: 79.5, success: 3684, failed: 1329, anomaly: false },
{ label: 'هفته ۴', current: 71.6, previous: 79.6, success: 3629, failed: 1442, anomaly: false }];


export interface PspRow {
  psp: string;
  successRate: number;
  adjustedRate: number;
  attempts: number;
  successValue: number;
  latencyMedian: number;
  latencyP95: number;
  retryRate: number;
  mix: string;
  lowVolume?: boolean;
}

export const psps: PspRow[] = [
{
  psp: 'PSP-02',
  successRate: 81.2,
  adjustedRate: 78.9,
  attempts: 4318,
  successValue: 812_000_000,
  latencyMedian: 1.1,
  latencyP95: 3.2,
  retryRate: 8.4,
  mix: 'بیش‌تر پرداخت‌های مبلغ‌پایین'
},
{
  psp: 'PSP-05',
  successRate: 77.6,
  adjustedRate: 77.1,
  attempts: 3902,
  successValue: 704_000_000,
  latencyMedian: 1.4,
  latencyP95: 4.1,
  retryRate: 10.1,
  mix: 'ترکیب نزدیک به میانگین'
},
{
  psp: 'PSP-08',
  successRate: 64.3,
  adjustedRate: 69.8,
  attempts: 4611,
  successValue: 693_000_000,
  latencyMedian: 2.2,
  latencyP95: 8.6,
  retryRate: 17.8,
  mix: 'سهم بالای مبلغ‌بالا و ساعت شلوغ'
},
{
  psp: 'PSP-11',
  successRate: 74.8,
  adjustedRate: 75.4,
  attempts: 2183,
  successValue: 421_000_000,
  latencyMedian: 1.6,
  latencyP95: 4.8,
  retryRate: 11.2,
  mix: 'ترکیب نزدیک به میانگین'
},
{
  psp: 'PSP-14',
  successRate: 69.1,
  adjustedRate: 71.2,
  attempts: 1000,
  successValue: 210_000_000,
  latencyMedian: 1.9,
  latencyP95: 5.4,
  retryRate: 13.6,
  mix: 'حجم کم؛ با احتیاط بخوانید',
  lowVolume: true
}];


export const pspCaveat =
'رتبه‌بندی فقط بر اساس نرخ خام گمراه‌کننده است، چون ترکیب ترافیک هر مسیر فرق دارد. در نمای هم‌ترکیب، فقط پرداخت‌هایی با بازه مبلغ و ساعت یکسان مقایسه شده‌اند.';

export const pspAdjustedNote =
'پس از هم‌ترکیب‌سازی، فاصله PSP-08 با بقیه کم‌تر می‌شود اما همچنان پایین‌ترین مقدار را دارد. یعنی بخشی از افت آن با ترکیب ترافیک توضیح داده می‌شود و بخشی نه.';

export const funnel = [
{ stage: 'تلاش اول', value: 16014, note: 'کل تلاش‌های پرداخت در بازه' },
{ stage: 'ناموفق', value: 5270, note: '۳۲٫۹٪ از تلاش اول' },
{ stage: 'تلاش دوباره', value: 2003, note: '۳۸٪ از ناموفق‌ها' },
{ stage: 'موفق پس از تلاش دوباره', value: 1212, note: '۶۰٫۵٪ از تلاش دوباره' },
{ stage: 'ترک پرداخت', value: 3267, note: '۶۲٪ از ناموفق‌ها' }];


export const funnelNote =
'واحد این تحلیل «تلاش پرداخت» است. یک تلاش ناموفق و سپس یک تلاش موفق برای همان خرید، دو خرید شمرده نمی‌شود.';

export const responseCodes = [
{ code: '۰۵', reason: 'رد شدن از سمت بانک', share: 41.2, count: 198 },
{ code: '۵۱', reason: 'موجودی ناکافی', share: 26.7, count: 128 },
{ code: '۵۴', reason: 'انقضای کارت یا زمان پرداخت', share: 18.4, count: 88 },
{ code: '۹۱', reason: 'در دسترس نبودن بانک', share: 9.2, count: 44 },
{ code: 'سایر', reason: 'سایر کدها', share: 4.5, count: 22 }];


export const responseCodeCoverage = 3;

export const hourlySuccess = [
{ hour: '۰۰', rate: 78.4 },
{ hour: '۰۲', rate: 79.1 },
{ hour: '۰۴', rate: 80.2 },
{ hour: '۰۶', rate: 79.6 },
{ hour: '۰۸', rate: 76.8 },
{ hour: '۱۰', rate: 75.2 },
{ hour: '۱۲', rate: 74.1 },
{ hour: '۱۴', rate: 73.6 },
{ hour: '۱۶', rate: 72.4 },
{ hour: '۱۸', rate: 66.8 },
{ hour: '۲۰', rate: 63.2 },
{ hour: '۲۲', rate: 64.9 }];


export const latency = [
{ label: 'میانه', current: 1.3, previous: 1.2 },
{ label: 'صدک ۹۰', current: 3.4, previous: 2.6 },
{ label: 'صدک ۹۵', current: 6.8, previous: 4.1 }];


export const latencyNote =
'زمان پردازش در چهار هفته اخیر افزایش پیدا کرده است. بیش‌ترین تغییر در صدک ۹۵ دیده می‌شود؛ میانه تقریباً ثابت مانده.';