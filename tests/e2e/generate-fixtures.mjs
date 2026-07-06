/**
 * Generate PDF fixtures for E2E tests (pdf-lib).
 */
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, 'fixtures');

mkdirSync(OUT, { recursive: true });

async function makePages(count, label) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  for (let i = 0; i < count; i++) {
    const p = doc.addPage([612, 792]);
    p.drawText(`${label} — page ${i + 1} of ${count}`, { x: 72, y: 700, size: 16, font });
    p.drawRectangle({ x: 72, y: 400, width: 200, height: 120, color: rgb(0.2, 0.5, 0.9) });
  }
  return doc.save();
}

async function main() {
  writeFileSync(join(OUT, 'two-page-a.pdf'), await makePages(2, 'DocA'));
  writeFileSync(join(OUT, 'three-page-b.pdf'), await makePages(3, 'DocB'));
  writeFileSync(join(OUT, 'five-page.pdf'), await makePages(5, 'SplitTest'));

  const enc = await PDFDocument.create();
  const font = await enc.embedFont(StandardFonts.Helvetica);
  enc.addPage().drawText('Encrypted content', { x: 72, y: 700, size: 14, font });
  writeFileSync(
    join(OUT, 'encrypted.pdf'),
    await enc.save({ userPassword: 'e2e-secret', useObjectStreams: false }),
  );

  console.log('Generating 105-page PDF for stress test…');
  writeFileSync(join(OUT, 'large-105.pdf'), await makePages(105, 'BatchStress'));

  console.log('Fixtures written to', OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
