const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

export function formatNumber(value: number, fractionDigits = 0): string {
  const fixed = Math.abs(value).toFixed(fractionDigits);
  const [intPart, decPart] = fixed.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '٬');
  const body = decPart ? `${grouped}٫${decPart}` : grouped;
  return `${value < 0 ? '−' : ''}${toPersianDigits(body)}`;
}

export function formatPercent(value: number, fractionDigits = 1): string {
  return `${formatNumber(value, fractionDigits)}٪`;
}

/** «۸٫۲ واحد درصد» — فاصله بین دو نرخ */
export function formatPoints(value: number, fractionDigits = 1): string {
  return `${formatNumber(Math.abs(value), fractionDigits)} واحد درصد`;
}

/** مبلغ فشرده به تومان */
export function formatToman(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `${formatNumber(value / 1_000_000_000, 2)} میلیارد تومان`;
  if (abs >= 1_000_000) return `${formatNumber(value / 1_000_000, 0)} میلیون تومان`;
  if (abs >= 1_000) return `${formatNumber(value / 1_000, 0)} هزار تومان`;
  return `${formatNumber(value)} تومان`;
}

export function formatDelta(value: number, unit: 'percent' | 'points' = 'percent'): string {
  if (value === 0) return 'بدون تغییر';
  const magnitude = unit === 'percent' ? formatPercent(Math.abs(value)) : formatPoints(value);
  return `${magnitude} ${value > 0 ? 'افزایش' : 'کاهش'}`;
}