/**
 * Full audit of VeloTools PDF tools — fetch pages, assets, links, schema, SEO blocks.
 * Usage: node scripts/audit-pdf-tools.mjs
 *        AUDIT_BASE=https://velotools.app node scripts/audit-pdf-tools.mjs
 */
const BASE = process.env.AUDIT_BASE || 'http://localhost:3000';

const PAGES = [
  { path: '/compress-pdf/', seo: ['security', 'how-it-works', 'tech-specs', 'deep-dive', 'faq'] },
  { path: '/merge-pdf/', seo: ['security', 'how-it-works', 'tech-specs', 'deep-dive', 'faq'] },
  { path: '/split-pdf/', seo: ['security', 'how-it-works', 'tech-specs', 'deep-dive', 'faq'] },
  { path: '/unlock-pdf/', seo: ['security', 'how-it-works', 'tech-specs', 'deep-dive', 'faq'] },
  { path: '/pdf-to-jpg/', seo: ['security', 'how-it-works', 'tech-specs', 'deep-dive', 'faq'] },
  { path: '/pdf-compress/', seo: [] },
];

const REQUIRED_ASSETS = [
  '/pdf-core/engine.js',
  '/pdf-core/utils.js',
  '/pdf-core/shared.css',
  '/pdf-tools/merge.js',
  '/pdf-tools/split.js',
  '/pdf-tools/unlock.js',
  '/pdf-tools/compress.js',
  '/pdf-tools/pdf-to-jpg.js',
  '/compress-pdf/style.css',
];

const issues = [];
const ok = [];

function fail(cat, msg) {
  issues.push({ cat, msg });
}
function pass(msg) {
  ok.push(msg);
}

async function fetchStatus(url) {
  try {
    const res = await fetch(url, { redirect: 'follow' });
    return { url, status: res.status, ok: res.ok, text: res.ok ? await res.text() : '' };
  } catch (e) {
    return { url, status: 0, ok: false, error: e.message, text: '' };
  }
}

function extractAssets(html) {
  const scripts = [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)].map((m) => m[1]);
  const moduleScripts = [...html.matchAll(/<script[^>]*type=["']module["'][^>]*src=["']([^"']+)["']/gi)].map(
    (m) => m[1],
  );
  const links = [...html.matchAll(/<link[^>]+href=["']([^"']+)["']/gi)].map((m) => m[1]);
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  return {
    scripts,
    moduleScripts,
    links,
    ldCount: ld.length,
    ldErrors: ld
      .map((m, i) => {
        try {
          JSON.parse(m[1].trim());
          return null;
        } catch (e) {
          return `block ${i + 1}: ${e.message}`;
        }
      })
      .filter(Boolean),
  };
}

async function main() {
  console.log('PDF Tools Audit — base:', BASE, '\n');

  for (const page of PAGES) {
    const { path, seo } = page;
    const r = await fetchStatus(BASE + path);
    if (!r.ok) fail('PAGE', `${path} → HTTP ${r.status || r.error}`);
    else {
      pass(`${path} → ${r.status}`);
      if (path === '/pdf-compress/' && !r.text.includes('compress-pdf')) {
        fail('REDIRECT', '/pdf-compress/ should redirect to /compress-pdf/');
      }
      const a = extractAssets(r.text);
      if (a.ldErrors.length) fail('JSON-LD', `${path}: ${a.ldErrors.join('; ')}`);
      else if (a.ldCount) pass(`${path}: ${a.ldCount} JSON-LD block(s) valid`);

      if (path !== '/pdf-compress/' && path !== '/compress-pdf/') {
        if (a.ldCount < 2) fail('JSON-LD', `${path}: expected ≥2 schema blocks (WebApplication + FAQPage)`);
        if (!a.moduleScripts.length) fail('MODULE', `${path}: missing type="module" tool script`);
      }

      for (const id of seo) {
        if (!r.text.includes(`id="${id}"`)) fail('SEO', `${path} missing #${id} section`);
        else pass(`${path}: #${id} present`);
      }

      if (r.text.match(/[а-яА-ЯёЁ]/)) fail('I18N', `${path} contains Cyrillic in HTML`);

      for (const src of a.scripts) {
        if (src.startsWith('http')) continue;
        const assetUrl = src.startsWith('/') ? BASE + src : BASE + path + src;
        const ar = await fetchStatus(assetUrl);
        if (!ar.ok) fail('ASSET', `${path} script ${src} → ${ar.status || ar.error}`);
      }
    }
  }

  for (const asset of REQUIRED_ASSETS) {
    const r = await fetchStatus(BASE + asset);
    if (!r.ok) fail('CORE', `${asset} → ${r.status || r.error}`);
    else pass(`asset ${asset} → ${r.status} (${r.text.length} bytes)`);
  }

  const merge = await fetchStatus(BASE + '/merge-pdf/');
  if (merge.ok) {
    for (const link of ['/compress-pdf/', '/split-pdf/', '/unlock-pdf/', '/pdf-to-jpg/']) {
      if (!merge.text.includes(link)) fail('NAV', `merge-pdf missing link to ${link}`);
      else pass(`merge-pdf links to ${link}`);
    }
  }

  const shared = await fetchStatus(BASE + '/pdf-core/shared.css');
  if (shared.ok && !shared.text.includes('file-list-hidden')) {
    fail('CORE', 'shared.css missing .file-list-hidden (stale deploy?)');
  }

  console.log('=== PASSED (' + ok.length + ') ===');
  ok.forEach((x) => console.log('  ✓', x));
  console.log('\n=== ISSUES (' + issues.length + ') ===');
  if (!issues.length) console.log('  (none)');
  issues.forEach((x) => console.log(`  ✗ [${x.cat}] ${x.msg}`));
  process.exit(issues.length ? 1 : 0);
}

main();
