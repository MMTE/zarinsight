import React from 'react';
import { ChevronLeftIcon, HomeIcon, MoreHorizontalIcon } from 'lucide-react';

export type BreadcrumbItem = {
  /** Visible label (Persian or English). */
  label: string;
  /** Optional link target. Omit for the current page. */
  href?: string;
  /** Optional click handler, used for client-side routing. */
  onClick?: () => void;
};

export type BreadcrumbsProps = {
  /** Ordered trail, from root to current page. */
  items: BreadcrumbItem[];
  /** Show a home icon before the first item. */
  showHomeIcon?: boolean;
  /** Collapse the middle of long trails behind an ellipsis. */
  maxItems?: number;
  /** Accessible label for the nav landmark. */
  ariaLabel?: string;
  className?: string;
};

const ELLIPSIS = '__ellipsis__';

export function collapseItems(
items: BreadcrumbItem[],
maxItems?: number)
: Array<BreadcrumbItem | typeof ELLIPSIS> {
  if (!maxItems || maxItems < 2 || items.length <= maxItems) return items;
  return [items[0], ELLIPSIS, ...items.slice(items.length - (maxItems - 1))];
}

export function Breadcrumbs({
  items,
  showHomeIcon = false,
  maxItems,
  ariaLabel = 'مسیر صفحه',
  className = ''
}: BreadcrumbsProps) {
  if (items.length === 0) return null;

  const rendered = collapseItems(items, maxItems);
  const lastIndex = rendered.length - 1;

  return (
    <nav dir="rtl" aria-label={ariaLabel} className={className}>
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm leading-6">
        {rendered.map((entry, index) => {
          const isLast = index === lastIndex;

          if (entry === ELLIPSIS) {
            return (
              <li key="ellipsis" className="flex items-center gap-x-1">
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400"
                  aria-hidden="true">
                  
                  <MoreHorizontalIcon className="h-4 w-4" />
                </span>
                <span className="sr-only">موارد بیشتر</span>
                <Separator />
              </li>);

          }

          const isInteractive = !isLast && (entry.href || entry.onClick);

          return (
            <li key={`${entry.label}-${index}`} className="flex items-center gap-x-1">
              {isInteractive ?
              <a
                href={entry.href ?? '#'}
                onClick={
                entry.onClick ?
                (event) => {
                  event.preventDefault();
                  entry.onClick?.();
                } :
                undefined
                }
                className="flex items-center gap-x-1.5 rounded-md px-1.5 py-0.5 text-slate-500 transition-colors hover:text-blue-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
                
                  {index === 0 && showHomeIcon ?
                <HomeIcon className="h-4 w-4 shrink-0" aria-hidden="true" /> :
                null}
                  <span className="max-w-[12rem] truncate">{entry.label}</span>
                </a> :

              <span
                aria-current={isLast ? 'page' : undefined}
                className={`flex items-center gap-x-1.5 px-1.5 py-0.5 ${
                isLast ? 'font-semibold text-slate-900' : 'text-slate-500'}`
                }>
                
                  {index === 0 && showHomeIcon ?
                <HomeIcon className="h-4 w-4 shrink-0" aria-hidden="true" /> :
                null}
                  <span className="max-w-[16rem] truncate">{entry.label}</span>
                </span>
              }
              {!isLast ? <Separator /> : null}
            </li>);

        })}
      </ol>
    </nav>);

}

function Separator() {
  return (
    <ChevronLeftIcon
      className="h-4 w-4 shrink-0 text-slate-300"
      aria-hidden="true"
      focusable="false" />);


}