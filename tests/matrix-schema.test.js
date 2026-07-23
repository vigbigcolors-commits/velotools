import { describe, it, expect } from 'vitest';
import { MATRIX_ENTRIES } from '../scripts/seo-data/matrix/entries.mjs';
import {
  parseMatrix,
  resolveEntry,
  entryPath,
  DefaultConfigSchema,
  MatrixEntrySchema,
} from '../scripts/seo-data/matrix/schema.mjs';

describe('PSEO state matrix', () => {
  it('parses 30 strict entries', () => {
    const m = parseMatrix(MATRIX_ENTRIES);
    expect(m).toHaveLength(30);
  });

  it('rejects prototype pollution / unknown keys', () => {
    const bad = {
      ...MATRIX_ENTRIES[0],
      config: {
        ...MATRIX_ENTRIES[0].config,
        __proto__: { polluted: true },
        extra: 'xss',
      },
    };
    // strip accidental proto for plain object clone
    const payload = JSON.parse(JSON.stringify(MATRIX_ENTRIES[0]));
    payload.config.evil = '<script>';
    expect(() => MatrixEntrySchema.parse(payload)).toThrow();
    expect(() => DefaultConfigSchema.parse(payload.config)).toThrow();
    expect(() => parseMatrix([bad])).toThrow();
  });

  it('rejects HTML in SEO text', () => {
    const payload = { ...MATRIX_ENTRIES[0], title: 'Hi <script>alert(1)</script>' };
    expect(() => MatrixEntrySchema.parse(payload)).toThrow();
  });

  it('resolves only allowlisted URL segments', () => {
    const m = parseMatrix(MATRIX_ENTRIES);
    expect(resolveEntry(m, 'backend-developer', 'focus-room')).toBeTruthy();
    expect(resolveEntry(m, 'backend-developer', 'focus-room', 'ultradian')).toBeTruthy();
    expect(resolveEntry(m, '../etc', 'focus-room')).toBeNull();
    expect(resolveEntry(m, 'backend-developer', 'hack')).toBeNull();
    expect(resolveEntry(m, 'backend-developer', 'focus-room', 'nope')).toBeNull();
  });

  it('builds safe paths', () => {
    const e = parseMatrix(MATRIX_ENTRIES).find((x) => x.variant === 'ultradian');
    expect(entryPath(e)).toBe('/tools/backend-developer/focus-room/ultradian/');
  });
});
