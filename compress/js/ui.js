/**
 * VeloTools — ui.js v6.0
 * Fixes: Before/After (clip-path), adds Crop + Zoom on click
 */
(function () {
  'use strict';

  var S = VState;
  var P = VProcessor;
  var E = VEffects;
  var C = VConverter;

  function $(id) { return document.getElementById(id); }
  function $$(s) { return document.querySelectorAll(s); }

  /* ══════════════════════════════════
     CROP STATE
  ══════════════════════════════════ */
  var crop = {
    active: false,
    dragging: false,
    startX: 0, startY: 0,
    x: 0, y: 0, w: 0, h: 0,
    // Coords in image-space (actual pixels)
    imgX: 0, imgY: 0, imgW: 0, imgH: 0
  };

  /* ══════════════════════════════════
     ZOOM STATE
  ══════════════════════════════════ */
  var zoom = {
    on: false,
    level: 2,
    lensSize: 120
  };

  /* ══════════════════════════════════
     INIT
  ══════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', function () {
    var dz = $('v-dz');
    dz.addEventListener('dragover',  function(e){ e.preventDefault(); dz.classList.add('over'); });
    dz.addEventListener('dragleave', function(){ dz.classList.remove('over'); });
    dz.addEventListener('drop',      function(e){ e.preventDefault(); dz.classList.remove('over'); var f = e.dataTransfer.files[0]; if (f) loadFile(f); });

    $('v-qsl').addEventListener('input', function(){
      S.quality = parseInt(this.value);
      updateSlider(this, $('v-qnum'), this.value + '%');
      if (S.origImg) triggerLive();
    });
    updateSlider($('v-qsl'), $('v-qnum'), '80%');

    [['v-ef-br','brightness'],['v-ef-co','contrast'],['v-ef-sa','saturation'],
     ['v-ef-hu','hue'],['v-ef-sh','sharpness'],['v-ef-dn','denoise']].forEach(function(p){
      var el = $(p[0]); if (!el) return;
      el.addEventListener('input', function(){
        S[p[1]] = parseInt(this.value);
        var v = $(p[0]+'-v'); if (v) v.textContent = this.value + (p[1]==='hue' ? '°' : '');
        if (S.origImg && S.activePanel === 'effects') triggerLive();
      });
    });

    var ba = $('v-blur-amt');
    if (ba) ba.addEventListener('input', function(){
      S.blurAmt = parseInt(this.value);
      $('v-blur-amt-v').textContent = this.value;
      if (S.origImg && S.activePanel === 'blur') triggerLive();
    });

    $('v-rw').addEventListener('input', onW);
    $('v-rh').addEventListener('input', onH);

    if (window.VBatch) VBatch.init();
  });

  /* ══════════════════════════════════
     LOAD FILE
  ══════════════════════════════════ */
  window.loadFile = function(file) {
    if (!file || !file.type.startsWith('image/')) return;
    S.reset();
    S.file = file; S.fileMime = file.type || 'image/jpeg';
    syncAdjSliders(); resetRotBtns(); resetEfxBtns();
    cropReset();

    var r = new FileReader();
    r.onload = function(e) {
      S.origUrl = e.target.result;
      var img = new Image();
      img.onload = function() {
        S.origImg = img;
        S.origW = img.width; S.origH = img.height;
        S.ar = img.width / img.height;
        S.targetW = img.width; S.targetH = img.height;
        $('v-rw').value = img.width;
        $('v-rh').value = img.height;
        $('v-dz').style.display = 'none';
        $('v-editor').classList.add('on');
        var pi=$('v-prev-img'); pi.src=S.origUrl; pi.style.display='';
        setFInfo('v-fi-orig', file.name, file.size, img.width, img.height, file.type, null, null);
        $('v-result').classList.remove('on');
        checkPNG();
        switchPanel('compress', $('v-tb-compress'));
      };
      img.src = e.target.result;
    };
    r.readAsDataURL(file);
  };

  /* ══════════════════════════════════
     LIVE PREVIEW
  ══════════════════════════════════ */
  function triggerLive() {
    if (S.origImg) P.livePreview(S.origImg, snap(), $('v-prev-img'), 140);
  }

  function snap() {
    return {
      quality: S.quality, format: S.format, rotation: S.rotation,
      targetW: S.targetW || S.origW, targetH: S.targetH || S.origH,
      fileMime: S.fileMime, activePanel: S.activePanel,
      blurType: S.blurType, blurAmt: S.blurAmt,
      brightness: S.brightness, contrast: S.contrast,
      saturation: S.saturation, hue: S.hue,
      sharpness: S.sharpness, denoise: S.denoise
    };
  }

  /* ══════════════════════════════════
     PANELS
  ══════════════════════════════════ */
  window.switchPanel = function(id, btn) {
    ['compress','convert','resize','rotate','effects','blur','crop'].forEach(function(p) {
      var pan = $('v-pan-'+p), tb = $('v-tb-'+p);
      if (pan) pan.classList.remove('on');
      if (tb)  tb.classList.remove('on');
    });
    var pan = $('v-pan-'+id); if (pan) pan.classList.add('on');
    if (btn) btn.classList.add('on');
    S.activePanel = id;

    // Enter/exit crop mode
    if (id === 'crop') {
      enterCropMode();
    } else {
      exitCropMode();
    }

    var labels = {
      compress: '⚡ Compress Image', convert: '⚡ Convert Format',
      resize: '⚡ Resize Image',     rotate: '⚡ Apply Rotation',
      effects: '⚡ Apply Effects',   blur: '⚡ Apply Blur',
      crop: '✂️ Crop Image'
    };
    $('v-gobtn').textContent = labels[id] || '⚡ Process';
    checkPNG();
    if (S.origImg && id !== 'crop') triggerLive();
  };

  /* ══════════════════════════════════
     SETTINGS
  ══════════════════════════════════ */
  window.setQPreset  = function(v) { $('v-qsl').value = v; S.quality = v; updateSlider($('v-qsl'), $('v-qnum'), v+'%'); if (S.origImg) triggerLive(); };
  window.setFmt      = function(fmt, btn) { S.format = fmt; $$('.v-fmt').forEach(function(b){ b.classList.remove('on'); }); btn.classList.add('on'); checkPNG(); if (S.origImg) triggerLive(); };
  window.setRot      = function(r, btn) { S.rotation = (S.rotation === r) ? null : r; resetRotBtns(); if (S.rotation) btn.classList.add('on'); if (S.origImg) triggerLive(); };
  window.setBlur     = function(t, btn) { S.blurType = t; $$('.v-blbtn').forEach(function(b){ b.classList.remove('on'); }); btn.classList.add('on'); if (S.origImg && S.activePanel==='blur') triggerLive(); };
  window.applyPreset = function(name, btn) { E.applyPreset(name, S); $$('.v-ebtn').forEach(function(b){ b.classList.remove('on'); }); btn.classList.add('on'); syncAdjSliders(); if (S.origImg) triggerLive(); };
  window.toggleLock  = function() { S.lockAR = !S.lockAR; $('v-lkbtn').classList.toggle('on', S.lockAR); };
  window.qResize     = function(w, h) { S.targetW=w; S.targetH=h; S.lockAR=false; $('v-rw').value=w; $('v-rh').value=h; $('v-lkbtn').classList.remove('on'); };
  window.autoWebP    = function() { S.format='image/webp'; $$('.v-fmt').forEach(function(b){ b.classList.remove('on'); }); $('v-fmt-webp').classList.add('on'); $('v-warn').classList.remove('on'); switchPanel('convert', $('v-tb-convert')); };

  function onW() { var w = parseInt($('v-rw').value)||S.origW; S.targetW=w; if(S.lockAR){S.targetH=Math.round(w/S.ar);$('v-rh').value=S.targetH;} else {S.targetH=parseInt($('v-rh').value)||S.origH;} }
  function onH() { var h = parseInt($('v-rh').value)||S.origH; S.targetH=h; if(S.lockAR){S.targetW=Math.round(h*S.ar);$('v-rw').value=S.targetW;} else {S.targetW=parseInt($('v-rw').value)||S.origW;} }

  /* ══════════════════════════════════
     CROP — v2  (precise coordinate mapping)

     Root causes fixed:
     1. Canvas coords mapped via getImageRenderRect()
        which accounts for object-fit:contain letterboxing.
     2. Listeners stored + removed properly — no accumulation.
     3. imgX/Y/W/H derived from render-rect scale, not canvas scale.
  ══════════════════════════════════ */

  // ── Persistent listener refs so we can removeEventListener ──
  var _cropBound = {};

  /**
   * Returns the actual rendered rectangle of the <img> element
   * inside its container, accounting for object-fit:contain.
   * All coords relative to the canvas element's top-left.
   *
   * @returns {{ x, y, w, h, scaleX, scaleY }}
   */
  function getImageRenderRect() {
    var img    = $('v-prev-img');
    var canvas = $('v-crop-canvas');
    if (!img || !canvas) return {x:0,y:0,w:0,h:0,scaleX:1,scaleY:1};

    // Displayed size of the canvas (= v-preview container)
    var cw = canvas.offsetWidth  || canvas.width;
    var ch = canvas.offsetHeight || canvas.height;

    // Natural image dimensions
    var iw = S.origW || img.naturalWidth;
    var ih = S.origH || img.naturalHeight;

    if (!iw || !ih) return {x:0,y:0,w:cw,h:ch,scaleX:1,scaleY:1};

    // Fit image inside container preserving aspect ratio (object-fit:contain)
    var containerRatio = cw / ch;
    var imageRatio     = iw / ih;
    var rw, rh;
    if (imageRatio > containerRatio) {
      rw = cw;
      rh = cw / imageRatio;
    } else {
      rh = ch;
      rw = ch * imageRatio;
    }
    rw = Math.round(rw);
    rh = Math.round(rh);

    // Centered offset (letterbox / pillarbox)
    var rx = Math.round((cw - rw) / 2);
    var ry = Math.round((ch - rh) / 2);

    return {
      x: rx, y: ry, w: rw, h: rh,
      scaleX: iw / rw,   // canvas-px → image-px
      scaleY: ih / rh
    };
  }

  /**
   * Convert a clientX/clientY mouse event into canvas-space coordinates,
   * then clamp to the rendered image rect.
   */
  function getCropPoint(e) {
    var canvas = $('v-crop-canvas');
    var domRect = canvas.getBoundingClientRect();

    // DOM → canvas pixel ratio (canvas internal resolution vs CSS size)
    var cssW  = domRect.width  || 1;
    var cssH  = domRect.height || 1;
    var ratioX = canvas.width  / cssW;
    var ratioY = canvas.height / cssH;

    var cx = (e.clientX - domRect.left)  * ratioX;
    var cy = (e.clientY - domRect.top)   * ratioY;

    // Clamp to rendered image area
    var r = getImageRenderRect();
    cx = Math.max(r.x, Math.min(cx, r.x + r.w));
    cy = Math.max(r.y, Math.min(cy, r.y + r.h));

    return { x: Math.round(cx), y: Math.round(cy) };
  }

  function enterCropMode() {
    crop.active = true;
    cropReset();

    var wrap = $('v-preview');
    wrap.classList.add('crop-mode');

    // Ensure canvas overlay exists
    var canvas = $('v-crop-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'v-crop-canvas';
      canvas.style.cssText = [
        'position:absolute','top:0','left:0',
        'width:100%','height:100%',
        'cursor:crosshair','touch-action:none','z-index:15'
      ].join(';');
      wrap.style.position = 'relative'; // safety
      wrap.appendChild(canvas);
    }
    canvas.style.display = 'block';

    // Size canvas buffer to match container CSS pixels
    syncCropCanvasSize();

    // Build bound refs (needed for removeEventListener)
    _cropBound.start      = function(e){ e.preventDefault(); _cropHandleStart(e); };
    _cropBound.move       = function(e){ e.preventDefault(); _cropHandleMove(e); };
    _cropBound.end        = function(e){ _cropHandleEnd(); };
    _cropBound.tStart     = function(e){ e.preventDefault(); _cropHandleStart(e.touches[0]); };
    _cropBound.tMove      = function(e){ e.preventDefault(); _cropHandleMove(e.touches[0]); };
    _cropBound.tEnd       = function(){ _cropHandleEnd(); };
    _cropBound.resize     = function(){ syncCropCanvasSize(); drawCropOverlay(); };

    canvas.addEventListener('mousedown',  _cropBound.start);
    canvas.addEventListener('mousemove',  _cropBound.move);
    canvas.addEventListener('mouseup',    _cropBound.end);
    canvas.addEventListener('touchstart', _cropBound.tStart, {passive:false});
    canvas.addEventListener('touchmove',  _cropBound.tMove,  {passive:false});
    canvas.addEventListener('touchend',   _cropBound.tEnd);
    window.addEventListener('resize',     _cropBound.resize);

    drawCropOverlay(); // draw empty state
  }

  function exitCropMode() {
    crop.active = false;
    var wrap = $('v-preview');
    wrap.classList.remove('crop-mode');

    var canvas = $('v-crop-canvas');
    if (canvas) {
      canvas.style.display = 'none';
      canvas.removeEventListener('mousedown',  _cropBound.start);
      canvas.removeEventListener('mousemove',  _cropBound.move);
      canvas.removeEventListener('mouseup',    _cropBound.end);
      canvas.removeEventListener('touchstart', _cropBound.tStart);
      canvas.removeEventListener('touchmove',  _cropBound.tMove);
      canvas.removeEventListener('touchend',   _cropBound.tEnd);
    }
    window.removeEventListener('resize', _cropBound.resize);
    _cropBound = {};
  }

  /** Match canvas buffer size to its CSS-rendered size */
  function syncCropCanvasSize() {
    var canvas = $('v-crop-canvas');
    var wrap   = $('v-preview');
    if (!canvas || !wrap) return;
    // Use devicePixelRatio for crisp lines on retina
    var dpr = window.devicePixelRatio || 1;
    var w   = wrap.offsetWidth;
    var h   = wrap.offsetHeight;
    if (!w || !h) return;
    canvas.width  = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width  = w + 'px';
    canvas.style.height = h + 'px';
  }

  /* ── Event handlers ── */
  function _cropHandleStart(e) {
    var pt = getCropPoint(e);
    crop.dragging = true;
    crop.startX = pt.x; crop.startY = pt.y;
    crop.x = pt.x; crop.y = pt.y;
    crop.w = 0;    crop.h = 0;
  }

  function _cropHandleMove(e) {
    if (!crop.dragging) return;
    var pt  = getCropPoint(e);  // already clamped to image rect
    var r   = getImageRenderRect();
    var dpr = window.devicePixelRatio || 1;

    // Clamp start point as well (in case we didn't clamp on mousedown)
    var sx = Math.max(r.x, Math.min(crop.startX, r.x + r.w));
    var sy = Math.max(r.y, Math.min(crop.startY, r.y + r.h));

    crop.x = Math.min(sx, pt.x);
    crop.y = Math.min(sy, pt.y);
    crop.w = Math.abs(pt.x - sx);
    crop.h = Math.abs(pt.y - sy);

    drawCropOverlay();
    updateCropInfo();
  }

  function _cropHandleEnd() {
    crop.dragging = false;
    if (crop.w < 4 || crop.h < 4) {
      cropReset();
      drawCropOverlay();
      return;
    }
    _calcCropImgCoords();
    updateCropInfo();
  }

  /**
   * Map canvas-space selection (crop.x/y/w/h) →
   * actual image pixel coords (crop.imgX/Y/W/H).
   *
   * Uses getImageRenderRect() for precise scaling.
   */
  function _calcCropImgCoords() {
    var r   = getImageRenderRect();
    var dpr = window.devicePixelRatio || 1;

    // crop.x/y are in canvas buffer pixels (already include dpr)
    // r.x/y/w/h are in CSS pixels — convert to buffer pixels
    var bx = r.x * dpr, by = r.y * dpr;
    var bw = r.w * dpr, bh = r.h * dpr;

    // Selection relative to image render rect
    var relX = (crop.x - bx) / bw;
    var relY = (crop.y - by) / bh;
    var relW = crop.w / bw;
    var relH = crop.h / bh;

    // Clamp 0..1
    relX = Math.max(0, Math.min(relX, 1));
    relY = Math.max(0, Math.min(relY, 1));
    relW = Math.max(0, Math.min(relW, 1 - relX));
    relH = Math.max(0, Math.min(relH, 1 - relY));

    crop.imgX = Math.round(relX * S.origW);
    crop.imgY = Math.round(relY * S.origH);
    crop.imgW = Math.round(relW * S.origW);
    crop.imgH = Math.round(relH * S.origH);
  }

  /* ── Overlay drawing ── */
  function drawCropOverlay() {
    var canvas = $('v-crop-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var cw  = canvas.width, ch = canvas.height;
    var dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, cw, ch);

    if (crop.w < 2 || crop.h < 2) return;

    // ── 1. Dark vignette outside selection ──
    ctx.fillStyle = 'rgba(0,0,0,0.52)';
    ctx.fillRect(0, 0, cw, ch);

    // Cut out (restore) the selected rectangle
    ctx.clearRect(crop.x, crop.y, crop.w, crop.h);

    // ── 2. Subtle inner shadow on selected area ──
    ctx.save();
    ctx.beginPath();
    ctx.rect(crop.x, crop.y, crop.w, crop.h);
    ctx.clip();
    var grad = ctx.createRadialGradient(
      crop.x + crop.w/2, crop.y + crop.h/2, Math.min(crop.w, crop.h) * 0.25,
      crop.x + crop.w/2, crop.y + crop.h/2, Math.max(crop.w, crop.h) * 0.75
    );
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.14)');
    ctx.fillStyle = grad;
    ctx.fillRect(crop.x, crop.y, crop.w, crop.h);
    ctx.restore();

    // ── 3. Selection border ──
    ctx.strokeStyle = '#5b6cf9';
    ctx.lineWidth = Math.round(1.5 * dpr);
    ctx.setLineDash([]);
    ctx.strokeRect(crop.x + ctx.lineWidth/2, crop.y + ctx.lineWidth/2,
                   crop.w - ctx.lineWidth,   crop.h - ctx.lineWidth);

    // ── 4. Rule-of-thirds ──
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = Math.round(dpr);
    ctx.setLineDash([Math.round(4*dpr), Math.round(4*dpr)]);
    var x3 = crop.w / 3, y3 = crop.h / 3;
    [1, 2].forEach(function(i) {
      ctx.beginPath();
      ctx.moveTo(crop.x + x3*i, crop.y);
      ctx.lineTo(crop.x + x3*i, crop.y + crop.h);
      ctx.moveTo(crop.x,         crop.y + y3*i);
      ctx.lineTo(crop.x + crop.w, crop.y + y3*i);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // ── 5. Corner handles ──
    var hs = Math.round(8 * dpr); // handle size
    var corners = [
      [crop.x,             crop.y            ],  // TL
      [crop.x + crop.w,    crop.y            ],  // TR
      [crop.x,             crop.y + crop.h   ],  // BL
      [crop.x + crop.w,    crop.y + crop.h   ],  // BR
      [crop.x + crop.w/2,  crop.y            ],  // TC
      [crop.x + crop.w/2,  crop.y + crop.h   ],  // BC
      [crop.x,             crop.y + crop.h/2 ],  // ML
      [crop.x + crop.w,    crop.y + crop.h/2 ],  // MR
    ];
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#5b6cf9';
    ctx.lineWidth = Math.round(1.5 * dpr);
    corners.forEach(function(c) {
      ctx.beginPath();
      ctx.arc(c[0], c[1], hs/2, 0, Math.PI*2);
      ctx.fill();
      ctx.stroke();
    });

    // ── 6. Dimensions badge ──
    if (S.origW && S.origH) {
      _calcCropImgCoords(); // update live
      var label = crop.imgW + ' × ' + crop.imgH + ' px';
      var fs = Math.round(11 * dpr);
      ctx.font = 'bold ' + fs + 'px Inter,system-ui,sans-serif';
      ctx.textBaseline = 'middle';
      var tw = ctx.measureText(label).width;
      var pad = Math.round(6 * dpr), bh2 = Math.round(22 * dpr);
      var bx = crop.x + crop.w/2 - tw/2 - pad;
      var by2 = crop.y + crop.h - bh2 - Math.round(8 * dpr);
      // Keep in canvas bounds
      bx = Math.max(0, Math.min(bx, cw - tw - pad*2));
      by2 = Math.max(0, by2);
      // Badge bg
      ctx.fillStyle = 'rgba(91,108,249,0.9)';
      ctx.beginPath();
      var radius = Math.round(4 * dpr);
      ctx.roundRect(bx, by2, tw + pad*2, bh2, radius);
      ctx.fill();
      // Text
      ctx.fillStyle = '#fff';
      ctx.fillText(label, bx + pad, by2 + bh2/2);
    }
  }

  /* ── Public API ── */
  function cropReset() {
    crop.x=0; crop.y=0; crop.w=0; crop.h=0;
    crop.startX=0; crop.startY=0;
    crop.imgX=0; crop.imgY=0; crop.imgW=0; crop.imgH=0;
    crop.dragging = false;
    var info = $('v-crop-info');
    if (info) info.textContent = 'Draw a selection on the image above';
  }

  function updateCropInfo() {
    var info = $('v-crop-info');
    if (!info) return;
    if (crop.imgW > 0 && crop.imgH > 0) {
      info.textContent = crop.imgW + ' × ' + crop.imgH + ' px selected — click "Apply crop" to confirm';
    }
  }

  window.applyCrop = function() {
    if (!S.origImg) { alert('Load an image first.'); return; }
    _calcCropImgCoords();
    if (crop.imgW < 2 || crop.imgH < 2) { alert('Draw a selection first.'); return; }

    var c = document.createElement('canvas');
    c.width  = crop.imgW;
    c.height = crop.imgH;
    c.getContext('2d').drawImage(
      S.origImg,
      crop.imgX, crop.imgY, crop.imgW, crop.imgH,
      0, 0,      crop.imgW, crop.imgH
    );

    var mime   = S.fileMime || 'image/png';
    var newUrl = c.toDataURL(mime, 1.0);
    var newImg = new Image();

    newImg.onload = function() {
      // Commit crop to state
      S.origImg = newImg;
      S.origW   = crop.imgW;
      S.origH   = crop.imgH;
      S.ar      = crop.imgW / crop.imgH;
      S.targetW = crop.imgW;
      S.targetH = crop.imgH;
      S.origUrl = newUrl;

      $('v-rw').value = crop.imgW;
      $('v-rh').value = crop.imgH;
      $('v-prev-img').src = newUrl;
      setFInfo('v-fi-orig', S.file ? S.file.name : 'cropped', 0, crop.imgW, crop.imgH, mime, null, null);

      var info = $('v-crop-info');
      if (info) info.textContent = '✓ Cropped to ' + crop.imgW + ' × ' + crop.imgH + ' px';

      cropReset();
      exitCropMode();
      switchPanel('compress', $('v-tb-compress'));
    };
    newImg.src = newUrl;
  };

  window.resetCrop = function() {
    cropReset();
    drawCropOverlay();
  };

    /* ══════════════════════════════════
     ZOOM ON CLICK (magnifier lens)
  ══════════════════════════════════ */
  window.toggleZoom = function(btn) {
    zoom.on = !zoom.on;
    var wrap = $('v-preview');
    var img  = $('v-prev-img');
    if (zoom.on) {
      wrap.classList.add('zoom-on');
      btn.classList.add('on');
      btn.querySelector('span').textContent = 'Zoom off';
      setupZoom(wrap, img);
    } else {
      disableZoom(wrap, btn);
    }
  };

  function setupZoom(wrap, img) {
    var lens = $('v-zoom-lens');
    if (!lens) {
      lens = document.createElement('div');
      lens.id = 'v-zoom-lens';
      lens.style.cssText =
        'position:absolute;width:'+zoom.lensSize+'px;height:'+zoom.lensSize+'px;'+
        'border:2px solid #5b6cf9;border-radius:50%;pointer-events:none;'+
        'box-shadow:0 4px 20px rgba(0,0,0,.35);overflow:hidden;display:none;z-index:20;'+
        'background:#0f1117';
      var lensImg = document.createElement('img');
      lensImg.id = 'v-zoom-img';
      lensImg.style.cssText = 'position:absolute;pointer-events:none';
      lens.appendChild(lensImg);
      wrap.appendChild(lens);
    }

    function onMove(e) {
      if (!zoom.on) return;
      var imgEl = $('v-prev-img');
      var rect  = imgEl.getBoundingClientRect();
      var ex = (e.touches ? e.touches[0].clientX : e.clientX);
      var ey = (e.touches ? e.touches[0].clientY : e.clientY);
      var mx = ex - rect.left;
      var my = ey - rect.top;

      if (mx < 0 || my < 0 || mx > rect.width || my > rect.height) {
        lens.style.display = 'none'; return;
      }
      lens.style.display = 'block';

      // Position lens centered on cursor, offset upward so it doesn't cover finger
      var lx = mx - zoom.lensSize / 2;
      var ly = my - zoom.lensSize / 2 - (e.touches ? 80 : 0);
      // Keep within wrap bounds
      var wrapRect = wrap.getBoundingClientRect();
      lx = Math.max(0, Math.min(lx, wrapRect.width  - zoom.lensSize));
      ly = Math.max(0, Math.min(ly, wrapRect.height - zoom.lensSize));
      lens.style.left = lx + 'px';
      lens.style.top  = ly + 'px';

      // Zoomed image inside lens
      var scaleX = S.origW / rect.width;
      var scaleY = S.origH / rect.height;
      var zw = zoom.lensSize * scaleX / zoom.level;
      var zh = zoom.lensSize * scaleY / zoom.level;
      var zx = mx * scaleX - zw / 2;
      var zy = my * scaleY - zh / 2;
      zx = Math.max(0, Math.min(zx, S.origW - zw));
      zy = Math.max(0, Math.min(zy, S.origH - zh));

      // Draw crop of original onto lens via canvas
      var lc = document.createElement('canvas');
      lc.width = zoom.lensSize; lc.height = zoom.lensSize;
      lc.getContext('2d').drawImage(S.origImg, zx, zy, zw, zh, 0, 0, zoom.lensSize, zoom.lensSize);
      $('v-zoom-img').src = lc.toDataURL();
      $('v-zoom-img').style.width  = zoom.lensSize + 'px';
      $('v-zoom-img').style.height = zoom.lensSize + 'px';
      $('v-zoom-img').style.left   = '0';
      $('v-zoom-img').style.top    = '0';
    }

    function onLeave() { lens.style.display = 'none'; }

    wrap._zoomMove  = onMove;
    wrap._zoomLeave = onLeave;
    wrap.addEventListener('mousemove',  onMove);
    wrap.addEventListener('mouseleave', onLeave);
    wrap.addEventListener('touchmove',  onMove, {passive:true});
    wrap.addEventListener('touchend',   onLeave);
  }

  function disableZoom(wrap, btn) {
    zoom.on = false;
    wrap.classList.remove('zoom-on');
    if (btn) { btn.classList.remove('on'); var sp = btn.querySelector('span'); if (sp) sp.textContent = 'Zoom'; }
    var lens = $('v-zoom-lens');
    if (lens) lens.style.display = 'none';
    if (wrap._zoomMove)  wrap.removeEventListener('mousemove',  wrap._zoomMove);
    if (wrap._zoomLeave) wrap.removeEventListener('mouseleave', wrap._zoomLeave);
    if (wrap._zoomMove)  wrap.removeEventListener('touchmove',  wrap._zoomMove);
  }

  /* ══════════════════════════════════
     PROCESS
  ══════════════════════════════════ */
  window.process = function() {
    if (!S.origImg) return;
    exitCropMode();
    $('v-proc').classList.add('on');
    $('v-gobtn').disabled = true;
    $('v-result').classList.remove('on');
    var pb = $('v-pb'), prog = 0;
    var iv = setInterval(function(){ prog = Math.min(prog+20, 88); pb.style.width = prog+'%'; }, 90);

    P.process(S.origImg, snap()).then(function(res) {
      clearInterval(iv); pb.style.width = '100%';
      S.resultBlob = res.blob;
      if (S.resultUrl) URL.revokeObjectURL(S.resultUrl);
      S.resultUrl = URL.createObjectURL(res.blob);
      S.resultExt = C.ext(res.mime);
      var ri=$('v-res-img'); ri.src=S.resultUrl; ri.style.display='';
      var base = S.file.name.replace(/\.[^.]+$/, '');
      $('v-fnin').value = base + '_velo';
      $('v-fnext').textContent = '.' + S.resultExt;
      setFInfo('v-fi-res', base+'_velo.'+S.resultExt, res.blob.size, res.canvas.width, res.canvas.height, res.mime, S.file.size, res.blob.size);
      showCompare(S.file.size, res.blob.size, res.canvas.width, res.canvas.height);
      buildBA(S.origUrl, S.resultUrl, res.canvas.width, res.canvas.height);
      $('v-prev-img').src = S.origUrl;
      setTimeout(function(){
        $('v-proc').classList.remove('on');
        pb.style.width = '0%';
        $('v-gobtn').disabled = false;
        $('v-result').classList.add('on');
        $('v-result').scrollIntoView({behavior:'smooth', block:'start'});
      }, 280);
    }).catch(function(err){
      clearInterval(iv);
      $('v-proc').classList.remove('on');
      pb.style.width = '0%';
      $('v-gobtn').disabled = false;
      console.error('[VeloTools]', err);
      alert('Processing error. Please try another format.');
    });
  };

  /* ══════════════════════════════════
     BEFORE / AFTER — Fixed
     Uses clip-path instead of overlay
     width trick — no rendering artifacts
  ══════════════════════════════════ */
  function buildBA(origSrc, resSrc, canvasW, canvasH) {
    var wrap = $('v-ba-wrap');

    // Render both images on canvas to ensure identical dimensions
    function makeDataUrl(src, cb) {
      var img = new Image();
      img.onload = function() {
        var c = document.createElement('canvas');
        c.width  = canvasW || img.naturalWidth;
        c.height = canvasH || img.naturalHeight;
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        cb(c.toDataURL());
      };
      img.src = src;
    }

    makeDataUrl(origSrc, function(origData) {
      makeDataUrl(resSrc, function(resData) {
        wrap.innerHTML =
          '<div class="v-ba-lbl">Before / After — drag the handle</div>'+
          '<div id="v-bac" class="v-ba">'+
            /* Layer 1 — RESULT (bottom, full width always) */
            '<img id="v-ba-res" class="v-ba-layer" src="'+resData+'" alt="Result">'+
            /* Layer 2 — ORIGINAL (top, clipped) */
            '<img id="v-ba-orig" class="v-ba-layer v-ba-top" src="'+origData+'" alt="Original" style="clip-path:inset(0 50% 0 0)">'+
            /* Labels */
            '<span class="v-ba-tag" style="left:10px;background:rgba(0,0,0,.6)">BEFORE</span>'+
            '<span class="v-ba-tag" style="right:10px;background:rgba(91,108,249,.8)">AFTER</span>'+
            /* Handle */
            '<div id="v-ba-handle" class="v-ba-handle" style="left:50%">'+
              '<div class="v-ba-line"></div>'+
              '<div class="v-ba-knob">'+
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20"><path d="M9 18l-6-6 6-6M15 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>'+
              '</div>'+
            '</div>'+
          '</div>';

        initBADrag();
      });
    });
  }

  function initBADrag() {
    var container = $('v-bac');
    if (!container) return;
    var isDragging = false;

    function setPosition(clientX) {
      var rect = container.getBoundingClientRect();
      var pct  = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
      var orig = $('v-ba-orig');
      var handle = $('v-ba-handle');
      if (orig)   orig.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      if (handle) handle.style.left   = pct + '%';
    }

    container.addEventListener('mousedown', function(e) {
      isDragging = true;
      setPosition(e.clientX);
      e.preventDefault();
    });
    container.addEventListener('touchstart', function(e) {
      isDragging = true;
      setPosition(e.touches[0].clientX);
    }, {passive: true});
    document.addEventListener('mousemove', function(e) {
      if (isDragging) setPosition(e.clientX);
    });
    document.addEventListener('touchmove', function(e) {
      if (isDragging) setPosition(e.touches[0].clientX);
    }, {passive: true});
    document.addEventListener('mouseup',  function() { isDragging = false; });
    document.addEventListener('touchend', function() { isDragging = false; });
  }

  /* ══════════════════════════════════
     DOWNLOAD & EDIT RESULT
  ══════════════════════════════════ */
  window.dlFile = function() {
    if (!S.resultBlob) return;
    var nm = ($('v-fnin').value || 'compressed').trim();
    var ex = $('v-fnext').textContent.replace('.','');
    var a = document.createElement('a');
    a.href = S.resultUrl; a.download = nm+'.'+ex; a.click();
  };

  window.editResult = function() {
    if (!S.resultUrl || !S.resultBlob) return;
    var nm = ($('v-fnin').value || 'result') + '.' + S.resultExt;
    S.file = new File([S.resultBlob], nm, {type: S.resultBlob.type});
    S.fileMime = S.resultBlob.type; S.origUrl = S.resultUrl; S.rotation = null;
    var img = new Image();
    img.onload = function() {
      S.origImg = img; S.origW = img.width; S.origH = img.height;
      S.ar = img.width / img.height; S.targetW = img.width; S.targetH = img.height;
      $('v-rw').value = img.width; $('v-rh').value = img.height;
      var pi3=$('v-prev-img'); pi3.src=S.origUrl; pi3.style.display='';
      setFInfo('v-fi-orig', S.file.name, S.file.size, img.width, img.height, S.file.type, null, null);
      $('v-result').classList.remove('on'); S.resultBlob = null; S.resultUrl = null;
      checkPNG();
      window.scrollTo({top: $('v-editor').getBoundingClientRect().top + window.scrollY - 80, behavior:'smooth'});
    };
    img.src = S.origUrl;
  };

  window.newFile = function() {
    S.reset(); resetAdjSliders(); resetRotBtns(); resetEfxBtns(); cropReset(); exitCropMode();
    var pi4=$('v-prev-img'); if(pi4){pi4.src='';pi4.style.display='none';}
    $('v-editor').classList.remove('on');
    $('v-dz').style.display = '';
    $('v-fi').value = '';
    $('v-result').classList.remove('on');
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  window.openModal  = function(w) { var s = w===1 ? S.resultUrl : S.origUrl; if(!s) return; var mi=$('v-modal-img'); mi.src=s; mi.style.display=''; $('v-modal').classList.add('open'); document.body.style.overflow='hidden'; };
  window.closeModal = function() { $('v-modal').classList.remove('open'); document.body.style.overflow=''; };
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeModal(); });

  /* ══════════════════════════════════
     HELPERS
  ══════════════════════════════════ */
  function updateSlider(sl, numEl, text) {
    if (numEl) numEl.textContent = text;
    var v = parseInt(sl.value), pct = ((v-10)/90)*100;
    sl.style.background = 'linear-gradient(to right,var(--ac) '+pct+'%,var(--br-2) '+pct+'%)';
  }

  function checkPNG() {
    var warn = $('v-warn'); if (!warn) return;
    var isPNG = S.fileMime==='image/png' && S.format==='original' && S.activePanel==='compress';
    warn.classList.toggle('on', isPNG);
    var tip = $('v-png-tip'); if (tip) tip.style.display = isPNG ? 'inline' : 'none';
  }

  function setFInfo(elId, name, size, w, h, fmt, origSize, newSize) {
    var saved = (origSize && newSize && origSize > newSize) ? Math.round((1-newSize/origSize)*100) : null;
    var noSave = (origSize && newSize && saved <= 0);
    var fl = (fmt||'').split('/')[1]||'';
    fl = fl.replace('jpeg','JPG').replace('png','PNG').replace('webp','WebP').replace('avif','AVIF').toUpperCase();
    var el = $(elId); if (!el) return;
    el.innerHTML =
      '<span class="v-tag v-tag-lbl">'+(elId.includes('res')?'RESULT':'ORIGINAL')+':</span>'+
      '<span class="v-tag v-tag-nm">'+name+'</span>'+
      '<span class="v-tag v-tag-sz">'+C.fmtBytes(size)+'</span>'+
      '<span class="v-tag v-tag-dm">'+w+'×'+h+'</span>'+
      '<span class="v-tag v-tag-ft">'+fl+'</span>'+
      (saved > 0 ? '<span class="v-tag v-tag-ok">✓ Saved '+saved+'%</span>' : '')+
      (noSave    ? '<span class="v-tag v-tag-wa">⚠ PNG is lossless — use WebP</span>' : '');
  }

  function showCompare(orig, res, w, h) {
    var saved = Math.max(0, Math.round((1-res/orig)*100));
    var noGain = saved <= 0;
    $('v-cmp').innerHTML =
      '<div class="v-crow"><span class="v-clbl">Original</span><div class="v-cbw"><div class="v-cb" style="width:100%;background:var(--br-2)"></div></div><span class="v-cval">'+C.fmtBytes(orig)+'</span></div>'+
      '<div class="v-crow"><span class="v-clbl">Result</span><div class="v-cbw"><div class="v-cb" style="width:'+Math.round(res/orig*100)+'%;background:var(--gn)"></div></div><span class="v-cval">'+C.fmtBytes(res)+'</span></div>'+
      '<div class="v-cres" style="color:'+(noGain?'var(--am)':'var(--gn)')+'">'+
        (noGain ? '⚠ PNG is lossless — use Convert → WebP.' : '✓ '+saved+'% smaller — saved '+C.fmtBytes(orig-res))+
      '</div>';
  }

  function syncAdjSliders() {
    [['v-ef-br',S.brightness,''],['v-ef-co',S.contrast,''],['v-ef-sa',S.saturation,''],
     ['v-ef-hu',S.hue,'°'],['v-ef-sh',S.sharpness,''],['v-ef-dn',S.denoise,'']].forEach(function(m){
      var el = $(m[0]); if (!el) return; el.value = m[1];
      var vEl = $(m[0]+'-v'); if (vEl) vEl.textContent = m[1]+m[2];
    });
  }
  function resetAdjSliders() { S.brightness=100;S.contrast=100;S.saturation=100;S.hue=0;S.sharpness=0;S.denoise=0; syncAdjSliders(); }
  function resetRotBtns()    { $$('.v-rbtn').forEach(function(b){ b.classList.remove('on'); }); }
  function resetEfxBtns()    { $$('.v-ebtn').forEach(function(b){ b.classList.remove('on'); }); var n = $('v-efx-none'); if (n) n.classList.add('on'); }

  window.vTf = function(btn) { btn.parentElement.classList.toggle('op'); };
})();
