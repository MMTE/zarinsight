import React from 'react';
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  RotateCcwIcon,
  LoaderIcon } from
'lucide-react';

export type StatusPillStatus =
'success' |
'pending' |
'failed' |
'refunded' |
'inProgress';

export type StatusPillSize = 'sm' | 'md';

export interface StatusPillProps {
  /** Payment status to display */
  status: StatusPillStatus;
  /** Override the default Persian label */
  label?: string;
  /** Hide the leading status icon */
  hideIcon?: boolean;
  /** Visual density */
  size?: StatusPillSize;
  className?: string;
}

interface StatusConfig {
  label: string;
  icon: React.ComponentType<{className?: string;'aria-hidden'?: boolean;}>;
  classes: string;
  dot: string;
}

const STATUS_CONFIG: Record<StatusPillStatus, StatusConfig> = {
  success: {
    label: 'پرداخت موفق',
    icon: CheckCircleIcon,
    classes: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    dot: 'bg-emerald-500'
  },
  pending: {
    label: 'در انتظار پرداخت',
    icon: ClockIcon,
    classes: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    dot: 'bg-amber-500'
  },
  failed: {
    label: 'پرداخت ناموفق',
    icon: XCircleIcon,
    classes: 'bg-red-50 text-red-700 ring-red-600/20',
    dot: 'bg-red-500'
  },
  refunded: {
    label: 'بازگشت وجه',
    icon: RotateCcwIcon,
    classes: 'bg-slate-100 text-slate-700 ring-slate-500/20',
    dot: 'bg-slate-500'
  },
  inProgress: {
    label: 'در حال بررسی',
    icon: LoaderIcon,
    classes: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    dot: 'bg-blue-600'
  }
};

const SIZE_CLASSES: Record<StatusPillSize, string> = {
  sm: 'gap-1 px-2 py-0.5 text-xs',
  md: 'gap-1.5 px-2.5 py-1 text-sm'
};

const ICON_SIZE: Record<StatusPillSize, string> = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4'
};

export function StatusPill({
  status,
  label,
  hideIcon = false,
  size = 'md',
  className = ''
}: StatusPillProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  const text = label ?? config.label;

  return (
    <span
      dir="rtl"
      role="status"
      className={`inline-flex items-center whitespace-nowrap rounded-full font-medium ring-1 ring-inset ${config.classes} ${SIZE_CLASSES[size]} ${className}`}>
      
      {hideIcon ?
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} aria-hidden /> :

      <Icon
        className={`${ICON_SIZE[size]} shrink-0 ${
        status === 'inProgress' ? 'animate-spin' : ''}`
        }
        aria-hidden />

      }
      {text}
    </span>);

}