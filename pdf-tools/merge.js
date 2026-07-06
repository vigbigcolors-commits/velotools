/**
 * VeloTools — Merge PDF tool UI (intent-specific, lazy-loads pdf-core).
 */
import { loadPdfLib, mergeDocuments } from '/pdf-core/engine.js';
import { fmtBytes, escHtml, truncate, triggerDownload, tick } from '/pdf-core/utils.js';

const MAX_FILES = 30;
let files = [];
let fileId = 0;
let mergedBytes = null;

function $(id) {
  return document.getElementById(id);
}

function renderList() {
  const list = $('merge-file-list');
  const zone = $('merge-upload-zone');
  if (!list || !zone) return;

  list.innerHTML = '';
  list.style.display = files.length ? '' : 'none';
  zone.style.display = files.length >= MAX_FILES ? 'none' : '';

  files.forEach(function (f, idx) {
    const row = document.createElement('div');
    row.className = 'file-row';
    row.draggable = true;
    row.dataset.id = String(f.id);
    row.innerHTML =
      '<span class="fr-grip" title="Drag to reorder">⠿</span>' +
      '<div class="fr-info">' +
      '<div class="fr-name" title="' +
      escHtml(f.file.name) +
      '">' +
      escHtml(truncate(f.file.name, 48)) +
      '</div>' +
      '<div class="fr-meta">' +
      fmtBytes(f.file.size) +
      (f.pageCount ? ' · ' + f.pageCount + ' page' + (f.pageCount > 1 ? 's' : '') : '') +
      '</div></div>' +
      '<button type="button" class="fr-remove" data-remove="' +
      f.id +
      '" title="Remove">×</button>';

    row.addEventListener('dragstart', onDragStart);
    row.addEventListener('dragover', onDragOver);
    row.addEventListener('drop', onDrop);
    row.addEventListener('dragend', function () {
      row.classList.remove('drag-over');
    });

    list.appendChild(row);
  });

  list.querySelectorAll('[data-remove]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      removeFile(+btn.dataset.remove);
    });
  });

  $('btn-merge').disabled = files.length < 2;
  $('btn-download').style.display = mergedBytes ? '' : 'none';
}

let dragId = null;

function onDragStart(e) {
  dragId = +e.currentTarget.dataset.id;
  e.dataTransfer.effectAllowed = 'move';
}

function onDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over');
}

function onDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  const targetId = +e.currentTarget.dataset.id;
  if (dragId === null || dragId === targetId) return;
  const fromIdx = files.findIndex(function (x) {
    return x.id === dragId;
  });
  const toIdx = files.findIndex(function (x) {
    return x.id === targetId;
  });
  if (fromIdx < 0 || toIdx < 0) return;
  const item = files.splice(fromIdx, 1)[0];
  files.splice(toIdx, 0, item);
  mergedBytes = null;
  renderList();
}

async function addFiles(newFiles) {
  await loadPdfLib();
  const { openDocument } = await import('/pdf-core/engine.js');
  const { readFileBytes } = await import('/pdf-core/utils.js');

  for (let i = 0; i < newFiles.length && files.length < MAX_FILES; i++) {
    const file = newFiles[i];
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) continue;
    const entry = { id: ++fileId, file: file, pageCount: null };
    try {
      const bytes = await readFileBytes(file);
      const doc = await openDocument(bytes);
      entry.pageCount = doc.getPageCount();
    } catch (e) {
      entry.pageCount = null;
    }
    files.push(entry);
  }
  mergedBytes = null;
  renderList();
  setStatus('', '');
}

function removeFile(id) {
  files = files.filter(function (f) {
    return f.id !== id;
  });
  mergedBytes = null;
  renderList();
  setStatus('', '');
}

function setStatus(type, msg) {
  const el = $('merge-status');
  if (!el) return;
  el.className = 'status-msg' + (type ? ' status-msg--' + type : '');
  el.textContent = msg;
  el.style.display = msg ? '' : 'none';
}

async function doMerge() {
  if (files.length < 2) return;
  const btn = $('btn-merge');
  const dl = $('btn-download');
  btn.disabled = true;
  mergedBytes = null;
  dl.style.display = 'none';
  setStatus('work', 'Merging ' + files.length + ' PDFs in your browser…');

  try {
    await loadPdfLib();
    const { readFileBytes } = await import('/pdf-core/utils.js');
    const bytesList = [];
    for (let i = 0; i < files.length; i++) {
      setStatus('work', 'Reading file ' + (i + 1) + ' of ' + files.length + '…');
      bytesList.push(await readFileBytes(files[i].file));
      await tick();
    }

    setStatus('work', 'Combining pages — lossless merge…');
    mergedBytes = await mergeDocuments(bytesList);

    const totalPages = files.reduce(function (s, f) {
      return s + (f.pageCount || 0);
    }, 0);
    setStatus(
      'ok',
      'Done! Merged ' +
        files.length +
        ' files' +
        (totalPages ? ' · ' + totalPages + ' pages' : '') +
        ' · ' +
        fmtBytes(mergedBytes.byteLength),
    );
    dl.style.display = '';
  } catch (e) {
    console.error(e);
    const msg = e.message || '';
    if (/password|encrypt/i.test(msg)) {
      setStatus('err', 'One of these PDFs is password-protected. Unlock it first, then merge.');
    } else {
      setStatus('err', msg || 'Merge failed — try re-exporting the PDF from its source app.');
    }
  } finally {
    btn.disabled = files.length < 2;
  }
}

function downloadMerged() {
  if (!mergedBytes) return;
  const blob = new Blob([mergedBytes], { type: 'application/pdf' });
  triggerDownload(blob, 'velotools-merged.pdf');
}

function bindUpload() {
  const zone = $('merge-upload-zone');
  const inp = $('merge-file-input');
  if (!zone || !inp) return;

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
    addFiles(Array.from(this.files));
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
    const dropped = Array.from(e.dataTransfer.files).filter(function (f) {
      return f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf');
    });
    if (dropped.length) addFiles(dropped);
  });
}

function init() {
  bindUpload();
  $('btn-merge').addEventListener('click', doMerge);
  $('btn-download').addEventListener('click', downloadMerged);
  $('btn-clear').addEventListener('click', function () {
    files = [];
    mergedBytes = null;
    renderList();
    setStatus('', '');
  });
  renderList();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
