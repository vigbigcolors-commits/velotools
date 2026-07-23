/**
 * VeloTools PSEO State Matrix — Zod schema
 *
 * Axes: Profession × Tool × Variant × Default_Config × unique Editorial
 * .strict() rejects unknown keys (XSS / prototype pollution).
 */
import { z } from 'zod';

export const ProfessionSlug = z.enum([
  'backend-developer',
  'frontend-developer',
  'devops-engineer',
  'ux-designer',
  'ui-designer',
  'copywriter',
  'content-writer',
  'product-manager',
  'data-analyst',
  'qa-engineer',
  'student',
  'freelancer',
  'seo-specialist',
  'mobile-developer',
  'sysadmin',
]);

export const ToolSlug = z.enum(['focus-room']);

export const VariantSlug = z
  .enum([
    'ultradian',
    'sprint',
    'exam',
    'research',
    'oncall',
    'css',
    'sql',
    'roadmap',
    'regression',
    'blog',
    'deadline',
    'briefs',
    'debug',
    'docs',
    'critique',
  ])
  .optional();

export const SoundPreset = z.enum([
  'none',
  'rain',
  'lofi',
  'cafe',
  'forest',
  'fire',
  'ocean',
]);

export const ThemePreset = z.enum(['teal', 'midnight', 'amber', 'jade']);

export const TimerConfigSchema = z
  .object({
    focusMinutes: z.number().int().min(5).max(90),
    shortBreakMinutes: z.number().int().min(1).max(30),
    longBreakMinutes: z.number().int().min(5).max(45),
  })
  .strict();

export const DefaultConfigSchema = z
  .object({
    timers: TimerConfigSchema,
    soundPreset: SoundPreset,
    volume: z.number().min(0).max(1),
    theme: ThemePreset,
  })
  .strict();

const SafeText = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[^<>{}`]*$/, 'HTML/script characters are not allowed');

const SafeLongText = z
  .string()
  .min(1)
  .max(320)
  .regex(/^[^<>{}`]*$/, 'HTML/script characters are not allowed');

/** Longer body copy for unique editorial — still no HTML. */
const SafeBody = z
  .string()
  .min(40)
  .max(900)
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
    faqs: z.array(FaqItemSchema).min(2).max(4),
  })
  .strict();

export const MatrixEntrySchema = z
  .object({
    id: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'id must be kebab-case')
      .max(80),
    profession: ProfessionSlug,
    professionLabel: SafeText,
    tool: ToolSlug,
    toolLabel: SafeText,
    variant: VariantSlug,
    title: SafeText,
    description: SafeLongText,
    h1: SafeText,
    intentBanner: SafeText,
    config: DefaultConfigSchema,
    editorial: EditorialSchema,
  })
  .strict();

export const MatrixSchema = z.array(MatrixEntrySchema).min(1).max(10000);

function norm(s) {
  return String(s).toLowerCase().replace(/\s+/g, ' ').trim();
}

function assertUnique(set, value, field, id) {
  const key = norm(value);
  if (!key) throw new Error(`Empty ${field} (uniqueness required): ${id}`);
  if (set.has(key)) {
    throw new Error(`Duplicate ${field} (every page must be unique at any scale): ${id}`);
  }
  set.add(key);
}

/**
 * HARD RULE: at 30, 2000, or 10000 pages — every URL must be unique.
 * Duplicate SEO copy = build failure (doorway / scaled-content risk).
 * @param {unknown} data
 * @returns {z.infer<typeof MatrixSchema>}
 */
export function parseMatrix(data) {
  const list = MatrixSchema.parse(data);
  const routeKeys = new Set();
  const titles = new Set();
  const h1s = new Set();
  const descriptions = new Set();
  const banners = new Set();
  const leads = new Set();
  const h2s = new Set();
  const whys = new Set();
  const tips = new Set();
  const faqQuestions = new Set();
  const stateFingerprints = new Set();

  for (const e of list) {
    const key = routeKey(e.profession, e.tool, e.variant);
    if (routeKeys.has(key)) throw new Error(`Duplicate matrix route: ${key}`);
    routeKeys.add(key);

    assertUnique(titles, e.title, 'title', e.id);
    assertUnique(h1s, e.h1, 'h1', e.id);
    assertUnique(descriptions, e.description, 'description', e.id);
    assertUnique(banners, e.intentBanner, 'intentBanner', e.id);
    assertUnique(leads, e.editorial.lead, 'editorial.lead', e.id);
    assertUnique(h2s, e.editorial.h2, 'editorial.h2', e.id);
    assertUnique(whys, e.editorial.whyPreset, 'editorial.whyPreset', e.id);
    assertUnique(tips, e.editorial.workflowTip, 'editorial.workflowTip', e.id);

    if (norm(e.h1) === norm(e.editorial.h2)) {
      throw new Error(`h1 and h2 must differ (uniqueness within page): ${e.id}`);
    }

    for (const faq of e.editorial.faqs) {
      assertUnique(faqQuestions, faq.question, 'faq.question', e.id);
    }

    // State fingerprint: same profession+tool+timers+theme+sound = duplicate experience
    const stateKey = [
      e.profession,
      e.tool,
      e.config.timers.focusMinutes,
      e.config.timers.shortBreakMinutes,
      e.config.timers.longBreakMinutes,
      e.config.theme,
      e.config.soundPreset,
    ].join('|');
    if (stateFingerprints.has(stateKey)) {
      throw new Error(
        `Duplicate widget state for same profession/tool (page must change utility state): ${e.id}`,
      );
    }
    stateFingerprints.add(stateKey);
  }
  return list;
}

export function routeKey(profession, tool, variant) {
  return variant ? `${profession}/${tool}/${variant}` : `${profession}/${tool}`;
}

export function resolveEntry(matrix, profession, tool, variant) {
  const prof = ProfessionSlug.safeParse(profession);
  const toolOk = ToolSlug.safeParse(tool);
  if (!prof.success || !toolOk.success) return null;

  let variantVal;
  if (variant) {
    const v = VariantSlug.safeParse(variant);
    if (!v.success || v.data === undefined) return null;
    variantVal = v.data;
  }

  const list = parseMatrix(matrix);
  return (
    list.find((e) => {
      if (e.profession !== prof.data || e.tool !== toolOk.data) return false;
      if (variantVal) return e.variant === variantVal;
      return !e.variant;
    }) ?? null
  );
}

export function entryPath(entry) {
  return `/tools/${routeKey(entry.profession, entry.tool, entry.variant)}/`;
}
