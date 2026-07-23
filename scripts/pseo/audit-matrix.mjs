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
    ['hydrate', html.includes('/focus/js/pseo-hydrate.js')],
    ['banner', html.includes('id="vt-intent-banner"')],
    ['canonical', html.includes(`rel="canonical" href="https://velotools.app${entryPath(e)}"`)],
    ['title', html.includes(`<title>${esc(e.title)}</title>`)],
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

const sitemap = readFileSync('sitemap.xml', 'utf8');
const inSitemap = MATRIX.filter((e) =>
  sitemap.includes(`https://velotools.app${entryPath(e)}`),
).length;

console.log(
  JSON.stringify(
    {
      matrixEntries: MATRIX.length,
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
