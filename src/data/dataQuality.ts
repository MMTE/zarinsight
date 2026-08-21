export const datasetSummary = {
  records: 16014,
  merchants: 42,
  period: '۱ فروردین تا ۳۰ خرداد',
  grain: 'هر ردیف یک تلاش پرداخت است، نه یک خرید.'
};

export type FieldStatus = 'ok' | 'partial' | 'notApplicable';

export interface FieldCoverage {
  field: string;
  coverage: number;
  status: FieldStatus;
  meaning: string;
}

export const fieldCoverage: FieldCoverage[] = [
{ field: 'شناسه پرداخت', coverage: 100, status: 'ok', meaning: 'برای همه رکوردها موجود است.' },
{ field: 'کسب‌وکار', coverage: 100, status: 'ok', meaning: 'برای همه رکوردها موجود است.' },
{ field: 'مبلغ', coverage: 100, status: 'ok', meaning: 'برای همه رکوردها موجود است.' },
{ field: 'زمان ثبت تلاش', coverage: 100, status: 'ok', meaning: 'برای همه رکوردها موجود است.' },
{
  field: 'مسیر پرداخت',
  coverage: 88,
  status: 'partial',
  meaning: 'برای ۱۲٪ رکوردها ثبت نشده است. تحلیل مسیر پرداخت فقط روی بخش موجود انجام می‌شود.'
},
{
  field: 'زمان تأیید',
  coverage: 48,
  status: 'notApplicable',
  meaning: 'برای تلاش‌های ناموفق معنا ندارد؛ نبود آن خطا نیست.'
},
{
  field: 'شناسه مشتری',
  coverage: 46,
  status: 'partial',
  meaning: 'همه پرداخت‌ها به یک حساب مشتری وصل نیستند. تحلیل مشتری فقط روی همین بخش انجام می‌شود.'
},
{
  field: 'کد پاسخ',
  coverage: 3,
  status: 'partial',
  meaning: 'فقط برای بخش کوچکی ثبت شده است. تحلیل علت شکست قابل تعمیم نیست.'
}];


export const analysisReadiness = [
{ analysis: 'روند فروش و درآمد', usable: true, note: 'همه فیلدهای لازم موجود است.' },
{ analysis: 'نرخ موفقیت پرداخت', usable: true, note: 'همه فیلدهای لازم موجود است.' },
{ analysis: 'مقایسه مسیرهای پرداخت', usable: true, note: 'فقط روی ۸۸٪ رکوردهای دارای مسیر پرداخت.' },
{ analysis: 'تحلیل مشتری و هم‌گروهی', usable: true, note: 'فقط روی ۴۶٪ رکوردهای دارای شناسه مشتری.' },
{ analysis: 'زمان پردازش', usable: true, note: 'فقط روی ۴۸٪ رکوردهایی که زمان تأیید دارند.' },
{ analysis: 'علت شکست پرداخت', usable: false, note: 'پوشش کد پاسخ ۳٪ است؛ نتیجه قابل تعمیم نیست.' },
{
  analysis: 'ارزش طول عمر مشتری',
  usable: false,
  note: 'برای این تحلیل به تاریخچه بلندمدت‌تری از مشتری نیاز است.'
}];


export const adjustedFeeWarning = {
  title: 'کارمزد تعدیل‌شده',
  body: [
  'عدد adjusted_fee کارمزد واقعی زرین‌پال نیست. این مقدار با یک ضریب ثابت روی داده اعمال شده است.',
  'بنابراین از آن فقط برای مقایسه نسبی استفاده می‌کنیم، نه برای نمایش کارمزد واقعی زرین‌پال.']

};

export const attemptStructureNote = [
'هر ردیف داده یک تلاش پرداخت است. یک خرید ممکن است چند تلاش داشته باشد.',
'یک تلاش ناموفق و سپس یک تلاش موفق برای همان خرید، دو خرید شمرده نمی‌شود.',
'همه نرخ‌های موفقیت در سطح تلاش پرداخت محاسبه می‌شوند و این موضوع در هر گزارش ذکر شده است.'];


export const concentrationNote =
'حجم داده بین کسب‌وکارها یکنواخت نیست: ۳ کسب‌وکار حدود ۶۱٪ از کل تلاش‌های پرداخت را می‌سازند. در مقایسه‌های کلی این تمرکز را در نظر بگیرید.';