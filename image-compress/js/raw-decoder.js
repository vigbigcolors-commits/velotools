/**
 * VeloTools — raw-decoder.js
 * Extracts the embedded preview JPEG from camera RAW containers
 * (CR2, CR3, NEF, ARW, DNG, RW2, ORF, PEF, RAF, ...) using pure JS —
 * no WASM, no network, no dependencies. Works in every browser.
 *
 * Most RAW formats are TIFF-based and store one or more full-size
 * preview/thumbnail JPEGs inside their IFD/SubIFD chain. For formats
 * that aren't plain TIFF (CR3, RAF), we fall back to scanning the raw
 * bytes for JPEG SOI/EOI markers — every RAW preview is itself a
 * standards-compliant JPEG, so this always finds it.
 *
 * THE CR2 "BLACK IMAGE" PROBLEM
 * ------------------------------
 * CR2 (and several other RAW formats) embed the actual sensor data as
 * a "lossless JPEG" (JPEG SOF3 / differential coding). This block is
 * usually the LARGEST JPEG-flagged region in the file — but no browser
 * can decode SOF3 entropy data. Critically, <img onerror> often does
 * NOT fire: the decoder reads the SOF3 header fine (so width/height and
 * `onload` succeed) but produces solid black pixels for the scan data.
 *
 * Fix: every candidate is inspected at the JPEG marker level. Only
 * SOF0 / SOF1 / SOF2 (baseline / extended / progressive — all decodable
 * everywhere) are accepted. SOF3 and other exotic SOF variants are
 * rejected outright, so the real camera-generated preview (always
 * baseline/progressive) is what gets used.
 *
 * As a final safety net, decode() also samples pixels from the decoded
 * canvas and rejects a result that is uniformly black/blank, moving on
 * to the next candidate instead.
 */
window.VRaw = (function () {
  'use strict';

  /* ── TIFF/IFD WALK ─────────────────────────────────────────── */

  /** Walk a TIFF IFD chain (CR2 / NEF / ARW / DNG / RW2 / ORF / PEF). */
  function tiffJpegs(buf) {
    var out = [];
    try {
      var dv = new DataView(buf);
      var bom = dv.getUint16(0);
      if (bom !== 0x4949 && bom !== 0x4D4D) return out; // not TIFF-based
      var little = bom === 0x4949;
      function u16(o){ return dv.getUint16(o, little); }
      function u32(o){ return dv.getUint32(o, little); }
      if (u16(2) !== 42) return out;

      var visited = {};
      function scalar(entry){
        return entry.type === 3 ? u16(entry.valOff) : u32(entry.valOff);
      }
      function pushJpeg(off, len){
        if (off > 0 && len > 4 && off + len <= buf.byteLength) out.push({offset:off, length:len});
      }
      function readIFD(off){
        if (off <= 0 || off + 2 > buf.byteLength || visited[off]) return;
        visited[off] = true;
        var n = u16(off);
        var maxN = Math.floor((buf.byteLength - off - 6) / 12);
        if (n > maxN) n = Math.max(0, maxN);
        var map = {};
        for (var i = 0; i < n; i++) {
          var eo = off + 2 + i * 12;
          var tag = u16(eo), type = u16(eo + 2), count = u32(eo + 4);
          map[tag] = { type:type, count:count, valOff: eo + 8 };
        }
        // Embedded JPEG thumbnail/preview — tags 0x201 (offset) / 0x202 (length)
        if (map[0x201] && map[0x202]) pushJpeg(scalar(map[0x201]), scalar(map[0x202]));
        // Strip stored as JPEG — Compression 6 (old JPEG) or 7 (JPEG, incl. lossless).
        // Both are pushed here; the SOF check in extractPreviews() filters out
        // any that turn out to be SOF3 lossless sensor data.
        if (map[0x103] && map[0x111] && map[0x117]) {
          var comp = scalar(map[0x103]);
          if (comp === 6 || comp === 7) pushJpeg(scalar(map[0x111]), scalar(map[0x117]));
        }
        // SubIFDs (0x14A) — CR2/NEF/DNG store full-res preview + raw data here
        if (map[0x14a]) {
          var e = map[0x14a], cnt = e.count;
          var base = (cnt * 4 > 4) ? u32(e.valOff) : e.valOff;
          for (var k = 0; k < cnt; k++) readIFD(u32(base + k * 4));
        }
        // Exif sub-IFD (0x8769) — often holds another preview
        if (map[0x8769]) readIFD(u32(map[0x8769].valOff));
        // Next IFD in chain
        readIFD(u32(off + 2 + n * 12));
      }
      readIFD(u32(4));
    } catch (_e) { /* malformed TIFF — fall through to brute force */ }
    return out;
  }

  /* ── BRUTE-FORCE SOI/EOI SCAN (CR3 / RAF / unknown containers) ──── */

  function bruteJpegs(buf, minSize) {
    var b = new Uint8Array(buf), out = [], len = b.length;
    for (var i = 0; i < len - 3; i++) {
      if (b[i] === 0xFF && b[i+1] === 0xD8 && b[i+2] === 0xFF) {
        for (var j = i + 2; j < len - 1; j++) {
          if (b[j] === 0xFF && b[j+1] === 0xD9) {
            var L = j + 2 - i;
            if (L >= minSize) out.push({offset:i, length:L});
            i = j;
            break;
          }
        }
      }
    }
    return out;
  }

  /* ── JPEG SOF-MARKER INSPECTION ───────────────────────────────── */

  /**
   * Returns the SOF marker byte (0xC0–0xCF range) of a JPEG region, or
   * -1 if no SOF marker was found before running out of data / hitting SOS.
   */
  function sofMarker(buf, offset, length) {
    var end = Math.min(buf.byteLength, offset + length);
    var b = new Uint8Array(buf, offset, end - offset);
    var i = 2; // skip SOI (FF D8)
    while (i < b.length - 3) {
      if (b[i] !== 0xFF) { i++; continue; }
      var m = b[i+1];
      if (m === 0xFF) { i++; continue; }              // fill byte
      if (m === 0xD8 || (m >= 0xD0 && m <= 0xD9) || m === 0x01) { i += 2; continue; } // no-length markers
      if (i + 4 > b.length) break;
      var segLen = (b[i+2] << 8) | b[i+3];
      // SOF0..SOF15 except DHT(0xC4), JPG(0xC8), DAC(0xCC)
      if (m >= 0xC0 && m <= 0xCF && m !== 0xC4 && m !== 0xC8 && m !== 0xCC) return m;
      if (m === 0xDA) break; // SOS — start of scan, no SOF seen
      if (segLen < 2) break;
      i += 2 + segLen;
    }
    return -1;
  }

  /** true for SOF0 (baseline), SOF1 (extended sequential), SOF2 (progressive) — universally decodable. */
  function isDecodableSOF(m) { return m === 0xC0 || m === 0xC1 || m === 0xC2; }

  /**
   * Filter + classify raw candidate regions:
   *  - drop anything whose SOF marker exists and is NOT C0/C1/C2 (e.g. SOF3 lossless RAW data)
   *  - keep anything where no SOF was found (small thumbnails / unknown — worth a try)
   */
  function filterDecodable(buf, cands) {
    var out = [];
    for (var i = 0; i < cands.length; i++) {
      var c = cands[i];
      var sof = sofMarker(buf, c.offset, c.length);
      if (sof === -1 || isDecodableSOF(sof)) out.push(c);
    }
    return out;
  }

  /* ── PUBLIC API ───────────────────────────────────────────────── */

  /** Returns Promise<Blob[]> — decodable candidate JPEG previews, largest first. */
  function extractPreviews(file) {
    return file.arrayBuffer().then(function (buf) {
      var cands = filterDecodable(buf, tiffJpegs(buf));
      if (!cands.length) cands = filterDecodable(buf, bruteJpegs(buf, 20000));
      cands.sort(function (a, b) { return b.length - a.length; });
      return cands.slice(0, 6).map(function (c) {
        return new Blob([buf.slice(c.offset, c.offset + c.length)], { type:'image/jpeg' });
      });
    });
  }

  /** Draws img to a small canvas and reports whether it's effectively blank/black. */
  function isBlank(img) {
    try {
      var c = document.createElement('canvas');
      var size = 24;
      c.width = size; c.height = size;
      var ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, size, size);
      var data = ctx.getImageData(0, 0, size, size).data;
      var sum = 0, sumSq = 0, n = data.length / 4;
      for (var i = 0; i < data.length; i += 4) {
        var lum = (data[i] + data[i+1] + data[i+2]) / 3;
        sum += lum; sumSq += lum * lum;
      }
      var mean = sum / n;
      var variance = sumSq / n - mean * mean;
      // Uniformly black (or uniformly any single colour) => blank decode
      return mean < 2 || variance < 0.5;
    } catch (_e) {
      return false; // can't verify (e.g. tainted canvas) — assume OK
    }
  }

  /**
   * Returns Promise<{img:Image, blob:Blob, url:string, width:number, height:number}>
   * Tries each candidate preview until one actually decodes AND isn't blank.
   */
  function decode(file) {
    return extractPreviews(file).then(function (blobs) {
      return new Promise(function (resolve, reject) {
        if (!blobs.length) return reject(new Error('No embedded preview found in RAW file'));
        var i = 0;
        function tryNext() {
          if (i >= blobs.length) return reject(new Error('No decodable preview in RAW file'));
          var blob = blobs[i++];
          var url = URL.createObjectURL(blob);
          var img = new Image();
          img.onload = function () {
            if (isBlank(img)) { URL.revokeObjectURL(url); tryNext(); return; }
            resolve({ img:img, blob:blob, url:url, width:img.naturalWidth, height:img.naturalHeight });
          };
          img.onerror = function () { URL.revokeObjectURL(url); tryNext(); };
          img.src = url;
        }
        tryNext();
      });
    });
  }

  return { decode:decode, extractPreviews:extractPreviews };
})();