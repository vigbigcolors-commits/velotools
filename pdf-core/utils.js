/** Shared helpers for PDF tool UIs */
'use strict';

export function fmtBytes(n) {
  if (n === null || n === undefined) return '—';
  if (n < 1024) return n + ' B';
  if (n < 1048576) return (n / 1024).toFixed(1) + ' KB';
  return (n / 1048576).toFixed(2) + ' MB';
}

export function truncate(s, max) {
  return s.length > max ? s.slice(0, max - 1) + '…' : s;
}

export function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function readFileBytes(file) {
  const ab = await file.arrayBuffer();
  return new Uint8Array(ab);
}

export function triggerDownload(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () {
    URL.revokeObjectURL(url);
  }, 2000);
}

export function tick() {
  return new Promise(function (resolve) {
    setTimeout(resolve, 16);
  });
}
