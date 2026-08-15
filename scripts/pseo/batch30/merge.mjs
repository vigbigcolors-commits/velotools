/**
 * Merge batch-30 artifacts into live seo-data sources.
 * Prerequisites: pdf-editorials-new.mjs, platforms-image-new.json,
 * intents-image-new.json, image-editorials-new.mjs, bg-new.mjs,
 * _platforms-pdf.json, _intents-pdf.json
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const batch = join(root, 'scripts/pseo/batch30');

function must(p) {
  if (!existsSync(p)) throw new Error('Missing ' + p);
  return p;
}

function stringifyObj(v) {
  return JSON.stringify(v, null, 2)
    .split('\n')
    .map((line, i) => (i === 0 ? line : '  ' + line))
    .join('\n');
}

// PDF platforms + intents
const pdfPlatforms = JSON.parse(readFileSync(must(join(batch, '_platforms-pdf.json')), 'utf8'));
const pdfIntentsRaw = JSON.parse(readFileSync(must(join(batch, '_intents-pdf.json')), 'utf8'));

const platformsPath = join(root, 'scripts/seo-data/platforms.json');
const platforms = JSON.parse(readFileSync(platformsPath, 'utf8'));
Object.assign(platforms, pdfPlatforms);
writeFileSync(platformsPath, JSON.stringify(platforms, null, 2) + '\n');

const pdfIntentsPath = join(root, 'scripts/seo-data/intents/compress-pdf.json');
const pdfIntents = JSON.parse(readFileSync(pdfIntentsPath, 'utf8'));
const existingPdf = new Set(pdfIntents.map((i) => i.slug));
for (const row of pdfIntentsRaw) {
  if (existingPdf.has(row.slug)) continue;
  pdfIntents.push({
    ...row,
    tool: 'compress-pdf',
    toolMode: 'compress',
    formatIn: 'pdf',
    formatOut: 'pdf',
    publishStatus: 'draft',
  });
}
writeFileSync(pdfIntentsPath, JSON.stringify(pdfIntents, null, 2) + '\n');

const { NEW_PDF_EDITORIALS } = await import(pathToFileURL(must(join(batch, 'pdf-editorials-new.mjs'))).href);
const compressEdFile = join(root, 'scripts/seo-data/intents/compress-pdf-editorials.mjs');
let compressEdSrc = readFileSync(compressEdFile, 'utf8');
if (!compressEdSrc.includes('compress-pdf-for-yahoo-mail')) {
  const insert = Object.entries(NEW_PDF_EDITORIALS)
    .map(([k, v]) => `  '${k}': ${stringifyObj(v)},`)
    .join('\n\n');
  compressEdSrc = compressEdSrc.replace(/\n\};\s*$/, `\n\n${insert}\n};\n`);
  writeFileSync(compressEdFile, compressEdSrc);
}

// Image
const imgPlatforms = JSON.parse(readFileSync(must(join(batch, 'platforms-image-new.json')), 'utf8'));
const platformsImagePath = join(root, 'scripts/seo-data/platforms-image.json');
const platformsImage = JSON.parse(readFileSync(platformsImagePath, 'utf8'));
Object.assign(platformsImage, imgPlatforms);
writeFileSync(platformsImagePath, JSON.stringify(platformsImage, null, 2) + '\n');

const imgIntentsNew = JSON.parse(readFileSync(must(join(batch, 'intents-image-new.json')), 'utf8'));
const imgIntentsPath = join(root, 'scripts/seo-data/intents/image-resizer.json');
const imgIntents = JSON.parse(readFileSync(imgIntentsPath, 'utf8'));
const existingImg = new Set(imgIntents.map((i) => i.slug));
for (const row of imgIntentsNew) {
  if (existingImg.has(row.slug)) continue;
  imgIntents.push(row);
}
writeFileSync(imgIntentsPath, JSON.stringify(imgIntents, null, 2) + '\n');

const { NEW_IMAGE_EDITORIALS } = await import(
  pathToFileURL(must(join(batch, 'image-editorials-new.mjs'))).href
);
const imageEdFile = join(root, 'scripts/seo-data/intents/image-resizer-editorials.mjs');
let imageEdSrc = readFileSync(imageEdFile, 'utf8');
if (!imageEdSrc.includes('image-resizer-for-target')) {
  const insert = Object.entries(NEW_IMAGE_EDITORIALS)
    .map(([k, v]) => `  '${k}': ${stringifyObj(v)},`)
    .join('\n\n');
  imageEdSrc = imageEdSrc.replace(/\n\};\s*$/, `\n\n${insert}\n};\n`);
  writeFileSync(imageEdFile, imageEdSrc);
}

// BG
const { NEW_BG_USE_CASES, NEW_BG_ENTRIES, NEW_BG_EDITORIALS } = await import(
  pathToFileURL(must(join(batch, 'bg-new.mjs'))).href
);

const schemaPath = join(root, 'scripts/seo-data/bgremover-matrix/schema.mjs');
let schema = readFileSync(schemaPath, 'utf8');
for (const uc of NEW_BG_USE_CASES) {
  if (!schema.includes(`'${uc}'`)) {
    schema = schema.replace(`'screenshots',\n]);`, `'screenshots',\n  '${uc}',\n]);`);
  }
}
writeFileSync(schemaPath, schema);

const entriesPath = join(root, 'scripts/seo-data/bgremover-matrix/entries.mjs');
let entriesSrc = readFileSync(entriesPath, 'utf8');
if (!entriesSrc.includes('bgremover-logos')) {
  const block = NEW_BG_ENTRIES.map((e) => '  ' + JSON.stringify(e, null, 2).replace(/\n/g, '\n  ')).join(
    ',\n',
  );
  entriesSrc = entriesSrc.replace(/\];\s*$/, `,\n${block}\n];\n`);
  // fix double comma if any
  entriesSrc = entriesSrc.replace(/,\s*,/g, ',');
  writeFileSync(entriesPath, entriesSrc);
}

const bgEdPath = join(root, 'scripts/seo-data/bgremover-matrix/editorials.mjs');
let bgEd = readFileSync(bgEdPath, 'utf8');
if (!bgEd.includes('bgremover-logos')) {
  const insert = Object.entries(NEW_BG_EDITORIALS)
    .map(([k, v]) => `  '${k}': ${stringifyObj(v)},`)
    .join('\n');
  bgEd = bgEd.replace(/\n\};\s*$/, `\n${insert}\n};\n`);
  writeFileSync(bgEdPath, bgEd);
}

console.log('OK merged', {
  pdfPlatforms: Object.keys(pdfPlatforms).length,
  pdfEditorials: Object.keys(NEW_PDF_EDITORIALS).length,
  imgPlatforms: Object.keys(imgPlatforms).length,
  imgEditorials: Object.keys(NEW_IMAGE_EDITORIALS).length,
  bg: NEW_BG_ENTRIES.length,
});
