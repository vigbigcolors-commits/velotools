/**
 * VeloTools — batch.js
 * Processes up to 15 images simultaneously with a queue,
 * per-card progress, and ZIP download via JSZip CDN.
 */
window.VBatch = (function () {
  'use strict';

  var files = [];
  var results = [];
  var settings = { quality:80, format:'image/webp' };

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
    newFiles.filter(function(f){ return f.type.startsWith('image/'); })
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
      var url = URL.createObjectURL(f);
      var card = document.createElement('div');
      card.className = 'v-bcard';
      card.id = 'vbc-'+i;
      card.innerHTML =
        '<img class="v-bcard-img" src="'+url+'" alt="'+f.name+'">'+
        '<div class="v-bcard-info">'+
          '<div class="v-bcard-name" title="'+f.name+'">'+f.name+'</div>'+
          '<div class="v-bcard-meta">'+fmtB(f.size)+'</div>'+
          '<div class="v-bcard-bar"><div class="v-bcard-prog" id="vbp-'+i+'" style="width:0"></div></div>'+
          '<div class="v-bcard-status" id="vbs-'+i+'">Waiting…</div>'+
        '</div>';
      grid.appendChild(card);
    });
    document.getElementById('vb-count').textContent = files.length + ' image' + (files.length>1?'s':'') + ' ready';
    document.getElementById('vb-actions').style.display = 'flex';
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

  function processOne(i) {
    return new Promise(function(resolve, reject) {
      var prog = document.getElementById('vbp-'+i);
      var stat = document.getElementById('vbs-'+i);
      var card = document.getElementById('vbc-'+i);
      if(stat) stat.textContent = 'Processing…';
      if(prog) prog.style.width = '30%';

      var reader = new FileReader();
      reader.onload = function(e) {
        var img = new Image();
        img.onload = function() {
          if(prog) prog.style.width = '60%';
          var mime = settings.format === 'original' ? (files[i].type||'image/jpeg') : settings.format;
          if(mime==='image/gif') mime='image/png';
          var q = mime==='image/png' ? undefined : settings.quality/100;
          var canvas = document.createElement('canvas');
          canvas.width = img.width; canvas.height = img.height;
          canvas.getContext('2d').drawImage(img,0,0);
          canvas.toBlob(function(blob){
            if(prog) prog.style.width = '100%';
            var extStr = VConverter.ext(mime);
            var baseName = files[i].name.replace(/\.[^.]+$/,'');
            results[i] = { blob:blob, name:baseName+'_velo.'+extStr, mime:mime, origSize:files[i].size };
            if(card){ card.classList.add('done'); }
            if(stat) stat.textContent = '✓ Done — '+fmtB(blob.size);
            // Individual download button
            var btn2 = document.createElement('button');
            btn2.className='v-bcard-dl';
            btn2.textContent='⬇ Download';
            btn2.addEventListener('click', (function(r){ return function(){ dlOne(r); }; })(results[i]));
            card.querySelector('.v-bcard-info').appendChild(btn2);
            resolve();
          }, mime, q);
        };
        img.onerror = function(){ if(card) card.classList.add('error'); if(stat) stat.textContent='Error'; reject(); };
        img.src = e.target.result;
      };
      reader.readAsDataURL(files[i]);
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
    files = []; results = [];
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
