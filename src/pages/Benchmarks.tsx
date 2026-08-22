import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UsersIcon, ArrowUpRightIcon } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { PageHeader, SectionHeading } from '../components/analytics/PageHeader';
import { BenchmarkTable } from '../components/analytics/BenchmarkTable';
import { PrototypeNotice } from '../components/analytics/Notices';
import { benchmarkNote, gaps, peerGroup as mockPeerGroup, strengths } from '../data/benchmarks';
import { benchmarkRows as mockRows } from '../data/benchmarks';
import type { BenchmarkRow } from '../data/benchmarks';
import { useEffect, useState } from 'react';
import { useAnalysis } from '../contexts/AnalysisContext';
import { formatNumber, formatToman } from '../utils/format';

export function Benchmarks() {
  const navigate = useNavigate();
  const { merchantKey } = useAnalysis();
  const [live, setLive] = useState<BenchmarkRow[] | null>(null);
  const [cohortSize, setCohortSize] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(`/api/benchmarks?merchantKey=${encodeURIComponent(merchantKey)}&metric=success_rate`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('no cohort'))))
      .then((b2) => {
        if (!alive) return;
        setCohortSize(b2.cohortMerchants);
        setLive([{
          metric: 'نرخ موفقیت پرداخت',
          you: Number((b2.merchantValue * 100).toFixed(1)),
          median: Number((b2.median * 100).toFixed(1)),
          topQuartile: Number((b2.q3 * 100).toFixed(1)),
          unit: 'percent',
          percentile: b2.merchantValue < b2.q1 ? 25 : b2.merchantValue < b2.median ? 50 : b2.merchantValue < b2.q3 ? 75 : 90,
          higherIsBetter: true,
          note: `گروه مشابه: ${b2.cohortMerchants} کسب‌وکار`,
        }]);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [merchantKey]);

  const benchmarkRows = live ?? mockRows;
  const peerGroup = { ...mockPeerGroup, size: cohortSize ?? mockPeerGroup.size };
  const totalGap = gaps.reduce((sum, item) => sum + item.impact, 0);

  return (
    <div className="space-y-6">
      
      

      <Card padding="md" elevation="low" className="border-border-light">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            <UsersIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="text-[15px] font-bold text-gray-950">گروه مقایسه شما</h2>
            <p className="mt-1.5 text-[13px] leading-7 text-gray-800">{peerGroup.description}</p>
            <p className="mt-1 text-[13px] font-bold text-gray-950">
              تعداد کسب‌وکارهای این گروه: {formatNumber(peerGroup.size)}
            </p>
          </div>
        </div>

        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {peerGroup.dimensions.map((item) =>
          <div key={item.label} className="rounded-lg bg-gray-50 px-3 py-2.5">
              <dt className="text-[11px] text-gray-700">{item.label}</dt>
              <dd className="mt-1 text-[13px] font-bold text-gray-950">{item.value}</dd>
            </div>
          )}
        </dl>
      </Card>

      <Card padding="md" elevation="low" className="border-border-light">
        <SectionHeading title="جایگاه شما در هر معیار" />
        <BenchmarkTable rows={benchmarkRows} />
        <p className="mt-4 rounded-lg bg-gray-50 px-3 py-2.5 text-[12px] leading-6 text-gray-800">
          {benchmarkNote}
        </p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card padding="md" elevation="flat" className="border-green-200 bg-green-50">
          <SectionHeading title="نقاط قوت" />
          <ul className="space-y-2.5">
            {strengths.map((item) =>
            <li key={item.label} className="rounded-lg bg-surface-light px-3 py-2.5">
                <p className="text-[13px] font-bold text-gray-950">{item.label}</p>
                <p className="mt-1 text-[12px] leading-6 text-gray-800">{item.detail}</p>
              </li>
            )}
          </ul>
        </Card>

        <Card padding="md" elevation="flat" className="border-border-light">
          <SectionHeading title="فاصله‌های قابل بهبود" />
          <ul className="space-y-2.5">
            {gaps.map((item) =>
            <li key={item.label} className="rounded-lg bg-gray-50 px-3 py-2.5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-[13px] font-bold text-gray-950">{item.label}</p>
                  <p className="text-[12px] font-bold text-gray-950">
                    {formatToman(item.impact)} در ماه
                  </p>
                </div>
                <p className="mt-1 text-[12px] leading-6 text-gray-800">{item.detail}</p>
                <button
                type="button"
                onClick={() => navigate(`/insights/${item.insightId}`)}
                className="mt-2 inline-flex items-center gap-1 rounded-md text-[12px] font-bold text-pal-700 underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600">
                
                  <ArrowUpRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  بررسی این فاصله
                </button>
              </li>
            )}
          </ul>
        </Card>
      </div>

      <Card padding="md" elevation="flat" className="border-border-light">
        <SectionHeading title="فرصت ناشی از این فاصله‌ها" />
        <p className="text-[16px] font-bold text-gray-950">
          مجموع فرصت برآوردی: {formatToman(totalGap)} در ماه
        </p>
        <p className="mt-2 text-[13px] leading-7 text-gray-800">
          این عدد نشان می‌دهد اگر فاصله شما با گروه مشابه بسته شود، تقریباً چه مقدار پول درگیر است.
          فرصت برآوردی است، نه درآمد قطعی.
        </p>
        <div className="mt-3">
          <Button size="sm" onClick={() => navigate('/insights')}>
            مشاهده یافته‌های مرتبط
          </Button>
        </div>
      </Card>

      <PrototypeNotice />
    </div>);

}