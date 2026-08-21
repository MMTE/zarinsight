import React, { forwardRef, useEffect, useRef } from 'react';
import { CheckIcon, MinusIcon } from 'lucide-react';

export type CheckboxSize = 'sm' | 'md';

export interface CheckboxProps extends
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Visible label rendered next to the control */
  label?: React.ReactNode;
  /** Supporting text rendered under the label */
  description?: React.ReactNode;
  /** Error message; also renders the control in an error state */
  error?: string;
  /** Partially selected state (e.g. a "select all" header checkbox) */
  indeterminate?: boolean;
  /** Control size. Defaults to `md` */
  size?: CheckboxSize;
}

const boxSizes: Record<CheckboxSize, string> = {
  sm: 'h-4 w-4 rounded',
  md: 'h-5 w-5 rounded-md'
};

const iconSizes: Record<CheckboxSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5'
};

const labelSizes: Record<CheckboxSize, string> = {
  sm: 'text-sm',
  md: 'text-[15px]'
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
{
  label,
  description,
  error,
  indeterminate = false,
  size = 'md',
  className = '',
  disabled,
  id,
  ...props
},
ref)
{
  const innerRef = useRef<HTMLInputElement | null>(null);
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  useEffect(() => {
    if (innerRef.current) {
      innerRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const setRefs = (node: HTMLInputElement | null) => {
    innerRef.current = node;
    if (typeof ref === 'function') ref(node);else
    if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-start gap-2.5">
        <span className="relative inline-flex shrink-0 items-center justify-center">
          <input
            {...props}
            id={inputId}
            ref={setRefs}
            type="checkbox"
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}
            className={`peer appearance-none border bg-white transition-colors duration-150
              ${boxSizes[size]}
              ${
            error ?
            'border-red-500 focus-visible:ring-red-500/30' :
            'border-slate-300 hover:border-blue-500 focus-visible:ring-blue-600/30'}
              checked:border-blue-600 checked:bg-blue-600
              indeterminate:border-blue-600 indeterminate:bg-blue-600
              focus-visible:outline-none focus-visible:ring-4
              disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100
              disabled:checked:border-slate-300 disabled:checked:bg-slate-300
              ${
            disabled ? '' : 'cursor-pointer'}`} />
          
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 peer-indeterminate:opacity-100">
            
            {indeterminate ?
            <MinusIcon className={`${iconSizes[size]} stroke-[3]`} /> :

            <CheckIcon className={`${iconSizes[size]} stroke-[3]`} />
            }
          </span>
        </span>

        {(label || description) &&
        <div className="flex flex-col gap-0.5 leading-tight">
            {label &&
          <label
            htmlFor={inputId}
            className={`${labelSizes[size]} font-medium ${
            disabled ? 'cursor-not-allowed text-slate-400' : 'cursor-pointer text-slate-900'}`
            }>
            
                {label}
              </label>
          }
            {description &&
          <span
            id={descriptionId}
            className={`text-xs ${disabled ? 'text-slate-300' : 'text-slate-500'}`}>
            
                {description}
              </span>
          }
          </div>
        }
      </div>

      {error &&
      <p id={errorId} className="text-xs font-medium text-red-600">
          {error}
        </p>
      }
    </div>);

});