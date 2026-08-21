import React from 'react';

export type SkeletonVariant = 'rect' | 'text' | 'circle';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Shape of the placeholder block. */
  variant?: SkeletonVariant;
  /** CSS width, e.g. "100%", "8rem", 200. */
  width?: string | number;
  /** CSS height, e.g. "1rem", 40. Ignored for `text` (line height is fixed). */
  height?: string | number;
  /** Disable the pulse animation (useful for static screenshots/tests). */
  animate?: boolean;
  /** Accessible label announced while content loads. */
  label?: string;
}

const variantClasses: Record<SkeletonVariant, string> = {
  rect: 'rounded-lg',
  text: 'rounded h-3',
  circle: 'rounded-full'
};

export function Skeleton({
  variant = 'rect',
  width,
  height,
  animate = true,
  label,
  className = '',
  style,
  ...rest
}: SkeletonProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label ?? 'Loading'}
      className={`bg-slate-200 ${variantClasses[variant]} ${animate ? 'animate-pulse' : ''} ${className}`}
      style={{ width, height: variant === 'text' ? height : height, ...style }}
      {...rest} />);


}

export interface SkeletonTextProps {
  /** Number of lines to render. */
  lines?: number;
  /** Width of the final (short) line. */
  lastLineWidth?: string;
  animate?: boolean;
  className?: string;
}

export function SkeletonText({
  lines = 3,
  lastLineWidth = '60%',
  animate = true,
  className = ''
}: SkeletonTextProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`} role="status" aria-label="Loading text">
      {Array.from({ length: lines }).map((_, i) =>
      <Skeleton
        key={i}
        variant="text"
        animate={animate}
        width={i === lines - 1 ? lastLineWidth : '100%'}
        aria-hidden="true" />

      )}
    </div>);

}

export interface SkeletonCardProps {
  /** Show a leading circular avatar in the header. */
  avatar?: boolean;
  /** Show a media block above the text. */
  media?: boolean;
  lines?: number;
  animate?: boolean;
  className?: string;
}

export function SkeletonCard({
  avatar = true,
  media = false,
  lines = 3,
  animate = true,
  className = ''
}: SkeletonCardProps) {
  return (
    <div
      role="status"
      aria-label="Loading card"
      className={`rounded-xl border border-slate-200 bg-white p-5 ${className}`}>
      
      {media && <Skeleton height="9rem" animate={animate} className="mb-4 w-full" aria-hidden="true" />}
      <div className="flex items-center gap-3">
        {avatar && <Skeleton variant="circle" width="2.5rem" height="2.5rem" animate={animate} aria-hidden="true" />}
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton variant="text" width="45%" animate={animate} aria-hidden="true" />
          <Skeleton variant="text" width="30%" animate={animate} aria-hidden="true" />
        </div>
      </div>
      <SkeletonText lines={lines} animate={animate} className="mt-4" />
    </div>);

}

export interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  /** Render a heavier header row. */
  header?: boolean;
  animate?: boolean;
  className?: string;
}

export function SkeletonTable({
  rows = 5,
  columns = 4,
  header = true,
  animate = true,
  className = ''
}: SkeletonTableProps) {
  return (
    <div
      role="status"
      aria-label="Loading table"
      className={`overflow-hidden rounded-xl border border-slate-200 bg-white ${className}`}>
      
      {header &&
      <div
        className="grid gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        
          {Array.from({ length: columns }).map((_, i) =>
        <Skeleton key={i} variant="text" width="70%" animate={animate} aria-hidden="true" />
        )}
        </div>
      }
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, r) =>
        <div
          key={r}
          className="grid items-center gap-4 px-5 py-4"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          
            {Array.from({ length: columns }).map((_, c) =>
          <Skeleton
            key={c}
            variant="text"
            width={c === 0 ? '85%' : c === columns - 1 ? '40%' : '65%'}
            animate={animate}
            aria-hidden="true" />

          )}
          </div>
        )}
      </div>
    </div>);

}

export interface SkeletonChartProps {
  /** Number of placeholder bars. */
  bars?: number;
  /** Overall chart height. */
  height?: string;
  /** Show the title / legend block above the plot. */
  header?: boolean;
  animate?: boolean;
  className?: string;
}

const barHeights = [45, 70, 55, 90, 62, 78, 40, 84, 58, 72, 48, 66];

export function SkeletonChart({
  bars = 7,
  height = '14rem',
  header = true,
  animate = true,
  className = ''
}: SkeletonChartProps) {
  return (
    <div
      role="status"
      aria-label="Loading chart"
      className={`rounded-xl border border-slate-200 bg-white p-5 ${className}`}>
      
      {header &&
      <div className="mb-6 flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <Skeleton variant="text" width="9rem" animate={animate} aria-hidden="true" />
            <Skeleton variant="text" width="6rem" animate={animate} aria-hidden="true" />
          </div>
          <Skeleton width="5rem" height="1.75rem" animate={animate} aria-hidden="true" />
        </div>
      }
      <div className="flex items-end gap-3" style={{ height }}>
        {Array.from({ length: bars }).map((_, i) =>
        <Skeleton
          key={i}
          animate={animate}
          className="flex-1"
          height={`${barHeights[i % barHeights.length]}%`}
          aria-hidden="true" />

        )}
      </div>
      <div className="mt-4 flex gap-3">
        {Array.from({ length: bars }).map((_, i) =>
        <Skeleton key={i} variant="text" animate={animate} className="flex-1" aria-hidden="true" />
        )}
      </div>
    </div>);

}