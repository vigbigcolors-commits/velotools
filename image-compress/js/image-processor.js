/**
 * VeloTools — image-processor.js v7.3
 * Canvas-based: resize, rotate, flip, CSS filters, pixel effects.
 * Returns Promise<{blob, mime, canvas}>.
 *
 * v7.3 changes:
 *   - cancelLive() — kills pending live previews (prevents blur→crop race)
 *   - _downscaleSource() — multi-step downscale for quality resize
 *   - ms=0 no longer silently becomes 130ms
 *   - imageSmoothingQuality = 'high'
 */
window.VProcessor = (function () {
  'use strict';

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

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.save();
        ctx.translate(canvas.width/2, canvas.height/2);
        if (rot==='r90')  ctx.rotate(Math.PI/2);
        if (rot==='r180') ctx.rotate(Math.PI);
        if (rot==='r270') ctx.rotate(-Math.PI/2);
        if (rot==='fh')   ctx.scale(-1,1);
        if (rot==='fv')   ctx.scale(1,-1);

        if (s.activePanel === 'effects') {
          var f = VEffects.cssFilter(s);
          if (f) ctx.filter = f;
        }

        var srcForDraw = _downscaleSource(img, tw, th);
        ctx.drawImage(srcForDraw, -tw/2, -th/2, tw, th);
        ctx.restore();
        ctx.filter = 'none';

        if (s.activePanel === 'effects') {
          VEffects.applySharpen(ctx, canvas.width, canvas.height, s.sharpness);
          VEffects.applyDenoise(ctx, canvas.width, canvas.height, s.denoise);
        }

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

        var mime    = VConverter.resolveMime(s.format, s.fileMime);
        var effort  = s.webpEffort  || 4;
        var lossless = s.webpLossless || false;

        var encodeCanvas = _fitCanvasForEncode(canvas, mime);

        /* High-effort WebP pre-processing: mild sub-pixel smoothing removes
           high-frequency noise that resists compression — simulates the block
           analysis passes in cwebp -m 5/6. Skip when lossless or non-WebP. */
        if (mime === 'image/webp' && !lossless && effort >= 5) {
          var pre = document.createElement('canvas');
          pre.width = encodeCanvas.width; pre.height = encodeCanvas.height;
          pre.getContext('2d').drawImage(encodeCanvas, 0, 0);
          var ectx = encodeCanvas.getContext('2d');
          ectx.filter = 'blur(0.45px)';
          ectx.clearRect(0, 0, encodeCanvas.width, encodeCanvas.height);
          ectx.drawImage(pre, 0, 0);
          ectx.filter = 'none';
        }

        VConverter.encodeEffort(encodeCanvas, mime, s.quality, effort, lossless).then(function (result) {
          var blob = result.blob || result;
          var outMime = result.mime || mime;
          resolve({ blob: blob, mime: outMime, canvas: canvas });
        }).catch(reject);

      } catch(e) { reject(e); }
    });
  }

  /* Live preview with generation-based race protection.
     Each request gets a generation number. If a newer request arrives
     or cancelLive() is called before the async result lands, the stale
     result is silently dropped — never written to the preview <img>. */
  var _t = null;
  var _gen = 0;
  function livePreview(img, state, targetEl, ms) {
    clearTimeout(_t);
    var myGen = ++_gen;
    _t = setTimeout(function () {
      if (myGen !== _gen) return;
      process(img, state).then(function (r) {
        if (myGen !== _gen) return;
        var url = URL.createObjectURL(r.blob);
        var old = targetEl.src;
        targetEl.src = url;
        if (old && old.startsWith('blob:')) URL.revokeObjectURL(old);
      }).catch(function (err) {
        if (typeof console !== 'undefined' && console.warn) {
          console.warn('[VeloTools] live preview failed', err);
        }
      });
    }, (ms != null) ? ms : 130);
  }

  function cancelLive() {
    clearTimeout(_t);
    _gen++;
  }

  function _downscaleSource(img, tw, th) {
    var sw = img.width, sh = img.height;
    if (tw >= sw || th >= sh) return img;
    if (sw / tw < 2 && sh / th < 2) return img;
    var curW = sw, curH = sh, src = img;
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

  function _fitCanvasForEncode(canvas, mime) {
    var maxEdge = (mime === 'image/webp' || mime === 'image/avif') ? 4096 : 8192;
    var w = canvas.width;
    var h = canvas.height;
    if (w <= maxEdge && h <= maxEdge) return canvas;
    var scale = Math.min(maxEdge / w, maxEdge / h, 1);
    var nw = Math.max(1, Math.round(w * scale));
    var nh = Math.max(1, Math.round(h * scale));
    var c = document.createElement('canvas');
    c.width = nw;
    c.height = nh;
    var cx = c.getContext('2d');
    cx.imageSmoothingEnabled = true;
    cx.imageSmoothingQuality = 'high';
    cx.drawImage(canvas, 0, 0, nw, nh);
    return c;
  }

  return { process:process, livePreview:livePreview, cancelLive:cancelLive };
})();