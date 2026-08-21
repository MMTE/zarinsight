import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ActivityIcon } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { PageHeader, SectionHeading } from '../components/analytics/PageHeader';
import { MetricCard } from '../components/analytics/MetricCard';
import { InsightCard } from '../components/analytics/InsightCard';
import { LineChart } from '../components/analytics/charts/LineChart';
import { AskBox } from '../components/analytics/AskBox';
import { PrototypeNotice } from '../components/analytics/Notices';
import { useAnalysis } from '../contexts/AnalysisContext';
import { rankedInsights } from '../data/insights';
import {
  biggestChange,
  kpis,
  opportunities,
  opportunityTotal,
  quickQuestions,
  summary,
  trendSeries } from
'../data/overview';
import { formatNumber, formatPercent, formatToman } from '../utils/format';

type TrendMetric = 'revenue' | 'successRate' | 'successCount';

const TREND_METRICS: {value: TrendMetric;label: string;}[] = [
{ value: 'revenue', label: 'درآمد موفق' },
{ value: 'successCount', label: 'تعداد پرداخت موفق' },
{ value: 'successRate', label: 'نرخ موفقیت پرداخت' }];


export function Overview() {
  const navigate = useNavigate();
  const { states, periodLabel } = useAnalysis();
  const [metric, setMetric] = useState<TrendMetric>('revenue');

  const topInsights = rankedInsights.slice(0, 3);
  const formatMetric = (value: number) =>
  metric === 'revenue' ?
  formatToman(value) :
  metric === 'successRate' ?
  formatPercent(value) :
  formatNumber(value);

  return (
    <div className="space-y-6">
      <PageHeader
        title="نمای کلی"
        description={`در ${periodLabel}، ۳ موضوع مهم در داده‌های کسب‌وکار شما دیده شده است.`} />
      

      <Card padding="lg" elevation="low" className="border-pal-200 bg-pal-50">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-[18px] font-bold leading-8 text-gray-950 lg:text-[20px]">
              {summary.headline}
            </p>
            <p className="mt-2 text-[14px] leading-7 text-gray-800">{summary.body}</p>
            <p className="mt-1 text-[14px] font-bold leading-7 text-pal-800">{summary.findings}</p>
          </div>
          <div className="shrink-0">
            <Button
              size="lg"
              onClick={() => navigate('/insights')}
              trailingIcon={<ArrowLeftIcon className="h-4 w-4" />}>
              
              مشاهده یافته‌های مهم
            </Button>
          </div>
        </div>
      </Card>

      <section aria-label="شاخص‌های کلیدی">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {kpis.map((kpi) =>
          <MetricCard
            key={kpi.id}
            label={kpi.label}
            value={kpi.value}
            unit={kpi.unit}
            delta={kpi.delta}
            deltaUnit={kpi.deltaUnit}
            positiveWhen={kpi.positiveWhen}
            note={kpi.note} />

          )}
        </div>
        <PrototypeNotice className="mt-3" />
      </section>

      <Card padding="md" elevation="flat" className="border-border-light">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-700">
              <ActivityIcon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-[14px] font-bold text-gray-950">
                مهم‌ترین تغییر نسبت به دوره قبل
              </h2>
              <p className="mt-1 text-[13px] leading-7 text-gray-800">
                {biggestChange.metric} از {biggestChange.from} به{' '}
                <span className="font-bold text-gray-950">{biggestChange.to}</span> رسیده است.
              </p>
              <p className="text-[11px] text-gray-600">{biggestChange.note}</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/insights/${biggestChange.insightId}`)}>
            
            بررسی این تغییر
          </Button>
        </div>
      </Card>

      <section aria-label="سه یافته مهم">
        <SectionHeading
          title="سه یافته مهم"
          description="ترتیب بر اساس اثر مالی، اطمینان و قابلیت بررسی است."
          action={
          <Button size="sm" variant="ghost" onClick={() => navigate('/insights')}>
              همه یافته‌ها
            </Button>
          } />
        
        <div className="space-y-4">
          {topInsights.map((insight) =>
          <InsightCard key={insight.id} insight={insight} state={states[insight.id]} />
          )}
        </div>
      </section>

      <Card padding="md" elevation="low" className="border-border-light">
        <SectionHeading
          title="فرصت‌های برآوردشده"
          description="این اعداد فرصت برآوردی هستند، نه درآمد قطعی." />
        
        <p className="text-[20px] font-bold text-gray-950">
          مجموع فرصت برآوردی: {formatToman(opportunityTotal)} در ماه
        </p>
        <ul className="mt-4 space-y-2.5">
          {opportunities.map((item) => {
            const share = item.amount / opportunityTotal * 100;
            return (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => navigate(`/insights/${item.insightId}`)}
                  className="w-full rounded-lg p-1.5 text-start transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600">
                  
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[13px] text-gray-900">{item.label}</span>
                    <span className="text-[13px] font-bold text-gray-950">
                      {formatToman(item.amount)}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-green-600"
                      style={{ width: `${share}%` }}
                      aria-hidden="true" />
                    
                  </div>
                </button>
              </li>);

          })}
        </ul>
      </Card>

      <Card padding="md" elevation="low" className="border-border-light">
        <SectionHeading
          title="روند کسب‌وکار"
          description="نقطه‌های رنگی، تغییرهای شناسایی‌شده هستند. روی هرکدام بزنید تا یافته‌اش باز شود."
          action={
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="انتخاب معیار نمودار">
              {TREND_METRICS.map((option) =>
            <button
              key={option.value}
              type="button"
              onClick={() => setMetric(option.value)}
              aria-pressed={metric === option.value}
              className={`min-h-[32px] rounded-lg px-2.5 py-1 text-[12px] font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600 ${
              metric === option.value ?
              'bg-pal-600 text-white' :
              'bg-gray-100 text-gray-800 hover:bg-gray-200'}`
              }>
              
                  {option.label}
                </button>
            )}
            </div>
          } />
        
        <LineChart
          ariaLabel={`روند ${TREND_METRICS.find((item) => item.value === metric)?.label} در بازه انتخاب‌شده`}
          seriesLabel={TREND_METRICS.find((item) => item.value === metric)?.label ?? ''}
          points={trendSeries.map((point) => ({
            label: point.label,
            value: point[metric],
            marker: point.marker
          }))}
          formatValue={formatMetric}
          onMarkerClick={(insightId) => navigate(`/insights/${insightId}`)} />
        
      </Card>

      <AskBox suggestions={quickQuestions} />
    </div>);

}