/**
 * Dosed publication — add built pages to sitemap.xml (crawl budget control).
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { loadAllIntents, updateIntentStatus } from './intents.mjs';

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

export function publishBatch(limit) {
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

  const built = loadAllIntents().filter((i) => i.publishStatus === 'built');
  const toPublish = built.slice(0, take);
  if (!toPublish.length) {
    return { published: [], message: 'No built pages waiting. Run: pseo build' };
  }

  let sitemap = readFileSync(sitemapPath, 'utf8');
  const published = [];

  for (const intent of toPublish) {
    const loc = `    <loc>${baseUrl}/${intent.slug}/</loc>`;
    if (sitemap.includes(loc)) {
      updateIntentStatus(intent.slug, 'published', { publishedAt: day });
      published.push(intent.slug);
      continue;
    }
    const block = `  <url>\n${loc}\n    <changefreq>weekly</changefreq>\n    <priority>0.75</priority>\n  </url>\n`;
    sitemap = sitemap.replace('</urlset>', block + '</urlset>');
    updateIntentStatus(intent.slug, 'published', { publishedAt: day });
    published.push(intent.slug);
  }

  writeFileSync(sitemapPath, sitemap);
  state.publishedToday += published.length;
  saveState(state);

  return {
    published,
    message: `Published ${published.length} URL(s) to sitemap. Today: ${state.publishedToday}/${state.dailyLimit}.`,
  };
}
