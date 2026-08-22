// Live API client (CONTRACTS §5–§7) + adapters from engine shapes to the UI's
// prototype shapes so landed components render real data unchanged.
import type { Insight as UiInsight, InsightCategory, InsightTopic, Kpi } from '../types/analytics';
import type { SegmentFilter } from './types';

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
  evidence: {
    eligiblePopulation: { rows: number; sessions: number; ruleId: string };
    filter: SegmentFilter;
    sql: string;
    dataCaveats: string[];
  };
  recommendation: { text: string };
  rankScore: number;
}

export interface RecordsPage {
  total: number;
  page: number;
  pageSize: number;
  rows: Array<Record<string, unknown>>;
  filter?: SegmentFilter;
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
  concentration_top_decile: 'تمرکز درآمد (۱۰٪ مشتریان بزرگ)',
};

/** Persian description of each impact formula (impact.ts F-01…F-04). */
const IMPACT_FORMULA_FA: Record<string, string> = {
  'F-01': 'مبلغ پرداخت‌های ناموفق × شکاف نرخ با گروه مشابه (سقف ۱۰ واحد درصد)، ماهانه‌شده',
  'F-02': 'ارزش موفق مسیر ضعیف × شکاف تعدیل‌شده با بهترین مسیر (سقف ۱۰ واحد درصد)',
  'F-03': 'سهم مشتری اول × درآمد ماهانه',
  'F-04': 'درصد تغییر × درآمد ماهانهٔ جاری',
};

export function toUiInsight(e: EngineInsight): UiInsight {
  const impactIrr = e.impact?.amountIrr ?? 0;
  const periodLabel = e.period.start && e.period.end
    ? `${e.period.start} تا ${e.period.end}`
    : e.period.key;                                     // some atoms carry only periodKey
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
      population: `${fa(e.evidence.eligiblePopulation.rows)} ردیف واجد شرایط (${fa(e.evidence.eligiblePopulation.sessions)} جلسه) — قاعدهٔ ${e.evidence.eligiblePopulation.ruleId}`,
      period: periodLabel,
      usableRecords: e.evidence.eligiblePopulation.rows,
      excludedRecords: 0,
      excludedReason: '—',
      rows: [
        { label: 'قاعدهٔ واجد شرایط', value: e.evidence.eligiblePopulation.ruleId,
          note: `${fa(e.evidence.eligiblePopulation.rows)} ردیف / ${fa(e.evidence.eligiblePopulation.sessions)} جلسه` },
        { label: 'آشکارساز', value: e.detectorId, note: `نوع: ${e.type}` },
        ...(e.comparison ? [{ label: 'گروه مقایسه', value: e.comparison.population,
          note: `روش: ${e.comparison.method === 'mix_adjusted' ? 'تعدیل‌شده با ترکیب' : 'میانگین ساده' }` }] : []),
        ...(e.impact ? [{ label: 'روش برآورد اثر', value: e.impact.method,
          note: `به ازای هر ${e.impact.period === 'month' ? 'ماه' : e.impact.period}` }] : []),
      ],
      formula: e.impact ? IMPACT_FORMULA_FA[e.impact.method] ?? e.impact.method
        : 'مقدار مستقیماً روی جامعهٔ واجد شرایطِ فیلتر زیر محاسبه شده است.',
      steps: e.diagnosis?.[0]?.rows?.map((r) => ({
        label: String(r.driver ?? r.psp ?? 'عامل'),
        value: String(r.sharePct ?? r.gapPp ?? ''),
      })) ?? (e.metric.previousValue != null ? [
        { label: 'دوره قبل', value: e.metric.unit === 'rate' ? `${fa(e.metric.previousValue * 100)}٪` : faIrr(e.metric.previousValue) },
        { label: 'دوره فعلی', value: e.metric.unit === 'rate' ? `${fa(e.metric.value * 100)}٪` : faIrr(e.metric.value) },
      ] : []),
      limitation: e.evidence.dataCaveats?.length
        ? e.evidence.dataCaveats.join('؛ ')
        : 'فیلتر و پرس‌وجوی تولیدکنندهٔ این عدد را در «مشاهده محاسبه» ببینید.',
    },
    methodology: {
      type: e.detectorId,
      peerGroup: e.comparison?.population ?? '—',
      minSample: '۱٬۰۰۰ ردیف',
      coverage: periodLabel,
      confidence: e.confidence,
      simple: 'اعداد از موتور قطعی روی پایگاه دادهٔ ساخته‌شده محاسبه شده‌اند.',
      technical: [
        `detector: ${e.detectorId}`,
        `rule: ${e.evidence.eligiblePopulation.ruleId}`,
        ...(e.evidence.sql ? [e.evidence.sql] : []),
      ],
    },
    caveat: 'کارت‌ها شناسه‌های مخصوص همین پذیرنده‌اند؛ مقایسهٔ بین پذیرنده‌ها ممکن نیست.',
  };
}
type EngineInsightsResponse = EngineInsight[];

async function json<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  datasets: () => json<{ active: string; datasets: Array<Record<string, unknown>> }>('/api/datasets'),
  merchants: () => json<{ dataset: string; merchants: MerchantRow[] }>('/api/merchants'),
  insights: (scope?: string, limit = 50) => json<EngineInsightsResponse>(
    `/api/insights?limit=${limit}${scope && scope !== 'portfolio' ? `&scope=${scope}` : ''}`),
  insight: (id: string) => json<EngineInsight>(`/api/insights/${encodeURIComponent(id)}`),
  overview: (scope = 'portfolio') => json<OverviewResponse>(`/api/overview?scope=${scope}`),
  explore: (dim: string, scope = 'portfolio') => json<{ series: Array<Record<string, unknown>> }>(
    `/api/explore/metrics?dim=${dim}&scope=${scope}`),
  records: (id: string, page = 1) => json<RecordsPage>(
    `/api/insights/${encodeURIComponent(id)}/records?page=${page}`),
};

export function kpisFromOverview(o: OverviewResponse): Kpi[] {
  return [
    { id: 'revenue', label: 'درآمد موفق', value: faIrr(o.kpis.revenue), delta: undefined,
      deltaUnit: 'percent', positiveWhen: 'up', note: `${fa(o.kpis.sessions)} جلسه پرداخت` },
    { id: 'success-rate', label: 'نرخ موفقیت', value: `${fa(o.kpis.successRate * 100)}٪`, delta: undefined,
      deltaUnit: 'percent', positiveWhen: 'up', note: 'فقط Verified' },
    { id: 'retry-rate', label: 'نرخ تلاش مجدد', delta: undefined, value: `${fa(o.kpis.retryRate * 100)}٪`,
      deltaUnit: 'percent', positiveWhen: 'down', note: 'جلسه‌های چندتلاشی' },
    { id: 'returning', label: 'سهم بازگشتی‌ها', delta: undefined, value: `${fa(o.kpis.returningShare * 100)}٪`,
      deltaUnit: 'percent', positiveWhen: 'up', note: 'کارت‌های شناخته‌شده' },
  ];
}
