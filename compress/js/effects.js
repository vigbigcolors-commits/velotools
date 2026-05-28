/**
 * VeloTools — effects.js
 * CSS filter + pixel-level effects engine.
 * All operations are client-side via Canvas API.
 */
window.VEffects = (function () {
  'use strict';

  /** Build CSS filter string from state */
  function cssFilter(s) {
    var f = '';
    if (s.brightness  !== 100) f += 'brightness('+s.brightness+'%) ';
    if (s.contrast    !== 100) f += 'contrast('+s.contrast+'%) ';
    if (s.saturation  !== 100) f += 'saturate('+s.saturation+'%) ';
    if (s.hue         !== 0)   f += 'hue-rotate('+s.hue+'deg) ';
    return f.trim();
  }

  /** Apply sharpen convolution kernel */
  function applySharpen(ctx, w, h, amount) {
    if (!amount) return;
    var d = ctx.getImageData(0,0,w,h), px = d.data;
    var v = Math.min(amount/10, 1);
    var k = [0,-v,0,-v,1+4*v,-v,0,-v,0];
    var out = new Uint8ClampedArray(px.length);
    for (var y=1;y<h-1;y++) for (var x=1;x<w-1;x++) {
      var i=(y*w+x)*4;
      for (var c=0;c<3;c++) {
        var sum=0;
        for (var ky=-1;ky<=1;ky++) for (var kx=-1;kx<=1;kx++)
          sum+=px[((y+ky)*w+(x+kx))*4+c]*k[(ky+1)*3+(kx+1)];
        out[i+c]=Math.min(255,Math.max(0,sum));
      }
      out[i+3]=px[i+3];
    }
    ctx.putImageData(new ImageData(out,w,h),0,0);
  }

  /** Simple box-blur denoise */
  function applyDenoise(ctx, w, h, amount) {
    if (!amount) return;
    var r = Math.round(amount/20);
    if (r < 1) return;
    ctx.filter = 'blur('+r+'px)';
    var tmp = document.createElement('canvas');
    tmp.width=w; tmp.height=h;
    tmp.getContext('2d').drawImage(ctx.canvas,0,0);
    ctx.clearRect(0,0,w,h);
    ctx.drawImage(tmp,0,0);
    ctx.filter='none';
  }

  /** Pixelate */
  function applyPixelate(ctx, canvas, amount) {
    var px = Math.max(2, amount*3);
    var tmp = document.createElement('canvas');
    tmp.width  = Math.max(1, Math.floor(canvas.width/px));
    tmp.height = Math.max(1, Math.floor(canvas.height/px));
    tmp.getContext('2d').drawImage(canvas, 0, 0, tmp.width, tmp.height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tmp, 0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
  }

  /** Effect presets */
  var PRESETS = {
    none:      {brightness:100,contrast:100,saturation:100,hue:0,sharpness:0,denoise:0},
    grayscale: {brightness:100,contrast:110,saturation:0,  hue:0,sharpness:0,denoise:0},
    sepia:     {brightness:105,contrast:105,saturation:30, hue:28,sharpness:0,denoise:0},
    invert:    {brightness:100,contrast:100,saturation:100,hue:180,sharpness:0,denoise:0},
    warm:      {brightness:105,contrast:100,saturation:120,hue:12,sharpness:0,denoise:0},
    cool:      {brightness:100,contrast:105,saturation:90, hue:195,sharpness:0,denoise:0},
    vivid:     {brightness:110,contrast:120,saturation:150,hue:0,sharpness:5,denoise:0},
    matte:     {brightness:105,contrast:90, saturation:75, hue:0,sharpness:0,denoise:3},
  };

  function applyPreset(name, state) {
    var p = PRESETS[name] || PRESETS.none;
    Object.assign(state, p);
  }

  return { cssFilter:cssFilter, applySharpen:applySharpen, applyDenoise:applyDenoise, applyPixelate:applyPixelate, PRESETS:PRESETS, applyPreset:applyPreset };
})();
