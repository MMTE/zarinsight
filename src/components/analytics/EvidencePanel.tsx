import React, { useState } from 'react';
import { ChevronDownIcon, ScrollTextIcon } from 'lucide-react';
import { Card } from '../Card';
import { Button } from '../Button';
import type { Evidence } from '../../types/analytics';
import type { SegmentFilter } from '../../lib/types';
import type { RecordsPage } from '../../lib/api';
import { faIrr } from '../../lib/api';
import { formatNumber } from '../../utils/format';

interface EvidencePanelProps {
  evidence: Evidence;
  sql?: string;
  filter?: SegmentFilter;
  records?: RecordsPage | null;
}

const STATUS_FA: Record<string, string> = {
  success: 'موفق', failed: 'ناموفق', captured_unverified: 'برداشت تاییدنشده',
  inbank: 'در بانک', noattempt: 'بدون تلاش',
};

function filterRows(filter: SegmentFilter) {
  const rows: Array<{ label: string; value: string }> = [
    { label: 'بازهٔ زمانی', value: `${filter.dateRange[0]} تا ${filter.dateRange[1]}` },
  ];
  if (filter.merchantKeys?.length) {
    rows.push({ label: 'پذیرنده', value: filter.merchantKeys.length === 1
      ? filter.merchantKeys[0] : `${formatNumber(filter.merchantKeys.length)} پذیرنده` });
  }
  if (filter.statuses?.length) {
    rows.push({ label: 'وضعیت‌ها', value: filter.statuses.map((s) => STATUS_FA[s] ?? s).join('، ') });
  }
  if (filter.pspCodes?.length) rows.push({ label: 'مسیرهای پرداخت', value: filter.pspCodes.join('، ') });
  if (filter.amountBand) rows.push({ label: 'بازهٔ مبلغ', value: filter.amountBand });
  if (filter.hourOfDay) rows.push({ label: 'بازهٔ ساعت', value: `${filter.hourOfDay[0]} تا ${filter.hourOfDay[1]}` });
  if (filter.cardRepeat) rows.push({ label: 'نوع مشتری', value: filter.cardRepeat === 'new' ? 'جدید' : 'بازگشتی' });
  return rows;
}

export function EvidencePanel({ evidence, sql, filter, records }: EvidencePanelProps) {
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

          {filter &&
          <div className="mt-4">
              <p className="text-[12px] font-bold text-gray-950">فیلتر جامعه (قابل بازتولید)</p>
              <dl className="mt-2 grid gap-2 sm:grid-cols-2">
                {filterRows(filter).map((row) =>
              <div key={row.label} className="rounded-lg border border-border-light px-3 py-2">
                    <dt className="text-[11px] text-gray-700">{row.label}</dt>
                    <dd className="mt-0.5 text-[12px] font-bold text-gray-950" dir="auto">{row.value}</dd>
                  </div>
            )}
              </dl>
            </div>
          }

          {sql &&
          <div className="mt-4">
              <p className="text-[12px] font-bold text-gray-950">پرس‌وجوی تولیدکننده</p>
              <pre
              dir="ltr"
              className="mt-2 overflow-x-auto rounded-lg bg-gray-900 px-3 py-2.5 text-[11px] leading-6 text-gray-50">
                {sql}
              </pre>
            </div>
          }

          {records && records.rows.length > 0 &&
          <div className="mt-4">
              <p className="text-[12px] font-bold text-gray-950">
                نمونهٔ ردیف‌های واجد شرایط ({formatNumber(records.total)} ردیف در کل)
              </p>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full text-[11px] leading-6">
                  <thead>
                    <tr className="border-b border-border-light text-gray-700">
                      <th scope="col" className="px-2 py-1.5 text-start font-bold">تاریخ</th>
                      <th scope="col" className="px-2 py-1.5 text-start font-bold">شناسهٔ جلسه</th>
                      <th scope="col" className="px-2 py-1.5 text-start font-bold">مبلغ</th>
                      <th scope="col" className="px-2 py-1.5 text-start font-bold">وضعیت</th>
                      <th scope="col" className="px-2 py-1.5 text-start font-bold">تلاش‌ها</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.rows.slice(0, 8).map((r, i) =>
              <tr key={String(r.session_key) + i} className="border-b border-border-light last:border-b-0">
                      <td className="px-2 py-1.5 text-gray-800" dir="ltr">{String(r.date_id)}</td>
                      <td className="px-2 py-1.5 text-gray-800" dir="ltr">{String(r.session_key).slice(0, 12)}</td>
                      <td className="px-2 py-1.5 font-bold text-gray-950">{faIrr(Number(r.amount ?? 0))}</td>
                      <td className="px-2 py-1.5 text-gray-800">
                        {STATUS_FA[String(r.session_status)] ?? String(r.session_status)}
                      </td>
                      <td className="px-2 py-1.5 text-gray-800">{formatNumber(Number(r.n_attempts ?? 0))}</td>
                    </tr>
            )}
                  </tbody>
                </table>
              </div>
              <p className="mt-1.5 text-[11px] text-gray-600">
                صفحهٔ {formatNumber(records.page)} از {formatNumber(Math.max(1, Math.ceil(records.total / records.pageSize)))}؛
                مبلغ‌ها ریال و فقط برای نسبت‌ها معتبرند (ADR-0006).
              </p>
            </div>
          }

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