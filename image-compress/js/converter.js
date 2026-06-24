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
  var _mimeSupport = {};

  function supportsMime(mime) {
    if (_mimeSupport[mime] != null) return _mimeSupport[mime];
    if (mime === 'image/png' || mime === 'image/jpeg') {
      _mimeSupport[mime] = true;
      return true;
    }
    try {
      var c = document.createElement('canvas');
      c.width = 2;
      c.height = 2;
      _mimeSupport[mime] = c.toDataURL(mime).indexOf('data:' + mime) === 0;
    } catch (_) {
      _mimeSupport[mime] = false;
    }
    return _mimeSupport[mime];
  }

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

  function _toBlob(canvas, mime, q) {
    return new Promise(function (res, rej) {
      try {
        canvas.toBlob(function (blob) {
          blob ? res(blob) : rej(new Error('Encoding failed: ' + mime));
        }, mime, q);
      } catch (e) {
        rej(e);
      }
    });
  }

  /** Returns Promise<Blob> */
  function encode(canvas, mime, quality) {
    if (mime === 'image/svg+xml') {
      return Promise.resolve(encodeSVGWrapper(canvas));
    }
    if (mime === 'image/gif') mime = 'image/png'; // fallback
    if ((mime === 'image/webp' || mime === 'image/avif') && !supportsMime(mime)) {
      return Promise.reject(new Error(mime + ' is not supported in this browser. Try JPG or PNG.'));
    }
    var q = (mime === 'image/png') ? undefined : quality / 100;
    return _toBlob(canvas, mime, q);
  }

  /**
   * Effort-aware encoder (simulates cwebp -m 1..6).
   * Effort 1-4: single pass at given quality.
   * Effort 5:   two-pass — tries q and q-8, returns smaller blob.
   * Effort 6:   three-pass — tries q, q-5, q-10, returns smallest blob.
   * Lossless:   encode at quality 100 (pixel-perfect, largest file).
   * Non-WebP:   delegates to encode() (effort has no effect on JPG/PNG/AVIF).
   */
  function encodeEffort(canvas, mime, quality, effort, lossless) {
    if (mime !== 'image/webp') return encode(canvas, mime, quality);
    if (lossless) return encode(canvas, mime, 100);
    if (!effort || effort <= 4) return encode(canvas, mime, quality);

    var targets;
    if (effort === 5) {
      targets = [quality, Math.max(10, quality - 8)];
    } else {
      targets = [quality, Math.max(10, quality - 5), Math.max(10, quality - 10)];
    }
    // Deduplicate
    targets = targets.filter(function (v, i, a) { return a.indexOf(v) === i; });

    return Promise.all(targets.map(function (q) {
      return encode(canvas, mime, q).catch(function () { return null; });
    })).then(function (blobs) {
      blobs = blobs.filter(Boolean);
      if (!blobs.length) {
        return Promise.reject(new Error('WebP encoding failed. Try JPG or lower the image resolution.'));
      }
      return blobs.reduce(function (best, blob) {
        return blob.size < best.size ? blob : best;
      });
    });
  }

  function ext(mime) { return EXT[mime] || mime.split('/')[1] || 'jpg'; }

  return {
    resolveMime: resolveMime,
    encode: encode,
    encodeEffort: encodeEffort,
    supportsMime: supportsMime,
    ext: ext,
    fmtBytes: U.fmtBytes
  };
})();