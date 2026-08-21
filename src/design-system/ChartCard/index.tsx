import React, { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import { AlertCircleIcon, LoaderIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react';

export type ChartCardPoint = {
  /** Label rendered on the x-axis (e.g. a month or day name). */
  label: string;
  /** Numeric value for the series. */
  value: number;
};

export type ChartCardPeriod = {
  /** Stable identifier for the period. */
  id: string;
  /** Short label shown in the segmented selector. */
  label: string;
};

export type ChartCardProps = {
  /** Card heading. */
  title: string;
  /** Optional supporting text under the title. */
  description?: string;
  /** Highlighted summary value (already formatted). */
  value?: string;
  /** Percentage change vs the previous period. Positive renders green, negative red. */
  change?: number;
  /** Periods offered in the header selector. */
  periods?: ChartCardPeriod[];
  /** Controlled selected period id. */
  selectedPeriod?: string;
  /** Uncontrolled initial period id. */
  defaultPeriod?: string;
  /** Fired when the user picks a different period. */
  onPeriodChange?: (periodId: string) => void;
  /** Series rendered in the chart. */
  data: ChartCardPoint[];
  /** Chart style. */
  variant?: 'area' | 'line';
  /** Chart height in pixels. */
  height?: number;
  /** Formats values in the tooltip and y-axis. */
  formatValue?: (value: number) => string;
  /** Shows a loading skeleton instead of the chart. */
  loading?: boolean;
  /** Shows an error state instead of the chart. */
  error?: string;
  className?: string;
};

const DEFAULT_PERIODS: ChartCardPeriod[] = [
{ id: '7d', label: '۷ روز' },
{ id: '30d', label: '۳۰ روز' },
{ id: '12m', label: '۱۲ ماه' }];


export function ChartCard({
  title,
  description,
  value,
  change,
  periods = DEFAULT_PERIODS,
  selectedPeriod,
  defaultPeriod,
  onPeriodChange,
  data,
  variant = 'area',
  height = 260,
  formatValue = (v) => v.toLocaleString('fa-IR'),
  loading = false,
  error,
  className = ''
}: ChartCardProps) {
  const [internalPeriod, setInternalPeriod] = useState(
    defaultPeriod ?? periods[0]?.id ?? ''
  );
  const activePeriod = selectedPeriod ?? internalPeriod;

  const handlePeriod = (id: string) => {
    if (selectedPeriod === undefined) setInternalPeriod(id);
    onPeriodChange?.(id);
  };

  const isPositive = (change ?? 0) >= 0;
  const TrendIcon = isPositive ? TrendingUpIcon : TrendingDownIcon;

  const chart = useMemo(() => {
    const axisProps = {
      stroke: 'var(--gray-500)',
      tickLine: false,
      axisLine: false,
      tick: { fontSize: 12, fill: 'var(--text-muted-light)' }
    } as const;

    const tooltip =
    <Tooltip
      cursor={{ stroke: 'var(--border-strong-light)', strokeWidth: 1 }}
      contentStyle={{
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-xs)',
        fontSize: 12,
        fontFamily: 'var(--font-body)',
        direction: 'rtl'
      }}
      labelStyle={{ color: 'var(--text-secondary-light)' }}
      formatter={(v: number) => [formatValue(v), title]} />;



    if (variant === 'line') {
      return (
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
          <XAxis dataKey="label" {...axisProps} />
          <YAxis width={56} tickFormatter={formatValue} {...axisProps} />
          {tooltip}
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--primary)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: 'var(--primary)' }} />
          
        </LineChart>);

    }

    return (
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="chartCardFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--pal-600)" stopOpacity={0.18} />
            <stop offset="100%" stopColor="var(--pal-600)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
        <XAxis dataKey="label" {...axisProps} />
        <YAxis width={56} tickFormatter={formatValue} {...axisProps} />
        {tooltip}
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--primary)"
          strokeWidth={2}
          fill="url(#chartCardFill)"
          activeDot={{ r: 4, fill: 'var(--primary)' }} />
        
      </AreaChart>);

  }, [data, variant, formatValue, title]);

  return (
    <section
      dir="rtl"
      className={`w-full bg-surface-light border border-border-light rounded-[var(--radius-card)] shadow-xs font-body ${className}`}>
      
      <header className="flex flex-col gap-4 p-4 md:flex-row md:items-start md:justify-between md:p-6">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-text-primary-light">{title}</h3>
          {description ?
          <p className="mt-1 text-sm text-text-muted-light">{description}</p> :
          null}
          {value ?
          <div className="mt-3 flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight text-text-primary-light">
                {value}
              </span>
              {change !== undefined ?
            <span
              className={`inline-flex items-center gap-1 rounded-[var(--radius-badge)] px-2 py-0.5 text-xs font-medium ${
              isPositive ?
              'bg-status-successful-bg text-status-successful-text' :
              'bg-status-failed-bg text-status-failed-text'}`
              }>
              
                  <TrendIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  {`${Math.abs(change).toLocaleString('fa-IR')}٪`}
                </span> :
            null}
            </div> :
          null}
        </div>

        {periods.length > 0 ?
        <div
          role="tablist"
          aria-label="بازه زمانی"
          className="inline-flex shrink-0 items-center gap-1 rounded-[var(--radius-button)] bg-background-light p-1">
          
            {periods.map((period) => {
            const active = period.id === activePeriod;
            return (
              <button
                key={period.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => handlePeriod(period.id)}
                className={`rounded-[var(--radius-sm)] px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                active ?
                'bg-surface-light text-text-primary-light shadow-xs' :
                'text-text-secondary-light hover:text-text-primary-light'}`
                }>
                
                  {period.label}
                </button>);

          })}
          </div> :
        null}
      </header>

      <div className="px-2 pb-4 md:px-4 md:pb-6" style={{ height }}>
        {loading ?
        <div
          className="flex h-full w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-background-light text-sm text-text-muted-light"
          role="status"
          aria-live="polite">
          
            <LoaderIcon className="h-4 w-4 animate-spin" aria-hidden="true" />
            در حال بارگذاری نمودار…
          </div> :
        error ?
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[var(--radius-md)] bg-alert-danger-bg-light text-sm text-alert-danger-text-light"
          role="alert">
          
            <AlertCircleIcon className="h-5 w-5" aria-hidden="true" />
            {error}
          </div> :
        data.length === 0 ?
        <div className="flex h-full w-full items-center justify-center rounded-[var(--radius-md)] bg-background-light text-sm text-text-muted-light">
            داده‌ای برای نمایش وجود ندارد
          </div> :

        <ResponsiveContainer width="100%" height="100%">
            {chart}
          </ResponsiveContainer>
        }
      </div>
    </section>);

}