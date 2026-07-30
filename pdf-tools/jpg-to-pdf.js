/**
 * VeloTools — JPG / images to PDF
 */
import { loadPdfLib, imagesToPdf } from '/pdf-core/engine.js';
import { fmtBytes, escHtml, truncate, triggerDownload, readFileBytes } from '/pdf-core/utils.js';

const MAX_FILES = 40;
const ACCEPT = /^(image\/jpeg|image\/jpg|image\/png|image\/webp)$/i;

let files = [];
let fileId = 0;
let outBytes = null;

function $(id) {
  return document.getElementById(id);
}

function setStatus(type, msg) {
  const el = $('jpgpdf-status');
  if (!el) return;
  el.className = 'status-msg' + (type ? ' status-msg--' + type : '');
  el.textContent = msg;
  if (msg) el.classList.remove('status-hidden');
  else el.classList.add('status-hidden');
}

function renderList() {
  const list = $('jpgpdf-file-list');
  const zone = $('jpgpdf-upload-zone');
  list.innerHTML = '';
  if (files.length) list.classList.remove('file-list-hidden');
  else list.classList.add('file-list-hidden');
  if (files.length >= MAX_FILES) zone.classList.add('upload-zone-hidden');
  else zone.classList.remove('upload-zone-hidden');

  files.forEach(function (f) {
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
      files = files.filter(function (x) {
        return x.id !== +btn.dataset.remove;
      });
      outBytes = null;
      renderList();
    });
  });

  $('btn-convert').disabled = files.length < 1;
  if (outBytes) $('btn-download').classList.remove('btn-hidden');
  else $('btn-download').classList.add('btn-hidden');
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
  outBytes = null;
  renderList();
}

function isImage(file) {
  if (ACCEPT.test(file.type)) return true;
  const n = file.name.toLowerCase();
  return /\.(jpe?g|png|webp)$/.test(n);
}

function mimeOf(file) {
  if (file.type) return file.type;
  const n = file.name.toLowerCase();
  if (/\.png$/.test(n)) return 'image/png';
  if (/\.webp$/.test(n)) return 'image/webp';
  return 'image/jpeg';
}

async function addFiles(list) {
  for (let i = 0; i < list.length && files.length < MAX_FILES; i++) {
    const file = list[i];
    if (!isImage(file)) continue;
    files.push({ id: ++fileId, file: file });
  }
  outBytes = null;
  renderList();
  setStatus('', '');
}

async function doConvert() {
  if (!files.length) return;
  $('btn-convert').disabled = true;
  outBytes = null;
  $('btn-download').classList.add('btn-hidden');
  setStatus('work', 'Building PDF in your browser…');
  try {
    await loadPdfLib();
    const images = [];
    for (let i = 0; i < files.length; i++) {
      images.push({
        bytes: await readFileBytes(files[i].file),
        mime: mimeOf(files[i].file),
        name: files[i].file.name,
      });
    }
    const pageSize = $('jpgpdf-page-size').value;
    const marginPt = Number($('jpgpdf-margin').value) || 0;
    outBytes = await imagesToPdf(images, { pageSize: pageSize, marginPt: marginPt });
    setStatus('ok', 'PDF ready — ' + files.length + ' page' + (files.length > 1 ? 's' : '') + '.');
    $('btn-download').classList.remove('btn-hidden');
  } catch (e) {
    console.error(e);
    setStatus('err', e.message || 'Conversion failed');
  } finally {
    $('btn-convert').disabled = files.length < 1;
  }
}

function bindUpload() {
  const zone = $('jpgpdf-upload-zone');
  const inp = $('jpgpdf-file-input');
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
    if (this.files && this.files.length) addFiles(Array.from(this.files));
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
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  });
}

function init() {
  bindUpload();
  $('btn-convert').addEventListener('click', doConvert);
  $('btn-download').addEventListener('click', function () {
    if (!outBytes) return;
    triggerDownload(new Blob([outBytes], { type: 'application/pdf' }), 'images.pdf');
  });
  $('btn-clear').addEventListener('click', function () {
    files = [];
    outBytes = null;
    renderList();
    setStatus('', '');
  });
  $('jpgpdf-page-size').addEventListener('change', function () {
    outBytes = null;
    $('btn-download').classList.add('btn-hidden');
  });
  $('jpgpdf-margin').addEventListener('change', function () {
    outBytes = null;
    $('btn-download').classList.add('btn-hidden');
  });
  renderList();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
