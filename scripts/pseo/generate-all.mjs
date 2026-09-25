#!/usr/bin/env node
/**
 * Deterministic generated-page orchestration.
 * Generation owns route HTML only; publication state and sitemap remain separate.
 */
import { execFileSync, spawnSync } from 'child_process';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';
import { buildPage } from './build.mjs';
import { renderBgremoverPage } from './bgremover-matrix-build.mjs';
import { renderMatrixPage } from './matrix-build.mjs';
import { loadAllIntents } from './intents.mjs';
import { validateAll } from './validate.mjs';
import {
  MATRIX as BG_MATRIX,
  entryPath as bgEntryPath,
} from '../seo-data/bgremover-matrix/index.mjs';
import { MATRIX as FOCUS_MATRIX, entryPath as focusEntryPath } from '../seo-data/matrix/index.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const prune = args.has('--prune');

if (dryRun && prune) throw new Error('--dry-run and --prune cannot be combined');

function toRelativePath(absolutePath) {
  const outputPath = relative(root, absolutePath).replace(/\\/g, '/');
  if (!outputPath || outputPath.startsWith('../') || outputPath.includes('/../')) {
    throw new Error(`Generated output escapes project root: ${absolutePath}`);
  }
  return outputPath;
}

function ownerForPath(outputPath) {
  if (/^compress-pdf-for-[a-z0-9-]+\/index\.html$/.test(outputPath)) return 'intent';
  if (/^image-resizer-for-[a-z0-9-]+\/index\.html$/.test(outputPath)) return 'intent';
  if (/^tools\/[a-z0-9-]+\/focus-room(?:\/[a-z0-9-]+)?\/index\.html$/.test(outputPath)) {
    return 'focus';
  }
  if (/^bgremover\/for-[a-z0-9-]+\/index\.html$/.test(outputPath)) return 'bgremover';
  return null;
}

function buildInventory() {
  const intents = loadAllIntents();
  const outputs = [
    ...intents.map((intent) => ({
      family: 'intent',
      source: intent.slug,
      path: toRelativePath(join(root, intent.slug, 'index.html')),
      value: intent,
    })),
    ...FOCUS_MATRIX.map((entry) => ({
      family: 'focus',
      source: entry.id,
      path: toRelativePath(join(root, focusEntryPath(entry), 'index.html')),
      value: entry,
    })),
    ...BG_MATRIX.map((entry) => ({
      family: 'bgremover',
      source: entry.id,
      path: toRelativePath(join(root, bgEntryPath(entry), 'index.html')),
      value: entry,
    })),
  ];

  const seen = new Map();
  for (const output of outputs) {
    const owner = ownerForPath(output.path);
    if (owner !== output.family) {
      throw new Error(`Output is outside ${output.family} namespace: ${output.path}`);
    }
    if (seen.has(output.path)) {
      throw new Error(
        `Generated output collision: ${output.path} (${seen.get(output.path)} and ${output.source})`
      );
    }
    seen.set(output.path, output.source);
  }
  return { intents, outputs, expectedPaths: new Set(seen.keys()) };
}

function trackedGeneratedPaths() {
  const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' })
    .split('\0')
    .filter(Boolean);
  return tracked.filter((path) => ownerForPath(path));
}

function gitPathHasChanges(args, outputPath) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  if (result.error || result.status == null || result.status > 1) {
    throw new Error(`Could not inspect Git changes for ${outputPath}: ${result.stderr || result.error}`);
  }
  return result.status === 1;
}

function prepareStalePrune(expectedPaths) {
  const stale = trackedGeneratedPaths().filter((path) => !expectedPaths.has(path));
  if (!stale.length) return [];
  if (!prune) {
    throw new Error(
      `Stale generated outputs require explicit --prune:\n${stale.map((path) => `  ${path}`).join('\n')}`
    );
  }

  for (const outputPath of stale) {
    const owner = ownerForPath(outputPath);
    const absolutePath = join(root, outputPath);
    if (!owner || !outputPath.endsWith('/index.html') || !existsSync(absolutePath)) {
      throw new Error(`Unsafe stale output deletion refused: ${outputPath}`);
    }
    if (gitPathHasChanges(['diff', '--quiet', '--', outputPath], outputPath)) {
      throw new Error(`Refusing to prune locally modified generated output: ${outputPath}`);
    }
    if (gitPathHasChanges(['diff', '--cached', '--quiet', '--', outputPath], outputPath)) {
      throw new Error(`Refusing to prune staged generated output: ${outputPath}`);
    }
  }
  return stale;
}

function validateInputs() {
  const intentValidation = validateAll();
  if (!intentValidation.ok) {
    throw new Error(
      `Intent validation failed:\n${intentValidation.errors.map((error) => `  ${error}`).join('\n')}`
    );
  }
  return intentValidation.count;
}

function prepareOutputs(inventory) {
  return inventory.outputs.map((output) => {
    let rendered;
    if (output.family === 'intent') {
      rendered = {
        outFile: join(root, output.path),
        html: buildPage(output.value),
      };
    } else if (output.family === 'focus') {
      rendered = renderMatrixPage(output.value);
    } else if (output.family === 'bgremover') {
      rendered = renderBgremoverPage(output.value);
    } else {
      throw new Error(`Unsupported generated family: ${output.family}`);
    }

    if (toRelativePath(rendered.outFile) !== output.path) {
      throw new Error(`Renderer output path mismatch for ${output.source}: ${rendered.outFile}`);
    }
    return { ...output, outFile: rendered.outFile, html: rendered.html };
  });
}

function applyPreparedOutputs(prepared, stale) {
  for (const output of prepared) {
    mkdirSync(dirname(output.outFile), { recursive: true });
    writeFileSync(output.outFile, output.html, 'utf8');
  }
  for (const outputPath of stale) unlinkSync(join(root, outputPath));
}

export function generateAll() {
  const intentCount = validateInputs();
  const inventory = buildInventory();
  const stale = prepareStalePrune(inventory.expectedPaths);
  const prepared = prepareOutputs(inventory);

  if (!dryRun) applyPreparedOutputs(prepared, stale);

  return {
    dryRun,
    pruned: stale,
    intentCount,
    focusCount: FOCUS_MATRIX.length,
    bgremoverCount: BG_MATRIX.length,
    outputCount: prepared.length,
  };
}

if (process.argv[1] && /generate-all\.mjs$/.test(process.argv[1].replace(/\\/g, '/'))) {
  console.log(JSON.stringify(generateAll(), null, 2));
}
