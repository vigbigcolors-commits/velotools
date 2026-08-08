/**
 * Validate intent + platform + handcrafted editorial anti-doorway gate.
 */
import { getPlatform, isImageIntent } from '../seo/fact-copy.mjs';
import { loadAllIntents } from './intents.mjs';
import { COMPRESS_PDF_EDITORIALS } from '../seo-data/intents/compress-pdf-editorials.mjs';
import { IMAGE_RESIZER_EDITORIALS } from '../seo-data/intents/image-resizer-editorials.mjs';
import {
  MIN_EDITORIAL_WORDS,
  MIN_FAQ,
  MIN_H2,
  handcraftedPlainText,
  wordCount,
  extractParagraphs,
  normalizeParagraph,
  widgetFingerprint,
} from './lib/editorial-metrics.mjs';

const REQUIRED_WIDGET = {
  compress: ['preset', 'dpi', 'quality', 'maxOutputBytes'],
  'image-resize': ['outputWidth', 'outputHeight', 'quality', 'maxOutputBytes'],
};

function countH2(ed) {
  let n = 0;
  if (ed.securityH2) n++;
  if (ed.problemH2) n++;
  if (ed.stepsH2) n++;
  if (ed.specsH2) n++;
  if (ed.presetH2) n++;
  if (ed.deepH2) n++;
  if (ed.faqH2) n++;
  return n;
}

function validateHandcrafted(slug, ed, faqQuestions, h2Global, paragraphOwners, errors) {
  if (!ed.securityH2 || !ed.securityHtml || !ed.stepsH2 || !ed.deepH2 || !ed.deepHtml) {
    errors.push(`${slug}: editorial incomplete (security/steps/deep)`);
  }
  if (!ed.problemH2 || !ed.problemHtml || !ed.presetH2 || !ed.presetHtml || !ed.specsH2) {
    errors.push(`${slug}: editorial needs problem + preset + specs sections (anti-doorway depth)`);
  }
  const h2n = countH2(ed);
  if (h2n < MIN_H2) errors.push(`${slug}: need ≥${MIN_H2} H2 headings (have ${h2n})`);

  for (const h2 of [
    ed.securityH2,
    ed.problemH2,
    ed.stepsH2,
    ed.specsH2,
    ed.presetH2,
    ed.deepH2,
    ed.faqH2,
  ]) {
    if (!h2) continue;
    const k = h2.trim().toLowerCase();
    if (h2Global.has(k)) errors.push(`${slug}: duplicate H2 with ${h2Global.get(k)}: "${h2}"`);
    else h2Global.set(k, slug);
  }

  if (!Array.isArray(ed.faq) || ed.faq.length < MIN_FAQ) {
    errors.push(`${slug}: editorial FAQ must have ≥${MIN_FAQ} unique Q&As`);
  } else {
    for (const item of ed.faq) {
      const q = (item.q || '').trim().toLowerCase();
      if (!q) errors.push(`${slug}: empty FAQ question`);
      else if (faqQuestions.has(q)) {
        errors.push(`${slug}: duplicate FAQ question with ${faqQuestions.get(q)}: "${item.q}"`);
      } else faqQuestions.set(q, slug);

      const a = normalizeParagraph(item.a || '');
      if (a.split(' ').length >= 8) {
        if (paragraphOwners.has(a)) {
          errors.push(
            `${slug}: duplicate FAQ answer paragraph with ${paragraphOwners.get(a)}`,
          );
        } else paragraphOwners.set(a, slug);
      }
    }
  }

  for (const step of ed.steps || []) {
    if (String(step).length < 40) errors.push(`${slug}: step too short / generic`);
  }

  const plain = handcraftedPlainText(ed);
  const wc = wordCount(plain);
  if (wc < MIN_EDITORIAL_WORDS) {
    errors.push(`${slug}: editorial has ${wc} words (need ≥${MIN_EDITORIAL_WORDS})`);
  }

  for (const html of [ed.securityHtml, ed.problemHtml, ed.presetHtml, ed.deepHtml]) {
    for (const p of extractParagraphs(html)) {
      if (paragraphOwners.has(p)) {
        errors.push(`${slug}: duplicate paragraph with ${paragraphOwners.get(p)}`);
      } else paragraphOwners.set(p, slug);
    }
  }
}

export function validateAll() {
  const errors = [];
  const intents = loadAllIntents();
  const faqQuestions = new Map();
  const titles = new Map();
  const h1s = new Map();
  const descriptions = new Map();
  const leads = new Map();
  const h2Global = new Map();
  const paragraphOwners = new Map();
  const fingerprints = new Map();

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
    if (!intent.description) {
      errors.push(`${intent.slug}: description required`);
    }
    if (!intent.heroLead) {
      errors.push(`${intent.slug}: heroLead required`);
    }

    const isPdf = intent.tool === 'compress-pdf' || intent.toolMode === 'compress';
    const isImg = isImageIntent(intent);

    if (isPdf) {
      const ed = COMPRESS_PDF_EDITORIALS[intent.slug];
      if (!ed) errors.push(`${intent.slug}: missing handcrafted editorial in compress-pdf-editorials.mjs`);
      else validateHandcrafted(intent.slug, ed, faqQuestions, h2Global, paragraphOwners, errors);
    }

    if (isImg) {
      const ed = IMAGE_RESIZER_EDITORIALS[intent.slug];
      if (!ed) {
        errors.push(
          `${intent.slug}: missing handcrafted editorial in image-resizer-editorials.mjs (template fallback banned)`,
        );
      } else validateHandcrafted(intent.slug, ed, faqQuestions, h2Global, paragraphOwners, errors);
    }

    const fp = widgetFingerprint(intent);
    if (fingerprints.has(fp)) {
      errors.push(
        `${intent.slug}: duplicate widget fingerprint with ${fingerprints.get(fp)} (${fp})`,
      );
    } else fingerprints.set(fp, intent.slug);

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
    if (intent.description) {
      const d = intent.description.trim().toLowerCase();
      if (descriptions.has(d)) {
        errors.push(`${intent.slug}: duplicate description with ${descriptions.get(d)}`);
      } else descriptions.set(d, intent.slug);
    }
    if (intent.heroLead) {
      const l = intent.heroLead.trim().toLowerCase();
      if (leads.has(l)) errors.push(`${intent.slug}: duplicate heroLead with ${leads.get(l)}`);
      else leads.set(l, intent.slug);
    }
  }

  return { ok: !errors.length, errors, count: intents.length };
}
