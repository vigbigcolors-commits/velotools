/**
 * VeloTools — converter.js
 * Handles format selection and canvas.toBlob encoding.
 */
window.VConverter = (function () {
  'use strict';

  var EXT = {
    'image/jpeg':'jpg','image/png':'png',
    'image/webp':'webp','image/avif':'avif','image/gif':'gif'
  };

  function resolveMime(format, fileMime) {
    if (format === 'original') return fileMime || 'image/jpeg';
    return format;
  }

  /** Returns Promise<Blob> */
  function encode(canvas, mime, quality) {
    if (mime === 'image/gif') mime = 'image/png'; // fallback
    var q = (mime === 'image/png') ? undefined : quality / 100;
    return new Promise(function (res, rej) {
      canvas.toBlob(function (blob) {
        blob ? res(blob) : rej(new Error('Encoding failed: ' + mime));
      }, mime, q);
    });
  }

  function ext(mime) { return EXT[mime] || mime.split('/')[1] || 'jpg'; }

  function fmtBytes(b) {
    if (b < 1024)    return b + ' B';
    if (b < 1048576) return Math.round(b/1024) + ' KB';
    return (b/1048576).toFixed(1) + ' MB';
  }

  return { resolveMime:resolveMime, encode:encode, ext:ext, fmtBytes:fmtBytes };
})();
