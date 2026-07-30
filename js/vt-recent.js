/**
 * VeloTools — Privacy-first Recent Files (local only)
 * Metadata + presets always; file bytes only with explicit opt-in + TTL.
 */
(function (global) {
  'use strict';

  var DB_NAME = 'vt-recent-v1';
  var DB_VERSION = 1;
  var STORE_ENTRIES = 'entries';
  var STORE_BLOBS = 'blobs';
  var MAX_PER_TOOL = 8;
  var MAX_BLOBS = 3;
  var MAX_BLOB_BYTES = 25 * 1024 * 1024;
  var BLOB_TTL_MS = 24 * 60 * 60 * 1000;

  var dbPromise = null;
  var panelKeepFile = Object.create(null);

  function openDb() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function (resolve, reject) {
      if (!global.indexedDB) {
        reject(new Error('IndexedDB unavailable'));
        return;
      }
      var req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains(STORE_ENTRIES)) {
          var entries = db.createObjectStore(STORE_ENTRIES, { keyPath: 'id' });
          entries.createIndex('byTool', 'toolId', { unique: false });
          entries.createIndex('byLastUsed', 'lastUsed', { unique: false });
        }
        if (!db.objectStoreNames.contains(STORE_BLOBS)) {
          db.createObjectStore(STORE_BLOBS, { keyPath: 'id' });
        }
      };
      req.onsuccess = function () {
        resolve(req.result);
      };
      req.onerror = function () {
        reject(req.error || new Error('Failed to open IndexedDB'));
      };
    });
    return dbPromise;
  }

  function txDone(tx) {
    return new Promise(function (resolve, reject) {
      tx.oncomplete = function () {
        resolve();
      };
      tx.onerror = function () {
        reject(tx.error || new Error('IndexedDB transaction failed'));
      };
      tx.onabort = function () {
        reject(tx.error || new Error('IndexedDB transaction aborted'));
      };
    });
  }

  function reqToPromise(req) {
    return new Promise(function (resolve, reject) {
      req.onsuccess = function () {
        resolve(req.result);
      };
      req.onerror = function () {
        reject(req.error || new Error('IndexedDB request failed'));
      };
    });
  }

  function uid() {
    return (
      'r_' +
      Date.now().toString(36) +
      '_' +
      Math.random().toString(36).slice(2, 10)
    );
  }

  function fmtBytes(n) {
    n = Number(n) || 0;
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
    return (n / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function relativeTime(ts) {
    var diff = Date.now() - (Number(ts) || 0);
    if (diff < 60 * 1000) return 'just now';
    if (diff < 60 * 60 * 1000) return Math.floor(diff / 60000) + 'm ago';
    if (diff < 24 * 60 * 60 * 1000) return Math.floor(diff / 3600000) + 'h ago';
    return Math.floor(diff / 86400000) + 'd ago';
  }

  function expiresLabel(expiresAt) {
    var ms = Number(expiresAt) || 0;
    if (!ms) return '';
    var left = ms - Date.now();
    if (left <= 0) return 'expired';
    if (left < 60 * 60 * 1000) return 'expires in ' + Math.max(1, Math.ceil(left / 60000)) + 'm';
    if (left < 24 * 60 * 60 * 1000) return 'expires in ' + Math.ceil(left / 3600000) + 'h';
    return 'expires in ' + Math.ceil(left / 86400000) + 'd';
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  async function getAllEntries(db) {
    var tx = db.transaction(STORE_ENTRIES, 'readonly');
    var store = tx.objectStore(STORE_ENTRIES);
    var rows = await reqToPromise(store.getAll());
    await txDone(tx);
    return rows || [];
  }

  async function putEntry(db, entry) {
    var tx = db.transaction(STORE_ENTRIES, 'readwrite');
    tx.objectStore(STORE_ENTRIES).put(entry);
    await txDone(tx);
  }

  async function deleteEntry(db, id) {
    var tx = db.transaction([STORE_ENTRIES, STORE_BLOBS], 'readwrite');
    tx.objectStore(STORE_ENTRIES).delete(id);
    tx.objectStore(STORE_BLOBS).delete(id);
    await txDone(tx);
  }

  async function putBlob(db, id, blob) {
    var tx = db.transaction(STORE_BLOBS, 'readwrite');
    tx.objectStore(STORE_BLOBS).put({ id: id, blob: blob });
    await txDone(tx);
  }

  async function getBlob(db, id) {
    var tx = db.transaction(STORE_BLOBS, 'readonly');
    var row = await reqToPromise(tx.objectStore(STORE_BLOBS).get(id));
    await txDone(tx);
    return row && row.blob ? row.blob : null;
  }

  async function countBlobs(db) {
    var tx = db.transaction(STORE_BLOBS, 'readonly');
    var n = await reqToPromise(tx.objectStore(STORE_BLOBS).count());
    await txDone(tx);
    return n || 0;
  }

  async function dropOldestBlobs(db, keepMax) {
    var entries = await getAllEntries(db);
    var withBlob = entries
      .filter(function (e) {
        return e.hasBlob;
      })
      .sort(function (a, b) {
        return (a.lastUsed || 0) - (b.lastUsed || 0);
      });
    while (withBlob.length > keepMax) {
      var old = withBlob.shift();
      var tx = db.transaction([STORE_ENTRIES, STORE_BLOBS], 'readwrite');
      tx.objectStore(STORE_BLOBS).delete(old.id);
      var next = Object.assign({}, old, {
        hasBlob: false,
        keepFile: false,
        expiresAt: null,
        blobBytes: 0,
      });
      tx.objectStore(STORE_ENTRIES).put(next);
      await txDone(tx);
    }
  }

  async function trimTool(db, toolId) {
    var entries = (await getAllEntries(db))
      .filter(function (e) {
        return e.toolId === toolId;
      })
      .sort(function (a, b) {
        return (b.lastUsed || 0) - (a.lastUsed || 0);
      });
    var excess = entries.slice(MAX_PER_TOOL);
    for (var i = 0; i < excess.length; i++) {
      await deleteEntry(db, excess[i].id);
    }
  }

  async function purgeExpired() {
    try {
      var db = await openDb();
      var now = Date.now();
      var entries = await getAllEntries(db);
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        if (e.hasBlob && e.expiresAt && e.expiresAt <= now) {
          var tx = db.transaction([STORE_ENTRIES, STORE_BLOBS], 'readwrite');
          tx.objectStore(STORE_BLOBS).delete(e.id);
          tx.objectStore(STORE_ENTRIES).put(
            Object.assign({}, e, {
              hasBlob: false,
              keepFile: false,
              expiresAt: null,
              blobBytes: 0,
            }),
          );
          await txDone(tx);
        }
      }
    } catch (err) {
      console.warn('[VTRecent] purgeExpired', err);
    }
  }

  async function list(toolId) {
    await purgeExpired();
    var db = await openDb();
    var entries = await getAllEntries(db);
    return entries
      .filter(function (e) {
        return !toolId || e.toolId === toolId;
      })
      .sort(function (a, b) {
        return (b.lastUsed || 0) - (a.lastUsed || 0);
      });
  }

  async function listAll() {
    return list(null);
  }

  /**
   * Record a recent item.
   * @param {object} opts
   * @param {string} opts.toolId
   * @param {string} opts.name
   * @param {number} opts.size
   * @param {string} [opts.type]
   * @param {object} [opts.presets]
   * @param {boolean} [opts.keepFile]
   * @param {Blob|File|Blob[]} [opts.blob] single blob or array (merge)
   * @param {string} [opts.displayName] optional override label
   */
  async function record(opts) {
    if (!opts || !opts.toolId || !opts.name) return null;
    await purgeExpired();
    var db = await openDb();
    var now = Date.now();
    var toolId = String(opts.toolId);
    var name = String(opts.displayName || opts.name).slice(0, 240);
    var keepFile = !!opts.keepFile;
    var blob = opts.blob || null;
    var blobs = null;
    var hasBlob = false;
    var expiresAt = null;
    var warn = null;
    var storedBytes = 0;

    if (Array.isArray(blob)) {
      blobs = blob.filter(Boolean);
      blob = null;
    }

    var existing = (await getAllEntries(db))
      .filter(function (e) {
        return e.toolId === toolId && e.name === name;
      })
      .sort(function (a, b) {
        return (b.lastUsed || 0) - (a.lastUsed || 0);
      });
    var id = existing.length ? existing[0].id : uid();

    if (existing.length && existing[0].hasBlob) {
      try {
        var txDel = db.transaction(STORE_BLOBS, 'readwrite');
        txDel.objectStore(STORE_BLOBS).delete(id);
        await txDone(txDel);
      } catch (e) {
        /* ignore */
      }
    }

    if (keepFile) {
      var totalSize = 0;
      if (blobs) {
        for (var i = 0; i < blobs.length; i++) totalSize += blobs[i].size || 0;
      } else if (blob) {
        totalSize = blob.size || Number(opts.size) || 0;
      }

      if (!blob && !blobs) {
        warn = 'Keep-file was on, but no file bytes were available — saved presets only.';
        keepFile = false;
      } else if (totalSize > MAX_BLOB_BYTES) {
        warn =
          'File is larger than 25 MB local cache limit — saved presets only (never uploaded).';
        keepFile = false;
        blob = null;
        blobs = null;
      } else {
        try {
          var blobCount = await countBlobs(db);
          if (blobCount >= MAX_BLOBS) {
            await dropOldestBlobs(db, MAX_BLOBS - 1);
          }
          if (blobs) {
            await putBlob(db, id, { kind: 'multi', parts: blobs });
          } else {
            await putBlob(db, id, blob);
          }
          hasBlob = true;
          storedBytes = totalSize;
          expiresAt = now + BLOB_TTL_MS;
        } catch (err) {
          console.warn('[VTRecent] blob store failed', err);
          warn =
            'Could not keep file bytes locally (storage full) — presets saved only.';
          keepFile = false;
          hasBlob = false;
          expiresAt = null;
          storedBytes = 0;
          try {
            await dropOldestBlobs(db, 0);
          } catch (e2) {
            /* ignore */
          }
        }
      }
    }

    var entry = {
      id: id,
      toolId: toolId,
      name: name,
      size: Number(opts.size) || 0,
      type: opts.type ? String(opts.type) : '',
      lastUsed: now,
      presets: opts.presets && typeof opts.presets === 'object' ? opts.presets : {},
      keepFile: keepFile,
      hasBlob: hasBlob,
      expiresAt: expiresAt,
      blobBytes: storedBytes,
    };

    await putEntry(db, entry);
    await trimTool(db, entry.toolId);
    if (hasBlob) await dropOldestBlobs(db, MAX_BLOBS);

    return { entry: entry, warning: warn };
  }

  async function restore(id) {
    await purgeExpired();
    var db = await openDb();
    var tx = db.transaction(STORE_ENTRIES, 'readonly');
    var meta = await reqToPromise(tx.objectStore(STORE_ENTRIES).get(id));
    await txDone(tx);
    if (!meta) return null;

    var file = null;
    var files = null;
    if (meta.hasBlob) {
      var raw = await getBlob(db, id);
      if (raw && raw.kind === 'multi' && Array.isArray(raw.parts)) {
        files = raw.parts.map(function (b, idx) {
          var names =
            (meta.presets && meta.presets.names) || [];
          var n = names[idx] || meta.name + '-' + (idx + 1) + '.pdf';
          return new File([b], n, {
            type: b.type || meta.type || 'application/pdf',
          });
        });
      } else if (raw) {
        file = new File([raw], meta.name, {
          type: raw.type || meta.type || 'application/octet-stream',
        });
      } else {
        meta = Object.assign({}, meta, {
          hasBlob: false,
          keepFile: false,
          expiresAt: null,
          blobBytes: 0,
        });
        await putEntry(db, meta);
      }
    }

    meta.lastUsed = Date.now();
    await putEntry(db, meta);

    return { meta: meta, file: file, files: files };
  }

  async function remove(id) {
    var db = await openDb();
    await deleteEntry(db, id);
  }

  /** Drop kept file bytes; keep name + presets (privacy-safe). */
  async function forgetBlob(id) {
    var db = await openDb();
    var tx = db.transaction(STORE_ENTRIES, 'readonly');
    var meta = await reqToPromise(tx.objectStore(STORE_ENTRIES).get(id));
    await txDone(tx);
    if (!meta) return null;
    var tx2 = db.transaction([STORE_ENTRIES, STORE_BLOBS], 'readwrite');
    tx2.objectStore(STORE_BLOBS).delete(id);
    var next = Object.assign({}, meta, {
      hasBlob: false,
      keepFile: false,
      expiresAt: null,
      blobBytes: 0,
    });
    tx2.objectStore(STORE_ENTRIES).put(next);
    await txDone(tx2);
    return next;
  }

  async function getStorageStats(toolId) {
    await purgeExpired();
    var db = await openDb();
    var entries = await getAllEntries(db);
    var used = 0;
    var blobCount = 0;
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i];
      if (!e.hasBlob) continue;
      blobCount++;
      used += Number(e.blobBytes) || Number(e.size) || 0;
    }
    var toolRows = toolId
      ? entries.filter(function (e) {
          return e.toolId === toolId;
        }).length
      : entries.length;
    return {
      usedBytes: used,
      blobCount: blobCount,
      maxBlobs: MAX_BLOBS,
      maxBlobBytes: MAX_BLOB_BYTES,
      entryCount: toolRows,
      maxPerTool: MAX_PER_TOOL,
    };
  }

  async function clear(toolId) {
    var db = await openDb();
    var entries = await getAllEntries(db);
    for (var i = 0; i < entries.length; i++) {
      if (!toolId || entries[i].toolId === toolId) {
        await deleteEntry(db, entries[i].id);
      }
    }
  }

  function wantsKeepFile(toolId) {
    return !!panelKeepFile[toolId];
  }

  function setKeepFile(toolId, on) {
    panelKeepFile[toolId] = !!on;
  }

  function showToast(root, msg) {
    if (!root) return;
    var toast = root.querySelector('.vt-recent-toast');
    if (!toast) return;
    if (!msg) {
      toast.hidden = true;
      toast.textContent = '';
      return;
    }
    toast.hidden = false;
    toast.textContent = msg;
  }

  function invokeRestore(root, toolId, opts, id, intent) {
    if (typeof opts.onRestore !== 'function') return;
    restore(id)
      .then(function (payload) {
        if (!payload) {
          showToast(root, 'That item is no longer available.');
          refreshPanel(root, toolId, opts);
          return;
        }
        payload.intent = intent || (payload.file || payload.files ? 'file' : 'presets');
        return Promise.resolve(opts.onRestore(payload)).then(function (msg) {
          if (typeof msg === 'string' && msg) showToast(root, msg);
          else showToast(root, '');
          refreshPanel(root, toolId, opts);
        });
      })
      .catch(function (err) {
        console.warn('[VTRecent] restore', err);
        showToast(root, 'Could not restore this item.');
      });
  }

  function renderPanel(root, toolId, rows, opts, stats) {
    var hasRows = rows && rows.length;
    var listHtml = '';
    if (hasRows) {
      listHtml =
        '<ul class="vt-recent-list">' +
        rows
          .map(function (e) {
            var badge = e.hasBlob
              ? '<span class="vt-recent-badge vt-recent-badge--kept">File kept</span>'
              : '<span class="vt-recent-badge vt-recent-badge--presets">Presets only</span>';
            var exp = e.hasBlob && e.expiresAt ? expiresLabel(e.expiresAt) : '';
            var actions =
              '<button type="button" class="vt-recent-btn vt-recent-btn--primary" data-act="reuse" title="' +
              (e.hasBlob
                ? 'Reload kept file + presets'
                : 'Apply saved presets only') +
              '">Reuse</button>';
            if (!e.hasBlob) {
              actions +=
                '<button type="button" class="vt-recent-btn" data-act="choose" title="Apply presets, then pick the file">Choose file</button>';
            } else {
              actions +=
                '<button type="button" class="vt-recent-btn" data-act="forget" title="Delete kept bytes; keep presets">Forget bytes</button>';
            }
            actions +=
              '<button type="button" class="vt-recent-btn vt-recent-btn--ghost" data-act="remove">Remove</button>';
            return (
              '<li class="vt-recent-item" data-id="' +
              esc(e.id) +
              '">' +
              '<div class="vt-recent-meta">' +
              '<span class="vt-recent-name" title="' +
              esc(e.name) +
              '">' +
              esc(e.name) +
              '</span>' +
              '<div class="vt-recent-info">' +
              badge +
              '<span>' +
              esc(fmtBytes(e.size)) +
              '</span>' +
              '<span>' +
              esc(relativeTime(e.lastUsed)) +
              '</span>' +
              (exp
                ? '<span class="vt-recent-expires">' + esc(exp) + '</span>'
                : '') +
              '</div></div>' +
              '<div class="vt-recent-actions">' +
              actions +
              '</div></li>'
            );
          })
          .join('') +
        '</ul>';
    } else {
      listHtml =
        '<p class="vt-recent-empty">After you process a file, its name and last settings appear here — stored only in this browser. File bytes are never kept unless you opt in below.</p>';
    }

    var meter = '';
    if (stats) {
      meter =
        '<div class="vt-recent-meter" aria-live="polite">' +
        '<span>Local cache: <strong>' +
        esc(fmtBytes(stats.usedBytes)) +
        '</strong> · ' +
        esc(String(stats.blobCount)) +
        '/' +
        esc(String(stats.maxBlobs)) +
        ' kept files</span>' +
        '<span class="vt-recent-meter-cap">cap ' +
        esc(fmtBytes(stats.maxBlobBytes)) +
        '/file · never uploaded</span>' +
        '</div>';
    }

    root.innerHTML =
      '<div class="vt-recent-head">' +
      '<div><h3 class="vt-recent-title">Recent on this device</h3>' +
      '<p class="vt-recent-sub">Local only · never uploaded</p></div>' +
      (hasRows
        ? '<button type="button" class="vt-recent-clear" data-act="clear">Clear all</button>'
        : '') +
      '</div>' +
      listHtml +
      meter +
      '<div class="vt-recent-optin">' +
      '<input type="checkbox" id="vt-recent-keep-' +
      esc(toolId) +
      '"' +
      (wantsKeepFile(toolId) ? ' checked' : '') +
      '>' +
      '<div><label class="vt-recent-optin-label" for="vt-recent-keep-' +
      esc(toolId) +
      '">Keep file on this device for quick re-run</label>' +
      '<span class="vt-recent-privacy">Stored only in this browser. Never uploaded. Auto-deletes in 24 hours. You can clear or forget bytes anytime.</span></div>' +
      '</div>' +
      '<div class="vt-recent-toast" hidden></div>';

    var cb = root.querySelector('#vt-recent-keep-' + toolId);
    if (cb) {
      cb.addEventListener('change', function () {
        setKeepFile(toolId, cb.checked);
      });
    }

    root.querySelectorAll('[data-act="clear"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        clear(toolId).then(function () {
          refreshPanel(root, toolId, opts);
        });
      });
    });

    root.querySelectorAll('.vt-recent-item').forEach(function (item) {
      var id = item.getAttribute('data-id');
      item.querySelectorAll('[data-act]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var act = btn.getAttribute('data-act');
          if (act === 'remove') {
            remove(id).then(function () {
              refreshPanel(root, toolId, opts);
            });
            return;
          }
          if (act === 'forget') {
            forgetBlob(id).then(function () {
              showToast(
                root,
                'File bytes removed. Presets stay on this device — nothing was uploaded.',
              );
              refreshPanel(root, toolId, opts);
            });
            return;
          }
          if (act === 'reuse') {
            invokeRestore(root, toolId, opts, id, null);
            return;
          }
          if (act === 'choose') {
            invokeRestore(root, toolId, opts, id, 'pick');
          }
        });
      });
    });
  }

  function refreshPanel(root, toolId, opts) {
    Promise.all([list(toolId), getStorageStats(toolId)])
      .then(function (pair) {
        renderPanel(root, toolId, pair[0], opts, pair[1]);
      })
      .catch(function () {
        renderPanel(root, toolId, [], opts, null);
      });
  }

  /**
   * Mount recent panel into an element.
   * @param {HTMLElement|string} el
   * @param {{ toolId: string, onRestore: function }} opts
   * onRestore(payload) — payload.intent: 'file' | 'presets' | 'pick'
   */
  function mountPanel(el, opts) {
    var root = typeof el === 'string' ? document.querySelector(el) : el;
    if (!root || !opts || !opts.toolId) return null;
    root.classList.add('vt-recent');
    root.hidden = false;
    setKeepFile(opts.toolId, false);
    refreshPanel(root, opts.toolId, opts);
    return {
      refresh: function () {
        refreshPanel(root, opts.toolId, opts);
      },
      toast: function (msg) {
        showToast(root, msg);
      },
      wantsKeepFile: function () {
        return wantsKeepFile(opts.toolId);
      },
    };
  }

  // Helper for tools: record + refresh panel handle
  async function recordAndRefresh(panel, payload) {
    var result = await record(payload);
    if (panel && panel.refresh) panel.refresh();
    if (result && result.warning && panel && panel.toast) {
      panel.toast(result.warning);
    }
    return result;
  }

  global.VTRecent = {
    record: record,
    list: list,
    listAll: listAll,
    restore: restore,
    remove: remove,
    forgetBlob: forgetBlob,
    clear: clear,
    purgeExpired: purgeExpired,
    getStorageStats: getStorageStats,
    mountPanel: mountPanel,
    wantsKeepFile: wantsKeepFile,
    setKeepFile: setKeepFile,
    recordAndRefresh: recordAndRefresh,
    fmtBytes: fmtBytes,
    MAX_BLOB_BYTES: MAX_BLOB_BYTES,
    MAX_BLOBS: MAX_BLOBS,
  };
})(typeof window !== 'undefined' ? window : globalThis);
