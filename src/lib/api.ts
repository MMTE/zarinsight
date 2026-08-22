// Live API client (CONTRACTS §5–§7) + adapters from engine shapes to the UI's
// prototype shapes so landed components render real data unchanged.
import type { Insight as UiInsight, InsightCategory, InsightTopic, Kpi } from '../types/analytics';

export interface EngineInsight {
  id: string;
  detectorId: string;
  type: string;
  scope: { type: string; key: string };
  period: { key: string; start: string; end: string };
  title: string;
  summary: string;
  metric: { name: string; value: number; previousValue?: number; changePp?: number; unit: string };
  comparison?: { population: string; value: number; deltaPp?: number; method: string };
  impact?: { amountIrr: number; period: string; method: string; capPp?: number; label: string };
  confidence: 'high' | 'medium' | 'low';
  diagnosis?: Array<{ kind: string; label: string; rows: Array<Record<string, unknown>> }>;
  evidence: { eligiblePopulation: { rows: number; sessions: number; ruleId: string } };
  recommendation: { text: string };
  rankScore: number;
}

export interface OverviewResponse {
  dataset: string; scope: string; dateRange: [string, string];
  kpis: { revenue: number; successRate: number; retryRate: number;
    returningShare: number; sessions: number };
  top3: EngineInsight[];
}

export interface MerchantRow {
  merchant_key: string; category_title: string; sessions: number; revenue: number;
}

const fa = (n: number, digits = 1) => n.toLocaleString('fa-IR', { maximumFractionDigits: digits });

export function faIrr(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1e12) return `${fa(n / 1e12)} تریلیون ریال`;
  if (abs >= 1e9) return `${fa(n / 1e9)} میلیارد ریال`;
  if (abs >= 1e6) return `${fa(n / 1e6)} میلیون ریال`;
  return `${fa(n)} ریال`;
}

const CATEGORY_MAP: Record<string, InsightCategory> = {
  anomaly: 'change', trend: 'trend', opportunity: 'opportunity', risk: 'risk',
  benchmark: 'positive', behavior: 'trend', diagnostic: 'change', seasonal: 'trend',
};
const TOPIC_MAP: Record<string, InsightTopic> = {
  'I-01': 'sales', 'I-02': 'sales', 'I-03': 'payment', 'I-04': 'payment',
  'I-05': 'psp', 'I-06': 'psp', 'I-07': 'payment', 'I-08': 'payment',
  'I-14': 'sales', 'I-18': 'payment', 'I-11': 'customer', 'I-27': 'customer',
};

const METRIC_LABEL: Record<string, string> = {
  revenue: 'درآمد موفق', success_rate: 'نرخ موفقیت', retry_rate: 'نرخ تلاش مجدد',
  attempt_success_rate: 'نرخ موفقیت تلاش', returning_session_share: 'سهم بازگشتی‌ها',
  concentration_top5: 'تمرکز درآمد (۵ مشتری اول)',
};

export function toUiInsight(e: EngineInsight): UiInsight {
  const impactIrr = e.impact?.amountIrr ?? 0;
  const contributions = (e.diagnosis?.[0]?.rows ?? []).map((r) => ({
    label: String(r.driver ?? r.psp ?? r.label ?? 'عامل'),
    points: Number(r.sharePct ?? r.gapPp ?? 0),
  }));
  return {
    id: e.id,
    category: CATEGORY_MAP[e.type] ?? 'change',
    topic: TOPIC_MAP[e.detectorId] ?? 'payment',
    defaultState: 'new',
    title: e.title,
    summary: e.summary,
    detectedOn: e.period.key,
    primary: {
      label: METRIC_LABEL[e.metric.name] ?? e.metric.name,
      value: e.metric.unit === 'rate' ? `${fa(e.metric.value * 100)}٪` : faIrr(e.metric.value),
    },
    comparison: {
      label: e.comparison?.population ?? 'دوره قبل',
      value: e.comparison && e.metric.unit === 'rate'
        ? `${fa(e.comparison.value * 100)}٪`
        : e.comparison ? faIrr(e.comparison.value) : '—',
    },
    impact: impactIrr,
    confidence: e.confidence,
    confidenceReasons: [`جمعیت واجد شرایط: ${fa(e.evidence.eligiblePopulation.sessions)} ردیف`],
    importance: Math.min(5, Math.max(1, Math.round(e.rankScore * 5))),
    whatHappened: [e.title, e.summary],
    howMuchChanged: impactIrr ? `برآورد اثر: ${faIrr(impactIrr)} در ماه` : 'اثر مالی کمیابی ندارد',
    contributions,
    drivers: { label: e.detectorId, children: contributions.map((c) => ({ label: c.label })) },
    peerComparison: e.comparison?.population ?? '—',
    interpretation: e.summary,
    recommendation: e.recommendation.text,
    investigateLabel: 'بررسی',
    investigateTo: `/insights/${encodeURIComponent(e.id)}`,
    chart: e.metric.previousValue != null
      ? [{ label: 'قبل', current: e.metric.value, previous: e.metric.previousValue }]
      : [],
    chartUnit: e.metric.unit === 'rate' ? 'percent' : 'toman',
    evidence: {
      population: `${fa(e.evidence.eligiblePopulation.rows)} ردیف واجد شرایط (${e.evidence.eligiblePopulation.ruleId})`,
      period: e.period.key,
      usableRecords: e.evidence.eligiblePopulation.rows,
      excludedRecords: 0,
      excludedReason: '—',
      rows: [],
      formula: e.impact?.method ?? '—',
      steps: e.diagnosis?.[0]?.rows?.map((r) => ({
        label: String(r.driver ?? r.psp ?? 'عامل'),
        value: String(r.sharePct ?? r.gapPp ?? ''),
      })) ?? [],
      limitation: 'شما می‌توانید فیلتر و پرس‌وجوی تولیدکنندهٔ این عدد را در «محاسبه» ببینید.',
    },
    methodology: {
      type: e.detectorId,
      peerGroup: e.comparison?.population ?? '—',
      minSample: '۱٬۰۰۰ ردیف',
      coverage: e.period.key,
      confidence: e.confidence,
      simple: 'اعداد از موتور قطعی روی پایگاه دادهٔ ساخته‌شده محاسبه شده‌اند.',
      technical: [`detector: ${e.detectorId}`, `rule: ${e.evidence.eligiblePopulation.ruleId}`],
    },
    caveat: 'کارت‌ها شناسه‌های مخصوص همین پذیرنده‌اند؛ مقایسهٔ بین پذیرنده‌ها ممکن نیست.',
  };
}

async function json<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  datasets: () => json<{ active: string; datasets: Array<Record<string, unknown>> }>('/api/datasets'),
  merchants: () => json<{ dataset: string; merchants: MerchantRow[] }>('/api/merchants'),
  insights: (scope?: string, limit = 50) => json<EngineInsight[]>(
    `/api/insights?limit=${limit}${scope && scope !== 'portfolio' ? `&scope=${scope}` : ''}`),
  overview: (scope = 'portfolio') => json<OverviewResponse>(`/api/overview?scope=${scope}`),
  explore: (dim: string, scope = 'portfolio') => json<{ series: Array<Record<string, unknown>> }>(
    `/api/explore/metrics?dim=${dim}&scope=${scope}`),
  records: (id: string, page = 1) => json<{
    total: number; page: number; pageSize: number;
    rows: Array<Record<string, unknown>>; }>(`/api/insights/${encodeURIComponent(id)}/records?page=${page}`),
};

export function kpisFromOverview(o: OverviewResponse): Kpi[] {
  return [
    { id: 'revenue', label: 'درآمد موفق', value: faIrr(o.kpis.revenue),
      deltaUnit: 'percent', positiveWhen: 'up', note: `${fa(o.kpis.sessions)} جلسه پرداخت` },
    { id: 'success-rate', label: 'نرخ موفقیت', value: `${fa(o.kpis.successRate * 100)}٪`,
      deltaUnit: 'percent', positiveWhen: 'up', note: 'فقط Verified' },
    { id: 'retry-rate', label: 'نرخ تلاش مجدد', value: `${fa(o.kpis.retryRate * 100)}٪`,
      deltaUnit: 'percent', positiveWhen: 'down', note: 'جلسه‌های چندتلاشی' },
    { id: 'returning', label: 'سهم بازگشتی‌ها', value: `${fa(o.kpis.returningShare * 100)}٪`,
      deltaUnit: 'percent', positiveWhen: 'up', note: 'کارت‌های شناخته‌شده' },
  ];
}
