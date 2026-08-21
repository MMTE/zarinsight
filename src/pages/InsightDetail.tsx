import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowRightIcon, LightbulbIcon } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { SectionHeading } from '../components/analytics/PageHeader';
import { CategoryBadge, ConfidenceBadge, StateBadge } from '../components/analytics/Badges';
import { ContributionList } from '../components/analytics/ContributionList';
import { DriverTree } from '../components/analytics/DriverTree';
import { EvidencePanel } from '../components/analytics/EvidencePanel';
import { MethodologyPanel } from '../components/analytics/MethodologyPanel';
import { ImpactCard } from '../components/analytics/ImpactCard';
import { LineChart } from '../components/analytics/charts/LineChart';
import { CoverageNotice } from '../components/analytics/Notices';
import { useAnalysis } from '../contexts/AnalysisContext';
import { getInsight } from '../data/insights';
import { formatNumber, formatPercent } from '../utils/format';
import type { InsightState } from '../types/analytics';

const STATUS_ACTIONS: {value: InsightState;label: string;}[] = [
{ value: 'investigating', label: 'در حال بررسی' },
{ value: 'reviewed', label: 'بررسی‌شده' },
{ value: 'dismissed', label: 'نادیده گرفتن' }];


export function InsightDetail() {
  const { insightId = '' } = useParams();
  const navigate = useNavigate();
  const { states, setInsightState } = useAnalysis();
  const insight = getInsight(insightId);

  useEffect(() => {
    if (window.location.hash === '#evidence') {
      document.getElementById('evidence')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [insightId]);

  if (!insight) {
    return (
      <Card padding="lg" elevation="flat" className="border-border-light">
        <p className="text-[14px] text-gray-900">این یافته پیدا نشد.</p>
        <div className="mt-3">
          <Button size="sm" onClick={() => navigate('/insights')}>
            بازگشت به یافته‌ها
          </Button>
        </div>
      </Card>);

  }

  const state = states[insight.id] ?? insight.defaultState;
  const formatChart = (value: number) =>
  insight.chartUnit === 'percent' ?
  formatPercent(value) :
  insight.chartUnit === 'second' ?
  `${formatNumber(value, 1)} ثانیه` :
  formatNumber(value);

  return (
    <div className="space-y-5">
      <Link
        to="/insights"
        className="inline-flex items-center gap-1.5 rounded-md text-[13px] font-medium text-gray-700 underline-offset-4 hover:text-gray-950 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600">
        
        <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
        بازگشت به یافته‌ها
      </Link>

      <header>
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge category={insight.category} />
          <StateBadge state={state} />
          <ConfidenceBadge confidence={insight.confidence} reasons={insight.confidenceReasons} />
          <span className="text-[11px] text-gray-600">شناسایی: {insight.detectedOn}</span>
        </div>
        <h1 className="mt-3 text-[20px] font-bold leading-9 text-gray-950 lg:text-[24px]">
          {insight.title}
        </h1>
        <p className="mt-2 max-w-3xl text-[13px] leading-7 text-gray-800">{insight.summary}</p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Card padding="sm" elevation="flat" className="border-border-light">
            <p className="text-[12px] text-gray-700">{insight.primary.label}</p>
            <p className="mt-1.5 text-[24px] font-bold leading-none text-gray-950">
              {insight.primary.value}
            </p>
          </Card>
          <Card padding="sm" elevation="flat" className="border-border-light">
            <p className="text-[12px] text-gray-700">{insight.comparison.label}</p>
            <p className="mt-1.5 text-[24px] font-bold leading-none text-gray-700">
              {insight.comparison.value}
            </p>
          </Card>
          {insight.gap &&
          <Card padding="sm" elevation="flat" className="border-border-light">
              <p className="text-[12px] text-gray-700">فاصله</p>
              <p className="mt-1.5 text-[24px] font-bold leading-none text-gray-950">
                {insight.gap}
              </p>
            </Card>
          }
        </div>
      </header>

      {insight.caveat && <CoverageNotice>{insight.caveat}</CoverageNotice>}

      <Card padding="md" elevation="low" className="border-border-light">
        <SectionHeading title="چه اتفاقی افتاده است؟" />
        <div className="space-y-2">
          {insight.whatHappened.map((line) =>
          <p key={line} className="text-[13px] leading-7 text-gray-900">
              {line}
            </p>
          )}
        </div>
        <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2.5 text-[13px] leading-7 text-gray-900">
          <span className="font-bold">چقدر تغییر کرده: </span>
          {insight.howMuchChanged}
        </p>
        <div className="mt-4 border-t border-border-light pt-4">
          <LineChart
            ariaLabel={`روند ${insight.title}`}
            seriesLabel="دوره فعلی"
            compareLabel="دوره مقایسه"
            points={insight.chart.map((point) => ({
              label: point.label,
              value: point.current,
              compare: point.previous
            }))}
            formatValue={formatChart}
            height={200} />
          
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card padding="md" elevation="low" className="border-border-light">
          <SectionHeading
            title="بیش‌ترین سهم در این تغییر"
            description="روی هر مورد بزنید تا گزارش مربوط به آن باز شود." />
          
          <ContributionList items={insight.contributions} />
        </Card>

        <Card padding="md" elevation="low" className="border-border-light">
          <SectionHeading title="این تغییر با چه چیزهایی همراه است؟" />
          <DriverTree root={insight.drivers} />
        </Card>
      </div>

      <Card padding="md" elevation="flat" className="border-border-light">
        <SectionHeading title="مقایسه با وضعیت معمول و گروه مشابه" />
        <p className="text-[13px] leading-7 text-gray-900">{insight.peerComparison}</p>
        <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2.5 text-[13px] leading-7 text-gray-900">
          <span className="font-bold">تفسیر: </span>
          {insight.interpretation}
        </p>
      </Card>

      {insight.impact > 0 ?
      <ImpactCard
        amount={insight.impact}
        range={insight.impactRange}
        basis="این عدد بر اساس فاصله عملکرد فعلی با گروه مقایسه‌ای محاسبه شده است." /> :


      <Card padding="md" elevation="flat" className="border-border-light">
          <SectionHeading title="اثر مالی" />
          <p className="text-[13px] leading-7 text-gray-900">
            برای این یافته اثر مالی مستقیمی برآورد نکرده‌ایم، چون رابطه روشنی بین این تغییر و مبلغ
            پرداخت‌ها در داده دیده نمی‌شود.
          </p>
        </Card>
      }

      <Card padding="md" elevation="low" className="border-e-4 border-e-pal-600 border-border-light">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pal-50 text-pal-700">
            <LightbulbIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-[15px] font-bold text-gray-950">پیشنهاد برای بررسی</h2>
            <p className="mt-1.5 text-[13px] leading-7 text-gray-900">{insight.recommendation}</p>
            <p className="mt-2 text-[11px] leading-6 text-gray-700">
              این بخش پیشنهاد بررسی است، نه نتیجه تحلیل. تصمیم نهایی با شماست.
            </p>
            <div className="mt-3">
              <Button size="sm" onClick={() => navigate(insight.investigateTo)}>
                {insight.investigateLabel}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <EvidencePanel evidence={insight.evidence} />
      <MethodologyPanel methodology={insight.methodology} />

      <Card padding="md" elevation="flat" className="border-border-light">
        <SectionHeading
          title="وضعیت این یافته"
          description="وضعیت «حل‌شده» نداریم، چون رفع مشکل با داده فعلی قابل تأیید نیست." />
        
        <div className="flex flex-wrap gap-2">
          {STATUS_ACTIONS.map((action) =>
          <Button
            key={action.value}
            size="sm"
            variant={state === action.value ? 'primary' : 'outline'}
            onClick={() => setInsightState(insight.id, action.value)}>
            
              {action.label}
            </Button>
          )}
        </div>
      </Card>
    </div>);

}