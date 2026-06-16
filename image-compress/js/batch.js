/**
 * VeloTools — batch.js
 * Processes up to 15 images simultaneously with a queue,
 * per-card progress, RAW preview support, and ZIP download via JSZip CDN.
 */
window.VBatch = (function () {
  'use strict';

  var files = [];
  var results = [];
  var rawCache = {}; // i -> {img,blob,url,width,height} | null (decode failed)
  var settings = { quality:80, format:'image/webp' };
  var RAW_EXT = /\.(cr2|cr3|nef|nrw|arw|srf|sr2|dng|raf|rw2|orf|pef|srw|x3f|raw)$/i;

  /* ── INIT ──────────────────── */
  function init() {
    var dz = document.getElementById('vb-dz');
    if (!dz) return;
    dz.addEventListener('dragover',  function(e){ e.preventDefault(); dz.classList.add('over'); });
    dz.addEventListener('dragleave', function(){ dz.classList.remove('over'); });
    dz.addEventListener('drop',      function(e){ e.preventDefault(); dz.classList.remove('over'); addFiles(Array.from(e.dataTransfer.files)); });
    document.getElementById('vb-fi').addEventListener('change', function(){ addFiles(Array.from(this.files)); });
    document.getElementById('vb-qsl').addEventListener('input', function(){ settings.quality=parseInt(this.value); document.getElementById('vb-qnum').textContent=this.value+'%'; });
    document.getElementById('vb-fmt').addEventListener('change', function(){ settings.format=this.value; });
  }

  function addFiles(newFiles) {
    newFiles.filter(function(f){ return f.type.startsWith('image/') || RAW_EXT.test(f.name || ''); })
      .slice(0, Math.max(0, 15 - files.length))
      .forEach(function(f){ files.push(f); });
    render();
  }

  /* ── RENDER CARDS ──────────── */
  function render() {
    var grid = document.getElementById('vb-grid');
    var empty = document.getElementById('vb-empty');
    if (!grid) return;
    grid.innerHTML = '';
    if (!files.length) { if(empty) empty.style.display='block'; return; }
    if(empty) empty.style.display='none';
    files.forEach(function(f, i) {
      var isRaw = RAW_EXT.test(f.name || '');
      var card = document.createElement('div');
      card.className = 'v-bcard' + (isRaw ? ' v-bcard-raw' : '');
      card.id = 'vbc-'+i;

      var thumbHtml, metaText = fmtB(f.size);
      if (isRaw && rawCache[i] && rawCache[i].url) {
        thumbHtml = '<div class="v-bcard-imgwrap"><img class="v-bcard-img" src="'+rawCache[i].url+'" alt="'+f.name+'"><span class="v-bcard-rawtag">RAW</span></div>';
        metaText = fmtB(f.size) + ' · ' + rawCache[i].width + '×' + rawCache[i].height + ' preview';
      } else if (isRaw && rawCache[i] === null) {
        thumbHtml = '<div class="v-bcard-imgwrap"><div class="v-bcard-raw-ph"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><span>No preview</span></div><span class="v-bcard-rawtag">RAW</span></div>';
      } else if (isRaw) {
        thumbHtml = '<div class="v-bcard-imgwrap"><div class="v-bcard-raw-ph" id="vbi-'+i+'"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span>Reading RAW…</span></div><span class="v-bcard-rawtag">RAW</span></div>';
      } else {
        var url = URL.createObjectURL(f);
        thumbHtml = '<img class="v-bcard-img" src="'+url+'" alt="'+f.name+'">';
      }

      card.innerHTML =
        thumbHtml +
        '<div class="v-bcard-info">'+
          '<div class="v-bcard-name" title="'+f.name+'">'+f.name+'</div>'+
          '<div class="v-bcard-meta" id="vbm-'+i+'">'+metaText+'</div>'+
          '<div class="v-bcard-bar"><div class="v-bcard-prog" id="vbp-'+i+'" style="width:0"></div></div>'+
          '<div class="v-bcard-status" id="vbs-'+i+'">Waiting…</div>'+
        '</div>';
      grid.appendChild(card);

      if (isRaw && rawCache[i] === undefined) _decodeRawThumb(i, f);
    });
    document.getElementById('vb-count').textContent = files.length + ' image' + (files.length>1?'s':'') + ' ready';
    document.getElementById('vb-actions').style.display = 'flex';
  }

  /** Decode a RAW file's embedded preview for the batch thumbnail; cache the
   *  result so processOne() can reuse it without decoding twice. */
  function _decodeRawThumb(i, f) {
    if (!window.VRaw) { rawCache[i] = null; return; }
    window.VRaw.decode(f).then(function (r) {
      rawCache[i] = r;
      var ph = document.getElementById('vbi-'+i);
      if (ph && ph.parentElement) {
        ph.parentElement.innerHTML = '<img class="v-bcard-img" src="'+r.url+'" alt="'+f.name+'"><span class="v-bcard-rawtag">RAW</span>';
      }
      var meta = document.getElementById('vbm-'+i);
      if (meta) meta.textContent = fmtB(f.size) + ' · ' + r.width + '×' + r.height + ' preview';
    }).catch(function () {
      rawCache[i] = null;
      var card = document.getElementById('vbc-'+i);
      var ph = document.getElementById('vbi-'+i);
      if (ph && ph.parentElement) {
        ph.parentElement.innerHTML = '<div class="v-bcard-raw-ph"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><span>No preview</span></div><span class="v-bcard-rawtag">RAW</span>';
      }
      var stat = document.getElementById('vbs-'+i);
      if (stat) stat.textContent = 'No preview in RAW';
      if (card) card.classList.add('error');
    });
  }

  /* ── PROCESS ALL ───────────── */
  function processAll() {
    if (!files.length) return;
    results = new Array(files.length);
    var btn = document.getElementById('vb-go');
    btn.disabled = true;
    var done = 0;

    var CONCUR = 4; // max parallel
    var queue = files.map(function(_,i){ return i; });
    var active = 0;

    function next() {
      while (active < CONCUR && queue.length) {
        active++;
        var idx = queue.shift();
        processOne(idx).then(function(){
          active--;
          done++;
          if (done === files.length) finish(btn);
          else next();
        }).catch(function(){
          active--;
          done++;
          if (done === files.length) finish(btn);
          else next();
        });
      }
    }
    next();
  }

  /** Resolve the source <Image> for file i — RAW files use the cached
   *  (or freshly decoded) embedded preview from raw-decoder.js. */
  function _getImageFor(i) {
    var f = files[i];
    if (RAW_EXT.test(f.name || '')) {
      if (rawCache[i] === null) return Promise.reject(new Error('No usable preview in RAW file'));
      if (rawCache[i]) return Promise.resolve(rawCache[i].img);
      return window.VRaw.decode(f).then(function (r) { rawCache[i] = r; return r.img; });
    }
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function (e) {
        var img = new Image();
        img.onload  = function () { resolve(img); };
        img.onerror = function () { reject(new Error('Could not decode image')); };
        img.src = e.target.result;
      };
      reader.onerror = function () { reject(new Error('Could not read file')); };
      reader.readAsDataURL(f);
    });
  }

  function processOne(i) {
    return new Promise(function(resolve, reject) {
      var prog = document.getElementById('vbp-'+i);
      var stat = document.getElementById('vbs-'+i);
      var card = document.getElementById('vbc-'+i);
      var isRaw = RAW_EXT.test(files[i].name || '');
      if(stat) stat.textContent = 'Processing…';
      if(prog) prog.style.width = '30%';

      _getImageFor(i).then(function(img) {
        if(prog) prog.style.width = '60%';
        var mime = settings.format === 'original' ? (files[i].type||'image/jpeg') : settings.format;
        if(mime==='image/gif') mime='image/png';
        var q = mime==='image/png' ? undefined : settings.quality/100;
        var canvas = document.createElement('canvas');
        canvas.width = img.width; canvas.height = img.height;
        canvas.getContext('2d').drawImage(img,0,0);
        canvas.toBlob(function(blob){
          if (!blob) { if(card) card.classList.add('error'); if(stat) stat.textContent='Encoding failed'; reject(new Error('encode failed')); return; }
          if(prog) prog.style.width = '100%';
          var extStr = VConverter.ext(mime);
          var baseName = files[i].name.replace(/\.[^.]+$/,'');
          results[i] = { blob:blob, name:baseName+'_velo.'+extStr, mime:mime, origSize:files[i].size };
          if(card){ card.classList.add('done'); }
          if(stat) stat.textContent = (isRaw ? '✓ Done (from RAW preview) — ' : '✓ Done — ') + fmtB(blob.size);
          var info = card.querySelector('.v-bcard-info');
          var oldBtn = info.querySelector('.v-bcard-dl');
          if (oldBtn) oldBtn.remove();
          var btn2 = document.createElement('button');
          btn2.className='v-bcard-dl';
          btn2.textContent='\u2B07 Download';
          btn2.addEventListener('click', (function(r){ return function(){ dlOne(r); }; })(results[i]));
          info.appendChild(btn2);
          resolve();
        }, mime, q);
      }).catch(function(err){
        if(card) card.classList.add('error');
        if(stat) stat.textContent = isRaw ? 'No preview in RAW' : 'Error';
        reject(err);
      });
    });
  }

  function finish(btn) {
    btn.disabled = false;
    var total = results.filter(Boolean).length;
    var sumOrig = files.reduce(function(a,f){ return a+f.size; }, 0);
    var sumNew  = results.filter(Boolean).reduce(function(a,r){ return a+r.blob.size; }, 0);
    var saved   = sumOrig>0 ? Math.round((1-sumNew/sumOrig)*100) : 0;
    var sumEl = document.getElementById('vb-summary');
    if(sumEl){
      sumEl.classList.add('on');
      sumEl.innerHTML =
        '<div>✓ <strong>'+total+' images</strong> processed — saved <strong>'+saved+'%</strong> total ('+fmtB(sumOrig)+' → '+fmtB(sumNew)+')</div>'+
        '<button class="v-dl" onclick="VBatch.dlAll()" style="padding:8px 16px;font-size:13px">⬇ Download all as ZIP</button>';
    }
  }

  function dlOne(r) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(r.blob);
    a.download = r.name;
    a.click();
  }

  function dlAll() {
    var valid = results.filter(Boolean);
    if (!valid.length) return;
    if (typeof JSZip === 'undefined') {
      // Fallback: download individually
      valid.forEach(function(r){ dlOne(r); });
      return;
    }
    var zip = new JSZip();
    valid.forEach(function(r){ zip.file(r.name, r.blob); });
    zip.generateAsync({ type:'blob' }).then(function(content){
      var a = document.createElement('a');
      a.href = URL.createObjectURL(content);
      a.download = 'velotools_batch.zip';
      a.click();
    });
  }

  function clearAll() {
    files = []; results = []; rawCache = {};
    var grid = document.getElementById('vb-grid');
    if(grid) grid.innerHTML='';
    var acts = document.getElementById('vb-actions');
    if(acts) acts.style.display='none';
    var sum = document.getElementById('vb-summary');
    if(sum) sum.classList.remove('on');
    var cnt = document.getElementById('vb-count');
    if(cnt) cnt.textContent='';
  }

  function fmtB(b){
    if(b<1024) return b+' B';
    if(b<1048576) return Math.round(b/1024)+' KB';
    return (b/1048576).toFixed(1)+' MB';
  }

  return { init:init, addFiles:addFiles, processAll:processAll, dlAll:dlAll, clearAll:clearAll };
})();