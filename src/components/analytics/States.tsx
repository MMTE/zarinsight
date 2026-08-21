import React from 'react';
import { CircleCheckIcon, CircleIcon, DatabaseIcon, TriangleAlertIcon } from 'lucide-react';
import { Card } from '../Card';
import { Button } from '../Button';
import { toPersianDigits } from '../../utils/format';

export function LoadingState({ steps, done = 2 }: {steps: string[];done?: number;}) {
  return (
    <Card padding="md" elevation="flat" className="border-border-light" aria-live="polite">
      <p className="text-[15px] font-bold text-gray-950">در حال بررسی کسب‌وکار شما</p>
      <ul className="mt-3 space-y-2">
        {steps.map((step, index) => {
          const isDone = index < done;
          return (
            <li key={step} className="flex items-center gap-2 text-[13px]">
              {isDone ?
              <CircleCheckIcon className="h-4 w-4 text-green-600" aria-hidden="true" /> :

              <CircleIcon className="h-4 w-4 animate-pulse text-gray-500" aria-hidden="true" />
              }
              <span className={isDone ? 'text-gray-950' : 'text-gray-700'}>{step}</span>
              <span className="sr-only">{isDone ? 'انجام شد' : 'در حال انجام'}</span>
            </li>);

        })}
      </ul>
    </Card>);

}

interface InsufficientDataProps {
  title: string;
  description: string;
  usable?: number;
  required?: number;
  coverage?: number;
  onAction?: () => void;
  actionLabel?: string;
}

export function InsufficientDataState({
  title,
  description,
  usable,
  required,
  coverage,
  onAction,
  actionLabel = 'بررسی روش تحلیل'
}: InsufficientDataProps) {
  return (
    <Card padding="md" elevation="flat" className="border-dashed border-border-strong-light">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
          <DatabaseIcon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[14px] font-bold text-gray-950">{title}</h3>
          <p className="mt-1.5 text-[13px] leading-7 text-gray-800">{description}</p>
          {(typeof usable === 'number' || typeof coverage === 'number') &&
          <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[12px]">
              {typeof usable === 'number' &&
            <div>
                  <dt className="text-gray-700">داده قابل استفاده</dt>
                  <dd className="font-bold text-gray-950">{toPersianDigits(usable)}</dd>
                </div>
            }
              {typeof required === 'number' &&
            <div>
                  <dt className="text-gray-700">حداقل مورد نیاز</dt>
                  <dd className="font-bold text-gray-950">{toPersianDigits(required)}</dd>
                </div>
            }
              {typeof coverage === 'number' &&
            <div>
                  <dt className="text-gray-700">پوشش فعلی</dt>
                  <dd className="font-bold text-gray-950">{toPersianDigits(coverage)}٪</dd>
                </div>
            }
            </dl>
          }
          {onAction &&
          <div className="mt-3">
              <Button size="sm" variant="outline" onClick={onAction}>
                {actionLabel}
              </Button>
            </div>
          }
        </div>
      </div>
    </Card>);

}

export function ErrorState({
  title = 'این یافته فعلاً قابل اتکا نیست.',
  description,
  onAction,
  actionLabel = 'مشاهده محدودیت'





}: {title?: string;description: string;onAction?: () => void;actionLabel?: string;}) {
  return (
    <Card padding="md" elevation="flat" className="border-alert-danger-border-light bg-alert-danger-bg-light">
      <div className="flex items-start gap-3">
        <TriangleAlertIcon
          className="mt-0.5 h-5 w-5 shrink-0 text-alert-danger-text-light"
          aria-hidden="true" />
        
        <div className="min-w-0 flex-1">
          <h3 className="text-[14px] font-bold text-alert-danger-text-light">{title}</h3>
          <p className="mt-1.5 text-[13px] leading-7 text-red-800">{description}</p>
          {onAction &&
          <div className="mt-3">
              <Button size="sm" variant="outline" onClick={onAction}>
                {actionLabel}
              </Button>
            </div>
          }
        </div>
      </div>
    </Card>);

}