import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { InsightState } from '../types/analytics';
import { insights } from '../data/insights';

interface AnalysisContextValue {
  period: string;
  setPeriod: (value: string) => void;
  compare: string;
  setCompare: (value: string) => void;
  periodLabel: string;
  compareLabel: string;
  states: Record<string, InsightState>;
  setInsightState: (id: string, state: InsightState) => void;
  readNotifications: string[];
  markNotificationRead: (id: string) => void;
}

const AnalysisContext = createContext<AnalysisContextValue | null>(null);

const PERIOD_LABELS: Record<string, string> = {
  '7': '۷ روز اخیر',
  '30': '۳۰ روز اخیر',
  '90': '۹۰ روز اخیر',
  '180': '۶ ماه اخیر',
  custom: 'بازه دلخواه'
};

const COMPARE_LABELS: Record<string, string> = {
  previous: 'مقایسه با دوره قبل',
  lastYear: 'مقایسه با همین بازه در گذشته',
  none: 'بدون مقایسه'
};

const initialStates = insights.reduce<Record<string, InsightState>>((acc, insight) => {
  acc[insight.id] = insight.defaultState;
  return acc;
}, {});

export function AnalysisProvider({ children }: {children: React.ReactNode;}) {
  const [period, setPeriod] = useState('30');
  const [compare, setCompare] = useState('previous');
  const [states, setStates] = useState<Record<string, InsightState>>(initialStates);
  const [readNotifications, setReadNotifications] = useState<string[]>([]);

  const setInsightState = useCallback((id: string, state: InsightState) => {
    setStates((prev) => ({ ...prev, [id]: state }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setReadNotifications((prev) => prev.includes(id) ? prev : [...prev, id]);
  }, []);

  const value = useMemo<AnalysisContextValue>(
    () => ({
      period,
      setPeriod,
      compare,
      setCompare,
      periodLabel: PERIOD_LABELS[period] ?? PERIOD_LABELS['30'],
      compareLabel: COMPARE_LABELS[compare] ?? COMPARE_LABELS.previous,
      states,
      setInsightState,
      readNotifications,
      markNotificationRead
    }),
    [period, compare, states, setInsightState, readNotifications, markNotificationRead]
  );

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
}

export function useAnalysis(): AnalysisContextValue {
  const context = useContext(AnalysisContext);
  if (!context) throw new Error('useAnalysis باید داخل AnalysisProvider استفاده شود.');
  return context;
}