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
    var min = parseFloat(slider.min);
    var max = parseFloat(slider.max);
    if (!isFinite(min)) min = 0;
    if (!isFinite(max) || max <= min) max = 100;
    var value = parseFloat(slider.value);
    var pct = ((value - min) / (max - min)) * 100;
    slider.style.background =
      'linear-gradient(to right,var(--ac) ' + pct + '%,var(--br-2) ' + pct + '%)';
  }

  /** Reliable range input on mobile (iOS Safari often skips input while dragging). */
  function bindRangeInput(slider, onChange) {
    if (!slider || typeof onChange !== 'function') return;
    function fire() {
      onChange.call(slider);
    }
    slider.addEventListener('input', fire);
    slider.addEventListener('change', fire);
    if (window.PointerEvent) {
      var dragging = false;
      slider.addEventListener('pointerdown', function (e) {
        dragging = true;
        try { slider.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
        fire();
      });
      slider.addEventListener('pointermove', function () {
        if (dragging) fire();
      });
      function endDrag() {
        dragging = false;
        fire();
      }
      slider.addEventListener('pointerup', endDrag);
      slider.addEventListener('pointercancel', endDrag);
    }
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
    bindRangeInput: bindRangeInput,
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
