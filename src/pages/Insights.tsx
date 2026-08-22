import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { PageHeader, SectionHeading } from '../components/analytics/PageHeader';
import { InsightCard } from '../components/analytics/InsightCard';
import { PrototypeNotice } from '../components/analytics/Notices';
import { useAnalysis } from '../contexts/AnalysisContext';
import {
  categoryLabels,
  discardedSignals,
  rankedInsights,
  topicLabels } from
'../data/insights';
import { api, toUiInsight } from '../lib/api';
import type { Insight as UiInsight } from '../types/analytics';
import type { InsightCategory, InsightTopic } from '../types/analytics';
import { formatToman } from '../utils/format';

const CATEGORY_FILTERS: {value: 'all' | InsightCategory;label: string;}[] = [
{ value: 'all', label: 'همه' },
{ value: 'opportunity', label: categoryLabels.opportunity + 'ها' },
{ value: 'risk', label: categoryLabels.risk + 'ها' },
{ value: 'change', label: categoryLabels.change + 'ها' },
{ value: 'trend', label: categoryLabels.trend + 'ها' },
{ value: 'positive', label: categoryLabels.positive }];


const TOPIC_FILTERS: {value: 'all' | InsightTopic;label: string;}[] = [
{ value: 'all', label: 'همه موضوع‌ها' },
{ value: 'sales', label: topicLabels.sales },
{ value: 'payment', label: topicLabels.payment },
{ value: 'customer', label: topicLabels.customer },
{ value: 'psp', label: topicLabels.psp },
{ value: 'time', label: topicLabels.time }];


function FilterRow<T extends string>({
  label,
  options,
  value,
  onChange





}: {label: string;options: {value: T;label: string;}[];value: T;onChange: (value: T) => void;}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={label}>
      {options.map((option) =>
      <button
        key={option.value}
        type="button"
        onClick={() => onChange(option.value)}
        aria-pressed={value === option.value}
        className={`min-h-[34px] rounded-full px-3 py-1.5 text-[12px] font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600 ${
        value === option.value ?
        'bg-gray-950 text-gray-50' :
        'border border-border-strong-light bg-surface-light text-gray-800 hover:bg-gray-100'}`
        }>
        
          {option.label}
        </button>
      )}
    </div>);

}

export function Insights() {
  const { states, merchantKey } = useAnalysis();
  const [category, setCategory] = useState<'all' | InsightCategory>('all');
  const [topic, setTopic] = useState<'all' | InsightTopic>('all');
  const [live, setLive] = useState<UiInsight[] | null>(null);

  useEffect(() => {
    let alive = true;
    api.insights(merchantKey).then((rows) => {
      if (alive) setLive(rows.map(toUiInsight));
    }).catch(() => { /* mock fallback */ });
    return () => { alive = false; };
  }, [merchantKey]);

  const pool = live ?? rankedInsights;
  const filtered = useMemo(
    () =>
    pool.filter(
      (insight) =>
      (category === 'all' || insight.category === category) && (
      topic === 'all' || insight.topic === topic)
    ),
    [pool, category, topic]
  );

  const totalImpact = filtered.reduce((sum, insight) => sum + insight.impact, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="بینش‌های مهم"
        description="مهم‌ترین تغییرها، فرصت‌ها و ریسک‌هایی که در داده‌های شما پیدا شده‌اند." />
      

      <Card padding="md" elevation="flat" className="border-border-light">
        <div className="space-y-3">
          <FilterRow label="دسته یافته" options={CATEGORY_FILTERS} value={category} onChange={setCategory} />
          <FilterRow label="موضوع" options={TOPIC_FILTERS} value={topic} onChange={setTopic} />
        </div>
        <p className="mt-3 text-[12px] leading-6 text-gray-700">
          ترتیب نمایش بر اساس اثر مالی، اطمینان، فوریت و قابلیت بررسی است، نه فقط تازگی.
          {totalImpact > 0 &&
          <>
              {' '}
              مجموع اثر مالی این فهرست:{' '}
              <span className="font-bold text-gray-950">{formatToman(totalImpact)} در ماه</span>.
            </>
          }
        </p>
      </Card>

      {filtered.length === 0 ?
      <EmptyState
        title="یافته‌ای با این فیلترها نداریم"
        description="فیلترها را ساده‌تر کنید تا یافته‌های بیش‌تری ببینید."
        bordered
        action={{
          label: 'برداشتن فیلترها',
          onClick: () => {
            setCategory('all');
            setTopic('all');
          }
        }} /> :


      <div className="space-y-4">
          {filtered.map((insight) =>
        <InsightCard key={insight.id} insight={insight} state={states[insight.id]} />
        )}
        </div>
      }

      <Card padding="md" elevation="flat" className="border-border-light">
        <SectionHeading
          title="سرنخ‌هایی که منتشر نشدند"
          description="هر تغییری یافته نمی‌شود. این موارد از فیلتر کیفیت رد نشده‌اند." />
        
        <ul className="space-y-2">
          {discardedSignals.map((item) =>
          <li key={item.title} className="rounded-lg bg-gray-50 px-3 py-2.5">
              <p className="text-[13px] font-bold text-gray-950">{item.title}</p>
              <p className="mt-0.5 text-[12px] leading-6 text-gray-700">{item.reason}</p>
            </li>
          )}
        </ul>
      </Card>

      <PrototypeNotice />
    </div>);

}