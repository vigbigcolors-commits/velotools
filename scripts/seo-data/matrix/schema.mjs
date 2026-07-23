/**
 * VeloTools PSEO State Matrix — Zod schema
 *
 * Axes: Profession × Tool × Variant × Default_Config
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

/** Optional third URL segment for alternate presets of the same profession×tool. */
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
  })
  .strict();

export const MatrixSchema = z.array(MatrixEntrySchema).min(1).max(500);

/**
 * @param {unknown} data
 * @returns {z.infer<typeof MatrixSchema>}
 */
export function parseMatrix(data) {
  const list = MatrixSchema.parse(data);
  const keys = new Set();
  for (const e of list) {
    const key = routeKey(e.profession, e.tool, e.variant);
    if (keys.has(key)) {
      throw new Error(`Duplicate matrix route: ${key}`);
    }
    keys.add(key);
  }
  return list;
}

/**
 * @param {string} profession
 * @param {string} tool
 * @param {string} [variant]
 */
export function routeKey(profession, tool, variant) {
  return variant ? `${profession}/${tool}/${variant}` : `${profession}/${tool}`;
}

/**
 * Resolve entry from URL segments. Rejects anything outside allowlists.
 * @param {unknown} matrix
 * @param {string} profession
 * @param {string} tool
 * @param {string} [variant]
 */
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

/**
 * @param {z.infer<typeof MatrixEntrySchema>} entry
 */
export function entryPath(entry) {
  return `/tools/${routeKey(entry.profession, entry.tool, entry.variant)}/`;
}
