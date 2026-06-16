/**
 * VeloTools — core-utils.js
 * Shared DOM and formatting helpers for image-compress.
 */
var VCore = (function () {
  'use strict';

  function $(id) {
    return document.getElementById(id);
  }

  function $$(selector) {
    return document.querySelectorAll(selector);
  }

  function px(value) {
    return Math.round(value) + 'px';
  }

  function fmtBytes(bytes) {
    var b = Number(bytes) || 0;
    if (b < 1024) return b + ' B';
    if (b < 1048576) return Math.round(b / 1024) + ' KB';
    return (b / 1048576).toFixed(1) + ' MB';
  }

  function updateSliderTrack(slider, numEl, text) {
    if (!slider) return;
    if (numEl) numEl.textContent = text;
    var value = parseInt(slider.value, 10);
    var pct = ((value - 10) / 90) * 100;
    slider.style.background =
      'linear-gradient(to right,var(--ac) ' + pct + '%,var(--br-2) ' + pct + '%)';
  }

  function downloadBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function escHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  return {
    $: $,
    $$: $$,
    px: px,
    fmtBytes: fmtBytes,
    updateSliderTrack: updateSliderTrack,
    downloadBlob: downloadBlob,
    escHtml: escHtml,
  };
})();

if (typeof window !== 'undefined') {
  window.VCore = VCore;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = VCore;
}
