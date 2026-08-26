/**
 * Protect PDF — unit + Cantoo integration (Node).
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { PDFDocument } from '@cantoo/pdf-lib';
import {
  buildProtectPermissions,
  generateOwnerPassword,
  protectDocument,
} from '../pdf-core/engine.js';

async function blankPdfBytes() {
  const doc = await PDFDocument.create();
  doc.addPage();
  return doc.save();
}

describe('buildProtectPermissions', () => {
  it('defaults match privacy-oriented prior behavior', () => {
    expect(buildProtectPermissions()).toEqual({
      printing: 'highResolution',
      modifying: false,
      copying: false,
      annotating: false,
      fillingForms: true,
      contentAccessibility: true,
      documentAssembly: false,
    });
  });

  it('maps UI flags to Cantoo permission fields only', () => {
    expect(
      buildProtectPermissions({
        printing: false,
        copying: true,
        modifying: true,
        fillingForms: false,
      }),
    ).toEqual({
      printing: false,
      modifying: true,
      copying: true,
      annotating: false,
      fillingForms: false,
      contentAccessibility: true,
      documentAssembly: false,
    });
  });
});

describe('generateOwnerPassword', () => {
  it('uses crypto.getRandomValues and returns hex', () => {
    const a = generateOwnerPassword(16);
    const b = generateOwnerPassword(16);
    expect(a).toMatch(/^[0-9a-f]{32}$/);
    expect(b).toMatch(/^[0-9a-f]{32}$/);
    expect(a).not.toBe(b);
  });
});

describe('protectDocument', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('encrypts so the user password opens the file and wrong password fails', async () => {
    const bytes = await blankPdfBytes();
    const userPw = 'user-open-secret';
    const out = await protectDocument(bytes, userPw, {
      ownerPassword: 'owner-only-secret-xyz',
      permissions: { printing: true, copying: false, modifying: false, fillingForms: true },
    });

    await expect(PDFDocument.load(out)).rejects.toThrow();
    await expect(PDFDocument.load(out, { password: 'wrong' })).rejects.toThrow();

    const opened = await PDFDocument.load(out, { password: userPw });
    expect(opened.getPageCount()).toBe(1);
  });

  it('does not set ownerPassword equal to userPassword', async () => {
    const bytes = await blankPdfBytes();
    const userPw = 'same-would-be-bad';
    let captured = null;
    const orig = PDFDocument.prototype.encrypt;
    vi.spyOn(PDFDocument.prototype, 'encrypt').mockImplementation(function (opts) {
      captured = opts;
      return orig.call(this, opts);
    });

    await protectDocument(bytes, userPw, {
      permissions: { printing: true, copying: false, modifying: false, fillingForms: true },
    });

    expect(captured).toBeTruthy();
    expect(captured.userPassword).toBe(userPw);
    expect(captured.ownerPassword).toBeTruthy();
    expect(captured.ownerPassword).not.toBe(userPw);
  });

  it('passes UI permission flags into encrypt options', async () => {
    const bytes = await blankPdfBytes();
    let captured = null;
    const orig = PDFDocument.prototype.encrypt;
    vi.spyOn(PDFDocument.prototype, 'encrypt').mockImplementation(function (opts) {
      captured = opts;
      return orig.call(this, opts);
    });

    await protectDocument(bytes, 'perm-test-pw', {
      ownerPassword: 'owner-perm-test',
      permissions: {
        printing: false,
        copying: true,
        modifying: true,
        fillingForms: false,
      },
    });

    expect(captured.permissions).toEqual({
      printing: false,
      modifying: true,
      copying: true,
      annotating: false,
      fillingForms: false,
      contentAccessibility: true,
      documentAssembly: false,
    });
  });

  it('regenerates owner when caller passes ownerPassword equal to userPassword', async () => {
    const bytes = await blankPdfBytes();
    const userPw = 'collide-me';
    let captured = null;
    const orig = PDFDocument.prototype.encrypt;
    vi.spyOn(PDFDocument.prototype, 'encrypt').mockImplementation(function (opts) {
      captured = opts;
      return orig.call(this, opts);
    });

    await protectDocument(bytes, userPw, { ownerPassword: userPw });
    expect(captured.ownerPassword).not.toBe(userPw);
  });
});
