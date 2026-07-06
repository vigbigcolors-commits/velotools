/**
 * VeloTools — Unlock PDF tool UI (remove password when user knows it)
 */
import { loadPdfLib, unlockDocument } from '/pdf-core/engine.js';
import { fmtBytes, escHtml, truncate, triggerDownload, readFileBytes } from '/pdf-core/utils.js';

let sourceFile = null;
let unlockedBytes = null;

function $(id) {
  return document.getElementById(id);
}

function setStatus(type, msg) {
  const el = $('unlock-status');
  if (!el) return;
  el.className = 'status-msg' + (type ? ' status-msg--' + type : '');
  el.textContent = msg;
  el.style.display = msg ? '' : 'none';
}

async function onFileSelected(file) {
  sourceFile = file;
  unlockedBytes = null;
  $('btn-download').style.display = 'none';
  $('unlock-file-info').style.display = '';
  $('unlock-file-info').innerHTML =
    '<div class="file-row"><div class="fr-info"><div class="fr-name">' +
    escHtml(truncate(file.name, 48)) +
    '</div><div class="fr-meta">' +
    fmtBytes(file.size) +
    '</div></div></div>';
  setStatus('', '');
  $('btn-unlock').disabled = false;
}

async function doUnlock() {
  if (!sourceFile) return;
  const password = $('unlock-password').value;
  if (!password) {
    setStatus('err', 'Enter the PDF password to remove protection.');
    return;
  }

  $('btn-unlock').disabled = true;
  unlockedBytes = null;
  $('btn-download').style.display = 'none';
  setStatus('work', 'Decrypting PDF in your browser…');

  try {
    await loadPdfLib();
    const bytes = await readFileBytes(sourceFile);
    unlockedBytes = await unlockDocument(bytes, password);
    setStatus('ok', 'Password removed — download your unprotected PDF.');
    $('btn-download').style.display = '';
  } catch (e) {
    console.error(e);
    if (/password|incorrect|encrypt/i.test(e.message || '')) {
      setStatus('err', 'Wrong password — enter the password that opens this PDF.');
    } else {
      setStatus('err', e.message || 'Unlock failed — file may not be password-protected.');
    }
  } finally {
    $('btn-unlock').disabled = false;
  }
}

function downloadUnlocked() {
  if (!unlockedBytes || !sourceFile) return;
  const name = sourceFile.name.replace(/\.pdf$/i, '') + '_unlocked.pdf';
  triggerDownload(new Blob([unlockedBytes], { type: 'application/pdf' }), name);
}

function bindUpload() {
  const zone = $('unlock-upload-zone');
  const inp = $('unlock-file-input');
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
}

function init() {
  bindUpload();
  $('btn-unlock').addEventListener('click', doUnlock);
  $('btn-download').addEventListener('click', downloadUnlocked);
  $('btn-clear').addEventListener('click', function () {
    sourceFile = null;
    unlockedBytes = null;
    $('unlock-password').value = '';
    $('unlock-file-info').style.display = 'none';
    $('btn-unlock').disabled = true;
    $('btn-download').style.display = 'none';
    setStatus('', '');
  });
  $('btn-unlock').disabled = true;
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
