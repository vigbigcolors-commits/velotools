/**
 * Audit live + local PSEO pages that often sit in GSC "Discovered, not indexed".
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

const samples = [
  '/bgremover/for-apparel/',
  '/bgremover/for-ecommerce/',
  '/bgremover/for-headshots/',
  '/bgremover/for-jewelry/',
  '/bgremover/for-pets/',
  '/bgremover/for-portraits/',
  '/bgremover/for-social/',
  '/bgremover/for-transparent-png/',
  '/compress-jpg-online/',
  '/compress-pdf-for-canvas/',
];

function extractEditorial(html) {
  const m = html.match(/<section[^>]*class="[^"]*editorial[^"]*"[^>]*>([\s\S]*?)<\/section>/i);
  return m ? m[1] : '';
}

function wordCount(htmlChunk) {
  const text = htmlChunk
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text ? text.split(' ').length : 0;
}

function meta(html, name) {
  const re = new RegExp(`name="${name}"[^>]*content="([^"]*)"`, 'i');
  const m = html.match(re);
  return m ? m[1] : '';
}

function prop(html, p) {
  const re = new RegExp(`property="${p}"[^>]*content="([^"]*)"`, 'i');
  const m = html.match(re);
  return m ? m[1] : '';
}

function title(html) {
  return (html.match(/<title>([^<]*)<\/title>/i) || [])[1] || '';
}

function canonical(html) {
  return (html.match(/rel="canonical"[^>]*href="([^"]+)"/i) || [])[1] || '';
}

function h1(html) {
  return (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1]?.replace(/<[^>]+>/g, '').trim() || '';
}

function faqCount(html) {
  return (html.match(/"@type"\s*:\s*"Question"/g) || []).length
    || (html.match(/<details[^>]*class="[^"]*faq/gi) || []).length;
}

function h2Count(ed) {
  return (ed.match(/<h2[\s>]/g) || []).length;
}

const sitemap = readFileSync(resolve(root, 'sitemap.xml'), 'utf8');
const sitemapLocs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

console.log('=== SAMPLE AUDIT (local HTML) ===');
const issues = [];
for (const path of samples) {
  const file = resolve(root, path.replace(/^\//, '') + (path.endsWith('/') ? 'index.html' : ''));
  const alt = resolve(root, path.replace(/^\//, '').replace(/\/$/, '') + '/index.html');
  const p = existsSync(file) ? file : alt;
  if (!existsSync(p)) {
    issues.push(`${path}: MISSING FILE`);
    console.log('MISSING', path);
    continue;
  }
  const html = readFileSync(p, 'utf8');
  const ed = extractEditorial(html);
  const wc = wordCount(ed || html);
  const can = canonical(html);
  const rob = meta(html, 'robots') || '(default)';
  const inSm = sitemapLocs.includes(`https://velotools.app${path}`);
  const row = {
    path,
    status: 'local',
    words: wc,
    h1: h1(html).slice(0, 70),
    title: title(html).slice(0, 70),
    canonical: can,
    robots: rob,
    faqs: faqCount(html),
    h2: h2Count(ed),
    sitemap: inSm,
  };
  const bad = [];
  if (wc < 600) bad.push(`thin:${wc}`);
  if (!inSm) bad.push('not-in-sitemap');
  if (/noindex/i.test(rob)) bad.push('noindex');
  if (can && !can.endsWith(path) && can !== `https://velotools.app${path}`) bad.push(`canon-mismatch:${can}`);
  if (row.faqs < 5) bad.push(`faq:${row.faqs}`);
  if (row.h2 < 4) bad.push(`h2:${row.h2}`);
  if (bad.length) issues.push(`${path}: ${bad.join(', ')}`);
  console.log(
    JSON.stringify({
      path,
      words: wc,
      faqs: row.faqs,
      h2: row.h2,
      sitemap: inSm,
      robots: rob,
      canonOk: can === `https://velotools.app${path}`,
      bad: bad.join('|') || 'ok',
    }),
  );
}

console.log('\n=== LIVE FETCH ===');
for (const path of samples) {
  const url = `https://velotools.app${path}`;
  try {
    const r = await fetch(url, { redirect: 'manual', headers: { 'user-agent': 'VeloToolsAudit/1.0' } });
    const html = await r.text();
    const ed = extractEditorial(html);
    const wc = wordCount(ed);
    console.log(
      r.status,
      `w=${wc}`,
      meta(html, 'robots') || '-',
      path,
      title(html).slice(0, 55),
    );
    if (r.status !== 200) issues.push(`live ${path}: HTTP ${r.status}`);
  } catch (e) {
    console.log('ERR', path, e.message);
    issues.push(`live ${path}: ${e.message}`);
  }
}

// Hub internal links to these samples
console.log('\n=== HUB INTERNAL LINKS ===');
const hubs = [
  'bgremover/index.html',
  'compress-pdf/index.html',
  'image-compress/index.html',
  'pdf-tools/index.html',
  'index.html',
];
for (const hub of hubs) {
  const hp = resolve(root, hub);
  if (!existsSync(hp)) continue;
  const html = readFileSync(hp, 'utf8');
  const linked = samples.filter((s) => html.includes(s) || html.includes(s.replace(/\/$/, '')));
  console.log(hub, `links ${linked.length}/${samples.length}`, linked.map((s) => s.replace(/\/$/, '').split('/').pop()).join(','));
}

console.log('\n=== ISSUES ===');
if (!issues.length) console.log('none on samples');
else issues.forEach((i) => console.log('-', i));
