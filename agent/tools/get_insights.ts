import { defineTool } from 'eve/tools';
import { z } from 'zod';
import { registry } from '../lib/engine-access.ts';

interface InsightRow { payload: string }

export default defineTool({
  description: 'فهرست بینش‌های منتشرشده برای یک پذیرنده یا کل پرتفوی (رتبه‌بندی‌شده بر اساس اثر مالی). هر بینش شامل عنوان فارسی، خلاصه، متریک، اثر ریالی و فیلتر بازتولید است.',
  inputSchema: z.object({
    merchantKey: z.string().optional().describe('کلید پذیرنده مثل M156؛ خالی = کل پرتفوی'),
    limit: z.number().int().min(1).max(50).default(10),
  }),
  async execute({ merchantKey, limit }) {
    const ds = registry.active();
    // better-sqlite3 returns unknown[]; the column list is ours — one named cast.
    const rows = (merchantKey
      ? ds.db.prepare('SELECT payload FROM insights WHERE lifecycle = ? AND scope_key = ? ORDER BY rank_score DESC LIMIT ?')
        .all('published', merchantKey, limit)
      : ds.db.prepare('SELECT payload FROM insights WHERE lifecycle = ? ORDER BY rank_score DESC LIMIT ?')
        .all('published', limit)) as InsightRow[];
    return rows.map((r) => {
      const i = JSON.parse(r.payload);
      return {
        id: i.id, type: i.type, period: i.period?.key, title: i.title,
        metric: i.metric?.name, value: i.metric?.value,
        impactIrr: i.impact?.amountIrr ?? null, confidence: i.confidence,
        recommendation: i.recommendation?.text,
      };
    });
  },
});
