import React from 'react';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps {
  /** Controlled checked state */
  checked?: boolean;
  /** Uncontrolled initial state */
  defaultChecked?: boolean;
  /** Fired when the user toggles the switch */
  onChange?: (checked: boolean) => void;
  /** Visual size of the track/thumb */
  size?: SwitchSize;
  disabled?: boolean;
  /** Visible label rendered next to the switch */
  label?: string;
  /** Secondary helper text below the label */
  description?: string;
  /** Accessible name when no visible label is provided */
  'aria-label'?: string;
  id?: string;
  name?: string;
  className?: string;
}

const sizeStyles: Record<
  SwitchSize,
  {track: string;thumb: string;translate: string;label: string;}> =
{
  sm: {
    track: 'h-5 w-9',
    thumb: 'h-4 w-4',
    translate: 'translate-x-4',
    label: 'text-sm'
  },
  md: {
    track: 'h-6 w-11',
    thumb: 'h-5 w-5',
    translate: 'translate-x-5',
    label: 'text-sm'
  },
  lg: {
    track: 'h-7 w-[3.25rem]',
    thumb: 'h-6 w-6',
    translate: 'translate-x-6',
    label: 'text-base'
  }
};

export function Switch({
  checked,
  defaultChecked = false,
  onChange,
  size = 'md',
  disabled = false,
  label,
  description,
  id,
  name,
  className = '',
  ...rest
}: SwitchProps) {
  const generatedId = React.useId();
  const switchId = id ?? generatedId;
  const descriptionId = description ? `${switchId}-description` : undefined;

  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const isChecked = isControlled ? checked : internalChecked;

  const styles = sizeStyles[size];

  const toggle = () => {
    if (disabled) return;
    const next = !isChecked;
    if (!isControlled) setInternalChecked(next);
    onChange?.(next);
  };

  const control =
  <button
    type="button"
    role="switch"
    id={switchId}
    name={name}
    aria-checked={isChecked}
    aria-label={!label ? rest['aria-label'] : undefined}
    aria-describedby={descriptionId}
    disabled={disabled}
    onClick={toggle}
    className={[
    'relative inline-flex shrink-0 cursor-pointer items-center rounded-full',
    'border-2 border-transparent transition-colors duration-200 ease-out',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    styles.track,
    isChecked ? 'bg-blue-600' : 'bg-slate-300',
    label || description ? '' : className].

    filter(Boolean).
    join(' ')}>
    
      <span
      aria-hidden="true"
      className={[
      'pointer-events-none inline-block transform rounded-full bg-white shadow',
      'ring-0 transition duration-200 ease-out',
      styles.thumb,
      isChecked ? styles.translate : 'translate-x-0'].
      join(' ')} />
    
    </button>;


  if (!label && !description) return control;

  return (
    <div className={['flex items-start gap-3', className].filter(Boolean).join(' ')}>
      {control}
      <div className="min-w-0">
        {label &&
        <label
          htmlFor={switchId}
          onClick={(event) => {
            event.preventDefault();
            toggle();
          }}
          className={[
          'block font-medium text-slate-900',
          styles.label,
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'].
          join(' ')}>
          
            {label}
          </label>
        }
        {description &&
        <p
          id={descriptionId}
          className={[
          'mt-0.5 text-sm text-slate-500',
          disabled ? 'opacity-50' : ''].

          filter(Boolean).
          join(' ')}>
          
            {description}
          </p>
        }
      </div>
    </div>);

}