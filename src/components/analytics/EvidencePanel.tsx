import React, { useState } from 'react';
import { ChevronDownIcon, ScrollTextIcon } from 'lucide-react';
import { Card } from '../Card';
import { Button } from '../Button';
import type { Evidence } from '../../types/analytics';
import { formatNumber } from '../../utils/format';

export function EvidencePanel({ evidence }: {evidence: Evidence;}) {
  const [open, setOpen] = useState(false);
  const [showCalculation, setShowCalculation] = useState(false);

  return (
    <Card padding="none" elevation="low" className="border-border-light" id="evidence">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 p-4 text-start focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600">
        
        <span className="flex items-center gap-2">
          <ScrollTextIcon className="h-5 w-5 text-gray-700" aria-hidden="true" />
          <span className="text-[15px] font-bold text-gray-950">چطور به این نتیجه رسیدیم؟</span>
        </span>
        <ChevronDownIcon
          className={`h-5 w-5 shrink-0 text-gray-700 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true" />
        
      </button>

      {open &&
      <div className="border-t border-border-light p-4">
          <dl className="grid gap-3 sm:grid-cols-2">
            {evidence.rows.map((row) =>
          <div key={row.label} className="rounded-lg bg-gray-50 px-3 py-2.5">
                <dt className="text-[11px] text-gray-700">{row.label}</dt>
                <dd className="mt-1 text-[14px] font-bold text-gray-950">{row.value}</dd>
                {row.note && <p className="mt-0.5 text-[11px] text-gray-600">{row.note}</p>}
              </div>
          )}
          </dl>

          <dl className="mt-4 space-y-2 text-[12px] leading-6">
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-gray-700">جامعه داده:</dt>
              <dd className="text-gray-950">{evidence.population}</dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-gray-700">بازه زمانی:</dt>
              <dd className="text-gray-950">{evidence.period}</dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-gray-700">رکوردهای کنارگذاشته‌شده:</dt>
              <dd className="text-gray-950">
                {formatNumber(evidence.excludedRecords)} — {evidence.excludedReason}
              </dd>
            </div>
          </dl>

          <p className="mt-4 rounded-lg border border-alert-warning-border-light bg-alert-warning-bg-light px-3 py-2.5 text-[12px] leading-6 text-alert-warning-text-light">
            محدودیت: {evidence.limitation}
          </p>

          <div className="mt-4">
            <Button
            size="sm"
            variant="outline"
            onClick={() => setShowCalculation((prev) => !prev)}
            aria-expanded={showCalculation}>
            
              {showCalculation ? 'بستن محاسبه' : 'مشاهده محاسبه'}
            </Button>
          </div>

          {showCalculation &&
        <div className="mt-3 rounded-lg border border-border-light p-3">
              <p className="text-[12px] font-bold text-gray-950">فرمول</p>
              <p className="mt-1 text-[12px] leading-7 text-gray-800">{evidence.formula}</p>
              <ol className="mt-3 space-y-1.5">
                {evidence.steps.map((step) =>
            <li
              key={step.label}
              className="flex items-baseline justify-between gap-3 border-b border-border-light pb-1.5 text-[12px] last:border-b-0">
              
                    <span className="text-gray-800">{step.label}</span>
                    <span className="font-bold text-gray-950">{step.value}</span>
                  </li>
            )}
              </ol>
            </div>
        }
        </div>
      }
    </Card>);

}