import React from 'react';
import { CheckIcon } from 'lucide-react';

export type PricingCardFeature = {
  label: string;
  included?: boolean;
};

export interface PricingCardProps {
  /** Plan name, e.g. "پایه" */
  name: string;
  /** Short supporting description under the plan name */
  description?: string;
  /** Formatted price, e.g. "۱۹۹٬۰۰۰" or "رایگان" */
  price: string;
  /** Currency / unit suffix, e.g. "تومان" */
  currency?: string;
  /** Billing period, e.g. "ماهانه" */
  period?: string;
  /** Feature rows shown in the list */
  features: PricingCardFeature[];
  /** CTA label */
  ctaLabel?: string;
  /** CTA click handler */
  onCtaClick?: () => void;
  /** Renders the emphasized, dark variant with a badge */
  featured?: boolean;
  /** Badge text shown when featured */
  badge?: string;
  /** Disables the CTA */
  disabled?: boolean;
  /** Text direction of the card content */
  dir?: 'rtl' | 'ltr';
  className?: string;
}

export function PricingCard({
  name,
  description,
  price,
  currency,
  period,
  features,
  ctaLabel = 'شروع کنید',
  onCtaClick,
  featured = false,
  badge = 'پیشنهاد ویژه',
  disabled = false,
  dir = 'rtl',
  className = ''
}: PricingCardProps) {
  const surface = featured ?
  'bg-[#161B2E] border-transparent text-white' :
  'bg-white border-slate-200 text-slate-900';

  return (
    <article
      dir={dir}
      className={[
      'relative flex w-full max-w-sm flex-col rounded-3xl border p-8 shadow-sm transition-shadow duration-200 hover:shadow-md',
      surface,
      className].
      join(' ')}>
      
      {featured &&
      <span className="absolute -top-3 start-8 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
          {badge}
        </span>
      }

      <header>
        <h3 className={`text-lg font-bold ${featured ? 'text-white' : 'text-slate-900'}`}>
          {name}
        </h3>
        {description &&
        <p className={`mt-2 text-sm leading-6 ${featured ? 'text-slate-300' : 'text-slate-500'}`}>
            {description}
          </p>
        }
      </header>

      <div className="mt-6 flex flex-wrap items-baseline gap-x-2">
        <span className={`text-4xl font-extrabold tracking-tight ${featured ? 'text-white' : 'text-slate-900'}`}>
          {price}
        </span>
        {currency &&
        <span className={`text-base font-semibold ${featured ? 'text-slate-300' : 'text-slate-600'}`}>
            {currency}
          </span>
        }
        {period &&
        <span className={`text-sm ${featured ? 'text-slate-400' : 'text-slate-400'}`}>
            / {period}
          </span>
        }
      </div>

      <ul role="list" className="mt-6 flex flex-1 flex-col gap-3">
        {features.map((feature) => {
          const included = feature.included !== false;
          return (
            <li key={feature.label} className="flex items-start gap-3 text-sm leading-6">
              <span
                aria-hidden="true"
                className={[
                'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                included ?
                featured ?
                'bg-blue-600 text-white' :
                'bg-blue-50 text-blue-600' :
                featured ?
                'bg-white/10 text-slate-500' :
                'bg-slate-100 text-slate-400'].
                join(' ')}>
                
                <CheckIcon className="h-3 w-3" strokeWidth={3} />
              </span>
              <span
                className={[
                included ?
                featured ?
                'text-slate-200' :
                'text-slate-700' :
                'text-slate-400 line-through'].
                join(' ')}>
                
                {feature.label}
              </span>
            </li>);

        })}
      </ul>

      <button
        type="button"
        onClick={onCtaClick}
        disabled={disabled}
        className={[
        'mt-8 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-bold transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        featured ? 'focus-visible:ring-offset-[#161B2E]' : 'focus-visible:ring-offset-white',
        disabled ?
        'cursor-not-allowed bg-slate-200 text-slate-400' :
        featured ?
        'bg-blue-600 text-white hover:bg-blue-700' :
        'bg-blue-600 text-white hover:bg-blue-700'].
        join(' ')}>
        
        {ctaLabel}
      </button>
    </article>);

}