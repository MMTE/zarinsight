import React from 'react';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';
export type CardElevation = 'flat' | 'low' | 'medium';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Inner padding of the card surface. */
  padding?: CardPadding;
  /** Shadow depth applied to the surface. */
  elevation?: CardElevation;
  /** Adds hover affordance (border + shadow lift). Useful for clickable panels. */
  interactive?: boolean;
  /** Renders the card as a different element, e.g. 'section' or 'article'. */
  as?: 'div' | 'section' | 'article' | 'li';
  children?: React.ReactNode;
}

const paddingClasses: Record<CardPadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
};

const elevationClasses: Record<CardElevation, string> = {
  flat: 'shadow-none',
  low: 'shadow-sm',
  medium: 'shadow-md'
};

export function Card({
  padding = 'md',
  elevation = 'low',
  interactive = false,
  as: Tag = 'div',
  className = '',
  children,
  ...rest
}: CardProps) {
  const classes = [
  'bg-white rounded-2xl border border-gray-200 text-gray-900',
  paddingClasses[padding],
  elevationClasses[elevation],
  interactive ?
  'transition-colors transition-shadow duration-200 hover:border-gray-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2' :
  '',
  className].

  filter(Boolean).
  join(' ');

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>);

}

export interface CardSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function CardHeader({ className = '', children, ...rest }: CardSectionProps) {
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`} {...rest}>
      {children}
    </div>);

}

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h2' | 'h3' | 'h4';
  children?: React.ReactNode;
}

export function CardTitle({ as: Tag = 'h3', className = '', children, ...rest }: CardTitleProps) {
  return (
    <Tag className={`text-base font-semibold leading-6 text-gray-900 ${className}`} {...rest}>
      {children}
    </Tag>);

}

export function CardDescription({ className = '', children, ...rest }: CardSectionProps) {
  return (
    <p className={`text-sm leading-6 text-gray-500 ${className}`} {...rest}>
      {children}
    </p>);

}

export function CardContent({ className = '', children, ...rest }: CardSectionProps) {
  return (
    <div className={`mt-4 text-sm leading-6 text-gray-700 ${className}`} {...rest}>
      {children}
    </div>);

}

export function CardFooter({ className = '', children, ...rest }: CardSectionProps) {
  return (
    <div
      className={`mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4 ${className}`}
      {...rest}>
      
      {children}
    </div>);

}