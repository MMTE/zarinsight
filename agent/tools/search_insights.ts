import { defineTool } from 'eve/tools';
import { z } from 'zod';
import { registry } from '../lib/engine-access.ts';
import { searchInsights } from '../../src/lib/search/insights.ts';

// ADR-0013: free-text discovery over published insights — reaches relevant
// insights below the top of the ranked feed. Merchant-scoped like get_insights;
// numbers shown are the stored payload's, never recomputed (ADR-0004).
export default defineTool({
  description:
    'جست‌وجوی متنی بین بینش‌های منتشرشده (عنوان، خلاصه، توصیه) برای یک پذیرنده یا کل پرتفوی. ' +
    'وقتی کاربر موضوعی می‌پرسد («کجا درآمد از دست رفته؟»، «وضعیت PSP-08؟»، «ریسک تمرکز مشتری») ' +
    'اول این ابزار، بعد در صورت نیاز get_insights برای جزئیات و query_metric برای اعداد تازه.',
  inputSchema: z.object({
    query: z.string().min(2).describe('عبارت جست‌وجو؛ مثلاً «افت نرخ موفقیت» یا «درآمد قابل بازیابی PSP»'),
    merchantKey: z.string().optional().describe('کلید پذیرنده مثل M156؛ خالی = کل پرتفوی'),
    limit: z.number().int().min(1).max(20).default(6),
  }),
  async execute({ query, merchantKey, limit }) {
    const ds = registry.active();
    const results = searchInsights(ds.db, ds.id, { query, merchantKey, limit });
    return {
      query,
      dataset: ds.id,
      resultCount: results.length,
      results,
      hint: results.length === 0
        ? 'بینشی مطابق نیامد. عبارت را کوتاه‌تر یا با واژهٔ حوزهٔ پرداخت بازنویسی کن؛ یا get_insights برای فهرست رتبه‌بندی‌شده.'
        : 'پیوند هر بینش deepUrl است (/insights/<id>)؛ ارقام همین payload ذخیره‌شده‌اند — عدد تازه فقط از query_metric.',
    };
  },
});
