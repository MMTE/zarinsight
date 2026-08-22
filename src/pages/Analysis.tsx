import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../components/analytics/PageHeader';
import { Sales } from './Sales';
import { Customers } from './Customers';
import { Payments } from './Payments';
import { Benchmarks } from './Benchmarks';

const TABS = [
  { key: 'sales', label: 'فروش', Component: Sales },
  { key: 'customers', label: 'مشتریان', Component: Customers },
  { key: 'payments', label: 'پرداخت', Component: Payments },
  { key: 'benchmarks', label: 'مقایسه', Component: Benchmarks },
] as const;

/** One analysis surface, four lenses — فروش، مشتری، پرداخت، مقایسه با گروه مشابه. */
export function Analysis() {
  const { tab } = useParams();
  const navigate = useNavigate();
  const active = TABS.find((t) => t.key === tab) ?? TABS[0];

  return (
    <div className="space-y-6">
      <PageHeader title="تحلیل" description="همان دادهٔ داشبورد، این‌بار برش‌خورده." />
      <div role="tablist" aria-label="برش‌های تحلیل" className="flex flex-wrap gap-2">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active.key === key}
            onClick={() => navigate(`/analysis/${key}`)}
            className={`rounded-full px-4 py-2 text-[13px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600 ${
              active.key === key
                ? 'bg-pal-600 text-white'
                : 'border border-border-light bg-white text-gray-700 hover:border-pal-400'}`}>
            {label}
          </button>
        ))}
      </div>
      <active.Component />
    </div>
  );
}
