import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Loader2Icon } from 'lucide-react';

export type ButtonVariant =
'primary' |
'secondary' |
'outline' |
'ghost' |
'destructive';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends
  React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner and blocks interaction. */
  loading?: boolean;
  /** Element rendered before the label (inline-start). */
  leadingIcon?: React.ReactNode;
  /** Element rendered after the label (inline-end). */
  trailingIcon?: React.ReactNode;
  /** Stretches the button to the full width of its container. */
  fullWidth?: boolean;
}

const baseClasses =
'inline-flex items-center justify-center gap-2 rounded-lg font-semibold leading-none whitespace-nowrap select-none border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1652F0] disabled:pointer-events-none disabled:opacity-50';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
  'bg-[#1652F0] border-transparent text-white hover:bg-[#1140C7] active:bg-[#0E36A6]',
  secondary:
  'bg-[#FFC72C] border-transparent text-[#16181D] hover:bg-[#F0B411] active:bg-[#D89F08]',
  outline:
  'bg-white border-[#D5D9E2] text-[#16181D] hover:bg-[#F4F6FA] hover:border-[#B9C0CD] active:bg-[#E9EDF4]',
  ghost:
  'bg-transparent border-transparent text-[#1652F0] hover:bg-[#EEF2FE] active:bg-[#DEE6FD]',
  destructive:
  'bg-[#E02D3C] border-transparent text-white hover:bg-[#C3212F] active:bg-[#A61B27] focus-visible:ring-[#E02D3C]'
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-[52px] px-7 text-base'
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leadingIcon,
  trailingIcon,
  fullWidth = false,
  disabled,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={twMerge(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}>
      
      {loading ?
      <Loader2Icon
        className="h-4 w-4 shrink-0 animate-spin"
        aria-hidden="true" /> :


      leadingIcon &&
      <span className="flex shrink-0 items-center" aria-hidden="true">
            {leadingIcon}
          </span>

      }
      {children}
      {!loading && trailingIcon &&
      <span className="flex shrink-0 items-center" aria-hidden="true">
          {trailingIcon}
        </span>
      }
    </button>);

}