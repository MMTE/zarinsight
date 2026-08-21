import React from 'react';
import type { BenchmarkRow } from '../../data/benchmarks';
import { formatNumber, formatPercent, toPersianDigits } from '../../utils/format';

function positionLabel(percentile: number): {label: string;tone: string;} {
  if (percentile >= 75) return { label: 'بالاتر از بیش‌تر کسب‌وکارهای مشابه', tone: 'text-green-700' };
  if (percentile >= 50) return { label: 'کمی بالاتر از میانه', tone: 'text-green-700' };
  if (percentile >= 30) return { label: 'کمی پایین‌تر از میانه', tone: 'text-orange-700' };
  return { label: 'پایین‌تر از بیش‌تر کسب‌وکارهای مشابه', tone: 'text-red-700' };
}

export function BenchmarkTable({ rows }: {rows: BenchmarkRow[];}) {
  return (
    <div className="space-y-4">
      {rows.map((row) => {
        const position = positionLabel(row.percentile);
        const values = [row.you, row.median, row.topQuartile];
        const min = Math.min(...values);
        const max = Math.max(...values);
        const span = max - min || 1;
        const pos = (value: number) => (value - min) / span * 100;
        const format = (value: number) =>
        row.metric === 'میانگین مبلغ پرداخت' ?
        `${formatNumber(value)} هزار تومان` :
        formatPercent(value);

        return (
          <div key={row.metric} className="rounded-lg border border-border-light p-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-[14px] font-bold text-gray-950">{row.metric}</h3>
              <p className={`text-[12px] font-bold ${position.tone}`}>{position.label}</p>
            </div>

            <div className="relative mt-6 h-2 rounded-full bg-gray-100">
              {[
              { value: row.median, label: 'میانه', color: 'bg-gray-500' },
              { value: row.topQuartile, label: '۲۵٪ برتر', color: 'bg-blue-600' }].
              map((mark) =>
              <span
                key={mark.label}
                className="absolute -top-5 -translate-x-1/2 text-[10px] text-gray-700 rtl:translate-x-1/2"
                style={{ insetInlineStart: `${pos(mark.value)}%` }}>
                
                  {mark.label}
                </span>
              )}
              {[
              { value: row.median, color: 'bg-gray-500' },
              { value: row.topQuartile, color: 'bg-blue-600' }].
              map((mark, index) =>
              <span
                key={index}
                className={`absolute top-1/2 h-4 w-1 -translate-y-1/2 rounded-full ${mark.color}`}
                style={{ insetInlineStart: `${pos(mark.value)}%` }}
                aria-hidden="true" />

              )}
              <span
                className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-surface-light bg-pal-600"
                style={{ insetInlineStart: `calc(${pos(row.you)}% - 10px)` }}
                aria-hidden="true" />
              
            </div>

            <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[12px]">
              <div className="flex items-center gap-1.5">
                <dt className="text-gray-700">شما:</dt>
                <dd className="font-bold text-gray-950">{format(row.you)}</dd>
              </div>
              <div className="flex items-center gap-1.5">
                <dt className="text-gray-700">میانه:</dt>
                <dd className="text-gray-900">{format(row.median)}</dd>
              </div>
              <div className="flex items-center gap-1.5">
                <dt className="text-gray-700">۲۵٪ برتر:</dt>
                <dd className="text-gray-900">{format(row.topQuartile)}</dd>
              </div>
              <div className="flex items-center gap-1.5">
                <dt className="text-gray-700">صدک شما:</dt>
                <dd className="text-gray-900">{toPersianDigits(row.percentile)}</dd>
              </div>
            </dl>
            <p className="mt-2 text-[11px] text-gray-600">{row.note}</p>
          </div>);

      })}
    </div>);

}