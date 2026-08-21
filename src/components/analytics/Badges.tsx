import React from 'react';
import {
  TrendingDownIcon,
  TrendingUpIcon,
  MinusIcon,
  ShieldAlertIcon,
  SparklesIcon,
  ActivityIcon,
  ArrowUpRightIcon,
  CircleCheckIcon } from
'lucide-react';
import { Badge } from '../Badge';
import type { Confidence, InsightCategory, InsightState } from '../../types/analytics';
import { categoryLabels, confidenceLabels } from '../../data/insights';
import { formatPercent, formatPoints, toPersianDigits } from '../../utils/format';

const CATEGORY_STYLE: Record<
  InsightCategory,
  {variant: 'danger' | 'warning' | 'info' | 'success' | 'brand';icon: React.ReactNode;}> =
{
  risk: { variant: 'danger', icon: <ShieldAlertIcon className="h-3.5 w-3.5" /> },
  change: { variant: 'warning', icon: <ActivityIcon className="h-3.5 w-3.5" /> },
  opportunity: { variant: 'success', icon: <ArrowUpRightIcon className="h-3.5 w-3.5" /> },
  trend: { variant: 'info', icon: <TrendingUpIcon className="h-3.5 w-3.5" /> },
  positive: { variant: 'success', icon: <SparklesIcon className="h-3.5 w-3.5" /> }
};

export function CategoryBadge({ category }: {category: InsightCategory;}) {
  const style = CATEGORY_STYLE[category];
  return (
    <Badge variant={style.variant} size="sm" icon={style.icon}>
      {categoryLabels[category]}
    </Badge>);

}

const CONFIDENCE_VARIANT: Record<Confidence, 'success' | 'warning' | 'neutral'> = {
  high: 'success',
  medium: 'warning',
  low: 'neutral'
};

export function ConfidenceBadge({
  confidence,
  reasons



}: {confidence: Confidence;reasons?: string[];}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Badge variant={CONFIDENCE_VARIANT[confidence]} size="sm" dot>
        {confidenceLabels[confidence]}
      </Badge>
      {reasons && reasons.length > 0 &&
      <span className="text-[11px] text-gray-700">{reasons[0]}</span>
      }
    </span>);

}

const STATE_LABELS: Record<InsightState, string> = {
  new: 'جدید',
  investigating: 'در حال بررسی',
  reviewed: 'بررسی‌شده',
  dismissed: 'نادیده‌گرفته‌شده'
};

const STATE_VARIANT: Record<InsightState, 'brand' | 'info' | 'neutral'> = {
  new: 'brand',
  investigating: 'info',
  reviewed: 'neutral',
  dismissed: 'neutral'
};

export function StateBadge({ state }: {state: InsightState;}) {
  return (
    <Badge variant={STATE_VARIANT[state]} size="sm">
      {STATE_LABELS[state]}
    </Badge>);

}

export const insightStateLabels = STATE_LABELS;

interface DeltaBadgeProps {
  value: number;
  unit?: 'percent' | 'points';
  positiveWhen?: 'up' | 'down';
}

export function DeltaBadge({ value, unit = 'percent', positiveWhen = 'up' }: DeltaBadgeProps) {
  if (value === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-[12px] font-medium text-gray-700">
        <MinusIcon className="h-3.5 w-3.5" aria-hidden="true" />
        بدون تغییر
      </span>);

  }
  const isUp = value > 0;
  const isGood = positiveWhen === 'up' ? isUp : !isUp;
  const tone = isGood ? 'text-green-700' : 'text-red-700';
  const Icon = isUp ? TrendingUpIcon : TrendingDownIcon;
  const magnitude = unit === 'percent' ? formatPercent(Math.abs(value)) : formatPoints(value);

  return (
    <span className={`inline-flex items-center gap-1 text-[12px] font-bold ${tone}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span>
        {magnitude} {isUp ? 'افزایش' : 'کاهش'}
      </span>
    </span>);

}

export function DataCoverageBadge({ coverage, label }: {coverage: number;label?: string;}) {
  const variant = coverage >= 90 ? 'success' : coverage >= 40 ? 'warning' : 'danger';
  return (
    <Badge variant={variant} size="sm" dot>
      {label ?? 'پوشش داده'}: {toPersianDigits(coverage)}٪
    </Badge>);

}

export function ImpactBadge({ label }: {label: string;}) {
  return (
    <Badge variant="neutral" size="sm" icon={<CircleCheckIcon className="h-3.5 w-3.5" />}>
      {label}
    </Badge>);

}