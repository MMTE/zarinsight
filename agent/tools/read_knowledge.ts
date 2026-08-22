import { defineTool } from 'eve/tools';
import { z } from 'zod';
import { readKnowledge } from '../../src/lib/search/knowledge.ts';

// ADR-0013 companion to search_knowledge: full text of one corpus doc when a
// snippet is not enough (exact rule wording, full ADR reasoning).
export default defineTool({
  description:
    'متن کامل یک سند دانش را با مسیر آن بخوان (مسیری که search_knowledge برگردانده، ' +
    'مثل "adr/0006-fee-multiplier-handling.md"). وقتی قطعهٔ کافی نیست: متن دقیق قاعده، ' +
    'استدلال کامل ADR یا فهرست کامل تحلیل‌های ناممکن. هر سند را کامل نخوان — بیشتر پرسش‌ها با قطعه‌ها پاسخ می‌شوند.',
  inputSchema: z.object({
    path: z.string().min(3).describe('مسیر سند از خروجی search_knowledge، مثل "adr/0006-fee-multiplier-handling.md"'),
  }),
  async execute({ path }) {
    const doc = readKnowledge(path);
    if (doc === null) {
      return { error: 'not_found', hint: 'مسیر ناشناخته است. اول search_knowledge را صدا بزن و از مسیرهای برگشتی استفاده کن.' };
    }
    return doc;
  },
});
