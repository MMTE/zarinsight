import React from 'react';
import { NavLink } from 'react-router-dom';
import { primaryNav, secondaryNav } from '../../data/navigation';
import { business } from '../../data/overview';

function NavList({ items, label }: {items: typeof primaryNav;label: string;}) {
  return (
    <div>
      <p className="mb-1.5 px-3 text-[11px] font-medium text-gray-600">{label}</p>
      <ul className="space-y-0.5">
        {items.map((item) =>
        <li key={item.to}>
            <NavLink
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
            [
            'flex min-h-[40px] items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600',
            isActive ?
            'bg-pal-50 font-bold text-pal-700' :
            'text-gray-800 hover:bg-gray-100 hover:text-gray-950'].
            join(' ')
            }>
            
              <item.icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          </li>
        )}
      </ul>
    </div>);

}

export function SideNav() {
  return (
    <aside
      className="hidden w-64 shrink-0 border-e border-border-light bg-surface-light lg:block"
      aria-label="ناوبری اصلی">
      
      <div className="sticky top-0 flex h-screen flex-col gap-5 overflow-y-auto p-3">
        <div className="rounded-xl bg-gray-950 px-3 py-3">
          <p className="text-[11px] text-gray-400">هوش تجاری زرین‌پال</p>
          <p className="mt-1 text-[14px] font-bold text-gray-50">{business.name}</p>
          <p className="text-[11px] text-gray-500">{business.meta}</p>
        </div>

        <NavList items={primaryNav} label="گزارش‌ها" />
        <NavList items={secondaryNav} label="شفافیت داده" />

        <p className="mt-auto px-3 text-[11px] leading-6 text-gray-600">
          هر عددی که می‌بینید، محاسبه و جامعه داده‌اش یک کلیک با شما فاصله دارد.
        </p>
      </div>
    </aside>);

}