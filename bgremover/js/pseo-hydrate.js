/**
 * BG Remover PSEO hydrate — reads #vt-page-config only (Zod-baked allowlist).
 * Never reads window.location for tool state.
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

  function applyPreset(cfg) {
    if (!cfg || !cfg.config) return;
    var c = cfg.config;

    if (typeof window.setBg === 'function') {
      var idx = typeof c.bgSwatchIndex === 'number' ? c.bgSwatchIndex : null;
      window.setBg(c.defaultBg, idx);
    }

    // Soft tip under upload zone
    var tip = document.getElementById('vt-preset-tip');
    if (!tip) {
      tip = document.createElement('p');
      tip.id = 'vt-preset-tip';
      tip.style.cssText =
        'margin:14px auto 0;max-width:520px;text-align:center;font-size:12px;color:var(--tx2,#b0a8c0);font-family:DM Sans,system-ui,sans-serif';
      var upload = document.getElementById('s-upload');
      if (upload && upload.parentNode) {
        upload.parentNode.insertBefore(tip, upload.nextSibling);
      }
    }
    var parts = [];
    if (c.tipLabel) parts.push(c.tipLabel);
    if (c.suggestRefine) parts.push('After AI, try Refine once');
    if (c.exportHint === 'jpg-white') parts.push('Prefer JPG on white for listings');
    if (c.exportHint === 'webp') parts.push('Prefer WebP for web/social');
    if (c.exportHint === 'png') parts.push('Prefer transparent PNG');
    tip.textContent = parts.join(' · ');
  }

  function init() {
    var cfg = readConfig();
    if (!cfg) return;
    // Wait a tick so app.js init exposes setBg
    setTimeout(function () {
      applyPreset(cfg);
    }, 0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
