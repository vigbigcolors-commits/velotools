#!/usr/bin/env node
/**
 * Inject human Experience + ideal pillar↔product linking into tool HTML.
 * - Unique Experience block per core tool (from tool-experience.mjs)
 * - Nav/footer: Lab + Methodology + About + sibling products
 * - PSEO pages: trust rail up to parent hub + Lab/Method (no cloned essays)
 *
 * Forbidden: doorway clones, thin AI filler, identical experience text across tools.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import { TOOL_EXPERIENCE } from '../seo-data/tool-experience.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');
const dry = process.argv.includes('--dry-run');

const SKIP_DIR = new Set([
  'node_modules',
  '.git',
  'velo-growth-desk',
  'scripts',
  'css',
  'js',
  'fonts',
  'images',
  'og',
  'dist',
  'dist-tool-cards',
  'tests',
  'lab',
  'methodology',
  'about',
  'privacy',
  'terms',
]);

const EXPERIENCE_CSS = `<style id="vt-eeat-css">
.vt-exp{margin:40px auto;max-width:920px;padding:24px 26px;border:1px solid rgba(255,255,255,.12);border-radius:16px;background:rgba(0,0,0,.22)}
.vt-exp-kicker{font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#00e6d0;margin-bottom:8px}
.vt-exp h2{font-size:20px;font-weight:800;color:#fff;margin:0 0 12px;letter-spacing:-.3px}
.vt-exp p{font-size:15px;line-height:1.75;color:rgba(176,202,216,.95);margin:0 0 14px}
.vt-exp-links{display:flex;flex-wrap:wrap;gap:10px}
.vt-exp-links a{font-size:13px;font-weight:700;color:#00e6d0;text-decoration:none;border:1px solid rgba(0,230,208,.35);padding:8px 12px;border-radius:9px}
.vt-exp-links a:hover{background:rgba(0,230,208,.1)}
.vt-eeat-rail{display:flex;flex-wrap:wrap;gap:8px 14px;justify-content:center;padding:14px 16px;margin:0 auto 8px;max-width:1100px;font-size:13px}
.vt-eeat-rail a{color:rgba(176,202,216,.9);text-decoration:none;font-weight:600}
.vt-eeat-rail a:hover{color:#00e6d0}
</style>`;

function walkIndexHtml(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    if (SKIP_DIR.has(name) || name.startsWith('.')) continue;
    const p = join(dir, name);
    let st;
    try {
      st = statSync(p);
    } catch {
      continue;
    }
    if (st.isDirectory()) walkIndexHtml(p, acc);
    else if (name === 'index.html') acc.push(p);
  }
  return acc;
}

function toolKeyFromPath(filePath) {
  const rel = relative(root, filePath).replace(/\\/g, '/');
  const parts = rel.split('/');
  if (parts[0] === 'bgremover' && parts[1] === 'index.html') return 'bgremover';
  if (parts[0] === 'tools') return 'focus';
  if (parts.length >= 2 && parts[1] === 'index.html') return parts[0];
  return null;
}

function parentHub(rel) {
  if (rel.startsWith('compress-pdf-for-') || rel.startsWith('compress-pdf/')) return '/compress-pdf/';
  if (rel.startsWith('image-resizer-for-') || rel.startsWith('image-compress')) return '/image-compress/';
  if (rel.startsWith('bgremover/')) return '/bgremover/';
  if (rel.startsWith('tools/')) return '/focus/';
  if (
    /^(merge-pdf|split-pdf|rotate-pdf|unlock-pdf|protect-pdf|pdf-to-jpg|jpg-to-pdf|pdf-tools)\//.test(
      rel,
    )
  ) {
    return '/pdf-tools/';
  }
  return '/';
}

function experienceHtml(key) {
  const exp = TOOL_EXPERIENCE[key];
  if (!exp) return '';
  const links = exp.links
    .map((l) => `<a href="${l.href}">${l.label}</a>`)
    .join('');
  return `
<section class="vt-exp" id="builder-experience" data-tool="${key}" aria-label="Builder experience">
  <div class="vt-exp-kicker">Human experience · Vigen G.</div>
  <h2>${exp.title}</h2>
  <p>${exp.body}</p>
  <div class="vt-exp-links">${links}<a href="/lab/">Lab Notes</a><a href="/methodology/">Methodology</a><a href="/about/vigen/">Vigen G.</a><a href="/about/">About</a></div>
</section>
`;
}

function labelFromRel(rel) {
  if (rel.startsWith('compress-pdf-for-')) {
    return rel
      .replace(/^compress-pdf-for-/, '')
      .replace(/\/index\.html$/, '')
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
  if (rel.startsWith('image-resizer-for-')) {
    return rel
      .replace(/^image-resizer-for-/, '')
      .replace(/\/index\.html$/, '')
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
  if (rel.startsWith('bgremover/for-')) {
    return rel
      .replace(/^bgremover\/for-/, '')
      .replace(/\/index\.html$/, '')
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
  if (rel.startsWith('tools/')) {
    const parts = rel.replace(/\/index\.html$/, '').split('/');
    return parts
      .slice(1)
      .map((seg) =>
        seg
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' '),
      )
      .join(' · ');
  }
  return null;
}

function pseoExperienceHtml(rel) {
  const label = labelFromRel(rel);
  if (!label) return '';
  const hub = parentHub(rel);
  let job = 'this workflow';
  let action = 'open the parent tool, set the preset, run the job on-device';
  if (rel.startsWith('compress-pdf-for-')) {
    job = `PDF attachment limits for ${label}`;
    action = 'pick the Screen/Web preset that fits the channel, compress locally, then attach';
  } else if (rel.startsWith('image-resizer-for-')) {
    job = `listing image sizes for ${label}`;
    action = 'resize to the channel box, then compress if the portal still rejects the file';
  } else if (rel.startsWith('bgremover/for-')) {
    job = `background removal for ${label}`;
    action = 'run the local cutout, Refine hair/edges, export PNG or white JPG as the channel requires';
  } else if (rel.startsWith('tools/')) {
    job = `deep-work blocks for ${label}`;
    action = 'start the timer with the baked preset — the minutes on the page must match the clock';
  }
  const slug = rel.replace(/\/index\.html$/, '');
  return `
<section class="vt-exp" id="builder-experience" data-pseo="${slug}" aria-label="Builder experience">
  <div class="vt-exp-kicker">Human experience · Vigen G.</div>
  <h2>Field note: ${label}</h2>
  <p>I keep this page because ${job} kept failing with upload tools or generic presets. Here you ${action}. Limits and architecture are documented in Lab Notes — this URL is a micro-instrument for one job, not a keyword clone.</p>
  <div class="vt-exp-links"><a href="${hub}">Parent tool</a><a href="/lab/">Lab Notes</a><a href="/methodology/">Methodology</a><a href="/about/vigen/">Vigen G.</a><a href="/about/">About</a></div>
</section>
`;
}

function ensureCss(html) {
  if (html.includes('id="vt-eeat-css"')) return html;
  if (html.includes('</head>')) return html.replace('</head>', `${EXPERIENCE_CSS}\n</head>`);
  return html;
}

function ensureNavLab(html) {
  if (/href="\/lab\/"/.test(html) && /vt-glink[^>]*>Lab<|>Lab</.test(html)) {
    // already has Lab somewhere in nav-ish; still try standard patterns
  }
  // Pattern A: About as vt-glink
  if (
    html.includes('href="/about/"') &&
    !html.includes('href="/lab/"') &&
    html.includes('vt-glink')
  ) {
    html = html.replace(
      /<a href="\/about\/"(\s+class="vt-glink[^"]*")?>\s*About/,
      '<a href="/lab/" class="vt-glink">Lab</a>\n    <a href="/about/"$1>About',
    );
  }
  // Pattern B: image-compress v-nl
  if (html.includes('v-nl v-nl-about') && !html.includes('href="/lab/"')) {
    html = html.replace(
      /<a href="\/about\/"\s+class="v-nl v-nl-about">/,
      '<a href="/lab/" class="v-nl">Lab</a>\n    <a href="/about/" class="v-nl v-nl-about">',
    );
  }
  // Pattern C: focus f-nav-link
  if (html.includes('f-nav-link') && html.includes('href="/about/"') && !html.includes('href="/lab/"')) {
    html = html.replace(
      /<a href="\/about\/"\s+class="f-nav-link">/,
      '<a href="/lab/" class="f-nav-link">Lab</a>\n    <a href="/about/" class="f-nav-link">',
    );
  }
  // Pattern D: hub-glink
  if (html.includes('hub-glink') && html.includes('href="/about/"') && !html.includes('href="/lab/"')) {
    html = html.replace(
      /<a href="\/about\/" class="hub-glink">About<\/a>/,
      '<a href="/lab/" class="hub-glink">Lab</a>\n    <a href="/about/" class="hub-glink">About</a>',
    );
  }
  // Method next to Privacy
  if (html.includes('href="/privacy/"') && !html.includes('href="/methodology/"')) {
    html = html.replace(
      /<a href="\/privacy\/"([^>]*)>/,
      '<a href="/methodology/"$1>Method</a><a href="/privacy/"$1>',
    );
    // Fix doubled Method if class swallowed wrongly - cleanup common botch
    html = html.replace(
      /<a href="\/methodology\/"([^>]*)>Method<\/a><a href="\/privacy\/"\1>/g,
      '<a href="/methodology/"$1>Method</a><a href="/privacy/"$1>',
    );
  }
  return html;
}

function ensureFooterTrust(html) {
  const trustBits = [
    '<a href="/lab/">Lab Notes</a>',
    '<a href="/methodology/">Methodology</a>',
    '<a href="/about/">About</a>',
  ];
  if (trustBits.every((b) => html.includes(b))) return html;

  // v-flinks
  if (html.includes('class="v-flinks"') && !html.includes('href="/lab/"')) {
    html = html.replace(
      /(<nav class="v-flinks"[^>]*>)/,
      `$1<a href="/lab/">Lab Notes</a><a href="/methodology/">Methodology</a>`,
    );
  }
  // site-footer / footer paragraphs
  if (html.includes('site-footer') && !html.includes('href="/lab/"')) {
    html = html.replace(
      /(<footer class="site-footer">[\s\S]*?)(<\/footer>)/,
      `$1<p class="vt-eeat-rail"><a href="/lab/">Lab Notes</a> · <a href="/methodology/">Methodology</a> · <a href="/about/">About</a> · <a href="/pdf-tools/">PDF tools</a></p>$2`,
    );
  }
  if (html.includes('hub-footer') && !html.includes('href="/lab/"')) {
    html = html.replace(
      /(<footer class="hub-footer">[\s\S]*?)(<\/footer>)/,
      `$1<p><a href="/lab/">Lab Notes</a> · <a href="/methodology/">Methodology</a> · <a href="/about/">About</a></p>$2`,
    );
  }
  if (
    (html.includes('class="footer"') || html.includes("class='footer'")) &&
    !html.includes('href="/methodology/"')
  ) {
    html = html.replace(
      /(<footer class="footer">)/,
      `$1<nav class="vt-eeat-rail" aria-label="Trust links"><a href="/lab/">Lab Notes</a><a href="/methodology/">Methodology</a><a href="/about/">About</a><a href="/">All tools</a></nav>`,
    );
  }
  return html;
}

function injectExperience(html, key) {
  if (!key || !TOOL_EXPERIENCE[key]) return html;
  if (html.includes(`data-tool="${key}"`) || html.includes('id="builder-experience"')) {
    // refresh body in place
    const block = experienceHtml(key);
    return html.replace(
      /<section class="vt-exp" id="builder-experience"[\s\S]*?<\/section>\s*/i,
      block,
    );
  }
  const block = experienceHtml(key);
  const markers = [
    /<footer class="v-foot">/,
    /<footer class="site-footer">/,
    /<footer class="footer">/,
    /<footer class="hub-footer">/,
    /<footer\b/,
  ];
  for (const re of markers) {
    if (re.test(html)) return html.replace(re, `${block}\n$&`);
  }
  return html.replace('</body>', `${block}\n</body>`);
}

function pseoTrustRail(rel) {
  const hub = parentHub(rel);
  return `
<nav class="vt-eeat-rail" aria-label="Trust and product links">
  <a href="${hub}">Parent tool</a>
  <a href="/lab/">Lab Notes</a>
  <a href="/methodology/">Methodology</a>
  <a href="/about/">About</a>
  <a href="/">All tools</a>
</nav>
`;
}

function injectPseoRail(html, rel) {
  const exp = pseoExperienceHtml(rel);
  if (exp) {
    if (html.includes('id="builder-experience"') && html.includes('data-pseo=')) {
      html = html.replace(
        /<section class="vt-exp" id="builder-experience"[\s\S]*?<\/section>\s*/i,
        exp,
      );
    } else if (!html.includes('id="builder-experience"')) {
      const markers = [
        /<footer class="site-footer">/,
        /<footer class="footer">/,
        /<footer class="v-foot">/,
        /<footer\b/,
      ];
      let placed = false;
      for (const re of markers) {
        if (re.test(html)) {
          html = html.replace(re, `${exp}\n$&`);
          placed = true;
          break;
        }
      }
      if (!placed) html = html.replace('</body>', `${exp}\n</body>`);
    }
  }
  if (html.includes('class="vt-eeat-rail"')) return html;
  const rail = pseoTrustRail(rel);
  const markers = [
    /<footer class="site-footer">/,
    /<footer class="footer">/,
    /<footer class="v-foot">/,
    /<footer\b/,
  ];
  for (const re of markers) {
    if (re.test(html)) return html.replace(re, `${rail}\n$&`);
  }
  return html;
}

function processFile(filePath) {
  const rel = relative(root, filePath).replace(/\\/g, '/');
  if (rel === 'index.html') return { rel, changed: false, reason: 'home-skip' };

  let html = readFileSync(filePath, 'utf8');
  const before = html;
  const key = toolKeyFromPath(filePath);
  const isCore = key && TOOL_EXPERIENCE[key] && rel === `${key}/index.html`;
  const isFocusVariant = rel.startsWith('tools/') && rel.endsWith('/index.html');
  const isPseo =
    /^(compress-pdf-for-|image-resizer-for-|bgremover\/for-)/.test(rel) || isFocusVariant;

  html = ensureCss(html);
  html = ensureNavLab(html);
  html = ensureFooterTrust(html);

  if (isCore) html = injectExperience(html, key);
  else if (isPseo) html = injectPseoRail(html, rel);

  // Focus hub also gets experience
  if (rel === 'focus/index.html') html = injectExperience(html, 'focus');

  if (html === before) return { rel, changed: false };
  if (!dry) writeFileSync(filePath, html);
  return { rel, changed: true };
}

const files = walkIndexHtml(root);
const results = files.map(processFile);
const changed = results.filter((r) => r.changed);
console.log(
  JSON.stringify(
    {
      scanned: files.length,
      changed: changed.length,
      dryRun: dry,
      sample: changed.slice(0, 25).map((r) => r.rel),
    },
    null,
    2,
  ),
);
