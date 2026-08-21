import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SideNav } from './SideNav';
import { TopBar } from './TopBar';
import { MobileTabBar } from './MobileTabBar';

export function AppShell() {
  const { pathname } = useLocation();
  const mainRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    mainRef.current?.scrollTo?.({ top: 0 });
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div dir="rtl" lang="fa" className="flex min-h-screen w-full bg-background-light">
      <SideNav />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main
          ref={mainRef}
          className="flex-1 px-4 pb-24 pt-5 lg:px-6 lg:pb-10"
          id="main-content">
          
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
      <MobileTabBar />
    </div>);

}