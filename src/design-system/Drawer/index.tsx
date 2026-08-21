import React, { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';

export type DrawerSide = 'right' | 'left';
export type DrawerSize = 'sm' | 'md' | 'lg';

export interface DrawerProps {
  /** Whether the drawer is visible. */
  open: boolean;
  /** Called when the user dismisses the drawer (overlay click, Escape, close button). */
  onClose: () => void;
  /** Panel title rendered in the header. */
  title?: React.ReactNode;
  /** Secondary line under the title. */
  description?: React.ReactNode;
  /** Panel body content. */
  children?: React.ReactNode;
  /** Sticky action area pinned to the bottom of the panel. */
  footer?: React.ReactNode;
  /** Which edge the panel is anchored to. Defaults to `right` (the leading edge in RTL). */
  side?: DrawerSide;
  /** Panel width. */
  size?: DrawerSize;
  /** Show the header close button. Defaults to true. */
  showCloseButton?: boolean;
  /** Allow dismissing by clicking the overlay. Defaults to true. */
  closeOnOverlayClick?: boolean;
  /** Text direction of the panel content. Defaults to `rtl`. */
  dir?: 'rtl' | 'ltr';
  /** Extra classes for the panel element. */
  className?: string;
}

const SIZE_CLASSES: Record<DrawerSize, string> = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-2xl'
};

export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  side = 'right',
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  dir = 'rtl',
  className = ''
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    const raf = window.requestAnimationFrame(() => {
      panelRef.current?.focus();
    });
    return () => {
      window.cancelAnimationFrame(raf);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [open, handleKeyDown]);

  if (typeof document === 'undefined') return null;

  const offscreen = side === 'right' ? '100%' : '-100%';

  return createPortal(
    <AnimatePresence>
      {open ?
      <div className="fixed inset-0 z-50" dir={dir}>
          <motion.div
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={closeOnOverlayClick ? onClose : undefined}
          aria-hidden="true" />
        
          <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={typeof title === 'string' ? title : undefined}
          tabIndex={-1}
          initial={{ x: offscreen }}
          animate={{ x: 0 }}
          exit={{ x: offscreen }}
          transition={{ type: 'spring', stiffness: 420, damping: 40, mass: 0.9 }}
          className={[
          'absolute inset-y-0 flex w-full flex-col bg-white shadow-2xl outline-none',
          side === 'right' ? 'right-0' : 'left-0',
          SIZE_CLASSES[size],
          className].

          filter(Boolean).
          join(' ')}>
          
            {(title || description || showCloseButton) &&
          <header className="flex items-start gap-4 border-b border-slate-200 px-6 py-5">
                <div className="min-w-0 flex-1">
                  {title ?
              <h2 className="truncate text-lg font-bold text-slate-900">{title}</h2> :
              null}
                  {description ?
              <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p> :
              null}
                </div>
                {showCloseButton ?
            <button
              type="button"
              onClick={onClose}
              aria-label="بستن"
              className="-m-1.5 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
              
                    <XIcon className="h-5 w-5" aria-hidden="true" />
                  </button> :
            null}
              </header>
          }

            <div className="flex-1 overflow-y-auto px-6 py-5 text-sm leading-7 text-slate-700">
              {children}
            </div>

            {footer ?
          <footer className="border-t border-slate-200 bg-slate-50 px-6 py-4">{footer}</footer> :
          null}
          </motion.div>
        </div> :
      null}
    </AnimatePresence>,
    document.body
  );
}