// Live insights hook — one fetch per merchant, module-cached; mock fallback keeps
// pages renderable offline (ADR-0009 single origin, /api via Vite middleware).
import { useEffect, useState } from 'react';
import { api, toUiInsight } from './api';
import type { Insight as UiInsight } from '../types/analytics';
import { insights as mockInsights, insightsByTopic as mockByTopic } from '../data/insights';
import { useAnalysis } from '../contexts/AnalysisContext';

const cache = new Map<string, UiInsight[]>();

export function useLiveInsights(topic?: string): UiInsight[] {
  const { merchantKey } = useAnalysis();
  const key = merchantKey ?? 'portfolio';
  const [list, setList] = useState<UiInsight[] | null>(cache.get(key) ?? null);

  useEffect(() => {
    if (cache.has(key)) { setList(cache.get(key)!); return; }
    let alive = true;
    api.insights(key === 'portfolio' ? undefined : key).then((rows) => {
      const mapped = rows.map(toUiInsight);
      cache.set(key, mapped);
      if (alive) setList(mapped);
    }).catch(() => { /* mock fallback below */ });
    return () => { alive = false; };
  }, [key]);

  if (list) return topic ? list.filter((i) => i.topic === topic) : list;
  return topic ? mockByTopic(topic) : mockInsights;
}
