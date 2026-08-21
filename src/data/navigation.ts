import {
  ActivityIcon,
  LayoutGridIcon,
  LightbulbIcon,
  TrendingUpIcon,
  UsersIcon,
  CreditCardIcon,
  ScaleIcon,
  TableIcon,
  DatabaseIcon,
  BookOpenIcon } from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: typeof ActivityIcon;
}

export const primaryNav: NavItem[] = [
{ to: '/panel', label: 'داشبورد درگاه', icon: LayoutGridIcon },
{ to: '/', label: 'وضعیت کسب و کار', icon: ActivityIcon },
{ to: '/insights', label: 'بینش‌های مهم', icon: LightbulbIcon },
{ to: '/sales', label: 'فروش', icon: TrendingUpIcon },
{ to: '/customers', label: 'مشتریان', icon: UsersIcon },
{ to: '/payments', label: 'پرداخت‌ها', icon: CreditCardIcon },
{ to: '/benchmarks', label: 'مقایسه با کسب‌وکارهای مشابه', icon: ScaleIcon }];


export const secondaryNav: NavItem[] = [
{ to: '/explore', label: 'بررسی داده‌ها', icon: TableIcon },
{ to: '/data-quality', label: 'کیفیت داده', icon: DatabaseIcon },
{ to: '/methodology', label: 'روش تحلیل', icon: BookOpenIcon }];
