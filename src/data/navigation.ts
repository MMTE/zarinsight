import {
  ActivityIcon,
  LightbulbIcon,
  ChartPieIcon,
  MessageCircleQuestionIcon } from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: typeof ActivityIcon;
}

export const primaryNav: NavItem[] = [
{ to: '/', label: 'داشبورد', icon: ActivityIcon },
{ to: '/insights', label: 'بینش‌ها', icon: LightbulbIcon },
{ to: '/analysis', label: 'تحلیل', icon: ChartPieIcon }];

export const secondaryNav: NavItem[] = [
{ to: '/ask', label: 'پرسش و پاسخ', icon: MessageCircleQuestionIcon }];
