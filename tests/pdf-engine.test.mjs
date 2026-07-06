/**
 * Integration tests for pdf-core engine (Node + pdf-lib).
 */
import { readFileSync } from 'fs';
import { PDFDocument, StandardFonts } from 'pdf-lib';

// Inline engine logic for Node (browser engine uses window.PDFLib)
async function makePdf(pageCount, text) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  for (let i = 0; i < pageCount; i++) {
    const p = doc.addPage([612, 792]);
    p.drawText(text + ' page ' + (i + 1), { x: 72, y: 700, size: 14, font });
  }
  return doc.save();
}

async function mergeDocuments(pdfBytesList) {
  const out = await PDFDocument.create();
  for (const bytes of pdfBytesList) {
    const src = await PDFDocument.load(bytes);
    const pages = await out.copyPages(src, src.getPageIndices());
    pages.forEach((p) => out.addPage(p));
  }
  return out.save();
}

function parsePageRanges(spec, totalPages) {
  if (!spec || !spec.trim()) return [];
  const parts = spec.split(',');
  const indices = new Set();
  for (const part of parts) {
    const t = part.trim();
    if (!t) continue;
    if (t.includes('-')) {
      const [a, b] = t.split('-').map((x) => parseInt(x, 10));
      if (isNaN(a) || isNaN(b)) continue;
      const lo = Math.min(a, b);
      const hi = Math.max(a, b);
      for (let p = lo; p <= hi; p++) {
        if (p >= 1 && p <= totalPages) indices.add(p - 1);
      }
    } else {
      const p = parseInt(t, 10);
      if (!isNaN(p) && p >= 1 && p <= totalPages) indices.add(p - 1);
    }
  }
  const sorted = [...indices].sort((a, b) => a - b);
  return sorted.length ? [sorted] : [];
}

let passed = 0;
let failed = 0;

function assert(cond, msg) {
  if (cond) {
    passed++;
    console.log('  OK:', msg);
  } else {
    failed++;
    console.log('  FAIL:', msg);
  }
}

async function main() {
  console.log('Engine integration tests\n');

  const a = await makePdf(2, 'DocA');
  const b = await makePdf(3, 'DocB');
  const merged = await mergeDocuments([a, b]);
  const mergedDoc = await PDFDocument.load(merged);
  assert(mergedDoc.getPageCount() === 5, 'merge 2+3 pages = 5');

  const ranges = parsePageRanges('1-2, 4', 5);
  assert(ranges.length === 1 && ranges[0].join(',') === '0,1,3', 'parsePageRanges 1-2,4 on 5 pages');

  const single = await makePdf(1, 'One');
  const splitEach = [];
  const src = await PDFDocument.load(single);
  for (let i = 0; i < src.getPageCount(); i++) {
    const out = await PDFDocument.create();
    const [page] = await out.copyPages(src, [i]);
    out.addPage(page);
    splitEach.push(await out.save());
  }
  assert(splitEach.length === 1, 'split each produces 1 file for 1-page PDF');

  // Encrypted PDF
  const enc = await PDFDocument.create();
  enc.addPage();
  const encBytes = await enc.save({ userPassword: 'test123', useObjectStreams: false });

  const unlocked = await PDFDocument.load(encBytes, { password: 'test123' });
  const saved = await unlocked.save();
  let reopenOk = false;
  try {
    const check = await PDFDocument.load(saved);
    reopenOk = check.getPageCount() === 1;
  } catch {
    reopenOk = false;
  }
  assert(reopenOk, 'unlock save produces openable PDF without password');

  console.log('\n' + passed + ' passed, ' + failed + ' failed');
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
