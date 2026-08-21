import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../Card';
import { Button } from '../Button';
import { CategoryBadge, ConfidenceBadge, StateBadge } from './Badges';
import type { Insight, InsightState } from '../../types/analytics';
import { topicLabels } from '../../data/insights';
import { formatToman } from '../../utils/format';

interface InsightCardProps {
  insight: Insight;
  state: InsightState;
  compact?: boolean;
}

export function InsightCard({ insight, state, compact = false }: InsightCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      as="article"
      padding="md"
      elevation="low"
      className="border-border-light transition-shadow hover:shadow-xs">
      
      <div className="flex flex-wrap items-center gap-2">
        <CategoryBadge category={insight.category} />
        <span className="text-[11px] text-gray-700">{topicLabels[insight.topic]}</span>
        <span className="ms-auto flex items-center gap-2">
          <StateBadge state={state} />
        </span>
      </div>

      <h3 className="mt-3 text-[16px] font-bold leading-7 text-gray-950">{insight.title}</h3>
      <p className="mt-1.5 text-[13px] leading-7 text-gray-800">{insight.summary}</p>

      <div className="mt-4 flex flex-wrap items-end gap-6">
        <div>
          <p className="text-[11px] text-gray-700">{insight.primary.label}</p>
          <p className="mt-1 text-[24px] font-bold leading-none text-gray-950">
            {insight.primary.value}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-gray-700">{insight.comparison.label}</p>
          <p className="mt-1 text-[18px] font-bold leading-none text-gray-700">
            {insight.comparison.value}
          </p>
        </div>
        {insight.gap &&
        <div>
            <p className="text-[11px] text-gray-700">فاصله</p>
            <p className="mt-1 text-[18px] font-bold leading-none text-gray-950">{insight.gap}</p>
          </div>
        }
      </div>

      {!compact &&
      <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-border-light pt-3 text-[12px]">
          <div className="flex items-center gap-1.5">
            <dt className="text-gray-700">اثر مالی برآوردی:</dt>
            <dd className="font-bold text-gray-950">
              {insight.impact > 0 ? `${formatToman(insight.impact)} در ماه` : 'برآورد نشده'}
            </dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt className="text-gray-700">اطمینان:</dt>
            <dd>
              <ConfidenceBadge confidence={insight.confidence} reasons={insight.confidenceReasons} />
            </dd>
          </div>
        </dl>
      }

      {!compact &&
      <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-[12px] leading-6 text-gray-800">
          <span className="font-bold text-gray-950">پیشنهاد برای بررسی: </span>
          {insight.recommendation}
        </p>
      }

      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" onClick={() => navigate(`/insights/${insight.id}`)}>
          بررسی یافته
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/insights/${insight.id}#evidence`)}>
          
          شواهد و محاسبه
        </Button>
      </div>
    </Card>);

}