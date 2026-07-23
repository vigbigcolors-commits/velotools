/**
 * PSEO hydrate — apply server-validated config to Focus Room.
 * Does NOT read location.pathname / search for timers or sounds.
 * Only trusts #vt-page-config (written at build time from Zod matrix).
 */
(function () {
  'use strict';

  var THEMES = { teal: 1, midnight: 1, amber: 1, jade: 1 };
  var SOUNDS = { none: 1, rain: 1, lofi: 1, cafe: 1, forest: 1, fire: 1, ocean: 1 };

  function clampInt(n, min, max) {
    n = Number(n);
    if (!Number.isFinite(n)) return null;
    n = Math.round(n);
    if (n < min || n > max) return null;
    return n;
  }

  function clampVol(n) {
    n = Number(n);
    if (!Number.isFinite(n) || n < 0 || n > 1) return null;
    return n;
  }

  /**
   * Strict client re-validation (allowlist mirror of Zod DefaultConfigSchema).
   * Rejects unexpected keys and out-of-range values.
   */
  function parseConfig(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
    if (Object.getPrototypeOf(raw) !== Object.prototype && Object.getPrototypeOf(raw) !== null) {
      return null;
    }

    var allowedRoot = { timers: 1, soundPreset: 1, volume: 1, theme: 1 };
    for (var k in raw) {
      if (!Object.prototype.hasOwnProperty.call(raw, k)) continue;
      if (!allowedRoot[k]) return null;
    }

    var timers = raw.timers;
    if (!timers || typeof timers !== 'object') return null;
    var allowedTimers = { focusMinutes: 1, shortBreakMinutes: 1, longBreakMinutes: 1 };
    for (var tk in timers) {
      if (!Object.prototype.hasOwnProperty.call(timers, tk)) continue;
      if (!allowedTimers[tk]) return null;
    }

    var focus = clampInt(timers.focusMinutes, 5, 90);
    var shortB = clampInt(timers.shortBreakMinutes, 1, 30);
    var longB = clampInt(timers.longBreakMinutes, 5, 45);
    var vol = clampVol(raw.volume);
    var theme = typeof raw.theme === 'string' && THEMES[raw.theme] ? raw.theme : null;
    var sound =
      typeof raw.soundPreset === 'string' && SOUNDS[raw.soundPreset] ? raw.soundPreset : null;

    if (focus == null || shortB == null || longB == null || vol == null || !theme || !sound) {
      return null;
    }

    return {
      timers: {
        focusMinutes: focus,
        shortBreakMinutes: shortB,
        longBreakMinutes: longB,
      },
      soundPreset: sound,
      volume: vol,
      theme: theme,
    };
  }

  function readPageConfig() {
    var el = document.getElementById('vt-page-config');
    if (!el) return null;
    var data;
    try {
      data = JSON.parse(el.textContent || '');
    } catch (e) {
      return null;
    }
    if (!data || typeof data !== 'object') return null;
    var cfg = parseConfig(data.config);
    if (!cfg) return null;
    return { intentBanner: data.intentBanner, config: cfg };
  }

  function applyConfig(cfg) {
    if (typeof MODES === 'undefined' || typeof S === 'undefined') return false;

    MODES.focus = cfg.timers.focusMinutes * 60;
    MODES.short = cfg.timers.shortBreakMinutes * 60;
    MODES.long = cfg.timers.longBreakMinutes * 60;

    S.mode = 'focus';
    S.totalTime = MODES.focus;
    S.timeLeft = MODES.focus;
    S.volume = cfg.volume;

    if (typeof setTheme === 'function') {
      var btn = document.querySelector('[data-t="' + cfg.theme + '"]');
      setTheme(cfg.theme, btn);
    } else {
      S.theme = cfg.theme;
      document.body.setAttribute('data-theme', cfg.theme);
    }

    if (typeof updateTimerDisplay === 'function') updateTimerDisplay();
    if (typeof updateRing === 'function') updateRing();

    var volEl = document.getElementById('vol-slider') || document.querySelector('input[type="range"]');
    if (volEl && typeof setVolume === 'function') {
      volEl.value = Math.round(cfg.volume * 100);
      setVolume(cfg.volume * 100);
    }

    // Sound: highlight button only — autoplay blocked without gesture; user taps to start
    if (cfg.soundPreset !== 'none') {
      var sbtn = document.querySelector('[data-sound="' + cfg.soundPreset + '"]');
      if (sbtn) sbtn.classList.add('active');
      window.__VT_PSEO_SOUND = cfg.soundPreset;
    }

    return true;
  }

  function run() {
    var page = readPageConfig();
    if (!page) return;
    applyConfig(page.config);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      // After Focus Room's own DOMContentLoaded handlers in same tick order:
      // capture=false runs in registration order; hydrate is loaded BEFORE inline script,
      // so Focus init runs after us. Defer one macrotask to apply after Focus init.
      setTimeout(run, 0);
    });
  } else {
    setTimeout(run, 0);
  }
})();
