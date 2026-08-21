import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { InfoIcon, FilterIcon, FlaskConicalIcon, TriangleAlertIcon } from 'lucide-react';
import { getInsight } from '../../data/insights';
import { prototypeNotice } from '../../data/overview';

export function CoverageNotice({ children }: {children: React.ReactNode;}) {
  return (
    <p className="flex items-start gap-2 rounded-lg border border-alert-warning-border-light bg-alert-warning-bg-light px-3 py-2.5 text-[12px] leading-6 text-alert-warning-text-light">
      <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>);

}

export function CautionNotice({ children }: {children: React.ReactNode;}) {
  return (
    <p className="flex items-start gap-2 rounded-lg border border-alert-danger-border-light bg-alert-danger-bg-light px-3 py-2.5 text-[12px] leading-6 text-alert-danger-text-light">
      <TriangleAlertIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>);

}

export function PrototypeNotice({ className = '' }: {className?: string;}) {
  return (
    <p
      className={`flex items-start gap-2 text-[11px] leading-6 text-gray-600 ${className}`.trim()}>
      
      <FlaskConicalIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{prototypeNotice}</span>
    </p>);

}

/** نوار زمینه‌ای وقتی کاربر از یک یافته وارد گزارش شده است. */
export function InvestigationBar() {
  const [params] = useSearchParams();
  const from = params.get('from');
  if (!from) return null;
  const insight = getInsight(from);
  if (!insight) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-pal-200 bg-pal-50 px-3 py-2.5">
      <p className="flex items-center gap-2 text-[12px] leading-6 text-pal-800">
        <FilterIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          این فیلتر از یک یافته انتخاب شده است: <span className="font-bold">{insight.title}</span>
        </span>
      </p>
      <Link
        to={`/insights/${insight.id}`}
        className="rounded-md px-2 py-1 text-[12px] font-bold text-pal-700 underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600">
        
        بازگشت به یافته
      </Link>
    </div>);

}