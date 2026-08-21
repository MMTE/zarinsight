import React from 'react';

export type TransactionStatus = 'success' | 'pending' | 'failed' | 'refunded';

export interface TransactionRow {
  /** Payment / transaction identifier, e.g. "A00000000123456789" */
  id: string;
  /** Jalali (Shamsi) date string, e.g. "۱۴۰۳/۰۵/۲۱" */
  date: string;
  /** Amount in Toman */
  amount: number;
  status: TransactionStatus;
}

export interface TableProps {
  rows: TransactionRow[];
  /** Shown while data is being fetched */
  loading?: boolean;
  /** Error message; replaces the table body when present */
  error?: string;
  /** Shown when there are no rows */
  emptyMessage?: string;
  /** Accessible caption for the table */
  caption?: string;
  /** Currency suffix rendered after the amount */
  currencyLabel?: string;
  onRowClick?: (row: TransactionRow) => void;
  className?: string;
}

const STATUS_LABELS: Record<TransactionStatus, string> = {
  success: 'موفق',
  pending: 'در انتظار',
  failed: 'ناموفق',
  refunded: 'بازگشت وجه'
};

const STATUS_STYLES: Record<TransactionStatus, string> = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  failed: 'bg-red-50 text-red-700 ring-red-600/20',
  refunded: 'bg-slate-100 text-slate-700 ring-slate-500/20'
};

export function StatusPill({ status }: {status: TransactionStatus;}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[status]}`}>
      
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>);

}

export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('fa-IR').format(amount);
}

const CELL = 'px-4 py-3.5 text-right align-middle';

export function Table({
  rows,
  loading = false,
  error,
  emptyMessage = 'تراکنشی یافت نشد.',
  caption = 'فهرست تراکنش‌ها',
  currencyLabel = 'تومان',
  onRowClick,
  className = ''
}: TableProps) {
  const columnCount = 4;
  const interactive = typeof onRowClick === 'function';

  return (
    <div
      dir="rtl"
      className={`w-full overflow-hidden rounded-2xl border border-slate-200 bg-white ${className}`}>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm text-slate-700">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th scope="col" className={`${CELL} text-xs font-semibold text-slate-500`}>
                شناسه پرداخت
              </th>
              <th scope="col" className={`${CELL} text-xs font-semibold text-slate-500`}>
                تاریخ
              </th>
              <th scope="col" className={`${CELL} text-xs font-semibold text-slate-500`}>
                مبلغ
              </th>
              <th scope="col" className={`${CELL} text-xs font-semibold text-slate-500`}>
                وضعیت
              </th>
            </tr>
          </thead>
          <tbody>
            {loading &&
            Array.from({ length: 4 }).map((_, index) =>
            <tr key={`skeleton-${index}`} className="border-b border-slate-100 last:border-0">
                  {Array.from({ length: columnCount }).map((__, cellIndex) =>
              <td key={cellIndex} className={CELL}>
                      <span className="block h-4 w-24 animate-pulse rounded bg-slate-100" />
                    </td>
              )}
                </tr>
            )}

            {!loading && error &&
            <tr>
                <td colSpan={columnCount} className="px-4 py-10 text-center">
                  <p role="alert" className="text-sm font-medium text-red-600">
                    {error}
                  </p>
                </td>
              </tr>
            }

            {!loading && !error && rows.length === 0 &&
            <tr>
                <td colSpan={columnCount} className="px-4 py-10 text-center text-sm text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            }

            {!loading &&
            !error &&
            rows.map((row) =>
            <tr
              key={row.id}
              tabIndex={interactive ? 0 : undefined}
              role={interactive ? 'button' : undefined}
              onClick={interactive ? () => onRowClick?.(row) : undefined}
              onKeyDown={
              interactive ?
              (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onRowClick?.(row);
                }
              } :
              undefined
              }
              className={`border-b border-slate-100 last:border-0 ${
              interactive ?
              'cursor-pointer transition-colors hover:bg-slate-50 focus:outline-none focus-visible:bg-slate-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600' :
              ''}`
              }>
              
                  <td className={`${CELL} font-mono text-xs tracking-tight text-slate-500`}>
                    {row.id}
                  </td>
                  <td className={`${CELL} whitespace-nowrap text-slate-600`}>{row.date}</td>
                  <td className={`${CELL} whitespace-nowrap font-semibold text-slate-900`}>
                    {formatAmount(row.amount)}
                    <span className="mr-1 text-xs font-normal text-slate-500">{currencyLabel}</span>
                  </td>
                  <td className={CELL}>
                    <StatusPill status={row.status} />
                  </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>);

}