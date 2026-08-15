/**
 * Full PSEO health for GSC "Discovered, not indexed".
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const root = process.cwd();

function walk(dir, out = []) {
  for (const n of readdirSync(dir)) {
    if (['node_modules', '.git', 'scripts', 'tests', 'pdf-core'].includes(n)) continue;
    const p = join(dir, n);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (n === 'index.html') out.push(p);
  }
  return out;
}

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Count visible guide words: from first H2 to footer (skip UI chrome). */
function guideWords(html) {
  const i = html.search(/<h2[\s>]/i);
  const f = html.search(/<footer[\s>]/i);
  if (i < 0) return 0;
  const chunk = html.slice(i, f > i ? f : undefined);
  const text = stripTags(chunk);
  return text ? text.split(' ').filter(Boolean).length : 0;
}

function h2Count(html) {
  return (html.match(/<h2[\s>]/gi) || []).length;
}
function faqCount(html) {
  return (html.match(/"@type"\s*:\s*"Question"/g) || []).length;
}
function titleOf(html) {
  return (html.match(/<title>([^<]*)/i) || [])[1] || '';
}
function canonical(html) {
  return (html.match(/rel="canonical"[^>]*href="([^"]+)"/i) || [])[1] || '';
}
function robots(html) {
  return (html.match(/name="robots"[^>]*content="([^"]*)"/i) || [])[1] || '';
}
function webAppUrl(html) {
  const m = html.match(/"@type"\s*:\s*"WebApplication"[\s\S]*?"url"\s*:\s*"([^"]+)"/);
  return m ? m[1] : '';
}

const files = walk(root).filter((f) => {
  const r = relative(root, f).replace(/\\/g, '/');
  return (
    /\/for-/.test(r) ||
    /^compress-pdf-for-/.test(r) ||
    /^compress-jpg/.test(r) ||
    /^image-resizer-for-/.test(r) ||
    /^tools\//.test(r)
  );
});

const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
const rows = [];
for (const f of files) {
  const html = readFileSync(f, 'utf8');
  const relPath =
    '/' +
    relative(root, f)
      .replace(/\\/g, '/')
      .replace(/index\.html$/, '');
  const canon = canonical(html);
  const expected = `https://velotools.app${relPath}`;
  const appUrl = webAppUrl(html);
  const w = guideWords(html);
  const h2 = h2Count(html);
  const faq = faqCount(html);
  const inSm = sitemap.includes(expected);
  const issues = [];
  if (w < 550) issues.push(`thin:${w}`);
  if (h2 < 4) issues.push(`h2:${h2}`);
  if (faq < 4) issues.push(`faq:${faq}`);
  if (!inSm) issues.push('sitemap');
  if (/noindex/i.test(robots(html))) issues.push('noindex');
  if (canon && canon !== expected) issues.push(`canon:${canon}`);
  if (appUrl && appUrl !== expected && !appUrl.includes(relPath.replace(/\/$/, ''))) {
    issues.push(`schemaUrl:${appUrl}`);
  }
  rows.push({ relPath, w, h2, faq, inSm, issues, title: titleOf(html).slice(0, 60) });
}

rows.sort((a, b) => a.w - b.w);
const bad = rows.filter((r) => r.issues.length);
const ok = rows.filter((r) => !r.issues.length);
console.log(`pages=${rows.length} bad=${bad.length} ok=${ok.length}`);
console.log('\nBAD:');
for (const r of bad) console.log(`${r.w}w h2=${r.h2} faq=${r.faq} ${r.relPath} :: ${r.issues.join(', ')}`);

// Hub outbound links
const hubs = {
  'bgremover/index.html': rows.filter((r) => r.relPath.startsWith('/bgremover/')).map((r) => r.relPath),
  'compress-pdf/index.html': rows.filter((r) => r.relPath.startsWith('/compress-pdf-for-')).map((r) => r.relPath),
  'image-compress/index.html': rows
    .filter((r) => r.relPath.includes('image-resizer') || r.relPath.includes('compress-jpg'))
    .map((r) => r.relPath),
  'pdf-tools/index.html': rows.filter((r) => r.relPath.startsWith('/compress-pdf-for-')).map((r) => r.relPath),
  'index.html': rows.map((r) => r.relPath),
};
console.log('\nHUB LINK COVERAGE:');
for (const [hub, want] of Object.entries(hubs)) {
  if (!existsSync(join(root, hub))) continue;
  const html = readFileSync(join(root, hub), 'utf8');
  const hit = want.filter((p) => html.includes(p) || html.includes(p.replace(/\/$/, '')));
  console.log(`${hub}: ${hit.length}/${want.length}`);
}
