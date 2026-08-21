import React, { forwardRef, useId } from 'react';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Visible label rendered above the field */
  label?: string;
  /** Helper text shown below the field when there is no error */
  helperText?: string;
  /** Error message. When set, the field renders in its error state */
  error?: string;
  /** Element rendered at the logical start (right side in RTL) */
  startIcon?: React.ReactNode;
  /** Element rendered at the logical end (left side in RTL) */
  endIcon?: React.ReactNode;
  /** Field height / typography scale */
  inputSize?: InputSize;
  /** Stretch the field to the full width of its container */
  fullWidth?: boolean;
}

const sizeClasses: Record<InputSize, string> = {
  sm: 'h-9 text-sm',
  md: 'h-11 text-sm',
  lg: 'h-12 text-base'
};

const paddingClasses: Record<InputSize, string> = {
  sm: 'ps-3 pe-3',
  md: 'ps-4 pe-4',
  lg: 'ps-5 pe-5'
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
{
  label,
  helperText,
  error,
  startIcon,
  endIcon,
  inputSize = 'md',
  fullWidth = true,
  className = '',
  disabled,
  required,
  id,
  dir = 'rtl',
  ...rest
},
ref)
{
  const generatedId = useId();
  const inputId = id ?? `input-${generatedId}`;
  const messageId = `${inputId}-message`;
  const hasError = Boolean(error);

  const wrapperWidth = fullWidth ? 'w-full' : 'w-auto';

  const fieldClasses = [
  'peer block w-full rounded-xl border bg-white text-slate-900 placeholder:text-slate-400',
  'transition-colors outline-none',
  sizeClasses[inputSize],
  paddingClasses[inputSize],
  startIcon ? 'ps-10' : '',
  endIcon ? 'pe-10' : '',
  hasError ?
  'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' :
  'border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20',
  disabled ? 'cursor-not-allowed bg-slate-50 text-slate-400' : '',
  className].

  filter(Boolean).
  join(' ');

  return (
    <div className={`${wrapperWidth} font-[inherit]`} dir={dir}>
      {label &&
      <label
        htmlFor={inputId}
        className={`mb-2 block text-sm font-medium ${
        disabled ? 'text-slate-400' : 'text-slate-700'}`
        }>
        
          {label}
          {required &&
        <span className="ms-1 text-red-500" aria-hidden="true">
              *
            </span>
        }
        </label>
      }

      <div className="relative">
        {startIcon &&
        <span
          className={`pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 ${
          hasError ? 'text-red-500' : 'text-slate-400'}`
          }
          aria-hidden="true">
          
            {startIcon}
          </span>
        }

        <input
          {...rest}
          id={inputId}
          ref={ref}
          dir={dir}
          disabled={disabled}
          required={required}
          aria-invalid={hasError || undefined}
          aria-describedby={error || helperText ? messageId : undefined}
          className={fieldClasses} />
        

        {endIcon &&
        <span
          className={`absolute inset-y-0 end-0 flex items-center pe-3 ${
          hasError ? 'text-red-500' : 'text-slate-400'}`
          }>
          
            {endIcon}
          </span>
        }
      </div>

      {(error || helperText) &&
      <p
        id={messageId}
        className={`mt-1.5 text-xs leading-5 ${
        hasError ? 'text-red-600' : 'text-slate-500'}`
        }
        role={hasError ? 'alert' : undefined}>
        
          {error || helperText}
        </p>
      }
    </div>);

});