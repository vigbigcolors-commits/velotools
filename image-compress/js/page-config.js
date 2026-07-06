/**
 * Stateful page config for image-compress (marketplace intents).
 * Reads #vt-page-config JSON baked at build time.
 */
(function () {
  'use strict';

  function readConfig() {
    var el = document.getElementById('vt-page-config');
    if (!el) return null;
    try {
      return JSON.parse(el.textContent);
    } catch (e) {
      console.warn('vt-page-config parse error', e);
      return null;
    }
  }

  function $(id) {
    return document.getElementById(id);
  }

  function showBanner(msg) {
    var bar = document.getElementById('vt-intent-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'vt-intent-bar';
      bar.className = 'vt-intent-bar';
      var hero = document.querySelector('.v-hero');
      if (hero && hero.parentNode) hero.parentNode.insertBefore(bar, hero.nextSibling);
    }
    bar.textContent = msg;
    bar.hidden = false;
  }

  function showLimitWarn(msg) {
    var box = document.getElementById('vt-limit-warn');
    if (!box) {
      box = document.createElement('div');
      box.id = 'vt-limit-warn';
      box.className = 'vt-limit-warn';
      var res = $('v-result');
      if (res) res.insertBefore(box, res.firstChild);
    }
    box.textContent = '⚠ ' + msg;
    box.style.display = msg ? '' : 'none';
  }

  function lockEl(el) {
    if (!el) return;
    el.disabled = true;
    el.style.opacity = '0.55';
    el.style.pointerEvents = 'none';
  }

  function applyWidget(cfg) {
    var w = cfg.widget;
    var S = window.VState;
    if (!S || !w) return;

    if (w.quality != null) {
      S.quality = w.quality;
      var sq = $('sl-quality');
      var sq2 = $('sl-quality-2');
      if (sq) sq.value = w.quality;
      if (sq2) sq2.value = w.quality;
      var qv = $('quality-val');
      if (qv) qv.textContent = w.quality + '%';
    }

    if (w.format === 'jpeg') {
      S.format = 'jpeg';
      var fmt = $('v-fmt');
      if (fmt) fmt.value = 'image/jpeg';
    }

    if (w.outputWidth && w.outputHeight) {
      S.targetW = w.outputWidth;
      S.targetH = w.outputHeight;
      S.lockAR = !!w.lockAspect;
      var rw = $('v-rw');
      var rh = $('v-rh');
      if (rw) rw.value = w.outputWidth;
      if (rh) rh.value = w.outputHeight;
      var arBtn = $('v-lock-ar');
      if (arBtn) arBtn.classList.toggle('on', S.lockAR);
    }

    if (w.aspectRatio && window.setCropAspect) {
      var ratio = w.aspectRatio;
      var btn = document.querySelector('.v-crop-pr[data-ratio="' + ratio + '"]');
      if (!btn && ratio === 1) btn = document.querySelector('.v-crop-pr[data-ratio="1"]');
      if (!btn && ratio === 0.75) btn = document.querySelector('.v-crop-pr[data-ratio="4/5"]');
      if (btn) window.setCropAspect(ratio, btn);
      else if (typeof ratio === 'number') window.setCropAspect(ratio, null);
    }

    if (w.activePanel === 'compress' && window.switchPanel) {
      var tab = $('v-tb-compress');
      if (tab) window.switchPanel('compress', tab);
    }

    if (w.lock) {
      w.lock.forEach(function (key) {
        if (key === 'quality') {
          lockEl($('sl-quality'));
          lockEl($('sl-quality-2'));
        }
        if (key === 'dimensions') {
          lockEl($('v-rw'));
          lockEl($('v-rh'));
        }
        if (key === 'aspect') {
          document.querySelectorAll('.v-crop-pr').forEach(lockEl);
        }
      });
    }

    if (cfg.intentBanner) showBanner(cfg.intentBanner);
  }

  function hookProcess(cfg) {
    document.addEventListener('velo:image-processed', function (e) {
      var size = e.detail && e.detail.size;
      if (!size || !cfg.widget.maxOutputBytes) return;
      if (size > cfg.widget.maxOutputBytes) {
        showLimitWarn(cfg.widget.limitWarning || 'Output exceeds platform file limit.');
      } else {
        showLimitWarn('');
      }
    });
  }

  function init() {
    var cfg = readConfig();
    if (!cfg) return;
    applyWidget(cfg);
    hookProcess(cfg);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
