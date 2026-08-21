import React from 'react';
import { WalletIcon, ReceiptTextIcon, UsersIcon, ArrowLeftIcon, RefreshCwIcon } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { ChartCard } from '../components/ChartCard';
import { Table } from '../components/Table';
import { Button } from '../components/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card';

type TransactionRow = {
  id: string;
  date: string;
  amount: number;
  status: 'success' | 'pending' | 'failed' | 'refunded';
};

const revenueByDay = [
  { label: 'شنبه', value: 18400000 },
  { label: 'یکشنبه', value: 22150000 },
  { label: 'دوشنبه', value: 19800000 },
  { label: 'سه‌شنبه', value: 27600000 },
  { label: 'چهارشنبه', value: 24300000 },
  { label: 'پنجشنبه', value: 31900000 },
  { label: 'جمعه', value: 28450000 }
];

const transactions: TransactionRow[] = [
  { id: 'A00000000123456789', date: '۱۴۰۳/۰۵/۲۱', amount: 1250000, status: 'success' },
  { id: 'A00000000123456790', date: '۱۴۰۳/۰۵/۲۱', amount: 480000, status: 'pending' },
  { id: 'A00000000123456791', date: '۱۴۰۳/۰۵/۲۰', amount: 3200000, status: 'success' },
  { id: 'A00000000123456792', date: '۱۴۰۳/۰۵/۲۰', amount: 175000, status: 'failed' },
  { id: 'A00000000123456793', date: '۱۴۰۳/۰۵/۱۹', amount: 920000, status: 'refunded' },
  { id: 'A00000000123456794', date: '۱۴۰۳/۰۵/۱۹', amount: 6400000, status: 'success' }
];

const settlements = [
  { id: 'S-۱۰۲۴', title: 'تسویه روزانه', meta: 'بانک سامان • ۶۰۳۷', amount: '۱۲٬۴۵۰٬۰۰۰ تومان' },
  { id: 'S-۱۰۲۳', title: 'تسویه روزانه', meta: 'بانک سامان • ۶۰۳۷', amount: '۸٬۹۳۰٬۰۰۰ تومان' },
  { id: 'S-۱۰۲۲', title: 'تسویه دستی', meta: 'بانک ملت • ۶۱۰۴', amount: '۴٬۲۰۰٬۰۰۰ تومان' }
];

export function PanelDashboard() {
  const [period, setPeriod] = React.useState('week');

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary-light">داشبورد فروشگاه زرین</h1>
          <p className="mt-1 text-sm text-text-secondary-light">
            گزارش عملکرد درگاه پرداخت در هفت روز گذشته
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="md" leadingIcon={<RefreshCwIcon className="h-4 w-4" />}>
            به‌روزرسانی
          </Button>
          <Button variant="primary" size="md" trailingIcon={<ArrowLeftIcon className="h-4 w-4" />}>
            تسویه جدید
          </Button>
        </div>
      </header>

      <section aria-label="شاخص‌های کلیدی" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="درآمد امروز"
          amount={28450000}
          unit="تومان"
          icon={<WalletIcon className="h-5 w-5" />}
          trend={{ direction: 'up', value: 12.5, caption: 'نسبت به دیروز' }}
        />

        <StatCard
          label="تراکنش‌های موفق"
          amount={1284}
          unit="تراکنش"
          icon={<ReceiptTextIcon className="h-5 w-5" />}
          trend={{ direction: 'up', value: 4.2, caption: 'نسبت به دیروز' }}
        />

        <StatCard
          label="مشتریان جدید"
          amount={96}
          unit="نفر"
          icon={<UsersIcon className="h-5 w-5" />}
          trend={{ direction: 'down', value: 2.1, caption: 'نسبت به دیروز' }}
        />
      </section>

      <section aria-label="روند درآمد">
        <ChartCard
          title="روند درآمد"
          description="مجموع مبالغ موفق به تفکیک روز"
          value="۱۷۲٬۶۰۰٬۰۰۰ تومان"
          change={8.4}
          data={revenueByDay}
          variant="area"
          height={280}
          periods={[
            { id: 'week', label: 'هفته' },
            { id: 'month', label: 'ماه' },
            { id: 'year', label: 'سال' }]
          }
          selectedPeriod={period}
          onPeriodChange={setPeriod}
          formatValue={(value) => `${(value / 1000000).toLocaleString('fa-IR')} م`}
        />
      </section>

      <section aria-label="تراکنش‌ها و تسویه‌ها" className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Card padding="none" elevation="low">
            <CardHeader className="p-4 pb-0">
              <CardTitle>آخرین تراکنش‌ها</CardTitle>
              <CardDescription>۶ تراکنش اخیر درگاه</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <Table rows={transactions} currencyLabel="تومان" />
            </CardContent>
          </Card>
        </div>

        <Card elevation="low">
          <CardHeader>
            <CardTitle>تسویه‌های اخیر</CardTitle>
            <CardDescription>واریز به حساب‌های متصل</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border-light">
              {settlements.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text-primary-light">{item.title}</p>
                    <p className="truncate text-xs text-text-muted-light">{item.meta}</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-text-primary-light">
                    {item.amount}
                  </span>
                </li>
              ))}
            </ul>
            <Button variant="ghost" size="sm" fullWidth className="mt-2">
              مشاهده همه تسویه‌ها
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
