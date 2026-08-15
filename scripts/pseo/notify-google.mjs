/**
 * Push newly published velotools.app URLs to Google Indexing API.
 * Soft-fails without credentials so sitemap publish still succeeds.
 */
import { existsSync, mkdtempSync, writeFileSync, rmSync } from 'fs';
import { spawnSync } from 'child_process';
import { join, dirname } from 'path';
import { tmpdir } from 'os';
import { fileURLToPath } from 'url';

const workerDir = join(dirname(fileURLToPath(import.meta.url)), '../indexing-worker');
const BASE = 'https://velotools.app';

export function toCanonicalUrl(pathOrUrl) {
  const raw = String(pathOrUrl || '').trim();
  if (!raw) return null;
  let url = raw;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    const path = url.startsWith('/') ? url : `/${url}`;
    url = `${BASE}${path}`;
  }
  if (!url.startsWith(`${BASE}/`)) return null;
  if (!url.endsWith('/')) url += '/';
  return url;
}

function hasCredentials() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) return true;
  if (process.env.GOOGLE_SERVICE_ACCOUNT_FILE && existsSync(process.env.GOOGLE_SERVICE_ACCOUNT_FILE)) {
    return true;
  }
  return existsSync(join(workerDir, 'sa-key.json'));
}

/**
 * @param {string[]} pathsOrUrls
 * @param {{ dryRun?: boolean, skip?: boolean }} [opts]
 */
export function notifyGoogle(pathsOrUrls, opts = {}) {
  if (opts.skip) return { ok: true, skipped: true, reason: 'skip-index' };

  const urls = [...new Set((pathsOrUrls || []).map(toCanonicalUrl).filter(Boolean))];
  if (!urls.length) return { ok: true, skipped: true, reason: 'no-urls' };

  if (!existsSync(join(workerDir, 'index.mjs'))) {
    console.warn('Indexing skipped: worker missing at scripts/indexing-worker/index.mjs');
    return { ok: true, skipped: true, reason: 'no-worker' };
  }

  if (!hasCredentials()) {
    console.warn(
      'Indexing skipped: no sa-key.json. Put the Google JSON key in scripts/indexing-worker/ (gitignored).',
    );
    return { ok: true, skipped: true, reason: 'no-credentials' };
  }

  const dir = mkdtempSync(join(tmpdir(), 'vt-index-'));
  const urlsFile = join(dir, 'urls.txt');
  writeFileSync(urlsFile, urls.join('\n') + '\n');

  console.log(`Indexing API: submitting ${urls.length} URL(s)…`);
  for (const u of urls) console.log('  →', u);

  const args = ['index.mjs', `--urls-file=${urlsFile}`];
  if (opts.dryRun) args.push('--dry-run');

  try {
    const r = spawnSync(process.execPath, args, {
      cwd: workerDir,
      stdio: 'inherit',
      env: process.env,
      windowsHide: true,
    });
    if (r.error) {
      console.warn('Indexing spawn failed:', r.error.message);
      return { ok: false, skipped: false, error: r.error.message, count: urls.length };
    }
    if (r.status !== 0) {
      console.warn(`Indexing worker exited ${r.status}`);
      return { ok: false, skipped: false, code: r.status, count: urls.length };
    }
    return { ok: true, skipped: false, count: urls.length };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
