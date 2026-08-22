export type InsightCategory = 'opportunity' | 'risk' | 'change' | 'trend' | 'positive';

export type InsightTopic = 'sales' | 'payment' | 'customer' | 'psp' | 'time';

export type Confidence = 'high' | 'medium' | 'low';

export type InsightState = 'new' | 'investigating' | 'reviewed' | 'dismissed';

export interface Contribution {
  label: string;
  points: number;
  to?: string;
}

export interface DriverNode {
  label: string;
  value?: string;
  relation?: string;
  children?: DriverNode[];
}

export interface Evidence {
  population: string;
  period: string;
  usableRecords: number;
  excludedRecords: number;
  excludedReason: string;
  rows: {label: string;value: string;note?: string;}[];
  formula: string;
  steps: {label: string;value: string;}[];
  limitation: string;
}

export interface Methodology {
  type: string;
  peerGroup: string;
  minSample: string;
  coverage: string;
  confidence: string;
  simple: string;
  technical: string[];
}

export interface Insight {
  id: string;
  category: InsightCategory;
  topic: InsightTopic;
  defaultState: InsightState;
  title: string;
  summary: string;
  detectedOn: string;
  primary: {label: string;value: string;};
  comparison: {label: string;value: string;};
  gap?: string;
  impact: number;
  impactRange?: [number, number];
  confidence: Confidence;
  confidenceReasons: string[];
  importance: number;
  whatHappened: string[];
  howMuchChanged: string;
  contributions: Contribution[];
  drivers: DriverNode;
  peerComparison: string;
  interpretation: string;
  recommendation: string;
  investigateLabel: string;
  investigateTo: string;
  chart: {label: string;current: number;previous?: number;}[];
  chartUnit: 'percent' | 'toman' | 'second';
  evidence: Evidence;
  methodology: Methodology;
  caveat?: string;
}

export interface Kpi {
  id: string;
  label: string;
  value: string;
  unit?: string;
  delta: number;
  deltaUnit: 'percent' | 'points';
  positiveWhen: 'up' | 'down';
  note: string;
}