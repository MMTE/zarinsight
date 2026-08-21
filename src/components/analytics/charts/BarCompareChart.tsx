import React from 'react';

export interface BarItem {
  key: string;
  value: number;
  compare?: number;
  highlight?: boolean;
}

interface BarCompareChartProps {
  data: BarItem[];
  valueFormatter: (value: number) => string;
  ariaLabel: string;
  seriesLabel?: string;
  compareLabel?: string;
  onSelect?: (key: string) => void;
}

export function BarCompareChart({
  data,
  valueFormatter,
  ariaLabel,
  seriesLabel = 'دوره فعلی',
  compareLabel,
  onSelect
}: BarCompareChartProps) {
  const max = Math.max(...data.flatMap((item) => [item.value, item.compare ?? 0])) || 1;

  return (
    <div>
      {compareLabel &&
      <div className="mb-3 flex flex-wrap items-center gap-4 text-[12px] text-gray-800">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-pal-600" aria-hidden="true" />
            {seriesLabel}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-gray-300" aria-hidden="true" />
            {compareLabel}
          </span>
        </div>
      }

      <ul className="space-y-2.5" aria-label={ariaLabel}>
        {data.map((item) => {
          const content =
          <>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[13px] font-medium text-gray-900">{item.key}</span>
                <span className="text-[13px] font-bold text-gray-950">
                  {valueFormatter(item.value)}
                  {item.compare != null &&
                <span className="ms-2 text-[11px] font-normal text-gray-700">
                      در برابر {valueFormatter(item.compare)}
                    </span>
                }
                </span>
              </div>
              <div className="mt-1.5 space-y-1">
                <div className="h-2.5 w-full rounded-full bg-gray-100">
                  <div
                  className={`h-2.5 rounded-full ${item.highlight ? 'bg-red-600' : 'bg-pal-600'}`}
                  style={{ width: `${Math.max(item.value / max * 100, 1.5)}%` }} />
                
                </div>
                {item.compare != null &&
              <div className="h-1.5 w-full rounded-full bg-gray-100">
                    <div
                  className="h-1.5 rounded-full bg-gray-300"
                  style={{ width: `${Math.max(item.compare / max * 100, 1.5)}%` }} />
                
                  </div>
              }
              </div>
            </>;


          return (
            <li key={item.key}>
              {onSelect ?
              <button
                type="button"
                onClick={() => onSelect(item.key)}
                className="w-full rounded-lg p-1.5 text-start transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600">
                
                  {content}
                </button> :

              <div className="p-1.5">{content}</div>
              }
            </li>);

        })}
      </ul>
    </div>);

}