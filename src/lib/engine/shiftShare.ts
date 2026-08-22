// Shift-share decomposition of a rate change between two periods (ADR-0007, I-36).
// Δ overall = Σ (w1−w0)·r0   [mix effect: volume moved between segments]
//           + Σ w1·(r1−r0)    [rate effect: segments got better/worse]
// per segment, so drivers sum exactly to the observed change.

export interface SegmentObservation {
  key: string;
  volume0: number; volume1: number;
  successes0: number; successes1: number;   // or generic numerator
}

export interface ShiftShareRow {
  key: string;
  mixPp: number;
  ratePp: number;
  totalPp: number;
  share0: number; share1: number;
  rate0: number; rate1: number;
}

export function shiftShare(rows: SegmentObservation[]): {
  mixPp: number; ratePp: number; totalPp: number; rows: ShiftShareRow[];
} {
  const v0 = rows.reduce((a, r) => a + r.volume0, 0);
  const v1 = rows.reduce((a, r) => a + r.volume1, 0);
  const k0 = rows.reduce((a, r) => a + r.successes0, 0);
  const k1 = rows.reduce((a, r) => a + r.successes1, 0);
  let mix = 0;
  let rate = 0;
  const out: ShiftShareRow[] = rows.map((r) => {
    const w0 = v0 ? r.volume0 / v0 : 0;
    const w1 = v1 ? r.volume1 / v1 : 0;
    const r0 = r.volume0 ? r.successes0 / r.volume0 : 0;
    const r1 = r.volume1 ? r.successes1 / r.volume1 : 0;
    const m = (w1 - w0) * r0;
    const e = w1 * (r1 - r0);
    mix += m;
    rate += e;
    return {
      key: r.key,
      mixPp: m * 100, ratePp: e * 100, totalPp: (m + e) * 100,
      share0: w0, share1: w1, rate0: r0, rate1: r1,
    };
  });
  return { mixPp: mix * 100, ratePp: rate * 100, totalPp: (mix + rate) * 100, rows: out };
}
