/**
 * VeloTools — ui.js v7.2
 * Crop Fix: Added position: relative to container to prevent overlay bleed.
 * Added Floating "Apply Crop" button directly attached to the selection.
 */
(function () {
  'use strict';

  var S  = window.VState;
  var P  = window.VProcessor;
  var E  = window.VEffects;
  var C  = window.VConverter;
  var U  = window.VCore;
  var $  = U.$;
  var $$ = U.$$;
  var px = U.px;

  /* ─── CROP STATE ──────────────────────────────── */
  var CROP = {
    on: false,
    dragging: false,
    sx: 0, sy: 0,
    x: 0,  y: 0,
    w: 0,  h: 0,
    imgX: 0, imgY: 0, imgW: 0, imgH: 0
  };

  /* ─── ZOOM STATE ──────────────────────────────── */
  var ZOOM = { on: false };

  /* ═══════════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', function () {
    var dz = $('v-dz');
    if (dz) {
      dz.addEventListener('dragover',  function(e){ e.preventDefault(); dz.classList.add('over'); });
      dz.addEventListener('dragleave', function()  { dz.classList.remove('over'); });
      dz.addEventListener('drop',      function(e){ e.preventDefault(); dz.classList.remove('over'); var f = e.dataTransfer.files[0]; if(f) loadFile(f); });
    }

    var qsl = $('v-qsl');
    if (qsl) {
      function onQualityChange() {
        S.quality = parseInt(this.value, 10);
        _syncQualitySliders(S.quality);
        if (S.origImg) _livePreview();
      }
      U.bindRangeInput(qsl, onQualityChange);
      _sliderUI(qsl, $('v-qnum'), '80%');
    }

    var cqsl = $('v-conv-qsl');
    if (cqsl) {
      function onConvQualityChange() {
        S.quality = parseInt(this.value, 10);
        _syncQualitySliders(S.quality);
        if (S.origImg) _livePreview();
      }
      U.bindRangeInput(cqsl, onConvQualityChange);
      _sliderUI(cqsl, $('v-conv-qnum'), '80%');
    }

    var efsl = $('v-effort-sl');
    if (efsl) {
      function onEffortChange() {
        S.webpEffort = parseInt(this.value, 10);
        _sliderEffortUI(this);
        if (S.origImg) _livePreview();
      }
      U.bindRangeInput(efsl, onEffortChange);
      _sliderEffortUI(efsl);
    }

    /* ── Lossless toggle ── */
    var lssCb = $('v-webp-lossless');
    if (lssCb) {
      lssCb.addEventListener('change', function() {
        S.webpLossless = this.checked;
        var efRow = $('v-effort-row');
        if (efRow) efRow.style.opacity = this.checked ? '0.4' : '1';
        if (S.origImg) _livePreview();
      });
    }

    [['v-ef-br','brightness'],['v-ef-co','contrast'],
     ['v-ef-sa','saturation'],['v-ef-hu','hue'],
     ['v-ef-sh','sharpness'], ['v-ef-dn','denoise']].forEach(function(p){
      var el = $(p[0]); if (!el) return;
      function onEfxChange() {
        S[p[1]] = parseInt(this.value, 10);
        var vEl = $(p[0]+'-v'); if(vEl) vEl.textContent = this.value + (p[1]==='hue'?'°':'');
        if (S.origImg && S.activePanel==='effects') _livePreview();
      }
      U.bindRangeInput(el, onEfxChange);
    });

    var ba = $('v-blur-amt');
    if (ba) {
      function onBlurChange() {
        S.blurAmt = parseInt(this.value, 10);
        var v = $('v-blur-amt-v'); if(v) v.textContent = this.value;
        if (S.origImg && S.activePanel==='blur') _livePreview();
      }
      U.bindRangeInput(ba, onBlurChange);
    }

    var rw = $('v-rw'), rh = $('v-rh');
    if (rw) rw.addEventListener('input', _onW);
    if (rh) rh.addEventListener('input', _onH);

    /* Scale % slider + number field */
    var rpct = $('v-rpct'), rpctn = $('v-rpctn');
    if (rpct) {
      U.bindRangeInput(rpct, function () { pctResize(this.value); });
    }
    if (rpctn) {
      rpctn.addEventListener('input', function(){ pctResize(this.value); });
    }

    if (window.VBatch) VBatch.init();
  });

  /* ═══════════════════════════════════════════════
     LOAD FILE
  ═══════════════════════════════════════════════ */
  var RAW_EXT = /\.(cr2|cr3|nef|nrw|arw|srf|sr2|dng|raf|rw2|orf|pef|srw|x3f|raw)$/i;

  window.loadFile = function(file) {
    if (!file) return;
    var isRaw = RAW_EXT.test(file.name || '');
    if (!file.type.startsWith('image/') && !isRaw) return;
    _hideRawWarn(); _hideRawNotice();
    S.reset();
    _resetAdj(); _resetRot(); _resetEfx();
    _cropClean();

    if (isRaw) {
      _showRawLoading(true);
      window.VRaw.decode(file).then(function (r) {
        _showRawLoading(false);
        S.file     = { name: file.name, size: r.blob.size };
        S.fileMime = 'image/jpeg';
        S.origUrl  = r.url;
        _applyLoadedImage(r.img, file.name, r.blob.size, 'image/jpeg');
        _showRawNotice(file, r.width, r.height);
      }).catch(function () {
        _showRawLoading(false);
        _showRawWarn(file);
      });
      return;
    }

    S.file     = file;
    S.fileMime = VConverter.normalizeMime(file.type) || 'image/jpeg';

    var reader = new FileReader();
    reader.onload = function(e) {
      S.origUrl = e.target.result;
      var img = new Image();
      img.onload = function() {
        _applyLoadedImage(img, file.name, file.size, file.type);
      };
      img.onerror = function(){
        alert('Could not read this image. The file may be corrupted or in an unsupported format.');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  /** Shared "image is ready" step — wires it into the editor + live preview. */
  function _applyLoadedImage(img, fileName, fileSize, fileType) {
    S.origImg = img;
    S.origW   = img.width;
    S.origH   = img.height;
    S.ar      = img.width / img.height;
    S.targetW = img.width;
    S.targetH = img.height;
    var rw = $('v-rw'), rh = $('v-rh');
    if (rw) rw.value = img.width;
    if (rh) rh.value = img.height;
    /* Scale % reset */
    var rpct = $('v-rpct'), rpctn = $('v-rpctn');
    if (rpct)  { rpct.value = 100; _pctSlUI(rpct); }
    if (rpctn) rpctn.value = 100;
    _updPctInfo();

    $('v-dz').style.display = 'none';
    $('v-editor').classList.add('on');

    var pi = $('v-prev-img');
    if (pi) { pi.src = S.origUrl; pi.style.display = ''; }

    _setFInfo('v-fi-orig', fileName, fileSize, img.width, img.height, fileType, null, null);
    $('v-result').classList.remove('on');
    _checkPNG();
    switchPanel('compress', $('v-tb-compress'));
  }

  /* ─── RAW preview extraction: notices & loading state ─── */
  function _showRawLoading(on) {
    var dz = $('v-dz');
    if (!dz) return;
    dz.classList.toggle('raw-loading', !!on);
  }
  function _showRawNotice(file, w, h) {
    var n = $('v-raw-notice');
    if (!n) return;
    var t = $('v-raw-notice-text');
    if (t) t.innerHTML = '<strong>RAW preview loaded</strong> — showing the ' + w + '×' + h +
      ' JPEG preview embedded in <strong>' + file.name + '</strong> by your camera. ' +
      'All edits, compression and format conversion below apply to this preview, not the original sensor data.';
    n.classList.add('on');
  }
  function _hideRawNotice() {
    var n = $('v-raw-notice');
    if (n) n.classList.remove('on');
  }
  function _showRawWarn(file) {
    var w = $('v-raw-warn');
    if (!w) { alert('RAW file detected ('+file.name+'), but no usable preview image could be found inside it. Export a JPEG/TIFF from your camera app and upload that instead.'); return; }
    var nm = $('v-raw-warn-name');
    if (nm) nm.textContent = file.name;
    w.classList.add('on');
  }
  function _hideRawWarn() {
    var w = $('v-raw-warn');
    if (w) w.classList.remove('on');
  }

  /* ═══════════════════════════════════════════════
     LIVE PREVIEW
  ═══════════════════════════════════════════════ */
  var _liveTimer = null;
  function _livePreview() {
    if (!S.origImg) return;
    // Один дебаунс. Раньше: здесь 140мс + процессор 130мс = 270мс.
    // Теперь: прямой вызов, дебаунс только в процессоре (80мс).
    clearTimeout(_liveTimer);
    P.livePreview(S.origImg, _snap(), $('v-prev-img'), 80);
  }

  function _snap() {
    return {
      quality:S.quality, format:S.format, rotation:S.rotation,
      targetW:S.targetW||S.origW, targetH:S.targetH||S.origH,
      fileMime:S.fileMime, activePanel:S.activePanel,
      blurType:S.blurType, blurAmt:S.blurAmt,
      brightness:S.brightness, contrast:S.contrast,
      saturation:S.saturation, hue:S.hue,
      sharpness:S.sharpness, denoise:S.denoise,
      webpEffort:S.webpEffort, webpLossless:S.webpLossless
    };
  }

  /* ═══════════════════════════════════════════════
     PANEL SWITCHING
  ═══════════════════════════════════════════════ */
  window.switchPanel = function(id, btn) {
    ['compress','convert','resize','rotate','effects','blur','crop'].forEach(function(p){
      var pan = $('v-pan-'+p), tb = $('v-tb-'+p);
      if (pan) pan.classList.remove('on');
      if (tb)  tb.classList.remove('on');
    });
    var pan = $('v-pan-'+id);
    if (pan) pan.classList.add('on');
    if (btn) btn.classList.add('on');
    S.activePanel = id;

    if (id === 'crop') {
      // Убиваем pending live-preview из blur/effects.
      // Без этого отложенный blur-запрос дорисует картинку поверх оригинала.
      P.cancelLive();
      var pi = $('v-prev-img');
      if (pi && S.origUrl) pi.src = S.origUrl;
      _cropEnter();
    } else {
      _cropExit();
    }

    var labels = {
      compress:'⚡ Compress Image', convert:'⚡ Convert Format',
      resize:'⚡ Resize Image',     rotate:'⚡ Apply Rotation',
      effects:'⚡ Apply Effects',   blur:'⚡ Apply Blur',
      crop:'✂️ Apply Crop'
    };
    var gb = $('v-gobtn');
    if (gb) gb.textContent = labels[id] || '⚡ Process';
    _checkPNG();
    if (S.origImg && id !== 'crop') _livePreview();
  };

  /* ═══════════════════════════════════════════════
     SETTINGS
  ═══════════════════════════════════════════════ */
  window.setQPreset = function(v) {
    S.quality = v;
    _syncQualitySliders(v);
    if (S.origImg) _livePreview();
  };

  var FMT_BTN = {
    'original': 'v-fmt-auto',
    'image/jpeg': 'v-fmt-jpg',
    'image/png': 'v-fmt-png',
    'image/webp': 'v-fmt-webp',
    'image/avif': 'v-fmt-avif',
    'image/gif': 'v-fmt-gif',
    'image/svg+xml': 'v-fmt-svg'
  };

  window.setFmt = function(fmt, btn) {
    S.format = fmt;
    $$('.v-fmt').forEach(function(b){ b.classList.remove('on'); });
    if (!btn && FMT_BTN[fmt]) btn = $(FMT_BTN[fmt]);
    if (btn) btn.classList.add('on');
    _checkPNG();
    if (S.origImg) _livePreview();
  };

  window.pickConvert = function(fmt, btnId) {
    var btn = typeof btnId === 'string' ? $(btnId) : btnId;
    setFmt(fmt, btn);
    switchPanel('convert', $('v-tb-convert'));
  };

  window.setRot = function(r, btn) {
    S.rotation = (S.rotation === r) ? null : r;
    _resetRot();
    if (S.rotation) btn.classList.add('on');
    if (S.origImg) _livePreview();
  };

  window.setBlur = function(t, btn) {
    S.blurType = t;
    $$('.v-blbtn').forEach(function(b){ b.classList.remove('on'); });
    btn.classList.add('on');
    if (S.origImg && S.activePanel==='blur') _livePreview();
  };

  window.applyPreset = function(name, btn) {
    E.applyPreset(name, S);
    $$('.v-ebtn').forEach(function(b){ b.classList.remove('on'); });
    btn.classList.add('on');
    _syncAdj();
    if (S.origImg) _livePreview();
  };

  window.toggleLock = function() {
    S.lockAR = !S.lockAR;
    var b = $('v-lkbtn');
    if (b) b.classList.toggle('on', S.lockAR);
  };

  window.qResize = function(w, h) {
    S.targetW = w; S.targetH = h; S.lockAR = false;
    var rw = $('v-rw'), rh = $('v-rh'), lb = $('v-lkbtn');
    if (rw) rw.value = w;
    if (rh) rh.value = h;
    if (lb) lb.classList.remove('on');
    _syncPct();
  };

  /* Resize по проценту от оригинала */
  function pctResize(pct) {
    if (!S.origImg) return;
    pct = Math.max(5, Math.min(200, parseInt(pct) || 100));
    S.targetW = Math.max(1, Math.round(S.origW * pct / 100));
    S.targetH = Math.max(1, Math.round(S.origH * pct / 100));
    var rw = $('v-rw'), rh = $('v-rh');
    if (rw) rw.value = S.targetW;
    if (rh) rh.value = S.targetH;
    var sl = $('v-rpct'), nin = $('v-rpctn');
    if (sl)  { sl.value = pct; _pctSlUI(sl); }
    if (nin) nin.value = pct;
    _updPctInfo();
    if (S.origImg) _livePreview();
  }

  /* Синхронизация поля % из текущих targetW/origW */
  function _syncPct() {
    if (!S.origW) return;
    var pct = Math.round(S.targetW / S.origW * 100);
    var sl = $('v-rpct'), nin = $('v-rpctn');
    if (sl)  { sl.value = pct; _pctSlUI(sl); }
    if (nin) nin.value = pct;
    _updPctInfo();
  }

  /* Живой фидбэк размера — число px под слайдером */
  function _updPctInfo() {
    var info = $('v-rpct-info');
    if (info) info.textContent = (S.targetW||S.origW) + ' \u00d7 ' + (S.targetH||S.origH) + ' px';
  }

  /* Заливка трека слайдера % */
  function _pctSlUI(sl) {
    if (!sl) return;
    var v = parseInt(sl.value);
    var pct = ((v - 5) / 195) * 100;
    sl.style.background = 'linear-gradient(to right,var(--ac) ' + pct + '%,var(--br-2) ' + pct + '%)';
  }

  window.autoWebP = function() {
    S.format = 'image/webp';
    $$('.v-fmt').forEach(function(b){ b.classList.remove('on'); });
    var fw = $('v-fmt-webp');
    if (fw) fw.classList.add('on');
    var w = $('v-warn');
    if (w) w.classList.remove('on');
    switchPanel('convert', $('v-tb-convert'));
  };

  function _onW() {
    var w = parseInt($('v-rw').value) || S.origW;
    S.targetW = w;
    if (S.lockAR) { S.targetH = Math.round(w / S.ar); var rh = $('v-rh'); if(rh) rh.value = S.targetH; }
    else { S.targetH = parseInt($('v-rh').value) || S.origH; }
    _syncPct();
  }
  function _onH() {
    var h = parseInt($('v-rh').value) || S.origH;
    S.targetH = h;
    if (S.lockAR) { S.targetW = Math.round(h * S.ar); var rw = $('v-rw'); if(rw) rw.value = S.targetW; }
    else { S.targetW = parseInt($('v-rw').value) || S.origW; }
    _syncPct();
  }

  /* ═══════════════════════════════════════════════
     PROCESS
  ═══════════════════════════════════════════════ */
  window.process = function() {
    if (!S.origImg) return;

    if (S.activePanel === 'crop' && CROP.on) {
      if (CROP.imgW < 2 || CROP.imgH < 2) return;
      window.applyCrop();
      return; 
    }

    _cropExit();
    var proc = $('v-proc'), gb = $('v-gobtn'), res = $('v-result');
    proc.classList.add('on');
    gb.disabled = true;
    res.classList.remove('on');

    var pb = $('v-pb'), prog = 0;
    var iv = setInterval(function(){ prog = Math.min(prog+20, 88); pb.style.width = prog+'%'; }, 90);

    P.process(S.origImg, _snap()).then(function(r) {
      clearInterval(iv); pb.style.width = '100%';
      S.resultBlob = r.blob;
      if (S.resultUrl) URL.revokeObjectURL(S.resultUrl);
      S.resultUrl  = URL.createObjectURL(r.blob);
      S.resultExt  = C.ext(r.mime);

      var ri = $('v-res-img');
      if (ri) { ri.src = S.resultUrl; ri.style.display = ''; }

      var base = S.file.name.replace(/\.[^.]+$/, '');
      var fnIn = $('v-fnin'), fnExt = $('v-fnext');
      if (fnIn)  fnIn.value  = base + '_velo';
      if (fnExt) fnExt.textContent = '.' + S.resultExt;

      _setFInfo('v-fi-res', base+'_velo.'+S.resultExt, r.blob.size, r.canvas.width, r.canvas.height, r.mime, S.file.size, r.blob.size);
      _showCompare(S.file.size, r.blob.size);
      _buildBA(S.origUrl, S.resultUrl);

      var pi = $('v-prev-img');
      if (pi) pi.src = S.origUrl;

      setTimeout(function(){
        proc.classList.remove('on');
        pb.style.width = '0%';
        gb.disabled = false;
        res.classList.add('on');
        var top = res.getBoundingClientRect().top + window.pageYOffset - 70;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }, 280);

    }).catch(function(err){
      clearInterval(iv);
      $('v-proc').classList.remove('on');
      $('v-pb').style.width = '0%';
      $('v-gobtn').disabled = false;
      console.error('[VeloTools]', err);
      var msg = (err && err.message) ? err.message : 'Processing failed. Try a different format or image.';
      alert(msg);
    });
  };

  /* ═══════════════════════════════════════════════
     ✂️ CROP
  ═══════════════════════════════════════════════ */
  function _cropEnter() {
    if (!S.origImg) return;

    /* Remove stale overlay — prevents darkening accumulation on re-entry */
    var stale = $('crop-ov');
    if (stale) {
      if (stale._onMove)    { document.removeEventListener('mousemove',  stale._onMove); document.removeEventListener('touchmove', stale._onMove); }
      if (stale._onEnd)     { document.removeEventListener('mouseup',    stale._onEnd);  document.removeEventListener('touchend',  stale._onEnd); }
      if (stale._onKeyDown) document.removeEventListener('keydown', stale._onKeyDown);
      if (stale._onKeyUp)   document.removeEventListener('keyup',   stale._onKeyUp);
      stale.parentNode && stale.parentNode.removeChild(stale);
    }

    CROP.on = true;
    _cropClean();

    var preview = $('v-preview');
    var img     = $('v-prev-img');
    if (!preview || !img) return;

    preview.style.position = 'relative';
    preview.style.overflow = 'visible';

    var ov = document.createElement('div');
    ov.id = 'crop-ov';
    ov.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;cursor:crosshair;z-index:20;user-select:none;-webkit-user-select:none';

    /* Selection box — pointer-events:none so clicks pass through to ov,
       but resize handle children override with pointer-events:auto */
    var sel = document.createElement('div');
    sel.id = 'crop-sel';
    sel.style.cssText = 'position:absolute;display:none;border:2px solid #5b6cf9;box-shadow:0 0 0 9999px rgba(0,0,0,0.5);pointer-events:none;z-index:2;box-sizing:border-box';

    /* ── 8 resize handles ────────────────────────────────────────── */
    var HANDLE_DEFS = [
      { id:'nw', css:'top:-5px;left:-5px;cursor:nw-resize' },
      { id:'n',  css:'top:-5px;left:calc(50% - 5px);cursor:n-resize' },
      { id:'ne', css:'top:-5px;right:-5px;cursor:ne-resize' },
      { id:'w',  css:'top:calc(50% - 5px);left:-5px;cursor:w-resize' },
      { id:'e',  css:'top:calc(50% - 5px);right:-5px;cursor:e-resize' },
      { id:'sw', css:'bottom:-5px;left:-5px;cursor:sw-resize' },
      { id:'s',  css:'bottom:-5px;left:calc(50% - 5px);cursor:s-resize' },
      { id:'se', css:'bottom:-5px;right:-5px;cursor:se-resize' }
    ];
    var handleEls = {};
    HANDLE_DEFS.forEach(function(h) {
      var el = document.createElement('div');
      el.style.cssText = 'position:absolute;width:10px;height:10px;background:#fff;border:2px solid #5b6cf9;border-radius:2px;z-index:10;pointer-events:auto;box-sizing:border-box;' + h.css;
      el.dataset.handle = h.id;
      sel.appendChild(el);
      handleEls[h.id] = el;
    });

    var badge = document.createElement('div');
    badge.id = 'crop-badge';
    badge.style.cssText = 'position:absolute;display:none;background:rgba(91,108,249,0.92);color:#fff;font:700 11px/1 Inter,system-ui,sans-serif;padding:4px 9px;border-radius:6px;pointer-events:none;z-index:3;white-space:nowrap';

    var floatBtn = document.createElement('button');
    floatBtn.id = 'crop-float-btn';
    floatBtn.type = 'button';
    floatBtn.tabIndex = -1; // prevent Space from activating it via keyboard
    floatBtn.innerHTML = '✔ Apply Crop';
    floatBtn.style.cssText = 'position:absolute;display:none;background:#0ea66e;color:#fff;border:none;padding:8px 16px;border-radius:6px;font:700 13px Inter,system-ui,sans-serif;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.4);z-index:30;pointer-events:auto';
    floatBtn.addEventListener('mousedown', function(e){ e.stopPropagation(); window.applyCrop(); });
    floatBtn.addEventListener('touchstart', function(e){ e.stopPropagation(); window.applyCrop(); }, {passive:false});

    ov.appendChild(sel);
    ov.appendChild(badge);
    ov.appendChild(floatBtn);
    preview.appendChild(ov);

    /* Reset aspect preset highlight on enter */
    document.querySelectorAll('.v-crop-pr').forEach(function(b) { b.classList.remove('act'); });
    var freeBtn = document.querySelector('.v-crop-pr[data-ratio="0"]');
    if (freeBtn) freeBtn.classList.add('act');
    CROP.aspect = 0;

    /* ── Internal mode state ─────────────────────────────────────── */
    var spaceDown   = false;
    var resizing    = false, rsHandle = null;
    var rsStartX    = 0, rsStartY = 0, rsCX = 0, rsCY = 0, rsCW = 0, rsCH = 0;
    var moving      = false;
    var mvStartX    = 0, mvStartY = 0, mvCX = 0, mvCY = 0;

    /* ── Helpers ─────────────────────────────────────────────────── */
    function imgRect()  { return img.getBoundingClientRect(); }
    function offsets()  { var ir = imgRect(), or = ov.getBoundingClientRect(); return { x: ir.left - or.left, y: ir.top - or.top }; }
    function clientXY(e){ return e.touches ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY }; }

    function clampRect(cx, cy, cw, ch, ir) {
      cw = Math.max(10, cw);
      ch = Math.max(10, ch);
      cx = Math.max(0, cx);
      cy = Math.max(0, cy);
      cw = Math.min(cw, ir.width  - cx);
      ch = Math.min(ch, ir.height - cy);
      return { x: cx, y: cy, w: cw, h: ch };
    }

    function refreshSel() {
      if (CROP.w < 2 || CROP.h < 2) return;
      var ir = imgRect(), off = offsets();
      sel.style.left    = px(CROP.x + off.x);
      sel.style.top     = px(CROP.y + off.y);
      sel.style.width   = px(CROP.w);
      sel.style.height  = px(CROP.h);
      sel.style.display = 'block';

      var scaleX = S.origW / ir.width, scaleY = S.origH / ir.height;
      CROP.imgX = Math.round(CROP.x * scaleX);
      CROP.imgY = Math.round(CROP.y * scaleY);
      CROP.imgW = Math.round(CROP.w * scaleX);
      CROP.imgH = Math.round(CROP.h * scaleY);

      badge.textContent   = CROP.imgW + ' × ' + CROP.imgH + ' px';
      badge.style.left    = px(CROP.x + off.x);
      badge.style.top     = px(CROP.y + off.y + CROP.h + 6);
      badge.style.display = 'block';

      var btnY = CROP.y + off.y + CROP.h + 30;
      if (btnY + 40 > ir.height) btnY = CROP.y + off.y + CROP.h - 45;
      floatBtn.style.left    = px(CROP.x + off.x);
      floatBtn.style.top     = px(btnY);
      floatBtn.style.display = 'block';

      var info = $('v-crop-info');
      if (info) info.textContent = CROP.imgW + ' × ' + CROP.imgH + ' px — drag handles to resize · Space+drag to move';
    }

    function setCursor(c) { ov.style.cursor = c; }

    /* Enforce aspect ratio on a {x,y,w,h} rect */
    function applyAspect(r, ir) {
      if (!CROP.aspect) return r;
      var targetH = r.w / CROP.aspect;
      if (r.y + targetH > ir.height) {
        targetH = ir.height - r.y;
        r.w = Math.round(targetH * CROP.aspect);
      }
      r.h = Math.round(targetH);
      r.w = Math.min(r.w, ir.width - r.x);
      return r;
    }

    /* ── Resize handles mousedown ────────────────────────────────── */
    Object.keys(handleEls).forEach(function(hid) {
      function startResize(e) {
        e.stopPropagation();
        e.preventDefault();
        resizing = true; rsHandle = hid;
        var c = clientXY(e);
        rsStartX = c.x; rsStartY = c.y;
        rsCX = CROP.x; rsCY = CROP.y; rsCW = CROP.w; rsCH = CROP.h;
        setCursor(handleEls[hid].style.cursor.replace('cursor:','') || 'nwse-resize');
      }
      handleEls[hid].addEventListener('mousedown',  startResize);
      handleEls[hid].addEventListener('touchstart', startResize, { passive: false });
    });

    /* ── Overlay mousedown: new draw OR space-move ───────────────── */
    function onStart(e) {
      e.preventDefault();
      var ir = imgRect(), c = clientXY(e);
      var rx = Math.max(0, Math.min(c.x - ir.left, ir.width));
      var ry = Math.max(0, Math.min(c.y - ir.top,  ir.height));

      if (spaceDown && CROP.w > 4) {
        /* Space held → move selection */
        moving  = true;
        mvStartX = c.x; mvStartY = c.y;
        mvCX = CROP.x; mvCY = CROP.y;
        setCursor('grabbing');
        return;
      }
      /* Normal: start new draw */
      CROP.dragging = true;
      CROP.sx = rx; CROP.sy = ry;
      CROP.x  = rx; CROP.y  = ry;
      CROP.w  = 0;  CROP.h  = 0;
      sel.style.display = badge.style.display = floatBtn.style.display = 'none';
    }

    /* ── Unified move handler ────────────────────────────────────── */
    function onMove(e) {
      e.preventDefault();
      var ir = imgRect(), c = clientXY(e);

      if (resizing) {
        var dx = c.x - rsStartX, dy = c.y - rsStartY;
        var nx = rsCX, ny = rsCY, nw = rsCW, nh = rsCH;
        if (rsHandle.indexOf('e') !== -1) { nw = rsCW + dx; }
        if (rsHandle.indexOf('s') !== -1) { nh = rsCH + dy; }
        if (rsHandle.indexOf('w') !== -1) { nx = rsCX + dx; nw = rsCW - dx; }
        if (rsHandle.indexOf('n') !== -1) { ny = rsCY + dy; nh = rsCH - dy; }
        var r = clampRect(nx, ny, nw, nh, ir);
        if (CROP.aspect) {
          if (rsHandle === 'n' || rsHandle === 's') { r.w = Math.round(r.h * CROP.aspect); }
          else { r.h = Math.round(r.w / CROP.aspect); }
          r = clampRect(r.x, r.y, r.w, r.h, ir);
        }
        CROP.x = r.x; CROP.y = r.y; CROP.w = r.w; CROP.h = r.h;
        refreshSel();
        return;
      }

      if (moving) {
        var mdx = c.x - mvStartX, mdy = c.y - mvStartY;
        CROP.x = Math.max(0, Math.min(mvCX + mdx, ir.width  - CROP.w));
        CROP.y = Math.max(0, Math.min(mvCY + mdy, ir.height - CROP.h));
        refreshSel();
        return;
      }

      if (!CROP.dragging) return;
      var rx = Math.max(0, Math.min(c.x - ir.left, ir.width));
      var ry = Math.max(0, Math.min(c.y - ir.top,  ir.height));
      var r2 = clampRect(Math.min(CROP.sx, rx), Math.min(CROP.sy, ry),
                         Math.abs(rx - CROP.sx), Math.abs(ry - CROP.sy), ir);
      r2 = applyAspect(r2, ir);
      CROP.x = r2.x; CROP.y = r2.y; CROP.w = r2.w; CROP.h = r2.h;
      if (CROP.w < 2 || CROP.h < 2) return;
      refreshSel();
    }

    /* ── Mouse up ────────────────────────────────────────────────── */
    function onEnd(_e) {
      if (resizing) { resizing = false; rsHandle = null; setCursor(spaceDown && CROP.w > 4 ? 'grab' : 'crosshair'); return; }
      if (moving)   { moving   = false;                  setCursor(spaceDown && CROP.w > 4 ? 'grab' : 'crosshair'); return; }
      CROP.dragging = false;
      if (CROP.w < 5 || CROP.h < 5) {
        sel.style.display = badge.style.display = floatBtn.style.display = 'none';
        var info = $('v-crop-info');
        if (info) info.textContent = 'Draw a selection on the image above';
      }
    }

    /* ── Space key: toggle grab/move mode ───────────────────────── */
    function onKeyDown(e) {
      if (e.code === 'Space' && CROP.on && !e.repeat) {
        e.preventDefault();
        spaceDown = true;
        if (!resizing && !CROP.dragging) setCursor(CROP.w > 4 ? 'grab' : 'crosshair');
      }
    }
    function onKeyUp(e) {
      if (e.code === 'Space') {
        spaceDown = false;
        if (!resizing) setCursor('crosshair');
      }
    }

    ov.addEventListener('mousedown',  onStart);
    ov.addEventListener('touchstart', onStart, { passive: false });
    document.addEventListener('mousemove',  onMove);
    document.addEventListener('touchmove',  onMove, { passive: false });
    document.addEventListener('mouseup',    onEnd);
    document.addEventListener('touchend',   onEnd);
    /* capture:true — intercepts Space BEFORE browser activates focused button */
    document.addEventListener('keydown',    onKeyDown, true);
    document.addEventListener('keyup',      onKeyUp,   true);

    ov._onMove    = onMove;
    ov._onEnd     = onEnd;
    ov._onKeyDown = onKeyDown;
    ov._onKeyUp   = onKeyUp;
    ov._refresh   = refreshSel; // exposed for setCropAspect()
  }

  function _cropExit() {
    CROP.on = false;
    var ov = $('crop-ov');
    if (ov) {
      document.removeEventListener('mousemove',  ov._onMove);
      document.removeEventListener('touchmove',  ov._onMove);
      document.removeEventListener('mouseup',    ov._onEnd);
      document.removeEventListener('touchend',   ov._onEnd);
      if (ov._onKeyDown) document.removeEventListener('keydown', ov._onKeyDown, true);
      if (ov._onKeyUp)   document.removeEventListener('keyup',   ov._onKeyUp,   true);
      ov.parentNode && ov.parentNode.removeChild(ov);
    }
    var preview = $('v-preview');
    if (preview) preview.style.overflow = '';
  }

  function _cropClean() {
    CROP.dragging = false;
    CROP.sx=0; CROP.sy=0;
    CROP.x=0;  CROP.y=0; CROP.w=0; CROP.h=0;
    CROP.imgX=0; CROP.imgY=0; CROP.imgW=0; CROP.imgH=0;
    var info = $('v-crop-info');
    if (info) info.textContent = 'Draw a selection on the image above';
  }

  window.applyCrop = function() {
    if (!S.origImg) return;
    if (CROP.imgW < 2 || CROP.imgH < 2) return;

    var c = document.createElement('canvas');
    c.width  = CROP.imgW;
    c.height = CROP.imgH;
    c.getContext('2d').drawImage(S.origImg, CROP.imgX, CROP.imgY, CROP.imgW, CROP.imgH, 0, 0, CROP.imgW, CROP.imgH);

    var mime   = S.fileMime || 'image/png';
    var newUrl = c.toDataURL(mime, 1.0);
    var newImg = new Image();
    newImg.onload = function() {
      S.origImg = newImg;
      S.origW   = CROP.imgW; S.origH = CROP.imgH;
      S.ar      = CROP.imgW / CROP.imgH;
      S.targetW = CROP.imgW; S.targetH = CROP.imgH;
      S.origUrl = newUrl;
      var rw = $('v-rw'), rh = $('v-rh');
      if (rw) rw.value = CROP.imgW;
      if (rh) rh.value = CROP.imgH;
      var pi = $('v-prev-img');
      if (pi) { pi.src = newUrl; pi.style.display=''; }
      _setFInfo('v-fi-orig', S.file ? S.file.name : 'cropped', 0, CROP.imgW, CROP.imgH, mime, null, null);
      var info = $('v-crop-info');
      if (info) info.textContent = '✓ Cropped to ' + CROP.imgW + ' × ' + CROP.imgH + ' px';
      _cropExit();
      _cropClean();
      
      switchPanel('compress', $('v-tb-compress'));
      setTimeout(window.process, 50);
    };
    newImg.src = newUrl;
  };

  /* Set aspect ratio preset — called from HTML preset buttons */
  window.setCropAspect = function(ratio, btn) {
    CROP.aspect = ratio || 0;
    document.querySelectorAll('.v-crop-pr').forEach(function(b) { b.classList.remove('act'); });
    if (btn) btn.classList.add('act');

    var ov = $('crop-ov');
    if (!ov || !ov._refresh || CROP.w < 10 || !ratio) return;

    /* Resize existing selection to match new aspect ratio */
    var ir = $('v-prev-img').getBoundingClientRect();
    var newH = CROP.w / ratio;
    if (CROP.y + newH > ir.height) { newH = ir.height - CROP.y; CROP.w = Math.round(newH * ratio); }
    CROP.h = Math.round(newH);
    CROP.w = Math.min(CROP.w, ir.width - CROP.x);
    ov._refresh();
  };

  window.resetCrop = function() {
    var sel = $('crop-sel'), badge = $('crop-badge'), fbtn = $('crop-float-btn');
    if (sel)   sel.style.display   = 'none';
    if (badge) badge.style.display = 'none';
    if (fbtn)  fbtn.style.display  = 'none';
    _cropClean();
  };

  /* ═══════════════════════════════════════════════
     🔍 ZOOM
  ═══════════════════════════════════════════════ */
  window.toggleZoom = function(btn) {
    ZOOM.on = !ZOOM.on;
    btn.classList.toggle('on', ZOOM.on);
    var sp = btn.querySelector('span');

    var preview = $('v-preview');
    var img     = $('v-prev-img');

    if (!ZOOM.on) {
      if (sp) sp.textContent = 'Zoom';
      var lens = $('zoom-lens');
      if (lens) lens.style.display = 'none';
      if (preview._zoomMove)  { preview.removeEventListener('mousemove', preview._zoomMove); document.removeEventListener('touchmove', preview._zoomMove); }
      if (preview._zoomLeave) preview.removeEventListener('mouseleave', preview._zoomLeave);
      if (img) img.style.cursor = '';
      return;
    }

    if (sp) sp.textContent = 'Zoom off';
    if (img) img.style.cursor = 'zoom-in';

    var lens = $('zoom-lens');
    if (!lens) {
      lens = document.createElement('div');
      lens.id = 'zoom-lens';
      lens.style.cssText = [
        'position:absolute', 'width:140px', 'height:140px',
        'border-radius:50%',
        'border:2.5px solid #5b6cf9',
        'box-shadow:0 4px 20px rgba(0,0,0,.4)',
        'overflow:hidden', 'pointer-events:none',
        'z-index:30', 'display:none',
        'background:#0f1117'
      ].join(';');
      var lensCanvas = document.createElement('canvas');
      lensCanvas.id = 'zoom-canvas';
      lensCanvas.width  = 140;
      lensCanvas.height = 140;
      lensCanvas.style.cssText = 'display:block;width:140px;height:140px';
      lens.appendChild(lensCanvas);
      preview.appendChild(lens);
    }

    var ZOOM_LEVEL = 3;
    var LENS_SIZE  = 140;

    function onZoomMove(e) {
      if (!ZOOM.on || !S.origImg) return;
      var imgEl   = $('v-prev-img');
      var imgRect = imgEl.getBoundingClientRect();
      var cx = (e.touches ? e.touches[0].clientX : e.clientX);
      var cy = (e.touches ? e.touches[0].clientY : e.clientY);

      var mx = cx - imgRect.left;
      var my = cy - imgRect.top;
      if (mx < 0 || my < 0 || mx > imgRect.width || my > imgRect.height) {
        lens.style.display = 'none';
        return;
      }
      lens.style.display = 'block';

      var prevRect = preview.getBoundingClientRect();
      var lx = (cx - prevRect.left) - LENS_SIZE / 2;
      var ly = (cy - prevRect.top)  - LENS_SIZE / 2 - (e.touches ? 90 : 0);
      lx = Math.max(0, Math.min(lx, prevRect.width  - LENS_SIZE));
      ly = Math.max(0, Math.min(ly, prevRect.height - LENS_SIZE));
      lens.style.left = px(lx);
      lens.style.top  = px(ly);

      var scaleX = S.origW / imgRect.width;
      var scaleY = S.origH / imgRect.height;
      var zw = LENS_SIZE * scaleX / ZOOM_LEVEL;
      var zh = LENS_SIZE * scaleY / ZOOM_LEVEL;
      var zx = mx * scaleX - zw / 2;
      var zy = my * scaleY - zh / 2;
      zx = Math.max(0, Math.min(zx, S.origW - zw));
      zy = Math.max(0, Math.min(zy, S.origH - zh));

      var ctx = $('zoom-canvas').getContext('2d');
      ctx.clearRect(0, 0, LENS_SIZE, LENS_SIZE);
      ctx.drawImage(S.origImg, zx, zy, zw, zh, 0, 0, LENS_SIZE, LENS_SIZE);
    }

    function onZoomLeave() { lens.style.display = 'none'; }

    preview._zoomMove  = onZoomMove;
    preview._zoomLeave = onZoomLeave;
    preview.addEventListener('mousemove',  onZoomMove);
    preview.addEventListener('mouseleave', onZoomLeave);
    document.addEventListener('touchmove', onZoomMove, { passive: true });
  };

  /* ═══════════════════════════════════════════════
     PROCESS COMPLETE: DOWNLOAD & EDIT
  ═══════════════════════════════════════════════ */
  window.dlFile = function() {
    if (!S.resultBlob) return;
    var nm = ($('v-fnin').value || 'compressed').trim();
    var ex = $('v-fnext').textContent.replace('.', '');
    U.downloadBlob(S.resultBlob, nm + '.' + ex);
  };

  window.editResult = function() {
    if (!S.resultUrl || !S.resultBlob) return;
    /* Убиваем висящий live-preview — иначе pending-запрос
       из прошлой обработки перерисует превью обратно. */
    P.cancelLive();
    var nm  = ($('v-fnin').value || 'result') + '.' + S.resultExt;
    S.file  = new File([S.resultBlob], nm, { type: S.resultBlob.type });
    S.fileMime  = S.resultBlob.type;
    S.origUrl   = S.resultUrl;
    S.rotation  = null;
    var img = new Image();
    img.onload = function() {
      S.origImg = img; S.origW = img.width; S.origH = img.height;
      S.ar = img.width / img.height;
      S.targetW = img.width; S.targetH = img.height;
      var rw = $('v-rw'), rh = $('v-rh');
      if (rw) rw.value = img.width;
      if (rh) rh.value = img.height;
      /* Сброс Scale % */
      var rpct = $('v-rpct'), rpctn = $('v-rpctn');
      if (rpct)  { rpct.value = 100; _pctSlUI(rpct); }
      if (rpctn) rpctn.value = 100;
      _updPctInfo();
      var pi = $('v-prev-img');
      if (pi) { pi.src = S.origUrl; pi.style.display = ''; }
      _setFInfo('v-fi-orig', S.file.name, S.file.size, img.width, img.height, S.file.type, null, null);
      $('v-result').classList.remove('on');
      S.resultBlob = null; S.resultUrl = null;
      _checkPNG();
      /* Сброс на compress — чтобы не остаться на resize/blur с устаревшими настройками */
      switchPanel('compress', $('v-tb-compress'));
      window.scrollTo({ top: $('v-editor').getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    };
    img.src = S.origUrl;
  };

  /* ─── NEW IMAGE ──────────────────────────────── */
  window.newFile = function() {
    var zb = $('v-tb-zoom');
    if (zb && ZOOM.on) toggleZoom(zb);

    _cropExit();
    _cropClean();

    S.reset();
    _resetAdj(); _resetRot(); _resetEfx();

    var editor = $('v-editor');
    if (editor) editor.classList.remove('on');

    var dz = $('v-dz');
    if (dz) dz.style.display = '';

    var fi = $('v-fi');
    if (fi) fi.value = '';

    var pi = $('v-prev-img');
    if (pi) { pi.src = ''; pi.style.display = 'none'; }

    var res = $('v-result');
    if (res) res.classList.remove('on');

    _syncQualitySliders(80);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ─── MODAL ──────────────────────────────────── */
  window.openModal = function(which) {
    var src = which === 1 ? S.resultUrl : S.origUrl;
    if (!src) return;
    var mi = $('v-modal-img');
    if (mi) { mi.src = src; mi.style.display = ''; }
    $('v-modal').classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  window.closeModal = function() {
    $('v-modal').classList.remove('open');
    document.body.style.overflow = '';
  };
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeModal(); });

  /* ═══════════════════════════════════════════════
     BEFORE / AFTER
  ═══════════════════════════════════════════════ */
  function _buildBA(origSrc, resSrc) {
    var wrap = $('v-ba-wrap');
    if (!wrap) return;

    function toDataUrl(src, cb) {
      var img = new Image();
      img.onload = function() {
        var c = document.createElement('canvas');
        c.width  = img.naturalWidth;
        c.height = img.naturalHeight;
        c.getContext('2d').drawImage(img, 0, 0);
        cb(c.toDataURL());
      };
      img.src = src;
    }

    toDataUrl(origSrc, function(orig) {
      toDataUrl(resSrc, function(res) {
        wrap.innerHTML =
          '<div class="v-ba-lbl">Before / After — drag the handle</div>' +
          '<div id="v-bac" class="v-ba">' +
            '<img id="v-ba-res"  class="v-ba-layer" src="' + res  + '" alt="After">' +
            '<img id="v-ba-orig" class="v-ba-layer v-ba-top" src="' + orig + '" alt="Before" style="clip-path:inset(0 50% 0 0)">' +
            '<span class="v-ba-tag" style="left:10px;background:rgba(0,0,0,.6)">BEFORE</span>' +
            '<span class="v-ba-tag" style="right:10px;background:rgba(91,108,249,.8)">AFTER</span>' +
            '<div id="v-ba-handle" class="v-ba-handle" style="left:50%">' +
              '<div class="v-ba-line"></div>' +
              '<div class="v-ba-knob">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20"><path d="M9 18l-6-6 6-6M15 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
              '</div>' +
            '</div>' +
          '</div>';
        _initBA();
      });
    });
  }

  function _initBA() {
    var c = $('v-bac');
    if (!c) return;
    var drag = false;

    function setPos(clientX) {
      var r   = c.getBoundingClientRect();
      var pct = Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100));
      var orig = $('v-ba-orig'), handle = $('v-ba-handle');
      if (orig)   orig.style.clipPath   = 'inset(0 ' + (100 - pct) + '% 0 0)';
      if (handle) handle.style.left     = pct + '%';
    }

    c.addEventListener('mousedown',  function(e){ drag = true; setPos(e.clientX); e.preventDefault(); });
    c.addEventListener('touchstart', function(e){ drag = true; setPos(e.touches[0].clientX); }, { passive: true });
    document.addEventListener('mousemove',  function(e){ if (drag) setPos(e.clientX); });
    document.addEventListener('touchmove',  function(e){ if (drag) setPos(e.touches[0].clientX); }, { passive: true });
    document.addEventListener('mouseup',    function(){ drag = false; });
    document.addEventListener('touchend',   function(){ drag = false; });
  }

  /* ═══════════════════════════════════════════════
     HELPERS
  ═══════════════════════════════════════════════ */
  function _sliderUI(sl, numEl, text) {
    U.updateSliderTrack(sl, numEl, text);
  }

  /* Syncs both quality sliders (compress panel + convert panel) + number labels */
  function _syncQualitySliders(q) {
    var qsl  = $('v-qsl'),  qnum  = $('v-qnum');
    var cqsl = $('v-conv-qsl'), cqnum = $('v-conv-qnum');
    if (qsl)  { qsl.value  = q; _sliderUI(qsl,  qnum,  q + '%'); }
    if (cqsl) { cqsl.value = q; _sliderUI(cqsl, cqnum, q + '%'); }
  }

  /* Effort slider track fill + label update */
  var EFFORT_LABELS = ['', 'Fastest', 'Fast', 'Balanced', 'Balanced', 'Best', 'Best (slowest)'];
  function _sliderEffortUI(sl) {
    if (!sl) return;
    var v   = parseInt(sl.value);
    var pct = ((v - 1) / 5) * 100;
    sl.style.background = 'linear-gradient(to right,var(--ac) ' + pct + '%,var(--br-2) ' + pct + '%)';
    var numEl = $('v-effort-num');
    if (numEl) numEl.textContent = v;
    var lblEl = $('v-effort-lbl');
    if (lblEl) lblEl.textContent = EFFORT_LABELS[v] || v;
  }

  /* Toggle Advanced WebP panel */
  window.vToggleAdv = function(btn) {
    var body = $('v-adv-body');
    if (!body) return;
    var open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    body.style.display = open ? 'none' : '';
  };

  function _checkPNG() {
    var warn = $('v-warn'); if (!warn) return;
    var is = S.fileMime === 'image/png' && S.format === 'original' && S.activePanel === 'compress';
    warn.classList.toggle('on', is);
    var tip = $('v-png-tip'); if (tip) tip.style.display = is ? 'inline' : 'none';
  }

  function _setFInfo(elId, name, size, w, h, fmt, origSize, newSize) {
    var saved  = (origSize && newSize && origSize > newSize) ? Math.round((1 - newSize / origSize) * 100) : null;
    var noSave = (origSize && newSize && saved <= 0);
    var fl = (fmt || '').split('/')[1] || '';
    fl = fl.replace('jpeg','JPG').replace('png','PNG').replace('webp','WebP').replace('avif','AVIF').replace('svg+xml','SVG').toUpperCase();
    var el = $(elId); if (!el) return;
    el.innerHTML =
      '<span class="v-tag v-tag-lbl">' + (elId.includes('res') ? 'RESULT' : 'ORIGINAL') + ':</span>' +
      '<span class="v-tag v-tag-nm">' + name + '</span>' +
      '<span class="v-tag v-tag-sz">' + C.fmtBytes(size) + '</span>' +
      '<span class="v-tag v-tag-dm">' + w + '×' + h + '</span>' +
      '<span class="v-tag v-tag-ft">' + fl + '</span>' +
      (saved > 0 ? '<span class="v-tag v-tag-ok">✓ Saved ' + saved + '%</span>' : '') +
      (noSave    ? '<span class="v-tag v-tag-wa">⚠ PNG is lossless — use WebP</span>' : '');
  }

  function _showCompare(orig, res) {
    var pct    = Math.round(res / orig * 100);
    var saved  = Math.max(0, Math.round((1 - res / orig) * 100));
    var noGain = saved <= 0;
    var barColor = noGain ? 'var(--am)' : 'var(--gn)';
    var el = $('v-cmp'); if (!el) return;
    var fixBtn = noGain
      ? '<button class="v-warn-btn" style="margin-top:8px" onclick="autoWebP();setTimeout(process,120)">⚡ Auto-fix: convert to WebP</button>'
      : '';
    el.innerHTML =
      '<div class="v-crow"><span class="v-clbl">Original</span><div class="v-cbw"><div class="v-cb" style="width:100%;background:var(--br-2)"></div></div><span class="v-cval">' + C.fmtBytes(orig) + '</span></div>' +
      '<div class="v-crow"><span class="v-clbl">Result</span><div class="v-cbw"><div class="v-cb" style="width:' + Math.min(pct, 100) + '%;background:' + barColor + '"></div></div><span class="v-cval">' + C.fmtBytes(res) + '</span></div>' +
      '<div class="v-cres" style="color:' + (noGain ? 'var(--am)' : 'var(--gn)') + ';display:flex;flex-wrap:wrap;align-items:center;gap:8px">' +
      (noGain
        ? '⚠ File got larger — PNG is lossless, quality slider has no effect.' + fixBtn
        : '✓ ' + saved + '% smaller — saved ' + C.fmtBytes(orig - res)) +
      '</div>';
  }

  function _resetAdj() {
    S.brightness=100; S.contrast=100; S.saturation=100;
    S.hue=0; S.sharpness=0; S.denoise=0;
    _syncAdj();
  }
  function _syncAdj() {
    [['v-ef-br',S.brightness,''],['v-ef-co',S.contrast,''],
     ['v-ef-sa',S.saturation,''],['v-ef-hu',S.hue,'°'],
     ['v-ef-sh',S.sharpness,''], ['v-ef-dn',S.denoise,'']].forEach(function(m){
      var el = $(m[0]); if (!el) return; el.value = m[1];
      var v  = $(m[0]+'-v'); if (v) v.textContent = m[1] + m[2];
    });
  }
  function _resetRot()  { $$('.v-rbtn').forEach(function(b){ b.classList.remove('on'); }); S.rotation = null; }
  function _resetEfx()  {
    $$('.v-ebtn').forEach(function(b){ b.classList.remove('on'); });
    var n = $('v-efx-none'); if (n) n.classList.add('on');
  }

  window.vTf = function(btn) { btn.parentElement.classList.toggle('op'); };
  window.vSwitchMode = function(mode, btn) {
    $$('.v-mode-tab').forEach(function(b){ b.classList.remove('on'); });
    btn.classList.add('on');
    var sm = $('v-single-mode'), bm = $('v-batch-mode');
    if (sm) sm.style.display = mode === 'single' ? '' : 'none';
    if (bm) bm.style.display = mode === 'batch'  ? '' : 'none';
  };

/* ═══════════════════════════════════════════════
     KEYBOARD SHORTCUTS
  ═══════════════════════════════════════════════ */
  document.addEventListener('keydown', function(e) {
    // Не срабатывает когда фокус в input/textarea
    var tag = document.activeElement && document.activeElement.tagName;
    var inInput = (tag === 'INPUT' || tag === 'TEXTAREA');

    // Enter — нажать главную кнопку Process
    if (e.key === 'Enter' && !inInput && S.origImg) {
      e.preventDefault();
      window.process();
    }

    // D — скачать результат
    if (e.key === 'd' && !inInput && S.resultBlob) {
      e.preventDefault();
      window.dlFile();
    }

    // N — новое изображение
    if (e.key === 'n' && !inInput) {
      e.preventDefault();
      window.newFile();
    }

    // 1-7 — переключение панелей
    var panels = ['compress','convert','resize','rotate','effects','blur','crop'];
    var idx = parseInt(e.key) - 1;
    if (!isNaN(idx) && idx >= 0 && idx < panels.length && !inInput && S.origImg) {
      var tbId = 'v-tb-' + panels[idx];
      switchPanel(panels[idx], $(tbId));
    }
  });

  /* ═══════════════════════════════════════════════
     PASTE IMAGE FROM CLIPBOARD (Ctrl+V)
  ═══════════════════════════════════════════════ */
  document.addEventListener('paste', function(e) {
    var items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    for (var i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        e.preventDefault();
        var file = items[i].getAsFile();
        if (file) window.loadFile(file);
        break;
      }
    }
  });

  /* ═══════════════════════════════════════════════
     AUTO-SCROLL TO RESULT on mobile
  ═══════════════════════════════════════════════ */
  var _origProcess = window.process;
  window.process = function() {
    _origProcess();
  };

  /* ═══════════════════════════════════════════════
     FILENAME INPUT — Enter triggers download
  ═══════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', function() {
    var fnin = $('v-fnin');
    if (fnin) {
      fnin.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') window.dlFile();
      });
    }
  });

})();