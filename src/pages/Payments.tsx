import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { PageHeader, SectionHeading } from '../components/analytics/PageHeader';
import { MetricCard } from '../components/analytics/MetricCard';
import { InsightCard } from '../components/analytics/InsightCard';
import { BarCompareChart } from '../components/analytics/charts/BarCompareChart';
import { PaymentFunnel } from '../components/analytics/charts/PaymentFunnel';
import { CoverageNotice, InvestigationBar, PrototypeNotice } from '../components/analytics/Notices';
import { useAnalysis } from '../contexts/AnalysisContext';
import { useLiveInsights } from '../lib/useLiveInsights';
import {
  funnel,
  funnelNote,
  hourlySuccess,
  latency,
  latencyNote,
  paymentKpis,
  pspAdjustedNote,
  pspCaveat,
  psps,
  responseCodeCoverage,
  responseCodes,
  successTrend } from
'../data/payments';
import { formatNumber, formatPercent, formatToman, toPersianDigits } from '../utils/format';

export function Payments() {
  const navigate = useNavigate();
  const { states } = useAnalysis();
  const [comparison, setComparison] = useState<'raw' | 'adjusted'>('raw');
  const allInsights = useLiveInsights();
  const relatedInsights = allInsights.filter((i) => i.topic === 'psp' || i.topic === 'payment').slice(0, 3);

  return (
    <div>
      <InvestigationBar />
      <PageHeader
        title="پرداخت‌ها"
        description="عملکرد پرداخت، مسیرها و رفتار تلاش‌های پرداخت" />
      

      <div className="space-y-6">
        <section aria-label="معیارهای پرداخت">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {paymentKpis.map((kpi) =>
            <MetricCard
              key={kpi.id}
              label={kpi.label}
              value={kpi.value}
              delta={kpi.delta}
              deltaUnit={kpi.unit}
              positiveWhen={kpi.positiveWhen}
              note={kpi.note} />

            )}
          </div>
          <PrototypeNotice className="mt-3" />
        </section>

        <Card padding="md" elevation="low" className="border-border-light">
          <SectionHeading
            title="روند موفقیت پرداخت"
            description="نرخ موفقیت هفته‌به‌هفته پایین آمده، در حالی که حجم تلاش‌ها تقریباً ثابت مانده است." />
          
          <BarCompareChart
            ariaLabel="نرخ موفقیت پرداخت به تفکیک هفته در برابر دوره قبل"
            seriesLabel="دوره فعلی"
            compareLabel="دوره قبل"
            data={successTrend.map((week) => ({
              key: week.label,
              value: week.current,
              compare: week.previous,
              highlight: week.anomaly
            }))}
            valueFormatter={(value) => formatPercent(value)} />
          
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {successTrend.map((week) =>
            <li
              key={week.label}
              className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-[12px]">
              
                <span className="font-bold text-gray-950">{week.label}</span>
                <span className="text-gray-800">
                  موفق {formatNumber(week.success)} · ناموفق {formatNumber(week.failed)}
                </span>
              </li>
            )}
          </ul>
        </Card>

        <Card padding="md" elevation="low" className="border-border-light">
          <SectionHeading
            title="عملکرد مسیرهای پرداخت"
            description="ترکیب ترافیک هر مسیر با بقیه فرق دارد؛ مقایسه هم‌ترکیب تصویر منصفانه‌تری می‌دهد."
            action={
            <div className="flex gap-1.5" role="group" aria-label="نوع مقایسه مسیرها">
                {(
              [
              { value: 'raw', label: 'نرخ خام' },
              { value: 'adjusted', label: 'مقایسه هم‌ترکیب' }] as
              const).
              map((option) =>
              <button
                key={option.value}
                type="button"
                onClick={() => setComparison(option.value)}
                aria-pressed={comparison === option.value}
                className={`min-h-[32px] rounded-lg px-2.5 py-1 text-[12px] font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600 ${
                comparison === option.value ?
                'bg-pal-600 text-white' :
                'bg-gray-100 text-gray-800 hover:bg-gray-200'}`
                }>
                
                    {option.label}
                  </button>
              )}
              </div>
            } />
          

          {comparison === 'raw' ?
          <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse">
                  <caption className="sr-only">عملکرد مسیرهای پرداخت</caption>
                  <thead>
                    <tr className="border-b border-border-light text-[12px] text-gray-700">
                      {[
                    'مسیر پرداخت',
                    'موفقیت',
                    'تعداد تلاش',
                    'ارزش موفق',
                    'میانه زمان',
                    'صدک ۹۵',
                    'تلاش مجدد',
                    'ترکیب ترافیک'].
                    map((head) =>
                    <th key={head} scope="col" className="px-2 py-2.5 text-start font-medium">
                          {head}
                        </th>
                    )}
                    </tr>
                  </thead>
                  <tbody>
                    {psps.map((row) =>
                  <tr key={row.psp} className="border-b border-border-light last:border-b-0">
                        <th scope="row" className="px-2 py-3 text-start text-[13px] font-bold text-gray-950">
                          <span className="flex items-center gap-1.5">
                            {row.psp}
                            {row.lowVolume &&
                        <Badge variant="warning" size="sm">
                                حجم کم
                              </Badge>
                        }
                          </span>
                        </th>
                        <td className="px-2 py-3 text-[13px] font-bold text-gray-950">
                          {formatPercent(row.successRate)}
                        </td>
                        <td className="px-2 py-3 text-[13px] text-gray-800">
                          {formatNumber(row.attempts)}
                        </td>
                        <td className="px-2 py-3 text-[13px] text-gray-800">
                          {formatToman(row.successValue)}
                        </td>
                        <td className="px-2 py-3 text-[13px] text-gray-800">
                          {formatNumber(row.latencyMedian, 1)} ثانیه
                        </td>
                        <td className="px-2 py-3 text-[13px] text-gray-800">
                          {formatNumber(row.latencyP95, 1)} ثانیه
                        </td>
                        <td className="px-2 py-3 text-[13px] text-gray-800">
                          {formatPercent(row.retryRate)}
                        </td>
                        <td className="px-2 py-3 text-[12px] text-gray-700">{row.mix}</td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2.5 text-[12px] leading-6 text-gray-800">
                {pspCaveat}
              </p>
            </> :

          <>
              <BarCompareChart
              ariaLabel="مقایسه هم‌ترکیب مسیرهای پرداخت"
              seriesLabel="نرخ هم‌ترکیب"
              compareLabel="نرخ خام"
              data={psps.map((row) => ({
                key: row.psp,
                value: row.adjustedRate,
                compare: row.successRate,
                highlight: row.adjustedRate < 72
              }))}
              valueFormatter={(value) => formatPercent(value)} />
            
              <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2.5 text-[12px] leading-6 text-gray-800">
                {pspAdjustedNote}
              </p>
            </>
          }

          <div className="mt-3">
            <Button size="sm" variant="outline" onClick={() => navigate('/insights/psp08-drop')}>
              مشاهده یافته مسیر پرداخت
            </Button>
          </div>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card padding="md" elevation="low" className="border-border-light">
            <SectionHeading title="قیف تلاش پرداخت" />
            <PaymentFunnel stages={funnel} />
            <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2.5 text-[12px] leading-6 text-gray-800">
              {funnelNote}
            </p>
            <div className="mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate('/insights/retry-abandon')}>
                
                مشاهده یافته رها شدن پرداخت
              </Button>
            </div>
          </Card>

          <Card padding="md" elevation="low" className="border-border-light">
            <SectionHeading title="موفقیت پرداخت در ساعت‌های شبانه‌روز" />
            <BarCompareChart
              ariaLabel="نرخ موفقیت پرداخت به تفکیک ساعت"
              data={hourlySuccess.map((row) => ({
                key: `ساعت ${row.hour}`,
                value: row.rate,
                highlight: row.rate < 68
              }))}
              valueFormatter={(value) => formatPercent(value)} />
            
            <p className="mt-3 text-[13px] leading-7 text-gray-900">
              پایین‌ترین نرخ موفقیت در ساعت‌های ۱۸ تا ۲۳ دیده می‌شود؛ همان بازه‌ای که بیش‌ترین حجم
              پرداخت را دارد.
            </p>
          </Card>
        </div>

        <Card padding="md" elevation="low" className="border-border-light">
          <SectionHeading title="علت‌های شکست پرداخت" />
          <div className="mb-3">
            <CoverageNotice>
              پوشش داده: {toPersianDigits(responseCodeCoverage)}٪ از تلاش‌های پرداخت. این توزیع فقط
              همین بخش کوچک را توصیف می‌کند و نماینده همه پرداخت‌های ناموفق نیست.
            </CoverageNotice>
          </div>
          <ul className="space-y-3">
            {responseCodes.map((row) =>
            <li key={row.code}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[13px] text-gray-900">
                    کد {row.code} — {row.reason}
                  </span>
                  <span className="text-[13px] font-bold text-gray-950">
                    {formatPercent(row.share)} · {formatNumber(row.count)} مورد
                  </span>
                </div>
                <div className="mt-1.5 h-2.5 w-full rounded-full bg-gray-100">
                  <div
                  className="h-2.5 rounded-full bg-orange-600"
                  style={{ width: `${row.share}%` }}
                  aria-hidden="true" />
                
                </div>
              </li>
            )}
          </ul>
        </Card>

        <Card padding="md" elevation="low" className="border-border-light">
          <SectionHeading
            title="زمان پردازش"
            description="میانگین گزارش نمی‌شود، چون یک مقدار پرت می‌تواند آن را جابه‌جا کند." />
          
          <div className="grid gap-3 sm:grid-cols-3">
            {latency.map((row) =>
            <div key={row.label} className="rounded-lg border border-border-light p-3">
                <p className="text-[12px] text-gray-700">{row.label}</p>
                <p className="mt-1.5 text-[20px] font-bold leading-none text-gray-950">
                  {formatNumber(row.current, 1)} ثانیه
                </p>
                <p className="mt-2 text-[11px] text-gray-700">
                  چهار هفته قبل: {formatNumber(row.previous, 1)} ثانیه
                </p>
              </div>
            )}
          </div>
          <p className="mt-3 text-[13px] leading-7 text-gray-900">{latencyNote}</p>
          <div className="mt-3">
            <Button size="sm" variant="outline" onClick={() => navigate('/insights/latency-p95')}>
              مشاهده یافته زمان پردازش
            </Button>
          </div>
        </Card>

        <section aria-label="یافته‌های مرتبط با پرداخت">
          <SectionHeading title="یافته‌های مرتبط با پرداخت" />
          <div className="space-y-4">
            {relatedInsights.map((insight) =>
            <InsightCard key={insight.id} insight={insight} state={states[insight.id]} compact />
            )}
          </div>
        </section>
      </div>
    </div>);

}