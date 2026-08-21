// Shared ETL core — provider-agnostic canonical model builder (ADR-0002/0010).
// Input: async iterable of canonical attempt rows (provider-produced, CSV column
// names). Output: data/datasets/<id>/{db.sqlite, manifest.json}.
//
// Memory strategy: rows stream into an attached staging DB; session-grain reduction
// and every aggregate are done by SQLite (bounded JS memory at any dataset size).
import Database from 'better-sqlite3';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const EXPECTED_GATES = {
  rows: 2213289, sessions: 2062839, merchants: 343, psps: 8, categories: 5,
};

export const SCHEMA_VERSION = '1';
export const ELIGIBILITY_RULES_VERSION = '1';

const DDL = `
CREATE TABLE meta(key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE dim_merchant(
  merchant_key TEXT PRIMARY KEY, category_id INTEGER, category_title TEXT,
  first_date TEXT NOT NULL, last_date TEXT NOT NULL);
CREATE TABLE dim_psp(psp_code TEXT PRIMARY KEY);
CREATE TABLE dim_date(
  date_id TEXT PRIMARY KEY, jalali_year INTEGER NOT NULL, jalali_month INTEGER NOT NULL,
  jalali_day INTEGER NOT NULL, jalali_ym TEXT NOT NULL,
  weekday INTEGER NOT NULL,           -- 0=شنبه … 6=جمعه
  is_holiday INTEGER NOT NULL);
CREATE TABLE dim_card(
  merchant_key TEXT NOT NULL, payer_card_key TEXT NOT NULL, issuer_bank_code TEXT,
  PRIMARY KEY (merchant_key, payer_card_key)) WITHOUT ROWID;
CREATE TABLE fact_attempt(
  session_key TEXT NOT NULL, try_seq INTEGER NOT NULL, psp_code TEXT,
  try_status TEXT NOT NULL, switch_response_code TEXT, init_time_ms INTEGER,
  verify_time_ms INTEGER, try_created_at TEXT,
  PRIMARY KEY (session_key, try_seq)) WITHOUT ROWID;
CREATE TABLE fact_session(
  session_key TEXT PRIMARY KEY, merchant_key TEXT NOT NULL, terminal_key TEXT,
  category_id INTEGER, amount INTEGER NOT NULL, adjusted_fee INTEGER,
  session_status TEXT NOT NULL, is_success INTEGER NOT NULL, is_captured INTEGER NOT NULL,
  date_id TEXT NOT NULL, hour INTEGER NOT NULL, created_at TEXT NOT NULL,
  n_attempts INTEGER NOT NULL, n_real_attempts INTEGER NOT NULL,
  verify_type TEXT, verify_time_ms INTEGER, verified_at TEXT, settled_at TEXT,
  payer_card_key TEXT, issuer_bank_code TEXT) WITHOUT ROWID;
CREATE TABLE etl_quarantine(
  session_key TEXT NOT NULL, reason TEXT NOT NULL, detail TEXT);

CREATE TABLE agg_daily(
  date_id TEXT NOT NULL, merchant_key TEXT NOT NULL,
  sessions INTEGER NOT NULL, success INTEGER NOT NULL, paid INTEGER NOT NULL,
  captured INTEGER NOT NULL, failed INTEGER NOT NULL,
  revenue INTEGER NOT NULL, captured_irr INTEGER NOT NULL, failed_irr INTEGER NOT NULL,
  fee_sum_success INTEGER NOT NULL, retries INTEGER NOT NULL,
  attempts INTEGER NOT NULL, verified_attempts INTEGER NOT NULL,
  PRIMARY KEY (date_id, merchant_key)) WITHOUT ROWID;
CREATE TABLE agg_hourly(
  date_id TEXT NOT NULL, hour INTEGER NOT NULL, merchant_key TEXT NOT NULL,
  sessions INTEGER NOT NULL, success INTEGER NOT NULL, revenue INTEGER NOT NULL,
  PRIMARY KEY (date_id, hour, merchant_key)) WITHOUT ROWID;
CREATE TABLE agg_psp_merchant(
  month_id TEXT NOT NULL, psp_code TEXT NOT NULL, merchant_key TEXT NOT NULL,
  attempts INTEGER NOT NULL, verified INTEGER NOT NULL, inbank INTEGER NOT NULL,
  failed INTEGER NOT NULL, paid INTEGER NOT NULL, success_value INTEGER NOT NULL,
  init_ms_n INTEGER NOT NULL, init_ms_sum INTEGER NOT NULL,
  verify_ms_n INTEGER NOT NULL, verify_ms_sum INTEGER NOT NULL,
  PRIMARY KEY (month_id, psp_code, merchant_key)) WITHOUT ROWID;
CREATE TABLE agg_amount_band(
  merchant_key TEXT NOT NULL, band TEXT NOT NULL,            -- q1..q4 | top10
  sessions INTEGER NOT NULL, success INTEGER NOT NULL, revenue INTEGER NOT NULL,
  PRIMARY KEY (merchant_key, band)) WITHOUT ROWID;
CREATE TABLE agg_cohort(
  cohort_id TEXT NOT NULL, merchant_key TEXT NOT NULL,
  PRIMARY KEY (cohort_id, merchant_key)) WITHOUT ROWID;

CREATE TABLE insights(
  id TEXT PRIMARY KEY, detector_id TEXT NOT NULL, scope_type TEXT NOT NULL,
  scope_key TEXT NOT NULL, period_key TEXT NOT NULL, payload TEXT NOT NULL,
  rank_score REAL NOT NULL, lifecycle TEXT NOT NULL, created_ms INTEGER NOT NULL);
CREATE INDEX idx_insights_feed ON insights(lifecycle, rank_score DESC);
CREATE TABLE insight_events(
  id INTEGER PRIMARY KEY AUTOINCREMENT, insight_id TEXT NOT NULL, event TEXT NOT NULL,
  at_ms INTEGER NOT NULL);

-- ADR-0003 eligibility surfaces (rule ids rendered by /api/methodology)
CREATE VIEW v_success_sessions AS SELECT * FROM fact_session WHERE is_success = 1;
CREATE VIEW v_real_attempts AS SELECT * FROM fact_attempt WHERE try_status <> 'NoAttempt';
CREATE VIEW v_card_customers AS
  SELECT merchant_key, payer_card_key FROM fact_session
  WHERE is_success = 1 AND payer_card_key IS NOT NULL;
CREATE VIEW v_coded_failures AS
  SELECT * FROM fact_attempt WHERE switch_response_code IS NOT NULL;
CREATE VIEW v_verify_latency AS SELECT * FROM fact_attempt WHERE verify_time_ms IS NOT NULL;
CREATE VIEW v_init_latency AS SELECT * FROM fact_attempt WHERE init_time_ms IS NOT NULL;

CREATE INDEX idx_fs_merchant_date ON fact_session(merchant_key, date_id);
CREATE INDEX idx_fs_date ON fact_session(date_id);
CREATE INDEX idx_fs_card ON fact_session(merchant_key, payer_card_key);
CREATE INDEX idx_fa_psp ON fact_attempt(psp_code);
CREATE INDEX idx_fa_status ON fact_attempt(try_status);
`;

const STAGING_DDL_NOINDEX = `
CREATE TABLE stg.attempt_stage(
  session_key TEXT NOT NULL, try_seq INTEGER NOT NULL, terminal_key TEXT,
  merchant_key TEXT NOT NULL, category_id INTEGER, category_title TEXT,
  amount INTEGER NOT NULL, adjusted_fee INTEGER, session_status TEXT NOT NULL,
  try_status TEXT NOT NULL, switch_response_code TEXT, psp_code TEXT,
  issuer_bank_code TEXT, payer_card_key TEXT, verify_type TEXT,
  init_time_ms INTEGER, verify_time_ms INTEGER, created_at TEXT NOT NULL,
  try_created_at TEXT, verified_at TEXT, settled_at TEXT);
`;

// Session attributes that must be constant across a session's rows (ADR-0002).
// verify_time_ms / init_time_ms / psp_code / try_status are ATTEMPT-level and
// excluded; fact_session sources them from the verifying attempt.
const CONSTANCY_COLS = ['merchant_key', 'terminal_key', 'category_id', 'category_title',
  'amount', 'adjusted_fee', 'session_status', 'created_at', 'verify_type',
  'verified_at', 'settled_at', 'payer_card_key', 'issuer_bank_code'];
// ---- Jalali calendar via Intl (stdlib; deterministic for a pinned Node) ----------
const jalaliFmt = new Intl.DateTimeFormat('en-u-ca-persian',
  { timeZone: 'UTC', year: 'numeric', month: 'numeric', day: 'numeric' });

export function jalaliParts(dateId) {
  const [y, m, d] = dateId.split('-').map(Number);
  const parts = jalaliFmt.formatToParts(new Date(Date.UTC(y, m - 1, d)));
  const get = (t) => Number(parts.find((p) => p.type === t).value);
  return { jy: get('year'), jm: get('month'), jd: get('day') };
}

function dateRow(dateId) {
  const { jy, jm, jd } = jalaliParts(dateId);
  const [y, m, d] = dateId.split('-').map(Number);
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0=Sun..6=Sat
  const weekday = (dow + 1) % 7;                            // 0=Sat..6=Fri
  const nowruz = jy === 1405 && jm === 1 && jd <= 13;       // in-window 1405 holidays
  return [dateId, jy, jm, jd, `${jy}-${String(jm).padStart(2, '0')}`, weekday,
    weekday === 6 || nowruz ? 1 : 0];
}

// ---- Core build ------------------------------------------------------------------
export async function buildDataset({
  datasetId, provider, rows, sha256, availableFields,
  grain = 'attempt', merchantScope = 'portfolio',
  outDir, gates = EXPECTED_GATES, log = () => {},
}) {
  mkdirSync(outDir, { recursive: true });
  const dbPath = join(outDir, 'db.sqlite');
  rmSync(dbPath, { force: true });
  const stagingPath = join(outDir, 'staging.tmp.sqlite');
  const t0 = Date.now();
  const phase = (name) => log(`${name} ${((Date.now() - t0) / 1000).toFixed(1)}s`);

  const db = new Database(dbPath);
  db.pragma('journal_mode = OFF');
  db.pragma('synchronous = OFF');
  db.pragma('temp_store = MEMORY');
  db.pragma('cache_size = -262144'); // 256 MB page cache
  db.exec(DDL);

  // 1) stream rows → staging (attached temp DB keeps the shipped DB lean)
  rmSync(stagingPath, { force: true });
  db.exec(`ATTACH DATABASE '${stagingPath}' AS stg`);
  db.exec('PRAGMA stg.journal_mode = OFF; PRAGMA stg.synchronous = OFF;');
  db.exec(STAGING_DDL_NOINDEX);
  const insStage = db.prepare(
    'INSERT INTO stg.attempt_stage VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
  let rowCount = 0;
  let batch = [];
  const flush = db.transaction((rowsBatch) => {
    for (const r of rowsBatch) insStage.run(...r);
  });
  for await (const row of rows) {
    batch.push(row);
    if (batch.length >= 50000) { flush(batch); rowCount += batch.length; batch = [];
      if (rowCount % 500000 === 0) log(`staged ${rowCount} rows`); }
  }
  if (batch.length) { flush(batch); rowCount += batch.length; }
  log(`staged ${rowCount} rows total`);
  db.exec('CREATE INDEX stg.idx_stage_session ON attempt_stage(session_key, try_seq)');
  phase('staged+indexed');

  const sha = typeof sha256 === 'function' ? sha256() : (sha256 ?? '');
  // 2) fact_attempt (attempt grain, row-local only)
  phase('start fact_attempt'); db.exec(`INSERT INTO fact_attempt
    SELECT session_key, try_seq, psp_code, try_status, switch_response_code,
           init_time_ms, verify_time_ms, try_created_at
    FROM stg.attempt_stage ORDER BY session_key, try_seq`);

  phase('fact_attempt done'); db.exec(`INSERT INTO fact_session
    SELECT s.session_key, s.merchant_key, s.terminal_key, s.category_id, s.amount,
           s.adjusted_fee, s.session_status,
           s.session_status = 'Verified', s.session_status IN ('Verified','Paid'),
           substr(s.created_at,1,10), CAST(substr(s.created_at,12,2) AS INTEGER),
           s.created_at, g.n, g.real_attempts,
           s.verify_type,
           COALESCE(v.verify_time_ms, s.verify_time_ms),
           COALESCE(v.verified_at, s.verified_at),
           COALESCE(v.settled_at, s.settled_at),
           COALESCE(v.payer_card_key, s.payer_card_key),
           COALESCE(v.issuer_bank_code, s.issuer_bank_code)
    FROM (SELECT session_key, COUNT(*) AS n, MIN(try_seq) AS min_seq,
                 SUM(CASE WHEN try_status <> 'NoAttempt' THEN 1 ELSE 0 END) AS real_attempts
          FROM stg.attempt_stage GROUP BY session_key) g
    JOIN stg.attempt_stage s
      ON s.session_key = g.session_key AND s.try_seq = g.min_seq
    LEFT JOIN stg.attempt_stage v
      ON v.session_key = g.session_key AND v.try_status IN ('Verified','Paid')`);
  // a session must have at most one terminal attempt (Verified|Paid)
  {
    const dup = db.prepare(`INSERT INTO etl_quarantine
      SELECT session_key, 'multiple_terminal_attempts',
             'first terminal attempt kept'
      FROM stg.attempt_stage WHERE try_status IN ('Verified','Paid')
      GROUP BY session_key HAVING COUNT(*) > 1`);
    dup.run();
  }

  phase('fact_session done'); const insQuarantine = db.prepare(`INSERT INTO etl_quarantine VALUES (?,?,?)`);
  // try_seq density (profiling §1: dense 1..n; 0 ⇔ NoAttempt single row)
  const density = db.prepare(`SELECT session_key, MIN(try_seq) a, MAX(try_seq) b, COUNT(*) n,
      COUNT(DISTINCT try_seq) d FROM stg.attempt_stage GROUP BY session_key
    HAVING NOT ( (a = 0 AND n = 1) OR (a = 1 AND b = n AND d = n) )`);
  const qDensity = db.transaction(() => {
    for (const r of density.all()) {
      insQuarantine.run(r.session_key, 'try_seq_not_dense',
        `min=${r.a} max=${r.b} rows=${r.n} distinct=${r.d}`);
    }
  });
  qDensity(); phase('density done');
  // session-attribute constancy
  const flags = CONSTANCY_COLS.map((c) =>
    `MIN(${c}) IS NOT MAX(${c}) AS v_${c}`).join(', ');
  const constancy = db.prepare(`SELECT session_key, ${flags}
    FROM stg.attempt_stage GROUP BY session_key`);
  const qConst = db.transaction(() => {
    for (const r of constancy.all()) {
      for (const c of CONSTANCY_COLS) {
        if (r[`v_${c}`]) insQuarantine.run(r.session_key, `attr_not_constant:${c}`,
          'first-row value kept (ADR-0002)');
      }
    }
  });
  qConst(); phase('constancy done');
  const quarantineCount = db.prepare(`SELECT COUNT(*) c FROM etl_quarantine`).get().c;
  log(`quarantine rows: ${quarantineCount}`);

  // 4) dims
  phase('quarantine total'); db.exec(`INSERT INTO dim_merchant
    SELECT c.merchant_key, c.cid, c.ctitle, d.fd, d.ld
    FROM (SELECT merchant_key, MIN(category_id) AS cid, MIN(category_title) AS ctitle
          FROM stg.attempt_stage GROUP BY merchant_key) c
    JOIN (SELECT merchant_key, MIN(date_id) AS fd, MAX(date_id) AS ld
          FROM fact_session GROUP BY merchant_key) d ON d.merchant_key = c.merchant_key
    ORDER BY c.merchant_key`);
  // merchants with >1 category would make cohort ids ambiguous — quarantine them
  {
    const multi = db.prepare(`INSERT INTO etl_quarantine
      SELECT merchant_key, 'merchant_category_not_constant',
             'MIN(category_id) kept (ADR-0002)'
      FROM stg.attempt_stage GROUP BY merchant_key HAVING COUNT(DISTINCT category_id) > 1`);
    multi.run();
  }
  phase('dim_merchant done'); db.exec(`INSERT INTO dim_psp SELECT DISTINCT psp_code FROM fact_attempt
    WHERE psp_code IS NOT NULL ORDER BY psp_code`);
  db.exec(`INSERT INTO dim_card
    SELECT DISTINCT merchant_key, payer_card_key, issuer_bank_code FROM fact_session
    WHERE payer_card_key IS NOT NULL ORDER BY merchant_key, payer_card_key`);
  phase('dim_psp/card done'); const insDate = db.prepare(`INSERT INTO dim_date VALUES (?,?,?,?,?,?,?)`);
  const dates = db.prepare(`SELECT DISTINCT date_id FROM fact_session ORDER BY date_id`)
    .all().map((r) => dateRow(r.date_id));
  db.transaction(() => { for (const d of dates) insDate.run(...d); })();

  // 5) aggregates (the runtime's only read path — ADR-0002)
  phase('dim_date done'); db.exec(`INSERT INTO agg_daily
    SELECT s.date_id, s.merchant_key, COUNT(*),
           SUM(s.is_success), SUM(s.session_status = 'Paid'), SUM(s.is_captured),
           SUM(s.session_status = 'Failed'),
           SUM(CASE WHEN s.is_success THEN s.amount ELSE 0 END),
           SUM(CASE WHEN s.is_captured THEN s.amount ELSE 0 END),
           SUM(CASE WHEN s.session_status = 'Failed' THEN s.amount ELSE 0 END),
           SUM(CASE WHEN s.is_success THEN s.adjusted_fee ELSE 0 END),
           SUM(s.n_attempts > 1),
           SUM(s.n_real_attempts), 0
    FROM fact_session s GROUP BY s.date_id, s.merchant_key`);
  db.exec(`CREATE TEMP TABLE tmp_verified AS
    SELECT s.date_id, s.merchant_key, COUNT(*) AS c
    FROM fact_attempt a JOIN fact_session s ON s.session_key = a.session_key
    WHERE a.try_status = 'Verified' GROUP BY s.date_id, s.merchant_key`);
  db.exec(`UPDATE agg_daily SET verified_attempts =
    COALESCE((SELECT c FROM tmp_verified t
      WHERE t.date_id = agg_daily.date_id AND t.merchant_key = agg_daily.merchant_key), 0)`);
  db.exec(`DROP TABLE tmp_verified`);
  phase('agg_daily done'); db.exec(`INSERT INTO agg_hourly
    SELECT date_id, hour, merchant_key, COUNT(*), SUM(is_success),
           SUM(CASE WHEN is_success THEN amount ELSE 0 END)
    FROM fact_session GROUP BY date_id, hour, merchant_key`);
  phase('agg_hourly done'); db.exec(`INSERT INTO agg_psp_merchant
    SELECT substr(s.date_id,1,7), a.psp_code, s.merchant_key, COUNT(*),
           SUM(a.try_status = 'Verified'), SUM(a.try_status = 'InBank'),
           SUM(a.try_status = 'Failed'), SUM(a.try_status = 'Paid'),
           SUM(CASE WHEN a.try_status = 'Verified' THEN s.amount ELSE 0 END),
           SUM(a.init_time_ms IS NOT NULL), COALESCE(SUM(a.init_time_ms), 0),
           SUM(a.verify_time_ms IS NOT NULL), COALESCE(SUM(a.verify_time_ms), 0)
    FROM fact_attempt a JOIN fact_session s ON s.session_key = a.session_key
    WHERE a.psp_code IS NOT NULL
    GROUP BY substr(s.date_id,1,7), a.psp_code, s.merchant_key`);
  // amount bands: per-merchant quartiles + top decile over all sessions
  phase('agg_psp done'); db.exec(`INSERT INTO agg_amount_band
    WITH banded AS (
      SELECT merchant_key, amount, is_success, NTILE(4) OVER (PARTITION BY merchant_key ORDER BY amount, session_key) AS q,
             NTILE(10) OVER (PARTITION BY merchant_key ORDER BY amount, session_key) AS d10
      FROM fact_session)
    SELECT merchant_key,
           CASE WHEN q = 1 THEN 'q1' WHEN q = 2 THEN 'q2' WHEN q = 3 THEN 'q3' ELSE 'q4' END,
           COUNT(*), SUM(is_success), SUM(CASE WHEN is_success THEN amount ELSE 0 END)
    FROM banded GROUP BY merchant_key, q
    UNION ALL
    SELECT merchant_key, 'top10', COUNT(*), SUM(is_success),
           SUM(CASE WHEN is_success THEN amount ELSE 0 END)
    FROM banded WHERE d10 = 10 GROUP BY merchant_key`);
  // cohorts: category × volume-quartile × avg-success-amount-quartile
  phase('agg_band done'); db.exec(`INSERT INTO agg_cohort
    WITH m AS (
      SELECT f.merchant_key,
             (SELECT category_id FROM dim_merchant d WHERE d.merchant_key = f.merchant_key) AS cat,
             COUNT(*) AS sessions,
             CASE WHEN SUM(is_success) > 0
               THEN CAST(SUM(CASE WHEN is_success THEN amount ELSE 0 END) AS REAL) / SUM(is_success)
               ELSE 0 END AS avg_success_amount
      FROM fact_session f GROUP BY f.merchant_key),
    ranked AS (
      SELECT *, NTILE(4) OVER (ORDER BY sessions) AS vq,
                 NTILE(4) OVER (ORDER BY avg_success_amount) AS aq FROM m)
    SELECT cat || '|vol' || vq || '|amt' || aq, merchant_key FROM ranked
    WHERE cat IS NOT NULL`);

  phase('agg_cohort done'); db.exec(`ANALYZE`);
  phase('analyze done'); db.exec(`DETACH DATABASE stg`);
  db.close();
  rmSync(stagingPath, { force: true });

  // 6) counts, gates, meta + manifest (reopen without pragmas; fsync'd normally)
  const ro = new Database(dbPath, { readonly: false });
  ro.pragma('synchronous = FULL');
  const counts = {
    rows: rowCount,
    sessions: ro.prepare(`SELECT COUNT(*) c FROM fact_session`).get().c,
    merchants: ro.prepare(`SELECT COUNT(*) c FROM dim_merchant`).get().c,
    psps: ro.prepare(`SELECT COUNT(*) c FROM dim_psp`).get().c,
    categories: ro.prepare(`SELECT COUNT(DISTINCT category_id) c FROM dim_merchant`).get().c,
    cards: ro.prepare(`SELECT COUNT(*) c FROM dim_card`).get().c,
    verified_sessions: ro.prepare(`SELECT COUNT(*) c FROM fact_session WHERE is_success=1`).get().c,
    revenue: ro.prepare(`SELECT COALESCE(SUM(amount),0) c FROM fact_session WHERE is_success=1`).get().c,
    quarantine: quarantineCount,
  };
  const dateRange = ro.prepare(
    `SELECT MIN(date_id) a, MAX(date_id) b FROM fact_session`).get();

  if (gates) {
    const failures = Object.entries(gates)
      .filter(([k, v]) => counts[k] !== v)
      .map(([k, v]) => `${k}: got ${counts[k]}, expected ${v}`);
    if (failures.length) {
      ro.close();
      throw new Error(`ETL gate failure — ${failures.join('; ')}`);
    }
  }

  const builtAt = new Date().toISOString();
  const metaRows = [
    ['schema_version', SCHEMA_VERSION],
    ['eligibility_rules_version', ELIGIBILITY_RULES_VERSION],
    ['provider', provider],
    ['dataset_id', datasetId],
    ['source_sha256', sha],
    ['grain', grain], ['merchant_scope', merchantScope],
    ['available_fields', JSON.stringify(availableFields)],
    ...Object.entries(counts).map(([k, v]) => [`count_${k}`, String(v)]),
    ['date_min', dateRange.a], ['date_max', dateRange.b],
    ['built_at', builtAt],
  ];
  const insMeta = ro.prepare(`INSERT INTO meta(key, value) VALUES (?,?)`);
  ro.transaction(() => { for (const [k, v] of metaRows) insMeta.run(k, String(v)); })();
  ro.close();

  const manifest = {
    id: datasetId, label: datasetId, provider, grain, merchantScope,
    availableFields, dateRange: [dateRange.a, dateRange.b],
    counts: { rows: counts.rows, sessions: counts.sessions, merchants: counts.merchants,
      psps: counts.psps, cards: counts.cards }, builtAt,
    ...(sha ? { sourceSha256: sha } : {}),
  };
  const manifestPath = join(outDir, 'manifest.json');
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  return { dbPath, manifestPath, counts, manifest };
}
