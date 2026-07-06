/**
 * VeloTools — PDF to JPG converter (PDF.js render, browser-only)
 */
import { loadPdfJs, loadJsZip, parsePageRanges } from '/pdf-core/engine.js';
import { fmtBytes, escHtml, truncate, triggerDownload, readFileBytes, tick } from '/pdf-core/utils.js';

let sourceFile = null;
let pageCount = null;
let jpgOutputs = null;

function $(id) {
  return document.getElementById(id);
}

function setStatus(type, msg) {
  const el = $('jpg-status');
  if (!el) return;
  el.className = 'status-msg' + (type ? ' status-msg--' + type : '');
  el.textContent = msg;
  if (msg) el.classList.remove('status-hidden');
  else el.classList.add('status-hidden');
}

function getDpi() {
  const sel = $('jpg-dpi');
  return sel ? parseInt(sel.value, 10) || 150 : 150;
}

function getQuality() {
  const sel = $('jpg-quality');
  return sel ? parseInt(sel.value, 10) || 85 : 85;
}

async function onFileSelected(file) {
  if (!file) return;
  sourceFile = file;
  jpgOutputs = null;
  $('btn-download').classList.add('btn-hidden');
  pageCount = null;
  $('jpg-file-info').classList.remove('file-info-hidden');
  $('jpg-file-info').innerHTML =
    '<div class="file-row"><div class="fr-info"><div class="fr-name">' +
    escHtml(truncate(file.name, 48)) +
    '</div><div class="fr-meta">' +
    fmtBytes(file.size) +
    ' · reading…</div></div></div>';

  try {
    const pdfjs = await loadPdfJs();
    const bytes = await readFileBytes(file);
    const task = pdfjs.getDocument({ data: bytes.slice() });
    const doc = await task.promise;
    pageCount = doc.numPages;
    await doc.destroy();
    $('jpg-file-info').querySelector('.fr-meta').textContent =
      fmtBytes(file.size) + ' · ' + pageCount + ' page' + (pageCount > 1 ? 's' : '');
    $('btn-convert').disabled = false;
    setStatus('', '');
    if (pageCount > 100) {
      setStatus('work', pageCount + ' pages — conversion may take a minute.');
    }
  } catch (e) {
    setStatus('err', 'Could not read PDF — password-protected or invalid file.');
    $('btn-convert').disabled = true;
  }
}

async function renderPageToJpeg(pdfjs, doc, pageNum, dpi, quality) {
  const page = await doc.getPage(pageNum);
  const scale = dpi / 72;
  const viewport = page.getViewport({ scale: scale });
  const canvas = document.createElement('canvas');
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  const ctx = canvas.getContext('2d', { alpha: false });
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport: viewport }).promise;
  page.cleanup();
  const dataUrl = canvas.toDataURL('image/jpeg', quality / 100);
  const bin = atob(dataUrl.split(',')[1]);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  canvas.width = 0;
  canvas.height = 0;
  return bytes;
}

async function doConvert() {
  if (!sourceFile || !pageCount) return;
  const mode = document.querySelector('input[name="jpg-mode"]:checked').value;
  const rangeSpec = $('jpg-range').value.trim();
  if (mode === 'range' && !rangeSpec) {
    setStatus('err', 'Enter a page range (e.g. 1-3, 5)');
    return;
  }

  $('btn-convert').disabled = true;
  jpgOutputs = null;
  $('btn-download').classList.add('btn-hidden');
  setStatus('work', 'Converting PDF pages to JPG…');

  try {
    const pdfjs = await loadPdfJs();
    const bytes = await readFileBytes(sourceFile);
    const task = pdfjs.getDocument({ data: bytes.slice() });
    const doc = await task.promise;
    const dpi = getDpi();
    const quality = getQuality();
    const indices = [];

    if (mode === 'each') {
      for (let i = 1; i <= pageCount; i++) indices.push(i);
    } else {
      const groups = parsePageRanges(rangeSpec, pageCount);
      if (!groups.length || !groups[0].length) throw new Error('Enter a valid page range');
      groups[0].forEach(function (idx) {
        indices.push(idx + 1);
      });
    }

    jpgOutputs = [];
    for (let i = 0; i < indices.length; i++) {
      setStatus('work', 'Rendering page ' + (i + 1) + ' of ' + indices.length + '…');
      const jpegBytes = await renderPageToJpeg(pdfjs, doc, indices[i], dpi, quality);
      jpgOutputs.push({
        name: 'page_' + indices[i] + '.jpg',
        bytes: jpegBytes,
      });
      await tick();
    }
    await doc.destroy();

    setStatus('ok', 'Created ' + jpgOutputs.length + ' JPG image' + (jpgOutputs.length > 1 ? 's' : ''));
    $('btn-download').classList.remove('btn-hidden');
  } catch (e) {
    console.error(e);
    setStatus('err', e.message || 'Conversion failed');
  } finally {
    $('btn-convert').disabled = false;
  }
}

async function downloadJpg() {
  if (!jpgOutputs || !jpgOutputs.length) return;
  if (jpgOutputs.length === 1) {
    triggerDownload(new Blob([jpgOutputs[0].bytes], { type: 'image/jpeg' }), jpgOutputs[0].name);
    return;
  }
  const JSZip = await loadJsZip();
  const zip = new JSZip();
  jpgOutputs.forEach(function (o) {
    zip.file(o.name, o.bytes);
  });
  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
  const base = sourceFile.name.replace(/\.pdf$/i, '');
  triggerDownload(blob, base + '_jpg.zip');
}

function bindUpload() {
  const zone = $('jpg-upload-zone');
  const inp = $('jpg-file-input');
  zone.addEventListener('click', function () {
    inp.click();
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

  document.querySelectorAll('input[name="jpg-mode"]').forEach(function (r) {
    r.addEventListener('change', function () {
      const wrap = $('jpg-range-wrap');
      if (r.value === 'range') wrap.classList.remove('split-range-hidden');
      else wrap.classList.add('split-range-hidden');
    });
  });
}

function init() {
  bindUpload();
  $('btn-convert').addEventListener('click', doConvert);
  $('btn-download').addEventListener('click', downloadJpg);
  $('btn-clear').addEventListener('click', function () {
    sourceFile = null;
    pageCount = null;
    jpgOutputs = null;
    $('jpg-file-info').classList.add('file-info-hidden');
    $('btn-convert').disabled = true;
    $('btn-download').classList.add('btn-hidden');
    setStatus('', '');
  });
  $('btn-convert').disabled = true;
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
