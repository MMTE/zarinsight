export const customerKpis = [
{ id: 'identifiable', label: 'مشتریان قابل شناسایی', value: '۴٬۲۶۰', note: 'پوشش شناسه مشتری: ۴۶٪' },
{ id: 'new', label: 'مشتریان جدید', value: '۳٬۲۰۳', note: 'اولین پرداخت موفق در این بازه' },
{ id: 'repeat', label: 'مشتریان تکراری', value: '۱٬۰۵۷', note: 'حداقل یک پرداخت موفق پیشین' },
{ id: 'return', label: 'نرخ بازگشت', value: '۲۴٫۸٪', note: 'از کل مشتریان قابل شناسایی' },
{
  id: 'repeat-revenue',
  label: 'درآمد مشتریان تکراری',
  value: '۵۹۴ میلیون تومان',
  note: '۴۵٫۳٪ از درآمد قابل انتساب'
}];


export const coverageNotice =
'تحلیل مشتریان فقط روی رکوردهایی انجام شده که شناسه مشتری دارند. پوشش فعلی ۴۶٪ است و نتیجه به کل داده تعمیم داده نمی‌شود.';

export const newVsRepeat = [
{ metric: 'نرخ موفقیت پرداخت', newValue: '۷۰٫۲٪', repeatValue: '۷۴٫۵٪', better: 'repeat' as const },
{ metric: 'میانگین مبلغ', newValue: '۸۳ هزار تومان', repeatValue: '۱۳۳ هزار تومان', better: 'repeat' as const },
{ metric: 'تعداد پرداخت', newValue: '۱۳٬۵۹۸', repeatValue: '۴٬۸۲۳', better: 'new' as const },
{ metric: 'درآمد', newValue: '۷۱۷ میلیون تومان', repeatValue: '۵۹۴ میلیون تومان', better: 'new' as const }];


export const valueSegments = [
{ segment: '۱٪ برتر', revenueShare: 31.5, repeatRate: 68.4, avgAmount: '۴۱۲ هزار تومان', successRate: 78.1 },
{ segment: '۵٪ برتر', revenueShare: 52.4, repeatRate: 51.2, avgAmount: '۲۶۸ هزار تومان', successRate: 76.4 },
{ segment: '۱۰٪ برتر', revenueShare: 67.8, repeatRate: 42.7, avgAmount: '۱۹۴ هزار تومان', successRate: 75.2 },
{ segment: 'سایر مشتریان', revenueShare: 32.2, repeatRate: 12.3, avgAmount: '۶۸ هزار تومان', successRate: 70.1 }];


export interface CohortRow {
  cohort: string;
  size: number;
  months: (number | null)[];
}

export const cohortColumns = ['ماه ۱', 'ماه ۲', 'ماه ۳', 'ماه ۴', 'ماه ۵'];

export const cohorts: CohortRow[] = [
{ cohort: 'بهمن', size: 812, months: [100, 21.4, 14.2, 10.8, 8.6] },
{ cohort: 'اسفند', size: 964, months: [100, 16.1, 8.1, 6.4, null] },
{ cohort: 'فروردین', size: 1103, months: [100, 22.8, 15.1, null, null] },
{ cohort: 'اردیبهشت', size: 878, months: [100, 24.3, null, null, null] },
{ cohort: 'خرداد', size: 503, months: [100, null, null, null, null] }];


export const cohortSummary =
'مشتریانی که در اسفند وارد شده‌اند، کم‌تر از میانگین دوره به خرید دوباره برگشته‌اند؛ در ماه دوم فقط ۱۶٫۱٪ در برابر میانگین ۲۱٫۲٪.';

export const returnTrend = [
{ label: 'بهمن', current: 21.4, previous: 20.8 },
{ label: 'اسفند', current: 16.1, previous: 21.2 },
{ label: 'فروردین', current: 22.8, previous: 21.0 },
{ label: 'اردیبهشت', current: 24.3, previous: 21.4 }];


export const retentionOpportunities = [
{
  label: 'بازگرداندن مشتریان تک‌خرید',
  detail:
  '۳٬۲۰۳ مشتری فقط یک پرداخت موفق دارند. رسیدن ۵٪ از آن‌ها به خرید دوم، حدود ۳۱ میلیون تومان در ماه ارزش دارد.'
},
{
  label: 'رسیدگی به هم‌گروه اسفند',
  detail:
  'اگر بازگشت ماه دوم این گروه به میانگین دوره برسد، حدود ۲۳ میلیون تومان در ماه اضافه می‌شود.'
}];