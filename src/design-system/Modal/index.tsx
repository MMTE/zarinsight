import React, { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';

export type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalProps {
  /** Controls visibility of the modal. */
  open: boolean;
  /** Called when the user dismisses the modal (overlay click, Escape, close button). */
  onClose: () => void;
  /** Title rendered in the header. */
  title?: React.ReactNode;
  /** Supporting text rendered under the title. */
  description?: React.ReactNode;
  /** Main body content. */
  children?: React.ReactNode;
  /** Action row rendered at the bottom of the dialog. */
  footer?: React.ReactNode;
  /** Max width of the dialog. Defaults to "md". */
  size?: ModalSize;
  /** Show the close (X) button in the header. Defaults to true. */
  showCloseButton?: boolean;
  /** Allow dismissing by clicking the overlay or pressing Escape. Defaults to true. */
  dismissible?: boolean;
  /** Text direction of the dialog content. Defaults to "rtl". */
  dir?: 'rtl' | 'ltr';
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl'
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
  dismissible = true,
  dir = 'rtl'
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  const handleClose = useCallback(() => {
    if (dismissible) onClose();
  }, [dismissible, onClose]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        handleClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, handleClose]);

  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open ?
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={handleClose}
          aria-hidden="true" />
        
          <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={typeof title === 'string' ? title : undefined}
          tabIndex={-1}
          dir={dir}
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className={`relative w-full ${sizeClasses[size]} rounded-2xl bg-white shadow-xl ring-1 ring-slate-900/5 outline-none`}>
          
            {(title || showCloseButton) &&
          <div className="flex items-start gap-3 px-6 pt-6">
                <div className="min-w-0 flex-1">
                  {title ?
              <h2 className="text-lg font-bold text-slate-900">{title}</h2> :
              null}
                  {description ?
              <p className="mt-1 text-sm leading-6 text-slate-500">
                      {description}
                    </p> :
              null}
                </div>
                {showCloseButton ?
            <button
              type="button"
              onClick={onClose}
              aria-label="بستن"
              className="-m-1 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
              
                    <XIcon className="h-5 w-5" aria-hidden="true" />
                  </button> :
            null}
              </div>
          }

            {children ?
          <div className="px-6 py-5 text-sm leading-6 text-slate-600">
                {children}
              </div> :

          <div className="h-5" />
          }

            {footer ?
          <div className="flex flex-wrap items-center justify-start gap-3 rounded-b-2xl border-t border-slate-100 bg-slate-50 px-6 py-4">
                {footer}
              </div> :
          null}
          </motion.div>
        </div> :
      null}
    </AnimatePresence>,
    document.body
  );
}