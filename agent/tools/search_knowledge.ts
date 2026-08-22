import { defineTool } from 'eve/tools';
import { z } from 'zod';
import { searchKnowledge } from '../../src/lib/search/knowledge.ts';

// ADR-0013: BM25 retrieval over the project's own knowledge corpus (ADRs,
// spec, research, INSIGHT-CATALOG, CONTRACTS). Grounds methodology/definition
// answers with citable sections — search returns ids/paths, never figures.
export default defineTool({
  description:
    'جست‌وجو در دانش پروژه (ADRها، مشخصات فنی، پژوهش‌ها، کاتالوگ بینش‌ها، قراردادها). ' +
    'برای هر پرسش دربارهٔ روش تحلیل، تعریف متریک‌ها، قواعد کیفیت داده، «چرا این تحلیل وجود ندارد» ' +
    'یا محدودیت‌های منبع داده، اول این ابزار را صدا بزن و پاسخ را با «منابع» (deepUrl) مستند کن. ' +
    'فارسی و انگلیسی هر دو جست‌وجو می‌شوند.',
  inputSchema: z.object({
    query: z.string().min(2).describe('عبارت جست‌وجو؛ فارسی برای مفاهیم، انگلیسی برای شناسه‌ها (ADR-0006، SegmentFilter)'),
    limit: z.number().int().min(1).max(10).default(5),
  }),
  async execute({ query, limit }) {
    const results = searchKnowledge(query, limit);
    return {
      query,
      resultCount: results.length,
      results,
      hint: results.length === 0
        ? 'نتیجه‌ای نیامد. یک‌بار بازنویسی کن (فارسی/انگلیسی یا اصطلاح دقیق‌تر)؛ بعد از ۲–۳ تلاش صادقانه بگو مطمئن نیستی.'
        : 'هر ادعا را با deepUrl (مسیر docs + لنگر بخش) زیر «منابع» بیاور؛ عدد از این ابزار نمی‌آید.',
    };
  },
});
