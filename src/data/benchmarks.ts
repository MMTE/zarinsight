export const peerGroup = {
  description:
  'مقایسه با کسب‌وکارهایی از همان صنعت با حجم و مبلغ پرداخت نزدیک به شما.',
  size: 148,
  dimensions: [
  { label: 'دسته‌بندی', value: 'خرده‌فروشی و خدمات دیجیتال' },
  { label: 'حجم پرداخت ماهانه', value: '۱۰ تا ۲۵ هزار تلاش' },
  { label: 'مبلغ معمول پرداخت', value: '۵۰ تا ۳۰۰ هزار تومان' },
  { label: 'بازه زمانی', value: '۱ تا ۳۰ خرداد' }]

};

export interface BenchmarkRow {
  metric: string;
  you: number;
  median: number;
  topQuartile: number;
  unit: 'percent';
  percentile: number;
  higherIsBetter: boolean;
  note: string;
}

export const benchmarkRows: BenchmarkRow[] = [
{
  metric: 'نرخ موفقیت پرداخت',
  you: 71.4,
  median: 78,
  topQuartile: 85,
  unit: 'percent',
  percentile: 22,
  higherIsBetter: true,
  note: 'بزرگ‌ترین فاصله شما با گروه مشابه'
},
{
  metric: 'مشتریان تکراری',
  you: 24.8,
  median: 27,
  topQuartile: 35,
  unit: 'percent',
  percentile: 41,
  higherIsBetter: true,
  note: 'کمی پایین‌تر از میانه'
},
{
  metric: 'رشد درآمد',
  you: -8.4,
  median: 6,
  topQuartile: 15,
  unit: 'percent',
  percentile: 12,
  higherIsBetter: true,
  note: 'گروه مشابه در همین بازه رشد داشته‌اند'
},
{
  metric: 'نرخ تلاش مجدد',
  you: 12.5,
  median: 6,
  topQuartile: 5,
  unit: 'percent',
  percentile: 18,
  higherIsBetter: false,
  note: 'بالاتر بودن این عدد بهتر نیست'
},
{
  metric: 'میانگین مبلغ پرداخت',
  you: 142,
  median: 118,
  topQuartile: 165,
  unit: 'percent',
  percentile: 64,
  higherIsBetter: true,
  note: 'به هزار تومان؛ بالاتر از میانه'
}];


export const strengths = [
{
  label: 'میانگین مبلغ پرداخت',
  detail: 'میانگین مبلغ شما ۲۰٪ بالاتر از میانه گروه مشابه است.'
},
{
  label: 'رشد فروش پایان هفته',
  detail: 'سهم پایان هفته از درآمد شما بالاتر از میانه گروه است.'
}];


export const gaps = [
{
  label: 'نرخ موفقیت پرداخت',
  detail: '۶٫۶ واحد درصد پایین‌تر از میانه؛ بیش‌ترین اثر مالی را دارد.',
  insightId: 'psp08-drop',
  impact: 86_000_000
},
{
  label: 'نرخ تلاش مجدد',
  detail: '۶٫۵ واحد درصد بالاتر از میانه؛ کاربران بیش‌تر پرداخت را رها می‌کنند.',
  insightId: 'retry-abandon',
  impact: 31_000_000
},
{
  label: 'مشتریان تکراری',
  detail: '۲٫۲ واحد درصد پایین‌تر از میانه.',
  insightId: 'repeat-customers',
  impact: 54_000_000
}];


export const benchmarkNote =
'این مقایسه توضیحی است، نه نمره‌دهی. هدف این است که بدانید عملکرد فعلی شما در شرایط مشابه، معمول است یا نه.';