// Wilson score interval for a proportion — the honesty bound on success rates
// (small segments must not outrank big ones on point estimates alone; ADR-0007).
export function wilsonInterval(k: number, n: number, z = 1.959963985): [number, number] {
  if (n === 0) return [0, 0];
  const p = k / n;
  const z2 = z * z;
  const denom = 1 + z2 / n;
  const center = (p + z2 / (2 * n)) / denom;
  const half = (z * Math.sqrt((p * (1 - p) + z2 / (4 * n)) / n)) / denom;
  return [Math.max(0, center - half), Math.min(1, center + half)];
}

/** Conservative lower bound — used for ranking small populations. */
export function wilsonLower(k: number, n: number): number {
  return wilsonInterval(k, n)[0];
}
