import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BellIcon,
  ChevronDownIcon,
  LifeBuoyIcon,
  LogOutIcon,
  MenuIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon
} from 'lucide-react';
import { Select } from '../Select';
import { Badge } from '../Badge';
import { Avatar } from '../../design-system/Avatar';
import { business, compareOptions, periodOptions } from '../../data/overview';
import { notifications } from '../../data/notifications';
import { useAnalysis } from '../../contexts/AnalysisContext';


function ProfileMenu() {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="حساب کاربری"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false);
        }}
        className="flex items-center gap-1.5 rounded-xl p-1 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600 focus-visible:ring-offset-2"
      >
        <Avatar name={business.user} size="sm" status="online" />
        <ChevronDownIcon
          className={`hidden h-4 w-4 text-slate-400 transition-transform sm:block ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="منوی حساب کاربری"
          className="fixed inset-x-4 top-[68px] z-30 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg sm:absolute sm:inset-x-auto sm:end-0 sm:top-full sm:mt-2 sm:w-64"
        >
          <div className="flex items-center gap-3 border-b border-slate-100 p-3">
            <Avatar name={business.user} size="md" status="online" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">{business.user}</p>
              <p className="truncate text-xs text-slate-500">{business.meta}</p>
            </div>
          </div>
          <div className="p-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600"
            >
              <UserIcon className="h-4 w-4 text-slate-400" aria-hidden="true" />
              پروفایل کاربری
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600"
            >
              <SettingsIcon className="h-4 w-4 text-slate-400" aria-hidden="true" />
              تنظیمات
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                navigate('/methodology');
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600"
            >
              <LifeBuoyIcon className="h-4 w-4 text-slate-400" aria-hidden="true" />
              روش تحلیل و شفافیت داده
            </button>
          </div>
          <div className="border-t border-slate-100 p-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-rose-600 transition-colors hover:bg-rose-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              <LogOutIcon className="h-4 w-4" aria-hidden="true" />
              خروج از حساب
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function TopBar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const navigate = useNavigate();
  const { period, setPeriod, compare, setCompare, readNotifications,
    merchantKey, setMerchantKey, datasetId, setDatasetId } = useAnalysis();
  const unread = notifications.filter((item) => !readNotifications.includes(item.id)).length;
  const [merchantOptions, setMerchantOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [datasetOptions, setDatasetOptions] = useState<Array<{ value: string; label: string }>>([]);

  useEffect(() => {
    fetch('/api/merchants').then((r) => r.json()).then((d) => {
      setMerchantOptions((d.merchants ?? []).slice(0, 60).map((m: { merchant_key: string; category_title: string }) => ({
        value: m.merchant_key,
        label: `${m.merchant_key} — ${m.category_title ?? ''}`,
      })));
    }).catch(() => {});
    fetch('/api/datasets').then((r) => r.json()).then((d) => {
      setDatasetOptions((d.datasets ?? []).map((x: { id: string; label: string }) => ({
        value: x.id, label: x.label,
      })));
    }).catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
      <nav
        aria-label="اصلی"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6"
      >
        {/* Right cluster (RTL start): hamburger + business identity */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            aria-label="باز کردن منو"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600 focus-visible:ring-offset-2 lg:hidden"
          >
            <MenuIcon className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="min-w-0 hidden lg:block">
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

        {/* Left cluster (RTL end): analytics controls, notifications, profile */}
        <div className="flex items-center gap-1 sm:gap-2">
          {merchantOptions.length > 0 && (
            <div className="hidden md:block">
              <Select
                aria-label="کسب‌وکار"
                options={merchantOptions}
                value={merchantOptions.some((o) => o.value === merchantKey) ? merchantKey : merchantOptions[0]?.value}
                onChange={(event) => setMerchantKey(event.target.value)}
                size="sm"
              />
            </div>
          )}
          {datasetOptions.length > 1 && (
            <div className="hidden lg:block">
              <Select
                aria-label="مجموعه داده"
                options={datasetOptions}
                value={datasetId}
                onChange={(event) => setDatasetId(event.target.value)}
                size="sm"
              />
            </div>
          )}
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

          <ProfileMenu />
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
