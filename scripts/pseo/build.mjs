/**
 * Build stateful HTML pages from intent JSON + fact copy.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  buildMetaDescription,
  buildHeroLead,
  buildFaqForIntent,
  buildFaqJsonLd,
  renderEditorial,
  isImageIntent,
} from '../seo/fact-copy.mjs';
import { renderPseoTrust } from './lib/pseo-trust.mjs';

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

function applyPseoTrust(html, routePath, preserveExistingExperience = false) {
  const trust = renderPseoTrust(routePath);
  if (!preserveExistingExperience) {
    const experience = /<section class="vt-exp" id="builder-experience"[\s\S]*?<\/section>\s*/i;
    html = experience.test(html)
      ? html.replace(experience, `${trust.experience}\n`)
      : html.replace(/<footer\b/i, `${trust.experience}\n<footer`);
  }
  if (html.includes('class="vt-eeat-rail"')) return html;
  return html.replace(/<footer\b/i, `${trust.rail}\n<footer`);
}

export function buildCompressPdfPage(intent) {
  let html = readFileSync(join(root, 'compress-pdf', 'index.html'), 'utf8');
  const canonical = `${baseUrl}/${intent.slug}/`;
  const faqLd = JSON.stringify(buildFaqJsonLd(buildFaqForIntent(intent)));
  const metaDesc = buildMetaDescription(intent);

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(intent.title)}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${esc(metaDesc)}">`,
  );
  html = html.replace(
    /<link rel="canonical" href="[^"]*">/,
    `<link rel="canonical" href="${canonical}">`,
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*">/,
    `<meta property="og:title" content="${esc(intent.title)}">`,
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*">/,
    `<meta property="og:description" content="${esc(metaDesc)}">`,
  );
  if (html.includes('property="og:url"')) {
    html = html.replace(
      /<meta property="og:url" content="[^"]*">/,
      `<meta property="og:url" content="${canonical}">`,
    );
  } else {
    html = html.replace(
      '<meta property="og:type" content="website">',
      `<meta property="og:type" content="website">\n<meta property="og:url" content="${canonical}">`,
    );
  }
  const h1Html = intent.h1Em
    ? intent.h1.replace(intent.h1Em, `<em>${esc(intent.h1Em)}</em>`)
    : esc(intent.h1);
  html = html.replace(/<h1>[\s\S]*?<\/h1>/, `<h1>${h1Html}</h1>`);
  html = html.replace(
    /<p class="hero-sub">[\s\S]*?<\/p>/,
    `<p class="hero-sub">${esc(buildHeroLead(intent))}</p>`,
  );

  const editorialStart = html.indexOf('<section class="editorial"');
  const footerMatch = html.match(/<\/section>\s*<footer class="site-footer">/);
  const editorialEnd = footerMatch ? footerMatch.index : -1;
  if (editorialStart < 0 || editorialEnd < 0) throw new Error('compress-pdf editorial markers missing');
  html =
    html.slice(0, editorialStart) +
    renderEditorial(intent, esc) +
    '\n\n' +
    html.slice(editorialEnd + '</section>'.length);

  html = html.replace(
    /(<script type="application\/ld\+json">\{"@context":"https:\/\/schema\.org","@type":"WebApplication"[\s\S]*?"url":")[^"]+(")/,
    `$1${canonical}$2`,
  );

  html = html.replace(
    /<script type="application\/ld\+json">\{"@context":"https:\/\/schema.org","@type":"FAQPage"[\s\S]*?<\/script>/,
    `<script type="application/ld+json">${faqLd}</script>`,
  );
  html = html.replace(
    '<script src="/pdf-tools/compress.js"></script>',
    `<script type="application/json" id="vt-page-config">${pageConfigJson(intent)}</script>\n<script src="/pdf-tools/compress.js"></script>`,
  );
  html = applyPseoTrust(html, `${intent.slug}/index.html`);
  return html;
}

export function buildImageResizerPage(intent) {
  let html = readFileSync(join(root, 'image-compress', 'index.html'), 'utf8');
  const canonical = `${baseUrl}/${intent.slug}/`;
  const metaDesc = buildMetaDescription(intent);
  const applySeoTrustTransforms = intent.seoTrustTransforms === true;

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
    `<meta name="description" content="${esc(metaDesc)}">`,
  );
  html = html.replace(
    /<link rel="canonical" href="[^"]*">/,
    `<link rel="canonical" href="${canonical}">`,
  );
  html = html.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${canonical}">`);
  html = html.replace(
    /<meta property="og:title" content="[^"]*">/,
    `<meta property="og:title" content="${esc(intent.title)}">`,
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*">/,
    `<meta property="og:description" content="${esc(metaDesc)}">`,
  );
  if (applySeoTrustTransforms) {
    const faqLd = JSON.stringify(buildFaqJsonLd(buildFaqForIntent(intent)));
    const appLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: intent.title,
      url: canonical,
      description: metaDesc,
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Any modern browser',
      browserRequirements: 'Requires JavaScript enabled',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      featureList: [
        'Local browser image processing',
        'Crop and resize controls',
        'JPEG export with quality control',
        'Before and after size comparison',
      ],
    });

    html = html.replace(
      /<!-- ═══ SCHEMA 1:[\s\S]*?<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      `<!-- SCHEMA: page-specific WebApplication -->\n<script type="application/ld+json">${appLd}</script>`,
    );
    html = html.replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${esc(intent.title)}">`);
    html = html.replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${esc(metaDesc)}">`);
    html = html.replace(/<meta property="og:image:alt" content="[^"]*">/, '<meta property="og:image:alt" content="VeloTools image resize tool">');
    html = html.replace(/<meta name="twitter:image:alt" content="[^"]*">/, '<meta name="twitter:image:alt" content="VeloTools image resize tool">');
    html = html.replace(
      /<!-- ═══ SCHEMA 3:[\s\S]*?<!-- ═══ PRELOAD \+ FONTS ═══ -->/,
      `<!-- SCHEMA: page-specific FAQ -->\n<script type="application/ld+json">${faqLd}</script>\n\n<!-- ═══ PRELOAD + FONTS ═══ -->`,
    );
  }
  /* Pretty-printed WebApplication JSON-LD from image-compress template */
  html = html.replace(
    /("@type"\s*:\s*"WebApplication"[\s\S]*?"url"\s*:\s*")[^"]+(")/,
    `$1${canonical}$2`,
  );
  html = html.replace(
    /("@type"\s*:\s*"WebApplication"[\s\S]*?"name"\s*:\s*")[^"]+(")/,
    `$1${esc(intent.title).slice(0, 110)}$2`,
  );

  const h1Inner = intent.h1Em
    ? `${esc(intent.h1.replace(new RegExp('\\s+for\\s+.*$', 'i'), '').trim())}<br><span>${esc(intent.h1Em)}</span>`
    : esc(intent.h1);
  /* Robust hero replace (CRLF / single newline safe) */
  html = html.replace(/<h1>[\s\S]*?<\/h1>/, `<h1>${h1Inner}</h1>`);
  html = html.replace(
    /<p class="v-hero-sub">[\s\S]*?<\/p>/,
    `<p class="v-hero-sub">${esc(buildHeroLead(intent))}</p>`,
  );
  html = html.replace(/<div class="v-chips">[\s\S]*?<\/div>/, '');

  const edBlock = renderEditorial(intent, esc);
  if (html.includes('<!-- ░░ BLOCK 1')) {
    const editorialReplacement = applySeoTrustTransforms
      ? edBlock + '\n\n  </div>\n</section>\n\n<!-- ░░ BLOCK 5 — FINAL CTA ░░ -->'
      : edBlock + '\n\n<!-- ░░ BLOCK 5 — FINAL CTA ░░ -->';
    html = html.replace(
      /<!-- ░░ BLOCK 1[\s\S]*?<!-- ░░ BLOCK 5 — FINAL CTA ░░ -->/,
      editorialReplacement,
    );
  } else if (html.includes('<section class="editorial"')) {
    const editorialStart = html.indexOf('<section class="editorial"');
    const footerMatch = html.match(/<\/section>\s*<footer/);
    if (editorialStart >= 0 && footerMatch) {
      html =
        html.slice(0, editorialStart) +
        edBlock +
        '\n\n' +
        html.slice(footerMatch.index + '</section>'.length);
    }
  } else {
    throw new Error('image-compress editorial injection markers missing for ' + intent.slug);
  }

  if (applySeoTrustTransforms) {
    html = html.replace('<li>Compress up to 90% smaller</li>', '<li>Compare actual before and after size</li>');
    html = html.replace('<li>Convert to WebP (25–40% smaller)</li>', '<li>Convert to WebP</li>');
    html = html.replace('<li>Convert to AVIF (50% smaller than JPG)</li>', '<li>Convert to AVIF</li>');
    html = html.replace(
      /<div class="v-hint v-hint-ac">💡[\s\S]*?<\/div>/,
      '<div class="v-hint v-hint-ac">💡 <strong>WebP</strong> and <strong>AVIF</strong> are alternative output formats. Compare the actual preview and byte count because the result depends on the source image and selected settings.</div>',
    );
    html = html.replace(
      /<div class="v-hint v-hint-ac">💡 <strong>WebP<\/strong> is[\s\S]*?<\/div>/,
      '<div class="v-hint v-hint-ac">💡 Format changes are optional. Compare the preview and byte count, and keep the source master because re-encoding can remove image detail.</div>',
    );
    html = html.replace(
      /<h2 class="vp-h2">Start compressing now<\/h2>[\s\S]*?<button class="vp-cta vp-cta-lg"/,
      `<h2 class="vp-h2">Prepare the next image locally</h2>\n    <p class="vp-sub" style="margin-bottom:24px">Drop an image, review the crop and output settings, then verify the destination requirements before upload.</p>\n    <button class="vp-cta vp-cta-lg"`,
    );
  }
  if (applySeoTrustTransforms && intent.experienceTitle && intent.experienceLead) {
    html = html.replace(
      /(<section class="vt-exp"[\s\S]*?<div class="vt-exp-kicker">)[\s\S]*?(<div class="vt-exp-links">)/,
      `$1Human experience · Vigen G.</div>\n  <h2>${esc(intent.experienceTitle)}</h2>\n  <p>${esc(intent.experienceLead)}</p>\n  $2`,
    );
  }
  if (applySeoTrustTransforms) {
    html = html.replace(
      '<a href="/methodology/">Methodology</a><a href="/lab/">Lab Notes</a><a href="/methodology/">Methodology</a>',
      '<a href="/lab/">Lab Notes</a><a href="/methodology/">Methodology</a>',
    );
  }

  const inject =
    `<script type="application/json" id="vt-page-config">${pageConfigJson(intent)}</script>\n` +
    `<script src="/image-compress/js/page-config.js"></script>\n`;
  html = html.replace('<script src="/image-compress/js/ui.js', inject + '<script src="/image-compress/js/ui.js');
  if (!html.includes('src="/image-compress/js/ui.js')) {
    html = html.replace('<script src="js/ui.js', inject + '<script src="/image-compress/js/ui.js');
  }

  html = applyPseoTrust(html, `${intent.slug}/index.html`, applySeoTrustTransforms);
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
