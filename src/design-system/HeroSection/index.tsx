import React from 'react';

export type HeroSectionProps = {
  /** Main headline. Supports line breaks via an array of lines. */
  title: string | string[];
  /** Supporting paragraph under the headline. */
  description?: string;
  /** Label for the primary pill CTA. */
  ctaLabel?: string;
  /** Link target for the CTA. Renders an anchor when provided. */
  ctaHref?: string;
  onCtaClick?: () => void;
  /** Text direction. Defaults to right-to-left (Persian). */
  dir?: 'rtl' | 'ltr';
  /** Show the scroll-down affordance at the bottom edge. */
  showScrollCue?: boolean;
  className?: string;
};

export function HeroSection({
  title,
  description,
  ctaLabel,
  ctaHref,
  onCtaClick,
  dir = 'rtl',
  showScrollCue = true,
  className = ''
}: HeroSectionProps) {
  const lines = Array.isArray(title) ? title : [title];
  const isRtl = dir === 'rtl';

  const cta = ctaLabel ?
  ctaHref ?
  <a
    href={ctaHref}
    onClick={onCtaClick}
    className="inline-flex items-center justify-center rounded-full bg-[#1652F0] px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#0F3FC4] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#12141C]">
    
        {ctaLabel}
      </a> :

  <button
    type="button"
    onClick={onCtaClick}
    className="inline-flex items-center justify-center rounded-full bg-[#1652F0] px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#0F3FC4] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#12141C]">
    
        {ctaLabel}
      </button> :

  null;

  return (
    <section
      dir={dir}
      className={`relative isolate w-full overflow-hidden rounded-[28px] bg-[#12141C] ${className}`}>
      
      {/* Soft navy glow, mirrored to the content side */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute top-1/2 h-[900px] w-[900px] -translate-y-1/2 rounded-full bg-[#1B2559] opacity-60 blur-[140px] ${
        isRtl ? 'left-[-10%]' : 'right-[-10%]'}`
        } />
      

      <div className="relative mx-auto flex min-h-[560px] max-w-7xl flex-col justify-center px-6 py-24 sm:px-10 lg:min-h-[720px] lg:py-32">
        <div className={`max-w-2xl ${isRtl ? 'lg:ms-auto lg:text-right' : 'lg:me-auto lg:text-left'}`}>
          <h1 className="text-3xl font-extrabold leading-[1.5] text-white sm:text-4xl lg:text-[2.5rem]">
            {lines.map((line, i) =>
            <span key={i} className="block">
                {line}
              </span>
            )}
          </h1>

          {description ?
          <p className="mt-8 text-sm leading-8 text-white/60 sm:text-base sm:leading-9">
              {description}
            </p> :
          null}

          {cta ? <div className="mt-10">{cta}</div> : null}
        </div>
      </div>

      {showScrollCue ?
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 flex justify-center">
        
          <div className="flex h-8 w-16 items-end justify-center rounded-t-full bg-white pb-1">
            <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#12141C"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round">
            
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div> :
      null}
    </section>);

}