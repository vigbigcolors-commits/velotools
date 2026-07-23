/**
 * Standalone Google Indexing API worker.
 *
 * Security:
 * - Service account JSON ONLY from env (GOOGLE_SERVICE_ACCOUNT_JSON)
 * - Never hardcode credentials
 * - Hard daily cap: 2000 URL submissions
 * - Logs to local SQLite (not console spam of secrets)
 *
 * Usage:
 *   GOOGLE_SERVICE_ACCOUNT_JSON='{...}' node index.mjs
 *   GOOGLE_SERVICE_ACCOUNT_JSON='{...}' node index.mjs --sitemap=../../sitemap.xml
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';
import { DatabaseSync } from 'node:sqlite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DAILY_LIMIT = 2000;
const DEFAULT_SITEMAP = join(__dirname, '../../sitemap.xml');
const DB_PATH = join(__dirname, 'indexing-log.sqlite');

function parseArgs(argv) {
  const out = { sitemap: DEFAULT_SITEMAP, dryRun: false };
  for (const a of argv) {
    if (a.startsWith('--sitemap=')) out.sitemap = a.slice('--sitemap='.length);
    if (a === '--dry-run') out.dryRun = true;
  }
  return out;
}

function loadDotEnv() {
  const envPath = join(__dirname, '.env');
  if (!existsSync(envPath)) return;
  const text = readFileSync(envPath, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

function loadServiceAccount() {
  // Preferred on Windows: path to downloaded JSON key file
  const fileFromEnv = process.env.GOOGLE_SERVICE_ACCOUNT_FILE;
  let raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

  if (!raw && fileFromEnv) {
    const filePath = fileFromEnv.startsWith('.')
      ? join(__dirname, fileFromEnv)
      : fileFromEnv;
    if (!existsSync(filePath)) {
      throw new Error(`GOOGLE_SERVICE_ACCOUNT_FILE not found: ${filePath}`);
    }
    raw = readFileSync(filePath, 'utf8');
  }

  // Convenience default: sa-key.json next to this script (gitignored)
  if (!raw) {
    const fallback = join(__dirname, 'sa-key.json');
    if (existsSync(fallback)) raw = readFileSync(fallback, 'utf8');
  }

  if (!raw || !raw.trim()) {
    throw new Error(
      'No credentials. Put Google JSON key at scripts/indexing-worker/sa-key.json OR set GOOGLE_SERVICE_ACCOUNT_FILE / GOOGLE_SERVICE_ACCOUNT_JSON',
    );
  }

  let creds;
  try {
    creds = JSON.parse(raw);
  } catch {
    throw new Error('Service account JSON is not valid JSON');
  }
  if (!creds.client_email || !creds.private_key) {
    throw new Error('Service account JSON must include client_email and private_key');
  }
  return creds;
}

function openDb() {
  const db = new DatabaseSync(DB_PATH);
  db.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL,
      status TEXT NOT NULL,
      http_code INTEGER,
      message TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS daily_quota (
      day TEXT PRIMARY KEY,
      count INTEGER NOT NULL DEFAULT 0
    );
    CREATE INDEX IF NOT EXISTS idx_submissions_url_day
      ON submissions(url, created_at);
  `);
  return db;
}

function todayUtc() {
  return new Date().toISOString().slice(0, 10);
}

function getDailyCount(db) {
  const row = db.prepare('SELECT count FROM daily_quota WHERE day = ?').get(todayUtc());
  return row ? row.count : 0;
}

function bumpDaily(db, n) {
  const day = todayUtc();
  db.prepare(
    `INSERT INTO daily_quota(day, count) VALUES(?, ?)
     ON CONFLICT(day) DO UPDATE SET count = count + excluded.count`,
  ).run(day, n);
}

function logSubmission(db, url, status, httpCode, message) {
  db.prepare(
    `INSERT INTO submissions(url, status, http_code, message) VALUES(?, ?, ?, ?)`,
  ).run(url, status, httpCode ?? null, message ?? null);
}

function parseSitemapUrls(xml) {
  const urls = [];
  const re = /<loc>\s*([^<\s]+)\s*<\/loc>/gi;
  let m;
  while ((m = re.exec(xml))) {
    const u = m[1].trim();
    if (u.startsWith('https://velotools.app/')) urls.push(u);
  }
  return [...new Set(urls)];
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Exponential backoff for HTTP 429 (rate limit).
 * @param {() => Promise<{status:number, body?:string}>} fn
 */
async function withBackoff(fn) {
  let attempt = 0;
  const maxAttempts = 8;
  while (true) {
    const res = await fn();
    if (res.status !== 429) return res;
    attempt += 1;
    if (attempt >= maxAttempts) return res;
    const wait = Math.min(60_000, 500 * 2 ** attempt) + Math.floor(Math.random() * 250);
    await sleep(wait);
  }
}

async function publishUrl(indexing, url) {
  return withBackoff(async () => {
    try {
      const result = await indexing.urlNotifications.publish({
        requestBody: {
          url,
          type: 'URL_UPDATED',
        },
      });
      return { status: result.status || 200, body: JSON.stringify(result.data || {}) };
    } catch (err) {
      const status = err?.response?.status || err?.code || 500;
      const message = err?.message || String(err);
      return { status: Number(status) || 500, body: message };
    }
  });
}

async function main() {
  loadDotEnv();
  const args = parseArgs(process.argv.slice(2));
  const creds = loadServiceAccount();

  if (!existsSync(args.sitemap)) {
    throw new Error(`Sitemap not found: ${args.sitemap}`);
  }

  const urls = parseSitemapUrls(readFileSync(args.sitemap, 'utf8'));
  if (!urls.length) throw new Error('No velotools.app URLs found in sitemap');

  const db = openDb();
  const used = getDailyCount(db);
  const remaining = Math.max(0, DAILY_LIMIT - used);

  if (remaining === 0) {
    logSubmission(db, '-', 'quota_exhausted', null, `Daily limit ${DAILY_LIMIT} already used`);
    db.close();
    process.exitCode = 0;
    return;
  }

  const batch = urls.slice(0, remaining);
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });
  const indexing = google.indexing({ version: 'v3', auth });

  let ok = 0;
  let fail = 0;

  for (const url of batch) {
    if (args.dryRun) {
      logSubmission(db, url, 'dry_run', null, 'skipped network');
      ok += 1;
      continue;
    }

    const res = await publishUrl(indexing, url);
    if (res.status >= 200 && res.status < 300) {
      logSubmission(db, url, 'ok', res.status, res.body);
      ok += 1;
      bumpDaily(db, 1);
    } else {
      logSubmission(db, url, 'error', res.status, res.body);
      fail += 1;
      if (res.status === 429) {
        // stop the day early on persistent rate limit
        break;
      }
    }
  }

  // Minimal process exit signal for CI — details live in SQLite
  logSubmission(
    db,
    '-',
    'run_complete',
    null,
    JSON.stringify({
      ok,
      fail,
      attempted: batch.length,
      dailyUsedAfter: getDailyCount(db),
      limit: DAILY_LIMIT,
      dryRun: args.dryRun,
    }),
  );
  db.close();

  if (fail > 0 && ok === 0) process.exitCode = 1;
}

main().catch((err) => {
  // Last-resort: write failure without printing private key material
  try {
    const db = openDb();
    logSubmission(db, '-', 'fatal', null, String(err && err.message ? err.message : err));
    db.close();
  } catch {
    // ignore secondary failure
  }
  process.exitCode = 1;
});
