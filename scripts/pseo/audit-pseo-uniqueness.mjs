/**
 * Full PSEO uniqueness audit on built HTML (compress + image-resizer + bgremover).
 * Fail-closed: words, FAQ, H2, paragraph clones, Jaccard ≤ 0.35.
 */
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import {
  stripHtml,
  wordCount,
  jaccard,
  extractParagraphs,
  normalizeParagraph,
  MIN_EDITORIAL_WORDS,
  MIN_FAQ,
  MIN_H2,
  MAX_JACCARD,
} from './lib/editorial-metrics.mjs';

const errors = [];
const pages = [];

function collectDirs(predicate) {
  return readdirSync('.').filter((d) => predicate(d) && existsSync(join(d, 'index.html')));
}

function loadPage(route) {
  const html = readFileSync(join(route, 'index.html'), 'utf8');
  const title = (html.match(/<title>([^<]+)/) || [])[1] || '';
  const h1 = ((html.match(/<h1>([\s\S]*?)<\/h1>/) || [])[1] || '').replace(/<[^>]+>/g, '');
  let edHtml = '';
  const edStart = html.indexOf('<section class="editorial"');
  if (edStart >= 0) {
    /* Find matching close of the outer editorial section only (not until footer —
       image-resizer pages keep shared marketing blocks after editorial). */
    let depth = 0;
    const slice = html.slice(edStart);
    const re = /<\/?section\b[^>]*>/gi;
    let m;
    let end = -1;
    while ((m = re.exec(slice))) {
      if (m[0].startsWith('</')) {
        depth--;
        if (depth === 0) {
          end = m.index + m[0].length;
          break;
        }
      } else {
        depth++;
      }
    }
    edHtml = end > 0 ? slice.slice(0, end) : slice.slice(0, 50000);
  } else {
    const seo = html.match(/<section class="seo"[\s\S]*?<\/section>/);
    if (seo) edHtml = seo[0];
    else {
      edHtml = [...html.matchAll(/<div class="seo-block"[\s\S]*?<\/div>/g)]
        .map((x) => x[0])
        .join('\n');
    }
  }
  const ed = stripHtml(edHtml);
  const faqs = [...html.matchAll(/<summary>([\s\S]*?)<\/summary>/g)].map((m) =>
    stripHtml(m[1]),
  );
  const faqAnswers = [...html.matchAll(/<div class="faq-a">([\s\S]*?)<\/div>/g)].map((m) =>
    normalizeParagraph(m[1]),
  );
  if (!faqAnswers.length) {
    faqAnswers.push(
      ...[...html.matchAll(/<div class="fa">([\s\S]*?)<\/div>/g)].map((m) =>
        normalizeParagraph(m[1]),
      ),
    );
  }
  const h2s = [
    ...[...html.matchAll(/<section class="seo-section[^"]*"[^>]*>\s*<h2>([^<]+)/g)].map(
      (m) => m[1].trim(),
    ),
    ...[...html.matchAll(/<div class="seo-block"[\s\S]*?<h2>([^<]+)/g)].map((m) => m[1].trim()),
  ];
  if (!h2s.length) {
    h2s.push(...[...html.matchAll(/<h2>([^<]+)<\/h2>/g)].map((m) => m[1].trim()));
  }
  const paras = extractParagraphs(edHtml);
  return {
    s: route,
    title,
    h1,
    ed,
    edHtml,
    faqs,
    faqAnswers,
    h2s: [...new Set(h2s)],
    paras,
    words: wordCount(ed),
  };
}

for (const d of collectDirs((d) => d.startsWith('compress-pdf-for-'))) pages.push(loadPage(d));
for (const d of collectDirs((d) => d.startsWith('image-resizer-for-'))) pages.push(loadPage(d));
const bgRoot = 'bgremover';
if (existsSync(bgRoot)) {
  for (const d of readdirSync(bgRoot)) {
    const route = join(bgRoot, d);
    if (d.startsWith('for-') && existsSync(join(route, 'index.html'))) {
      pages.push(loadPage(route.replace(/\\/g, '/')));
    }
  }
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

for (const p of pages) {
  if (p.words < MIN_EDITORIAL_WORDS) {
    errors.push(`${p.s}: editorial ${p.words} words (need ≥${MIN_EDITORIAL_WORDS})`);
  }
  if (p.faqs.length < MIN_FAQ) {
    errors.push(`${p.s}: ${p.faqs.length} FAQ (need ≥${MIN_FAQ})`);
  }
  if (p.h2s.length < MIN_H2) {
    errors.push(`${p.s}: ${p.h2s.length} H2 (need ≥${MIN_H2})`);
  }
}

const fq = new Map();
for (const p of pages) {
  for (const q of p.faqs) {
    const k = q.toLowerCase();
    if (!fq.has(k)) fq.set(k, []);
    fq.get(k).push(p.s);
  }
}
for (const [q, ss] of fq) {
  if (ss.length > 1) errors.push(`duplicate FAQ "${q.slice(0, 80)}" ← ${ss.join(', ')}`);
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

const paraMap = new Map();
for (const p of pages) {
  for (const para of p.paras) {
    if (paraMap.has(para)) {
      errors.push(`duplicate paragraph ${p.s} ↔ ${paraMap.get(para)}`);
    } else paraMap.set(para, p.s);
  }
  for (const a of p.faqAnswers) {
    if (!a || a.split(' ').length < 8) continue;
    if (paraMap.has(a)) errors.push(`duplicate FAQ answer body ${p.s} ↔ ${paraMap.get(a)}`);
    else paraMap.set(a, p.s);
  }
}

for (let i = 0; i < pages.length; i++) {
  for (let j = i + 1; j < pages.length; j++) {
    if (!pages[i].ed || !pages[j].ed) continue;
    const jacc = jaccard(pages[i].ed, pages[j].ed);
    if (jacc > MAX_JACCARD) {
      errors.push(
        `editorial too similar (${jacc.toFixed(3)}) ${pages[i].s} ↔ ${pages[j].s}`,
      );
    }
  }
}

console.log('Audited', pages.length, 'PSEO pages (compress + image-resizer + bgremover)');
if (errors.length) {
  console.error('UNIQUENESS FAIL');
  errors.forEach((e) => console.error(' ✗', e));
  process.exit(1);
}
console.log(
  `OK — titles/h1/H2/FAQ unique; paragraphs unique; words ≥${MIN_EDITORIAL_WORDS}; Jaccard ≤ ${MAX_JACCARD}`,
);
