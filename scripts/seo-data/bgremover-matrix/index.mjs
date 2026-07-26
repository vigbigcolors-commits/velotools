/**
 * Validated BG Remover PSEO matrix — entries + unique editorials.
 */
import { MATRIX_ENTRIES } from './entries.mjs';
import { EDITORIALS } from './editorials.mjs';
import { parseMatrix, entryPath } from './schema.mjs';

const merged = MATRIX_ENTRIES.map((entry) => {
  const editorial = EDITORIALS[entry.id];
  if (!editorial) {
    throw new Error(`Missing editorial for matrix id: ${entry.id}`);
  }
  return { ...entry, editorial };
});

export const MATRIX = parseMatrix(merged);
export { entryPath };
