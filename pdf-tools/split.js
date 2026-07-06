/**
 * VeloTools — Split PDF tool UI
 */
import { loadPdfLib, loadJsZip, splitDocument } from '/pdf-core/engine.js';
import { fmtBytes, escHtml, truncate, triggerDownload, readFileBytes } from '/pdf-core/utils.js';

let sourceFile = null;
let pageCount = null;
let splitOutputs = null;

function $(id) {
  return document.getElementById(id);
}

function setStatus(type, msg) {
  const el = $('split-status');
  if (!el) return;
  el.className = 'status-msg' + (type ? ' status-msg--' + type : '');
  el.textContent = msg;
  el.style.display = msg ? '' : 'none';
}

async function onFileSelected(file) {
  if (!file) return;
  sourceFile = file;
  splitOutputs = null;
  $('btn-download').style.display = 'none';
  pageCount = null;
  $('split-file-info').style.display = '';
  $('split-file-info').innerHTML =
    '<div class="file-row"><div class="fr-info"><div class="fr-name">' +
    escHtml(truncate(file.name, 48)) +
    '</div><div class="fr-meta">' +
    fmtBytes(file.size) +
    ' · reading…</div></div></div>';

  try {
    await loadPdfLib();
    const bytes = await readFileBytes(file);
    const { getPageCount } = await import('/pdf-core/engine.js');
    pageCount = await getPageCount(bytes);
    $('split-file-info').querySelector('.fr-meta').textContent =
      fmtBytes(file.size) + ' · ' + pageCount + ' page' + (pageCount > 1 ? 's' : '');
    $('btn-split').disabled = false;
    setStatus('', '');
  } catch (e) {
    setStatus('err', 'Could not read PDF — password-protected or invalid file.');
    $('btn-split').disabled = true;
  }
}

async function doSplit() {
  if (!sourceFile || !pageCount) return;
  const mode = document.querySelector('input[name="split-mode"]:checked').value;
  const rangeSpec = $('split-range').value.trim();
  if (mode === 'range' && !rangeSpec) {
    setStatus('err', 'Enter a page range (e.g. 1-3, 5)');
    return;
  }

  $('btn-split').disabled = true;
  splitOutputs = null;
  $('btn-download').style.display = 'none';
  setStatus('work', 'Splitting PDF in your browser…');

  try {
    await loadPdfLib();
    const bytes = await readFileBytes(sourceFile);
    splitOutputs = await splitDocument(bytes, mode, rangeSpec);
    setStatus('ok', 'Created ' + splitOutputs.length + ' PDF file' + (splitOutputs.length > 1 ? 's' : ''));
    $('btn-download').style.display = '';
  } catch (e) {
    console.error(e);
    setStatus('err', e.message || 'Split failed');
  } finally {
    $('btn-split').disabled = false;
  }
}

async function downloadSplit() {
  if (!splitOutputs || !splitOutputs.length) return;
  if (splitOutputs.length === 1) {
    triggerDownload(
      new Blob([splitOutputs[0].bytes], { type: 'application/pdf' }),
      splitOutputs[0].name,
    );
    return;
  }
  const JSZip = await loadJsZip();
  const zip = new JSZip();
  splitOutputs.forEach(function (o) {
    zip.file(o.name, o.bytes);
  });
  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
  const base = sourceFile.name.replace(/\.pdf$/i, '');
  triggerDownload(blob, base + '_split.zip');
}

function bindUpload() {
  const zone = $('split-upload-zone');
  const inp = $('split-file-input');
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

  document.querySelectorAll('input[name="split-mode"]').forEach(function (r) {
    r.addEventListener('change', function () {
      $('split-range-wrap').style.display = r.value === 'range' ? '' : 'none';
    });
  });
}

function init() {
  bindUpload();
  $('btn-split').addEventListener('click', doSplit);
  $('btn-download').addEventListener('click', downloadSplit);
  $('btn-clear').addEventListener('click', function () {
    sourceFile = null;
    pageCount = null;
    splitOutputs = null;
    $('split-file-info').style.display = 'none';
    $('btn-split').disabled = true;
    $('btn-download').style.display = 'none';
    setStatus('', '');
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
