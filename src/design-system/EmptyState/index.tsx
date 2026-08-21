import React from 'react';
import { InboxIcon } from 'lucide-react';

export type EmptyStateSize = 'sm' | 'md' | 'lg';

export interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
}

export interface EmptyStateProps {
  /** Short, human title describing why the panel is empty. */
  title: string;
  /** Supporting sentence explaining what to do next. */
  description?: string;
  /** Custom illustration or icon. Defaults to an inbox glyph. */
  icon?: React.ReactNode;
  /** Primary call to action. */
  action?: EmptyStateAction;
  /** Optional secondary, lower-emphasis call to action. */
  secondaryAction?: EmptyStateAction;
  /** Vertical density of the block. */
  size?: EmptyStateSize;
  /** Render a dashed placeholder border around the block. */
  bordered?: boolean;
  /** Text direction — the brand is primarily RTL. */
  dir?: 'rtl' | 'ltr';
  className?: string;
  children?: React.ReactNode;
}

const sizeStyles: Record<EmptyStateSize, {wrap: string;glyph: string;icon: string;title: string;body: string;}> = {
  sm: {
    wrap: 'px-4 py-8 gap-3',
    glyph: 'h-12 w-12',
    icon: 'h-5 w-5',
    title: 'text-sm',
    body: 'text-xs'
  },
  md: {
    wrap: 'px-6 py-12 gap-4',
    glyph: 'h-16 w-16',
    icon: 'h-7 w-7',
    title: 'text-base',
    body: 'text-sm'
  },
  lg: {
    wrap: 'px-8 py-16 gap-5',
    glyph: 'h-20 w-20',
    icon: 'h-9 w-9',
    title: 'text-lg',
    body: 'text-base'
  }
};

function ActionButton({
  action,
  variant



}: {action: EmptyStateAction;variant: 'primary' | 'secondary';}) {
  const base =
  'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2';
  const styles =
  variant === 'primary' ?
  'bg-blue-600 text-white hover:bg-blue-700' :
  'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900';

  if (action.href) {
    return (
      <a href={action.href} className={`${base} ${styles}`}>
        {action.label}
      </a>);

  }
  return (
    <button type="button" onClick={action.onClick} className={`${base} ${styles}`}>
      {action.label}
    </button>);

}

export function EmptyState({
  title,
  description,
  icon,
  action,
  secondaryAction,
  size = 'md',
  bordered = false,
  dir = 'rtl',
  className = '',
  children
}: EmptyStateProps) {
  const s = sizeStyles[size];

  return (
    <div
      dir={dir}
      role="status"
      className={[
      'flex w-full flex-col items-center justify-center text-center',
      'rounded-2xl bg-white',
      bordered ? 'border border-dashed border-slate-200' : '',
      s.wrap,
      className].

      filter(Boolean).
      join(' ')}>
      
      <div
        aria-hidden="true"
        className={`flex shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 ${s.glyph}`}>
        
        {icon ?? <InboxIcon className={s.icon} strokeWidth={1.75} />}
      </div>

      <div className="flex max-w-sm flex-col gap-1.5">
        <h3 className={`font-bold text-slate-900 ${s.title}`}>{title}</h3>
        {description && <p className={`leading-relaxed text-slate-500 ${s.body}`}>{description}</p>}
      </div>

      {children}

      {(action || secondaryAction) &&
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {action && <ActionButton action={action} variant="primary" />}
          {secondaryAction && <ActionButton action={secondaryAction} variant="secondary" />}
        </div>
      }
    </div>);

}