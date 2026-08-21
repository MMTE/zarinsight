import React, { useState } from 'react';
import { Card } from '../Card';
import { SectionHeading } from './PageHeader';
import type { Methodology } from '../../types/analytics';

export function MethodologyPanel({ methodology }: {methodology: Methodology;}) {
  const [view, setView] = useState<'simple' | 'technical'>('simple');

  return (
    <Card padding="md" elevation="flat" className="border-border-light">
      <SectionHeading
        title="روش تحلیل"
        action={
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
            className={`min-h-[32px] rounded-lg px-2.5 py-1 text-[12px] font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600 ${
            view === option.value ?
            'bg-pal-600 text-white' :
            'bg-gray-100 text-gray-800 hover:bg-gray-200'}`
            }>
            
                {option.label}
              </button>
          )}
          </div>
        } />
      

      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
        { label: 'نوع تحلیل', value: methodology.type },
        { label: 'گروه مقایسه', value: methodology.peerGroup },
        { label: 'حداقل حجم نمونه', value: methodology.minSample },
        { label: 'پوشش داده', value: methodology.coverage },
        { label: 'میزان اطمینان', value: methodology.confidence }].
        map((item) =>
        <div key={item.label} className="rounded-lg bg-gray-50 px-3 py-2.5">
            <dt className="text-[11px] text-gray-700">{item.label}</dt>
            <dd className="mt-1 text-[13px] font-bold text-gray-950">{item.value}</dd>
          </div>
        )}
      </dl>

      {view === 'simple' ?
      <p className="mt-4 text-[13px] leading-7 text-gray-900">{methodology.simple}</p> :

      <ul className="mt-4 space-y-2">
          {methodology.technical.map((item) =>
        <li key={item} className="flex gap-2 text-[13px] leading-7 text-gray-900">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-500" aria-hidden="true" />
              <span>{item}</span>
            </li>
        )}
        </ul>
      }
    </Card>);

}