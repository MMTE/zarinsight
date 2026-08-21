import React, { forwardRef, useId } from 'react';

export type TextareaSize = 'sm' | 'md' | 'lg';

export interface TextareaProps extends
  React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Visible label rendered above the field */
  label?: string;
  /** Helper text rendered below the field */
  hint?: string;
  /** Error message. When set, the field renders in an invalid state */
  error?: string;
  /** Control height / typography scale */
  size?: TextareaSize;
  /** Stretch to the full width of the parent */
  fullWidth?: boolean;
  /** Show a live character counter (requires maxLength) */
  showCount?: boolean;
  /** Resize behaviour of the textarea */
  resize?: 'none' | 'vertical' | 'both';
}

const sizeClasses: Record<TextareaSize, string> = {
  sm: 'px-3 py-2 text-sm min-h-[72px]',
  md: 'px-3.5 py-2.5 text-sm min-h-[96px]',
  lg: 'px-4 py-3 text-base min-h-[128px]'
};

const resizeClasses: Record<NonNullable<TextareaProps['resize']>, string> = {
  none: 'resize-none',
  vertical: 'resize-y',
  both: 'resize'
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
  {
    label,
    hint,
    error,
    size = 'md',
    fullWidth = true,
    showCount = false,
    resize = 'vertical',
    className = '',
    disabled,
    required,
    id,
    maxLength,
    value,
    defaultValue,
    onChange,
    ...rest
  },
  ref)
  {
    const generatedId = useId();
    const textareaId = id ?? `textarea-${generatedId}`;
    const hintId = `${textareaId}-hint`;
    const errorId = `${textareaId}-error`;

    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState(
      typeof defaultValue === 'string' ? defaultValue : ''
    );
    const currentValue = isControlled ? String(value ?? '') : internalValue;

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!isControlled) setInternalValue(event.target.value);
      onChange?.(event);
    };

    const describedBy =
    [error ? errorId : null, hint && !error ? hintId : null].
    filter(Boolean).
    join(' ') || undefined;

    return (
      <div className={fullWidth ? 'w-full' : 'inline-block'}>
        {label &&
        <label
          htmlFor={textareaId}
          className={`mb-1.5 block text-sm font-medium ${
          disabled ? 'text-slate-400' : 'text-slate-800'}`
          }>
          
            {label}
            {required &&
          <span className="ml-1 text-red-600" aria-hidden="true">
                *
              </span>
          }
          </label>
        }

        <textarea
          {...rest}
          ref={ref}
          id={textareaId}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          value={isControlled ? value : undefined}
          defaultValue={isControlled ? undefined : defaultValue}
          onChange={handleChange}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={[
          'block w-full rounded-xl border bg-white text-slate-900 shadow-sm outline-none transition-colors',
          'placeholder:text-slate-400',
          'focus:ring-4',
          sizeClasses[size],
          resizeClasses[resize],
          error ?
          'border-red-500 focus:border-red-500 focus:ring-red-100' :
          'border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-blue-100',
          disabled ?
          'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400 shadow-none hover:border-slate-200' :
          '',
          className].

          filter(Boolean).
          join(' ')} />
        

        {(error || hint || showCount && maxLength) &&
        <div className="mt-1.5 flex items-start justify-between gap-3">
            <p
            id={error ? errorId : hintId}
            className={`text-xs ${error ? 'text-red-600' : 'text-slate-500'}`}>
            
              {error || hint}
            </p>
            {showCount && maxLength ?
          <span
            className={`shrink-0 text-xs tabular-nums ${
            currentValue.length >= maxLength ?
            'text-red-600' :
            'text-slate-400'}`
            }>
            
                {currentValue.length}/{maxLength}
              </span> :
          null}
          </div>
        }
      </div>);

  }
);