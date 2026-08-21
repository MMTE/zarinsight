import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BellIcon, ChevronDownIcon, MenuIcon, SearchIcon } from 'lucide-react';
import { Select } from '../Select';
import { Badge } from '../Badge';
import { useAnalysis } from '../../contexts/AnalysisContext';
import { business, compareOptions, periodOptions } from '../../data/overview';
import { notifications } from '../../data/notifications';

export function TopBar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const navigate = useNavigate();
  const { period, setPeriod, compare, setCompare, readNotifications } = useAnalysis();
  const unread = notifications.filter((item) => !readNotifications.includes(item.id)).length;

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
      <nav
        aria-label="اصلی"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6"
      >
        {/* Right cluster (RTL start): hamburger + logo */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            aria-label="باز کردن منو"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600 focus-visible:ring-offset-2 lg:hidden"
          >
            <MenuIcon className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="min-w-0 lg:hidden">
            <p className="truncate text-[13px] font-bold text-gray-950">{business.name}</p>
            <p className="text-[11px] text-gray-600">هوش تجاری زرین‌پال</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/ask')}
          className="order-last flex min-h-[40px] w-full items-center gap-2 rounded-lg border border-border-strong-light bg-gray-50 px-3 text-[13px] text-gray-600 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600 lg:order-none lg:w-auto lg:min-w-[280px] lg:flex-1"
        >
          <SearchIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>در داده‌ها جست‌وجو کنید یا سؤال بپرسید...</span>
        </button>

        {/* Left cluster (RTL end): analytics controls, notifications, avatar */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Select
            aria-label="بازه زمانی"
            options={periodOptions}
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            size="sm"
          />

          <div className="hidden sm:block">
            <Select
              aria-label="نوع مقایسه"
              options={compareOptions}
              value={compare}
              onChange={(event) => setCompare(event.target.value)}
              size="sm"
            />
          </div>

          <button
            type="button"
            onClick={() => navigate('/notifications')}
            aria-label={`اعلان‌ها${unread ? ` — ${unread} مورد خوانده‌نشده` : ''}`}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600 focus-visible:ring-offset-2"
          >
            <BellIcon className="h-5 w-5" aria-hidden="true" />
            {unread > 0 && (
              <span className="absolute -top-0.5 left-0.5 min-w-[18px] rounded-full bg-pal-600 px-1 text-[11px] font-semibold leading-[18px] text-white">
                {unread > 99 ? '+۹۹' : unread.toLocaleString('fa-IR')}
              </span>
            )}
          </button>

          <span className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" />

          <button
            type="button"
            className="flex items-center gap-2 rounded-xl py-1 pl-2 pr-1 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600 focus-visible:ring-offset-2"
          >
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-pal-600/10 text-sm font-semibold text-pal-700"
            >
              {business.user
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map((part) => part[0])
                .join('')}
            </span>
            <span className="hidden text-sm font-medium text-slate-700 sm:block">
              {business.user}
            </span>
            <ChevronDownIcon className="hidden h-4 w-4 text-slate-400 sm:block" aria-hidden="true" />
          </button>
        </div>
      </nav>

      <div className="flex items-center gap-2 border-t border-slate-200 px-4 py-1.5 sm:hidden">
        <Badge variant="neutral" size="sm">
          {periodOptions.find((item) => item.value === period)?.label}
        </Badge>
        <Badge variant="neutral" size="sm">
          {compareOptions.find((item) => item.value === compare)?.label}
        </Badge>
      </div>
    </header>
  );
}
