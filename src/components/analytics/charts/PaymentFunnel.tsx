import React from 'react';
import { formatNumber } from '../../../utils/format';

export interface FunnelStage {
  stage: string;
  value: number;
  note: string;
}

export function PaymentFunnel({ stages }: {stages: FunnelStage[];}) {
  const max = Math.max(...stages.map((stage) => stage.value)) || 1;

  return (
    <ol className="space-y-2.5" aria-label="قیف تلاش پرداخت">
      {stages.map((stage, index) => {
        const isDropOff = stage.stage === 'ترک پرداخت';
        const isSuccess = stage.stage.includes('موفق');
        const tone = isDropOff ? 'bg-red-600' : isSuccess ? 'bg-green-600' : 'bg-pal-600';

        return (
          <li key={stage.stage} className="rounded-lg border border-border-light p-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-[13px] font-bold text-gray-950">
                {formatNumber(index + 1)}. {stage.stage}
              </span>
              <span className="text-[13px] font-bold text-gray-950">
                {formatNumber(stage.value)}
              </span>
            </div>
            <div className="mt-2 h-2.5 w-full rounded-full bg-gray-100">
              <div
                className={`h-2.5 rounded-full ${tone}`}
                style={{ width: `${Math.max(stage.value / max * 100, 2)}%` }} />
              
            </div>
            <p className="mt-1.5 text-[11px] text-gray-700">{stage.note}</p>
          </li>);

      })}
    </ol>);

}