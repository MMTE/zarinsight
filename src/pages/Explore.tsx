import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Select } from '../components/Select';
import { PageHeader, SectionHeading } from '../components/analytics/PageHeader';
import { BarCompareChart } from '../components/analytics/charts/BarCompareChart';
import { InvestigationBar, PrototypeNotice } from '../components/analytics/Notices';
import {
  categoryFilterOptions,
  dimensionOptions,
  exploreData,
  metricOptions,
  relatedInsightByDimension,
  templates } from
'../data/explore';
import { periodOptions } from '../data/overview';
import { getInsight } from '../data/insights';
import { useAnalysis } from '../contexts/AnalysisContext';
import { formatNumber, formatPercent, formatToman } from '../utils/format';

type MetricKey = 'successRate' | 'revenue' | 'count' | 'avgAmount';

export function Explore() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { period, setPeriod } = useAnalysis();
  const [metric, setMetric] = useState<MetricKey>('successRate');
  const [dimension, setDimension] = useState('psp');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const template = params.get('template');
    if (template === 'amount') {
      setDimension('amount');
      setMetric('successRate');
    }
  }, [params]);

  const rows = exploreData[dimension] ?? [];
  const metricLabel = metricOptions.find((item) => item.value === metric)?.label ?? '';
  const dimensionLabel = dimensionOptions.find((item) => item.value === dimension)?.label ?? '';
  const relatedInsight = getInsight(relatedInsightByDimension[dimension] ?? '');

  const formatMetric = (value: number) => {
    if (metric === 'successRate') return formatPercent(value);
    if (metric === 'count') return formatNumber(value);
    return formatToman(value);
  };

  const summary = useMemo(() => {
    if (rows.length === 0) return '';
    const sorted = [...rows].sort((a, b) => b[metric] - a[metric]);
    const best = sorted[0];
    const worst = sorted[sorted.length - 1];
    return `بیش‌ترین مقدار «${metricLabel}» در ${best.key} دیده می‌شود (${formatMetric(best[metric])}) و کم‌ترین در ${worst.key} (${formatMetric(worst[metric])}).`;
  }, [rows, metric, metricLabel]);

  return (
    <div>
      <InvestigationBar />
      <PageHeader
        title="بررسی داده‌ها"
        description="اگر می‌خواهید خودتان چیزی را بررسی کنید، از اینجا شروع کنید." />
      

      <div className="space-y-6">
        <Card padding="md" elevation="low" className="border-border-light">
          <SectionHeading title="چه چیزی را می‌خواهید بررسی کنید؟" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Select
              label="معیار"
              value={metric}
              onChange={(event) => setMetric(event.target.value as MetricKey)}
              options={metricOptions}
              size="sm"
              fullWidth />
            
            <Select
              label="بر اساس"
              value={dimension}
              onChange={(event) => setDimension(event.target.value)}
              options={dimensionOptions}
              size="sm"
              fullWidth />
            
            <Select
              label="دسته‌بندی"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              options={categoryFilterOptions}
              size="sm"
              fullWidth />
            
            <Select
              label="بازه زمانی"
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              options={periodOptions}
              size="sm"
              fullWidth />
            
          </div>

          <div className="mt-4">
            <p className="mb-2 text-[12px] font-medium text-gray-700">بررسی‌های آماده</p>
            <ul className="flex flex-wrap gap-2">
              {templates.map((template) =>
              <li key={template.id}>
                  <button
                  type="button"
                  onClick={() => {
                    setMetric(template.metric as MetricKey);
                    setDimension(template.dimension);
                  }}
                  className="min-h-[34px] rounded-full border border-border-strong-light bg-surface-light px-3 py-1.5 text-[12px] text-gray-900 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600">
                  
                    {template.label}
                  </button>
                </li>
              )}
            </ul>
          </div>
        </Card>

        <Card padding="md" elevation="low" className="border-border-light">
          <SectionHeading title={`${metricLabel} بر اساس ${dimensionLabel}`} />
          <p className="mb-4 rounded-lg bg-gray-50 px-3 py-2.5 text-[13px] leading-7 text-gray-900">
            {summary}
          </p>
          <BarCompareChart
            ariaLabel={`${metricLabel} بر اساس ${dimensionLabel}`}
            data={rows.map((row) => ({ key: row.key, value: row[metric] }))}
            valueFormatter={formatMetric} />
          

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse">
              <caption className="sr-only">
                {metricLabel} بر اساس {dimensionLabel}
              </caption>
              <thead>
                <tr className="border-b border-border-light text-[12px] text-gray-700">
                  {[dimensionLabel, 'نرخ موفقیت', 'درآمد موفق', 'تعداد پرداخت', 'میانگین مبلغ'].map(
                    (head) =>
                    <th key={head} scope="col" className="px-2 py-2.5 text-start font-medium">
                        {head}
                      </th>

                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) =>
                <tr key={row.key} className="border-b border-border-light last:border-b-0">
                    <th scope="row" className="px-2 py-3 text-start text-[13px] font-bold text-gray-950">
                      {row.key}
                    </th>
                    <td className="px-2 py-3 text-[13px] text-gray-900">
                      {formatPercent(row.successRate)}
                    </td>
                    <td className="px-2 py-3 text-[13px] text-gray-900">{formatToman(row.revenue)}</td>
                    <td className="px-2 py-3 text-[13px] text-gray-900">{formatNumber(row.count)}</td>
                    <td className="px-2 py-3 text-[13px] text-gray-900">
                      {formatToman(row.avgAmount)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {relatedInsight &&
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-gray-50 px-3 py-2.5">
              <p className="text-[12px] leading-6 text-gray-800">
                یافته مرتبط با این نما: <span className="font-bold">{relatedInsight.title}</span>
              </p>
              <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/insights/${relatedInsight.id}`)}>
              
                مشاهده یافته
              </Button>
            </div>
          }
        </Card>

        <PrototypeNotice />
      </div>
    </div>);

}