import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { PageHeader, SectionHeading } from '../components/analytics/PageHeader';
import { MetricCard } from '../components/analytics/MetricCard';
import { InsightCard } from '../components/analytics/InsightCard';
import { BarCompareChart } from '../components/analytics/charts/BarCompareChart';
import { WaterfallChart } from '../components/analytics/charts/WaterfallChart';
import { CoverageNotice, InvestigationBar, PrototypeNotice } from '../components/analytics/Notices';
import { useAnalysis } from '../contexts/AnalysisContext';
import { useLiveInsights } from '../lib/useLiveInsights';
import {
  anomalyNote,
  concentration,
  concentrationNote,
  decomposition,
  decompositionNote,
  revenueByCategory,
  revenueByMerchant,
  salesKpis,
  salesSummary,
  salesTrend } from
'../data/sales';
import { formatNumber, formatPercent, formatToman } from '../utils/format';

export function Sales() {
  const navigate = useNavigate();
  const { states } = useAnalysis();
  const [dimension, setDimension] = useState('customer');
  const [breakdown, setBreakdown] = useState<'category' | 'merchant'>('category');

  const active = concentration.find((item) => item.id === dimension) ?? concentration[0];
  const breakdownRows = breakdown === 'category' ? revenueByCategory : revenueByMerchant;
  const relatedInsights = useLiveInsights('sales');

  return (
    <div>
      <InvestigationBar />
      

      <div className="space-y-6">
        <section aria-label="معیارهای فروش">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {salesKpis.map((kpi) =>
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
          <SectionHeading title="روند درآمد موفق" />
          <p className="mb-4 rounded-lg bg-gray-50 px-3 py-2.5 text-[13px] leading-7 text-gray-900">
            {salesSummary}
          </p>
          <BarCompareChart
            ariaLabel="درآمد موفق هفته‌به‌هفته در برابر دوره قبل"
            seriesLabel="دوره فعلی"
            compareLabel="دوره قبل"
            data={salesTrend.map((week) => ({
              key: week.label,
              value: week.current,
              compare: week.previous,
              highlight: week.anomaly
            }))}
            valueFormatter={formatToman} />
          
          <p className="mt-3 flex items-start gap-2 rounded-lg border border-alert-warning-border-light bg-alert-warning-bg-light px-3 py-2.5 text-[12px] leading-6 text-alert-warning-text-light">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red-600" aria-hidden="true" />
            <span>{anomalyNote}</span>
          </p>
        </Card>

        <Card padding="md" elevation="low" className="border-border-light">
          <SectionHeading
            title="کاهش درآمد از کجا آمده است؟"
            description="اختلاف دو دوره به سه اثر جدا شده است: تعداد پرداخت، نرخ موفقیت و مبلغ پرداخت." />
          
          <WaterfallChart steps={decomposition} />
          <p className="mt-4 text-[13px] font-bold leading-7 text-gray-950">{decompositionNote}</p>
          <div className="mt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/insights/psp08-drop')}>
              
              مشاهده یافته مربوط
            </Button>
          </div>
        </Card>

        <Card padding="md" elevation="low" className="border-border-light">
          <SectionHeading
            title="درآمد به تفکیک"
            action={
            <div className="flex gap-1.5" role="group" aria-label="انتخاب تفکیک درآمد">
                {(
              [
              { value: 'category', label: 'دسته‌بندی' },
              { value: 'merchant', label: 'کسب‌وکار' }] as
              const).
              map((option) =>
              <button
                key={option.value}
                type="button"
                onClick={() => setBreakdown(option.value)}
                aria-pressed={breakdown === option.value}
                className={`min-h-[32px] rounded-lg px-2.5 py-1 text-[12px] font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600 ${
                breakdown === option.value ?
                'bg-pal-600 text-white' :
                'bg-gray-100 text-gray-800 hover:bg-gray-200'}`
                }>
                
                    {option.label}
                  </button>
              )}
              </div>
            } />
          
          <BarCompareChart
            ariaLabel={`درآمد موفق به تفکیک ${breakdown === 'category' ? 'دسته‌بندی' : 'کسب‌وکار'}`}
            data={breakdownRows.map((row) => ({ key: row.key, value: row.value }))}
            valueFormatter={formatToman} />
          
        </Card>

        <Card padding="md" elevation="low" className="border-border-light">
          <SectionHeading
            title="تمرکز درآمد"
            description="چه بخشی از درآمد شما به تعداد کمی از بخش‌ها وابسته است؟"
            action={
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="انتخاب بُعد تمرکز">
                {concentration.map((item) =>
              <button
                key={item.id}
                type="button"
                onClick={() => setDimension(item.id)}
                aria-pressed={dimension === item.id}
                className={`min-h-[32px] rounded-lg px-2.5 py-1 text-[12px] font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600 ${
                dimension === item.id ?
                'bg-pal-600 text-white' :
                'bg-gray-100 text-gray-800 hover:bg-gray-200'}`
                }>
                
                    {item.label}
                  </button>
              )}
              </div>
            } />
          
          <ul className="space-y-3">
            {[
            { label: 'سهم ۱٪ برتر', value: active.top1 },
            { label: 'سهم ۵٪ برتر', value: active.top5 },
            { label: 'سهم ۱۰٪ برتر', value: active.top10 }].
            map((row) =>
            <li key={row.label}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[13px] text-gray-900">{row.label}</span>
                  <span className="text-[13px] font-bold text-gray-950">
                    {formatPercent(row.value)}
                  </span>
                </div>
                <div className="mt-1.5 h-2.5 w-full rounded-full bg-gray-100">
                  <div
                  className="h-2.5 rounded-full bg-pal-600"
                  style={{ width: `${row.value}%` }}
                  aria-hidden="true" />
                
                </div>
              </li>
            )}
          </ul>
          <p className="mt-4 text-[13px] leading-7 text-gray-900">{concentrationNote}</p>
          {active.id === 'customer' &&
          <div className="mt-3">
              <CoverageNotice>{active.note}</CoverageNotice>
            </div>
          }
          <div className="mt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/insights/revenue-concentration')}>
              
              مشاهده یافته تمرکز درآمد
            </Button>
          </div>
        </Card>

        <section aria-label="یافته‌های مرتبط با فروش">
          <SectionHeading title="یافته‌های مرتبط با فروش" />
          <div className="space-y-4">
            {relatedInsights.map((insight) =>
            <InsightCard key={insight.id} insight={insight} state={states[insight.id]} compact />
            )}
          </div>
        </section>
      </div>
    </div>);

}