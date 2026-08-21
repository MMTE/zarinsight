import React from 'react';
import { formatToman } from '../../../utils/format';

export interface WaterfallStep {
  label: string;
  value: number;
  type: 'total' | 'delta';
}

export function WaterfallChart({ steps }: {steps: WaterfallStep[];}) {
  let running = 0;
  const computed = steps.map((step) => {
    if (step.type === 'total') {
      running = step.value;
      return { ...step, start: 0, end: step.value };
    }
    const start = running;
    running += step.value;
    return { ...step, start, end: running };
  });

  const max = Math.max(...computed.map((item) => Math.max(item.start, item.end)));

  return (
    <ol className="space-y-3" aria-label="تجزیه تغییر درآمد">
      {computed.map((step) => {
        const isTotal = step.type === 'total';
        const isNegative = step.value < 0;
        const barStart = Math.min(step.start, step.end);
        const barLength = Math.abs(step.end - step.start);
        const offset = isTotal ? 0 : barStart / max * 100;
        const length = isTotal ? step.value / max * 100 : barLength / max * 100;

        return (
          <li key={step.label}>
            <div className="flex items-baseline justify-between gap-3">
              <span
                className={`text-[13px] ${isTotal ? 'font-bold text-gray-950' : 'text-gray-900'}`}>
                
                {step.label}
              </span>
              <span
                className={`text-[13px] font-bold ${
                isTotal ? 'text-gray-950' : isNegative ? 'text-red-700' : 'text-green-700'}`
                }>
                
                {isTotal ? '' : isNegative ? '−' : '+'}
                {formatToman(Math.abs(step.value))}
              </span>
            </div>
            <div className="mt-1.5 h-3 w-full rounded-full bg-gray-100">
              <div
                className={`h-3 rounded-full ${
                isTotal ? 'bg-gray-800' : isNegative ? 'bg-red-600' : 'bg-green-600'}`
                }
                style={{
                  marginInlineStart: `${offset}%`,
                  width: `${Math.max(length, 1.5)}%`
                }} />
              
            </div>
          </li>);

      })}
    </ol>);

}