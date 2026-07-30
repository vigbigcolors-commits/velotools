/**
 * Validate intent + platform fact matrix before build.
 */
import { getPlatform } from '../seo/fact-copy.mjs';
import { loadAllIntents } from './intents.mjs';
import { COMPRESS_PDF_EDITORIALS } from '../seo-data/intents/compress-pdf-editorials.mjs';

const REQUIRED_WIDGET = {
  compress: ['preset', 'dpi', 'quality', 'maxOutputBytes'],
  'image-resize': ['outputWidth', 'outputHeight', 'quality', 'maxOutputBytes'],
};

export function validateAll() {
  const errors = [];
  const intents = loadAllIntents();
  const faqQuestions = new Map();
  const titles = new Map();
  const h1s = new Map();

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

    if (intent.tool === 'compress-pdf' || intent.toolMode === 'compress') {
      const ed = COMPRESS_PDF_EDITORIALS[intent.slug];
      if (!ed) {
        errors.push(`${intent.slug}: missing handcrafted editorial in compress-pdf-editorials.mjs`);
      } else {
        if (!ed.securityH2 || !ed.securityHtml || !ed.stepsH2 || !ed.deepH2 || !ed.deepHtml) {
          errors.push(`${intent.slug}: editorial incomplete (security/steps/deep)`);
        }
        if (!Array.isArray(ed.faq) || ed.faq.length < 4) {
          errors.push(`${intent.slug}: editorial FAQ must have ≥4 unique Q&As`);
        } else {
          for (const item of ed.faq) {
            const q = (item.q || '').trim().toLowerCase();
            if (!q) errors.push(`${intent.slug}: empty FAQ question`);
            else if (faqQuestions.has(q)) {
              errors.push(
                `${intent.slug}: duplicate FAQ question with ${faqQuestions.get(q)}: "${item.q}"`,
              );
            } else faqQuestions.set(q, intent.slug);
          }
        }
        for (const step of ed.steps || []) {
          if (String(step).length < 40) {
            errors.push(`${intent.slug}: step too short / generic`);
          }
        }
      }
    }

    if (intent.title) {
      const t = intent.title.trim().toLowerCase();
      if (titles.has(t)) errors.push(`${intent.slug}: duplicate title with ${titles.get(t)}`);
      else titles.set(t, intent.slug);
    }
    if (intent.h1) {
      const h = intent.h1.trim().toLowerCase();
      if (h1s.has(h)) errors.push(`${intent.slug}: duplicate h1 with ${h1s.get(h)}`);
      else h1s.set(h, intent.slug);
    }
  }

  return { ok: !errors.length, errors, count: intents.length };
}
