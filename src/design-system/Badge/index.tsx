import React from 'react';

export type BadgeVariant =
'neutral' |
'brand' |
'success' |
'warning' |
'danger' |
'info';

export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual tone of the badge */
  variant?: BadgeVariant;
  /** Size of the badge */
  size?: BadgeSize;
  /** Renders a small leading dot in the current tone */
  dot?: boolean;
  /** Optional leading icon element */
  icon?: React.ReactNode;
  /** Badge content — a count, label, or status word */
  children: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'bg-slate-100 text-slate-700',
  brand: 'bg-blue-50 text-blue-700',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-red-50 text-red-700',
  info: 'bg-sky-50 text-sky-700'
};

const dotClasses: Record<BadgeVariant, string> = {
  neutral: 'bg-slate-500',
  brand: 'bg-blue-600',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-sky-500'
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'h-5 min-w-[1.25rem] px-2 text-[11px] gap-1',
  md: 'h-6 min-w-[1.5rem] px-2.5 text-xs gap-1.5'
};

export function Badge({
  variant = 'neutral',
  size = 'md',
  dot = false,
  icon,
  children,
  className = '',
  ...rest
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-medium leading-none whitespace-nowrap ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...rest}>
      
      {dot ?
      <span
        aria-hidden="true"
        className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${dotClasses[variant]}`} /> :

      null}
      {icon ?
      <span aria-hidden="true" className="inline-flex shrink-0 [&>svg]:h-3.5 [&>svg]:w-3.5">
          {icon}
        </span> :
      null}
      {children}
    </span>);

}