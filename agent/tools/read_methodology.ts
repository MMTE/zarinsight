import { defineTool } from 'eve/tools';
import { z } from 'zod';
import { registry } from '../lib/engine-access.ts';

interface MetaRow { key: string; value: string }

export default defineTool({
  description: 'قواعد واجد شرایطی، هشدارها و روش تحلیل — همان محتوای صفحهٔ «روش تحلیل». برای سؤال‌های «این عدد چطور حساب شده» و «چرا این تحلیل وجود ندارد».',
  inputSchema: z.object({}),
  async execute() {
    const ds = registry.active();
    const rows = ds.db.prepare('SELECT key, value FROM meta').all() as unknown as MetaRow[];
    const meta = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return {
      rules: [
        { ruleId: 'R-ALL', fa: 'همهٔ جلسه‌ها' },
        { ruleId: 'R-SUCCESS', fa: 'فقط جلسه‌های Verified (درآمد و میانگین مبلغ)' },
        { ruleId: 'R-ATTEMPT', fa: 'تلاش‌های واقعی (بدون NoAttempt) — نرخ تلاش و مسیر پرداخت' },
        { ruleId: 'R-CARD', fa: 'کارت‌های شناخته‌شدهٔ همین پذیرنده، فقط پرداخت موفق' },
        { ruleId: 'R-CODED', fa: 'تلاش‌های ناموفق دارای کد پاسخ (~۶٪ شکست‌ها)' },
        { ruleId: 'R-VERIFY-MS / R-INIT-MS', fa: 'زمان پاسخ PSP روی تلاش‌های مربوطه' },
        { ruleId: 'R-MERCHANT-ONLY', fa: 'فقط در دامنهٔ یک پذیرنده (تمرکز درآمد)' },
      ],
      caveats: [
        'موفقیت = Verified فقط؛ Paid برداشتِ تاییدنشده است.',
        'adjusted_fee با ضریب محرمانه ضرب شده — فقط نسبت‌ها معتبرند.',
        'کارت‌ها به ازای هر پذیرنده‌اند؛ هویت مشتری بین پذیرنده‌ها قابل پیوند نیست.',
        'کدهای پاسخ PSP-دوداتی‌اند و دیکشنری ندارند.',
        'پنجرهٔ داده ۶ ماه است؛ ادعای سال‌به‌سال معتبر نیست.',
      ],
      schemaVersion: meta.schema_version,
      rulesVersion: meta.eligibility_rules_version,
      infeasible: [
        'مقایسهٔ نرخ موفقیت مشتری جدید در برابر بازگشتی (کارت‌ها فقط روی موفق‌ها موجودند)',
        'سفر مشتری بین پذیرنده‌ها',
        'تحلیل بازپرداخت (۱ ردیف Reversed در کل داده)',
      ],
    };
  },
});
