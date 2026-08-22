/** Reciprocal Rank Fusion: fuse ranked id lists, each contributing
 *  1 / (k + rank + 1) per item (rank starts at 0). ADR-0013. */
export function rrfFuse(lists: Array<Array<{ id: string }>>, k = 60): Array<{ id: string; score: number }> {
  const scores = new Map<string, number>();
  for (const list of lists)
    list.forEach(({ id }, rank) => {
      scores.set(id, (scores.get(id) ?? 0) + 1 / (k + rank + 1));
    });
  return [...scores.entries()]
    .map(([id, score]) => ({ id, score }))
    .sort((a, b) => b.score - a.score);
}
