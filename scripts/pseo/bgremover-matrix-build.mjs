/**
 * Build SSR-shell HTML for /bgremover/for-{useCase}/
 * Zod-validated config only. Client never invents state from the URL.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { MATRIX, entryPath } from '../seo-data/bgremover-matrix/index.mjs';

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

function pageConfig(entry) {
  return {
    id: entry.id,
    tool: 'bg-remover',
    useCase: entry.useCase,
    useCaseLabel: entry.useCaseLabel,
    intentBanner: entry.intentBanner,
    config: entry.config,
  };
}

function softwareApplicationLd(entry, canonical) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `Background Remover for ${entry.useCaseLabel}`,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires a modern browser with WebAssembly',
    url: canonical,
    description: entry.description,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    author: { '@type': 'Organization', name: 'VeloTools', url: baseUrl },
    featureList: [
      'Client-side only (no upload)',
      `Default preview ${entry.config.defaultBg}`,
      `Export hint ${entry.config.exportHint}`,
      entry.config.suggestRefine ? 'Refine suggested' : 'Manual refine optional',
      'No watermarks',
    ],
  };
}

function faqJsonLd(entry) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entry.editorial.faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

function relatedPresetLinks(current) {
  const parts = [`<a href="/bgremover/">All-purpose BG Remover</a>`];
  for (const e of MATRIX) {
    if (e.id === current.id) continue;
    const href = entryPath(e);
    const label = e.useCaseLabel.replace(/\s+flats$/i, '').trim();
    parts.push(`<a href="${href}">${esc(label)}</a>`);
  }
  return parts.join(' ·\n      ');
}

function renderUniqueSeo(entry) {
  const ed = entry.editorial;
  const faqs = ed.faqs
    .map(
      (f) =>
        `<details class="faq-item"><summary>${esc(f.question)}<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></summary><div class="fa">${esc(f.answer)}</div></details>`,
    )
    .join('\n    ');

  return `<!-- SEO SECTION — UNIQUE PSEO (anti-doorway) -->
<section class="seo">
  <div class="sec-divide">
    <div class="sec-divide-line"></div>
    <div class="sec-divide-dot"></div>
    <div class="sec-divide-line"></div>
  </div>

  <div class="seo-block">
    <div class="seo-eyebrow"><span class="seo-eyebrow-dot"></span>${esc(ed.eyebrow)}</div>
    <h2>${esc(ed.h2)}</h2>
    <p class="seo-lead">${esc(ed.lead)}</p>
  </div>

  <div class="seo-block">
    <div class="seo-eyebrow"><span class="seo-eyebrow-dot"></span>Why this preset</div>
    <h2>Why ${esc(entry.useCaseLabel)} gets this locked preview</h2>
    <p class="seo-lead">${esc(ed.whyPreset)}</p>
    <p class="seo-lead">${esc(ed.workflowTip)}</p>
  </div>

  <div class="seo-block">
    <div class="seo-eyebrow"><span class="seo-eyebrow-dot"></span>Scenario</div>
    <h2>${esc(ed.scenarioH2)}</h2>
    <p class="seo-lead">${esc(ed.scenarioBody)}</p>
  </div>

  <div class="seo-block">
    <div class="seo-eyebrow"><span class="seo-eyebrow-dot"></span>Edge craft</div>
    <h2>${esc(ed.edgesH2)}</h2>
    <p class="seo-lead">${esc(ed.edgesBody)}</p>
  </div>

  <div class="seo-block">
    <div class="seo-eyebrow"><span class="seo-eyebrow-dot"></span>Privacy by architecture</div>
    <h2>On-device cutouts for ${esc(entry.useCaseLabel)}</h2>
    <p class="seo-lead">${esc(ed.privacyNote)}</p>
  </div>

  <div class="seo-block">
    <div class="seo-eyebrow"><span class="seo-eyebrow-dot"></span>Preset FAQ</div>
    <h2>FAQ — ${esc(entry.useCaseLabel)} background removal</h2>
    ${faqs}
  </div>

  <div class="seo-block">
    <p class="seo-lead">More cutout presets:
      ${relatedPresetLinks(entry)}
    </p>
  </div>
</section>`;
}

function applyShell(html, entry) {
  html = html.replace(/<h1>[\s\S]*?<\/h1>/, `<h1>${esc(entry.h1)}</h1>`);
  html = html.replace(
    /<p class="hero-sub">[\s\S]*?<\/p>/,
    `<p class="hero-sub">${esc(entry.heroSub)}</p>`,
  );
  html = html.replace(
    /<div class="hero-tag">[\s\S]*?<\/div>/,
    `<div class="hero-tag"><span class="hero-dot"></span>${esc(entry.intentBanner)}</div>`,
  );

  // Bake preset swatch for first paint (Zero-Doorway)
  html = html.replace(/(<div class="sw[^"]*" id="sw-\d+"[^>]*)\sact/g, '$1');
  const swRe = new RegExp(
    `(<div class="sw[^"]*" id="sw-${entry.config.bgSwatchIndex}"[^>]*)(>)`,
  );
  html = html.replace(swRe, '$1 act$2');

  return html;
}

function applyExportHighlight(html, entry) {
  // Reset primary on download buttons
  html = html.replace(/class="dl-btn pr"/g, 'class="dl-btn"');
  const hint = entry.config.exportHint;
  const map = {
    png: "doDownload('png')",
    'jpg-white': "doDownload('jpg-white')",
    webp: "doDownload('webp')",
    'jpg-bg': "doDownload('jpg-bg')",
  };
  const target = map[hint] || map.png;
  html = html.replace(
    new RegExp(`<button class="dl-btn" onclick="${target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`),
    `<button class="dl-btn pr" onclick="${target}"`,
  );
  return html;
}

/**
 * @param {import('zod').infer<typeof import('../seo-data/bgremover-matrix/schema.mjs').MatrixEntrySchema>} entry
 */
export function buildBgremoverPage(entry, dryRun = false) {
  let html = readFileSync(join(root, 'bgremover', 'index.html'), 'utf8');
  const path = entryPath(entry);
  const canonical = `${baseUrl}${path}`;
  const cfg = JSON.stringify(pageConfig(entry));
  const ldApp = JSON.stringify(softwareApplicationLd(entry, canonical));
  const ldFaq = JSON.stringify(faqJsonLd(entry));

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(entry.title)}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${esc(entry.description)}">`,
  );
  html = html.replace(
    /<link rel="canonical" href="[^"]*">/,
    `<link rel="canonical" href="${canonical}">`,
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*">/,
    `<meta property="og:title" content="${esc(entry.title)}">`,
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*">/,
    `<meta property="og:description" content="${esc(entry.description)}">`,
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*">/,
    `<meta property="og:url" content="${canonical}">`,
  );

  // Absolute assets for nested path
  html = html.replace(
    /href="style\.css"/,
    'href="/bgremover/style.css"',
  );
  html = html.replace(
    /<script src="app\.js"><\/script>/,
    '<script src="/bgremover/app.js"></script>\n<script src="/bgremover/js/pseo-hydrate.js"></script>',
  );

  // Mark BG Remover nav active still
  html = html.replace(
    '<a href="/bgremover/"      class="vt-glink">BG Remover</a>',
    '<a href="/bgremover/"      class="vt-glink act">BG Remover</a>',
  );

  html = applyShell(html, entry);
  html = applyExportHighlight(html, entry);

  // Intent banner (sticky)
  const bannerHtml = `<div id="vt-intent-banner" role="status" style="position:sticky;top:60px;z-index:50;padding:8px 16px;text-align:center;font:600 12px/1.4 'DM Mono',monospace;letter-spacing:.04em;background:rgba(168,85,232,.12);border-bottom:1px solid rgba(168,85,232,.28);color:#e9d5ff">${esc(entry.intentBanner)} · ${esc(entry.config.tipLabel)}</div>`;
  html = html.replace(/<body([^>]*)>/, `<body$1>\n${bannerHtml}`);

  // Replace SEO block
  const seoStart = html.indexOf('<!-- SEO / EEAT -->');
  const footerStart = html.indexOf('<footer class="footer">');
  if (seoStart < 0 || footerStart < 0) {
    throw new Error(`SEO/footer markers missing for ${entry.id}`);
  }
  html =
    html.slice(0, seoStart) +
    renderUniqueSeo(entry) +
    '\n\n' +
    html.slice(footerStart);

  // Replace head JSON-LD with page-specific + config
  html = html.replace(
    /<script type="application\/ld\+json">\{"@context":"https:\/\/schema\.org","@type":"WebApplication"[\s\S]*?<\/script>\s*/,
    '',
  );
  html = html.replace(
    /<script type="application\/ld\+json">\{"@context":"https:\/\/schema\.org","@type":"FAQPage"[\s\S]*?<\/script>\s*/,
    '',
  );

  const inject = [
    `<script type="application/ld+json">${ldApp}</script>`,
    `<script type="application/ld+json">${ldFaq}</script>`,
    `<script type="application/json" id="vt-page-config">${cfg}</script>`,
  ].join('\n');
  html = html.replace('</head>', `${inject}\n</head>`);

  const outDir = join(root, 'bgremover', `for-${entry.useCase}`);
  const outFile = join(outDir, 'index.html');

  if (dryRun) {
    console.log(`[dry-run] ${path} → ${outFile}`);
    return outFile;
  }

  mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, html, 'utf8');
  console.log(`✓ ${path}`);
  return outFile;
}

export function buildAllBgremoverPages(dryRun = false) {
  return MATRIX.map((entry) => buildBgremoverPage(entry, dryRun));
}

if (process.argv[1] && /bgremover-matrix-build\.mjs$/.test(process.argv[1].replace(/\\/g, '/'))) {
  const dry = process.argv.includes('--dry-run');
  buildAllBgremoverPages(dry);
  console.log(dry ? `Dry-run ${MATRIX.length} pages` : `Built ${MATRIX.length} BG Remover PSEO pages`);
}
