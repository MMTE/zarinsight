import React from 'react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { PageHeader, SectionHeading } from '../components/analytics/PageHeader';
import { CautionNotice, PrototypeNotice } from '../components/analytics/Notices';
import {
  adjustedFeeWarning,
  analysisReadiness,
  attemptStructureNote,
  concentrationNote,
  datasetSummary,
  fieldCoverage } from
'../data/dataQuality';
import { formatNumber, formatPercent, toPersianDigits } from '../utils/format';
import { useEffect, useState } from 'react';

const STATUS_LABEL = {
  ok: 'در دسترس',
  partial: 'ناقص',
  notApplicable: 'برای این نوع رکورد کاربرد ندارد'
} as const;

const STATUS_VARIANT = {
  ok: 'success',
  partial: 'warning',
  notApplicable: 'neutral'
} as const;

export function DataQuality() {
  const [liveCounts, setLiveCounts] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    fetch('/api/methodology').then((r) => r.json())
      .then((d2) => setLiveCounts(d2.dataset.counts)).catch(() => {});
  }, []);

  const summary = liveCounts
    ? {
        records: Number(liveCounts.count_rows ?? 0),
        sessions: Number(liveCounts.count_sessions ?? 0),
        merchants: Number(liveCounts.count_merchants ?? 0),
        psps: Number(liveCounts.count_psps ?? 0),
        cards: Number(liveCounts.count_cards ?? 0),
        quarantine: Number(liveCounts.count_quarantine ?? 0),
      }
    : datasetSummary;

  return (
    <div className="space-y-6">
      <PageHeader
        title="کیفیت داده"
        description="چه میزان از داده‌ها برای هر تحلیل قابل استفاده است؟" />
      

      <Card padding="md" elevation="low" className="border-border-light">
        <SectionHeading title="نگاه کلی به داده" />
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
          { label: 'تعداد رکوردها', value: formatNumber(summary.records) },
          { label: 'تعداد کسب‌وکارها', value: formatNumber(summary.merchants) },
          { label: 'بازه زمانی', value: summary.period },
          { label: 'سطح داده', value: 'تلاش پرداخت' }].
          map((item) =>
          <div key={item.label} className="rounded-lg bg-gray-50 px-3 py-2.5">
              <dt className="text-[11px] text-gray-700">{item.label}</dt>
              <dd className="mt-1 text-[14px] font-bold text-gray-950">{item.value}</dd>
            </div>
          )}
        </dl>
        <p className="mt-3 text-[13px] leading-7 text-gray-900">{summary.grain}</p>
      </Card>

      <Card padding="md" elevation="low" className="border-border-light">
        <SectionHeading
          title="پوشش هر فیلد"
          description="نبود داده همیشه خطا نیست؛ برای هر فیلد وضعیتش را جدا نوشته‌ایم." />
        
        <ul className="space-y-3">
          {fieldCoverage.map((field) =>
          <li key={field.field}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="flex items-center gap-2 text-[13px] font-bold text-gray-950">
                  {field.field}
                  <Badge variant={STATUS_VARIANT[field.status]} size="sm">
                    {STATUS_LABEL[field.status]}
                  </Badge>
                </span>
                <span className="text-[13px] font-bold text-gray-950">
                  {toPersianDigits(field.coverage)}٪
                </span>
              </div>
              <div className="mt-1.5 h-2.5 w-full rounded-full bg-gray-100">
                <div
                className={`h-2.5 rounded-full ${
                field.coverage >= 90 ?
                'bg-green-600' :
                field.coverage >= 40 ?
                'bg-orange-600' :
                'bg-red-600'}`
                }
                style={{ width: `${Math.max(field.coverage, 1.5)}%` }}
                aria-hidden="true" />
              
              </div>
              <p className="mt-1 text-[11px] leading-6 text-gray-700">{field.meaning}</p>
            </li>
          )}
        </ul>
      </Card>

      <Card padding="md" elevation="low" className="border-border-light">
        <SectionHeading title="کدام تحلیل‌ها قابل انجام‌اند؟" />
        <ul className="space-y-2">
          {analysisReadiness.map((item) =>
          <li
            key={item.analysis}
            className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg bg-gray-50 px-3 py-2.5">
            
              <span className="text-[13px] font-bold text-gray-950">{item.analysis}</span>
              <span className="flex items-center gap-2">
                <Badge variant={item.usable ? 'success' : 'danger'} size="sm">
                  {item.usable ? 'قابل انجام' : 'قابل انجام نیست'}
                </Badge>
                <span className="text-[11px] text-gray-700">{item.note}</span>
              </span>
            </li>
          )}
        </ul>
      </Card>

      <Card padding="md" elevation="flat" className="border-border-light">
        <SectionHeading title="ساختار تلاش‌های پرداخت" />
        <ul className="space-y-2">
          {attemptStructureNote.map((line) =>
          <li key={line} className="flex gap-2 text-[13px] leading-7 text-gray-900">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-500" aria-hidden="true" />
              <span>{line}</span>
            </li>
          )}
        </ul>
        <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2.5 text-[12px] leading-6 text-gray-800">
          {concentrationNote}
        </p>
      </Card>

      <Card padding="md" elevation="flat" className="border-alert-danger-border-light">
        <SectionHeading title={adjustedFeeWarning.title} />
        <div className="space-y-2">
          {adjustedFeeWarning.body.map((line) =>
          <CautionNotice key={line}>{line}</CautionNotice>
          )}
        </div>
        <p className="mt-3 text-[12px] leading-6 text-gray-800">
          به همین دلیل، این عدد در هیچ گزارشی با عنوان «کارمزد زرین‌پال» نمایش داده نمی‌شود.
        </p>
      </Card>

      <PrototypeNotice />
    </div>);

}