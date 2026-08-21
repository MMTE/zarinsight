// csv-attempts provider — streams the challenge CSV into canonical attempt rows.
// ADR-0002 canonical model · ADR-0010 provider contract.
// Facts learned from the real file: CRLF line endings, quoted Persian titles with
// ASCII commas, 22 columns, empty string = NULL.
//
// Emits positional arrays in STAGE_COLS order ( ints pre-cast ) — the ETL core binds
// them positionally; this shape measured ~30× faster than per-row objects + named
// params on the 2.2M-row file.
import { createReadStream } from 'node:fs';
import { createHash } from 'node:crypto';
import { parse } from 'csv-parse';
import { Transform } from 'node:stream';

export const CSV_COLUMNS = [
  'session_key', 'try_seq', 'terminal_key', 'merchant_key', 'category_id',
  'category_title', 'amount', 'adjusted_fee', 'session_status', 'try_status',
  'switch_response_code', 'psp_code', 'issuer_bank_code', 'payer_card_key',
  'verify_type', 'init_time_ms', 'verify_time_ms', 'created_at', 'try_created_at',
  'verified_at', 'settled_at', 'expire_in',
];

// staging/fact column order — CSV_COLUMNS minus expire_in (not in the canonical model)
export const STAGE_COLS = CSV_COLUMNS.filter((c) => c !== 'expire_in');

export const AVAILABLE_FIELDS = STAGE_COLS;

const INT_COLS = new Set(['try_seq', 'category_id', 'amount', 'adjusted_fee',
  'init_time_ms', 'verify_time_ms']);

/**
 * listRows({ csvPath }) → { rows: AsyncIterable<any[]>, sha256: () => string }
 * Rows are arrays in STAGE_COLS order, '' → null, ints pre-cast.
 * sha256() finalizes the raw-byte hash (call after iteration completes).
 */
export function listRows({ csvPath }) {
  const hash = createHash('sha256');
  const source = createReadStream(csvPath);
  const tee = new Transform({
    transform(chunk, _enc, cb) { hash.update(chunk); cb(null, chunk); },
  });
  const parser = parse({ columns: false, bom: true, cast: false });
  const stream = source.pipe(tee).pipe(parser);

  async function* rows() {
    let order = null; // header → positions
    for await (const rec of stream) {
      if (!order) {
        order = new Map(rec.map((name, i) => [name, i]));
        for (const col of STAGE_COLS) {
          if (!order.has(col)) {
            throw new Error(`CSV header missing column '${col}'`);
          }
        }
        continue;
      }
      const out = new Array(STAGE_COLS.length);
      for (let i = 0; i < STAGE_COLS.length; i++) {
        const v = rec[order.get(STAGE_COLS[i])];
        if (v === '' || v === undefined) { out[i] = null; continue; }
        out[i] = INT_COLS.has(STAGE_COLS[i]) ? Number.parseInt(v, 10) : v;
      }
      yield out;
    }
  }
  return { rows: rows(), sha256: () => hash.digest('hex') };
}
