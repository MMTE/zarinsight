import React, { SelectHTMLAttributes, forwardRef, useId } from 'react';
import { ChevronDownIcon } from 'lucide-react';

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps extends
  Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Options rendered inside the field. */
  options: SelectOption[];
  /** Visible field label. */
  label?: string;
  /** Placeholder shown when no value is selected. */
  placeholder?: string;
  /** Helper text shown below the field. */
  hint?: string;
  /** Error message — puts the field in the error state. */
  error?: string;
  /** Field height / typography scale. */
  size?: SelectSize;
  /** Stretch to the width of the container. */
  fullWidth?: boolean;
}

const sizeClasses: Record<SelectSize, string> = {
  sm: 'h-9 ps-3 pe-9 text-[13px]',
  md: 'h-11 ps-4 pe-10 text-sm',
  lg: 'h-12 ps-4 pe-11 text-base'
};

const chevronPosition: Record<SelectSize, string> = {
  sm: 'end-2.5',
  md: 'end-3',
  lg: 'end-3.5'
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
  {
    options,
    label,
    placeholder,
    hint,
    error,
    size = 'md',
    fullWidth = true,
    className = '',
    disabled,
    id,
    required,
    defaultValue,
    value,
    ...rest
  },
  ref)
  {
    const generatedId = useId();
    const selectId = id ?? `select-${generatedId}`;
    const messageId = `${selectId}-message`;
    const hasError = Boolean(error);

    return (
      <div
        dir="rtl"
        className={[
        'flex flex-col gap-1.5 text-right',
        fullWidth ? 'w-full' : 'w-fit'].
        join(' ')}>
        
        {label &&
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-slate-800">
          
            {label}
            {required &&
          <span className="text-red-600 ms-1" aria-hidden="true">
                *
              </span>
          }
          </label>
        }

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            required={required}
            value={value}
            defaultValue={value === undefined ? defaultValue ?? '' : undefined}
            aria-invalid={hasError || undefined}
            aria-describedby={error || hint ? messageId : undefined}
            className={[
            'w-full appearance-none rounded-xl border bg-white font-medium text-slate-900',
            'transition-colors outline-none',
            'focus-visible:ring-2 focus-visible:ring-offset-0',
            'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200',
            hasError ?
            'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-100' :
            'border-slate-200 hover:border-slate-300 focus-visible:border-blue-600 focus-visible:ring-blue-100',
            sizeClasses[size],
            className].
            join(' ')}
            {...rest}>
            
            {placeholder &&
            <option value="" disabled>
                {placeholder}
              </option>
            }
            {options.map((option) =>
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}>
              
                {option.label}
              </option>
            )}
          </select>

          <ChevronDownIcon
            aria-hidden="true"
            className={[
            'pointer-events-none absolute top-1/2 -translate-y-1/2',
            size === 'sm' ? 'h-4 w-4' : 'h-5 w-5',
            chevronPosition[size],
            disabled ?
            'text-slate-300' :
            hasError ?
            'text-red-500' :
            'text-slate-400'].
            join(' ')} />
          
        </div>

        {(error || hint) &&
        <p
          id={messageId}
          className={[
          'text-xs leading-5',
          hasError ? 'text-red-600' : 'text-slate-500'].
          join(' ')}>
          
            {error || hint}
          </p>
        }
      </div>);

  }
);