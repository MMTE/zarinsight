import React, { useState } from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

export interface AvatarProps {
  /** Image URL. Falls back to initials when missing or failing to load. */
  src?: string;
  /** Full name, used for the alt text and to derive initials. */
  name?: string;
  /** Explicit initials override (max 2 characters recommended). */
  initials?: string;
  size?: AvatarSize;
  /** Rounded square instead of a circle. */
  square?: boolean;
  /** Optional presence dot. */
  status?: AvatarStatus;
  /** Renders a white ring around the avatar (for stacked/overlapping groups). */
  ring?: boolean;
  className?: string;
  onClick?: () => void;
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-xl'
};

const statusSizeClasses: Record<AvatarSize, string> = {
  xs: 'h-1.5 w-1.5',
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
  xl: 'h-3.5 w-3.5'
};

const statusColorClasses: Record<AvatarStatus, string> = {
  online: 'bg-emerald-500',
  offline: 'bg-slate-400',
  busy: 'bg-rose-500',
  away: 'bg-amber-400'
};

export function getInitials(name?: string): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({
  src,
  name,
  initials,
  size = 'md',
  square = false,
  status,
  ring = false,
  className = '',
  onClick
}: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const label = initials ?? getInitials(name);
  const showImage = Boolean(src) && !failed;
  const shape = square ? 'rounded-xl' : 'rounded-full';
  const interactive = Boolean(onClick);

  const content =
  <span
    className={[
    'relative inline-flex shrink-0 items-center justify-center overflow-hidden',
    'bg-slate-100 font-semibold text-slate-600 select-none',
    shape,
    sizeClasses[size],
    ring ? 'ring-2 ring-white' : '',
    className].

    filter(Boolean).
    join(' ')}>
    
      {showImage ?
    <img
      src={src}
      alt={name ? `${name}` : ''}
      className="h-full w-full object-cover"
      onError={() => setFailed(true)} /> :

    label ?
    <span>{label}</span> :

    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-2/3 w-2/3 text-slate-400"
      aria-hidden="true">
      
          <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
        </svg>
    }
    </span>;


  const wrapper =
  <span className={`relative inline-flex ${interactive ? '' : ''}`}>
      {content}
      {status &&
    <span
      className={[
      'absolute bottom-0 right-0 block rounded-full ring-2 ring-white',
      statusSizeClasses[size],
      statusColorClasses[status]].
      join(' ')}
      role="status"
      aria-label={status} />

    }
    </span>;


  if (!interactive) {
    return (
      <span title={name} className="inline-flex">
        {wrapper}
      </span>);

  }

  return (
    <button
      type="button"
      onClick={onClick}
      title={name}
      aria-label={name ? `${name} account menu` : 'Account menu'}
      className={`inline-flex ${shape} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2`}>
      
      {wrapper}
    </button>);

}