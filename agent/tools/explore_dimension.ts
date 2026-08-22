import { defineTool } from 'eve/tools';
import { z } from 'zod';
import { registry } from '../lib/engine-access.ts';

export default defineTool({
  description: 'شکستن یک متریک بر اساس یک بعد: مسیر پرداخت (psp)، ماه، ساعت یا روز. برای پاسخ به «چرا تغییر کرده» از این ابزار استفاده کن.',
  inputSchema: z.object({
    dim: z.enum(['month', 'hour', 'psp']),
    merchantKey: z.string().optional(),
  }),
  async execute({ dim, merchantKey }) {
    const ds = registry.active();
    const where = merchantKey ? 'merchant_key = ?' : '1=1';
    const params = merchantKey ? [merchantKey] : [];
    const queries = {
      month: `SELECT substr(date_id,1,7) d, SUM(sessions) sessions, SUM(success) success, SUM(revenue) revenue FROM agg_daily WHERE ${where} GROUP BY d ORDER BY d`,
      hour: `SELECT hour d, SUM(sessions) sessions, SUM(success) success, SUM(revenue) revenue FROM agg_hourly WHERE ${where} GROUP BY hour ORDER BY d`,
      psp: `SELECT psp_code d, SUM(attempts) attempts, SUM(verified) verified, SUM(success_value) revenue FROM agg_psp_merchant WHERE ${where} GROUP BY psp_code ORDER BY d`,
    } as const;
    const rows = ds.db.prepare(queries[dim]).all(...params);
    return rows.map((r) => {
      const row = r as Record<string, unknown>;
      const sessions = Number(row.sessions ?? row.attempts ?? 0);
      const success = Number(row.success ?? row.verified ?? 0);
      return {
        segment: String(row.d ?? row.psp_code), sessions,
        success, successRate: sessions ? success / sessions : 0,
        revenue: Number(row.revenue ?? 0),
      };
    });
  },
});
