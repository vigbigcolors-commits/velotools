/**
 * Load / save intent records from scripts/seo-data/intents/*.json
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const intentsDir = join(__dirname, '..', 'seo-data', 'intents');

export function loadAllIntents() {
  const all = [];
  for (const file of readdirSync(intentsDir).filter((f) => f.endsWith('.json'))) {
    const list = JSON.parse(readFileSync(join(intentsDir, file), 'utf8'));
    for (const item of list) {
      item._sourceFile = file;
    }
    all.push(...list);
  }
  return all;
}

export function saveIntent(updated) {
  const file = join(intentsDir, updated._sourceFile);
  const list = JSON.parse(readFileSync(file, 'utf8'));
  const idx = list.findIndex((i) => i.slug === updated.slug);
  if (idx < 0) throw new Error('Intent not found: ' + updated.slug);
  const copy = { ...updated };
  delete copy._sourceFile;
  list[idx] = copy;
  writeFileSync(file, JSON.stringify(list, null, 2) + '\n');
}

export function updateIntentStatus(slug, publishStatus, extra = {}) {
  const all = loadAllIntents();
  const intent = all.find((i) => i.slug === slug);
  if (!intent) throw new Error('Unknown slug: ' + slug);
  intent.publishStatus = publishStatus;
  Object.assign(intent, extra);
  saveIntent(intent);
}
