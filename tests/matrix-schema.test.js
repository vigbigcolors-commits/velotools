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
    b.editorial = { ...a.editorial, h2: 'Totally different h2 for dup lead test' };
    b.title = 'Totally different title for dup lead test | VeloTools';
    b.h1 = 'Totally different h1 for dup lead test';
    b.description = 'Totally different description text that is long enough for SafeLongText validation rules here.';
    b.intentBanner = 'Totally different banner for dup lead test';
    b.config = {
      timers: { focusMinutes: 33, shortBreakMinutes: 6, longBreakMinutes: 18 },
      soundPreset: 'ocean',
      volume: 0.4,
      theme: 'amber',
    };
    expect(() => parseMatrix([a, b])).toThrow(/Duplicate editorial\.lead/);
  });

  it('enforces uniqueness across all SEO fields at any scale', () => {
    const titles = new Set(MATRIX.map((e) => e.title.toLowerCase()));
    const h1s = new Set(MATRIX.map((e) => e.h1.toLowerCase()));
    const leads = new Set(MATRIX.map((e) => e.editorial.lead.toLowerCase()));
    const whys = new Set(MATRIX.map((e) => e.editorial.whyPreset.toLowerCase()));
    expect(titles.size).toBe(MATRIX.length);
    expect(h1s.size).toBe(MATRIX.length);
    expect(leads.size).toBe(MATRIX.length);
    expect(whys.size).toBe(MATRIX.length);
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
