import React from "react";
import { BoxIcon } from "lucide-react";
export type FeatureCardVariant = 'light' | 'dark';
export type FeatureCardAlign = 'start' | 'center';
export interface FeatureCardProps {
  /** Lucide icon component rendered in the card's icon tile. */
  icon?: BoxIcon;
  /** Card heading. */
  title: string;
  /** Supporting copy below the heading. */
  description: string;
  /** Optional call-to-action rendered under the description. */
  action?: React.ReactNode;
  /** Surface treatment. */
  variant?: FeatureCardVariant;
  /** Content alignment inside the card. */
  align?: FeatureCardAlign;
  /** Turns the whole card into a link. */
  href?: string;
  className?: string;
}
const surfaceStyles: Record<FeatureCardVariant, string> = {
  light: 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-slate-200/60',
  dark: 'bg-slate-900 border-slate-800 hover:border-blue-500/60 hover:shadow-lg hover:shadow-black/30'
};
const iconTileStyles: Record<FeatureCardVariant, string> = {
  light: 'bg-blue-50 text-blue-600',
  dark: 'bg-blue-600/15 text-blue-400'
};
const titleStyles: Record<FeatureCardVariant, string> = {
  light: 'text-slate-900',
  dark: 'text-white'
};
const descriptionStyles: Record<FeatureCardVariant, string> = {
  light: 'text-slate-600',
  dark: 'text-slate-400'
};
export function FeatureCard({
  icon: IconComponent,
  title,
  description,
  action,
  variant = 'light',
  align = 'start',
  href,
  className = ''
}: FeatureCardProps) {
  const Root = (href ? 'a' : 'div') as 'a';
  return <Root {...href ? {
    href
  } : {}} className={['group flex h-full flex-col rounded-2xl border p-6 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2', surfaceStyles[variant], align === 'center' ? 'items-center text-center' : 'items-start text-start', className].filter(Boolean).join(' ')}>
      {IconComponent ? <span aria-hidden="true" className={['mb-5 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-200', iconTileStyles[variant]].join(' ')}>
          <IconComponent className="h-6 w-6" strokeWidth={1.75} />
        </span> : null}

      <h3 className={['text-lg font-bold leading-7', titleStyles[variant]].join(' ')}>{title}</h3>

      <p className={['mt-2 text-sm leading-6', descriptionStyles[variant]].join(' ')}>
        {description}
      </p>

      {action ? <div className="mt-5">{action}</div> : null}
    </Root>;
}