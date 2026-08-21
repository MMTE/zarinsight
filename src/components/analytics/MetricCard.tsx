import React from 'react';
import { Card } from '../Card';
import { DeltaBadge } from './Badges';

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  delta?: number;
  deltaUnit?: 'percent' | 'points';
  positiveWhen?: 'up' | 'down';
  note?: string;
  emphasis?: boolean;
}

export function MetricCard({
  label,
  value,
  unit,
  delta,
  deltaUnit = 'percent',
  positiveWhen = 'up',
  note,
  emphasis = false
}: MetricCardProps) {
  return (
    <Card
      padding="sm"
      elevation="flat"
      className={emphasis ? 'border-pal-200 bg-pal-50' : 'border-border-light'}>
      
      <p className="text-[12px] font-medium leading-6 text-gray-700">{label}</p>
      <p className="mt-1.5 flex flex-wrap items-baseline gap-1.5">
        <span className="text-[22px] font-bold leading-none text-gray-950">{value}</span>
        {unit && <span className="text-[12px] text-gray-700">{unit}</span>}
      </p>
      {typeof delta === 'number' &&
      <p className="mt-2">
          <DeltaBadge value={delta} unit={deltaUnit} positiveWhen={positiveWhen} />
        </p>
      }
      {note && <p className="mt-1 text-[11px] leading-5 text-gray-600">{note}</p>}
    </Card>);

}