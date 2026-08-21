import React from 'react';
import { AlertTriangleIcon, InfoIcon, XIcon } from 'lucide-react';

export type AlertBannerTone = 'danger' | 'warning';

export interface AlertBannerProps {
  /** Visual tone of the banner. */
  tone?: AlertBannerTone;
  /** Optional bold title shown above the description. */
  title?: string;
  /** Body copy of the notice. */
  children: React.ReactNode;
  /** Label for the outlined action button. Omit to hide the button. */
  actionLabel?: string;
  /** Called when the action button is pressed. */
  onAction?: () => void;
  /** Show a dismiss (close) button. */
  dismissible?: boolean;
  /** Called when the dismiss button is pressed. */
  onDismiss?: () => void;
  /** Override the leading icon. */
  icon?: React.ReactNode;
  /** Text direction. Defaults to 'rtl' to match the brand. */
  dir?: 'rtl' | 'ltr';
  className?: string;
}

const toneStyles: Record<
  AlertBannerTone,
  {container: string;icon: string;title: string;body: string;action: string;}> =
{
  danger: {
    container: 'bg-red-50 border-red-200',
    icon: 'text-red-500',
    title: 'text-red-900',
    body: 'text-red-800',
    action:
    'border-red-300 text-red-700 hover:bg-red-100 focus-visible:outline-red-500'
  },
  warning: {
    container: 'bg-amber-50 border-amber-200',
    icon: 'text-amber-500',
    title: 'text-amber-900',
    body: 'text-amber-800',
    action:
    'border-amber-300 text-amber-800 hover:bg-amber-100 focus-visible:outline-amber-500'
  }
};

const defaultIcons: Record<AlertBannerTone, React.ReactNode> = {
  danger: <AlertTriangleIcon className="h-5 w-5" aria-hidden="true" />,
  warning: <InfoIcon className="h-5 w-5" aria-hidden="true" />
};

export function AlertBanner({
  tone = 'warning',
  title,
  children,
  actionLabel,
  onAction,
  dismissible = false,
  onDismiss,
  icon,
  dir = 'rtl',
  className = ''
}: AlertBannerProps) {
  const styles = toneStyles[tone];

  return (
    <div
      role="status"
      aria-live="polite"
      dir={dir}
      className={`flex w-full flex-col gap-3 rounded-2xl border px-4 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-5 ${styles.container} ${className}`}>
      
      <span className={`shrink-0 ${styles.icon}`}>{icon ?? defaultIcons[tone]}</span>

      <div className="min-w-0 flex-1">
        {title ?
        <p className={`text-sm font-bold leading-6 ${styles.title}`}>{title}</p> :
        null}
        <div className={`text-sm leading-6 ${styles.body}`}>{children}</div>
      </div>

      {(actionLabel || dismissible) &&
      <div className="flex shrink-0 items-center gap-2">
          {actionLabel ?
        <button
          type="button"
          onClick={onAction}
          className={`rounded-full border bg-transparent px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${styles.action}`}>
          
              {actionLabel}
            </button> :
        null}

          {dismissible ?
        <button
          type="button"
          onClick={onDismiss}
          aria-label="بستن"
          className={`rounded-full p-2 transition-colors hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${styles.icon}`}>
          
              <XIcon className="h-4 w-4" aria-hidden="true" />
            </button> :
        null}
        </div>
      }
    </div>);

}