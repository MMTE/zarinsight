// Digit post-check (ADR-0004/0011 §1): an agent reply may quote figures only if
// they appear verbatim in the tool results that produced the turn. Persian and
// Latin digit forms compare equal.
const PERSIAN = '۰۱۲۳۴۵۶۷۸۹';
const toLatin = (s: string) => s.replace(/[۰-۹]/g, (d) => String(PERSIAN.indexOf(d)));

const NUMBER = /\d[\d,._]*|\d+(?:\.\d+)?%/g;

export function extractFigures(text: string): string[] {
  return toLatin(text).match(NUMBER) ?? [];
}

/** Returns figures in `reply` that are absent from `allowed` (tool outputs + question). */
export function ungroundedFigures(reply: string, allowed: string): string[] {
  const ok = new Set(extractFigures(allowed));
  return [...new Set(extractFigures(reply))].filter((f) => !ok.has(f));
}
