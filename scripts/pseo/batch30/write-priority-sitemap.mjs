import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const day = '2026-08-15';
const urls = [
  'yahoo-mail','proton-mail','google-classroom','brightspace','schoology','gradescope','jira','confluence','asana','box','onedrive','messenger',
].map((s) => `https://velotools.app/compress-pdf-for-${s}/`);
urls.push(
  ...['target','temu','shein','wayfair','mercari','depop','linkedin','twitter','youtube','threads'].map(
    (s) => `https://velotools.app/image-resizer-for-${s}/`,
  ),
);
urls.push(
  ...['logos','packaging','furniture','footwear','cosmetics','documents','group-photos','twitch-thumbs'].map(
    (s) => `https://velotools.app/bgremover/for-${s}/`,
  ),
);

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) => `  <url><loc>${u}</loc><lastmod>${day}</lastmod></url>`).join('\n') +
  `\n</urlset>\n`;

writeFileSync(join(root, 'scripts/indexing-worker/priority-batch30.xml'), xml);
console.log('wrote', urls.length, 'urls');
