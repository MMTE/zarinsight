import React, { useId, useState } from 'react';

export interface LinePoint {
  label: string;
  value: number;
  compare?: number;
  marker?: {type: 'anomaly' | 'trend' | 'peak';label: string;insightId?: string;};
}

interface LineChartProps {
  points: LinePoint[];
  formatValue: (value: number) => string;
  seriesLabel: string;
  compareLabel?: string;
  height?: number;
  onMarkerClick?: (insightId: string) => void;
  ariaLabel: string;
}

const MARKER_COLOR: Record<'anomaly' | 'trend' | 'peak', string> = {
  anomaly: 'var(--red-600)',
  trend: 'var(--orange-600)',
  peak: 'var(--green-600)'
};

const MARKER_LABEL: Record<'anomaly' | 'trend' | 'peak', string> = {
  anomaly: 'افت غیرعادی',
  trend: 'شروع روند جدید',
  peak: 'نقطه اوج'
};

export function LineChart({
  points,
  formatValue,
  seriesLabel,
  compareLabel,
  height = 240,
  onMarkerClick,
  ariaLabel
}: LineChartProps) {
  const gradientId = useId();
  const [active, setActive] = useState<number | null>(null);

  const width = 720;
  const padding = { top: 16, bottom: 28, inline: 12 };
  const innerHeight = height - padding.top - padding.bottom;

  const values = points.flatMap((p) => [p.value, ...(p.compare != null ? [p.compare] : [])]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const lo = min - span * 0.15;
  const hi = max + span * 0.15;

  // RTL: نخستین نقطه در سمت راست قرار می‌گیرد.
  const x = (index: number) =>
  width - padding.inline - index / Math.max(points.length - 1, 1) * (width - padding.inline * 2);
  const y = (value: number) => padding.top + innerHeight - (value - lo) / (hi - lo) * innerHeight;

  const line = (key: 'value' | 'compare') =>
  points.
  map((point, index) => {
    const value = key === 'value' ? point.value : point.compare;
    if (value == null) return null;
    return `${index === 0 ? 'M' : 'L'}${x(index).toFixed(1)},${y(value).toFixed(1)}`;
  }).
  filter(Boolean).
  join(' ');

  const area = `${line('value')} L${x(points.length - 1).toFixed(1)},${(padding.top + innerHeight).toFixed(1)} L${x(0).toFixed(1)},${(padding.top + innerHeight).toFixed(1)} Z`;

  const activePoint = active != null ? points[active] : null;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-4 text-[12px] text-gray-800">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded-full bg-pal-600" aria-hidden="true" />
          {seriesLabel}
        </span>
        {compareLabel &&
        <span className="inline-flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded-full bg-gray-400" aria-hidden="true" />
            {compareLabel}
          </span>
        }
        {(['anomaly', 'trend', 'peak'] as const).map((type) =>
        <span key={type} className="inline-flex items-center gap-1.5">
            <span
            className="h-2 w-2 rounded-full"
            style={{ background: MARKER_COLOR[type] }}
            aria-hidden="true" />
          
            {MARKER_LABEL[type]}
          </span>
        )}
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full"
          style={{ height }}
          role="img"
          aria-label={ariaLabel}>
          
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--pal-600)" stopOpacity="0.14" />
              <stop offset="100%" stopColor="var(--pal-600)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0, 0.25, 0.5, 0.75, 1].map((ratio) =>
          <line
            key={ratio}
            x1={padding.inline}
            x2={width - padding.inline}
            y1={padding.top + innerHeight * ratio}
            y2={padding.top + innerHeight * ratio}
            stroke="var(--gray-200)"
            strokeWidth="1" />

          )}

          <path d={area} fill={`url(#${gradientId})`} />
          {compareLabel &&
          <path
            d={line('compare')}
            fill="none"
            stroke="var(--gray-400)"
            strokeWidth="2"
            strokeDasharray="5 4" />

          }
          <path d={line('value')} fill="none" stroke="var(--pal-600)" strokeWidth="2.5" />

          {points.map((point, index) =>
          <g key={point.label}>
              <rect
              x={x(index) - (width - padding.inline * 2) / (points.length * 2)}
              y={padding.top}
              width={(width - padding.inline * 2) / points.length}
              height={innerHeight}
              fill="transparent"
              onMouseEnter={() => setActive(index)}
              onMouseLeave={() => setActive(null)} />
            
              {point.marker &&
            <g
              role={onMarkerClick && point.marker.insightId ? 'button' : undefined}
              tabIndex={onMarkerClick && point.marker.insightId ? 0 : undefined}
              aria-label={`${point.marker.label} — ${point.label}`}
              className={onMarkerClick && point.marker.insightId ? 'cursor-pointer' : undefined}
              onClick={() =>
              point.marker?.insightId && onMarkerClick?.(point.marker.insightId)
              }
              onKeyDown={(event) => {
                if ((event.key === 'Enter' || event.key === ' ') && point.marker?.insightId) {
                  event.preventDefault();
                  onMarkerClick?.(point.marker.insightId);
                }
              }}>
              
                  <circle
                cx={x(index)}
                cy={y(point.value)}
                r="7"
                fill="var(--surface-light)"
                stroke={MARKER_COLOR[point.marker.type]}
                strokeWidth="2.5" />
              
                </g>
            }
              {active === index && !point.marker &&
            <circle cx={x(index)} cy={y(point.value)} r="4.5" fill="var(--pal-600)" />
            }
            </g>
          )}

          {points.map((point, index) =>
          index % Math.ceil(points.length / 6) === 0 || index === points.length - 1 ?
          <text
            key={`label-${point.label}`}
            x={x(index)}
            y={height - 8}
            textAnchor="middle"
            fontSize="11"
            fill="var(--gray-700)">
            
                {point.label}
              </text> :
          null
          )}
        </svg>

        {activePoint &&
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
            <div className="rounded-lg border border-border-light bg-surface-light px-3 py-2 text-[12px] shadow-xs">
              <p className="font-bold text-gray-950">{activePoint.label}</p>
              <p className="text-gray-800">
                {seriesLabel}: {formatValue(activePoint.value)}
              </p>
              {activePoint.compare != null && compareLabel &&
            <p className="text-gray-700">
                  {compareLabel}: {formatValue(activePoint.compare)}
                </p>
            }
              {activePoint.marker &&
            <p className="mt-1 font-bold text-gray-950">{activePoint.marker.label}</p>
            }
            </div>
          </div>
        }
      </div>

      <ul className="mt-3 flex flex-wrap gap-2">
        {points.
        filter((point) => point.marker).
        map((point) =>
        <li key={`marker-${point.label}`}>
              <button
            type="button"
            onClick={() => point.marker?.insightId && onMarkerClick?.(point.marker.insightId)}
            disabled={!point.marker?.insightId || !onMarkerClick}
            className="inline-flex min-h-[32px] items-center gap-1.5 rounded-full border border-border-light bg-surface-light px-2.5 py-1 text-[11px] text-gray-900 transition-colors hover:bg-gray-100 disabled:cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600">
            
                <span
              className="h-2 w-2 rounded-full"
              style={{ background: MARKER_COLOR[point.marker!.type] }}
              aria-hidden="true" />
            
                {point.label} — {point.marker!.label}
              </button>
            </li>
        )}
      </ul>
    </div>);

}