import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, LifeBuoyIcon } from 'lucide-react';
import { primaryNav, secondaryNav, type NavItem } from '../../data/navigation';
import { business } from '../../data/overview';

function NavList({
  items,
  label,
  collapsed
}: {
  items: NavItem[];
  label: string;
  collapsed: boolean;
}) {
  return (
    <div>
      {!collapsed && (
        <p className="mb-2 px-3 text-[11px] font-medium text-slate-500">{label}</p>
      )}
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === '/'}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                [
                  'group flex w-full items-center rounded-xl text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600 focus-visible:ring-offset-2',
                  collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5',
                  isActive
                    ? 'bg-pal-50 font-semibold text-pal-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`h-5 w-5 shrink-0 ${isActive ? 'text-pal-600' : 'text-slate-400 group-hover:text-slate-600'}`}
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  {!collapsed && <span className="flex-1 truncate text-start">{item.label}</span>}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SideNav() {
  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => setCollapsed((value) => !value);

  return (
    <aside
      dir="rtl"
      aria-label="ناوبری اصلی"
      className={`hidden shrink-0 border-l border-slate-200 bg-white transition-[width] duration-200 ease-out lg:flex lg:flex-col ${
        collapsed ? 'w-[76px]' : 'w-64'
      }`}
    >
      <div className="sticky top-0 flex h-screen flex-col">
        <div
          className={`flex items-center gap-2 py-4 ${
            collapsed ? 'justify-center px-2' : 'px-4'
          }`}
        >
          <img src="/logo.png" alt="زرین‌پال" className="h-7 w-auto shrink-0" />
          {!collapsed && (
            <button
              type="button"
              onClick={toggle}
              aria-label="جمع کردن منو"
              className="ms-auto flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600 focus-visible:ring-offset-2"
            >
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
        {collapsed && (
          <div className="flex justify-center pb-1">
            <button
              type="button"
              onClick={toggle}
              aria-label="باز کردن منو"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600 focus-visible:ring-offset-2"
            >
              <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}

        <div className="px-3">
          <div
            className={`flex items-center gap-3 rounded-2xl bg-pal-600 text-white ${
              collapsed ? 'justify-center p-2.5' : 'p-3'
            }`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 text-sm font-bold">
              {business.name.trim().charAt(0)}
            </span>
            {!collapsed && (
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold leading-5">
                  {business.name}
                </span>
                <span className="mt-0.5 flex items-center gap-1 text-xs text-pal-100">
                  <CheckIcon className="h-3 w-3" aria-hidden="true" />
                  <span className="truncate">{business.meta}</span>
                </span>
              </span>
            )}
          </div>
        </div>

        <nav className="mt-4 flex-1 overflow-y-auto px-3 pb-3" aria-label="بخش‌ها">
          <NavList items={primaryNav} label="گزارش‌ها" collapsed={collapsed} />
          <div className="mt-4">
            <NavList items={secondaryNav} label="شفافیت داده" collapsed={collapsed} />
          </div>
        </nav>

        <div className="border-t border-slate-200 p-3">
          <button
            type="button"
            className={`flex w-full items-center rounded-xl py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600 focus-visible:ring-offset-2 ${
              collapsed ? 'justify-center px-0' : 'gap-3 px-3'
            }`}
          >
            <LifeBuoyIcon
              className="h-5 w-5 shrink-0 text-slate-400"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            {!collapsed && <span>پشتیبانی</span>}
          </button>
          {!collapsed && (
            <p className="mt-2 px-3 text-[11px] leading-6 text-slate-500">
              هر عددی که می‌بینید، محاسبه و جامعه داده‌اش یک کلیک با شما فاصله دارد.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
