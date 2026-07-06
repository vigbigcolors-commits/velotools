/**
 * Build stateful HTML pages from intent JSON + fact copy.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  buildMetaDescription,
  buildHeroLead,
  buildFaq,
  buildFaqJsonLd,
  renderEditorial,
  isImageIntent,
} from '../seo/fact-copy.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');
const baseUrl = 'https://velotools.app';

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function pageConfigJson(intent) {
  return JSON.stringify({
    slug: intent.slug,
    tool: intent.tool,
    toolMode: intent.toolMode,
    platform: intent.platform,
    widget: intent.widget,
    intentBanner: intent.intentBanner,
  });
}

export function buildCompressPdfPage(intent) {
  let html = readFileSync(join(root, 'compress-pdf', 'index.html'), 'utf8');
  const canonical = `${baseUrl}/${intent.slug}/`;
  const faqLd = JSON.stringify(buildFaqJsonLd(buildFaq(intent)));

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(intent.title)}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${esc(buildMetaDescription(intent))}">`,
  );
  html = html.replace(
    /<link rel="canonical" href="[^"]*">/,
    `<link rel="canonical" href="${canonical}">`,
  );
  const h1Html = intent.h1Em
    ? intent.h1.replace(intent.h1Em, `<em>${esc(intent.h1Em)}</em>`)
    : esc(intent.h1);
  html = html.replace(/<h1>[\s\S]*?<\/h1>/, `<h1>${h1Html}</h1>`);
  html = html.replace(
    /<p class="hero-sub">[\s\S]*?<\/p>/,
    `<p class="hero-sub">${esc(buildHeroLead(intent))}</p>`,
  );

  const editorialStart = html.indexOf('<section class="editorial"');
  const editorialEnd = html.indexOf('</section>\n\n<footer class="site-footer">');
  if (editorialStart < 0 || editorialEnd < 0) throw new Error('compress-pdf editorial markers missing');
  html = html.slice(0, editorialStart) + renderEditorial(intent, esc) + html.slice(editorialEnd);

  html = html.replace(
    /<script type="application\/ld\+json">\{"@context":"https:\/\/schema.org","@type":"FAQPage"[\s\S]*?<\/script>/,
    `<script type="application/ld+json">${faqLd}</script>`,
  );
  html = html.replace(
    '<script src="/pdf-tools/compress.js"></script>',
    `<script type="application/json" id="vt-page-config">${pageConfigJson(intent)}</script>\n<script src="/pdf-tools/compress.js"></script>`,
  );
  return html;
}

export function buildImageResizerPage(intent) {
  let html = readFileSync(join(root, 'image-compress', 'index.html'), 'utf8');
  const canonical = `${baseUrl}/${intent.slug}/`;

  html = html.replace(/src="js\//g, 'src="/image-compress/js/');
  if (!html.includes('/pdf-core/shared.css')) {
    html = html.replace(
      '<link rel="stylesheet" href="/css/logo.css">',
      '<link rel="stylesheet" href="/css/logo.css">\n<link rel="stylesheet" href="/pdf-core/shared.css">',
    );
  }

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(intent.title)}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${esc(buildMetaDescription(intent))}">`,
  );
  html = html.replace(
    /<link rel="canonical" href="[^"]*">/,
    `<link rel="canonical" href="${canonical}">`,
  );
  html = html.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${canonical}">`);

  const h1Inner = intent.h1Em
    ? `${esc(intent.h1.replace(/\s+for\s+.*$/i, '').trim())}<br><span>${esc(intent.h1Em)}</span>`
    : esc(intent.h1);
  html = html.replace(
    /<div class="v-hero">([\s\S]*?)<\/div>\n\n<main class="v-page"/,
    (_, inner) => {
      let block = inner
        .replace(/<h1>[\s\S]*?<\/h1>/, `<h1>${h1Inner}</h1>`)
        .replace(/<p class="v-hero-sub">[\s\S]*?<\/p>/, `<p class="v-hero-sub">${esc(buildHeroLead(intent))}</p>`)
        .replace(/<div class="v-chips">[\s\S]*?<\/div>/, '');
      return `<div class="v-hero">${block}</div>\n\n<main class="v-page"`;
    },
  );

  html = html.replace(
    /<!-- ░░ BLOCK 1[\s\S]*?<!-- ░░ BLOCK 5 — FINAL CTA ░░ -->/,
    renderEditorial(intent, esc) + '\n\n<!-- ░░ BLOCK 5 — FINAL CTA ░░ -->',
  );

  const inject =
    `<script type="application/json" id="vt-page-config">${pageConfigJson(intent)}</script>\n` +
    `<script src="/image-compress/js/page-config.js"></script>\n`;
  html = html.replace('<script src="/image-compress/js/ui.js', inject + '<script src="/image-compress/js/ui.js');
  if (!html.includes('src="/image-compress/js/ui.js')) {
    html = html.replace('<script src="js/ui.js', inject + '<script src="/image-compress/js/ui.js');
  }

  return html;
}

export function buildPage(intent) {
  if (intent.tool === 'compress-pdf' || intent.toolMode === 'compress') {
    return buildCompressPdfPage(intent);
  }
  if (isImageIntent(intent)) {
    return buildImageResizerPage(intent);
  }
  throw new Error(`Unknown tool for intent: ${intent.slug}`);
}

export function writePage(intent, dryRun = false) {
  const outDir = join(root, intent.slug);
  const outFile = join(outDir, 'index.html');
  const html = buildPage(intent);
  if (dryRun) {
    console.log('[dry-run]', outFile);
    return outFile;
  }
  mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, html);
  console.log('Built', outFile);
  return outFile;
}
