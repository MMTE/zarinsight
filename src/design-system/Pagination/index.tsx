import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react';

export type PaginationProps = {
  /** Current page (1-indexed) */
  page: number;
  /** Total number of pages */
  totalPages: number;
  /** Called with the next page number */
  onPageChange: (page: number) => void;
  /** Number of sibling pages shown on each side of the current page */
  siblingCount?: number;
  /** Text direction. In RTL the prev/next arrows are mirrored. */
  dir?: 'rtl' | 'ltr';
  /** Compact size for dense tables */
  size?: 'sm' | 'md';
  /** Disables every control */
  disabled?: boolean;
  /** Accessible label for the nav landmark */
  ariaLabel?: string;
  className?: string;
};

const LABELS = {
  rtl: { prev: 'قبلی', next: 'بعدی', nav: 'صفحه‌بندی', page: 'صفحه' },
  ltr: { prev: 'Previous', next: 'Next', nav: 'Pagination', page: 'Page' }
} as const;

export function getPageRange(
page: number,
totalPages: number,
siblingCount: number)
: Array<number | 'start-ellipsis' | 'end-ellipsis'> {
  const totalNumbers = siblingCount * 2 + 5;
  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const left = Math.max(page - siblingCount, 2);
  const right = Math.min(page + siblingCount, totalPages - 1);

  const items: Array<number | 'start-ellipsis' | 'end-ellipsis'> = [1];
  if (left > 2) items.push('start-ellipsis');
  for (let i = left; i <= right; i += 1) items.push(i);
  if (right < totalPages - 1) items.push('end-ellipsis');
  items.push(totalPages);
  return items;
}

const toPersianDigits = (value: number) =>
String(value).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

export function Pagination({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  dir = 'rtl',
  size = 'md',
  disabled = false,
  ariaLabel,
  className = ''
}: PaginationProps) {
  const isRtl = dir === 'rtl';
  const labels = isRtl ? LABELS.rtl : LABELS.ltr;
  const items = getPageRange(page, Math.max(totalPages, 1), siblingCount);

  const box =
  size === 'sm' ? 'h-8 min-w-8 px-2 text-xs' : 'h-10 min-w-10 px-3 text-sm';
  const base =
  'inline-flex items-center justify-center rounded-lg border font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40';

  const format = (n: number) => isRtl ? toPersianDigits(n) : String(n);

  // In RTL, "previous" points to the right and "next" points to the left.
  const PrevIcon = isRtl ? ChevronRightIcon : ChevronLeftIcon;
  const NextIcon = isRtl ? ChevronLeftIcon : ChevronRightIcon;

  const goTo = (next: number) => {
    if (disabled) return;
    const clamped = Math.min(Math.max(next, 1), Math.max(totalPages, 1));
    if (clamped !== page) onPageChange(clamped);
  };

  return (
    <nav
      dir={dir}
      aria-label={ariaLabel ?? labels.nav}
      className={`flex items-center gap-1.5 ${className}`}>
      
      <button
        type="button"
        onClick={() => goTo(page - 1)}
        disabled={disabled || page <= 1}
        aria-label={labels.prev}
        className={`${base} ${box} gap-1 border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900`}>
        
        <PrevIcon className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} aria-hidden="true" />
        <span className="hidden sm:inline">{labels.prev}</span>
      </button>

      <ul className="flex items-center gap-1.5">
        {items.map((item, index) => {
          if (item === 'start-ellipsis' || item === 'end-ellipsis') {
            return (
              <li key={`${item}-${index}`}>
                <span
                  aria-hidden="true"
                  className={`inline-flex items-center justify-center text-slate-400 ${box}`}>
                  
                  <MoreHorizontalIcon className="h-4 w-4" />
                </span>
              </li>);

          }

          const isActive = item === page;
          return (
            <li key={item}>
              <button
                type="button"
                onClick={() => goTo(item)}
                disabled={disabled}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`${labels.page} ${format(item)}`}
                className={`${base} ${box} ${
                isActive ?
                'border-blue-600 bg-blue-600 text-white hover:bg-blue-700' :
                'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`
                }>
                
                {format(item)}
              </button>
            </li>);

        })}
      </ul>

      <button
        type="button"
        onClick={() => goTo(page + 1)}
        disabled={disabled || page >= totalPages}
        aria-label={labels.next}
        className={`${base} ${box} gap-1 border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900`}>
        
        <span className="hidden sm:inline">{labels.next}</span>
        <NextIcon className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} aria-hidden="true" />
      </button>
    </nav>);

}