/**
 * VeloTools — Protect PDF (local encryption via @cantoo/pdf-lib)
 */
import { protectDocument } from '/pdf-core/engine.js';
import { fmtBytes, escHtml, truncate, triggerDownload, readFileBytes } from '/pdf-core/utils.js';

let sourceFile = null;
let outBytes = null;

function $(id) {
  return document.getElementById(id);
}

function setStatus(type, msg) {
  const el = $('protect-status');
  if (!el) return;
  el.className = 'status-msg' + (type ? ' status-msg--' + type : '');
  el.textContent = msg;
  if (msg) el.classList.remove('status-hidden');
  else el.classList.add('status-hidden');
}

function syncButton() {
  $('btn-protect').disabled = !sourceFile;
}

function readPermissionFlags() {
  return {
    printing: $('perm-printing') ? $('perm-printing').checked : true,
    copying: $('perm-copying') ? $('perm-copying').checked : false,
    modifying: $('perm-modifying') ? $('perm-modifying').checked : false,
    fillingForms: $('perm-forms') ? $('perm-forms').checked : true,
  };
}

function resetPermissionDefaults() {
  if ($('perm-printing')) $('perm-printing').checked = true;
  if ($('perm-copying')) $('perm-copying').checked = false;
  if ($('perm-modifying')) $('perm-modifying').checked = false;
  if ($('perm-forms')) $('perm-forms').checked = true;
}

async function onFileSelected(file) {
  sourceFile = file;
  outBytes = null;
  $('btn-download').classList.add('btn-hidden');
  $('protect-file-info').classList.remove('file-info-hidden');
  $('protect-file-info').innerHTML =
    '<div class="file-row"><div class="fr-info"><div class="fr-name">' +
    escHtml(truncate(file.name, 48)) +
    '</div><div class="fr-meta">' +
    fmtBytes(file.size) +
    '</div></div></div>';
  setStatus('', '');
  syncButton();
}

async function doProtect() {
  if (!sourceFile) return;
  const pw = $('protect-password').value;
  const pw2 = $('protect-password2').value;
  if (!pw) {
    setStatus('err', 'Enter a password to lock this PDF.');
    return;
  }
  if (pw.length < 4) {
    setStatus('err', 'Use at least 4 characters for the open password.');
    return;
  }
  if (pw !== pw2) {
    setStatus('err', 'Passwords do not match.');
    return;
  }

  $('btn-protect').disabled = true;
  outBytes = null;
  $('btn-download').classList.add('btn-hidden');
  setStatus('work', 'Encrypting PDF in your browser…');

  try {
    const bytes = await readFileBytes(sourceFile);
    const permissions = readPermissionFlags();
    outBytes = await protectDocument(bytes, pw, { permissions: permissions });
    setStatus('ok', 'PDF encrypted — download requires the password you set.');
    $('btn-download').classList.remove('btn-hidden');
  } catch (e) {
    console.error(e);
    if (/encrypt|password|already/i.test(e.message || '')) {
      setStatus(
        'err',
        e.message ||
          'Could not encrypt — unlock an already-protected PDF first, then protect again.',
      );
    } else {
      setStatus('err', e.message || 'Protect failed');
    }
  } finally {
    syncButton();
  }
}

function bindUpload() {
  const zone = $('protect-upload-zone');
  const inp = $('protect-file-input');
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
  $('btn-protect').addEventListener('click', doProtect);
  $('btn-download').addEventListener('click', function () {
    if (!outBytes || !sourceFile) return;
    const name = sourceFile.name.replace(/\.pdf$/i, '') + '_protected.pdf';
    triggerDownload(new Blob([outBytes], { type: 'application/pdf' }), name);
  });
  $('btn-clear').addEventListener('click', function () {
    sourceFile = null;
    outBytes = null;
    $('protect-password').value = '';
    $('protect-password2').value = '';
    resetPermissionDefaults();
    $('protect-file-info').classList.add('file-info-hidden');
    $('btn-download').classList.add('btn-hidden');
    setStatus('', '');
    syncButton();
  });
  syncButton();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
