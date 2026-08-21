import React from 'react';
import { NavLink } from 'react-router-dom';
import { mobileNav } from '../../data/navigation';

export function MobileTabBar() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border-light bg-surface-light lg:hidden"
      aria-label="ناوبری موبایل">
      
      <ul className="grid grid-cols-5">
        {mobileNav.map((item) =>
        <li key={item.to}>
            <NavLink
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
            [
            'flex min-h-[56px] flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-pal-600',
            isActive ? 'font-bold text-pal-700' : 'text-gray-700'].
            join(' ')
            }>
            
              <item.icon className="h-5 w-5" aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          </li>
        )}
      </ul>
    </nav>);

}