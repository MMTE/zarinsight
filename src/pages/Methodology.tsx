import React, { useState } from 'react';
import { Card } from '../components/Card';
import { PageHeader, SectionHeading } from '../components/analytics/PageHeader';
import { CautionNotice, PrototypeNotice } from '../components/analytics/Notices';
import { adjustedFeeSection, methodSections, qualityGate } from '../data/methodology';
import { formatNumber } from '../utils/format';

export function Methodology() {
  const [view, setView] = useState<'simple' | 'technical'>('simple');

  return (
    <div className="space-y-6">
      <PageHeader
        title="روش تحلیل"
        description="هر عددی که در این محصول می‌بینید، از یک تعریف مشخص و یک محاسبه ثابت می‌آید."
        actions={
        <div className="flex gap-1.5" role="group" aria-label="نمای روش تحلیل">
            {(
          [
          { value: 'simple', label: 'توضیح ساده' },
          { value: 'technical', label: 'جزئیات فنی' }] as
          const).
          map((option) =>
          <button
            key={option.value}
            type="button"
            onClick={() => setView(option.value)}
            aria-pressed={view === option.value}
            className={`min-h-[34px] rounded-lg px-3 py-1.5 text-[12px] font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600 ${
            view === option.value ?
            'bg-pal-600 text-white' :
            'bg-gray-100 text-gray-800 hover:bg-gray-200'}`
            }>
            
                {option.label}
              </button>
          )}
          </div>
        } />
      

      <Card padding="md" elevation="flat" className="border-alert-danger-border-light">
        <SectionHeading title={adjustedFeeSection.title} />
        <div className="space-y-2">
          {adjustedFeeSection.body.map((line) =>
          <CautionNotice key={line}>{line}</CautionNotice>
          )}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {methodSections.map((section) =>
        <Card key={section.id} padding="md" elevation="low" className="border-border-light">
            <SectionHeading title={section.title} />
            {view === 'simple' ?
          <p className="text-[13px] leading-7 text-gray-900">{section.simple}</p> :

          <ul className="space-y-2">
                {section.technical.map((line) =>
            <li key={line} className="flex gap-2 text-[13px] leading-7 text-gray-900">
                    <span
                className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-500"
                aria-hidden="true" />
              
                    <span>{line}</span>
                  </li>
            )}
              </ul>
          }
          </Card>
        )}
      </div>

      <Card padding="md" elevation="low" className="border-border-light">
        <SectionHeading
          title="یک سرنخ چه زمانی به یافته تبدیل می‌شود؟"
          description="اگر یکی از این مرحله‌ها رد نشود، سرنخ منتشر نمی‌شود." />
        
        <ol className="space-y-2">
          {qualityGate.map((item, index) =>
          <li key={item.step} className="flex gap-3 rounded-lg bg-gray-50 px-3 py-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-950 text-[11px] font-bold text-gray-50">
                {formatNumber(index + 1)}
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-bold text-gray-950">{item.step}</span>
                <span className="mt-0.5 block text-[12px] leading-6 text-gray-800">{item.detail}</span>
              </span>
            </li>
          )}
        </ol>
      </Card>

      <PrototypeNotice />
    </div>);

}