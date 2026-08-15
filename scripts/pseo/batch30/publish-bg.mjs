import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { MATRIX, entryPath } from '../../seo-data/bgremover-matrix/index.mjs';
import { notifyGoogle } from '../notify-google.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const sitemapPath = join(root, 'sitemap.xml');
let sitemap = readFileSync(sitemapPath, 'utf8');
const day = '2026-08-15';
const added = [];
for (const e of MATRIX) {
  const path = entryPath(e);
  const loc = `https://velotools.app${path}`;
  if (sitemap.includes(`<loc>${loc}</loc>`)) continue;
  const block = `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${day}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  sitemap = sitemap.replace('</urlset>', block + '</urlset>');
  console.log('+', path);
  added.push(path);
}
writeFileSync(sitemapPath, sitemap);
console.log('added', added.length);
if (added.length) notifyGoogle(added);
