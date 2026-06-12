/**
 * VeloTools — raw-decoder.js
 * Extracts the embedded preview JPEG from camera RAW containers
 * (CR2, CR3, NEF, ARW, DNG, RW2, ORF, PEF, RAF, ...) using pure JS —
 * no WASM, no network, no dependencies. Works in every browser.
 */
window.VRaw = (function () {
  'use strict';

  var TYPE_SIZE = {1:1,2:1,3:2,4:4,5:8,6:1,7:1,8:2,9:4,10:8,11:4,12:8};

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
        if (off > 0 && len > 0 && off + len <= buf.byteLength) out.push({offset:off, length:len});
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
        // Embedded JPEG thumbnail/preview (most common location)
        if (map[0x201] && map[0x202]) pushJpeg(scalar(map[0x201]), scalar(map[0x202]));
        // Old-style strip stored as JPEG (Compression 6 = JPEG, 7 = lossless JPEG)
        if (map[0x103] && map[0x111] && map[0x117]) {
          var comp = scalar(map[0x103]);
          if (comp === 6 || comp === 7) pushJpeg(scalar(map[0x111]), scalar(map[0x117]));
        }
        // SubIFDs (0x14A) — CR2/NEF/DNG store full-res preview here
        if (map[0x14a]) {
          var e = map[0x14a], cnt = e.count;
          var base = (cnt * 4 > 4) ? u32(e.valOff) : e.valOff;
          for (var k = 0; k < cnt; k++) readIFD(u32(base + k * 4));
        }
        // Exif sub-IFD (0x8769)
        if (map[0x8769]) readIFD(u32(map[0x8769].valOff));
        // Next IFD in chain
        readIFD(u32(off + 2 + n * 12));
      }
      readIFD(u32(4));
    } catch (e) { /* malformed TIFF — fall through to brute force */ }
    return out;
  }

  /** Scan raw bytes for complete JPEG segments (SOI...EOI). Catches CR3 / RAF. */
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

  /** Returns Promise<Blob[]> — candidate JPEG previews, largest first. */
  function extractPreviews(file) {
    return file.arrayBuffer().then(function (buf) {
      var cands = tiffJpegs(buf);
      if (!cands.length) cands = bruteJpegs(buf, 20000);
      cands.sort(function (a, b) { return b.length - a.length; });
      return cands.slice(0, 5).map(function (c) {
        return new Blob([buf.slice(c.offset, c.offset + c.length)], { type:'image/jpeg' });
      });
    });
  }

  /** Returns Promise<{img:Image, blob:Blob, url:string, width:number, height:number}>
   *  Tries each candidate preview until one actually decodes. */
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

