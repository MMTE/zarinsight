export type NotificationKind = 'drop' | 'opportunity' | 'anomaly' | 'psp' | 'trend';

export interface NotificationItem {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  date: string;
  insightId: string;
}

export const notificationKindLabels: Record<NotificationKind, string> = {
  drop: 'افت مهم',
  opportunity: 'فرصت جدید',
  anomaly: 'تغییر غیرعادی',
  psp: 'تغییر عملکرد مسیر پرداخت',
  trend: 'تغییر روند فروش'
};

export const notifications: NotificationItem[] = [
{
  id: 'n1',
  kind: 'drop',
  title: 'نرخ موفقیت پرداخت کاهش یافته است',
  body: 'از ۷۹٫۶٪ به ۷۱٫۴٪ رسیده است. بیش‌ترین سهم مربوط به مسیر PSP-08 است.',
  date: '۲۹ خرداد',
  insightId: 'psp08-drop'
},
{
  id: 'n2',
  kind: 'opportunity',
  title: 'یک فرصت جدید برای بررسی پیدا شد',
  body: 'مشتریان تکراری ۱٫۶ برابر بیش‌تر خرید می‌کنند اما سهم کمی از فروش دارند.',
  date: '۲۶ خرداد',
  insightId: 'repeat-customers'
},
{
  id: 'n3',
  kind: 'anomaly',
  title: 'رها شدن پرداخت بیش‌تر شده است',
  body: 'نرخ تلاش دوباره به ۳۸٪ رسیده؛ میانه گروه مشابه ۵۱٪ است.',
  date: '۲۴ خرداد',
  insightId: 'retry-abandon'
},
{
  id: 'n4',
  kind: 'psp',
  title: 'عملکرد یک مسیر پرداخت تغییر کرده است',
  body: 'زمان پردازش PSP-08 در صدک ۹۵ به ۸٫۶ ثانیه رسیده است.',
  date: '۲۰ خرداد',
  insightId: 'latency-p95'
},
{
  id: 'n5',
  kind: 'trend',
  title: 'روند فروش پایان هفته تغییر کرده است',
  body: 'سهم پایان هفته از درآمد از ۲۱٪ به ۲۶٫۴٪ رسیده است.',
  date: '۱۸ خرداد',
  insightId: 'weekend-growth'
}];