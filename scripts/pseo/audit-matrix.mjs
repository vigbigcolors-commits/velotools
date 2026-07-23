import { readFileSync, existsSync } from 'fs';
import { MATRIX, entryPath } from '../seo-data/matrix/index.mjs';
import { DefaultConfigSchema } from '../seo-data/matrix/schema.mjs';

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const fails = [];
let ok = 0;

for (const e of MATRIX) {
  const rel = `.${entryPath(e)}index.html`;
  if (!existsSync(rel)) {
    fails.push(`${rel}: missing file`);
    continue;
  }
  const html = readFileSync(rel, 'utf8');
  const need = [
    ['vt-page-config', html.includes('id="vt-page-config"')],
    ['SoftwareApplication', html.includes('"@type":"SoftwareApplication"')],
    ['FAQPage', html.includes('"@type":"FAQPage"')],
    ['unique-seo', html.includes('id="vt-unique-seo"')],
    ['no-cloned-neuro', !html.includes('The focus tool built')],
    ['hydrate', html.includes('/focus/js/pseo-hydrate.js')],
    ['banner', html.includes('id="vt-intent-banner"')],
    ['canonical', html.includes(`rel="canonical" href="https://velotools.app${entryPath(e)}"`)],
    ['title', html.includes(`<title>${esc(e.title)}</title>`)],
    ['h1', html.includes(`>${esc(e.h1)}<`)],
    ['assistant-abs', !html.includes('src="js/focus-assistant.js"')],
  ];
  const bad = need.filter(([, v]) => !v).map(([k]) => k);
  const m = html.match(/id="vt-page-config">([^<]+)</);
  if (!m) {
    fails.push(`${rel}: no config json`);
    continue;
  }
  const cfg = JSON.parse(m[1]);
  const v = DefaultConfigSchema.safeParse(cfg.config);
  if (!v.success) {
    fails.push(`${rel}: invalid config`);
    continue;
  }
  if (cfg.config.timers.focusMinutes !== e.config.timers.focusMinutes) {
    fails.push(`${rel}: timer mismatch`);
    continue;
  }
  if (bad.length) {
    fails.push(`${rel}: missing ${bad.join(',')}`);
    continue;
  }
  ok += 1;
}

const titles = new Set();
const h1s = new Set();
const leads = new Set();
for (const e of MATRIX) {
  const t = e.title.toLowerCase().trim();
  const h = e.h1.toLowerCase().trim();
  const l = e.editorial.lead.toLowerCase().trim();
  if (titles.has(t) || h1s.has(h) || leads.has(l)) {
    fails.push(`uniqueness broken in matrix: ${e.id}`);
  }
  titles.add(t);
  h1s.add(h);
  leads.add(l);
}

const sitemap = readFileSync('sitemap.xml', 'utf8');
const inSitemap = MATRIX.filter((e) =>
  sitemap.includes(`https://velotools.app${entryPath(e)}`),
).length;

console.log(
  JSON.stringify(
    {
      rule: 'EVERY page unique at any scale (30 / 2000 / 10000)',
      matrixEntries: MATRIX.length,
      uniqueTitles: titles.size,
      uniqueH1s: h1s.size,
      uniqueLeads: leads.size,
      htmlPagesOk: ok,
      htmlFails: fails,
      inSitemap,
      notInSitemapYet: MATRIX.length - inSitemap,
      hydrateExists: existsSync('focus/js/pseo-hydrate.js'),
      cursorignore: existsSync('.cursorignore'),
      worker: existsSync('scripts/indexing-worker/index.mjs'),
      googleapis: existsSync('scripts/indexing-worker/node_modules/googleapis'),
    },
    null,
    2,
  ),
);
