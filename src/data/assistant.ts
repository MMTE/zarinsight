export type AnswerState = 'ok' | 'partial' | 'insufficient';

export interface AssistantAnswer {
  id: string;
  question: string;
  state: AnswerState;
  headline: string;
  points: string[];
  ranked?: {label: string;value: string;}[];
  numbers: {label: string;value: string;}[];
  coverage?: string;
  insightId?: string;
  reportLabel?: string;
  reportTo?: string;
  followUps: string[];
}

export const suggestedQuestions = [
'چرا فروشم کم شده؟',
'کدام مسیر پرداخت بهتر عمل می‌کند؟',
'مشتریان تکراری چقدر ارزش دارند؟',
'این ماه چه چیزی تغییر کرده است؟',
'کدام بخش بیش‌ترین فرصت رشد را دارد؟',
'علت شکست پرداخت‌ها چیست؟'];


export const answers: AssistantAnswer[] = [
{
  id: 'why-revenue-down',
  question: 'چرا فروشم کم شده؟',
  state: 'ok',
  headline: 'درآمد موفق شما در این بازه ۸٫۴٪ کم شده است.',
  points: [
  'بیش‌ترین سهم این تغییر از افت نرخ موفقیت پرداخت آمده است، نه از کم‌شدن تعداد تلاش‌ها.',
  'تعداد تلاش‌های پرداخت ۴٫۱٪ و میانگین مبلغ ۶٫۱٪ رشد کرده‌اند.'],

  ranked: [
  { label: 'مسیر PSP-08', value: '۳٫۸ واحد درصد' },
  { label: 'ساعت‌های ۱۸ تا ۲۳', value: '۲٫۱ واحد درصد' },
  { label: 'پرداخت‌های مبلغ‌بالا', value: '۱٫۷ واحد درصد' }],

  numbers: [
  { label: 'درآمد دوره فعلی', value: '۲٫۸۴ میلیارد تومان' },
  { label: 'درآمد دوره قبل', value: '۳٫۱۰ میلیارد تومان' },
  { label: 'اثر افت نرخ موفقیت', value: '−۴۱۸ میلیون تومان' }],

  insightId: 'psp08-drop',
  reportLabel: 'مشاهده تجزیه درآمد',
  reportTo: '/sales',
  followUps: ['کدام مسیر پرداخت بهتر عمل می‌کند؟', 'این ماه چه چیزی تغییر کرده است؟']
},
{
  id: 'best-psp',
  question: 'کدام مسیر پرداخت بهتر عمل می‌کند؟',
  state: 'ok',
  headline: 'در مقایسه هم‌ترکیب، PSP-02 و PSP-05 بهترین عملکرد را دارند.',
  points: [
  'نرخ خام PSP-02 برابر ۸۱٫۲٪ است، اما ترکیب ترافیک آن سبک‌تر است؛ پس از هم‌ترکیب‌سازی به ۷۸٫۹٪ می‌رسد.',
  'PSP-08 حتی پس از هم‌ترکیب‌سازی هم پایین‌ترین مقدار را دارد.'],

  ranked: [
  { label: 'PSP-02', value: '۷۸٫۹٪ هم‌ترکیب' },
  { label: 'PSP-05', value: '۷۷٫۱٪ هم‌ترکیب' },
  { label: 'PSP-08', value: '۶۹٫۸٪ هم‌ترکیب' }],

  numbers: [
  { label: 'تلاش‌های PSP-08', value: '۴٬۶۱۱' },
  { label: 'نرخ خام PSP-08', value: '۶۴٫۳٪' },
  { label: 'اختلاف با بهترین مسیر', value: '۹٫۱ واحد درصد' }],

  coverage: 'پوشش مسیر پرداخت ۸۸٪ است؛ رکوردهای بدون مسیر در این مقایسه نیستند.',
  insightId: 'psp08-drop',
  reportLabel: 'مشاهده جدول مسیرها',
  reportTo: '/payments?focus=psp',
  followUps: ['چرا فروشم کم شده؟', 'علت شکست پرداخت‌ها چیست؟']
},
{
  id: 'repeat-value',
  question: 'مشتریان تکراری چقدر ارزش دارند؟',
  state: 'partial',
  headline: 'مشتریان تکراری ۱٫۶ برابر مشتریان جدید خرید می‌کنند.',
  points: [
  'سهم آن‌ها از پرداخت‌های موفق ۲۴٫۸٪ است، در حالی که ۴۵٫۳٪ از درآمد قابل انتساب را می‌سازند.',
  'نرخ موفقیت پرداخت این گروه ۴٫۳ واحد درصد بالاتر است.'],

  numbers: [
  { label: 'میانگین مبلغ مشتری تکراری', value: '۱۳۳ هزار تومان' },
  { label: 'میانگین مبلغ مشتری جدید', value: '۸۳ هزار تومان' },
  { label: 'فرصت برآوردی', value: '≈ ۵۴ میلیون تومان در ماه' }],

  coverage:
  'برای بررسی مشتریان تکراری، شناسه مشتری فقط در ۴۶٪ از رکوردها در دسترس است. نتیجه فقط بر اساس همین بخش از داده محاسبه شده است.',
  insightId: 'repeat-customers',
  reportLabel: 'مشاهده گزارش مشتریان',
  reportTo: '/customers',
  followUps: ['کدام بخش بیش‌ترین فرصت رشد را دارد؟']
},
{
  id: 'what-changed',
  question: 'این ماه چه چیزی تغییر کرده است؟',
  state: 'ok',
  headline: 'بزرگ‌ترین تغییر، افت ۸٫۲ واحد درصدی نرخ موفقیت پرداخت است.',
  points: [
  'درآمد موفق ۸٫۴٪ کم شده، ولی تعداد پرداخت موفق ۴٫۱٪ بیش‌تر شده است.',
  'سهم فروش پایان هفته ۵٫۴ واحد درصد بالا رفته است.'],

  ranked: [
  { label: 'نرخ موفقیت پرداخت', value: '−۸٫۲ واحد درصد' },
  { label: 'درآمد موفق', value: '−۸٫۴٪' },
  { label: 'سهم پایان هفته', value: '+۵٫۴ واحد درصد' }],

  numbers: [
  { label: 'یافته‌های فعال', value: '۶' },
  { label: 'مجموع فرصت برآوردی', value: '۱۸۶ میلیون تومان در ماه' }],

  insightId: 'psp08-drop',
  reportLabel: 'مشاهده همه یافته‌ها',
  reportTo: '/insights',
  followUps: ['چرا فروشم کم شده؟', 'مشتریان تکراری چقدر ارزش دارند؟']
},
{
  id: 'growth-opportunity',
  question: 'کدام بخش بیش‌ترین فرصت رشد را دارد؟',
  state: 'ok',
  headline: 'بستن فاصله نرخ موفقیت پرداخت بزرگ‌ترین فرصت شماست.',
  points: [
  'اثر برآوردی آن حدود ۸۶ میلیون تومان در ماه است.',
  'پس از آن، مشتریان تکراری با ۵۴ میلیون تومان و کاهش رها شدن پرداخت با ۳۱ میلیون تومان قرار دارند.'],

  ranked: [
  { label: 'بهبود نرخ موفقیت پرداخت', value: '۸۶ میلیون تومان' },
  { label: 'مشتریان تکراری', value: '۵۴ میلیون تومان' },
  { label: 'کاهش رها شدن پرداخت', value: '۳۱ میلیون تومان' }],

  numbers: [{ label: 'مجموع فرصت برآوردی', value: '۱۸۶ میلیون تومان در ماه' }],
  insightId: 'psp08-drop',
  reportLabel: 'مشاهده یافته‌ها',
  reportTo: '/insights',
  followUps: ['چرا فروشم کم شده؟']
},
{
  id: 'failure-reasons',
  question: 'علت شکست پرداخت‌ها چیست؟',
  state: 'insufficient',
  headline: 'برای پاسخ به این سؤال داده کافی نداریم.',
  points: [
  'کد پاسخ فقط برای ۳٪ از تلاش‌های پرداخت ثبت شده است.',
  'توزیع همین بخش کوچک را می‌توانید ببینید، اما نمی‌توان آن را به همه پرداخت‌های ناموفق تعمیم داد.'],

  numbers: [
  { label: 'تلاش‌های ناموفق', value: '۵٬۲۷۰' },
  { label: 'دارای کد پاسخ', value: '۴۸۰' },
  { label: 'پوشش', value: '۳٪' }],

  coverage: 'پوشش کد پاسخ ۳٪ است. این تحلیل منتشر نمی‌شود و فقط توزیع نمونه نمایش داده می‌شود.',
  reportLabel: 'مشاهده کیفیت داده',
  reportTo: '/data-quality',
  followUps: ['کدام مسیر پرداخت بهتر عمل می‌کند؟']
}];


export function findAnswer(question: string): AssistantAnswer | undefined {
  const normalized = question.trim();
  const exact = answers.find((item) => item.question === normalized);
  if (exact) return exact;
  return answers.find((item) =>
  item.question.
  replace(/[؟?]/g, '').
  split(' ').
  some((word) => word.length > 3 && normalized.includes(word))
  );
}