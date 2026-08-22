// Mix-adjusted benchmark comparison (ADR-0007): naive merchant-vs-cohort gaps are
// confounded by segment mix (PSP, amount band, hour). Direct standardization:
// apply the merchant's own mix to cohort segment rates, and vice versa.
// Naive numbers are only ever shown NEXT TO adjusted ones (CONTRACTS §1).

export interface MixSegment {
  key: string;
  merchantVolume: number; merchantSuccesses: number;
  cohortVolume: number; cohortSuccesses: number;
}

export interface MixAdjustedComparison {
  merchantNaive: number; cohortNaive: number; naiveGapPp: number;
  merchantAdjusted: number;              // merchant mix applied to cohort rates
  cohortOnMerchantMix: number;           // same thing — the comparable cohort rate
  adjustedGapPp: number;
  segments: Array<{ key: string; merchantRate: number; cohortRate: number; weight: number }>;
}

export function mixAdjust(rows: MixSegment[]): MixAdjustedComparison {
  const mv = rows.reduce((a, r) => a + r.merchantVolume, 0);
  const ms = rows.reduce((a, r) => a + r.merchantSuccesses, 0);
  const cv = rows.reduce((a, r) => a + r.cohortVolume, 0);
  const cs = rows.reduce((a, r) => a + r.cohortSuccesses, 0);
  const merchantNaive = mv ? ms / mv : 0;
  const cohortNaive = cv ? cs / cv : 0;

  let adjusted = 0;
  const segments = rows.map((r) => {
    const w = mv ? r.merchantVolume / mv : 0;
    const cohortRate = r.cohortVolume ? r.cohortSuccesses / r.cohortVolume : 0;
    const merchantRate = r.merchantVolume ? r.merchantSuccesses / r.merchantVolume : 0;
    adjusted += w * cohortRate;
    return { key: r.key, merchantRate, cohortRate, weight: w };
  });

  return {
    merchantNaive, cohortNaive, naiveGapPp: (merchantNaive - cohortNaive) * 100,
    merchantAdjusted: adjusted, cohortOnMerchantMix: adjusted,
    adjustedGapPp: (merchantNaive - adjusted) * 100,
    segments,
  };
}
