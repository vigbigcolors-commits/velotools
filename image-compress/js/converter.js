/**
 * VeloTools — converter.js
 * Handles format selection and canvas encoding with output verification.
 */
window.VConverter = (function () {
  'use strict';

  var U = window.VCore;
  var EXT = {
    'image/jpeg': 'jpg', 'image/png': 'png',
    'image/webp': 'webp', 'image/avif': 'avif', 'image/gif': 'gif',
    'image/svg+xml': 'svg'
  };
  var _mimeSupport = {};

  function normalizeMime(mime) {
    if (!mime) return 'image/jpeg';
    var m = String(mime).toLowerCase().split(';')[0].trim();
    if (m === 'image/jpg' || m === 'image/pjpeg') return 'image/jpeg';
    if (m === 'image/x-png') return 'image/png';
    return m;
  }

  function supportsMime(mime) {
    mime = normalizeMime(mime);
    if (_mimeSupport[mime] != null) return _mimeSupport[mime];
    if (
      mime === 'image/png' || mime === 'image/jpeg' || mime === 'image/gif' ||
      mime === 'image/webp' || mime === 'image/avif' || mime === 'image/svg+xml'
    ) {
      _mimeSupport[mime] = true;
      return true;
    }
    _mimeSupport[mime] = false;
    return false;
  }

  function resolveMime(format, fileMime) {
    if (format === 'original') return normalizeMime(fileMime) || 'image/jpeg';
    return normalizeMime(format);
  }

  /** Detect real format from file header — blob.type is often wrong or empty. */
  function sniffBlobMime(blob) {
    return blob.slice(0, 16).arrayBuffer().then(function (buf) {
      var b = new Uint8Array(buf);
      if (b.length >= 2 && b[0] === 0xff && b[1] === 0xd8) return 'image/jpeg';
      if (b.length >= 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'image/png';
      if (b.length >= 12 && b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
          b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return 'image/webp';
      if (b.length >= 12 && b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70 &&
          b[8] === 0x61 && b[9] === 0x76 && b[10] === 0x69 && b[11] === 0x66) return 'image/avif';
      if (blob.type && blob.type.indexOf('image/') === 0) return normalizeMime(blob.type);
      return null;
    });
  }

  function encodeSVGWrapper(canvas) {
    var dataURL = canvas.toDataURL('image/png');
    var w = canvas.width, h = canvas.height;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h +
              '" viewBox="0 0 ' + w + ' ' + h +
              '"><image width="' + w + '" height="' + h + '" href="' + dataURL + '"/></svg>';
    return new Blob([svg], { type: 'image/svg+xml' });
  }

  function _dataUrlToBlob(dataUrl) {
    var parts = dataUrl.split(',');
    var meta = parts[0];
    var raw = atob(parts[1]);
    var mime = (meta.match(/data:([^;]+)/) || [])[1] || 'application/octet-stream';
    var arr = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
    return new Blob([arr], { type: normalizeMime(mime) });
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

  function _toBlobViaDataURL(canvas, mime, quality) {
    try {
      var q = (mime === 'image/png') ? undefined : quality / 100;
      var url = canvas.toDataURL(mime, q);
      if (url.indexOf('data:' + mime) !== 0) {
        return Promise.reject(new Error('dataURL fallback failed for ' + mime));
      }
      return Promise.resolve(_dataUrlToBlob(url));
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   * Encode canvas and verify the output matches the requested format.
   * Returns { blob, mime } where mime is sniffed from bytes.
   */
  function encodeWithMeta(canvas, mime, quality) {
    mime = normalizeMime(mime);
    if (mime === 'image/svg+xml') {
      var svgBlob = encodeSVGWrapper(canvas);
      return Promise.resolve({ blob: svgBlob, mime: 'image/svg+xml' });
    }
    if (mime === 'image/gif') mime = 'image/png';
    var q = (mime === 'image/png') ? undefined : quality / 100;

    function finish(blob) {
      return sniffBlobMime(blob).then(function (sniffed) {
        var actual = sniffed || normalizeMime(blob.type) || mime;
        return { blob: blob, mime: actual };
      });
    }

    function tryDataUrlFallback() {
      return _toBlobViaDataURL(canvas, mime, quality).then(finish);
    }

    function tryWasmWebp() {
      if (mime !== 'image/webp' || !window.VWebPEncoder) {
        return Promise.reject(new Error('WebP encoder unavailable'));
      }
      return window.VWebPEncoder.load().then(function () {
        return window.VWebPEncoder.encodeCanvas(canvas, quality, false);
      }).then(finish);
    }

    return _toBlob(canvas, mime, q).then(finish).then(function (result) {
      if (result.mime === mime) return result;
      if (mime === 'image/webp') {
        return tryWasmWebp().then(function (wasmResult) {
          if (wasmResult.mime === 'image/webp') return wasmResult;
          return Promise.reject(new Error('WebP encoding failed after WASM fallback.'));
        });
      }
      return tryDataUrlFallback().then(function (fallback) {
        if (fallback.mime === mime) return fallback;
        return Promise.reject(new Error(
          'Could not convert to ' + mime.split('/')[1].toUpperCase() +
          '. Your browser returned ' + result.mime.split('/')[1].toUpperCase() + ' instead.'
        ));
      });
    });
  }

  function encode(canvas, mime, quality) {
    return encodeWithMeta(canvas, mime, quality).then(function (r) { return r.blob; });
  }

  function encodeEffort(canvas, mime, quality, effort, lossless) {
    mime = normalizeMime(mime);
    if (mime !== 'image/webp') {
      return encodeWithMeta(canvas, mime, quality);
    }
    if (lossless) {
      if (window.VWebPEncoder) {
        return window.VWebPEncoder.encodeCanvas(canvas, 100, true).then(function (blob) {
          return { blob: blob, mime: 'image/webp' };
        });
      }
      return encodeWithMeta(canvas, mime, 100);
    }
    if (!effort || effort <= 4) return encodeWithMeta(canvas, mime, quality);

    var targets;
    if (effort === 5) {
      targets = [quality, Math.max(10, quality - 8)];
    } else {
      targets = [quality, Math.max(10, quality - 5), Math.max(10, quality - 10)];
    }
    targets = targets.filter(function (v, i, a) { return a.indexOf(v) === i; });

    return Promise.all(targets.map(function (q) {
      return encodeWithMeta(canvas, mime, q).catch(function () { return null; });
    })).then(function (results) {
      results = results.filter(Boolean);
      if (!results.length) {
        return Promise.reject(new Error('WebP encoding failed. Try JPG or lower the image resolution.'));
      }
      return results.reduce(function (best, cur) {
        return cur.blob.size < best.blob.size ? cur : best;
      });
    });
  }

  function ext(mime) { return EXT[normalizeMime(mime)] || mime.split('/')[1] || 'jpg'; }

  return {
    resolveMime: resolveMime,
    normalizeMime: normalizeMime,
    encode: encode,
    encodeWithMeta: encodeWithMeta,
    encodeEffort: encodeEffort,
    sniffBlobMime: sniffBlobMime,
    supportsMime: supportsMime,
    ext: ext,
    fmtBytes: U.fmtBytes
  };
})();
