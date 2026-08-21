import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon } from 'lucide-react';
import { Card } from '../components/Card';
import { PageHeader } from '../components/analytics/PageHeader';
import { primaryNav, secondaryNav } from '../data/navigation';
import { business } from '../data/overview';

const extraNav = [
{ to: '/ask', label: 'جست‌وجوی تحلیلی' },
{ to: '/notifications', label: 'تغییرات مهم' }];


export function More() {
  return (
    <div className="space-y-5">
      <PageHeader title="بیش‌تر" description={`${business.name} — ${business.meta}`} />

      <Card padding="none" elevation="flat" className="border-border-light">
        <ul className="divide-y divide-border-light">
          {[...primaryNav.slice(2), ...secondaryNav].map((item) =>
          <li key={item.to}>
              <Link
              to={item.to}
              className="flex min-h-[52px] items-center justify-between gap-3 px-4 py-3 text-[14px] text-gray-900 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-pal-600">
              
                <span className="flex items-center gap-2.5">
                  <item.icon className="h-[18px] w-[18px] text-gray-700" aria-hidden="true" />
                  {item.label}
                </span>
                <ChevronLeftIcon className="h-4 w-4 text-gray-600" aria-hidden="true" />
              </Link>
            </li>
          )}
          {extraNav.map((item) =>
          <li key={item.to}>
              <Link
              to={item.to}
              className="flex min-h-[52px] items-center justify-between gap-3 px-4 py-3 text-[14px] text-gray-900 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-pal-600">
              
                {item.label}
                <ChevronLeftIcon className="h-4 w-4 text-gray-600" aria-hidden="true" />
              </Link>
            </li>
          )}
        </ul>
      </Card>
    </div>);

}