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
      ? `درآمد هفته ${week} ${irr} پایین‌تر از انتظار بود`
      : `درآمد هفته ${week} ${irr} بالاتر از انتظار بود`,
  i01Summary: (irr: string, dev: string) =>
    `این هفته ${dev} با میانهٔ ۸ هفتهٔ قبل فاصله دارد (${irr}).`,
  i02Title: (topDriver: string, share: string) =>
    `تغییر درآمد: سهم اصلی ${topDriver} است (${share})`,
  i03Title: (month: string, rate: string, delta: string) =>
    `نرخ موفقیت ${month}: ${rate} (${delta} نسبت به قبل)`,
  i03Summary: (month: string, rate: string, base: string, irr: string) =>
    `انتظار ${base} بود. برآورد اثر: ${irr} در ماه.`,
  i04Title: (dim: string, seg: string, gap: string) =>
    `${seg} در ${dim} ${gap} ضعیف‌تر تبدیل می‌شود`,
  i04Summary: (seg: string, gap: string, irr: string) =>
    `پس از تعدیل ترکیب، ${seg} ${gap} پایین‌تر از میانگین شماست. پتانسیل: ${irr} در ماه.`,
  i05Title: (psp: string, gap: string) =>
    `${psp} روی ترافیک مشابه ${gap} ضعیف‌تر است`,
  i05Summary: (psp: string, rate: string, adjRate: string, irr: string) =>
    `نرخ ${psp} ${rate}؛ شکاف تعدیل‌شده با بهترین مسیر ${adjRate}. انتقال ترافیک: ${irr} در ماه.`,
  i06Title: (psp: string, merchant: string, gap: string) =>
    `${psp} فقط برای ${merchant} ضعیف است (${gap} کمتر از سایر مسیرها)`,
  i07Title: (rate: string, psp: string) =>
    `${rate} پرداخت‌ها به تلاش دوباره نیاز دارند؛ بیشتر در ${psp}`,
  i07Summary: (rate: string, recover: string) =>
    `از جلسه‌های چندتلاشی ${recover} بالاخره موفق می‌شود؛ تمرکز تلاش مجدد روی یک مسیر، نشانهٔ اصطکاک است.`,
  i08Title: (irr: string) => `${irr} در ماه از پرداخت‌های ناموفق قابل بازگشت است`,
  i08Summary: (gap: string, irr: string) =>
    `فاصله با میانهٔ گروه مشابه ${gap}؛ با سقف ۱۰ واحد درصد، ${irr} برآورد فرصت است، نه درآمد قطعی.`,
  i14Title: (metric: string, n: string, dir: string) =>
    `${metric} ${n} هفتهٔ متوالی ${dir} است`,
  i14Summary: (metric: string, n: string, dirPast: string, cum: string) =>
    `${metric} در ${n} هفتهٔ پیاپی ${dirPast}؛ مجموع جابه‌جایی ${cum}. این یک روند تازه است، نه نوسان معمول هفته‌ها.`,
  i18Title: (metric: string, pos: string) =>
    `${metric} شما ${pos} گروه مشابه است`,
  i18Summary: (metric: string, mine: string, med: string, q3: string) =>
    `شما ${mine}؛ میانهٔ گروه ${med}، خانهٔ چهارم ${q3}.`,
  i11Title: (ret: string) => `${ret} پرداخت‌های موفق از مشتریان بازگشتی است`,
  i11Summary: (repeat: string, ret: string) =>
    `${repeat} کارت‌ها دوباره پرداخت کرده‌اند؛ تحلیل فقط روی کارت‌های شناخته‌شدهٔ همین پذیرنده تعریف شده است.`,
  i27Title: (topDecile: string) => `${topDecile} درآمد موفق به ۱۰٪ مشتریان بزرگ وابسته است`,
  i27Summary: (top5: string, top1: string, irr: string) =>
    `سهم ۵ مشتری اول ${top5} و سهم مشتری اول ${top1}. از دست دادن مشتری اول یعنی ${irr} در ماه در معرض.`,
  concentrationChip: 'تمرکز درآمد',
  recoverableChip: 'برآورد فرصت',
  riskChip: 'ریسک',
} as const;
