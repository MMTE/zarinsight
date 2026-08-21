import {
  LayoutDashboardIcon,
  LightbulbIcon,
  TrendingUpIcon,
  UsersIcon,
  CreditCardIcon,
  ScaleIcon,
  TableIcon,
  DatabaseIcon,
  BookOpenIcon,
  HomeIcon,
  EllipsisIcon } from
'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: typeof HomeIcon;
}

export const primaryNav: NavItem[] = [
{ to: '/', label: 'نمای کلی', icon: LayoutDashboardIcon },
{ to: '/insights', label: 'بینش‌های مهم', icon: LightbulbIcon },
{ to: '/sales', label: 'فروش', icon: TrendingUpIcon },
{ to: '/customers', label: 'مشتریان', icon: UsersIcon },
{ to: '/payments', label: 'پرداخت‌ها', icon: CreditCardIcon },
{ to: '/benchmarks', label: 'مقایسه با کسب‌وکارهای مشابه', icon: ScaleIcon }];


export const secondaryNav: NavItem[] = [
{ to: '/explore', label: 'بررسی داده‌ها', icon: TableIcon },
{ to: '/data-quality', label: 'کیفیت داده', icon: DatabaseIcon },
{ to: '/methodology', label: 'روش تحلیل', icon: BookOpenIcon }];


export const mobileNav: NavItem[] = [
{ to: '/', label: 'خانه', icon: HomeIcon },
{ to: '/insights', label: 'یافته‌ها', icon: LightbulbIcon },
{ to: '/sales', label: 'فروش', icon: TrendingUpIcon },
{ to: '/payments', label: 'پرداخت‌ها', icon: CreditCardIcon },
{ to: '/more', label: 'بیش‌تر', icon: EllipsisIcon }];