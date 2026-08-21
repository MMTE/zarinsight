import React, { createContext, useContext, useId, useState } from 'react';

export type RadioGroupOrientation = 'vertical' | 'horizontal';

export interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  disabled: boolean;
  onChange: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export function useRadioGroupContext(): RadioGroupContextValue {
  const ctx = useContext(RadioGroupContext);
  if (!ctx) {
    throw new Error('RadioGroupItem must be used inside a RadioGroup');
  }
  return ctx;
}

export interface RadioGroupProps {
  /** Accessible label rendered above the options */
  label?: string;
  /** Helper text rendered under the label */
  description?: string;
  /** Controlled selected value */
  value?: string;
  /** Initial value when uncontrolled */
  defaultValue?: string;
  /** Shared input name; auto-generated when omitted */
  name?: string;
  /** Disables every option in the group */
  disabled?: boolean;
  /** Layout direction of the options */
  orientation?: RadioGroupOrientation;
  /** Error message; also switches items to the error style */
  error?: string;
  onChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

export function RadioGroup({
  label,
  description,
  value,
  defaultValue,
  name,
  disabled = false,
  orientation = 'vertical',
  error,
  onChange,
  className = '',
  children
}: RadioGroupProps) {
  const autoId = useId();
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleChange = (next: string) => {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  const labelId = `${autoId}-label`;
  const descriptionId = `${autoId}-description`;
  const errorId = `${autoId}-error`;

  return (
    <RadioGroupContext.Provider
      value={{
        name: name ?? autoId,
        value: currentValue,
        disabled,
        onChange: handleChange
      }}>
      
      <div className={className}>
        {(label || description) &&
        <div className="mb-3">
            {label &&
          <div id={labelId} className="text-sm font-semibold text-slate-900">
                {label}
              </div>
          }
            {description &&
          <p id={descriptionId} className="mt-1 text-sm text-slate-500">
                {description}
              </p>
          }
          </div>
        }
        <div
          role="radiogroup"
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={
          [description ? descriptionId : null, error ? errorId : null].
          filter(Boolean).
          join(' ') || undefined
          }
          aria-invalid={error ? true : undefined}
          className={
          orientation === 'horizontal' ?
          'flex flex-wrap gap-3' :
          'flex flex-col gap-3'
          }>
          
          {children}
        </div>
        {error &&
        <p id={errorId} className="mt-2 text-sm text-red-600">
            {error}
          </p>
        }
      </div>
    </RadioGroupContext.Provider>);

}

export interface RadioGroupItemProps {
  value: string;
  label: React.ReactNode;
  /** Secondary line under the label */
  description?: React.ReactNode;
  /** Trailing content, e.g. an amount or badge */
  trailing?: React.ReactNode;
  disabled?: boolean;
  /** Renders the option inside a bordered, selectable card */
  variant?: 'plain' | 'card';
  className?: string;
}

export function RadioGroupItem({
  value,
  label,
  description,
  trailing,
  disabled,
  variant = 'plain',
  className = ''
}: RadioGroupItemProps) {
  const group = useRadioGroupContext();
  const isDisabled = group.disabled || Boolean(disabled);
  const checked = group.value === value;
  const inputId = `${group.name}-${value}`;

  const containerClasses =
  variant === 'card' ?
  [
  'group flex w-full items-start gap-3 rounded-xl border p-4 transition-colors',
  isDisabled ?
  'cursor-not-allowed border-slate-200 bg-slate-50 opacity-60' :
  'cursor-pointer',
  !isDisabled && checked ?
  'border-blue-600 bg-blue-50/60' :
  !isDisabled ?
  'border-slate-200 bg-white hover:border-slate-300' :
  ''].
  join(' ') :
  [
  'group flex w-full items-start gap-3',
  isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'].
  join(' ');

  return (
    <label htmlFor={inputId} className={`${containerClasses} ${className}`.trim()}>
      <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
        <input
          id={inputId}
          type="radio"
          name={group.name}
          value={value}
          checked={checked}
          disabled={isDisabled}
          onChange={() => group.onChange(value)}
          className="peer absolute h-5 w-5 cursor-[inherit] appearance-none rounded-full border border-slate-300 bg-white transition-colors checked:border-blue-600 checked:border-[6px] disabled:border-slate-200 disabled:bg-slate-100" />
        
        <span
          aria-hidden="true"
          className="pointer-events-none absolute h-5 w-5 rounded-full ring-offset-2 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600" />
        
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={`block text-sm font-medium ${
          isDisabled ? 'text-slate-400' : 'text-slate-900'}`
          }>
          
          {label}
        </span>
        {description &&
        <span
          className={`mt-0.5 block text-sm ${
          isDisabled ? 'text-slate-400' : 'text-slate-500'}`
          }>
          
            {description}
          </span>
        }
      </span>
      {trailing &&
      <span className="shrink-0 text-sm font-semibold text-slate-700">{trailing}</span>
      }
    </label>);

}