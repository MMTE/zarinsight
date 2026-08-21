import React, { forwardRef } from 'react';

export type IconButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends
  React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible label — required since the button renders no visible text. */
  label: string;
  /** Icon element, typically a lucide-react icon. */
  icon: React.ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  /** Shows a spinner and blocks interaction. */
  loading?: boolean;
  /**
   * Mirrors the icon horizontally in RTL contexts. Use for directional icons
   * (arrows, chevrons, back/forward) so they point the correct way.
   */
  directional?: boolean;
}

const variantClasses: Record<IconButtonVariant, string> = {
  primary:
  'bg-blue-700 text-white hover:bg-blue-800 active:bg-blue-900 border border-transparent',
  secondary:
  'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100',
  ghost:
  'bg-transparent text-slate-500 border border-transparent hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200',
  danger:
  'bg-transparent text-red-600 border border-transparent hover:bg-red-50 active:bg-red-100'
};

const sizeClasses: Record<IconButtonSize, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12'
};

const iconSizeClasses: Record<IconButtonSize, string> = {
  sm: '[&>svg]:h-4 [&>svg]:w-4',
  md: '[&>svg]:h-[18px] [&>svg]:w-[18px]',
  lg: '[&>svg]:h-5 [&>svg]:w-5'
};

const spinnerSizeClasses: Record<IconButtonSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-[18px] w-[18px]',
  lg: 'h-5 w-5'
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
  {
    label,
    icon,
    variant = 'secondary',
    size = 'md',
    loading = false,
    directional = false,
    disabled,
    className = '',
    type = 'button',
    ...rest
  },
  ref)
  {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        aria-label={label}
        title={label}
        aria-busy={loading || undefined}
        disabled={isDisabled}
        className={[
        'inline-flex shrink-0 items-center justify-center rounded-lg',
        'transition-colors duration-150 outline-none',
        'focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
        'disabled:pointer-events-none disabled:opacity-50',
        sizeClasses[size],
        iconSizeClasses[size],
        variantClasses[variant],
        directional ? 'rtl:[&>svg]:-scale-x-100' : '',
        className].

        filter(Boolean).
        join(' ')}
        {...rest}>
        
        {loading ?
        <span
          role="presentation"
          className={[
          'animate-spin rounded-full border-2 border-current border-t-transparent',
          spinnerSizeClasses[size]].
          join(' ')} /> :


        icon
        }
      </button>);

  }
);