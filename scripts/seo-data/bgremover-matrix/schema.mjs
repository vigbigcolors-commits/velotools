/**
 * BG Remover PSEO matrix — Zod schema
 * Privacy-first SSR shell: only allowlisted config reaches the client.
 * Anti-doorway: every page must have unique title/h1/description/lead/FAQ + distinct widget state.
 */
import { z } from 'zod';

export const UseCaseSlug = z.enum([
  'ecommerce',
  'portraits',
  'etsy',
  'amazon',
  'pets',
  'headshots',
  'jewelry',
  'apparel',
  'social',
  'transparent-png',
  'cars',
  'food',
  'real-estate',
  'id-photos',
  'stickers',
  'youtube-thumbs',
  'marketplace-white',
  'screenshots',
]);

export const BgPreset = z.enum([
  'transparent',
  '#ffffff',
  '#111111',
  '#C4A0D4',
  '#C04878',
  '#7C3480',
  '#5EE0B8',
  '#F0DCE8',
  '#1C2E3E',
  'grad',
]);

export const ExportHint = z.enum(['png', 'jpg-white', 'webp', 'jpg-bg']);

const SafeText = z
  .string()
  .min(1)
  .max(280)
  .regex(/^[^<>{}`]*$/, 'HTML/script characters are not allowed');

const SafeLongText = z
  .string()
  .min(1)
  .max(600)
  .regex(/^[^<>{}`]*$/, 'HTML/script characters are not allowed');

const SafeBody = z
  .string()
  .min(40)
  .max(2000)
  .regex(/^[^<>{}`]*$/, 'HTML/script characters are not allowed');

export const FaqItemSchema = z
  .object({
    question: SafeText,
    answer: SafeBody,
  })
  .strict();

export const EditorialSchema = z
  .object({
    eyebrow: SafeText,
    h2: SafeText,
    lead: SafeBody,
    whyPreset: SafeBody,
    workflowTip: SafeBody,
    privacyNote: SafeBody,
    scenarioH2: SafeText.min(1),
    scenarioBody: SafeBody,
    edgesH2: SafeText.min(1),
    edgesBody: SafeBody,
    faqs: z.array(FaqItemSchema).min(5).max(8),
  })
  .strict();

/** Widget state baked into SSR — never invented from URL on the client. */
export const WidgetConfigSchema = z
  .object({
    defaultBg: BgPreset,
    bgSwatchIndex: z.number().int().min(0).max(9),
    exportHint: ExportHint,
    suggestRefine: z.boolean(),
    tipLabel: SafeText,
  })
  .strict();

export const MatrixEntrySchema = z
  .object({
    id: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'id must be kebab-case')
      .max(80),
    useCase: UseCaseSlug,
    useCaseLabel: SafeText,
    title: SafeText,
    description: SafeLongText,
    h1: SafeText,
    heroSub: SafeLongText,
    intentBanner: SafeText,
    config: WidgetConfigSchema,
    editorial: EditorialSchema,
  })
  .strict();

export const MatrixSchema = z.array(MatrixEntrySchema).min(10).max(30);

function norm(s) {
  return String(s).toLowerCase().replace(/\s+/g, ' ').trim();
}

function assertUnique(set, value, field, id) {
  const key = norm(value);
  if (!key) throw new Error(`Empty ${field}: ${id}`);
  if (set.has(key)) {
    throw new Error(`Duplicate ${field} (anti-doorway): ${id}`);
  }
  set.add(key);
}

/**
 * HARD RULE: every URL unique at any scale — duplicates fail the build.
 * @param {unknown} data
 */
export function parseMatrix(data) {
  const list = MatrixSchema.parse(data);
  const routes = new Set();
  const titles = new Set();
  const h1s = new Set();
  const descriptions = new Set();
  const banners = new Set();
  const leads = new Set();
  const h2s = new Set();
  const scenarioH2s = new Set();
  const edgesH2s = new Set();
  const whys = new Set();
  const tips = new Set();
  const privacy = new Set();
  const faqQ = new Set();
  const states = new Set();

  for (const e of list) {
    if (routes.has(e.useCase)) throw new Error(`Duplicate useCase route: ${e.useCase}`);
    routes.add(e.useCase);

    assertUnique(titles, e.title, 'title', e.id);
    assertUnique(h1s, e.h1, 'h1', e.id);
    assertUnique(descriptions, e.description, 'description', e.id);
    assertUnique(banners, e.intentBanner, 'intentBanner', e.id);
    assertUnique(leads, e.editorial.lead, 'editorial.lead', e.id);
    assertUnique(h2s, e.editorial.h2, 'editorial.h2', e.id);
    assertUnique(scenarioH2s, e.editorial.scenarioH2, 'editorial.scenarioH2', e.id);
    assertUnique(edgesH2s, e.editorial.edgesH2, 'editorial.edgesH2', e.id);
    assertUnique(whys, e.editorial.whyPreset, 'editorial.whyPreset', e.id);
    assertUnique(tips, e.editorial.workflowTip, 'editorial.workflowTip', e.id);
    assertUnique(privacy, e.editorial.privacyNote, 'editorial.privacyNote', e.id);

    for (const f of e.editorial.faqs) {
      assertUnique(faqQ, f.question, 'faq.question', e.id);
    }

    const fp = [
      e.config.defaultBg,
      e.config.bgSwatchIndex,
      e.config.exportHint,
      e.config.suggestRefine ? '1' : '0',
      e.config.tipLabel,
    ].join('|');
    if (states.has(fp)) {
      throw new Error(`Duplicate widget state fingerprint (anti-doorway): ${e.id}`);
    }
    states.add(fp);
  }

  return list;
}

export function entryPath(entry) {
  return `/bgremover/for-${entry.useCase}/`;
}
