import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BellIcon, SearchIcon } from 'lucide-react';
import { Select } from '../Select';
import { Badge } from '../Badge';
import { useAnalysis } from '../../contexts/AnalysisContext';
import { business, compareOptions, periodOptions } from '../../data/overview';
import { notifications } from '../../data/notifications';

export function TopBar() {
  const navigate = useNavigate();
  const { period, setPeriod, compare, setCompare, readNotifications } = useAnalysis();
  const unread = notifications.filter((item) => !readNotifications.includes(item.id)).length;

  return (
    <header className="sticky top-0 z-20 border-b border-border-light bg-surface-light">
      <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 lg:px-6">
        <div className="min-w-0 lg:hidden">
          <p className="truncate text-[13px] font-bold text-gray-950">{business.name}</p>
          <p className="text-[11px] text-gray-600">هوش تجاری زرین‌پال</p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/ask')}
          className="order-last flex min-h-[40px] w-full items-center gap-2 rounded-lg border border-border-strong-light bg-gray-50 px-3 text-[13px] text-gray-600 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600 lg:order-none lg:w-auto lg:min-w-[320px] lg:flex-1">
          
          <SearchIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>در داده‌ها جست‌وجو کنید یا سؤال بپرسید...</span>
        </button>

        <div className="ms-auto flex items-center gap-2">
          <Select
            aria-label="بازه زمانی"
            options={periodOptions}
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            size="sm" />
          
          <div className="hidden sm:block">
            <Select
              aria-label="نوع مقایسه"
              options={compareOptions}
              value={compare}
              onChange={(event) => setCompare(event.target.value)}
              size="sm" />
            
          </div>

          <button
            type="button"
            onClick={() => navigate('/notifications')}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-800 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600"
            aria-label={`اعلان‌ها${unread ? ` — ${unread} مورد خوانده‌نشده` : ''}`}>
            
            <BellIcon className="h-5 w-5" aria-hidden="true" />
            {unread > 0 &&
            <span className="absolute end-1.5 top-1.5 h-2 w-2 rounded-full bg-red-600" aria-hidden="true" />
            }
          </button>

          <span className="hidden items-center gap-2 rounded-lg border border-border-light px-2.5 py-1.5 sm:flex">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-pal-100 text-[11px] font-bold text-pal-700">
              س‌م
            </span>
            <span className="text-[12px] text-gray-900">{business.user}</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-border-light px-4 py-1.5 sm:hidden lg:px-6">
        <Badge variant="neutral" size="sm">
          {periodOptions.find((item) => item.value === period)?.label}
        </Badge>
        <Badge variant="neutral" size="sm">
          {compareOptions.find((item) => item.value === compare)?.label}
        </Badge>
      </div>
    </header>);

}