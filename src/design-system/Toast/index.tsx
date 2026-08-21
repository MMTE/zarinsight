import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  InfoIcon,
  XCircleIcon,
  XIcon } from
'lucide-react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export type ToastProps = {
  /** Short headline shown in bold. */
  title: string;
  /** Optional supporting line of text. */
  description?: string;
  /** Visual intent of the notification. */
  variant?: ToastVariant;
  /** Called when the user dismisses the toast. Hides the close button when omitted. */
  onClose?: () => void;
  /** Optional inline action, e.g. "Undo" or "Retry". */
  action?: {label: string;onClick: () => void;};
  /** Text direction. Zarinpal surfaces are primarily RTL. */
  dir?: 'rtl' | 'ltr';
  className?: string;
};

const variantStyles: Record<
  ToastVariant,
  {icon: React.ComponentType<{className?: string;}>;iconClass: string;ring: string;}> =
{
  success: { icon: CheckCircle2Icon, iconClass: 'text-emerald-600', ring: 'ring-emerald-100' },
  error: { icon: XCircleIcon, iconClass: 'text-red-600', ring: 'ring-red-100' },
  warning: { icon: AlertTriangleIcon, iconClass: 'text-amber-500', ring: 'ring-amber-100' },
  info: { icon: InfoIcon, iconClass: 'text-blue-600', ring: 'ring-blue-100' }
};

export function Toast({
  title,
  description,
  variant = 'info',
  onClose,
  action,
  dir = 'rtl',
  className = ''
}: ToastProps) {
  const { icon: VariantIcon, iconClass, ring } = variantStyles[variant];

  return (
    <div
      dir={dir}
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
      className={`pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-lg shadow-slate-900/10 ring-1 ${ring} ${className}`}>
      
      <VariantIcon className={`mt-0.5 h-5 w-5 shrink-0 ${iconClass}`} aria-hidden="true" />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold leading-6 text-slate-900">{title}</p>
        {description ?
        <p className="mt-0.5 text-sm leading-6 text-slate-500">{description}</p> :
        null}
        {action ?
        <button
          type="button"
          onClick={action.onClick}
          className="mt-2 rounded-lg text-sm font-bold text-blue-700 underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
          
            {action.label}
          </button> :
        null}
      </div>

      {onClose ?
      <button
        type="button"
        onClick={onClose}
        aria-label="بستن"
        className="-me-1 shrink-0 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
        
          <XIcon className="h-4 w-4" aria-hidden="true" />
        </button> :
      null}
    </div>);

}

/* ---------------------------------- Stack --------------------------------- */

export type ToastItem = ToastProps & {id: string;duration?: number;};

export type ToastViewportProps = {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
  /** Horizontal anchoring of the top-of-screen stack. */
  align?: 'start' | 'center' | 'end';
  /** Render fixed to the viewport. Disable for embedded/demo usage. */
  fixed?: boolean;
  className?: string;
};

export function ToastViewport({
  toasts,
  onDismiss,
  align = 'center',
  fixed = true,
  className = ''
}: ToastViewportProps) {
  const alignClass =
  align === 'start' ? 'items-start' : align === 'end' ? 'items-end' : 'items-center';

  return (
    <div
      className={`pointer-events-none z-50 flex w-full flex-col gap-3 px-4 ${alignClass} ${
      fixed ? 'fixed inset-x-0 top-4' : 'relative'} ${
      className}`}>
      
      <AnimatePresence initial={false}>
        {toasts.map((toast) =>
        <motion.div
          key={toast.id}
          layout
          initial={{ opacity: 0, y: -16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 500, damping: 36, mass: 0.7 }}
          className="w-full max-w-md">
          
            <ToastWithTimer toast={toast} onDismiss={onDismiss} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>);

}

function ToastWithTimer({
  toast,
  onDismiss



}: {toast: ToastItem;onDismiss: (id: string) => void;}) {
  const { id, duration = 4000, ...rest } = toast;

  useEffect(() => {
    if (duration === 0) return;
    const timer = window.setTimeout(() => onDismiss(id), duration);
    return () => window.clearTimeout(timer);
  }, [id, duration, onDismiss]);

  return <Toast {...rest} onClose={() => onDismiss(id)} />;
}

/* --------------------------------- Context -------------------------------- */

type ToastContextValue = {
  toasts: ToastItem[];
  toast: (options: Omit<ToastItem, 'id'>) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({
  children,
  align = 'center'



}: {children: React.ReactNode;align?: ToastViewportProps['align'];}) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback((options: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((current) => [...current, { ...options, id }]);
    return id;
  }, []);

  const value = useMemo(() => ({ toasts, toast, dismiss }), [toasts, toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} align={align} />
    </ToastContext.Provider>);

}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
}