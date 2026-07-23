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
    tool: entry.tool,
    variant: entry.variant ?? null,
    intentBanner: entry.intentBanner,
    config: entry.config,
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
  const ld = JSON.stringify(softwareApplicationLd(entry, canonical));
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

  // Inject JSON-LD + validated config before first script
  const inject = [
    `<script type="application/ld+json">${ld}</script>`,
    `<script type="application/json" id="vt-page-config">${cfg}</script>`,
    `<script src="/focus/js/pseo-hydrate.js"></script>`,
  ].join('\n');

  if (html.includes('<!-- TOAST -->')) {
    html = html.replace('<!-- TOAST -->', `${inject}\n<!-- TOAST -->`);
  } else {
    html = html.replace('</head>', `${inject}\n</head>`);
  }

  // H1 in SEO section if present — keep tool usable; update first visible brand line lightly
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${esc(entry.title)}</title>`,
  );

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
