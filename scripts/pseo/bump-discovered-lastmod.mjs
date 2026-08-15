/**
 * Bump lastmod on GSC "discovered" cluster + write priority sitemap for Indexing API.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const today = '2026-08-15';

const prefixes = [
  'https://velotools.app/bgremover/for-',
  'https://velotools.app/compress-pdf-for-',
  'https://velotools.app/image-resizer-for-',
  'https://velotools.app/compress-jpg-online/',
];

let sm = readFileSync(join(root, 'sitemap.xml'), 'utf8');
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const priority = locs.filter((u) => prefixes.some((p) => u.startsWith(p) || u === p));

for (const url of priority) {
  const blockRe = new RegExp(
    `(<url>\\s*<loc>${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<\\/loc>)([\\s\\S]*?)(<\\/url>)`,
  );
  sm = sm.replace(blockRe, (full, head, mid, tail) => {
    if (/<lastmod>/.test(mid)) {
      return head + mid.replace(/<lastmod>[^<]*<\/lastmod>/, `<lastmod>${today}</lastmod>`) + tail;
    }
    return `${head}\n    <lastmod>${today}</lastmod>${mid}${tail}`;
  });
}

writeFileSync(join(root, 'sitemap.xml'), sm);

const priXml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  priority.map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
  `\n</urlset>\n`;

writeFileSync(join(root, 'scripts/indexing-worker/priority-discovered.xml'), priXml);
console.log('priority urls', priority.length);
console.log(priority.slice(0, 5).join('\n'), '...');
