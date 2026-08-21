export const metricOptions = [
{ value: 'successRate', label: 'نرخ موفقیت پرداخت' },
{ value: 'revenue', label: 'درآمد موفق' },
{ value: 'count', label: 'تعداد پرداخت' },
{ value: 'avgAmount', label: 'میانگین مبلغ' }];


export const dimensionOptions = [
{ value: 'psp', label: 'مسیر پرداخت' },
{ value: 'hour', label: 'ساعت' },
{ value: 'category', label: 'دسته‌بندی' },
{ value: 'merchant', label: 'کسب‌وکار' },
{ value: 'amount', label: 'بازه مبلغ' },
{ value: 'time', label: 'زمان' }];


export const categoryFilterOptions = [
{ value: 'all', label: 'همه دسته‌ها' },
{ value: 'digital', label: 'کالای دیجیتال' },
{ value: 'services', label: 'خدمات' },
{ value: 'finance', label: 'خدمات مالی' }];


export interface ExploreRow {
  key: string;
  successRate: number;
  revenue: number;
  count: number;
  avgAmount: number;
}

export const exploreData: Record<string, ExploreRow[]> = {
  psp: [
  { key: 'PSP-02', successRate: 81.2, revenue: 812_000_000, count: 3506, avgAmount: 232_000 },
  { key: 'PSP-05', successRate: 77.6, revenue: 704_000_000, count: 3028, avgAmount: 232_000 },
  { key: 'PSP-08', successRate: 64.3, revenue: 693_000_000, count: 2965, avgAmount: 234_000 },
  { key: 'PSP-11', successRate: 74.8, revenue: 421_000_000, count: 1633, avgAmount: 258_000 },
  { key: 'PSP-14', successRate: 69.1, revenue: 210_000_000, count: 691, avgAmount: 304_000 }],

  hour: [
  { key: '۰۰ تا ۰۶', successRate: 79.3, revenue: 268_000_000, count: 1902, avgAmount: 141_000 },
  { key: '۰۶ تا ۱۲', successRate: 77.2, revenue: 512_000_000, count: 3641, avgAmount: 141_000 },
  { key: '۱۲ تا ۱۸', successRate: 73.4, revenue: 786_000_000, count: 5218, avgAmount: 151_000 },
  { key: '۱۸ تا ۲۳', successRate: 64.9, revenue: 1_274_000_000, count: 7660, avgAmount: 166_000 }],

  category: [
  { key: 'کالای دیجیتال', successRate: 74.8, revenue: 1_082_000_000, count: 7124, avgAmount: 152_000 },
  { key: 'خدمات', successRate: 72.1, revenue: 728_000_000, count: 4986, avgAmount: 146_000 },
  { key: 'خدمات مالی', successRate: 66.4, revenue: 641_000_000, count: 3218, avgAmount: 199_000 },
  { key: 'سایر', successRate: 70.9, revenue: 389_000_000, count: 3093, avgAmount: 126_000 }],

  merchant: [
  { key: 'زرین‌شاپ', successRate: 73.8, revenue: 1_248_000_000, count: 8214, avgAmount: 152_000 },
  { key: 'زرین‌سرویس', successRate: 71.2, revenue: 812_000_000, count: 5406, avgAmount: 150_000 },
  { key: 'زرین‌پی', successRate: 68.4, revenue: 496_000_000, count: 3102, avgAmount: 160_000 },
  { key: 'سایر', successRate: 70.1, revenue: 284_000_000, count: 1699, avgAmount: 167_000 }],

  amount: [
  { key: 'زیر ۱۰۰ هزار', successRate: 79.6, revenue: 486_000_000, count: 8412, avgAmount: 58_000 },
  { key: '۱۰۰ تا ۵۰۰ هزار', successRate: 73.2, revenue: 1_124_000_000, count: 6218, avgAmount: 181_000 },
  { key: '۵۰۰ هزار تا ۲ میلیون', successRate: 62.8, revenue: 902_000_000, count: 2894, avgAmount: 312_000 },
  { key: 'بالای ۲ میلیون', successRate: 58.1, revenue: 328_000_000, count: 897, avgAmount: 366_000 }],

  time: [
  { key: 'هفته ۱', successRate: 79.9, revenue: 726_000_000, count: 3910, avgAmount: 186_000 },
  { key: 'هفته ۲', successRate: 75.4, revenue: 638_000_000, count: 3742, avgAmount: 170_000 },
  { key: 'هفته ۳', successRate: 73.5, revenue: 688_000_000, count: 3684, avgAmount: 187_000 },
  { key: 'هفته ۴', successRate: 71.6, revenue: 664_000_000, count: 3629, avgAmount: 183_000 }]

};

export const templates = [
{ id: 'psp-success', label: 'موفقیت پرداخت بر اساس مسیر پرداخت', metric: 'successRate', dimension: 'psp' },
{ id: 'hour-success', label: 'موفقیت پرداخت در ساعت‌های مختلف', metric: 'successRate', dimension: 'hour' },
{ id: 'revenue-time', label: 'فروش موفق در طول زمان', metric: 'revenue', dimension: 'time' },
{ id: 'amount-success', label: 'موفقیت پرداخت بر اساس مبلغ', metric: 'successRate', dimension: 'amount' },
{ id: 'category-avg', label: 'میانگین مبلغ بر اساس دسته‌بندی', metric: 'avgAmount', dimension: 'category' },
{ id: 'merchant-perf', label: 'عملکرد بر اساس کسب‌وکار', metric: 'successRate', dimension: 'merchant' }];


export const relatedInsightByDimension: Record<string, string> = {
  psp: 'psp08-drop',
  hour: 'psp08-drop',
  amount: 'retry-abandon',
  category: 'revenue-concentration',
  merchant: 'revenue-concentration',
  time: 'weekend-growth'
};