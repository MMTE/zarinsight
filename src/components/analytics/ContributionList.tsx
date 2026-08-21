import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from 'lucide-react';
import type { Contribution } from '../../types/analytics';
import { formatPoints } from '../../utils/format';

export function ContributionList({ items }: {items: Contribution[];}) {
  const navigate = useNavigate();
  const max = Math.max(...items.map((item) => item.points)) || 1;

  return (
    <ul className="space-y-2" aria-label="سهم هر بخش در این تغییر">
      {items.map((item) =>
      <li key={item.label}>
          <button
          type="button"
          onClick={() => item.to && navigate(item.to)}
          disabled={!item.to}
          className="w-full rounded-lg border border-border-light px-3 py-2.5 text-start transition-colors hover:bg-gray-50 disabled:cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600">
          
            <div className="flex items-center justify-between gap-3">
              <span className="text-[13px] font-medium text-gray-900">{item.label}</span>
              <span className="flex items-center gap-1.5">
                <span className="text-[13px] font-bold text-gray-950">
                  {formatPoints(item.points)}
                </span>
                {item.to &&
              <ChevronLeftIcon className="h-4 w-4 text-gray-600" aria-hidden="true" />
              }
              </span>
            </div>
            <div className="mt-1.5 h-2 w-full rounded-full bg-gray-100">
              <div
              className="h-2 rounded-full bg-orange-600"
              style={{ width: `${Math.max(item.points / max * 100, 3)}%` }} />
            
            </div>
          </button>
        </li>
      )}
    </ul>);

}