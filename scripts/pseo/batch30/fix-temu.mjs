import { readFileSync, writeFileSync } from 'fs';

// platforms-image temu
const pp = 'scripts/seo-data/platforms-image.json';
const platforms = JSON.parse(readFileSync(pp, 'utf8'));
platforms['temu-product-image'].min_width_px = 850;
platforms['temu-product-image'].min_height_px = 850;
platforms['temu-product-image'].recommended_quality = 74;
platforms['temu-product-image'].notes =
  'Temu listing rails commonly start near an 850×850 square with a tight practical ~5 MB weight. Quality 74 distinguishes from AliExpress’s 800/q75 twin while still downscaling studio exports for first-pass seller upload.';
writeFileSync(pp, JSON.stringify(platforms, null, 2) + '\n');

// editorials temu block
const ep = 'scripts/seo-data/intents/image-resizer-editorials.mjs';
let s = readFileSync(ep, 'utf8');
const start = s.indexOf("'image-resizer-for-temu'");
const next = s.indexOf("'image-resizer-for-", start + 1);
let block = s.slice(start, next > 0 ? next : s.length);
block = block
  .replaceAll('800×800', '850×850')
  .replaceAll('quality 75', 'quality 74')
  .replaceAll('JPEG 75', 'JPEG 74')
  .replaceAll('JPEG quality 75', 'JPEG quality 74')
  .replaceAll('quality <strong>75</strong>', 'quality <strong>74</strong>')
  .replaceAll('at 75', 'at 74')
  .replaceAll('800 square', '850 square')
  .replaceAll('canvas at 800', 'canvas at 850')
  .replaceAll('an 800 tile', 'an 850 tile');
s = s.slice(0, start) + block + s.slice(next > 0 ? next : s.length);
writeFileSync(ep, s);
console.log('temu platforms+editorial patched');
