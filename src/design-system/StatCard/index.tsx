import React from 'react';
import { TrendingUpIcon, TrendingDownIcon, MinusIcon } from 'lucide-react';

export type StatCardTrendDirection = 'up' | 'down' | 'neutral';

export interface StatCardProps {
  /** Metric label, e.g. "درآمد امروز" */
  label: string;
  /** Numeric amount. Rendered with Persian digits and thousands separators. */
  amount: number;
  /** Currency unit shown in the small chip next to the amount. */
  unit?: string;
  /** Optional trend indicator. */
  trend?: {
    direction: StatCardTrendDirection;
    /** Percentage value, e.g. 12.5 */
    value: number;
    /** Comparison caption, e.g. "نسبت به دیروز" */
    caption?: string;
  };
  /** Optional leading icon rendered in a soft tile. */
  icon?: React.ReactNode;
  /** Shows a skeleton placeholder instead of the value. */
  loading?: boolean;
  className?: string;
}

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

export function formatPersianAmount(amount: number): string {
  return toPersianDigits(new Intl.NumberFormat('en-US').format(amount));
}

const TREND_STYLES: Record<
  StatCardTrendDirection,
  {text: string;bg: string;Icon: typeof TrendingUpIcon;}> =
{
  up: {
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    Icon: TrendingUpIcon
  },
  down: {
    text: 'text-rose-700',
    bg: 'bg-rose-50',
    Icon: TrendingDownIcon
  },
  neutral: {
    text: 'text-slate-600',
    bg: 'bg-slate-100',
    Icon: MinusIcon
  }
};

export function StatCard({
  label,
  amount,
  unit = 'ریال',
  trend,
  icon,
  loading = false,
  className = ''
}: StatCardProps) {
  const trendStyle = trend ? TREND_STYLES[trend.direction] : null;

  return (
    <section
      dir="rtl"
      aria-busy={loading || undefined}
      className={`w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md ${className}`}>
      
      <header className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-medium text-slate-500">{label}</h3>
        {icon ?
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          
            {icon}
          </span> :
        null}
      </header>

      <div className="mt-3 flex items-baseline gap-2">
        {loading ?
        <span className="h-8 w-32 animate-pulse rounded-md bg-slate-200" /> :

        <>
            <span className="text-3xl font-bold leading-none tracking-tight text-slate-900 tabular-nums">
              {formatPersianAmount(amount)}
            </span>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              {unit}
            </span>
          </>
        }
      </div>

      {trend && trendStyle && !loading ?
      <footer className="mt-4 flex items-center gap-2">
          <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${trendStyle.bg} ${trendStyle.text}`}>
          
            <trendStyle.Icon aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="tabular-nums">
              {toPersianDigits(trend.value.toLocaleString('en-US'))}٪
            </span>
          </span>
          {trend.caption ?
        <span className="text-xs text-slate-500">{trend.caption}</span> :
        null}
        </footer> :
      null}
    </section>);

}