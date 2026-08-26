/**
 * Add matrix PSEO pages to sitemap.xml (dosed, default 15/day).
 * Reuses publish-state.json counter so matrix + intent share the same daily budget.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { MATRIX, entryPath } from '../seo-data/matrix/index.mjs';
import { isMatrixIndexable } from '../seo-data/matrix/schema.mjs';
import { notifyGoogle } from './notify-google.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');
const statePath = join(root, 'scripts', 'seo-data', 'publish-state.json');
const sitemapPath = join(root, 'sitemap.xml');
const baseUrl = 'https://velotools.app';

function today() {
  return new Date().toISOString().slice(0, 10);
}

function loadState() {
  return JSON.parse(readFileSync(statePath, 'utf8'));
}

function saveState(state) {
  writeFileSync(statePath, JSON.stringify(state, null, 2) + '\n');
}

/** Drop noindex matrix URLs so republish cannot restore them. */
function stripNonIndexableFromSitemap(sitemap) {
  let out = sitemap;
  for (const entry of MATRIX) {
    if (isMatrixIndexable(entry)) continue;
    const loc = `${baseUrl}${entryPath(entry)}`;
    const re = new RegExp(
      `\\s*<url>\\s*<loc>${loc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<\\/loc>[\\s\\S]*?<\\/url>`,
      'g',
    );
    out = out.replace(re, '');
  }
  return out;
}

export function publishMatrixBatch(limit, opts = {}) {
  const state = loadState();
  const day = today();
  if (state.lastPublishDate !== day) {
    state.lastPublishDate = day;
    state.publishedToday = 0;
  }

  const remaining = Math.max(0, state.dailyLimit - state.publishedToday);
  const take = Math.min(limit ?? remaining, remaining);
  if (take === 0) {
    return { published: [], message: `Daily cap reached (${state.dailyLimit}/day).` };
  }

  let original = readFileSync(sitemapPath, 'utf8');
  let sitemap = stripNonIndexableFromSitemap(original);
  const published = [];

  for (const entry of MATRIX) {
    if (published.length >= take) break;
    if (!isMatrixIndexable(entry)) continue;
    const path = entryPath(entry);
    const loc = `    <loc>${baseUrl}${path}</loc>`;
    if (sitemap.includes(loc)) continue;

    const block = `  <url>\n${loc}\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    sitemap = sitemap.replace('</urlset>', block + '</urlset>');
    published.push(path);
  }

  if (published.length || sitemap !== original) {
    writeFileSync(sitemapPath, sitemap);
    if (published.length) {
      state.publishedToday += published.length;
      saveState(state);
    }
  }

  const indexing = published.length
    ? notifyGoogle(published, { dryRun: Boolean(opts.dryRunIndex), skip: Boolean(opts.skipIndex) })
    : { ok: true, skipped: true, reason: 'no-urls' };

  return {
    published,
    indexing,
    message: published.length
      ? `Published ${published.length} matrix URL(s). Today: ${state.publishedToday}/${state.dailyLimit}.`
      : 'All indexable matrix URLs already in sitemap (non-indexable excluded).',
  };
}

if (process.argv[1] && /matrix-publish\.mjs$/.test(process.argv[1].replace(/\\/g, '/'))) {
  const limitArg = process.argv.find((a) => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : undefined;
  const skipIndex = process.argv.includes('--skip-index');
  const r = publishMatrixBatch(limit, { skipIndex });
  console.log(r.message);
  for (const p of r.published) console.log(' +', p);
}
