/**
 * VeloTools — converter.js
 * Handles format selection and canvas.toBlob encoding.
 */
window.VConverter = (function () {
  'use strict';

  var U = window.VCore;
  var EXT = {
    'image/jpeg':'jpg','image/png':'png',
    'image/webp':'webp','image/avif':'avif','image/gif':'gif',
    'image/svg+xml':'svg'
  };

  function resolveMime(format, fileMime) {
    if (format === 'original') return fileMime || 'image/jpeg';
    return format;
  }

  /** Wrap a rasterized canvas into a single-file SVG (embedded PNG).
   *  Lossless, opens in any browser/editor, scales as a vector container. */
  function encodeSVGWrapper(canvas) {
    var dataURL = canvas.toDataURL('image/png');
    var w = canvas.width, h = canvas.height;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+
              '" viewBox="0 0 '+w+' '+h+
              '"><image width="'+w+'" height="'+h+'" href="'+dataURL+'"/></svg>';
    return new Blob([svg], { type:'image/svg+xml' });
  }

  /** Returns Promise<Blob> */
  function encode(canvas, mime, quality) {
    if (mime === 'image/svg+xml') {
      return Promise.resolve(encodeSVGWrapper(canvas));
    }
    if (mime === 'image/gif') mime = 'image/png'; // fallback
    var q = (mime === 'image/png') ? undefined : quality / 100;
    return new Promise(function (res, rej) {
      canvas.toBlob(function (blob) {
        blob ? res(blob) : rej(new Error('Encoding failed: ' + mime));
      }, mime, q);
    });
  }

  function ext(mime) { return EXT[mime] || mime.split('/')[1] || 'jpg'; }

  return { resolveMime:resolveMime, encode:encode, ext:ext, fmtBytes:U.fmtBytes };
})();