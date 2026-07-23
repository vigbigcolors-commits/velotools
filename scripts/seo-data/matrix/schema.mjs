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

export const MatrixSchema = z.array(MatrixEntrySchema).min(1).max(500);

/**
 * @param {unknown} data
 * @returns {z.infer<typeof MatrixSchema>}
 */
export function parseMatrix(data) {
  const list = MatrixSchema.parse(data);
  const routeKeys = new Set();
  const leads = new Set();
  const h2s = new Set();
  const titles = new Set();

  for (const e of list) {
    const key = routeKey(e.profession, e.tool, e.variant);
    if (routeKeys.has(key)) throw new Error(`Duplicate matrix route: ${key}`);
    routeKeys.add(key);

    const leadKey = e.editorial.lead.toLowerCase().trim();
    if (leads.has(leadKey)) {
      throw new Error(`Duplicate editorial.lead (doorway risk): ${e.id}`);
    }
    leads.add(leadKey);

    const h2Key = e.editorial.h2.toLowerCase().trim();
    if (h2s.has(h2Key)) {
      throw new Error(`Duplicate editorial.h2 (doorway risk): ${e.id}`);
    }
    h2s.add(h2Key);

    const titleKey = e.title.toLowerCase().trim();
    if (titles.has(titleKey)) {
      throw new Error(`Duplicate title (doorway risk): ${e.id}`);
    }
    titles.add(titleKey);
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
