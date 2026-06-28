/* ============================================================
   VeloTools PDF Compressor — app.js
   Engine: pdf.js (render) + pdf-lib (assemble)
   ============================================================ */
'use strict';

var pdfjsLib = window['pdfjs-dist/build/pdf'];
if(pdfjsLib){
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

var PRESETS = {
  screen:  { quality: 40, dpi: 72  },
  web:     { quality: 65, dpi: 96  },
  print:   { quality: 80, dpi: 150 },
  archive: { quality: 90, dpi: 200 }
};

var SETTINGS = {
  preset: 'web',
  quality: 65,
  dpi: 96,
  grayscale: false,
  stripMetadata: true,
  stripAnnotations: true
};

var FILES = [];
var fileIdCounter = 0;

/** Chrome tab-crashes above ~8192px/side or ~16M pixels — stay conservative */
var CANVAS_LIMITS = { MAX_SIDE: 4096, MAX_PIXELS: 6000000 };

function tick(){
  return new Promise(function(resolve){ setTimeout(resolve, 16); });
}

function destroyCanvas(canvas){
  if(!canvas) return;
  canvas.width = 0;
  canvas.height = 0;
}

function $(id){ return document.getElementById(id); }

function init(){
  bindUpload();
  bindPresets();
  bindDpiBtns();
  bindSlider();
  syncSettings();
  updateSettingsSummary();
}

function syncSettings(){
  SETTINGS.grayscale       = !!$('opt-grayscale').checked;
  SETTINGS.stripMetadata   = !!$('opt-metadata').checked;
  SETTINGS.stripAnnotations = !!$('opt-annotations').checked;
}

function updateSettingsSummary(){
  var el = $('settings-summary');
  if(!el) return;
  var parts = [SETTINGS.dpi + ' DPI', SETTINGS.quality + '% JPEG'];
  if(SETTINGS.grayscale) parts.push('Grayscale');
  if(SETTINGS.stripMetadata) parts.push('No metadata');
  el.textContent = parts.join(' · ');
}

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
    FILES.push({ id:id, file:file, name:file.name, originalSize:file.size, pageCount:null, status:'waiting', progress:0, compressedBytes:null, compressedSize:null, error:null });
    added++;
  });
  if(!added) return;
  renderFileList();
  updateBatchBar();
  $('upload-zone').style.display = FILES.length >= 20 ? 'none' : '';
}

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
      $('sl-quality').value = p.quality;
      $('quality-val').textContent = p.quality+'%';
      document.querySelectorAll('.dpi-btn').forEach(function(b){ b.classList.toggle('act', +b.dataset.dpi===p.dpi); });
      $('dpi-val').textContent = p.dpi;
      updateSettingsSummary();
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
      updateSettingsSummary();
    });
  });
}

function bindSlider(){
  $('sl-quality').addEventListener('input', function(){
    SETTINGS.quality = +this.value;
    $('quality-val').textContent = this.value+'%';
    updateSettingsSummary();
  });
}

// eslint-disable-next-line no-unused-vars
function settingChanged(){
  syncSettings();
  updateSettingsSummary();
}

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
    var col = saved>60?'var(--save-high)':saved>30?'var(--save-mid)':'var(--tx3)';
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

  var pageHint = f.pageCount ? ' · '+f.pageCount+' page'+(f.pageCount>1?'s':'') : '';
  var scaleNoteHtml = f.scaleNote ? '<div class="fc-scale-note">'+escHtml(f.scaleNote)+'</div>' : '';

  card.innerHTML =
    '<div class="fc-icon-wrap"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>'+
    '<div class="fc-info">'+
      '<div class="fc-name" title="'+escHtml(f.name)+'">'+escHtml(truncate(f.name,42))+'</div>'+
      '<div class="fc-meta">'+
        (f.status==='error'
          ? '<span class="fc-error">&#9888; '+(f.error||'Compression failed')+'</span>'
          : '<span class="fc-origsize">'+fmtBytes(f.originalSize)+pageHint+'</span>')+
      '</div>'+
      progressHtml+
      scaleNoteHtml+
      savingsHtml+
    '</div>'+
    '<div class="fc-actions">'+
      actionsHtml+
      '<button class="fc-remove" onclick="removeFile('+f.id+')" title="Remove">&#215;</button>'+
    '</div>';
  return card;
}

function updateCard(f){
  var existing = $('fc-'+f.id);
  if(!existing) return;
  var fresh = buildFileCard(f);
  existing.parentNode.replaceChild(fresh, existing);
}

function compressOne(id){
  var f = FILES.find(function(x){ return x.id===id; });
  if(!f || f.status==='compressing') return;
  f.status = 'compressing'; f.progress = 0;
  f.scaleNote = null;
  updateCard(f);
  updateBatchBar();
  // Defer so UI paints before heavy work (reduces "Aw, Snap" on click)
  setTimeout(function(){
    doCompress(f).then(function(){
      updateCard(f);
      updateBatchBar();
      updateDownloadAllBtn();
    });
  }, 32);
}

/** Fit viewport inside browser-safe canvas limits (prevents tab crash) */
function getSafeViewport(page, dpi){
  var scale = dpi / 72;
  var vp = page.getViewport({ scale: scale });
  var w = vp.width;
  var h = vp.height;

  if(!isFinite(w) || !isFinite(h) || w < 1 || h < 1){
    throw new Error('Invalid page size — try another PDF');
  }

  var factor = 1;
  if(w > CANVAS_LIMITS.MAX_SIDE) factor = Math.min(factor, CANVAS_LIMITS.MAX_SIDE / w);
  if(h > CANVAS_LIMITS.MAX_SIDE) factor = Math.min(factor, CANVAS_LIMITS.MAX_SIDE / h);
  var pixels = w * h;
  if(pixels > CANVAS_LIMITS.MAX_PIXELS){
    factor = Math.min(factor, Math.sqrt(CANVAS_LIMITS.MAX_PIXELS / pixels));
  }

  if(factor < 0.995){
    var effectiveDpi = Math.max(36, Math.round(dpi * factor));
    vp = page.getViewport({ scale: effectiveDpi / 72 });
    vp._effectiveDpi = effectiveDpi;
    vp._scaleNote = 'Large page — rendered at '+effectiveDpi+' DPI (requested '+dpi+') to avoid browser crash';
  } else {
    vp._effectiveDpi = dpi;
  }
  return vp;
}

/** Canvas size must exactly match viewport — pdf.js breaks on mismatch */
function createRenderCanvas(viewport){
  var w = Math.round(viewport.width);
  var h = Math.round(viewport.height);
  var canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  var ctx = canvas.getContext('2d', { alpha: false });
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);
  return canvas;
}

/** Quick blank-page check (samples corners, not full canvas) */
function isCanvasMostlyBlank(canvas){
  var ctx = canvas.getContext('2d', { willReadFrequently: true });
  var spots = [
    [0, 0], [canvas.width - 1, 0], [0, canvas.height - 1],
    [canvas.width - 1, canvas.height - 1],
    [Math.floor(canvas.width / 2), Math.floor(canvas.height / 2)]
  ];
  var nonWhite = 0;
  for(var s = 0; s < spots.length; s++){
    var px = ctx.getImageData(spots[s][0], spots[s][1], 1, 1).data;
    if(px[0] < 245 || px[1] < 245 || px[2] < 245) nonWhite++;
  }
  return nonWhite === 0;
}

function canvasToJpegBytes(canvas, quality, grayscale){
  var q = Math.min(0.95, Math.max(0.1, quality / 100));
  var output = canvas;
  var grayCanvas = null;

  if(grayscale){
    grayCanvas = createRenderCanvas({ width: canvas.width, height: canvas.height });
    var gctx = grayCanvas.getContext('2d', { alpha: false });
    gctx.filter = 'grayscale(100%)';
    gctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
    gctx.filter = 'none';
    output = grayCanvas;
  }

  var dataUrl = output.toDataURL('image/jpeg', q);
  destroyCanvas(grayCanvas);

  if(!dataUrl || dataUrl.length < 32 || dataUrl.indexOf('data:image/jpeg') !== 0){
    throw new Error('JPEG encoding failed — lower DPI or quality');
  }
  return dataUrlToBytes(dataUrl);
}

async function renderPdfPage(page, viewport, annotationMode){
  var canvas = createRenderCanvas(viewport);
  var ctx = canvas.getContext('2d', { alpha: false });

  await page.render({
    canvasContext: ctx,
    viewport: viewport,
    annotationMode: annotationMode,
    background: '#ffffff'
  }).promise;

  if(isCanvasMostlyBlank(canvas)){
    throw new Error('Page rendered blank — try Print/Archive preset or lower DPI');
  }

  return canvas;
}

async function doCompress(f){
  syncSettings();
  var pdfDoc = null;
  try {
    if(f.file.size > 120 * 1048576){
      throw new Error('File over 120 MB — split or use Screen preset with 72 DPI');
    }

    var arrayBuffer = await f.file.arrayBuffer();
    var loadTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      disableFontFace: false,
      useSystemFonts: true,
      verbosity: 0
    });
    pdfDoc = await loadTask.promise;
    var numPages = pdfDoc.numPages;
    f.pageCount = numPages;

    var newPdf = await PDFLib.PDFDocument.create();
    var annotationMode = SETTINGS.stripAnnotations
      ? (pdfjsLib.AnnotationMode ? pdfjsLib.AnnotationMode.DISABLE : 0)
      : (pdfjsLib.AnnotationMode ? pdfjsLib.AnnotationMode.ENABLE : 1);

    for(var i = 1; i <= numPages; i++){
      f.progress = Math.round((i - 1) / numPages * 85);
      updateProgress(f);
      await tick();

      var page = await pdfDoc.getPage(i);
      var viewport = getSafeViewport(page, SETTINGS.dpi);
      if(viewport._scaleNote && !f.scaleNote) f.scaleNote = viewport._scaleNote;

      var rendered = null;
      try {
        rendered = await renderPdfPage(page, viewport, annotationMode);
        var jpegBytes = canvasToJpegBytes(rendered, SETTINGS.quality, SETTINGS.grayscale);
        if(!jpegBytes || !jpegBytes.length){
          throw new Error('Empty JPEG on page '+i);
        }

        var pageW = viewport.width * 72 / viewport._effectiveDpi;
        var pageH = viewport.height * 72 / viewport._effectiveDpi;
        var jpgImage = await newPdf.embedJpg(jpegBytes);
        var newPage = newPdf.addPage([pageW, pageH]);
        newPage.drawImage(jpgImage, { x:0, y:0, width:pageW, height:pageH });
      } finally {
        destroyCanvas(rendered);
      }

      page.cleanup();
    }

    f.progress = 90;
    updateProgress(f);

    if(SETTINGS.stripMetadata){
      newPdf.setTitle('');
      newPdf.setAuthor('');
      newPdf.setSubject('');
      newPdf.setKeywords([]);
      newPdf.setProducer('VeloTools PDF Compressor');
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
  } finally {
    if(pdfDoc) pdfDoc.destroy();
  }
}

function updateProgress(f){
  var pb = $('pb-'+f.id);
  var pl = $('pl-'+f.id);
  if(pb) pb.style.width = f.progress+'%';
  if(pl) pl.textContent = 'Compressing… '+f.progress+'%';
  // Do NOT replace the whole card here — avoids UI flash during compression
}

function compressAll(){
  var waiting = FILES.filter(function(f){ return f.status==='waiting'; });
  if(!waiting.length) return;
  var queue = waiting.slice();
  function next(){
    if(!queue.length){ updateDownloadAllBtn(); return; }
    var item = queue.shift();
    item.status = 'compressing';
    item.progress = 0;
    item.scaleNote = null;
    updateCard(item);
    doCompress(item).then(function(){
      updateCard(item);
      updateBatchBar();
      setTimeout(next, 48);
    });
  }
  setTimeout(next, 32);
  updateBatchBar();
}

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

function updateBatchBar(){
  var bar = $('batch-bar');
  if(!FILES.length){ bar.style.display='none'; return; }
  bar.style.display = '';

  var total    = FILES.length;
  var waiting  = FILES.filter(function(f){ return f.status==='waiting'; }).length;
  var done     = FILES.filter(function(f){ return f.status==='done'; });
  var running  = FILES.filter(function(f){ return f.status==='compressing'; }).length;

  var summary = total+' file'+(total>1?'s':'');
  if(done.length) summary += ' · '+done.length+' done';
  if(running) summary += ' · '+running+' processing';
  if(waiting) summary += ' · '+waiting+' waiting';

  $('bb-summary').textContent = summary;

  var savingsEl = $('bb-savings');
  if(savingsEl && done.length){
    var origTotal = 0;
    var compTotal = 0;
    done.forEach(function(f){
      origTotal += f.originalSize;
      compTotal += f.compressedSize;
    });
    var pct = Math.round((1 - compTotal / origTotal) * 100);
    savingsEl.textContent = 'Saved '+fmtBytes(origTotal - compTotal)+' ('+pct+'%)';
    savingsEl.style.display = '';
  } else if(savingsEl){
    savingsEl.style.display = 'none';
  }

  $('btn-compress-all').style.display = waiting > 0 ? '' : 'none';
  updateDownloadAllBtn();
}

function updateDownloadAllBtn(){
  var done = FILES.filter(function(f){ return f.status==='done'; }).length;
  var dlBtn = $('btn-download-all');
  if(dlBtn) dlBtn.style.display = done > 0 ? '' : 'none';
}

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

if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', init); }
else { init(); }

window.compressOne = compressOne;
window.compressAll = compressAll;
window.downloadAll = downloadAll;
window.removeFile = removeFile;
window.clearAll = clearAll;
window.retryOne = retryOne;
window.settingChanged = settingChanged;
