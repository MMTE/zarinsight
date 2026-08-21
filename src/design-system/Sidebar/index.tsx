import React, { useState } from "react";
import { ChevronRightIcon, ChevronLeftIcon, LayoutGridIcon, WalletIcon, ArrowLeftRightIcon, StoreIcon, UsersIcon, SettingsIcon, LifeBuoyIcon, CheckIcon, BoxIcon } from "lucide-react";
export type SidebarItem = {
  id: string;
  label: string;
  icon: BoxIcon;
  badge?: string | number;
};
export type SidebarProps = {
  /** Navigation items rendered in the rail. */
  items?: SidebarItem[];
  /** Id of the currently active item. */
  activeId?: string;
  /** Name of the active gateway shown in the header card. */
  gatewayName?: string;
  /** Secondary line under the gateway name (e.g. domain or status). */
  gatewayMeta?: string;
  /** Logo image URL rendered above the gateway card. */
  logoUrl?: string;
  /** Controlled collapsed state. */
  collapsed?: boolean;
  /** Default collapsed state when uncontrolled. */
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  onSelect?: (id: string) => void;
  className?: string;
};
export const defaultSidebarItems: SidebarItem[] = [{
  id: 'dashboard',
  label: 'پیشخوان',
  icon: LayoutGridIcon
}, {
  id: 'transactions',
  label: 'تراکنش‌ها',
  icon: ArrowLeftRightIcon,
  badge: 12
}, {
  id: 'wallet',
  label: 'کیف پول',
  icon: WalletIcon
}, {
  id: 'gateways',
  label: 'درگاه‌ها',
  icon: StoreIcon
}, {
  id: 'customers',
  label: 'مشتریان',
  icon: UsersIcon
}, {
  id: 'settings',
  label: 'تنظیمات',
  icon: SettingsIcon
}];
export function Sidebar({
  items = defaultSidebarItems,
  activeId,
  gatewayName = 'فروشگاه زرین',
  gatewayMeta = 'zarinshop.ir',
  logoUrl = "/logo.png",
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  onSelect,
  className = ''
}: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const [internalActive, setInternalActive] = useState(activeId ?? items[0]?.id);
  const isCollapsed = collapsed ?? internalCollapsed;
  const current = activeId ?? internalActive;
  const toggle = () => {
    const next = !isCollapsed;
    if (collapsed === undefined) setInternalCollapsed(next);
    onCollapsedChange?.(next);
  };
  const select = (id: string) => {
    if (activeId === undefined) setInternalActive(id);
    onSelect?.(id);
  };
  return <aside dir="rtl" aria-label="ناوبری اصلی" className={`flex h-full flex-col border-l border-slate-200 bg-white transition-[width] duration-200 ease-out ${isCollapsed ? 'w-[76px]' : 'w-64'} ${className}`}>
      <div className="flex items-center gap-2 px-4 py-4">
        <img src={logoUrl} alt="زرین‌پال" className="h-7 w-auto shrink-0" />
        <button type="button" onClick={toggle} aria-label={isCollapsed ? 'باز کردن منو' : 'بستن منو'} aria-expanded={!isCollapsed} className="ms-auto flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
          {isCollapsed ? <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" /> : <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>

      <div className="px-3">
        <div className={`flex items-center gap-3 rounded-2xl bg-blue-600 text-white ${isCollapsed ? 'justify-center p-2.5' : 'p-3'}`}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 text-sm font-bold">
            {gatewayName.trim().charAt(0)}
          </span>
          {!isCollapsed && <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold leading-5">{gatewayName}</span>
              <span className="mt-0.5 flex items-center gap-1 text-xs text-blue-100">
                <CheckIcon className="h-3 w-3" aria-hidden="true" />
                <span className="truncate">{gatewayMeta}</span>
              </span>
            </span>}
        </div>
      </div>

      <nav className="mt-4 flex-1 overflow-y-auto px-3" aria-label="بخش‌ها">
        <ul className="space-y-1">
          {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === current;
          return <li key={item.id}>
                <button type="button" onClick={() => select(item.id)} aria-current={isActive ? 'page' : undefined} title={isCollapsed ? item.label : undefined} className={`group flex w-full items-center rounded-xl text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${isCollapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5'} ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
                  <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} strokeWidth={1.75} aria-hidden="true" />
                  {!isCollapsed && <span className="flex-1 truncate text-start">{item.label}</span>}
                  {!isCollapsed && item.badge !== undefined && <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {item.badge}
                    </span>}
                </button>
              </li>;
        })}
        </ul>
      </nav>

      <div className="border-t border-slate-200 p-3">
        <button type="button" className={`flex w-full items-center rounded-xl py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'}`}>
          <LifeBuoyIcon className="h-5 w-5 shrink-0 text-slate-400" strokeWidth={1.75} aria-hidden="true" />
          {!isCollapsed && <span>پشتیبانی</span>}
        </button>
      </div>
    </aside>;
}