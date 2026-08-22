import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UsersIcon, ArrowUpRightIcon } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { PageHeader, SectionHeading } from '../components/analytics/PageHeader';
import { BenchmarkTable } from '../components/analytics/BenchmarkTable';
import { PrototypeNotice } from '../components/analytics/Notices';
import { benchmarkNote, gaps as mockGaps, peerGroup as mockPeerGroup, strengths as mockStrengths } from '../data/benchmarks';
import { benchmarkRows as mockRows } from '../data/benchmarks';
import type { BenchmarkRow } from '../data/benchmarks';
import { useAnalysis } from '../contexts/AnalysisContext';
import { api, faIrr, type BenchResponse } from '../lib/api';
import type { Insight as UiInsight } from '../types/analytics';
import { formatNumber, formatToman, toPersianDigits } from '../utils/format';

/** Metric display config for the cached benchmark rows (engine metric ids). */
const METRIC_META: Record<string, { label: string; kind: 'percent' | 'amount'; higherIsBetter: boolean }> = {
  success_rate: { label: 'نرخ موفقیت پرداخت', kind: 'percent', higherIsBetter: true },
  retry_rate: { label: 'نرخ تلاش مجدد', kind: 'percent', higherIsBetter: false },
  avg_success_amount: { label: 'میانگین مبلغ پرداخت', kind: 'amount', higherIsBetter: true },
  returning_session_share: { label: 'سهم مشتریان بازگشتی', kind: 'percent', higherIsBetter: true },
};

/** Published detectors that quantify each gap (impact + deep link). */
const GAP_DETECTOR: Record<string, string> = {
  success_rate: 'I-08',
  retry_rate: 'I-07',
  returning_session_share: 'I-11',
};

function percentileOf(value: number, q1: number, median: number, q3: number): number {
  if (value < q1) return 20;
  if (value < median) return 40;
  if (value < q3) return 65;
  return 85;
}

/** cohort_id = `<category_id>|vol<N>|amt<N>` → quartile labels (ADR-0007). */
function cohortDimensions(cohortId: string): Array<{ label: string; value: string }> {
  const parts = cohortId.split('|');
  const vol = parts[1]?.replace('vol', '') ?? '؟';
  const amt = parts[2]?.replace('amt', '') ?? '؟';
  return [
    { label: 'حجم پرداخت', value: `چارک ${toPersianDigits(vol)} از ۴` },
    { label: 'مبلغ معمول پرداخت', value: `چارک ${toPersianDigits(amt)} از ۴` },
  ];
}

interface LiveBench {
  rows: BenchmarkRow[];
  peerGroup: { description: string; size: number; dimensions: Array<{ label: string; value: string }> };
  strengths: Array<{ label: string; detail: string }>;
  gaps: Array<{ label: string; detail: string; insightId?: string; impact: number }>;
  window: [string, string];
}

function buildLive(bench: BenchResponse, insights: UiInsight[]): LiveBench {
  const byDetector = new Map<string, UiInsight>();
  for (const i of insights) byDetector.set(i.id.split(':')[0], i);

  const rows: BenchmarkRow[] = [];
  const strengths: LiveBench['strengths'] = [];
  const gaps: LiveBench['gaps'] = [];
  for (const r of bench.rows) {
    const meta = METRIC_META[r.metric];
    if (!meta) continue;
    const scale = meta.kind === 'amount' ? (v: number) => v / 10_000_000 : (v: number) => v * 100; // IRR → هزار تومان | rate → ٪
    const you = Number(scale(r.merchantValue).toFixed(1));
    const median = Number(scale(r.median).toFixed(1));
    const q3 = Number(scale(r.q3).toFixed(1));
    rows.push({
      metric: meta.label, you, median, topQuartile: q3, unit: 'percent',
      percentile: percentileOf(r.merchantValue, r.q1, r.median, r.q3),
      higherIsBetter: meta.higherIsBetter,
      note: `گروه مشابه: ${formatNumber(bench.cohortMerchants)} کسب‌وکار`,
    });
    const deltaPp = (r.merchantValue - r.median) * 100;
    const good = meta.higherIsBetter ? deltaPp > 0 : deltaPp < 0;
    if (Math.abs(deltaPp) < 1) continue;                    // within noise of the median
    const detail = meta.kind === 'amount'
      ? `میانگین مبلغ شما ${faIrr(r.merchantValue - r.median)} ${good ? 'بالاتر' : 'پایین‌تر'} از میانهٔ گروه است.`
      : `${formatNumber(Math.abs(deltaPp))} واحد درصد ${good ? 'بهتر' : 'ضعیف‌تر'} از میانهٔ گروه مشابه.`;
    if (good) {
      strengths.push({ label: meta.label, detail });
    } else {
      const det = GAP_DETECTOR[r.metric];
      const linked = det ? byDetector.get(det) : undefined;
      gaps.push({
        label: meta.label, detail,
        insightId: linked?.id,
        impact: linked?.impact ?? 0,
      });
    }
  }
  return {
    rows,
    peerGroup: {
      description: 'مقایسه با کسب‌وکارهایی از همان صنعت با حجم و مبلغ پرداخت نزدیک به شما (ADR-0007).',
      size: bench.cohortMerchants,
      dimensions: [
        { label: 'بازهٔ محاسبه', value: `${bench.window[0]} تا ${bench.window[1]}` },
        ...cohortDimensions(bench.cohortId),
      ],
    },
    strengths,
    gaps,
    window: bench.window,
  };
}

export function Benchmarks() {
  const navigate = useNavigate();
  const { merchantKey } = useAnalysis();
  const [live, setLive] = useState<LiveBench | null>(null);

  useEffect(() => {
    let alive = true;
    setLive(null);
    Promise.all([
      api.benchmarks(merchantKey),
      api.insights(merchantKey === 'portfolio' ? undefined : merchantKey, 50),
    ])
      .then(([bench, insights]) => {
        if (alive) setLive(buildLive(bench, insights));
      })
      .catch(() => { /* mock fallback below (API unreachable) */ });
    return () => { alive = false; };
  }, [merchantKey]);

  const benchmarkRows = live?.rows.length ? live.rows : mockRows;
  const peerGroup = live?.peerGroup ?? mockPeerGroup;
  const strengths = live?.strengths.length ? live.strengths : mockStrengths;
  const gaps = live?.gaps.length ? live.gaps : mockGaps;
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
                  {item.impact > 0 &&
                  <p className="text-[12px] font-bold text-gray-950">
                    {formatToman(item.impact)} در ماه
                  </p>}
                </div>
                <p className="mt-1 text-[12px] leading-6 text-gray-800">{item.detail}</p>
                {item.insightId &&
                <button
                type="button"
                onClick={() => navigate(`/insights/${item.insightId}`)}
                className="mt-2 inline-flex items-center gap-1 rounded-md text-[12px] font-bold text-pal-700 underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600">

                  <ArrowUpRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  بررسی این فاصله
                </button>}
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
          {totalGap === 0 && ' در حال حاضر فاصلهٔ قابل اندازه‌گیری با اثر مالی گزارش نشده است.'}
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
