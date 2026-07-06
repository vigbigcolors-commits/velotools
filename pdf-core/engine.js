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
 * Remove password protection when user supplies the correct password.
 * @param {Uint8Array} bytes
 * @param {string} password
 */
export async function unlockDocument(bytes, password) {
  const doc = await openDocument(bytes, { password: password });
  const saved = await doc.save({ useObjectStreams: true });
  return saved;
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
