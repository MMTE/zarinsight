import { useId, useRef } from 'react';

export type PeriodOption = {
  /** Unique value for the period, e.g. '7d' */
  value: string;
  /** Visible label, e.g. '۷ روز' */
  label: string;
  /** Disables this single option */
  disabled?: boolean;
};

export type PeriodSelectorProps = {
  /** Selectable periods */
  options: PeriodOption[];
  /** Currently selected period value */
  value: string;
  /** Fired when the user picks a different period */
  onChange: (value: string) => void;
  /** Accessible label for the group */
  label?: string;
  /** Control density */
  size?: 'sm' | 'md';
  /** Disables the whole control */
  disabled?: boolean;
  /** Shows a subtle loading state while new data is fetched */
  loading?: boolean;
  className?: string;
};

const sizeStyles: Record<NonNullable<PeriodSelectorProps['size']>, string> = {
  sm: 'text-xs px-3 h-7',
  md: 'text-sm px-4 h-9'
};

export function PeriodSelector({
  options,
  value,
  onChange,
  label = 'بازه زمانی',
  size = 'md',
  disabled = false,
  loading = false,
  className = ''
}: PeriodSelectorProps) {
  const groupId = useId();
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);

  const enabledIndexes = options.
  map((option, index) => option.disabled ? -1 : index).
  filter((index) => index !== -1);

  const focusAt = (index: number) => {
    const button = buttonsRef.current[index];
    if (button) {
      button.focus();
      onChange(options[index].value);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();

    const position = enabledIndexes.indexOf(index);
    if (position === -1) return;

    // RTL control: ArrowLeft moves forward, ArrowRight moves back.
    let nextPosition = position;
    if (event.key === 'ArrowLeft') nextPosition = (position + 1) % enabledIndexes.length;
    if (event.key === 'ArrowRight')
    nextPosition = (position - 1 + enabledIndexes.length) % enabledIndexes.length;
    if (event.key === 'Home') nextPosition = 0;
    if (event.key === 'End') nextPosition = enabledIndexes.length - 1;

    focusAt(enabledIndexes[nextPosition]);
  };

  return (
    <div
      dir="rtl"
      role="radiogroup"
      aria-label={label}
      aria-busy={loading || undefined}
      id={groupId}
      className={[
      'inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1',
      disabled ? 'opacity-50' : '',
      loading ? 'animate-pulse' : '',
      className].

      filter(Boolean).
      join(' ')}>
      
      {options.map((option, index) => {
        const selected = option.value === value;
        const isDisabled = disabled || option.disabled;

        return (
          <button
            key={option.value}
            ref={(node) => {
              buttonsRef.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={isDisabled}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={[
            'inline-flex items-center justify-center rounded-full font-medium whitespace-nowrap',
            'transition-colors duration-150 outline-none',
            'focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50',
            sizeStyles[size],
            selected ?
            'bg-blue-600 text-white shadow-sm' :
            'text-slate-600 hover:bg-white hover:text-slate-900',
            isDisabled ? 'cursor-not-allowed hover:bg-transparent hover:text-slate-600' : ''].

            filter(Boolean).
            join(' ')}>
            
            {option.label}
          </button>);

      })}
    </div>);

}