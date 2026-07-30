/**
 * VeloTools — Rotate PDF
 */
import {
  loadPdfLib,
  rotateDocument,
  openDocument,
  parsePageRanges,
} from '/pdf-core/engine.js';
import { fmtBytes, escHtml, truncate, triggerDownload, readFileBytes } from '/pdf-core/utils.js';

let sourceFile = null;
let pageCount = 0;
let outBytes = null;

function $(id) {
  return document.getElementById(id);
}

function setStatus(type, msg) {
  const el = $('rotate-status');
  if (!el) return;
  el.className = 'status-msg' + (type ? ' status-msg--' + type : '');
  el.textContent = msg;
  if (msg) el.classList.remove('status-hidden');
  else el.classList.add('status-hidden');
}

function syncModeUi() {
  const mode = document.querySelector('input[name="rotate-mode"]:checked');
  const rangeWrap = $('rotate-range-wrap');
  if (mode && mode.value === 'range') rangeWrap.classList.remove('file-info-hidden');
  else rangeWrap.classList.add('file-info-hidden');
}

async function onFileSelected(file) {
  sourceFile = file;
  outBytes = null;
  pageCount = 0;
  $('btn-download').classList.add('btn-hidden');
  setStatus('work', 'Reading PDF…');
  try {
    await loadPdfLib();
    const bytes = await readFileBytes(file);
    const doc = await openDocument(bytes);
    pageCount = doc.getPageCount();
    $('rotate-file-info').classList.remove('file-info-hidden');
    $('rotate-file-info').innerHTML =
      '<div class="file-row"><div class="fr-info"><div class="fr-name">' +
      escHtml(truncate(file.name, 48)) +
      '</div><div class="fr-meta">' +
      fmtBytes(file.size) +
      ' · ' +
      pageCount +
      ' page' +
      (pageCount > 1 ? 's' : '') +
      '</div></div></div>';
    setStatus('', '');
    $('btn-rotate').disabled = false;
  } catch (e) {
    sourceFile = null;
    $('rotate-file-info').classList.add('file-info-hidden');
    $('btn-rotate').disabled = true;
    setStatus(
      'err',
      /password|encrypt/i.test(e.message || '')
        ? 'Password-protected — unlock first.'
        : e.message || 'Could not read PDF',
    );
  }
}

async function doRotate() {
  if (!sourceFile || !pageCount) return;
  const deg = Number($('rotate-degrees').value);
  const modeEl = document.querySelector('input[name="rotate-mode"]:checked');
  const mode = modeEl ? modeEl.value : 'all';
  let pages = 'all';
  if (mode === 'range') {
    const spec = $('rotate-range').value;
    const groups = parsePageRanges(spec, pageCount);
    if (!groups.length || !groups[0].length) {
      setStatus('err', 'Enter a valid page range (e.g. 1-3, 5)');
      return;
    }
    pages = groups[0];
  }

  $('btn-rotate').disabled = true;
  outBytes = null;
  $('btn-download').classList.add('btn-hidden');
  setStatus('work', 'Rotating pages…');
  try {
    await loadPdfLib();
    const bytes = await readFileBytes(sourceFile);
    outBytes = await rotateDocument(bytes, deg, pages);
    setStatus('ok', 'Rotation applied — download your PDF.');
    $('btn-download').classList.remove('btn-hidden');
  } catch (e) {
    console.error(e);
    setStatus('err', e.message || 'Rotate failed');
  } finally {
    $('btn-rotate').disabled = !sourceFile;
  }
}

function bindUpload() {
  const zone = $('rotate-upload-zone');
  const inp = $('rotate-file-input');
  zone.addEventListener('click', function () {
    inp.click();
  });
  zone.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      inp.click();
    }
  });
  inp.addEventListener('change', function () {
    if (this.files[0]) onFileSelected(this.files[0]);
    this.value = '';
  });
  zone.addEventListener('dragover', function (e) {
    e.preventDefault();
    zone.classList.add('drag');
  });
  zone.addEventListener('dragleave', function () {
    zone.classList.remove('drag');
  });
  zone.addEventListener('drop', function (e) {
    e.preventDefault();
    zone.classList.remove('drag');
    const f = Array.from(e.dataTransfer.files).find(function (x) {
      return x.type === 'application/pdf' || x.name.toLowerCase().endsWith('.pdf');
    });
    if (f) onFileSelected(f);
  });
}

function init() {
  bindUpload();
  document.querySelectorAll('input[name="rotate-mode"]').forEach(function (el) {
    el.addEventListener('change', syncModeUi);
  });
  syncModeUi();
  $('btn-rotate').addEventListener('click', doRotate);
  $('btn-download').addEventListener('click', function () {
    if (!outBytes || !sourceFile) return;
    const name = sourceFile.name.replace(/\.pdf$/i, '') + '_rotated.pdf';
    triggerDownload(new Blob([outBytes], { type: 'application/pdf' }), name);
  });
  $('btn-clear').addEventListener('click', function () {
    sourceFile = null;
    pageCount = 0;
    outBytes = null;
    $('rotate-file-info').classList.add('file-info-hidden');
    $('rotate-range').value = '';
    $('btn-rotate').disabled = true;
    $('btn-download').classList.add('btn-hidden');
    setStatus('', '');
  });
  $('btn-rotate').disabled = true;
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
