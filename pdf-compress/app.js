/* ============================================================
   VeloTools PDF Compressor — app.js
   Engine: pdf.js (render) + pdf-lib (assemble)
   ============================================================ */
'use strict';

/* ---------- PDFJS INIT ---------- */
var pdfjsLib = window['pdfjs-dist/build/pdf'];
if(pdfjsLib){
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

/* ---------- PRESETS ---------- */
var PRESETS = {
  screen:  { quality: 40, dpi: 72  },
  web:     { quality: 65, dpi: 96  },
  print:   { quality: 80, dpi: 150 },
  archive: { quality: 90, dpi: 200 }
};

/* ---------- SETTINGS ---------- */
var SETTINGS = {
  preset: 'web',
  quality: 65,
  dpi: 96,
  grayscale: false,
  metadata: true,
  annotations: false
};

/* ---------- FILES ---------- */
var FILES = [];
var fileIdCounter = 0;

function $(id){ return document.getElementById(id); }

/* ---------- INIT ---------- */
function init(){
  bindUpload();
  bindPresets();
  bindDpiBtns();
  bindSlider();
}

/* ---------- UPLOAD ---------- */
function bindUpload(){
  var zone = $('upload-zone');
  var inp  = $('file-input');

  zone.addEventListener('click', function(){ inp.click(); });
  zone.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); inp.click(); } });
  inp.addEventListener('change', function(){ handleFiles(Array.from(this.files)); this.value=''; });

  zone.addEventListener('dragover', function(e){ e.preventDefault(); zone.classList.add('drag'); });
  zone.addEventListener('dragleave', function(){ zone.classList.remove('drag'); });
  zone.addEventListener('drop', function(e){
    e.preventDefault(); zone.classList.remove('drag');
    var dropped = Array.from(e.dataTransfer.files).filter(function(f){ return f.type==='application/pdf'||f.name.endsWith('.pdf'); });
    if(dropped.length) handleFiles(dropped);
  });
}

function handleFiles(newFiles){
  if(!pdfjsLib || !window.PDFLib){ alert('Libraries still loading — please try again in a moment.'); return; }
  var added = 0;
  newFiles.slice(0, 20 - FILES.length).forEach(function(file){
    if(file.type !== 'application/pdf' && !file.name.endsWith('.pdf')){ return; }
    var id = ++fileIdCounter;
    FILES.push({ id:id, file:file, name:file.name, originalSize:file.size, status:'waiting', progress:0, compressedBytes:null, compressedSize:null, error:null });
    added++;
  });
  if(!added) return;
  renderFileList();
  updateBatchBar();
  $('upload-zone').style.display = FILES.length >= 20 ? 'none' : '';
}

/* ---------- PRESETS ---------- */
function bindPresets(){
  document.querySelectorAll('.preset-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      document.querySelectorAll('.preset-btn').forEach(function(b){ b.classList.remove('act'); });
      btn.classList.add('act');
      var p = PRESETS[btn.dataset.preset];
      if(!p) return;
      SETTINGS.preset  = btn.dataset.preset;
      SETTINGS.quality = p.quality;
      SETTINGS.dpi     = p.dpi;
      // update UI
      $('sl-quality').value     = p.quality;
      $('quality-val').textContent = p.quality+'%';
      document.querySelectorAll('.dpi-btn').forEach(function(b){ b.classList.toggle('act', +b.dataset.dpi===p.dpi); });
      $('dpi-val').textContent  = p.dpi;
    });
  });
}

function bindDpiBtns(){
  document.querySelectorAll('.dpi-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      document.querySelectorAll('.dpi-btn').forEach(function(b){ b.classList.remove('act'); });
      btn.classList.add('act');
      SETTINGS.dpi = +btn.dataset.dpi;
      $('dpi-val').textContent = SETTINGS.dpi;
    });
  });
}

function bindSlider(){
  $('sl-quality').addEventListener('input', function(){
    SETTINGS.quality = +this.value;
    $('quality-val').textContent = this.value+'%';
  });
}

function settingChanged(){
  SETTINGS.grayscale   = $('opt-grayscale').checked;
  SETTINGS.metadata    = $('opt-metadata').checked;
  SETTINGS.annotations = $('opt-annotations').checked;
}

/* ---------- RENDER FILE LIST ---------- */
function renderFileList(){
  var list = $('file-list');
  list.style.display = FILES.length ? '' : 'none';
  list.innerHTML = '';
  FILES.forEach(function(f){ list.appendChild(buildFileCard(f)); });
}

function buildFileCard(f){
  var card = document.createElement('div');
  card.className = 'file-card fc-'+f.status;
  card.id = 'fc-'+f.id;

  var savingsHtml = '';
  if(f.status==='done' && f.compressedSize !== null){
    var saved = Math.round((1 - f.compressedSize/f.originalSize)*100);
    var col = saved>60?'#3dbb8a':saved>30?'#c8a800':'#888';
    savingsHtml = '<div class="fc-savings" style="color:'+col+'">&#9660; '+saved+'% smaller</div>'+
      '<div class="fc-sizes">'+fmtBytes(f.originalSize)+' → <strong>'+fmtBytes(f.compressedSize)+'</strong></div>';
  }

  var actionsHtml = '';
  if(f.status==='waiting'){
    actionsHtml = '<button class="fc-btn fc-btn-compress" onclick="compressOne('+f.id+')">Compress</button>';
  } else if(f.status==='done'){
    actionsHtml = '<button class="fc-btn fc-btn-dl" onclick="downloadOne('+f.id+')">&#8595; Download</button>';
  } else if(f.status==='error'){
    actionsHtml = '<button class="fc-btn fc-btn-retry" onclick="retryOne('+f.id+')">Retry</button>';
  }

  var progressHtml = '';
  if(f.status==='compressing'){
    progressHtml = '<div class="fc-progress-wrap"><div class="fc-progress-bar" id="pb-'+f.id+'" style="width:'+f.progress+'%"></div></div>'+
      '<div class="fc-progress-label" id="pl-'+f.id+'">Compressing… '+f.progress+'%</div>';
  }

  card.innerHTML =
    '<div class="fc-icon-wrap"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>'+
    '<div class="fc-info">'+
      '<div class="fc-name" title="'+escHtml(f.name)+'">'+escHtml(truncate(f.name,42))+'</div>'+
      '<div class="fc-meta">'+
        (f.status==='error'
          ? '<span class="fc-error">&#9888; '+(f.error||'Compression failed')+'</span>'
          : '<span class="fc-origsize">'+fmtBytes(f.originalSize)+'</span>')+
      '</div>'+
      progressHtml+
      savingsHtml+
    '</div>'+
    '<div class="fc-actions">'+
      actionsHtml+
      '<button class="fc-remove" onclick="removeFile('+f.id+')" title="Remove">&#215;</button>'+
    '</div>';
  return card;
}

/* ---------- UPDATE SINGLE CARD ---------- */
function updateCard(f){
  var existing = $('fc-'+f.id);
  if(!existing) return;
  var fresh = buildFileCard(f);
  existing.parentNode.replaceChild(fresh, existing);
}

/* ---------- COMPRESS ONE ---------- */
function compressOne(id){
  var f = FILES.find(function(x){ return x.id===id; });
  if(!f || f.status==='compressing') return;
  f.status = 'compressing'; f.progress = 0;
  updateCard(f);
  updateBatchBar();
  doCompress(f).then(function(){
    updateCard(f);
    updateBatchBar();
    updateDownloadAllBtn();
  });
}

async function doCompress(f){
  try {
    var arrayBuffer = await f.file.arrayBuffer();

    // Load with pdf.js
    var loadTask = pdfjsLib.getDocument({ data: arrayBuffer, disableFontFace: true });
    var pdfDoc = await loadTask.promise;
    var numPages = pdfDoc.numPages;

    // Create new PDF with pdf-lib
    var newPdf = await PDFLib.PDFDocument.create();

    var scale = SETTINGS.dpi / 72;

    for(var i=1; i<=numPages; i++){
      f.progress = Math.round((i-1)/numPages*85);
      updateProgress(f);

      var page = await pdfDoc.getPage(i);
      var viewport = page.getViewport({ scale: scale });

      var canvas = document.createElement('canvas');
      canvas.width  = Math.round(viewport.width);
      canvas.height = Math.round(viewport.height);
      var ctx = canvas.getContext('2d', { willReadFrequently: true });

      if(SETTINGS.grayscale){
        ctx.filter = 'grayscale(1)';
      }

      await page.render({ canvasContext: ctx, viewport: viewport }).promise;

      // Encode as JPEG
      var jpegDataUrl = canvas.toDataURL('image/jpeg', SETTINGS.quality/100);
      var jpegBytes = dataUrlToBytes(jpegDataUrl);

      var jpgImage = await newPdf.embedJpg(jpegBytes);
      var newPage  = newPdf.addPage([viewport.width, viewport.height]);
      newPage.drawImage(jpgImage, { x:0, y:0, width:viewport.width, height:viewport.height });

      // clean up
      canvas.width = 0; canvas.height = 0;
    }

    f.progress = 90;
    updateProgress(f);

    // Strip metadata if requested
    if(!SETTINGS.metadata){
      newPdf.setTitle('');
      newPdf.setAuthor('');
      newPdf.setSubject('');
      newPdf.setKeywords([]);
      newPdf.setProducer('');
      newPdf.setCreator('');
    }

    var compressed = await newPdf.save({ useObjectStreams: true });

    f.compressedBytes = compressed;
    f.compressedSize  = compressed.byteLength;
    f.status = 'done';
    f.progress = 100;

  } catch(err){
    console.error('Compression error:', err);
    f.status = 'error';
    f.error  = err.message || 'Compression failed';
  }
}

function updateProgress(f){
  var pb = $('pb-'+f.id);
  var pl = $('pl-'+f.id);
  if(pb) pb.style.width = f.progress+'%';
  if(pl) pl.textContent = 'Compressing… '+f.progress+'%';
}

/* ---------- COMPRESS ALL ---------- */
function compressAll(){
  var waiting = FILES.filter(function(f){ return f.status==='waiting'; });
  if(!waiting.length) return;
  // sequential to avoid memory exhaustion
  var queue = waiting.slice();
  function next(){
    if(!queue.length){ updateDownloadAllBtn(); return; }
    var f = queue.shift();
    f.status='compressing'; f.progress=0;
    updateCard(f);
    doCompress(f).then(function(){ updateCard(f); updateBatchBar(); next(); });
  }
  next();
  updateBatchBar();
}

/* ---------- DOWNLOAD ---------- */
function downloadOne(id){
  var f = FILES.find(function(x){ return x.id===id; });
  if(!f || !f.compressedBytes) return;
  var blob = new Blob([f.compressedBytes], { type:'application/pdf' });
  var name = f.name.replace(/\.pdf$/i,'')+'_compressed.pdf';
  triggerDownload(blob, name);
}

function downloadAll(){
  var done = FILES.filter(function(f){ return f.status==='done' && f.compressedBytes; });
  if(!done.length) return;
  if(done.length===1){ downloadOne(done[0].id); return; }
  var zip = new JSZip();
  done.forEach(function(f){
    var name = f.name.replace(/\.pdf$/i,'')+'_compressed.pdf';
    zip.file(name, f.compressedBytes);
  });
  zip.generateAsync({ type:'blob', compression:'DEFLATE', compressionOptions:{ level:1 } }).then(function(blob){
    triggerDownload(blob, 'velotools-compressed-pdfs.zip');
  });
}

function triggerDownload(blob, name){
  var url = URL.createObjectURL(blob);
  var a   = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(function(){ URL.revokeObjectURL(url); }, 2000);
}

/* ---------- REMOVE / CLEAR ---------- */
function removeFile(id){
  FILES = FILES.filter(function(f){ return f.id!==id; });
  renderFileList();
  updateBatchBar();
  $('upload-zone').style.display = '';
}

function clearAll(){
  FILES = [];
  renderFileList();
  updateBatchBar();
  $('upload-zone').style.display = '';
}

function retryOne(id){
  var f = FILES.find(function(x){ return x.id===id; });
  if(!f) return;
  f.status='waiting'; f.error=null; f.progress=0;
  updateCard(f);
}

/* ---------- BATCH BAR ---------- */
function updateBatchBar(){
  var bar = $('batch-bar');
  if(!FILES.length){ bar.style.display='none'; return; }
  bar.style.display = '';

  var total    = FILES.length;
  var waiting  = FILES.filter(function(f){ return f.status==='waiting'; }).length;
  var done     = FILES.filter(function(f){ return f.status==='done'; }).length;
  var running  = FILES.filter(function(f){ return f.status==='compressing'; }).length;

  var summary = total+' file'+(total>1?'s':'');
  if(done) summary += ' · '+done+' compressed';
  if(running) summary += ' · '+running+' processing';
  if(waiting) summary += ' · '+waiting+' waiting';

  $('bb-summary').textContent = summary;

  var compressBtn = $('btn-compress-all');
  compressBtn.style.display = waiting > 0 ? '' : 'none';
  updateDownloadAllBtn();
}

function updateDownloadAllBtn(){
  var done = FILES.filter(function(f){ return f.status==='done'; }).length;
  var dlBtn = $('btn-download-all');
  if(dlBtn) dlBtn.style.display = done > 0 ? '' : 'none';
}

/* ---------- HELPERS ---------- */
function dataUrlToBytes(dataUrl){
  var base64 = dataUrl.split(',')[1];
  var binary = atob(base64);
  var bytes  = new Uint8Array(binary.length);
  for(var i=0; i<binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function fmtBytes(n){
  if(n===null||n===undefined) return '—';
  if(n < 1024)      return n+' B';
  if(n < 1048576)   return (n/1024).toFixed(1)+' KB';
  return (n/1048576).toFixed(2)+' MB';
}

function truncate(s, max){ return s.length>max ? s.slice(0,max-1)+'…' : s; }

function escHtml(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ---------- START ---------- */
if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', init); }
else { init(); }