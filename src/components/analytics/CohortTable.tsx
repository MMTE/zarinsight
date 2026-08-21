import React from 'react';
import type { CohortRow } from '../../data/customers';
import { formatNumber, formatPercent } from '../../utils/format';

interface CohortTableProps {
  rows: CohortRow[];
  columns: string[];
  onSelect?: (cohort: string) => void;
}

function cellStyle(value: number | null): string {
  if (value == null) return 'bg-gray-50 text-gray-500';
  if (value >= 100) return 'bg-pal-600 text-white';
  if (value >= 22) return 'bg-pal-200 text-pal-900';
  if (value >= 14) return 'bg-pal-100 text-pal-800';
  if (value >= 8) return 'bg-pal-50 text-pal-800';
  return 'bg-orange-50 text-orange-800';
}

export function CohortTable({ rows, columns, onSelect }: CohortTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-separate border-spacing-1">
        <caption className="sr-only">نرخ بازگشت مشتریان بر اساس ماه ورود</caption>
        <thead>
          <tr>
            <th scope="col" className="p-2 text-start text-[12px] font-medium text-gray-700">
              ماه ورود
            </th>
            <th scope="col" className="p-2 text-start text-[12px] font-medium text-gray-700">
              تعداد
            </th>
            {columns.map((column) =>
            <th key={column} scope="col" className="p-2 text-[12px] font-medium text-gray-700">
                {column}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) =>
          <tr key={row.cohort}>
              <th scope="row" className="p-2 text-start text-[13px] font-bold text-gray-950">
                {onSelect ?
              <button
                type="button"
                onClick={() => onSelect(row.cohort)}
                className="rounded-md underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600">
                
                    {row.cohort}
                  </button> :

              row.cohort
              }
              </th>
              <td className="p-2 text-[12px] text-gray-800">{formatNumber(row.size)}</td>
              {row.months.map((value, index) =>
            <td key={`${row.cohort}-${columns[index]}`} className="p-0">
                  <div
                className={`rounded-md px-2 py-2.5 text-center text-[12px] font-bold ${cellStyle(value)}`}>
                
                    {value == null ? '—' : formatPercent(value, value >= 100 ? 0 : 1)}
                  </div>
                </td>
            )}
            </tr>
          )}
        </tbody>
      </table>
      <p className="mt-2 text-[11px] text-gray-600">
        خانه‌های خالی یعنی آن ماه هنوز نرسیده است، نه اینکه بازگشتی نبوده.
      </p>
    </div>);

}