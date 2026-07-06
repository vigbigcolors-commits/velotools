#!/usr/bin/env node
/**
 * VeloTools pSEO daily pipeline
 * ─────────────────────────────
 * Day cycle:
 *   1. Add facts → scripts/seo-data/platforms*.json
 *   2. Add intent → scripts/seo-data/intents/*.json (publishStatus: "draft")
 *   3. npm run pseo:validate
 *   4. npm run pseo:build        → draft → built (HTML on disk)
 *   5. npm run pseo:publish      → built → sitemap (max 15/day)
 *
 * Commands:
 *   node scripts/pseo-pipeline.mjs status
 *   node scripts/pseo-pipeline.mjs validate
 *   node scripts/pseo-pipeline.mjs build [--slug=x] [--dry-run]
 *   node scripts/pseo-pipeline.mjs publish [--limit=15]
 *   node scripts/pseo-pipeline.mjs daily   → validate + build + publish
 */
import { loadAllIntents, updateIntentStatus } from './pseo/intents.mjs';
import { validateAll } from './pseo/validate.mjs';
import { writePage } from './pseo/build.mjs';
import { publishBatch } from './pseo/publish.mjs';

const args = process.argv.slice(2);
const cmd = args[0] || 'status';
const slugArg = args.find((a) => a.startsWith('--slug='));
const targetSlug = slugArg ? slugArg.split('=')[1] : null;
const dryRun = args.includes('--dry-run');
const limitArg = args.find((a) => a.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : undefined;

function status() {
  const intents = loadAllIntents();
  const by = { draft: 0, built: 0, published: 0 };
  for (const i of intents) by[i.publishStatus] = (by[i.publishStatus] || 0) + 1;
  console.log('\nIntent queue');
  console.log('  draft    ', by.draft || 0);
  console.log('  built    ', by.built || 0, '← ready for sitemap');
  console.log('  published', by.published || 0);
  console.log('\nSlug                          tool              status');
  console.log('─'.repeat(62));
  for (const i of intents) {
    console.log(
      `${i.slug.padEnd(30)}${(i.tool || '').padEnd(18)}${i.publishStatus || '?'}`,
    );
  }
  console.log('');
}

async function build() {
  const v = validateAll();
  if (!v.ok) {
    console.error('Validation failed:');
    v.errors.forEach((e) => console.error('  ✗', e));
    process.exit(1);
  }
  let intents = loadAllIntents().filter((i) => i.publishStatus === 'draft' || i.publishStatus === 'built');
  if (targetSlug) intents = intents.filter((i) => i.slug === targetSlug);
  if (!intents.length) {
    console.log('Nothing to build (draft or built).');
    return;
  }
  for (const intent of intents) {
    writePage(intent, dryRun);
    if (!dryRun && intent.publishStatus === 'draft') {
      updateIntentStatus(intent.slug, 'built');
    }
  }
  console.log(`\nBuild complete: ${intents.length} page(s).`);
}

function validate() {
  const v = validateAll();
  if (v.ok) console.log(`OK — ${v.count} intents validated.`);
  else v.errors.forEach((e) => console.error('✗', e));
  process.exit(v.ok ? 0 : 1);
}

function publish() {
  const r = publishBatch(limit);
  console.log(r.message);
  if (r.published.length) r.published.forEach((s) => console.log('  +', s));
}

switch (cmd) {
  case 'status':
    status();
    break;
  case 'validate':
    validate();
    break;
  case 'build':
    await build();
    break;
  case 'publish':
    publish();
    break;
  case 'daily':
    validate();
    await build();
    publish();
    break;
  default:
    console.log('Usage: pseo-pipeline.mjs [status|validate|build|publish|daily]');
    process.exit(1);
}
