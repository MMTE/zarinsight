import React from 'react';

const LOGO_SRC = "/logo.png";


export type LogoVariant = 'lockup' | 'mark' | 'badge';
export type LogoTone = 'color' | 'black' | 'white';
export type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

export interface LogoProps {
  /** Which form of the brandmark to render. Defaults to the full lockup. */
  variant?: LogoVariant;
  /** Ink treatment. `color` keeps the brand blue + yellow. */
  tone?: LogoTone;
  /** Rendered height of the mark (or of the badge container for `badge`). */
  size?: LogoSize;
  /** Badge plate color. Only used when `variant="badge"`. */
  badgeBackground?: 'white' | 'black';
  /** Accessible label. Pass an empty string when the logo is decorative. */
  label?: string;
  className?: string;
}

/** Mark heights in px, keyed by size. */
export const LOGO_SIZES: Record<LogoSize, number> = {
  sm: 20,
  md: 28,
  lg: 40,
  xl: 56
};

const TONE_FILTER: Record<LogoTone, string | undefined> = {
  color: undefined,
  black: 'grayscale(1) brightness(0)',
  white: 'brightness(0) invert(1)'
};

export function Logo({
  variant = 'lockup',
  tone = 'color',
  size = 'md',
  badgeBackground = 'white',
  label = 'Zarinpal',
  className = ''
}: LogoProps) {
  const height = LOGO_SIZES[size];
  const filter = TONE_FILTER[tone];
  const decorative = label === '';

  const image =
  <img
    src={LOGO_SRC}
    alt={decorative ? '' : label}
    aria-hidden={decorative || undefined}
    draggable={false}
    className="block h-full w-auto max-w-none select-none"
    style={{ filter }} />;



  if (variant === 'lockup') {
    return (
      <span
        className={`inline-flex items-center ${className}`}
        style={{ height }}>
        
        {image}
      </span>);

  }

  // The logomark sits at the trailing (right) edge of the RTL lockup, so the
  // mark form crops the artwork to a square anchored to that edge.
  const mark =
  <span
    className="inline-flex items-center justify-end overflow-hidden"
    style={{ height, width: height }}>
    
      {image}
    </span>;


  if (variant === 'mark') {
    return (
      <span className={`inline-flex ${className}`} style={{ height, width: height }}>
        {mark}
      </span>);

  }

  // Badge: mark centered on a solid plate. Corner radius is 3a where a = h/14.
  const plate = height;
  const inner = Math.round(plate * (8 / 14));
  const isWhitePlate = badgeBackground === 'white';

  return (
    <span
      className={`inline-flex items-center justify-center ${
      isWhitePlate ? 'bg-white' : 'bg-black'} ${
      className}`}
      style={{
        height: plate,
        width: plate,
        borderRadius: plate / 14 * 3
      }}>
      
      <span
        className="inline-flex items-center justify-end overflow-hidden"
        style={{ height: inner, width: inner }}>
        
        <img
          src={LOGO_SRC}
          alt={decorative ? '' : label}
          aria-hidden={decorative || undefined}
          draggable={false}
          className="block h-full w-auto max-w-none select-none"
          style={{ filter: isWhitePlate ? TONE_FILTER[tone] : TONE_FILTER[tone === 'color' ? 'color' : tone] }} />
        
      </span>
    </span>);

}