import React, { cloneElement, isValidElement, useCallback, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /** Text (or rich content) shown inside the tooltip bubble. */
  content: React.ReactNode;
  /** The trigger element. Must accept a ref and DOM event handlers. */
  children: React.ReactElement;
  /** Side of the trigger the tooltip appears on. Defaults to 'top'. */
  placement?: TooltipPlacement;
  /** Delay in ms before showing on hover. Defaults to 150. */
  delay?: number;
  /** Disables the tooltip entirely. */
  disabled?: boolean;
  /** Extra classes for the tooltip bubble. */
  className?: string;
}

const placementClasses: Record<TooltipPlacement, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2'
};

const arrowClasses: Record<TooltipPlacement, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 -mt-1',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1',
  left: 'left-full top-1/2 -translate-y-1/2 -ml-1',
  right: 'right-full top-1/2 -translate-y-1/2 -mr-1'
};

const motionOffset: Record<TooltipPlacement, {x: number;y: number;}> = {
  top: { x: 0, y: 4 },
  bottom: { x: 0, y: -4 },
  left: { x: 4, y: 0 },
  right: { x: -4, y: 0 }
};

export function Tooltip({
  content,
  children,
  placement = 'top',
  delay = 150,
  disabled = false,
  className = ''
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = useId();

  const clear = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const show = useCallback(
    (immediate = false) => {
      if (disabled) return;
      clear();
      if (immediate || delay <= 0) {
        setOpen(true);
        return;
      }
      timer.current = setTimeout(() => setOpen(true), delay);
    },
    [clear, delay, disabled]
  );

  const hide = useCallback(() => {
    clear();
    setOpen(false);
  }, [clear]);

  useEffect(() => clear, [clear]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') hide();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, hide]);

  if (!isValidElement(children)) return children ?? null;

  const trigger = cloneElement(children as React.ReactElement<Record<string, unknown>>, {
    'aria-describedby': open && !disabled ? tooltipId : undefined,
    onMouseEnter: (event: React.MouseEvent) => {
      ;(children.props as {onMouseEnter?: (e: React.MouseEvent) => void;}).onMouseEnter?.(event);
      show();
    },
    onMouseLeave: (event: React.MouseEvent) => {
      ;(children.props as {onMouseLeave?: (e: React.MouseEvent) => void;}).onMouseLeave?.(event);
      hide();
    },
    onFocus: (event: React.FocusEvent) => {
      ;(children.props as {onFocus?: (e: React.FocusEvent) => void;}).onFocus?.(event);
      show(true);
    },
    onBlur: (event: React.FocusEvent) => {
      ;(children.props as {onBlur?: (e: React.FocusEvent) => void;}).onBlur?.(event);
      hide();
    }
  });

  return (
    <span className="relative inline-flex">
      {trigger}
      <AnimatePresence>
        {open && !disabled &&
        <motion.span
          id={tooltipId}
          role="tooltip"
          initial={{ opacity: 0, scale: 0.96, ...motionOffset[placement] }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, ...motionOffset[placement] }}
          transition={{ duration: 0.14, ease: 'easeOut' }}
          className={`pointer-events-none absolute z-50 w-max max-w-xs rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium leading-5 text-white shadow-lg shadow-slate-900/20 ${placementClasses[placement]} ${className}`}>
          
            {content}
            <span
            aria-hidden="true"
            className={`absolute h-2 w-2 rotate-45 bg-slate-900 ${arrowClasses[placement]}`} />
          
          </motion.span>
        }
      </AnimatePresence>
    </span>);

}