/**
 * VeloTools — image-processor.js
 * Canvas-based: resize, rotate, flip, CSS filters, pixel effects.
 * Returns Promise<{blob, mime, canvas}>.
 */
window.VProcessor = (function () {
  'use strict';

  /**
   * Main processing pipeline.
   * @param {HTMLImageElement} img
   * @param {Object} s  — snapshot of VState
   * @returns {Promise<{blob,mime,canvas}>}
   */
  function process(img, s) {
    return new Promise(function (resolve, reject) {
      try {
        var tw = s.targetW || img.width;
        var th = s.targetH || img.height;
        var rot = s.rotation;
        var rotated = (rot==='r90'||rot==='r270');

        var canvas = document.createElement('canvas');
        canvas.width  = rotated ? th : tw;
        canvas.height = rotated ? tw : th;
        var ctx = canvas.getContext('2d');

        /* 1 — rotation / flip */
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.save();
        ctx.translate(canvas.width/2, canvas.height/2);
        if (rot==='r90')  ctx.rotate(Math.PI/2);
        if (rot==='r180') ctx.rotate(Math.PI);
        if (rot==='r270') ctx.rotate(-Math.PI/2);
        if (rot==='fh')   ctx.scale(-1,1);
        if (rot==='fv')   ctx.scale(1,-1);

        /* 2 — CSS filter (brightness/contrast/sat/hue) */
        if (s.activePanel === 'effects') {
          var f = VEffects.cssFilter(s);
          if (f) ctx.filter = f;
        }

        // Многошаговое уменьшение: одношаговый downscale >2× даёт алиасинг
        // (рваные линии — фатально для штриховых рисунков). Уменьшаем
        // поэтапно вдвое, пока не приблизимся к цели.
        var srcForDraw = _downscaleSource(img, tw, th);
        ctx.drawImage(srcForDraw, -tw/2, -th/2, tw, th);
        ctx.restore();
        ctx.filter = 'none';

        /* 3 — pixel-level effects */
        if (s.activePanel === 'effects') {
          VEffects.applySharpen(ctx, canvas.width, canvas.height, s.sharpness);
          VEffects.applyDenoise(ctx, canvas.width, canvas.height, s.denoise);
        }

        /* 4 — blur panel */
        if (s.activePanel === 'blur') {
          if (s.blurType === 'gaussian') {
            ctx.filter = 'blur('+s.blurAmt+'px)';
            var tmp = document.createElement('canvas');
            tmp.width = canvas.width; tmp.height = canvas.height;
            tmp.getContext('2d').drawImage(canvas, 0, 0);
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.drawImage(tmp, 0, 0);
            ctx.filter = 'none';
          } else if (s.blurType === 'pixelate') {
            VEffects.applyPixelate(ctx, canvas, s.blurAmt);
          } else if (s.blurType === 'sharpen') {
            VEffects.applySharpen(ctx, canvas.width, canvas.height, s.blurAmt * 3);
          }
        }

        /* 5 — encode */
        var mime = VConverter.resolveMime(s.format, s.fileMime);
        VConverter.encode(canvas, mime, s.quality).then(function (blob) {
          resolve({ blob:blob, mime:mime, canvas:canvas });
        }).catch(reject);

      } catch(e) { reject(e); }
    });
  }

  /** Debounced live preview */
  var _t = null;
  function livePreview(img, state, targetEl, ms) {
    clearTimeout(_t);
    _t = setTimeout(function () {
      process(img, state).then(function (r) {
        var url = URL.createObjectURL(r.blob);
        var old = targetEl.src;
        targetEl.src = url;
        if (old && old.startsWith('blob:')) URL.revokeObjectURL(old);
      }).catch(function(){});
    }, ms || 130);
  }

  /**
   * Поэтапное уменьшение вдвое до целевого размера.
   * Если уменьшение слабее 2× — возвращаем оригинал (хватит one-pass).
   * Иначе режем размер пополам за проход — браузерный bilinear на
   * шаге 2× почти не теряет качество, в отличие от резкого 5–10× downscale.
   */
  function _downscaleSource(img, tw, th) {
    var sw = img.width, sh = img.height;
    if (tw >= sw || th >= sh) return img;          // апскейл/равно — не трогаем
    if (sw / tw < 2 && sh / th < 2) return img;    // мягкое уменьшение — one-pass ок

    var curW = sw, curH = sh;
    var src = img;
    // Останавливаемся, когда следующий шаг /2 уже меньше цели
    while (curW / 2 >= tw && curH / 2 >= th) {
      curW = Math.round(curW / 2);
      curH = Math.round(curH / 2);
      var c = document.createElement('canvas');
      c.width = curW; c.height = curH;
      var cx = c.getContext('2d');
      cx.imageSmoothingEnabled = true;
      cx.imageSmoothingQuality = 'high';
      cx.drawImage(src, 0, 0, curW, curH);
      src = c;
    }
    return src;
  }

  return { process:process, livePreview:livePreview };
})();