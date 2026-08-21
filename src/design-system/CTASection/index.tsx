import React from 'react';

export type CTASectionProps = {
  /** Main headline. Supports a line break by passing an array of lines. */
  headline: string | string[];
  /** Optional supporting paragraph shown under the headline. */
  description?: string;
  /** Label for the primary pill button. */
  ctaLabel: string;
  /** Href for the primary button. Renders an <a> when provided. */
  ctaHref?: string;
  /** Click handler used when no href is provided. */
  onCtaClick?: () => void;
  /** Visual treatment of the band. */
  tone?: 'dark' | 'light';
  /** Horizontal alignment of the content inside the band. */
  align?: 'start' | 'center';
  /** Text direction. Defaults to right-to-left to match the brand. */
  dir?: 'rtl' | 'ltr';
  className?: string;
};

const toneStyles: Record<
  NonNullable<CTASectionProps['tone']>,
  {band: string;headline: string;description: string;}> =
{
  dark: {
    band: 'bg-[#16181F]',
    headline: 'text-white',
    description: 'text-white/60'
  },
  light: {
    band: 'bg-[#F4F5F7]',
    headline: 'text-[#16181F]',
    description: 'text-[#16181F]/60'
  }
};

const buttonClasses =
'inline-flex items-center justify-center rounded-full bg-[#1D4ED8] px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#1A44BD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent';

export function CTASection({
  headline,
  description,
  ctaLabel,
  ctaHref,
  onCtaClick,
  tone = 'dark',
  align = 'center',
  dir = 'rtl',
  className = ''
}: CTASectionProps) {
  const styles = toneStyles[tone];
  const lines = Array.isArray(headline) ? headline : [headline];
  const isCentered = align === 'center';

  return (
    <section
      dir={dir}
      className={`w-full px-4 py-10 sm:px-6 lg:px-8 ${className}`}>
      
      <div
        className={`mx-auto flex max-w-6xl flex-col gap-6 rounded-3xl px-6 py-14 sm:px-12 lg:px-20 lg:py-24 ${
        styles.band} ${
        isCentered ? 'items-center text-center' : 'items-start text-start'}`}>
        
        <h2
          className={`max-w-3xl text-2xl font-bold leading-snug sm:text-3xl lg:text-4xl lg:leading-[1.35] ${styles.headline}`}>
          
          {lines.map((line, index) =>
          <React.Fragment key={line}>
              {index > 0 && <br />}
              {line}
            </React.Fragment>
          )}
        </h2>

        {description &&
        <p
          className={`max-w-2xl text-sm leading-7 sm:text-base ${styles.description}`}>
          
            {description}
          </p>
        }

        <div className="pt-2">
          {ctaHref ?
          <a href={ctaHref} className={buttonClasses}>
              {ctaLabel}
            </a> :

          <button type="button" onClick={onCtaClick} className={buttonClasses}>
              {ctaLabel}
            </button>
          }
        </div>
      </div>
    </section>);

}