import React, { createContext, useContext, useId, useMemo, useRef, useState } from 'react';

export type TabsVariant = 'segmented' | 'underline';
export type TabsSize = 'sm' | 'md';

export interface TabItem {
  /** Unique identifier for the tab */
  value: string;
  /** Visible label */
  label: React.ReactNode;
  /** Optional leading icon */
  icon?: React.ReactNode;
  /** Optional trailing count / badge value */
  badge?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  /** Controlled active value */
  value?: string;
  /** Initial value for uncontrolled usage */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: TabsVariant;
  size?: TabsSize;
  /** Stretch tabs to fill the available width */
  fullWidth?: boolean;
  'aria-label'?: string;
  className?: string;
  /** Panel content rendered below the tab list */
  children?: React.ReactNode;
}

interface TabsContextValue {
  activeValue: string;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

const sizeStyles: Record<TabsSize, string> = {
  sm: 'text-[13px] leading-5 px-3 py-1.5 gap-1.5',
  md: 'text-sm leading-5 px-4 py-2 gap-2'
};

export function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  variant = 'segmented',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...rest
}: TabsProps) {
  const firstEnabled = items.find((item) => !item.disabled)?.value ?? items[0]?.value ?? '';
  const [internalValue, setInternalValue] = useState(defaultValue ?? firstEnabled);
  const activeValue = value !== undefined ? value : internalValue;
  const baseId = useId();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const selectTab = (next: string) => {
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();

    const enabled = items.filter((item) => !item.disabled);
    if (enabled.length === 0) return;
    const currentIndex = Math.max(
      0,
      enabled.findIndex((item) => item.value === activeValue)
    );
    const isRtl = typeof document !== 'undefined' && document.dir === 'rtl';
    const forward = isRtl ? 'ArrowLeft' : 'ArrowRight';

    let nextIndex = currentIndex;
    if (event.key === 'Home') nextIndex = 0;else
    if (event.key === 'End') nextIndex = enabled.length - 1;else
    if (event.key === forward) nextIndex = (currentIndex + 1) % enabled.length;else
    nextIndex = (currentIndex - 1 + enabled.length) % enabled.length;

    const nextValue = enabled[nextIndex].value;
    selectTab(nextValue);
    tabRefs.current[nextValue]?.focus();
  };

  const contextValue = useMemo<TabsContextValue>(() => ({ activeValue, baseId }), [activeValue, baseId]);

  const listClasses =
  variant === 'segmented' ?
  'inline-flex items-center gap-1 rounded-xl bg-slate-100 p-1' :
  'inline-flex items-end gap-1 border-b border-slate-200';

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={`w-full ${className}`}>
        <div
          role="tablist"
          aria-label={rest['aria-label']}
          onKeyDown={onKeyDown}
          className={`${listClasses} ${fullWidth ? 'flex w-full' : ''}`}>
          
          {items.map((item) => {
            const isActive = item.value === activeValue;
            const base = `relative inline-flex items-center justify-center font-medium transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-40 ${sizeStyles[size]} ${fullWidth ? 'flex-1' : ''}`;

            const variantClasses =
            variant === 'segmented' ?
            isActive ?
            'rounded-lg bg-white text-slate-900 shadow-sm' :
            'rounded-lg text-slate-500 hover:text-slate-900' :
            isActive ?
            'rounded-t-lg text-blue-700 after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full after:bg-blue-600' :
            'rounded-t-lg text-slate-500 hover:text-slate-900';

            return (
              <button
                key={item.value}
                ref={(node) => {
                  tabRefs.current[item.value] = node;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${item.value}`}
                aria-selected={isActive}
                aria-controls={`${baseId}-panel-${item.value}`}
                tabIndex={isActive ? 0 : -1}
                disabled={item.disabled}
                onClick={() => selectTab(item.value)}
                className={`${base} ${variantClasses}`}>
                
                {item.icon ? <span className="shrink-0" aria-hidden="true">{item.icon}</span> : null}
                <span className="truncate">{item.label}</span>
                {item.badge !== undefined ?
                <span
                  className={`ml-0.5 inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'bg-slate-200 text-slate-600'}`
                  }>
                  
                    {item.badge}
                  </span> :
                null}
              </button>);

          })}
        </div>
        {children}
      </div>
    </TabsContext.Provider>);

}

export interface TabPanelProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export function TabPanel({ value, className = '', children }: TabPanelProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabPanel must be used inside Tabs');
  const isActive = context.activeValue === value;

  return (
    <div
      role="tabpanel"
      id={`${context.baseId}-panel-${value}`}
      aria-labelledby={`${context.baseId}-tab-${value}`}
      hidden={!isActive}
      tabIndex={0}
      className={`mt-4 text-sm text-slate-600 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${className}`}>
      
      {isActive ? children : null}
    </div>);

}