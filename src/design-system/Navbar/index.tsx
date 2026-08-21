import React from 'react';
import {
  MenuIcon,
  XIcon,
  BellIcon,
  TicketIcon,
  ChevronDownIcon } from
'lucide-react';

export type NavbarProps = {
  /** Controls the hamburger icon state. Leave undefined for uncontrolled usage. */
  menuOpen?: boolean;
  /** Fired when the hamburger button is pressed. Receives the next open state. */
  onMenuToggle?: (open: boolean) => void;
  /** Number of unread notifications. 0 hides the badge. */
  notificationCount?: number;
  /** Number of open support tickets. 0 hides the badge. */
  ticketCount?: number;
  /** Display name shown next to the avatar. */
  userName?: string;
  /** Avatar image URL. Falls back to initials when omitted. */
  avatarUrl?: string;
  onTicketsClick?: () => void;
  onNotificationsClick?: () => void;
  onAvatarClick?: () => void;
  className?: string;
};

const LOGO_URL = "/logo.png";


export function Navbar({
  menuOpen,
  onMenuToggle,
  notificationCount = 0,
  ticketCount = 0,
  userName,
  avatarUrl,
  onTicketsClick,
  onNotificationsClick,
  onAvatarClick,
  className = ''
}: NavbarProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = typeof menuOpen === 'boolean';
  const open = isControlled ? menuOpen as boolean : internalOpen;

  const handleToggle = () => {
    const next = !open;
    if (!isControlled) setInternalOpen(next);
    onMenuToggle?.(next);
  };

  return (
    <header
      dir="rtl"
      className={`w-full bg-white border-b border-slate-200 ${className}`}>
      
      <nav
        aria-label="اصلی"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        
        {/* Right cluster (RTL start): hamburger + logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggle}
            aria-expanded={open}
            aria-label={open ? 'بستن منو' : 'باز کردن منو'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1652F0] focus-visible:ring-offset-2">
            
            {open ?
            <XIcon className="h-5 w-5" aria-hidden="true" /> :

            <MenuIcon className="h-5 w-5" aria-hidden="true" />
            }
          </button>

          <a
            href="#"
            className="flex items-center rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1652F0] focus-visible:ring-offset-2">
            
            <img src={LOGO_URL} alt="زرین‌پال" className="h-7 w-auto" />
          </a>
        </div>

        {/* Left cluster (RTL end): tickets, notifications, avatar */}
        <div className="flex items-center gap-1 sm:gap-2">
          <IconAction
            label="تیکت‌ها"
            count={ticketCount}
            onClick={onTicketsClick}>
            
            <TicketIcon className="h-5 w-5" aria-hidden="true" />
          </IconAction>

          <IconAction
            label="اعلان‌ها"
            count={notificationCount}
            onClick={onNotificationsClick}>
            
            <BellIcon className="h-5 w-5" aria-hidden="true" />
          </IconAction>

          <span className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" />

          <button
            type="button"
            onClick={onAvatarClick}
            className="flex items-center gap-2 rounded-xl py-1 pl-2 pr-1 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1652F0] focus-visible:ring-offset-2">
            
            {avatarUrl ?
            <img
              src={avatarUrl}
              alt=""
              className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200" /> :


            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1652F0]/10 text-sm font-semibold text-[#1652F0]">
              
                {getInitials(userName)}
              </span>
            }
            <span className="hidden text-sm font-medium text-slate-700 sm:block">
              {userName ?? 'حساب کاربری'}
            </span>
            <ChevronDownIcon
              className="hidden h-4 w-4 text-slate-400 sm:block"
              aria-hidden="true" />
            
          </button>
        </div>
      </nav>
    </header>);

}

type IconActionProps = {
  label: string;
  count?: number;
  onClick?: () => void;
  children: React.ReactNode;
};

export function IconAction({ label, count = 0, onClick, children }: IconActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={count > 0 ? `${label} (${count} مورد جدید)` : label}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1652F0] focus-visible:ring-offset-2">
      
      {children}
      {count > 0 &&
      <span className="absolute -top-0.5 left-0.5 min-w-[18px] rounded-full bg-[#1652F0] px-1 text-[11px] font-semibold leading-[18px] text-white">
          {count > 99 ? '+۹۹' : count}
        </span>
      }
    </button>);

}

export function getInitials(name?: string): string {
  if (!name) return '؟';
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]).join('');
}