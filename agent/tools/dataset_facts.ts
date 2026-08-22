import { defineTool } from 'eve/tools';
import { z } from 'zod';
import { registry } from '../lib/engine-access.ts';

interface MetaRow { key: string; value: string }

export default defineTool({
  description: 'واقعیت‌های مجموعه‌دادهٔ فعال: تعداد ردیف‌ها/جلسه‌ها/پذیرنده‌ها، بازهٔ زمانی، منبع و فیلدهای موجود. اولین ابزار برای سؤال‌های «وضعیت کلی».',
  inputSchema: z.object({}),
  async execute() {
    const ds = registry.active();
    // our own meta table — one named cast at the boundary
    const rows = ds.db.prepare('SELECT key, value FROM meta').all() as unknown as MetaRow[];
    const meta = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return {
      datasetId: ds.id,
      provider: String(ds.manifest.provider ?? meta.provider),
      grain: String(ds.manifest.grain ?? meta.grain),
      merchantScope: String(ds.manifest.merchantScope ?? meta.merchant_scope),
      dateRange: [meta.date_min, meta.date_max],
      counts: {
        rows: Number(meta.count_rows), sessions: Number(meta.count_sessions),
        merchants: Number(meta.count_merchants), psps: Number(meta.count_psps),
        cards: Number(meta.count_cards), quarantine: Number(meta.count_quarantine),
      },
      totalVerifiedRevenueIrr: Number(meta.count_revenue),
    };
  },
});
