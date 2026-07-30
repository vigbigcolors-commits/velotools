/**
 * Uniqueness gate for compress-pdf PSEO HTML on disk.
 * Fails on duplicate FAQ questions, titles, h1s, or high editorial Jaccard.
 */
import { readFileSync, readdirSync, existsSync } from 'fs';

function strip(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function words(t) {
  return new Set(
    t
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 3),
  );
}

function jaccard(a, b) {
  const A = words(a);
  const B = words(b);
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / (A.size + B.size - inter || 1);
}

const dirs = readdirSync('.').filter(
  (d) => d.startsWith('compress-pdf-for-') && existsSync(d + '/index.html'),
);
const pages = [];
const errors = [];

for (const s of dirs) {
  const html = readFileSync(s + '/index.html', 'utf8');
  const title = (html.match(/<title>([^<]+)/) || [])[1] || '';
  const h1 = ((html.match(/<h1>([\s\S]*?)<\/h1>/) || [])[1] || '').replace(/<[^>]+>/g, '');
  const edMatch = html.match(/<section class="editorial"[\s\S]*?<footer/);
  const ed = edMatch ? strip(edMatch[0]) : '';
  const faqs = [...html.matchAll(/<summary>([\s\S]*?)<\/summary>/g)].map((m) =>
    m[1].replace(/<[^>]+>/g, '').trim(),
  );
  const h2s = [...html.matchAll(/<section class="seo-section[^"]*">\s*<h2>([^<]+)/g)].map(
    (m) => m[1].trim(),
  );
  pages.push({ s, title, h1, ed, faqs, h2s });
}

function dupMap(keyFn) {
  const m = new Map();
  for (const p of pages) {
    const k = keyFn(p).toLowerCase().trim();
    if (!k) continue;
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(p.s);
  }
  return [...m.entries()].filter(([, ss]) => ss.length > 1);
}

for (const [k, ss] of dupMap((p) => p.title)) errors.push(`duplicate title "${k}" ← ${ss.join(', ')}`);
for (const [k, ss] of dupMap((p) => p.h1)) errors.push(`duplicate h1 "${k}" ← ${ss.join(', ')}`);

const fq = new Map();
for (const p of pages) {
  for (const q of p.faqs) {
    const k = q.toLowerCase();
    if (!fq.has(k)) fq.set(k, []);
    fq.get(k).push(p.s);
  }
}
for (const [q, ss] of fq) {
  if (ss.length > 1) errors.push(`duplicate FAQ "${q}" ← ${ss.join(', ')}`);
}

const h2m = new Map();
for (const p of pages) {
  for (const h of p.h2s) {
    const k = h.toLowerCase();
    if (!h2m.has(k)) h2m.set(k, []);
    h2m.get(k).push(p.s);
  }
}
for (const [h, ss] of h2m) {
  if (ss.length > 1) errors.push(`duplicate H2 "${h}" ← ${ss.join(', ')}`);
}

for (let i = 0; i < pages.length; i++) {
  for (let j = i + 1; j < pages.length; j++) {
    const jacc = jaccard(pages[i].ed, pages[j].ed);
    if (jacc > 0.42) {
      errors.push(
        `editorial too similar (${jacc.toFixed(3)}) ${pages[i].s} ↔ ${pages[j].s}`,
      );
    }
  }
}

console.log('Audited', pages.length, 'compress-pdf PSEO pages');
if (errors.length) {
  console.error('UNIQUENESS FAIL');
  errors.forEach((e) => console.error(' ✗', e));
  process.exit(1);
}
console.log('OK — titles, h1, H2, FAQ questions unique; editorial Jaccard ≤ 0.42');
