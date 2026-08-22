// zarinpal-live provider (ADR-0010) — pulls a merchant's own transactions from
// ZarinPal REST v3 report endpoints and normalizes them into canonical rows.
//
// STATUS: adapter + fixture tests complete; the live mapping spike (Task 8)
// awaits the merchant API key. REST v3 is thinly documented (zarinpal-lab
// API-Docs): auth header + exact response envelope are resolved at first live
// run and recorded in docs/research/2026-08-22-zarinpal-live-mapping.md.
// Unmapped source fields are logged at ingest (ADR-0010 §6).
//
// Session grain: one REST transaction → one session with a single attempt
// (try_seq=1). Manifest: grain='session', merchantScope='single'.
const LIVE_BASE = process.env.ZARINPAL_API_BASE ?? 'https://api.zarinpal.com/rest/v3';

export const LIVE_AVAILABLE_FIELDS = [
  'session_key', 'merchant_key', 'amount', 'session_status', 'try_seq',
  'psp_code', 'try_status', 'created_at', 'payer_card_key',
];

/** status vocabulary seen in REST reports → canonical session/try status */
export function mapStatus(raw) {
  const s = String(raw ?? '').toLowerCase();
  if (['success', 'verified', 'ok', '100'].includes(s)) return 'Verified';
  if (['paid', 'captured'].includes(s)) return 'Paid';
  if (['reversed', 'refund'].includes(s)) return 'Reversed';
  return 'Failed';
}

/** Normalize one REST transaction into canonical STAGE order (21 cols).
 *  Returns null for rows the canonical model cannot represent. */
export function normalizeTransaction(tx, merchantKey) {
  const amount = Number(tx.amount ?? tx.amount_rial ?? tx.price ?? NaN);
  const key = String(tx.id ?? tx.authority ?? tx.ref_id ?? '');
  if (!key || !Number.isFinite(amount)) return null;
  const status = mapStatus(tx.status ?? tx.result ?? tx.state);
  const card = tx.card_pan ?? tx.card_number ?? tx.payer_card ?? null;
  const createdAt = tx.created_at ?? tx.date ?? tx.time ?? '';
  return [
    /* session_key */ `L${key}`,
    /* try_seq */ 1,
    /* terminal_key */ tx.terminal_id ?? null,
    /* merchant_key */ merchantKey,
    /* category_id */ null,
    /* category_title */ null,
    /* amount */ Math.round(amount),
    /* adjusted_fee */ null,                       // live API exposes no fee field
    /* session_status */ status,
    /* try_status */ status,
    /* switch_response_code */ tx.code ? String(tx.code) : null,
    /* psp_code */ null,                           // REST reports carry no PSP id
    /* issuer_bank_code */ tx.bank ?? tx.issuer ?? null,
    /* payer_card_key */ card ? String(card) : null,
    /* verify_type */ null,
    /* init_time_ms */ null,
    /* verify_time_ms */ null,
    /* created_at */ createdAt,
    /* try_created_at */ createdAt,
    /* verified_at */ status === 'Verified' ? (tx.verified_at ?? null) : null,
    /* settled_at */ null,
  ];
}

/** Paginated pull → canonical rows (AsyncIterable, same contract as csv provider). */
export async function listLiveRows({ apiKey, merchantKey, base = LIVE_BASE, fetchImpl = fetch, pageSize = 100 }) {
  const rows = [];
  let page = 1;
  for (;;) {
    const res = await fetchImpl(`${base}/report/webserviceTransactions.json?page=${page}`, {
      method: 'POST',
      headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({ limit: pageSize, page }),
    });
    if (!res.ok) throw new Error(`zarinpal-live ${res.status}`);
    const body = await res.json();
    const items = body?.data ?? body?.transactions ?? [];
    if (!items.length) break;
    for (const tx of items) {
      const row = normalizeTransaction(tx, merchantKey);
      if (row) rows.push(row);
    }
    if (items.length < pageSize) break;
    page += 1;
    if (page > 500) break;                          // hard stop: 50k transactions
  }
  return rows;
}
