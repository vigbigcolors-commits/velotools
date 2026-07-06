/**
 * Programmatic SEO page generator for PDF tools (skeleton).
 * Usage: node scripts/build-pdf-pages.mjs [--slug=merge-pdf] [--dry-run]
 *
 * Live P0 pages are hand-maintained for EEAT quality.
 * This generator will scaffold new landing pages from pdf-tools-registry.json
 * once content blocks exist in scripts/content/.
 */
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const registryPath = path.join(root, 'scripts', 'pdf-tools-registry.json');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

const args = process.argv.slice(2);
const slugArg = args.find((a) => a.startsWith('--slug='));
const targetSlug = slugArg ? slugArg.split('=')[1] : null;
const dryRun = args.includes('--dry-run');

const tools = registry.tools.filter((t) => {
  if (targetSlug) return t.slug === targetSlug;
  return t.status === 'planned';
});

if (!tools.length) {
  console.log('No tools to generate. Use --slug= or add planned tools to registry.');
  process.exit(0);
}

for (const tool of tools) {
  const outDir = path.join(root, tool.slug);
  const outFile = path.join(outDir, 'index.html');
  console.log(dryRun ? '[dry-run] would create:' : 'skip (scaffold only):', outFile);
  console.log('  mode:', tool.mode, '| tier:', tool.tier);
  console.log('  → Add content blocks:', (tool.contentBlocks || []).join(', ') || '(none)');
}

console.log('\nTo generate: implement renderToolPage() with scripts/content/*.md blocks.');
console.log('P0 live pages: merge-pdf, compress-pdf, split-pdf, unlock-pdf');
