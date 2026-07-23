import { describe, it, expect } from 'vitest';
import { MATRIX } from '../scripts/seo-data/matrix/index.mjs';
import {
  parseMatrix,
  resolveEntry,
  entryPath,
  DefaultConfigSchema,
  MatrixEntrySchema,
} from '../scripts/seo-data/matrix/schema.mjs';

describe('PSEO state matrix', () => {
  it('parses 30 strict entries with unique editorials', () => {
    expect(MATRIX).toHaveLength(30);
    for (const e of MATRIX) {
      expect(e.editorial.faqs.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('rejects prototype pollution / unknown keys', () => {
    const payload = JSON.parse(JSON.stringify(MATRIX[0]));
    payload.config.evil = '<script>';
    expect(() => MatrixEntrySchema.parse(payload)).toThrow();
    expect(() => DefaultConfigSchema.parse(payload.config)).toThrow();
  });

  it('rejects HTML in SEO text', () => {
    const payload = { ...MATRIX[0], title: 'Hi <script>alert(1)</script>' };
    expect(() => MatrixEntrySchema.parse(payload)).toThrow();
  });

  it('rejects duplicate leads (doorway guard)', () => {
    const a = JSON.parse(JSON.stringify(MATRIX[0]));
    const b = JSON.parse(JSON.stringify(MATRIX[1]));
    b.id = 'dup-lead-test-entry';
    b.profession = 'frontend-developer';
    b.variant = undefined;
    b.editorial = { ...a.editorial };
    b.title = 'Totally different title for dup lead test | VeloTools';
    b.editorial.h2 = 'Totally different h2 for dup lead test';
    expect(() => parseMatrix([a, b])).toThrow(/Duplicate editorial\.lead/);
  });

  it('resolves only allowlisted URL segments', () => {
    expect(resolveEntry(MATRIX, 'backend-developer', 'focus-room')).toBeTruthy();
    expect(resolveEntry(MATRIX, 'backend-developer', 'focus-room', 'ultradian')).toBeTruthy();
    expect(resolveEntry(MATRIX, '../etc', 'focus-room')).toBeNull();
    expect(resolveEntry(MATRIX, 'backend-developer', 'hack')).toBeNull();
    expect(resolveEntry(MATRIX, 'backend-developer', 'focus-room', 'nope')).toBeNull();
  });

  it('builds safe paths', () => {
    const e = MATRIX.find((x) => x.variant === 'ultradian');
    expect(entryPath(e)).toBe('/tools/backend-developer/focus-room/ultradian/');
  });
});
