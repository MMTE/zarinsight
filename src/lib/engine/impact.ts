// Impact formulas F-01…F-04 (CONTRACTS §3) — ریال estimates with conservative caps.
// Every impact records its formula id; the UI renders method + cap alongside.

export interface F01Input {
  failedAmountIrr: number;        // Σ amount over failed sessions in segment/period
  benchmarkRate: number;          // e.g. cohort success rate (0..1)
  observedRate: number;           // merchant success rate (0..1)
  periodDays: number;             // length of the observation window
}
/** F-01 recoverable: failed value × capped rate gap, expressed monthly. */
export function f01Recoverable(i: F01Input): { amountIrr: number; capPp: number } {
  const gapPp = (i.benchmarkRate - i.observedRate) * 100;
  const capPp = Math.round(Math.min(Math.max(0, gapPp), 10) * 100) / 100;
  const monthlyScale = 30 / Math.max(1, i.periodDays);
  return {
    amountIrr: Math.round(i.failedAmountIrr * (capPp / 100) * monthlyScale),
    capPp,
  };
}

export interface F02Input {
  adjustedGapPp: number;          // mix-adjusted gap vs best-performing PSP (pp)
  pspSuccessValueIrr: number;     // successful value carried by underperforming PSP
}
/** F-02 reroute: capped adjusted gap × value carried by the underperforming PSP. */
export function f02Reroute(i: F02Input): { amountIrr: number } {
  const gap = Math.min(Math.max(0, i.adjustedGapPp), 10);
  return { amountIrr: Math.round(i.pspSuccessValueIrr * (gap / 100)) };
}

/** F-03 concentration downside: top-customer share × monthly revenue (I-27/I-13). */
export function f03Concentration(topCustomerShare: number, monthlyRevenueIrr: number): { amountIrr: number } {
  return { amountIrr: Math.round(topCustomerShare * monthlyRevenueIrr) };
}

/** F-04 trend run-rate: Δ% × current monthly revenue (I-14/I-01). */
export function f04TrendRunrate(changePct: number, monthlyRevenueIrr: number): { amountIrr: number } {
  return { amountIrr: Math.round((changePct / 100) * monthlyRevenueIrr) };
}
