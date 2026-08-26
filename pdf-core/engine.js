/**
 * VeloTools PDF Core — shared document operations (pdf-lib).
 * WASM hook reserved for Phase 2 (PDFium).
 */
'use strict';

import { readFileBytes } from './utils.js';

let pdfLibPromise = null;

/** Lazy-load pdf-lib from CDN when a tool needs it */
export function loadPdfLib() {
  if (window.PDFLib) return Promise.resolve(window.PDFLib);
  if (pdfLibPromise) return pdfLibPromise;
  pdfLibPromise = new Promise(function (resolve, reject) {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
    s.onload = function () {
      if (window.PDFLib) resolve(window.PDFLib);
      else reject(new Error('PDF-lib failed to load'));
    };
    s.onerror = function () {
      reject(new Error('PDF-lib failed to load'));
    };
    document.head.appendChild(s);
  });
  return pdfLibPromise;
}

export async function loadJsZip() {
  if (window.JSZip) return window.JSZip;
  return new Promise(function (resolve, reject) {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    s.onload = function () {
      if (window.JSZip) resolve(window.JSZip);
      else reject(new Error('JSZip failed to load'));
    };
    s.onerror = function () {
      reject(new Error('JSZip failed to load'));
    };
    document.head.appendChild(s);
  });
}

function getLib() {
  if (!window.PDFLib) throw new Error('PDF-lib not loaded');
  return window.PDFLib;
}

/**
 * @param {Uint8Array} bytes
 * @param {{ password?: string, ignoreEncryption?: boolean }} [opts]
 */
export async function openDocument(bytes, opts) {
  const { PDFDocument } = getLib();
  const loadOpts = {};
  if (opts && opts.password) loadOpts.password = opts.password;
  if (opts && opts.ignoreEncryption) loadOpts.ignoreEncryption = true;
  return PDFDocument.load(bytes, loadOpts);
}

export async function getPageCount(bytes, opts) {
  const doc = await openDocument(bytes, opts);
  return doc.getPageCount();
}

/**
 * Merge PDFs in order — lossless copy of pages.
 * @param {Uint8Array[]} pdfBytesList
 */
export async function mergeDocuments(pdfBytesList) {
  const { PDFDocument } = getLib();
  const out = await PDFDocument.create();

  for (let i = 0; i < pdfBytesList.length; i++) {
    const src = await openDocument(pdfBytesList[i]);
    const indices = src.getPageIndices();
    if (!indices.length) continue;
    const pages = await out.copyPages(src, indices);
    pages.forEach(function (p) {
      out.addPage(p);
    });
  }

  if (!out.getPageCount()) throw new Error('No pages to merge — check your PDF files');
  return out.save({ useObjectStreams: true });
}

/**
 * Split PDF into separate documents.
 * @param {Uint8Array} bytes
 * @param {'each' | 'range'} mode
 * @param {string} [rangeSpec] e.g. "1-3,5" (1-based, inclusive)
 */
export async function splitDocument(bytes, mode, rangeSpec) {
  const src = await openDocument(bytes);
  const total = src.getPageCount();
  const { PDFDocument } = getLib();
  const outputs = [];

  if (mode === 'each') {
    for (let i = 0; i < total; i++) {
      const out = await PDFDocument.create();
      const [page] = await out.copyPages(src, [i]);
      out.addPage(page);
      outputs.push({
        name: 'page_' + (i + 1) + '.pdf',
        bytes: await out.save({ useObjectStreams: true }),
      });
    }
    return outputs;
  }

  const ranges = parsePageRanges(rangeSpec, total);
  if (!ranges.length) throw new Error('Enter a valid page range (e.g. 1-3, 5)');

  for (let r = 0; r < ranges.length; r++) {
    const indices = ranges[r];
    const out = await PDFDocument.create();
    const pages = await out.copyPages(src, indices);
    pages.forEach(function (p) {
      out.addPage(p);
    });
    const label = indices.map(function (x) {
      return x + 1;
    });
    outputs.push({
      name: 'pages_' + label.join('-') + '.pdf',
      bytes: await out.save({ useObjectStreams: true }),
    });
  }
  return outputs;
}

/**
 * Remove password protection when user supplies the correct open (or owner) password.
 * Uses @cantoo/pdf-lib so VeloTools-protected AES files and legacy pdf-lib-encrypted
 * fixtures both decrypt; stock pdf-lib@1.17.1 cannot open Cantoo AESV2 output.
 * @param {Uint8Array} bytes
 * @param {string} password
 */
export async function unlockDocument(bytes, password) {
  if (!password || !String(password).length) {
    throw new Error('Enter the PDF password to remove protection');
  }
  const lib = await loadCantooPdfLib();
  const doc = await lib.PDFDocument.load(bytes, { password: String(password) });
  return doc.save({ useObjectStreams: true });
}

/**
 * Rotate pages by 90/180/270 degrees (clockwise).
 * @param {Uint8Array} bytes
 * @param {90 | 180 | 270} degrees
 * @param {'all' | number[]} pages — 'all' or 0-based page indices
 */
export async function rotateDocument(bytes, degrees, pages) {
  const deg = Number(degrees);
  if (deg !== 90 && deg !== 180 && deg !== 270) {
    throw new Error('Rotation must be 90, 180, or 270 degrees');
  }
  const doc = await openDocument(bytes);
  const total = doc.getPageCount();
  let indices;
  if (pages === 'all' || pages == null) {
    indices = doc.getPageIndices();
  } else if (Array.isArray(pages)) {
    indices = pages.filter(function (i) {
      return i >= 0 && i < total;
    });
  } else {
    throw new Error('Invalid page selection');
  }
  if (!indices.length) throw new Error('No pages selected to rotate');

  for (let i = 0; i < indices.length; i++) {
    const page = doc.getPage(indices[i]);
    const current = page.getRotation().angle || 0;
    page.setRotation(getLib().degrees((current + deg) % 360));
  }
  return doc.save({ useObjectStreams: true });
}

/**
 * Build a PDF from image files (JPG/PNG/WebP via canvas → JPEG embed).
 * @param {{ bytes: Uint8Array, mime: string, name?: string }[]} images
 * @param {{ pageSize?: 'a4' | 'letter' | 'fit', marginPt?: number }} [opts]
 */
export async function imagesToPdf(images, opts) {
  if (!images || !images.length) throw new Error('Add at least one image');
  const { PDFDocument, PageSizes } = getLib();
  const out = await PDFDocument.create();
  const pageSize = (opts && opts.pageSize) || 'fit';
  const margin = opts && typeof opts.marginPt === 'number' ? Math.max(0, opts.marginPt) : 36;

  let pageW = 0;
  let pageH = 0;
  if (pageSize === 'a4') {
    pageW = PageSizes.A4[0];
    pageH = PageSizes.A4[1];
  } else if (pageSize === 'letter') {
    pageW = PageSizes.Letter[0];
    pageH = PageSizes.Letter[1];
  }

  for (let i = 0; i < images.length; i++) {
    const jpegBytes = await imageBytesToJpeg(images[i].bytes, images[i].mime);
    const embedded = await out.embedJpg(jpegBytes);
    const imgW = embedded.width;
    const imgH = embedded.height;

    let w;
    let h;
    if (pageSize === 'fit') {
      w = imgW;
      h = imgH;
    } else {
      w = pageW;
      h = pageH;
    }

    const page = out.addPage([w, h]);
    const maxW = Math.max(1, w - margin * 2);
    const maxH = Math.max(1, h - margin * 2);
    const scale = Math.min(maxW / imgW, maxH / imgH, 1);
    const drawW = imgW * scale;
    const drawH = imgH * scale;
    const x = (w - drawW) / 2;
    const y = (h - drawH) / 2;
    page.drawImage(embedded, { x: x, y: y, width: drawW, height: drawH });
  }

  return out.save({ useObjectStreams: true });
}

/**
 * @param {Uint8Array} bytes
 * @param {string} mime
 * @returns {Promise<Uint8Array>}
 */
async function imageBytesToJpeg(bytes, mime) {
  const type = (mime || '').toLowerCase();
  if (type === 'image/jpeg' || type === 'image/jpg') return bytes;

  if (typeof createImageBitmap === 'function') {
    const blob = new Blob([bytes], { type: mime || 'image/png' });
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas unavailable');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();
    const jpegBlob = await new Promise(function (resolve, reject) {
      canvas.toBlob(
        function (b) {
          if (b) resolve(b);
          else reject(new Error('JPEG encode failed'));
        },
        'image/jpeg',
        0.92,
      );
    });
    return new Uint8Array(await jpegBlob.arrayBuffer());
  }

  throw new Error('Unsupported image format — use JPG or PNG');
}

let cantooLibPromise = null;

/** Load @cantoo/pdf-lib (encrypt-capable fork) without overwriting stock PDFLib. */
export function loadCantooPdfLib() {
  if (typeof window !== 'undefined' && window.__CantooPDFLib) {
    return Promise.resolve(window.__CantooPDFLib);
  }
  if (cantooLibPromise) return cantooLibPromise;
  // Node / Vitest: same package as the browser CDN pin (no architecture change).
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    cantooLibPromise = import('@cantoo/pdf-lib').then(function (mod) {
      return mod && mod.PDFDocument ? mod : Promise.reject(new Error('Cantoo pdf-lib failed to load'));
    });
    return cantooLibPromise;
  }
  cantooLibPromise = new Promise(function (resolve, reject) {
    const prev = window.PDFLib;
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@cantoo/pdf-lib@2.2.4/dist/pdf-lib.min.js';
    s.onload = function () {
      const lib = window.PDFLib;
      if (!lib || typeof lib.PDFDocument !== 'function') {
        if (prev) window.PDFLib = prev;
        reject(new Error('Cantoo pdf-lib failed to load'));
        return;
      }
      window.__CantooPDFLib = lib;
      if (prev) window.PDFLib = prev;
      else delete window.PDFLib;
      resolve(lib);
    };
    s.onerror = function () {
      if (prev) window.PDFLib = prev;
      reject(new Error('Cantoo pdf-lib failed to load'));
    };
    document.head.appendChild(s);
  });
  return cantooLibPromise;
}

/**
 * Cryptographically strong owner password (never shown/stored/logged).
 * Distinct from the user open password so permission flags are enforceable.
 * @param {number} [byteLength=32]
 * @returns {string}
 */
export function generateOwnerPassword(byteLength) {
  const n = byteLength && byteLength > 0 ? byteLength : 32;
  const bytes = new Uint8Array(n);
  const c = typeof globalThis !== 'undefined' && globalThis.crypto;
  if (!c || typeof c.getRandomValues !== 'function') {
    throw new Error('Secure random generator unavailable');
  }
  c.getRandomValues(bytes);
  let s = '';
  for (let i = 0; i < bytes.length; i++) {
    s += bytes[i].toString(16).padStart(2, '0');
  }
  return s;
}

/**
 * Map UI permission flags to Cantoo SecurityOptions.permissions.
 * Defaults match prior hard-coded privacy-oriented behavior.
 * @param {{ printing?: boolean, copying?: boolean, modifying?: boolean, fillingForms?: boolean } | null | undefined} flags
 */
export function buildProtectPermissions(flags) {
  const f = flags || {};
  const printing = f.printing !== false;
  return {
    printing: printing ? 'highResolution' : false,
    modifying: f.modifying === true,
    copying: f.copying === true,
    annotating: false,
    fillingForms: f.fillingForms !== false,
    contentAccessibility: true,
    documentAssembly: false,
  };
}

/**
 * Encrypt PDF with a user open password (@cantoo/pdf-lib Standard Security Handler).
 * Algorithm strength follows the source PDF version (library default) — not forced here.
 * @param {Uint8Array} bytes
 * @param {string} userPassword
 * @param {{ ownerPassword?: string, permissions?: { printing?: boolean, copying?: boolean, modifying?: boolean, fillingForms?: boolean } }} [options]
 */
export async function protectDocument(bytes, userPassword, options) {
  if (!userPassword || !String(userPassword).length) {
    throw new Error('Enter a password to protect this PDF');
  }
  const optsIn = options && typeof options === 'object' ? options : {};
  const userPw = String(userPassword);
  let ownerPw =
    optsIn.ownerPassword && String(optsIn.ownerPassword).length
      ? String(optsIn.ownerPassword)
      : generateOwnerPassword();
  // Never collapse owner to user — permission flags would become a no-op in many readers.
  if (ownerPw === userPw) {
    ownerPw = generateOwnerPassword();
  }
  const lib = await loadCantooPdfLib();
  const doc = await lib.PDFDocument.load(bytes, { ignoreEncryption: false });
  const opts = {
    userPassword: userPw,
    ownerPassword: ownerPw,
    permissions: buildProtectPermissions(optsIn.permissions),
  };
  doc.encrypt(opts);
  return doc.save();
}

/** @param {File[]} files */
export async function filesToBytes(files) {
  const out = [];
  for (let i = 0; i < files.length; i++) {
    out.push(await readFileBytes(files[i]));
  }
  return out;
}

/**
 * Parse "1-3,5,8-10" into 0-based page index arrays for each output doc.
 * @param {string} spec
 * @param {number} totalPages
 * @returns {number[][]}
 */
export function parsePageRanges(spec, totalPages) {
  if (!spec || !spec.trim()) return [];
  const parts = spec.split(',');
  const indices = new Set();

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    if (!part) continue;
    if (part.indexOf('-') >= 0) {
      const ab = part.split('-');
      let a = parseInt(ab[0], 10);
      let b = parseInt(ab[1], 10);
      if (isNaN(a) || isNaN(b)) continue;
      if (a > b) {
        const t = a;
        a = b;
        b = t;
      }
      for (let p = a; p <= b; p++) {
        if (p >= 1 && p <= totalPages) indices.add(p - 1);
      }
    } else {
      const p = parseInt(part, 10);
      if (!isNaN(p) && p >= 1 && p <= totalPages) indices.add(p - 1);
    }
  }

  const sorted = Array.from(indices).sort(function (a, b) {
    return a - b;
  });
  if (!sorted.length) return [];
  return [sorted];
}

export async function loadPdfJs() {
  if (window['pdfjs-dist/build/pdf']) {
    const lib = window['pdfjs-dist/build/pdf'];
    if (!lib.GlobalWorkerOptions.workerSrc) {
      lib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
    return lib;
  }
  return new Promise(function (resolve, reject) {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    s.onload = function () {
      const lib = window['pdfjs-dist/build/pdf'];
      if (!lib) {
        reject(new Error('PDF.js failed to load'));
        return;
      }
      lib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      resolve(lib);
    };
    s.onerror = function () {
      reject(new Error('PDF.js failed to load'));
    };
    document.head.appendChild(s);
  });
}

/** Placeholder for Phase 2 PDFium.wasm */
export async function initWasmEngine() {
  return null;
}
