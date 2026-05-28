/**
 * VeloTools — processor.js
 * Image processing module: compress, convert, resize, rotate, effects, blur
 * All processing is client-side via Canvas API — files never leave the browser
 */

window.VeloProcessor = (function () {
  'use strict';

  /**
   * Get CSS filter string from effect sliders
   */
  function getFilter(state) {
    if (state.activePanel !== 'effects') return '';
    var b = state.brightness, c = state.contrast, s = state.saturation, h = state.hue;
    var base = 'brightness('+b+'%) contrast('+c+'%) saturate('+s+'%) hue-rotate('+h+'deg)';
    return base;
  }

  /**
   * Apply pixelate effect to canvas
   */
  function pixelate(canvas, ctx, amount) {
    var px = Math.max(2, amount * 3);
    var tmp = document.createElement('canvas');
    tmp.width  = Math.max(1, Math.floor(canvas.width / px));
    tmp.height = Math.max(1, Math.floor(canvas.height / px));
    var tctx = tmp.getContext('2d');
    tctx.drawImage(canvas, 0, 0, tmp.width, tmp.height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tmp, 0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
  }

  /**
   * Apply basic sharpen via convolution
   */
  function sharpen(canvas, ctx) {
    var d = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var px = d.data, w = canvas.width;
    var kernel = [0,-1,0,-1,5,-1,0,-1,0];
    var out = new Uint8ClampedArray(px.length);
    for (var y = 1; y < canvas.height - 1; y++) {
      for (var x = 1; x < w - 1; x++) {
        var i = (y * w + x) * 4;
        for (var c = 0; c < 3; c++) {
          var v = 0;
          for (var ky = -1; ky <= 1; ky++) {
            for (var kx = -1; kx <= 1; kx++) {
              var ki = ((y+ky)*w + (x+kx))*4 + c;
              v += px[ki] * kernel[(ky+1)*3 + (kx+1)];
            }
          }
          out[i+c] = Math.min(255, Math.max(0, v));
        }
        out[i+3] = px[i+3];
      }
    }
    ctx.putImageData(new ImageData(out, canvas.width, canvas.height), 0, 0);
  }

  /**
   * Core processing function
   * Returns a Promise resolving to a Blob
   * @param {HTMLImageElement} img - source image
   * @param {Object} state - current app state
   * @returns {Promise<Blob>}
   */
  function process(img, state) {
    return new Promise(function (resolve, reject) {
      try {
        var tw = state.targetW || img.width;
        var th = state.targetH || img.height;
        var rot = state.rotation;
        var isRotated = (rot === 'r90' || rot === 'r270');

        var canvas = document.createElement('canvas');
        canvas.width  = isRotated ? th : tw;
        canvas.height = isRotated ? tw : th;
        var ctx = canvas.getContext('2d');

        /* 1 — Apply rotation/flip */
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        if (rot === 'r90')  ctx.rotate(Math.PI / 2);
        if (rot === 'r180') ctx.rotate(Math.PI);
        if (rot === 'r270') ctx.rotate(-Math.PI / 2);
        if (rot === 'fh')   ctx.scale(-1, 1);
        if (rot === 'fv')   ctx.scale(1, -1);

        /* 2 — Apply effects filter */
        var filter = getFilter(state);
        if (filter) ctx.filter = filter;

        ctx.drawImage(img, -tw / 2, -th / 2, tw, th);
        ctx.restore();
        ctx.filter = 'none';

        /* 3 — Apply blur / sharpen */
        if (state.activePanel === 'blur') {
          if (state.blurType === 'gaussian') {
            ctx.filter = 'blur(' + state.blurAmount + 'px)';
            var tmp2 = document.createElement('canvas');
            tmp2.width = canvas.width; tmp2.height = canvas.height;
            tmp2.getContext('2d').drawImage(canvas, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(tmp2, 0, 0);
            ctx.filter = 'none';
          } else if (state.blurType === 'pixelate') {
            pixelate(canvas, ctx, state.blurAmount);
          } else if (state.blurType === 'sharpen') {
            sharpen(canvas, ctx);
          }
        }

        /* 4 — Determine output MIME */
        var mime = state.format === 'original'
          ? (state.fileMime || 'image/jpeg')
          : state.format;
        if (mime === 'image/gif') mime = 'image/png'; /* GIF → PNG fallback */

        /* 5 — Quality */
        var q = (mime === 'image/png') ? undefined : state.quality / 100;

        canvas.toBlob(function (blob) {
          if (!blob) return reject(new Error('Encoding failed'));
          resolve({ blob: blob, mime: mime, canvas: canvas });
        }, mime, q);

      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Generate a live preview by drawing on an <img> element via object URL
   * Uses a small debounce to avoid thrashing on slider drag
   */
  var _liveTimer = null;
  function livePreview(img, state, targetImg, debounceMs) {
    clearTimeout(_liveTimer);
    _liveTimer = setTimeout(function () {
      process(img, state)
        .then(function (res) {
          var url = URL.createObjectURL(res.blob);
          var old = targetImg.src;
          targetImg.src = url;
          if (old && old.startsWith('blob:')) URL.revokeObjectURL(old);
        })
        .catch(function (e) { console.warn('[VeloProcessor] livePreview error:', e); });
    }, debounceMs || 120);
  }

  /**
   * Format bytes to human-readable string
   */
  function fmtBytes(b) {
    if (b < 1024)        return b + ' B';
    if (b < 1048576)     return Math.round(b / 1024) + ' KB';
    return (b / 1048576).toFixed(1) + ' MB';
  }

  /**
   * Get file extension from MIME type
   */
  function mimeToExt(mime) {
    var map = {
      'image/jpeg': 'jpg',
      'image/png':  'png',
      'image/webp': 'webp',
      'image/avif': 'avif',
      'image/gif':  'gif',
    };
    return map[mime] || mime.split('/')[1] || 'jpg';
  }

  return { process: process, livePreview: livePreview, fmtBytes: fmtBytes, mimeToExt: mimeToExt };
})();
