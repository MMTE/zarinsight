import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { SideNav } from './SideNav';
import { TopBar } from './TopBar';
import { Drawer } from '../../design-system/Drawer';
import { primaryNav, secondaryNav } from '../../data/navigation';
import { business } from '../../data/overview';

export function AppShell() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const mainRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    mainRef.current?.scrollTo?.({ top: 0 });
    window.scrollTo({ top: 0 });
  }, [pathname]);

  React.useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div dir="rtl" lang="fa" className="flex min-h-screen w-full bg-background-light">
      <SideNav />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenuToggle={() => setMenuOpen(true)} />
        <main
          ref={mainRef}
          className="flex-1 px-4 pb-10 pt-5 md:p-6"
          id="main-content"
        >
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>

      <Drawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title={business.name}
        description="هوش تجاری زرین‌پال"
        side="right"
        size="sm"
      >
        <nav aria-label="ناوبری موبایل" className="space-y-5">
          {[primaryNav, secondaryNav].map((group, index) => (
            <div key={index}>
              <p className="mb-2 px-3 text-[11px] font-medium text-slate-500">
                {index === 0 ? 'گزارش‌ها' : 'شفافیت داده'}
              </p>
              <ul className="space-y-1">
                {group.map((item) => (
                  <li key={item.to}>
                    <button
                      type="button"
                      onClick={() => navigate(item.to)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600 focus-visible:ring-offset-2 ${
                        pathname === item.to
                          ? 'bg-pal-50 font-semibold text-pal-700'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <item.icon className="h-5 w-5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                      <span className="flex-1 truncate text-start">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </Drawer>
    </div>
  );
}
