import { defineTool } from 'eve/tools';
import { z } from 'zod';
import { computeMetric } from '../../src/lib/engine/metrics.ts';
import { registry } from '../lib/engine-access.ts';

export default defineTool({
  description: 'محاسبهٔ یک متریک معیار روی یک فیلتر بازه/پذیرنده. فقط متریک‌های معتبر CONTRACTS §2. خروجی شامل مقدار، جمعیت واجد شرایط و شناسهٔ قاعدهٔ واجد شرایطی است.',
  inputSchema: z.object({
    metric: z.enum(['revenue', 'demand_sessions', 'success_rate', 'capture_rate',
      'unverified_capture_rate', 'unverified_capture_irr', 'attempt_success_rate',
      'avg_success_amount', 'fee_index', 'retry_rate', 'repeat_card_rate',
      'returning_session_share', 'p95_verify_latency', 'p95_init_latency',
      'concentration_top5']),
    merchantKey: z.string().optional(),
    dateFrom: z.string().describe('YYYY-MM-DD'),
    dateTo: z.string().describe('YYYY-MM-DD'),
    pspCodes: z.array(z.string()).optional(),
    amountBand: z.enum(['q1', 'q2', 'q3', 'q4', 'top10']).optional(),
    hourFrom: z.number().int().min(0).max(23).optional(),
    hourTo: z.number().int().min(0).max(23).optional(),
    cardRepeat: z.enum(['new', 'returning']).optional(),
  }),
  async execute(input) {
    const ds = registry.active();
    const result = computeMetric(ds.db, input.metric, {
      dateRange: [input.dateFrom, input.dateTo],
      ...(input.merchantKey ? { merchantKeys: [input.merchantKey] } : {}),
      ...(input.pspCodes ? { pspCodes: input.pspCodes } : {}),
      ...(input.amountBand ? { amountBand: input.amountBand } : {}),
      ...(input.hourFrom != null && input.hourTo != null
        ? { hourOfDay: [input.hourFrom, input.hourTo] } : {}),
      ...(input.cardRepeat ? { cardRepeat: input.cardRepeat } : {}),
    });
    if (!result) return { eligible: false, reason: 'no-eligible-population' };
    return {
      eligible: true, metric: result.name, value: result.value, unit: 'raw',
      eligibleRows: result.n, ruleId: result.ruleId, filterApplied: true,
    };
  },
});
