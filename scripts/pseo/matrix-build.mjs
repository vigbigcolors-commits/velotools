/**
 * Build SSR-shell HTML for /tools/[profession]/[tool](/[variant])/
 *
 * Server (build time) embeds only Zod-validated config.
 * Client never reads raw URL params for tool state.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { MATRIX, entryPath } from '../seo-data/matrix/index.mjs';

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

/**
 * SoftwareApplication JSON-LD (schema.org microdata for Google).
 * @param {import('zod').infer<typeof import('../seo-data/matrix/schema.mjs').MatrixEntrySchema>} entry
 * @param {string} canonical
 */
function softwareApplicationLd(entry, canonical) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${entry.toolLabel} for ${entry.professionLabel}`,
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Web Browser',
    url: canonical,
    description: entry.description,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: 'VeloTools',
      url: baseUrl,
    },
    featureList: [
      'Client-side only (no data upload)',
      `Focus ${entry.config.timers.focusMinutes} min`,
      `Short break ${entry.config.timers.shortBreakMinutes} min`,
      `Theme ${entry.config.theme}`,
      `Sound ${entry.config.soundPreset}`,
    ],
  };
}

/**
 * Safe page-config blob for hydration (подключение JS к HTML).
 * Only allowlisted fields — never raw URL.
 * @param {import('zod').infer<typeof import('../seo-data/matrix/schema.mjs').MatrixEntrySchema>} entry
 */
function pageConfig(entry) {
  return {
    id: entry.id,
    profession: entry.profession,
    professionLabel: entry.professionLabel,
    tool: entry.tool,
    variant: entry.variant ?? null,
    intentBanner: entry.intentBanner,
    config: entry.config,
  };
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

/**
 * Bake preset into visible HTML so first paint matches config (no 25min flash).
 * @param {string} html
 * @param {import('zod').infer<typeof import('../seo-data/matrix/schema.mjs').MatrixEntrySchema>} entry
 */
function applyPresetToShell(html, entry) {
  const f = entry.config.timers.focusMinutes;
  const sh = entry.config.timers.shortBreakMinutes;
  const lo = entry.config.timers.longBreakMinutes;
  const clock = `${pad2(f)}:00`;
  const label = `${f}/${sh} preset for this page — focus ${f} min, short break ${sh} min, long break ${lo} min`;

  html = html.replace(
    /<div class="f-timer-display" id="timer-display">[^<]*<\/div>/,
    `<div class="f-timer-display" id="timer-display">${clock}</div>`,
  );
  html = html.replace(
    /<div class="f-timer-phase"\s+id="timer-phase">[^<]*<\/div>/,
    `<div class="f-timer-phase"   id="timer-phase">Ready · ${f}-min focus</div>`,
  );
  html = html.replace(
    /(<button[^>]*id="mode-btn-focus"[^>]*>)[^<]*(<\/button>)/,
    `$1Focus · ${f}m$2`,
  );
  html = html.replace(
    /(<button[^>]*id="mode-btn-short"[^>]*>)[^<]*(<\/button>)/,
    `$1Short · ${sh}m$2`,
  );
  html = html.replace(
    /(<button[^>]*id="mode-btn-long"[^>]*>)[^<]*(<\/button>)/,
    `$1Long · ${lo}m$2`,
  );
  html = html.replace(
    /id="vt-stat-focus-min">[\s\S]*?<\/div>/,
    `id="vt-stat-focus-min">${f}<span class="f-sh-u">min</span></div>`,
  );
  html = html.replace(
    /id="vt-stat-focus-label">[^<]*<\/div>/,
    `id="vt-stat-focus-label">${esc(label)}</div>`,
  );

  // Default theme attribute on body for first paint
  html = html.replace(/<body([^>]*)>/, `<body$1 data-theme="${esc(entry.config.theme)}">`);

  return html;
}

/**
 * Unique lean SEO shell — never clone the long /focus/ essay (doorway risk).
 * @param {import('zod').infer<typeof import('../seo-data/matrix/schema.mjs').MatrixEntrySchema>} entry
 */
function renderUniqueSeo(entry) {
  const ed = entry.editorial;
  const f = entry.config.timers.focusMinutes;
  const sh = entry.config.timers.shortBreakMinutes;
  const lo = entry.config.timers.longBreakMinutes;
  const faqs = ed.faqs
    .map(
      (item) => `<details class="f-faq-item-new"><summary>${esc(item.question)}<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></summary><div class="f-fa"><p>${esc(item.answer)}</p></div></details>`,
    )
    .join('\n');

  return `<!-- SEO SECTION — UNIQUE PSEO (anti-doorway) -->
<section class="f-seo-section" id="vt-unique-seo">
  <div class="f-seo-inner">
    <div class="f-seo-hdr">
      <div class="f-eye"><span class="f-eye-dot"></span>${esc(ed.eyebrow)}</div>
      <h1 style="font-family:'Syne',sans-serif;font-size:clamp(28px,4vw,46px);font-weight:800;color:var(--tx);letter-spacing:-.6px;line-height:1.15;margin:0 0 12px">${esc(entry.h1)}</h1>
      <h2 style="font-family:'Syne',sans-serif;font-size:clamp(22px,3vw,34px);font-weight:700;color:var(--tx2);margin:0 0 14px">${esc(ed.h2)}</h2>
      <p>${esc(ed.lead)}</p>
    </div>

    <div class="f-stat-hero">
      <div class="f-shi">
        <div class="f-sh-n" id="vt-stat-focus-min">${f}<span class="f-sh-u">min</span></div>
        <div class="f-sh-l" id="vt-stat-focus-label">${esc(`${f}/${sh} preset — focus ${f} · short ${sh} · long ${lo}`)}</div>
      </div>
      <div class="f-shi">
        <div class="f-sh-n">${esc(entry.config.theme)}</div>
        <div class="f-sh-l">Locked theme for this profession page</div>
      </div>
      <div class="f-shi">
        <div class="f-sh-n">${esc(entry.config.soundPreset)}</div>
        <div class="f-sh-l">Default ambient preset (tap to start audio)</div>
      </div>
      <div class="f-shi">
        <div class="f-sh-n">0</div>
        <div class="f-sh-l">Uploads — timer state stays in your browser</div>
      </div>
    </div>

    <div class="f-seo-div"></div>

    <div class="f-seo-blk">
      <div class="f-eye"><span class="f-eye-dot"></span>Why this preset</div>
      <h2 class="f-seo-h2">Built for <em>${esc(entry.professionLabel)}</em> work</h2>
      <p class="f-seo-lead">${esc(ed.whyPreset)}</p>
      <p class="f-seo-lead">${esc(ed.workflowTip)}</p>
    </div>

    <div class="f-seo-div"></div>

    <div class="f-seo-blk">
      <div class="f-eye"><span class="f-eye-dot"></span>FAQ</div>
      <h2 class="f-seo-h2">Questions for this page</h2>
      <div class="f-faq-new">
${faqs}
      </div>
    </div>
  </div>
</section>`;
}

function faqJsonLd(entry) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entry.editorial.faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/**
 * @param {import('zod').infer<typeof import('../seo-data/matrix/schema.mjs').MatrixEntrySchema>} entry
 * @param {boolean} [dryRun]
 */
export function buildMatrixPage(entry, dryRun = false) {
  let html = readFileSync(join(root, 'focus', 'index.html'), 'utf8');
  const path = entryPath(entry);
  const canonical = `${baseUrl}${path}`;
  const ldApp = JSON.stringify(softwareApplicationLd(entry, canonical));
  const ldFaq = JSON.stringify(faqJsonLd(entry));
  const cfg = JSON.stringify(pageConfig(entry));

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(entry.title)}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${esc(entry.description)}">`,
  );
  html = html.replace(
    /<link rel="canonical" href="[^"]*">/,
    `<link rel="canonical" href="${canonical}">`,
  );

  html = applyPresetToShell(html, entry);

  // Absolute asset paths (page lives under /tools/...)
  html = html.replace(/(href|src)="(?!https?:|\/|#|data:)([^"]+)"/g, (_, attr, rel) => {
    if (rel.startsWith('js/') || rel.startsWith('css/') || rel.startsWith('sounds/') || rel.startsWith('audio/')) {
      return `${attr}="/focus/${rel}"`;
    }
    return `${attr}="/${rel}"`;
  });
  html = html.replace(/url\((['"]?)(?!https?:|\/|data:)([^'")]+)\1\)/g, (full, q, rel) => {
    if (rel.startsWith('js/') || rel.startsWith('sounds/') || rel.startsWith('audio/')) {
      return `url(${q}/focus/${rel}${q})`;
    }
    return full;
  });

  // Intent banner (visible state marker — Zero-Doorway)
  const bannerHtml = `<div id="vt-intent-banner" role="status" style="position:sticky;top:0;z-index:50;padding:8px 16px;text-align:center;font:600 12px/1.4 'DM Mono',monospace;letter-spacing:.04em;background:rgba(0,201,167,.12);border-bottom:1px solid rgba(0,201,167,.28);color:var(--ac,#00c9a7)">${esc(entry.intentBanner)}</div>`;
  html = html.replace(/<body([^>]*)>/, `<body$1>\n${bannerHtml}`);

  // Replace cloned Focus SEO essay with unique profession copy
  const seoStart = html.indexOf('<!-- SEO SECTION');
  const endMatch = html.slice(seoStart).match(/<\/section>\r?\n\r?\n<style>/);
  if (seoStart < 0 || !endMatch || endMatch.index == null) {
    throw new Error(`SEO section markers missing for ${entry.id}`);
  }
  const seoEnd = seoStart + endMatch.index;
  html =
    html.slice(0, seoStart) +
    renderUniqueSeo(entry) +
    '\n\n' +
    html.slice(seoEnd + '</section>'.length);

  const inject = [
    `<script type="application/ld+json">${ldApp}</script>`,
    `<script type="application/ld+json">${ldFaq}</script>`,
    `<script type="application/json" id="vt-page-config">${cfg}</script>`,
    `<script src="/focus/js/pseo-hydrate.js"></script>`,
  ].join('\n');

  if (html.includes('<!-- TOAST -->')) {
    html = html.replace('<!-- TOAST -->', `${inject}\n<!-- TOAST -->`);
  } else {
    html = html.replace('</head>', `${inject}\n</head>`);
  }

  const outDir = join(root, 'tools', entry.profession, entry.tool, ...(entry.variant ? [entry.variant] : []));
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

export function buildAllMatrixPages(dryRun = false) {
  const files = [];
  for (const entry of MATRIX) {
    files.push(buildMatrixPage(entry, dryRun));
  }
  return files;
}

// CLI: node scripts/pseo/matrix-build.mjs
if (process.argv[1] && /matrix-build\.mjs$/.test(process.argv[1].replace(/\\/g, '/'))) {
  const dry = process.argv.includes('--dry-run');
  const files = buildAllMatrixPages(dry);
  console.log(`\nMatrix build: ${files.length} page(s).`);
}
