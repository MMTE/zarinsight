// Shared ETL/engine test fixture — one CSV, both suites import it.
// CRLF + quoted Persian comma + all row archetypes (multi-attempt, NoAttempt,
// Paid, quarantine candidates, second merchant).
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildDataset } from '../scripts/lib/core.mjs';
import { listRows, AVAILABLE_FIELDS } from '../scripts/lib/provider-csv.mjs';

const HEADER = 'session_key,try_seq,terminal_key,merchant_key,category_id,category_title,'
  + 'amount,adjusted_fee,session_status,try_status,switch_response_code,psp_code,'
  + 'issuer_bank_code,payer_card_key,verify_type,init_time_ms,verify_time_ms,created_at,'
  + 'try_created_at,verified_at,settled_at,expire_in';

const TITLE = '"ارائه دهنده خدمات اینترنت، پهن‌باند"';

export const ROWS = [
  HEADER,
  // S1: 3-attempt session, verified on try 3 (PSP-02), created just before Nowruz
  `S1,1,T1,M1,48160002,${TITLE},100000,1200,Verified,Failed,,PSP-01,,,Automated,50,,2026-03-20 23:59:59,2026-03-20 23:59:59,,,2026-03-21 00:29:59`,
  `S1,2,T1,M1,48160002,${TITLE},100000,1200,Verified,InBank,,PSP-02,,,Automated,60,,2026-03-20 23:59:59,2026-03-21 00:00:01,,,2026-03-21 00:29:59`,
  `S1,3,T1,M1,48160002,${TITLE},100000,1200,Verified,Verified,,PSP-02,603799,CARD1,Automated,55,900,2026-03-20 23:59:59,2026-03-21 00:00:05,2026-03-21 00:00:06,2026-03-21 08:00:00,2026-03-21 00:29:59`,
  // S2: single verified
  `S2,1,T1,M1,48160002,${TITLE},200000,2400,Verified,Verified,,PSP-01,610433,CARD2,Automated,45,800,2026-03-21 10:15:00,2026-03-21 10:15:00,2026-03-21 10:15:02,2026-03-21 18:00:00,2026-03-21 10:45:00`,
  // S3: NoAttempt single row (try_seq=0, no psp, no try_created_at)
  `S3,0,T1,M1,48160002,${TITLE},50000,,Failed,NoAttempt,,,,,Automated,,,2026-03-21 11:00:00,,,,2026-03-21 11:30:00`,
  // S4: Paid = captured-unverified (is_captured=1, is_success=0)
  `S4,1,T1,M1,48160002,${TITLE},300000,3600,Paid,Paid,,PSP-01,627412,CARD3,Automated,70,,2026-03-22 12:00:00,2026-03-22 12:00:00,,,2026-03-22 12:30:00`,
  // S5: amount not constant across rows → quarantine (first-row value kept)
  `S5,1,T1,M1,48160002,${TITLE},70000,840,Failed,Failed,,PSP-01,,,Automated,40,,2026-03-22 13:00:00,2026-03-22 13:00:00,,,2026-03-22 13:30:00`,
  `S5,2,T1,M1,48160002,${TITLE},70001,840,Failed,Failed,,PSP-01,,,Automated,41,,2026-03-22 13:00:00,2026-03-22 13:01:00,,,2026-03-22 13:30:00`,
  // S6: try_seq gap (1 → 3) → quarantine try_seq_not_dense
  `S6,1,T2,M1,48160002,${TITLE},80000,960,Verified,Failed,,PSP-03,,,Automated,42,,2026-03-23 09:00:00,2026-03-23 09:00:00,,,2026-03-23 09:30:00`,
  `S6,3,T2,M1,48160002,${TITLE},80000,960,Verified,Verified,,PSP-03,585983,CARD6,Automated,43,700,2026-03-23 09:00:00,2026-03-23 09:02:00,2026-03-23 09:02:01,2026-03-23 17:00:00,2026-03-23 09:30:00`,
  // second merchant, second terminal
  `S7,1,T3,M2,48160002,${TITLE},90000,1080,Failed,Failed,,PSP-03,,,Automated,44,,2026-01-05 08:00:00,2026-01-05 08:00:00,,,2026-01-05 08:30:00`,
  `S8,1,T3,M2,48160002,${TITLE},110000,1320,Verified,Verified,,PSP-03,621986,CARD8,Automated,47,650,2026-01-05 09:00:00,2026-01-05 09:00:00,2026-01-05 09:00:01,2026-01-05 20:00:00,2026-01-05 09:30:00`,
];

export async function buildFixtureDb() {
  const dir = mkdtempSync(join(tmpdir(), 'zarinsight-etl-'));
  const csvPath = join(dir, 'fixture.csv');
  writeFileSync(csvPath, ROWS.join('\r\n') + '\r\n', 'utf8');
  const { rows, sha256 } = listRows({ csvPath });
  const result = await buildDataset({
    datasetId: 'fixture', provider: 'csv-attempts', rows, sha256,
    availableFields: AVAILABLE_FIELDS,
    outDir: join(dir, 'dataset'), gates: null,
  });
  return { dir, ...result };
}
