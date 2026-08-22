// Persian copy templates (ADR-0008) — the ONLY place detector prose lives.
// Numbers are interpolated from engine results; never hand-written digits.
// Prose review pass is a named step (plan Task 5).

export const faNum = (n: number): string => n.toLocaleString('fa-IR');

/** 12,345,678 ریال → «۱۲٫۳ میلیون ریال» style humanization (ADR-0008). */
export function faIrr(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1e12) return `${(n / 1e12).toLocaleString('fa-IR', { maximumFractionDigits: 1 })} تریلیون ریال`;
  if (abs >= 1e9) return `${(n / 1e9).toLocaleString('fa-IR', { maximumFractionDigits: 1 })} میلیارد ریال`;
  if (abs >= 1e6) return `${(n / 1e6).toLocaleString('fa-IR', { maximumFractionDigits: 1 })} میلیون ریال`;
  if (abs >= 1e3) return `${(n / 1e3).toLocaleString('fa-IR', { maximumFractionDigits: 0 })} هزار ریال`;
  return `${faNum(n)} ریال`;
}

export const faPct = (x: number, digits = 1): string =>
  `${(x * 100).toLocaleString('fa-IR', { maximumFractionDigits: digits })}٪`;

export const faPp = (x: number): string =>
  `${x.toLocaleString('fa-IR', { maximumFractionDigits: 1 })} واحد درصد`;

export const copy = {
  i01Title: (dir: 'up' | 'down', week: string, irr: string) =>
    dir === 'down'
      ? `درآمد هفته ${week} پایین‌تر از بازهٔ انتظار بود: ${irr}`
      : `درآمد هفته ${week} بالاتر از بازهٔ انتظار بود: ${irr}`,
  i01Summary: (irr: string, dev: string) =>
    `درآمد تراکنش‌های موفق نسبت به میانهٔ ۸ هفتهٔ قبل ${dev} انحراف داشته است؛ مقدار انحراف ${irr} است.`,
  i02Title: (topDriver: string, share: string) =>
    `مهم‌ترین عامل تغییر درآمد: ${topDriver} (${share} از تغییر)`,
  i03Title: (month: string, rate: string, delta: string) =>
    `نرخ موفقیت ${month} به ${rate} رسید (${delta} نسبت به قبل)`,
  i03Summary: (month: string, rate: string, base: string, irr: string) =>
    `نرخ موفقیت پرداخت در ${month} ${rate} است در حالی که بازهٔ انتظار ${base} بود. برآورد اثر مالی ${irr} در ماه.`,
  i04Title: (dim: string, seg: string, gap: string) =>
    `بخش ${seg} (${dim}) ${gap} پایین‌تر از میانگین کسب‌وکار شماست`,
  i04Summary: (seg: string, gap: string, irr: string) =>
    `ترافیک ${seg} با وجود حجم قابل‌توجه، پس از تعدیل ترکیب ${gap} کمتر از مورد انتظار تبدیل می‌شود. پتانسیل بهبود ${irr} در ماه برآورد شده است.`,
  i05Title: (psp: string, gap: string) =>
    `${psp} برای ترافیک مشابه ${gap} ضعیف‌تر از بقیه مسیرهاست`,
  i05Summary: (psp: string, rate: string, adjRate: string, irr: string) =>
    `نرخ موفقیت ${psp} ${rate} است؛ پس از تعدیل ترکیب ترافیک، شکاف با بهترین مسیر ${adjRate} باقی می‌ماند. برآورد انتقال ترافیک: ${irr} در ماه.`,
  i06Title: (psp: string, merchant: string, gap: string) =>
    `${psp} فقط برای ${merchant} ضعیف عمل می‌کند (${gap} پایین‌تر از سایر مسیرهای همین کسب‌وکار)`,
  i07Title: (rate: string, psp: string) =>
    `${rate} از پرداخت‌ها به تلاش دوباره نیاز دارند؛ بیشترین تمرکز در ${psp}`,
  i07Summary: (rate: string, recover: string) =>
    `از جلسه‌های چندتلاشی، ${recover} در نهایت موفق می‌شوند. تمرکز تلاش مجدد روی یک مسیر، نشانهٔ اصطکاک پرداخت است.`,
  i08Title: (irr: string) => `بازگرداندنی: ${irr} در ماه از پرداخت‌های ناموفق`,
  i08Summary: (gap: string, irr: string) =>
    `فاصلهٔ نرخ موفقیت شما با میانهٔ گروه مشابه ${gap} است؛ با سقف محافظه‌کارانهٔ ۱۰ واحد درصد، ${irr} در ماه برآورد فرصت است (تضمین‌شده نیست).`,
  i14Title: (metric: string, n: string, dir: string) =>
    `روند پیوسته: ${metric} برای ${n} دورهٔ متوالی ${dir} بوده است`,
  i18Title: (metric: string, pos: string) =>
    `${metric} شما در ${pos} گروه مشابه قرار دارد`,
  i18Summary: (metric: string, mine: string, med: string, q3: string) =>
    `${metric} شما ${mine} است؛ میانهٔ گروه مشابه ${med} و خانهٔ چهارم ${q3}.`,
  i11Title: (ret: string) => `${ret} از پرداخت‌های موفق از مشتریان بازگشتی است`,
  i11Summary: (repeat: string, ret: string) =>
    `${repeat} از کارت‌های شناخته‌شده دوباره پرداخت کرده‌اند و ${ret} از پرداخت‌های موفق از بازگشتی‌هاست (شرط‌بندی روی موفقیت — فقط کارت‌های شناخته‌شده نزد این پذیرنده).`,
  i27Title: (top5: string) => `${top5} از درآمد موفق به ۵ مشتری اول وابسته است`,
  i27Summary: (top5: string, top1: string, irr: string) =>
    `سهم ۵ مشتری اول ${top5} و سهم مشتری اول ${top1} است. اگر مشتری اول را از دست بدهید ${irr} در ماه در معرض است.`,
  concentrationChip: 'تمرکز درآمد',
  recoverableChip: 'برآورد فرصت',
  riskChip: 'ریسک',
} as const;
