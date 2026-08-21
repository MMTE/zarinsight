import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { PageHeader, SectionHeading } from '../components/analytics/PageHeader';
import { MetricCard } from '../components/analytics/MetricCard';
import { InsightCard } from '../components/analytics/InsightCard';
import { CohortTable } from '../components/analytics/CohortTable';
import { BarCompareChart } from '../components/analytics/charts/BarCompareChart';
import { DataCoverageBadge } from '../components/analytics/Badges';
import { CoverageNotice, InvestigationBar, PrototypeNotice } from '../components/analytics/Notices';
import { InsufficientDataState } from '../components/analytics/States';
import { useAnalysis } from '../contexts/AnalysisContext';
import { insightsByTopic } from '../data/insights';
import {
  cohortColumns,
  cohortSummary,
  cohorts,
  coverageNotice,
  customerKpis,
  newVsRepeat,
  retentionOpportunities,
  returnTrend,
  valueSegments } from
'../data/customers';
import { formatPercent } from '../utils/format';

export function Customers() {
  const navigate = useNavigate();
  const { states } = useAnalysis();
  const relatedInsights = insightsByTopic('customer');

  return (
    <div>
      <InvestigationBar />
      <PageHeader
        title="مشتریان"
        description="تکرار خرید، بازگشت مشتری و ارزش هر گروه از مشتریان"
        actions={<DataCoverageBadge coverage={46} label="پوشش شناسه مشتری" />} />
      

      <div className="space-y-6">
        <CoverageNotice>{coverageNotice}</CoverageNotice>

        <section aria-label="معیارهای مشتریان">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {customerKpis.map((kpi) =>
            <MetricCard key={kpi.id} label={kpi.label} value={kpi.value} note={kpi.note} />
            )}
          </div>
          <PrototypeNotice className="mt-3" />
        </section>

        <Card padding="md" elevation="low" className="border-border-light">
          <SectionHeading
            title="مشتری جدید در برابر مشتری تکراری"
            description="مشتری جدید: اولین پرداخت موفق. مشتری تکراری: حداقل یک پرداخت موفق پیشین." />
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse">
              <caption className="sr-only">مقایسه مشتریان جدید و تکراری</caption>
              <thead>
                <tr className="border-b border-border-light text-[12px] text-gray-700">
                  <th scope="col" className="py-2.5 pe-2 text-start font-medium">
                    معیار
                  </th>
                  <th scope="col" className="px-2 py-2.5 text-start font-medium">
                    مشتری جدید
                  </th>
                  <th scope="col" className="px-2 py-2.5 text-start font-medium">
                    مشتری تکراری
                  </th>
                </tr>
              </thead>
              <tbody>
                {newVsRepeat.map((row) =>
                <tr key={row.metric} className="border-b border-border-light last:border-b-0">
                    <th scope="row" className="py-3 pe-2 text-start text-[13px] font-bold text-gray-950">
                      {row.metric}
                    </th>
                    <td
                    className={`px-2 py-3 text-[13px] ${row.better === 'new' ? 'font-bold text-gray-950' : 'text-gray-800'}`}>
                    
                      {row.newValue}
                      {row.better === 'new' && <span className="sr-only"> — بیش‌تر</span>}
                    </td>
                    <td
                    className={`px-2 py-3 text-[13px] ${row.better === 'repeat' ? 'font-bold text-gray-950' : 'text-gray-800'}`}>
                    
                      {row.repeatValue}
                      {row.better === 'repeat' && <span className="sr-only"> — بیش‌تر</span>}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card padding="md" elevation="low" className="border-border-light">
          <SectionHeading title="بازگشت مشتریان به تفکیک ماه ورود" />
          <p className="mb-3 rounded-lg bg-gray-50 px-3 py-2.5 text-[13px] leading-7 text-gray-900">
            {cohortSummary}
          </p>
          <CohortTable
            rows={cohorts}
            columns={cohortColumns}
            onSelect={() => navigate('/insights/repeat-customers')} />
          
        </Card>

        <Card padding="md" elevation="low" className="border-border-light">
          <SectionHeading title="روند بازگشت مشتری در ماه دوم" />
          <BarCompareChart
            ariaLabel="نرخ بازگشت ماه دوم به تفکیک هم‌گروه"
            seriesLabel="این هم‌گروه"
            compareLabel="میانگین دوره"
            data={returnTrend.map((row) => ({
              key: row.label,
              value: row.current,
              compare: row.previous,
              highlight: row.current < row.previous - 3
            }))}
            valueFormatter={(value) => formatPercent(value)} />
          
        </Card>

        <Card padding="md" elevation="low" className="border-border-light">
          <SectionHeading
            title="مشتریان پرارزش"
            description="سهم هر بخش از درآمد و تفاوت رفتار آن‌ها با بقیه مشتریان" />
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse">
              <caption className="sr-only">مقایسه بخش‌های مشتری بر اساس ارزش</caption>
              <thead>
                <tr className="border-b border-border-light text-[12px] text-gray-700">
                  <th scope="col" className="py-2.5 pe-2 text-start font-medium">
                    بخش
                  </th>
                  <th scope="col" className="px-2 py-2.5 text-start font-medium">
                    سهم درآمد
                  </th>
                  <th scope="col" className="px-2 py-2.5 text-start font-medium">
                    تکرار خرید
                  </th>
                  <th scope="col" className="px-2 py-2.5 text-start font-medium">
                    میانگین مبلغ
                  </th>
                  <th scope="col" className="px-2 py-2.5 text-start font-medium">
                    موفقیت پرداخت
                  </th>
                </tr>
              </thead>
              <tbody>
                {valueSegments.map((row) =>
                <tr key={row.segment} className="border-b border-border-light last:border-b-0">
                    <th scope="row" className="py-3 pe-2 text-start text-[13px] font-bold text-gray-950">
                      {row.segment}
                    </th>
                    <td className="px-2 py-3 text-[13px] text-gray-900">
                      {formatPercent(row.revenueShare)}
                    </td>
                    <td className="px-2 py-3 text-[13px] text-gray-900">
                      {formatPercent(row.repeatRate)}
                    </td>
                    <td className="px-2 py-3 text-[13px] text-gray-900">{row.avgAmount}</td>
                    <td className="px-2 py-3 text-[13px] text-gray-900">
                      {formatPercent(row.successRate)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[13px] leading-7 text-gray-900">
            ۱٪ برتر مشتریان ۳۱٫۵٪ از درآمد قابل انتساب را می‌سازند. همین تمرکز در صفحه فروش هم دیده
            می‌شود و یک یافته ریسک برای آن ثبت شده است.
          </p>
          <div className="mt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/insights/revenue-concentration')}>
              
              مشاهده یافته تمرکز درآمد
            </Button>
          </div>
        </Card>

        <Card padding="md" elevation="low" className="border-border-light">
          <SectionHeading title="فرصت‌های بهبود نگهداشت مشتری" />
          <ul className="space-y-2.5">
            {retentionOpportunities.map((item) =>
            <li key={item.label} className="rounded-lg bg-gray-50 px-3 py-2.5">
                <p className="text-[13px] font-bold text-gray-950">{item.label}</p>
                <p className="mt-1 text-[12px] leading-6 text-gray-800">{item.detail}</p>
              </li>
            )}
          </ul>
        </Card>

        <section aria-label="تحلیل در دسترس نیست">
          <SectionHeading title="ارزش طول عمر مشتری" />
          <InsufficientDataState
            title="برای این تحلیل داده کافی نداریم."
            description="برای محاسبه ارزش طول عمر، به تاریخچه بلندمدت‌تری از هر مشتری نیاز داریم. بازه فعلی داده سه ماه است."
            coverage={46}
            onAction={() => navigate('/methodology')} />
          
        </section>

        <section aria-label="یافته‌های مرتبط با مشتریان">
          <SectionHeading title="یافته‌های مرتبط با مشتریان" />
          <div className="space-y-4">
            {relatedInsights.map((insight) =>
            <InsightCard key={insight.id} insight={insight} state={states[insight.id]} compact />
            )}
          </div>
        </section>
      </div>
    </div>);

}