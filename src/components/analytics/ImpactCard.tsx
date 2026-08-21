import React from 'react';
import { CoinsIcon } from 'lucide-react';
import { Card } from '../Card';
import { formatToman } from '../../utils/format';

interface ImpactCardProps {
  amount: number;
  range?: [number, number];
  basis: string;
}

export function ImpactCard({ amount, range, basis }: ImpactCardProps) {
  return (
    <Card padding="md" elevation="flat" className="border-green-200 bg-green-50">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700">
          <CoinsIcon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="text-[13px] font-bold text-green-800">اثر مالی برآوردی</h2>
          <p className="mt-1 text-[22px] font-bold leading-none text-gray-950">
            حدود {formatToman(amount)} در ماه
          </p>
          {range &&
          <p className="mt-2 text-[12px] text-gray-800">
              بازه برآورد: {formatToman(range[0])} تا {formatToman(range[1])}
            </p>
          }
          <p className="mt-2 text-[12px] leading-6 text-gray-800">{basis}</p>
          <p className="mt-1.5 text-[11px] leading-6 text-gray-700">
            این عدد فرصت برآوردی است، نه درآمد قطعی.
          </p>
        </div>
      </div>
    </Card>);

}