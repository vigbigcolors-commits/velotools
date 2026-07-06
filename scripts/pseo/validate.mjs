/**
 * Validate intent + platform fact matrix before build.
 */
import { getPlatform } from '../seo/fact-copy.mjs';
import { loadAllIntents } from './intents.mjs';

const REQUIRED_WIDGET = {
  compress: ['preset', 'dpi', 'quality', 'maxOutputBytes'],
  'image-resize': ['outputWidth', 'outputHeight', 'quality', 'maxOutputBytes'],
};

export function validateAll() {
  const errors = [];
  const intents = loadAllIntents();

  for (const intent of intents) {
    if (!intent.slug || !intent.tool || !intent.platform) {
      errors.push(`${intent.slug || '(no slug)'}: missing slug, tool, or platform`);
      continue;
    }
    if (!/^[a-z0-9-]+$/.test(intent.slug)) {
      errors.push(`${intent.slug}: slug must be kebab-case`);
    }
    const plat = getPlatform(intent.platform);
    if (!plat) {
      errors.push(`${intent.slug}: unknown platform "${intent.platform}"`);
    }
    const mode = intent.toolMode === 'compress' ? 'compress' : 'image-resize';
    const req = REQUIRED_WIDGET[mode] || [];
    for (const key of req) {
      if (intent.widget?.[key] == null && key !== 'maxOutputBytes') {
        errors.push(`${intent.slug}: widget.${key} required`);
      }
      if (key === 'maxOutputBytes' && !intent.widget?.maxOutputBytes && plat) {
        const max = plat.max_attachment_bytes || plat.max_output_bytes;
        if (!max) errors.push(`${intent.slug}: widget.maxOutputBytes or platform max bytes`);
      }
    }
    if (!intent.intentBanner) {
      errors.push(`${intent.slug}: intentBanner required (visible state marker)`);
    }
    if (!intent.publishStatus) {
      errors.push(`${intent.slug}: publishStatus required (draft|built|published)`);
    }
  }

  return { ok: !errors.length, errors, count: intents.length };
}
