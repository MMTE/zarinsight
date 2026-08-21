import type { Insight, InsightCategory, InsightTopic, Confidence } from '../types/analytics';

export const categoryLabels: Record<InsightCategory, string> = {
  opportunity: 'فرصت',
  risk: 'ریسک',
  change: 'تغییر',
  trend: 'روند',
  positive: 'عملکرد مثبت'
};

export const topicLabels: Record<InsightTopic, string> = {
  sales: 'فروش',
  payment: 'پرداخت',
  customer: 'مشتری',
  psp: 'مسیر پرداخت',
  time: 'زمان'
};

export const confidenceLabels: Record<Confidence, string> = {
  high: 'اطمینان بالا',
  medium: 'اطمینان متوسط',
  low: 'نیازمند بررسی'
};

export const insights: Insight[] = [
{
  id: 'psp08-drop',
  category: 'change',
  topic: 'psp',
  defaultState: 'new',
  title: 'نرخ موفقیت پرداخت در ساعت‌های پرتراکنش افت کرده',
  summary:
  'نرخ موفقیت از ۷۹٫۶٪ به ۷۱٫۴٪ رسیده است. این افت از دامنه نوسان معمول شما بیرون است و در چهار هفته ادامه داشته.',
  detectedOn: '۲۹ خرداد',
  primary: { label: 'وضعیت فعلی', value: '۷۱٫۴٪' },
  comparison: { label: 'دوره قبل', value: '۷۹٫۶٪' },
  gap: '۸٫۲ واحد درصد',
  impact: 86_000_000,
  impactRange: [52_000_000, 103_000_000],
  confidence: 'high',
  confidenceReasons: ['حجم داده بالا', 'اثر پایدار در چهار هفته', 'گروه مقایسه معتبر'],
  importance: 96,
  whatHappened: [
  'نرخ موفقیت پرداخت از ۷۹٫۶٪ به ۷۱٫۴٪ رسیده است.',
  'افت از هفته دوم بازه شروع شده و تا پایان ادامه داشته است.',
  'تعداد تلاش‌های پرداخت تقریباً ثابت مانده، پس تغییر از کم‌شدن ترافیک نیامده است.'],

  howMuchChanged:
  '۸٫۲ واحد درصد پایین‌تر از دوره قبل و ۶٫۶ واحد درصد پایین‌تر از میانه کسب‌وکارهای مشابه.',
  contributions: [
  { label: 'مسیر پرداخت PSP-08', points: 3.8, to: '/payments?from=psp08-drop&focus=psp' },
  { label: 'ساعت‌های ۱۸ تا ۲۳', points: 2.1, to: '/payments?from=psp08-drop&focus=hour' },
  { label: 'پرداخت‌های مبلغ‌بالا', points: 1.7, to: '/explore?from=psp08-drop&template=amount' },
  { label: 'مشتریان تکراری', points: 1.3, to: '/customers?from=psp08-drop' }],

  drivers: {
    label: 'افت نرخ موفقیت پرداخت',
    value: '۸٫۲ واحد درصد',
    children: [
    {
      label: 'مسیر پرداخت PSP-08',
      value: '۳٫۸ واحد درصد',
      relation: 'مرتبط با',
      children: [
      { label: 'پرداخت‌های بالای ۵۰۰ هزار تومان', value: '۲٫۲ واحد درصد', relation: 'همراه با' },
      { label: 'تلاش‌های دوم و سوم', value: '۱٫۶ واحد درصد', relation: 'همراه با' }]

    },
    {
      label: 'ساعت‌های ۱۸ تا ۲۳',
      value: '۲٫۱ واحد درصد',
      relation: 'بیش‌تر دیده می‌شود',
      children: [{ label: 'اوج ترافیک پنجشنبه', value: '۰٫۹ واحد درصد', relation: 'همراه با' }]
    },
    { label: 'پرداخت‌های مبلغ‌بالا', value: '۱٫۷ واحد درصد', relation: 'مرتبط با' }]

  },
  peerComparison:
  'میانه کسب‌وکارهای هم‌صنعت و هم‌اندازه ۷۸٪ است و ۲۵٪ برتر روی ۸۵٪ قرار دارند. شما پایین‌تر از میانه هستید.',
  interpretation:
  'بیش‌ترین اختلاف در مسیر PSP-08 و ساعت‌های ۱۸ تا ۲۳ دیده می‌شود. این یک رابطه آماری است؛ با داده موجود نمی‌توان گفت مسیر پرداخت علت قطعی افت است.',
  recommendation:
  'عملکرد PSP-08 را برای این بخش بررسی کنید، به‌ویژه در ساعت‌های ۱۸ تا ۲۳ و پرداخت‌های بالای ۵۰۰ هزار تومان.',
  investigateLabel: 'بررسی این بخش',
  investigateTo: '/payments?from=psp08-drop&focus=psp',
  chartUnit: 'percent',
  chart: [
  { label: 'هفته ۱', current: 79.9, previous: 79.4 },
  { label: 'هفته ۲', current: 75.4, previous: 79.8 },
  { label: 'هفته ۳', current: 73.5, previous: 79.5 },
  { label: 'هفته ۴', current: 71.6, previous: 79.6 }],

  evidence: {
    population: 'همه تلاش‌های پرداخت این کسب‌وکار که مسیر پرداخت آن‌ها مشخص است',
    period: '۱ تا ۳۰ خرداد',
    usableRecords: 14821,
    excludedRecords: 1193,
    excludedReason: 'اطلاعات مسیر پرداخت در دسترس نبود',
    rows: [
    { label: 'رکوردهای قابل استفاده', value: '۱۴٬۸۲۱' },
    { label: 'عملکرد فعلی', value: '۷۱٫۴٪', note: 'تلاش موفق ÷ کل تلاش' },
    { label: 'گروه مقایسه', value: '۷۹٫۶٪', note: 'همین بخش، ۳۰ روز قبل' },
    { label: 'فاصله', value: '۸٫۲ واحد درصد' },
    { label: 'بازه زمانی', value: '۱ تا ۳۰ خرداد' },
    { label: 'رکوردهای کنارگذاشته‌شده', value: '۱٬۱۹۳' }],

    formula: 'اثر مالی ≈ فاصله نرخ موفقیت × تعداد تلاش ماهانه × میانگین مبلغ پرداخت موفق',
    steps: [
    { label: 'فاصله نرخ موفقیت', value: '۰٫۰۸۲' },
    { label: 'تلاش پرداخت ماهانه', value: '۱۴٬۸۲۱' },
    { label: 'میانگین مبلغ موفق', value: '۷۱ هزار تومان' },
    { label: 'اثر برآوردی ماهانه', value: '≈ ۸۶ میلیون تومان' }],

    limitation:
    'رکوردهای بدون مسیر پرداخت کنار گذاشته شده‌اند؛ نتیجه به آن بخش تعمیم داده نمی‌شود.'
  },
  methodology: {
    type: 'مقایسه با دوره قبل و گروه مشابه',
    peerGroup: 'کسب‌وکارهای هم‌صنعت و هم‌اندازه',
    minSample: '۵۰۰ پرداخت',
    coverage: '۹۴٪',
    confidence: 'بالا',
    simple:
    'نرخ موفقیت این بخش را با همان بخش در ۳۰ روز قبل و با کسب‌وکارهای مشابه مقایسه کرده‌ایم.',
    technical: [
    'نرخ موفقیت در سطح تلاش پرداخت محاسبه شده است، نه در سطح خرید.',
    'دامنه نوسان معمول از انحراف معیار هشت هفته گذشته گرفته شده است.',
    'مقایسه PSPها پس از هم‌ترکیب‌سازی بازه مبلغ و ساعت انجام شده تا اثر ترکیب ترافیک کم شود.']

  }
},
{
  id: 'repeat-customers',
  category: 'opportunity',
  topic: 'customer',
  defaultState: 'new',
  title: 'مشتریان تکراری ارزش بیش‌تری دارند اما سهم کمی از فروش‌اند',
  summary:
  'مشتریان تکراری به‌طور میانگین ۱٫۶ برابر مشتریان جدید خرید می‌کنند، ولی فقط ۲۴٫۸٪ از پرداخت‌های موفق را می‌سازند.',
  detectedOn: '۲۶ خرداد',
  primary: { label: 'سهم مشتریان تکراری', value: '۲۴٫۸٪' },
  comparison: { label: 'میانه گروه مشابه', value: '۲۷٪' },
  gap: '۲٫۲ واحد درصد',
  impact: 54_000_000,
  impactRange: [31_000_000, 72_000_000],
  confidence: 'medium',
  confidenceReasons: ['پوشش شناسه مشتری ۴۶٪ است', 'اثر پایدار در سه ماه'],
  importance: 82,
  whatHappened: [
  'سهم پرداخت‌های موفق مشتریان تکراری ۲۴٫۸٪ است.',
  'میانگین مبلغ این گروه ۱٫۶ برابر مشتریان جدید است.',
  'نرخ موفقیت پرداخت آن‌ها ۴٫۳ واحد درصد بالاتر است.'],

  howMuchChanged: '۳٫۲ واحد درصد رشد نسبت به دوره قبل، اما هنوز ۲٫۲ واحد درصد پایین‌تر از میانه.',
  contributions: [
  { label: 'هم‌گروه اسفند', points: 1.1, to: '/customers?from=repeat-customers' },
  { label: 'مشتریان تک‌خرید', points: 0.7, to: '/customers?from=repeat-customers' },
  { label: 'دسته خدمات', points: 0.4, to: '/explore?from=repeat-customers' }],

  drivers: {
    label: 'سهم پایین مشتریان تکراری',
    value: '۲٫۲ واحد درصد پایین‌تر از میانه',
    children: [
    {
      label: 'بازگشت ضعیف هم‌گروه اسفند',
      value: '۱٫۱ واحد درصد',
      relation: 'مرتبط با',
      children: [{ label: 'ماه دوم پس از اولین خرید', value: '۱۶٫۱٪ بازگشت', relation: 'همراه با' }]
    },
    { label: 'تمرکز خرید تک‌باره', value: '۰٫۷ واحد درصد', relation: 'همراه با' }]

  },
  peerComparison: 'میانه گروه مشابه ۲۷٪ و ۲۵٪ برتر روی ۳۵٪ است.',
  interpretation:
  'بیش‌ترین فاصله در هم‌گروه اسفند دیده می‌شود؛ این گروه در ماه دوم کم‌تر از میانگین برگشته‌اند.',
  recommendation:
  'رفتار هم‌گروه اسفند را با هم‌گروه‌هایی که بازگشت بهتری داشته‌اند مقایسه کنید و تفاوت‌ها را ببینید.',
  investigateLabel: 'بررسی هم‌گروه‌ها',
  investigateTo: '/customers?from=repeat-customers',
  chartUnit: 'percent',
  chart: [
  { label: 'فروردین', current: 21.4, previous: 20.1 },
  { label: 'اردیبهشت', current: 23.1, previous: 21.8 },
  { label: 'خرداد', current: 24.8, previous: 21.6 }],

  evidence: {
    population: 'پرداخت‌های موفقی که شناسه مشتری دارند',
    period: '۱ فروردین تا ۳۰ خرداد',
    usableRecords: 7318,
    excludedRecords: 8596,
    excludedReason: 'شناسه مشتری در این رکوردها موجود نبود',
    rows: [
    { label: 'رکوردهای قابل استفاده', value: '۷٬۳۱۸' },
    { label: 'پوشش شناسه مشتری', value: '۴۶٪' },
    { label: 'سهم مشتریان تکراری', value: '۲۴٫۸٪' },
    { label: 'میانه گروه مشابه', value: '۲۷٪' },
    { label: 'نسبت میانگین مبلغ', value: '۱٫۶ برابر' }],

    formula: 'اثر مالی ≈ (سهم هدف − سهم فعلی) × پرداخت موفق ماهانه × میانگین مبلغ مشتری تکراری',
    steps: [
    { label: 'فاصله سهم', value: '۰٫۰۲۲' },
    { label: 'پرداخت موفق ماهانه', value: '۱۸٬۴۲۱' },
    { label: 'میانگین مبلغ مشتری تکراری', value: '۱۳۳ هزار تومان' },
    { label: 'اثر برآوردی ماهانه', value: '≈ ۵۴ میلیون تومان' }],

    limitation:
    'این نتیجه فقط برای پرداخت‌های دارای شناسه مشتری معتبر است و به کل داده تعمیم داده نمی‌شود.'
  },
  methodology: {
    type: 'تحلیل هم‌گروهی و مقایسه با گروه مشابه',
    peerGroup: 'کسب‌وکارهای هم‌صنعت و هم‌اندازه',
    minSample: '۵۰۰ مشتری قابل شناسایی',
    coverage: '۴۶٪',
    confidence: 'متوسط',
    simple:
    'مشتریان را بر اساس ماه اولین خرید گروه‌بندی کرده‌ایم و بازگشت هر گروه را در ماه‌های بعد شمرده‌ایم.',
    technical: [
    'مشتری تکراری: حساب مشتری که پیش از این بازه حداقل یک پرداخت موفق دارد.',
    'تحلیل فقط روی رکوردهای دارای شناسه مشتری انجام شده و وزن‌دهی مجدد نشده است.',
    'اثر مالی با فرض ثابت‌ماندن میانگین مبلغ برآورد شده است.']

  },
  caveat: 'تحلیل مشتریان فقط روی ۴۶٪ از پرداخت‌ها انجام شده است.'
},
{
  id: 'retry-abandon',
  category: 'risk',
  topic: 'payment',
  defaultState: 'new',
  title: 'بیش‌تر کاربران پس از یک شکست، دوباره تلاش نمی‌کنند',
  summary:
  'از هر ۱۰۰ تلاش ناموفق، ۳۸ مورد به تلاش دوباره می‌رسد و ۲۳ مورد در نهایت موفق می‌شود. بقیه پرداخت را رها می‌کنند.',
  detectedOn: '۲۴ خرداد',
  primary: { label: 'نرخ تلاش دوباره', value: '۳۸٪' },
  comparison: { label: 'میانه گروه مشابه', value: '۵۱٪' },
  gap: '۱۳ واحد درصد',
  impact: 31_000_000,
  impactRange: [18_000_000, 44_000_000],
  confidence: 'high',
  confidenceReasons: ['داده در سطح تلاش پرداخت موجود است', 'حجم داده بالا'],
  importance: 74,
  whatHappened: [
  'در این بازه ۵٬۲۷۰ تلاش ناموفق ثبت شده است.',
  'تنها ۲٬۰۰۳ تلاش دوباره پس از آن دیده می‌شود.',
  'رها کردن پرداخت بیش‌تر در ساعت‌های شلوغ و مبالغ بالا رخ می‌دهد.'],

  howMuchChanged: '۱۳ واحد درصد پایین‌تر از میانه گروه مشابه؛ نسبت به دوره قبل ۲٫۴ واحد درصد بدتر شده.',
  contributions: [
  { label: 'ساعت‌های ۱۸ تا ۲۳', points: 5.4, to: '/payments?from=retry-abandon&focus=hour' },
  { label: 'پرداخت‌های مبلغ‌بالا', points: 4.2, to: '/explore?from=retry-abandon' },
  { label: 'مسیر PSP-08', points: 3.4, to: '/payments?from=retry-abandon&focus=psp' }],

  drivers: {
    label: 'رها شدن پرداخت پس از شکست',
    value: '۱۳ واحد درصد پایین‌تر از میانه',
    children: [
    { label: 'ساعت‌های ۱۸ تا ۲۳', value: '۵٫۴ واحد درصد', relation: 'بیش‌تر دیده می‌شود' },
    { label: 'پرداخت‌های بالای ۵۰۰ هزار تومان', value: '۴٫۲ واحد درصد', relation: 'همراه با' },
    { label: 'مسیر PSP-08', value: '۳٫۴ واحد درصد', relation: 'مرتبط با' }]

  },
  peerComparison: 'کسب‌وکارهای مشابه به‌طور میانه ۵۱٪ از تلاش‌های ناموفق را دوباره تکرار می‌کنند.',
  interpretation:
  'رها کردن پرداخت با ساعت شلوغ و مبلغ بالا همراه است. علت دقیق با داده فعلی مشخص نیست، چون کد پاسخ فقط برای بخش کوچکی موجود است.',
  recommendation: 'قیف پرداخت را ببینید و مشخص کنید بیش‌ترین ریزش در کدام مرحله رخ می‌دهد.',
  investigateLabel: 'بررسی قیف پرداخت',
  investigateTo: '/payments?from=retry-abandon&focus=funnel',
  chartUnit: 'percent',
  chart: [
  { label: 'هفته ۱', current: 41.2, previous: 43.4 },
  { label: 'هفته ۲', current: 39.6, previous: 42.1 },
  { label: 'هفته ۳', current: 37.4, previous: 41.6 },
  { label: 'هفته ۴', current: 36.1, previous: 40.9 }],

  evidence: {
    population: 'همه تلاش‌های پرداخت این کسب‌وکار',
    period: '۱ تا ۳۰ خرداد',
    usableRecords: 16014,
    excludedRecords: 0,
    excludedReason: 'رکوردی کنار گذاشته نشده است',
    rows: [
    { label: 'کل تلاش‌های پرداخت', value: '۱۶٬۰۱۴' },
    { label: 'تلاش ناموفق', value: '۵٬۲۷۰' },
    { label: 'تلاش دوباره', value: '۲٬۰۰۳' },
    { label: 'موفق پس از تلاش دوباره', value: '۱٬۲۱۲' },
    { label: 'رها شده', value: '۳٬۲۶۷' }],

    formula:
    'اثر مالی ≈ فاصله نرخ تلاش دوباره × تلاش ناموفق ماهانه × نرخ موفقیت تلاش دوباره × میانگین مبلغ',
    steps: [
    { label: 'فاصله نرخ تلاش دوباره', value: '۰٫۱۳' },
    { label: 'تلاش ناموفق ماهانه', value: '۵٬۲۷۰' },
    { label: 'نرخ موفقیت تلاش دوباره', value: '۶۰٫۵٪' },
    { label: 'اثر برآوردی ماهانه', value: '≈ ۳۱ میلیون تومان' }],

    limitation: 'کد پاسخ فقط برای ۳٪ تلاش‌ها موجود است، پس علت شکست در این محاسبه استفاده نشده.'
  },
  methodology: {
    type: 'تحلیل قیف در سطح تلاش پرداخت',
    peerGroup: 'کسب‌وکارهای هم‌صنعت و هم‌اندازه',
    minSample: '۵۰۰ تلاش ناموفق',
    coverage: '۱۰۰٪',
    confidence: 'بالا',
    simple:
    'تلاش‌های پرداخت را به‌ترتیب زمان کنار هم گذاشته‌ایم تا ببینیم پس از هر شکست چه اتفاقی افتاده.',
    technical: [
    'تلاش دوباره: تلاش بعدی همان کاربر برای همان خرید در بازه ۳۰ دقیقه.',
    'چند تلاش برای یک خرید، یک خرید شمرده می‌شود.',
    'ترک پرداخت: نبود هیچ تلاش موفق پس از آخرین شکست در همان بازه.']

  }
},
{
  id: 'revenue-concentration',
  category: 'risk',
  topic: 'sales',
  defaultState: 'new',
  title: 'بخش بزرگی از درآمد به تعداد کمی از مشتریان وابسته است',
  summary:
  '۱٪ برتر مشتریان ۳۱٫۵٪ از درآمد موفق را می‌سازند. کاهش خرید همین گروه کوچک اثر بزرگی روی فروش کل دارد.',
  detectedOn: '۲۲ خرداد',
  primary: { label: 'سهم ۱٪ برتر', value: '۳۱٫۵٪' },
  comparison: { label: 'میانه گروه مشابه', value: '۱۹٫۲٪' },
  gap: '۱۲٫۳ واحد درصد',
  impact: 15_000_000,
  confidence: 'medium',
  confidenceReasons: ['پوشش شناسه مشتری ۴۶٪ است', 'حجم داده در بخش موجود بالا است'],
  importance: 63,
  whatHappened: [
  'سهم ۱٪ برتر مشتریان از درآمد موفق ۳۱٫۵٪ است.',
  'سهم ۱۰٪ برتر به ۶۷٫۸٪ می‌رسد.',
  'این تمرکز در سه ماه گذشته بیش‌تر شده است.'],

  howMuchChanged: 'سهم ۱٪ برتر نسبت به سه ماه قبل ۴٫۱ واحد درصد بالا رفته است.',
  contributions: [
  { label: 'دسته خدمات مالی', points: 6.2, to: '/sales?from=revenue-concentration' },
  { label: 'پرداخت‌های مبلغ‌بالا', points: 4.1, to: '/explore?from=revenue-concentration' },
  { label: 'مشتریان تکراری قدیمی', points: 2.0, to: '/customers?from=revenue-concentration' }],

  drivers: {
    label: 'تمرکز درآمد',
    value: '۳۱٫۵٪ در ۱٪ برتر',
    children: [
    { label: 'دسته خدمات مالی', value: '۶٫۲ واحد درصد', relation: 'مرتبط با' },
    { label: 'پرداخت‌های مبلغ‌بالا', value: '۴٫۱ واحد درصد', relation: 'همراه با' }]

  },
  peerComparison: 'در گروه مشابه، سهم ۱٪ برتر به‌طور میانه ۱۹٫۲٪ است؛ تمرکز شما بالاتر است.',
  interpretation:
  'تمرکز درآمد به‌خودی‌خود مشکل نیست، اما ریسک را بالا می‌برد؛ رفتن یک مشتری بزرگ افت محسوسی می‌سازد.',
  recommendation: 'توزیع درآمد را ببینید و وابستگی به مشتریان بزرگ را در برنامه‌ریزی لحاظ کنید.',
  investigateLabel: 'بررسی تمرکز درآمد',
  investigateTo: '/sales?from=revenue-concentration',
  chartUnit: 'percent',
  chart: [
  { label: 'فروردین', current: 27.4, previous: 26.1 },
  { label: 'اردیبهشت', current: 29.6, previous: 26.8 },
  { label: 'خرداد', current: 31.5, previous: 27.4 }],

  evidence: {
    population: 'پرداخت‌های موفق دارای شناسه مشتری',
    period: '۱ فروردین تا ۳۰ خرداد',
    usableRecords: 7318,
    excludedRecords: 8596,
    excludedReason: 'شناسه مشتری در این رکوردها موجود نبود',
    rows: [
    { label: 'مشتریان قابل شناسایی', value: '۴٬۲۶۰' },
    { label: 'سهم ۱٪ برتر', value: '۳۱٫۵٪' },
    { label: 'سهم ۵٪ برتر', value: '۵۲٫۴٪' },
    { label: 'سهم ۱۰٪ برتر', value: '۶۷٫۸٪' }],

    formula: 'سهم هر گروه = درآمد موفق آن گروه ÷ درآمد موفق مشتریان قابل شناسایی',
    steps: [
    { label: 'درآمد مشتریان قابل شناسایی', value: '۱٫۳۱ میلیارد تومان' },
    { label: 'درآمد ۱٪ برتر', value: '۴۱۳ میلیون تومان' },
    { label: 'سهم', value: '۳۱٫۵٪' }],

    limitation: 'محاسبه فقط روی مشتریان قابل شناسایی انجام شده است.'
  },
  methodology: {
    type: 'تحلیل تمرکز',
    peerGroup: 'کسب‌وکارهای هم‌صنعت و هم‌اندازه',
    minSample: '۵۰۰ مشتری قابل شناسایی',
    coverage: '۴۶٪',
    confidence: 'متوسط',
    simple: 'مشتریان را از بیش‌ترین به کم‌ترین درآمد مرتب کرده‌ایم و سهم گروه‌های بالایی را شمرده‌ایم.',
    technical: [
    'سهم گروه‌ها روی درآمد قابل انتساب محاسبه شده، نه کل درآمد.',
    'اثر مالی فقط ریسک نوسان را نشان می‌دهد و درآمد از دست رفته نیست.']

  },
  caveat: 'محاسبه فقط روی پرداخت‌های دارای شناسه مشتری انجام شده است. پوشش فعلی ۴۶٪.'
},
{
  id: 'latency-p95',
  category: 'trend',
  topic: 'time',
  defaultState: 'reviewed',
  title: 'زمان پردازش در صدک ۹۵ رو به افزایش است',
  summary:
  'میانه زمان پردازش تقریباً ثابت مانده، اما صدک ۹۵ در چهار هفته اخیر از ۴٫۱ به ۶٫۸ ثانیه رسیده است.',
  detectedOn: '۲۰ خرداد',
  primary: { label: 'صدک ۹۵ فعلی', value: '۶٫۸ ثانیه' },
  comparison: { label: 'چهار هفته قبل', value: '۴٫۱ ثانیه' },
  gap: '۲٫۷ ثانیه',
  impact: 0,
  confidence: 'medium',
  confidenceReasons: ['زمان تأیید فقط برای ۴۸٪ رکوردها موجود است', 'اثر پایدار'],
  importance: 48,
  whatHappened: [
  'میانه زمان پردازش از ۱٫۲ به ۱٫۳ ثانیه رسیده است؛ تغییر محسوسی نیست.',
  'صدک ۹۵ اما ۶۶٪ بالا رفته است.',
  'بیش‌ترین تغییر در ساعت‌های پرتراکنش دیده می‌شود.'],

  howMuchChanged: 'صدک ۹۵ ‏۲٫۷ ثانیه کندتر شده، در حالی که میانه تقریباً ثابت مانده است.',
  contributions: [
  { label: 'ساعت‌های ۱۸ تا ۲۳', points: 1.6, to: '/payments?from=latency-p95&focus=hour' },
  { label: 'مسیر PSP-08', points: 0.8, to: '/payments?from=latency-p95&focus=psp' }],

  drivers: {
    label: 'افزایش زمان پردازش در دنباله توزیع',
    value: '۲٫۷ ثانیه',
    children: [
    { label: 'ساعت‌های ۱۸ تا ۲۳', value: '۱٫۶ ثانیه', relation: 'بیش‌تر دیده می‌شود' },
    { label: 'مسیر PSP-08', value: '۰٫۸ ثانیه', relation: 'مرتبط با' }]

  },
  peerComparison: 'صدک ۹۵ گروه مشابه حدود ۴٫۵ ثانیه است.',
  interpretation:
  'کندی در دنباله توزیع رخ می‌دهد، نه در حالت معمول. همین کاربران دنباله بیش‌تر پرداخت را رها می‌کنند.',
  recommendation: 'صدک‌های زمان پردازش را کنار نرخ رها کردن پرداخت دنبال کنید.',
  investigateLabel: 'بررسی زمان پردازش',
  investigateTo: '/payments?from=latency-p95&focus=latency',
  chartUnit: 'second',
  chart: [
  { label: 'هفته ۱', current: 4.1, previous: 3.9 },
  { label: 'هفته ۲', current: 4.9, previous: 4.0 },
  { label: 'هفته ۳', current: 5.8, previous: 4.2 },
  { label: 'هفته ۴', current: 6.8, previous: 4.1 }],

  evidence: {
    population: 'تلاش‌هایی که هر دو زمان ثبت و تأیید را دارند',
    period: '۱ تا ۳۰ خرداد',
    usableRecords: 7687,
    excludedRecords: 8327,
    excludedReason: 'زمان تأیید برای این رکوردها ثبت نشده بود',
    rows: [
    { label: 'رکوردهای قابل استفاده', value: '۷٬۶۸۷' },
    { label: 'میانه', value: '۱٫۳ ثانیه' },
    { label: 'صدک ۹۰', value: '۳٫۴ ثانیه' },
    { label: 'صدک ۹۵', value: '۶٫۸ ثانیه' }],

    formula: 'زمان پردازش = زمان تأیید − زمان ثبت تلاش پرداخت',
    steps: [
    { label: 'رکورد دارای هر دو زمان', value: '۷٬۶۸۷' },
    { label: 'صدک ۹۵ هفته اول', value: '۴٫۱ ثانیه' },
    { label: 'صدک ۹۵ هفته چهارم', value: '۶٫۸ ثانیه' }],

    limitation: 'میانگین گزارش نمی‌شود چون به مقادیر پرت حساس است.'
  },
  methodology: {
    type: 'تحلیل روند صدک‌ها',
    peerGroup: 'کسب‌وکارهای هم‌صنعت و هم‌اندازه',
    minSample: '۵۰۰ رکورد دارای زمان تأیید',
    coverage: '۴۸٪',
    confidence: 'متوسط',
    simple: 'زمان پردازش را هفته‌به‌هفته در سه نقطه توزیع دنبال کرده‌ایم: میانه، صدک ۹۰ و صدک ۹۵.',
    technical: [
    'میانگین گزارش نمی‌شود چون یک مقدار پرت آن را جابه‌جا می‌کند.',
    'رکوردهای بدون زمان تأیید کنار گذاشته شده‌اند و نتیجه به آن‌ها تعمیم داده نمی‌شود.']

  },
  caveat: 'زمان تأیید فقط برای ۴۸٪ رکوردها موجود است.'
},
{
  id: 'weekend-growth',
  category: 'positive',
  topic: 'sales',
  defaultState: 'new',
  title: 'فروش پایان هفته بهتر از بقیه روزها رشد کرده',
  summary:
  'درآمد موفق پنجشنبه و جمعه ۱۱٫۲٪ بالا رفته، در حالی که بقیه روزها ۱۲٫۴٪ افت داشته‌اند.',
  detectedOn: '۱۸ خرداد',
  primary: { label: 'رشد پایان هفته', value: '۱۱٫۲٪' },
  comparison: { label: 'سایر روزها', value: '−۱۲٫۴٪' },
  gap: '۲۳٫۶ واحد درصد',
  impact: 0,
  confidence: 'high',
  confidenceReasons: ['حجم داده بالا', 'اثر پایدار در سه ماه'],
  importance: 52,
  whatHappened: [
  'سهم پایان هفته از درآمد موفق از ۲۱٪ به ۲۶٫۴٪ رسیده است.',
  'میانگین مبلغ پرداخت در این دو روز بالاتر است.'],

  howMuchChanged: 'سهم پایان هفته ۵٫۴ واحد درصد بالا رفته است.',
  contributions: [
  { label: 'دسته کالای دیجیتال', points: 3.1, to: '/explore?from=weekend-growth' },
  { label: 'مشتریان جدید', points: 2.3, to: '/customers?from=weekend-growth' }],

  drivers: {
    label: 'رشد فروش پایان هفته',
    value: '۱۱٫۲٪',
    children: [
    { label: 'دسته کالای دیجیتال', value: '۳٫۱ واحد درصد', relation: 'مرتبط با' },
    { label: 'مشتریان جدید', value: '۲٫۳ واحد درصد', relation: 'همراه با' }]

  },
  peerComparison: 'در گروه مشابه، سهم پایان هفته به‌طور میانه ۲۲٫۸٪ است.',
  interpretation: 'رشد بیش‌تر با دسته کالای دیجیتال و ورود مشتریان جدید همراه است.',
  recommendation: 'الگوی روزهای هفته را ببینید تا مشخص شود این رشد پایدار است یا فصلی.',
  investigateLabel: 'بررسی الگوی روزها',
  investigateTo: '/explore?from=weekend-growth',
  chartUnit: 'percent',
  chart: [
  { label: 'فروردین', current: 21.0, previous: 20.4 },
  { label: 'اردیبهشت', current: 23.8, previous: 21.1 },
  { label: 'خرداد', current: 26.4, previous: 21.0 }],

  evidence: {
    population: 'همه پرداخت‌های موفق این کسب‌وکار',
    period: '۱ فروردین تا ۳۰ خرداد',
    usableRecords: 16014,
    excludedRecords: 0,
    excludedReason: 'رکوردی کنار گذاشته نشده است',
    rows: [
    { label: 'پرداخت موفق پایان هفته', value: '۴٬۸۶۲' },
    { label: 'سهم درآمد پایان هفته', value: '۲۶٫۴٪' },
    { label: 'سهم دوره قبل', value: '۲۱٪' }],

    formula: 'رشد = (درآمد پایان هفته دوره فعلی ÷ درآمد پایان هفته دوره قبل) − ۱',
    steps: [
    { label: 'درآمد پایان هفته فعلی', value: '۷۵۰ میلیون تومان' },
    { label: 'درآمد پایان هفته قبل', value: '۶۷۴ میلیون تومان' },
    { label: 'رشد', value: '۱۱٫۲٪' }],

    limitation: 'با داده سه‌ماهه، اثر فصلی به‌طور کامل قابل تفکیک نیست.'
  },
  methodology: {
    type: 'مقایسه بخش‌بندی‌شده در طول زمان',
    peerGroup: 'کسب‌وکارهای هم‌صنعت و هم‌اندازه',
    minSample: '۵۰۰ پرداخت موفق',
    coverage: '۱۰۰٪',
    confidence: 'بالا',
    simple: 'درآمد پایان هفته را جدا از بقیه روزها با دوره قبل مقایسه کرده‌ایم.',
    technical: [
    'پایان هفته: پنجشنبه و جمعه بر اساس تقویم شمسی.',
    'با سه ماه داده، تفکیک کامل اثر فصلی ممکن نیست.']

  }
}];


export const rankedInsights = [...insights].sort((a, b) => b.importance - a.importance);

export function getInsight(id: string): Insight | undefined {
  return insights.find((item) => item.id === id);
}

export function insightsByTopic(topic: InsightTopic): Insight[] {
  return rankedInsights.filter((item) => item.topic === topic);
}

export function insightsByIds(ids: string[]): Insight[] {
  return ids.map((id) => getInsight(id)).filter((item): item is Insight => Boolean(item));
}

export const discardedSignals = [
{
  title: 'تفاوت نرخ موفقیت بین دو دسته کوچک',
  reason: 'اختلاف ۰٫۴ واحد درصد است و از نظر عملی معنادار نیست.'
},
{
  title: 'افت فروش در یک کسب‌وکار کم‌حجم',
  reason: 'تعداد پرداخت‌های قابل استفاده ۱۴۳ مورد است؛ کم‌تر از حداقل ۵۰۰ مورد.'
},
{
  title: 'رابطه بین کد پاسخ و ساعت پرداخت',
  reason: 'کد پاسخ فقط برای ۳٪ تلاش‌ها موجود است و نتیجه قابل اتکا نیست.'
}];