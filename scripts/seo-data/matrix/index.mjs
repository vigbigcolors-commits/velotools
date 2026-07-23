/**
 * Validated PSEO matrix export.
 */
import { MATRIX_ENTRIES } from './entries.mjs';
import { parseMatrix, resolveEntry, entryPath } from './schema.mjs';

export const MATRIX = parseMatrix(MATRIX_ENTRIES);

export { resolveEntry, entryPath, parseMatrix };
export {
  ProfessionSlug,
  ToolSlug,
  VariantSlug,
  DefaultConfigSchema,
  MatrixEntrySchema,
} from './schema.mjs';
