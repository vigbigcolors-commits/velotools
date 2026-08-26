/**
 * Protect → Unlock round-trip (same engine paths as /protect-pdf/ and /unlock-pdf/).
 */
import { describe, it, expect } from 'vitest';
import { PDFDocument } from '@cantoo/pdf-lib';
import { PDFDocument as StockDoc, StandardFonts } from 'pdf-lib';
import { protectDocument, unlockDocument } from '../pdf-core/engine.js';

async function makePdf(pageCount, label) {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) {
    const p = doc.addPage([612, 792]);
    p.drawText(`${label} page ${i + 1}`, { x: 72, y: 700, size: 14 });
  }
  return doc.save();
}

describe('protect → unlock round-trip', () => {
  it('unlocks a VeloTools-protected PDF with the user open password', async () => {
    const userPw = 'round-trip-secret';
    const pages = 3;
    const original = await makePdf(pages, 'RoundTrip');

    const protectedBytes = await protectDocument(original, userPw, {
      permissions: { printing: true, copying: false, modifying: false, fillingForms: true },
    });

    await expect(PDFDocument.load(protectedBytes)).rejects.toThrow();

    const opened = await PDFDocument.load(protectedBytes, { password: userPw });
    expect(opened.getPageCount()).toBe(pages);

    await expect(unlockDocument(protectedBytes, 'wrong-password')).rejects.toThrow();

    const unlocked = await unlockDocument(protectedBytes, userPw);
    const plain = await PDFDocument.load(unlocked);
    expect(plain.getPageCount()).toBe(pages);

    // Stock pdf-lib must also open the unlocked output with no password.
    const stockPlain = await StockDoc.load(unlocked);
    expect(stockPlain.getPageCount()).toBe(pages);
  });

  it('re-saves legacy stock pdf-lib fixtures (note: save({userPassword}) does not encrypt in pdf-lib@1.17.1)', async () => {
    const userPw = 'e2e-secret';
    const enc = await StockDoc.create();
    const font = await enc.embedFont(StandardFonts.Helvetica);
    enc.addPage().drawText('Encrypted content', { x: 72, y: 700, size: 14, font });
    const legacy = await enc.save({ userPassword: userPw, useObjectStreams: false });

    // Stock 1.17.1 ignores userPassword on save — file is plaintext; unlock must not break it.
    const unlocked = await unlockDocument(legacy, userPw);
    const plain = await StockDoc.load(unlocked);
    expect(plain.getPageCount()).toBe(1);
  });
});
