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
var PAGE_CONFIG = null;

/** Chrome tab-crashes above ~8192px/side or ~16M pixels — stay conservative */
var CANVAS_LIMITS = { MAX_SIDE: 4096, MAX_PIXELS: 6000000 };

function tick(){
  return new Promise(function(resolve){ setTimeout(resolve, 16); });
}

/** pdf.js transfers ArrayBuffer to worker — always pass a fresh copy */
async function readFileBytes(file){
  var ab = await file.arrayBuffer();
  return new Uint8Array(ab);
}

function buildFallbackScaleNote(result){
  var s = SETTINGS.dpi + ' DPI · ' + SETTINGS.quality + '% JPEG';
  if(result.reencodedCount === result.totalPages){
    return 'Deep compress — all '+result.totalPages+' pages · '+s;
  }
  if(result.reencodedCount > 0){
    var note = 'Smart compress — '+result.reencodedCount+'/'+result.totalPages+' pages · '+s;
    if(result.copiedCount > 0) note += ' · '+result.copiedCount+' kept as-is';
    return note;
  }
  return 'Light optimize — layered PDF, images preserved. Re-export as flat PDF for 60–80% savings';
}

async function addJpegPageFromExtract(outPdf, extracted){
  var vp = extracted.viewport;
  var jpegBytes = canvasToJpegBytes(extracted.canvas, SETTINGS.quality, SETTINGS.grayscale);
  var pageW = vp.width * 72 / vp._effectiveDpi;
  var pageH = vp.height * 72 / vp._effectiveDpi;
  var jpgImage = await outPdf.embedJpg(jpegBytes);
  var newPage = outPdf.addPage([pageW, pageH]);
  newPage.drawImage(jpgImage, { x: 0, y: 0, width: pageW, height: pageH });
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
  PAGE_CONFIG = readPageConfig();
  if(PAGE_CONFIG) applyPageConfig(PAGE_CONFIG);
}

function readPageConfig(){
  var el = document.getElementById('vt-page-config');
  if(!el) return null;
  try { return JSON.parse(el.textContent); }
  catch(e){ console.warn('Invalid vt-page-config', e); return null; }
}

function applyPageConfig(cfg){
  var w = cfg.widget;
  if(!w) return;

  if(w.preset && PRESETS[w.preset]){
    var pbtn = document.querySelector('.preset-btn[data-preset="'+w.preset+'"]');
    if(pbtn) pbtn.click();
  }
  if(w.quality != null){
    SETTINGS.quality = w.quality;
    if($('sl-quality')) $('sl-quality').value = w.quality;
    if($('quality-val')) $('quality-val').textContent = w.quality+'%';
  }
  if(w.dpi != null){
    SETTINGS.dpi = w.dpi;
    document.querySelectorAll('.dpi-btn').forEach(function(b){
      b.classList.toggle('act', +b.dataset.dpi === w.dpi);
    });
    if($('dpi-val')) $('dpi-val').textContent = w.dpi;
  }
  if(w.grayscale != null && $('opt-grayscale')){
    $('opt-grayscale').checked = !!w.grayscale;
  }
  if(w.stripMetadata != null && $('opt-metadata')){
    $('opt-metadata').checked = !!w.stripMetadata;
  }
  if(w.stripAnnotations != null && $('opt-annotations')){
    $('opt-annotations').checked = !!w.stripAnnotations;
  }
  syncSettings();
  updateSettingsSummary();

  if(w.lock && w.lock.length){
    lockWidgetControls(w.lock);
  }

  if(cfg.intentBanner){
    showIntentBanner(cfg.intentBanner);
  }
}

function lockWidgetControls(keys){
  keys.forEach(function(key){
    if(key === 'preset'){
      document.querySelectorAll('.preset-btn').forEach(function(b){ b.disabled = true; b.style.opacity = '0.55'; });
    }
    if(key === 'dpi'){
      document.querySelectorAll('.dpi-btn').forEach(function(b){ b.disabled = true; b.style.opacity = '0.55'; });
    }
    if(key === 'grayscale' && $('opt-grayscale')){
      $('opt-grayscale').disabled = true;
    }
    if(key === 'quality' && $('sl-quality')){
      $('sl-quality').disabled = true;
    }
  });
}

function showIntentBanner(msg){
  var bar = document.getElementById('vt-intent-bar');
  if(!bar){
    bar = document.createElement('div');
    bar.id = 'vt-intent-bar';
    bar.className = 'vt-intent-bar';
    var hero = document.querySelector('.hero');
    if(hero && hero.parentNode) hero.parentNode.insertBefore(bar, hero.nextSibling);
    else document.body.insertBefore(bar, document.body.firstChild);
  }
  bar.textContent = msg;
  bar.hidden = false;
}

function checkPlatformLimit(f){
  if(!PAGE_CONFIG || !PAGE_CONFIG.widget || !PAGE_CONFIG.widget.maxOutputBytes) return;
  if(f.compressedSize > PAGE_CONFIG.widget.maxOutputBytes){
    f.limitWarning = PAGE_CONFIG.widget.limitWarning || 'Output exceeds platform attachment limit.';
  } else {
    f.limitWarning = null;
  }
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
  var limitHtml = f.limitWarning ? '<div class="vt-limit-warn">&#9888; '+escHtml(f.limitWarning)+'</div>' : '';

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
      limitHtml+
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

/** Blank-page check — downscale sample so sparse clip-art pages aren't false positives */
function isCanvasMostlyBlank(canvas){
  var w = canvas.width;
  var h = canvas.height;
  if(w < 2 || h < 2) return true;

  var grid = 48;
  var sc = document.createElement('canvas');
  sc.width = grid;
  sc.height = grid;
  var sctx = sc.getContext('2d', { willReadFrequently: true });
  sctx.drawImage(canvas, 0, 0, grid, grid);
  var data = sctx.getImageData(0, 0, grid, grid).data;
  destroyCanvas(sc);

  var nonWhite = 0;
  var pixels = grid * grid;
  for(var i = 0; i < data.length; i += 4){
    if(data[i] < 250 || data[i + 1] < 250 || data[i + 2] < 250) nonWhite++;
  }
  return nonWhite / pixels < 0.003;
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

/** Show all PDF layers (clip-art books often hide content for print intent) */
function getOcConfigPromise(pdfDoc, intent, modifyGroups){
  if(!pdfDoc || typeof pdfDoc.getOptionalContentConfig !== 'function') return null;
  return pdfDoc.getOptionalContentConfig({ intent: intent || 'any' }).then(function(config){
    if(!config || !modifyGroups || typeof config.getGroups !== 'function') return config;
    try {
      var groups = config.getGroups();
      if(groups && typeof groups.forEach === 'function'){
        groups.forEach(function(group, id){ config.setVisibility(id, true); });
      } else if(groups && typeof groups === 'object'){
        Object.keys(groups).forEach(function(id){ config.setVisibility(id, true); });
      }
    } catch(e){ /* optional content not critical */ }
    return config;
  }).catch(function(){ return null; });
}

function loadPageObject(page, pdfDoc, name){
  return new Promise(function(resolve, reject){
    var stores = [page.objs, page.commonObjs];
    if(pdfDoc && pdfDoc.commonObjs) stores.push(pdfDoc.commonObjs);
    var idx = 0;

    function next(){
      if(idx >= stores.length) return reject(new Error('object not found: '+name));
      var store = stores[idx++];
      if(!store || typeof store.get !== 'function') return next();
      try {
        var settled = false;
        store.get(name, function(data){
          if(settled) return;
          if(data){ settled = true; resolve(data); }
          else next();
        });
      } catch(e){ next(); }
    }
    next();
  });
}

/** Force pdf.js to decode embedded images (incl. JPEG2000) into object cache */
async function warmRenderPage(page, pdfDoc){
  var vp = page.getViewport({ scale: 36 / 72 });
  var canvas = createRenderCanvas(vp);
  try {
    await page.render({
      canvasContext: canvas.getContext('2d', { alpha: false }),
      viewport: vp,
      intent: 'any',
      background: '#ffffff',
      annotationMode: pdfjsLib.AnnotationMode ? pdfjsLib.AnnotationMode.DISABLE : 0,
      optionalContentConfigPromise: getOcConfigPromise(pdfDoc, 'any', true)
    }).promise;
  } catch(e){ /* objs may still populate */ }
  destroyCanvas(canvas);
}

function rawPdfImageToCanvas(img){
  if(!img) return null;

  if(img instanceof HTMLCanvasElement) return img;
  if(typeof HTMLImageElement !== 'undefined' && img instanceof HTMLImageElement){
    var imgCanvas = document.createElement('canvas');
    imgCanvas.width = img.naturalWidth || img.width;
    imgCanvas.height = img.naturalHeight || img.height;
    imgCanvas.getContext('2d', { alpha: false }).drawImage(img, 0, 0);
    return imgCanvas;
  }
  if(typeof ImageBitmap !== 'undefined' && img instanceof ImageBitmap){
    var bmpCanvas = document.createElement('canvas');
    bmpCanvas.width = img.width;
    bmpCanvas.height = img.height;
    bmpCanvas.getContext('2d').drawImage(img, 0, 0);
    return bmpCanvas;
  }
  if(img.bitmap){
    var bc = document.createElement('canvas');
    bc.width = img.bitmap.width;
    bc.height = img.bitmap.height;
    bc.getContext('2d').drawImage(img.bitmap, 0, 0);
    return bc;
  }

  var w = img.width;
  var h = img.height;
  var src = img.data;
  if(!w || !h || !src) return null;

  var canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  var ctx = canvas.getContext('2d', { alpha: false });
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);

  var imageData = ctx.createImageData(w, h);
  var dst = imageData.data;
  var kind = img.kind;
  var ImageKind = pdfjsLib.ImageKind || {};

  if(kind === ImageKind.GRAYSCALE || kind === 1){
    for(var g = 0, di = 0; g < src.length; g++, di += 4){
      dst[di] = dst[di + 1] = dst[di + 2] = src[g];
      dst[di + 3] = 255;
    }
  } else if(kind === ImageKind.RGB || kind === 2){
    for(var r = 0, dj = 0; r < src.length; r += 3, dj += 4){
      dst[dj] = src[r];
      dst[dj + 1] = src[r + 1];
      dst[dj + 2] = src[r + 2];
      dst[dj + 3] = 255;
    }
  } else {
    if(src.length === w * h * 4) imageData.data.set(src);
    else return null;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

function scaleCanvasToViewport(srcCanvas, viewport){
  var w = Math.round(viewport.width);
  var h = Math.round(viewport.height);
  if(srcCanvas.width === w && srcCanvas.height === h) return srcCanvas;

  var out = createRenderCanvas(viewport);
  out.getContext('2d').drawImage(srcCanvas, 0, 0, w, h);
  if(srcCanvas !== out) destroyCanvas(srcCanvas);
  return out;
}

/** Clip-art pages are often one embedded JPEG — extract without full canvas render */
async function tryExtractPageAsImage(page, pdfDoc, dpi){
  if(!pdfjsLib.OPS) return null;
  await warmRenderPage(page, pdfDoc);

  var OPS = pdfjsLib.OPS;
  var opList;
  try {
    opList = await page.getOperatorList({
      intent: 'any',
      annotationMode: pdfjsLib.AnnotationMode ? pdfjsLib.AnnotationMode.DISABLE : 0,
      optionalContentConfigPromise: getOcConfigPromise(pdfDoc, 'any', true)
    });
  } catch(e){
    return null;
  }

  var images = [];
  var fn = opList.fnArray;
  var args = opList.argsArray;

  for(var i = 0; i < fn.length; i++){
    var op = fn[i];
    var isNamed = op === OPS.paintImageXObject || op === OPS.paintJpegXObject;
    var isInline = op === OPS.paintInlineImageXObject;
    if(!isNamed && !isInline) continue;

    try {
      var img = null;
      if(isInline){
        img = args[i] && args[i][0];
      } else {
        var name = args[i] && args[i][0];
        if(!name) continue;
        img = await loadPageObject(page, pdfDoc, name);
      }
      var canvas = rawPdfImageToCanvas(img);
      if(canvas && canvas.width > 8 && canvas.height > 8){
        images.push({ canvas: canvas, area: canvas.width * canvas.height });
      }
    } catch(e){ /* try next image */ }
  }

  if(!images.length) return null;
  images.sort(function(a, b){ return b.area - a.area; });

  var viewport = getSafeViewport(page, dpi);
  var best = scaleCanvasToViewport(images[0].canvas, viewport);
  images.forEach(function(entry, idx){
    if(idx > 0) destroyCanvas(entry.canvas);
  });

  if(isCanvasMostlyBlank(best) && images[0].area < 50000) return null;
  return { canvas: best, viewport: viewport };
}

async function renderPdfPage(page, viewport, annotationMode, pdfDoc, renderIntent, ocOptions){
  var canvas = createRenderCanvas(viewport);
  var ctx = canvas.getContext('2d', { alpha: false });
  var intent = renderIntent || 'any';
  var modifyOc = !ocOptions || ocOptions.modifyOc !== false;

  var renderParams = {
    canvasContext: ctx,
    viewport: viewport,
    annotationMode: annotationMode,
    background: '#ffffff',
    intent: intent
  };

  if(pdfDoc && (!ocOptions || !ocOptions.skipOc)){
    var ocPromise = getOcConfigPromise(pdfDoc, intent, modifyOc);
    if(ocPromise) renderParams.optionalContentConfigPromise = ocPromise;
  }

  await page.render(renderParams).promise;
  return canvas;
}

async function renderPageWithFallback(page, dpi, annotationMode, pdfDoc){
  var attempts = [
    { dpi: dpi, intent: 'any', modifyOc: false },
    { dpi: dpi, intent: 'display', modifyOc: false },
    { dpi: dpi, intent: 'any', modifyOc: true },
    { dpi: Math.max(72, Math.round(dpi * 0.65)), intent: 'any', modifyOc: false },
    { dpi: 72, intent: 'any', modifyOc: false, skipOc: true }
  ];

  for(var a = 0; a < attempts.length; a++){
    var attempt = attempts[a];
    var viewport = getSafeViewport(page, attempt.dpi);
    if(a > 0 && attempt.dpi < dpi){
      viewport._scaleNote = 'Some pages rendered at '+attempt.dpi+' DPI (requested '+dpi+')';
    }

    var canvas = await renderPdfPage(page, viewport, annotationMode, pdfDoc, attempt.intent, attempt);
    if(!isCanvasMostlyBlank(canvas)) return { canvas: canvas, viewport: viewport };
    destroyCanvas(canvas);
  }

  var extracted = await tryExtractPageAsImage(page, pdfDoc, dpi);
  if(extracted) return extracted;

  var err = new Error('Page could not be rendered');
  err.code = 'RENDER_FAIL';
  throw err;
}

function pdfNameToString(val){
  if(!val) return '';
  if(typeof val === 'string') return val;
  if(val.toString) return val.toString();
  return String(val);
}

function getFilterName(filter){
  if(!filter) return '';
  if(filter.size && typeof filter.size === 'function' && filter.size() > 0){
    return pdfNameToString(filter.get(0));
  }
  return pdfNameToString(filter);
}

function getPdfStreamBytes(xObject){
  if(typeof xObject.getContents === 'function'){
    try {
      var raw = xObject.getContents();
      if(raw && raw.length) return raw;
    } catch(e){ /* try decode */ }
  }
  if(PDFLib.decodePDFRawStream){
    try {
      return PDFLib.decodePDFRawStream(xObject).decode();
    } catch(e2){ /* try raw contents property */ }
  }
  return xObject.contents || null;
}

function pdfNumber(val){
  if(!val) return 0;
  if(typeof val.asNumber === 'function') return val.asNumber();
  if(val.numberValue !== undefined) return val.numberValue;
  return Number(val) || 0;
}

function pushImageRecord(xObject, results){
  var PDFName = PDFLib.PDFName;
  var width = pdfNumber(xObject.get(PDFName.of('Width')));
  var height = pdfNumber(xObject.get(PDFName.of('Height')));
  var bytes = getPdfStreamBytes(xObject);
  if(!bytes || !bytes.length || width < 1 || height < 1) return;

  var key = width + 'x' + height + ':' + bytes.length;
  for(var i = 0; i < results.length; i++){
    if(results[i]._key === key) return;
  }

  results.push({
    _key: key,
    width: width,
    height: height,
    filter: getFilterName(xObject.get(PDFName.of('Filter'))),
    colorSpace: pdfNameToString(xObject.get(PDFName.of('ColorSpace'))),
    bitsPerComponent: pdfNumber(xObject.get(PDFName.of('BitsPerComponent'))) || 8,
    bytes: bytes
  });
}

function resolvePageResourceChain(pdfPage, pdfDoc){
  var PDFName = PDFLib.PDFName;
  var ctx = pdfDoc.context;
  var chain = [];
  var node = pdfPage.node;

  while(node){
    var resources = null;
    if(typeof node.Resources === 'function') resources = node.Resources();
    if(!resources && node.get) resources = node.get(PDFName.of('Resources'));
    if(resources){
      var dict = resources instanceof PDFLib.PDFRef ? ctx.lookup(resources) : resources;
      if(dict) chain.push(dict);
    }
    var parent = node.get ? node.get(PDFName.of('Parent')) : null;
    if(!parent) break;
    node = parent instanceof PDFLib.PDFRef ? ctx.lookup(parent) : parent;
    if(!node) break;
  }
  return chain;
}

function decodePageContentStream(pdfPage, pdfDoc){
  var PDFName = PDFLib.PDFName;
  var ctx = pdfDoc.context;
  var contents = pdfPage.node.Contents ? pdfPage.node.Contents() : pdfPage.node.get(PDFName.of('Contents'));
  if(!contents) return '';

  var text = '';
  function appendStream(streamNode){
    if(!streamNode) return;
    var bytes = getPdfStreamBytes(streamNode);
    if(bytes && bytes.length) text += new TextDecoder('latin1').decode(bytes);
  }

  if(contents.size && typeof contents.size === 'function' && typeof contents.get === 'function'){
    for(var i = 0; i < contents.size(); i++){
      var ref = contents.get(i);
      appendStream(ref instanceof PDFLib.PDFRef ? ctx.lookup(ref) : ref);
    }
  } else {
    appendStream(contents instanceof PDFLib.PDFRef ? ctx.lookup(contents) : contents);
  }
  return text;
}

function findDoOperatorNames(content){
  var names = [];
  var re = /\/([A-Za-z0-9_\-.]+)\s+Do\b/g;
  var match;
  while((match = re.exec(content))){
    names.push(match[1]);
  }
  return names;
}

function resolveNamedXObject(chain, name, pdfDoc){
  var PDFName = PDFLib.PDFName;
  var ctx = pdfDoc.context;
  for(var c = 0; c < chain.length; c++){
    var xObjects = chain[c].get(PDFName.of('XObject'));
    if(!xObjects) continue;
    var xDict = xObjects instanceof PDFLib.PDFRef ? ctx.lookup(xObjects) : xObjects;
    if(!xDict || !xDict.get) continue;
    var ref = xDict.get(PDFName.of(name));
    if(!ref) continue;
    return ref instanceof PDFLib.PDFRef ? ctx.lookup(ref) : ref;
  }
  return null;
}

function collectImagesFromFormXObject(form, pdfDoc, results, visitedForms){
  var PDFName = PDFLib.PDFName;
  var formKey = form.toString();
  if(visitedForms[formKey]) return;
  visitedForms[formKey] = true;

  var formResources = form.get(PDFName.of('Resources'));
  if(formResources){
    var formResDict = formResources instanceof PDFLib.PDFRef ? pdfDoc.context.lookup(formResources) : formResources;
    collectEmbeddedImagesFromDict(pdfDoc, formResDict, results);
  }

  var bytes = getPdfStreamBytes(form);
  if(bytes && bytes.length){
    var content = new TextDecoder('latin1').decode(bytes);
    var names = findDoOperatorNames(content);
    var chain = formResources
      ? [formResources instanceof PDFLib.PDFRef ? pdfDoc.context.lookup(formResources) : formResources]
      : [];
    names.forEach(function(name){
      var xobj = resolveNamedXObject(chain, name, pdfDoc);
      if(!xobj) return;
      var subtype = pdfNameToString(xobj.get(PDFName.of('Subtype')));
      if(subtype === '/Image') pushImageRecord(xobj, results);
      else if(subtype === '/Form') collectImagesFromFormXObject(xobj, pdfDoc, results, visitedForms);
    });
  }
}

function collectPageImages(pdfPage, pdfDoc){
  var results = [];
  var chain = resolvePageResourceChain(pdfPage, pdfDoc);
  chain.forEach(function(res){ collectEmbeddedImagesFromDict(pdfDoc, res, results); });

  var content = decodePageContentStream(pdfPage, pdfDoc);
  var doNames = findDoOperatorNames(content);
  var visitedForms = {};

  doNames.forEach(function(name){
    var xobj = resolveNamedXObject(chain, name, pdfDoc);
    if(!xobj || typeof xobj.get !== 'function') return;
    var subtype = pdfNameToString(xobj.get(PDFLib.PDFName.of('Subtype')));
    if(subtype === '/Image') pushImageRecord(xobj, results);
    else if(subtype === '/Form') collectImagesFromFormXObject(xobj, pdfDoc, results, visitedForms);
  });

  return results;
}

function collectEmbeddedImagesFromDict(pdfDoc, resourcesDict, results){
  if(!resourcesDict) return;
  var PDFName = PDFLib.PDFName;
  var ctx = pdfDoc.context;
  var xObjects = resourcesDict.get(PDFName.of('XObject'));
  if(!xObjects) return;

  var xObjectDict = xObjects instanceof PDFLib.PDFRef ? ctx.lookup(xObjects) : xObjects;
  if(!xObjectDict || typeof xObjectDict.entries !== 'function') return;

  xObjectDict.entries().forEach(function(entry){
    var ref = entry[1];
    var xObject = ref instanceof PDFLib.PDFRef ? ctx.lookup(ref) : ref;
    if(!xObject || typeof xObject.get !== 'function') return;

    var subtype = pdfNameToString(xObject.get(PDFName.of('Subtype')));

    if(subtype === '/Image'){
      pushImageRecord(xObject, results);
      return;
    }

    if(subtype === '/Form'){
      var formResources = xObject.get(PDFName.of('Resources'));
      if(!formResources) return;
      var formResDict = formResources instanceof PDFLib.PDFRef ? ctx.lookup(formResources) : formResources;
      collectEmbeddedImagesFromDict(pdfDoc, formResDict, results);
      collectImagesFromFormXObject(xObject, pdfDoc, results, {});
    }
  });
}

function fitCanvasDimensions(srcW, srcH, maxW, maxH){
  var w = srcW;
  var h = srcH;
  var scale = Math.min(1, maxW / w, maxH / h);
  w = Math.max(1, Math.round(w * scale));
  h = Math.max(1, Math.round(h * scale));

  if(w > CANVAS_LIMITS.MAX_SIDE || h > CANVAS_LIMITS.MAX_SIDE){
    var sideScale = CANVAS_LIMITS.MAX_SIDE / Math.max(w, h);
    w = Math.max(1, Math.round(w * sideScale));
    h = Math.max(1, Math.round(h * sideScale));
  }
  if(w * h > CANVAS_LIMITS.MAX_PIXELS){
    var pxScale = Math.sqrt(CANVAS_LIMITS.MAX_PIXELS / (w * h));
    w = Math.max(1, Math.round(w * pxScale));
    h = Math.max(1, Math.round(h * pxScale));
  }
  return { width: w, height: h };
}

function canvasFromRawImage(imageInfo){
  var w = imageInfo.width;
  var h = imageInfo.height;
  var bytes = imageInfo.bytes;
  var cs = imageInfo.colorSpace || '/DeviceRGB';
  var canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  var ctx = canvas.getContext('2d', { alpha: false });
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);

  var imageData = ctx.createImageData(w, h);
  var dst = imageData.data;

  if(cs.indexOf('DeviceGray') >= 0){
    for(var g = 0, gi = 0; g < w * h; g++, gi += 4){
      var gray = bytes[g];
      dst[gi] = dst[gi + 1] = dst[gi + 2] = gray;
      dst[gi + 3] = 255;
    }
  } else if(cs.indexOf('DeviceRGB') >= 0 || bytes.length === w * h * 3){
    for(var r = 0, ri = 0; r < w * h * 3; r += 3, ri += 4){
      dst[ri] = bytes[r];
      dst[ri + 1] = bytes[r + 1];
      dst[ri + 2] = bytes[r + 2];
      dst[ri + 3] = 255;
    }
  } else if(bytes.length === w * h * 4){
    dst.set(bytes);
  } else {
    return null;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

function canvasToSizedJpeg(srcCanvas, quality, maxW, maxH, grayscale){
  var dims = fitCanvasDimensions(srcCanvas.width, srcCanvas.height, maxW, maxH);
  var out = document.createElement('canvas');
  out.width = dims.width;
  out.height = dims.height;
  out.getContext('2d', { alpha: false }).drawImage(srcCanvas, 0, 0, dims.width, dims.height);
  var jpeg = canvasToJpegBytes(out, quality, grayscale);
  destroyCanvas(out);
  return jpeg;
}

function bytesToJpegViaImage(bytes, mime, quality, maxW, maxH, grayscale){
  return new Promise(function(resolve, reject){
    var blob = new Blob([bytes], { type: mime });
    var url = URL.createObjectURL(blob);
    var img = new Image();
    img.onload = function(){
      URL.revokeObjectURL(url);
      try {
        var canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        canvas.getContext('2d', { alpha: false }).drawImage(img, 0, 0);
        resolve(canvasToSizedJpeg(canvas, quality, maxW, maxH, grayscale));
        destroyCanvas(canvas);
      } catch(e){ reject(e); }
    };
    img.onerror = function(){
      URL.revokeObjectURL(url);
      reject(new Error('image decode failed'));
    };
    img.src = url;
  });
}

async function reencodeEmbeddedImage(imageInfo, quality, dpi, pageW, pageH, grayscale){
  var maxW = Math.round(pageW * dpi / 72);
  var maxH = Math.round(pageH * dpi / 72);
  var filter = imageInfo.filter || '';
  var bytes = imageInfo.bytes;

  if(filter.indexOf('DCT') >= 0 || (bytes[0] === 0xFF && bytes[1] === 0xD8)){
    return bytesToJpegViaImage(bytes, 'image/jpeg', quality, maxW, maxH, grayscale);
  }

  if(filter.indexOf('Flate') >= 0 || filter.indexOf('ASCII') >= 0 || filter === ''){
    var rawCanvas = canvasFromRawImage(imageInfo);
    if(rawCanvas){
      var jpegFromRaw = canvasToSizedJpeg(rawCanvas, quality, maxW, maxH, grayscale);
      destroyCanvas(rawCanvas);
      return jpegFromRaw;
    }
  }

  if(filter.indexOf('JPX') >= 0){
    throw new Error('JPX needs pdf.js extract');
  }

  try {
    return await bytesToJpegViaImage(bytes, 'image/jpeg', quality, maxW, maxH, grayscale);
  } catch(e){
    var fallbackCanvas = canvasFromRawImage(imageInfo);
    if(!fallbackCanvas) throw e;
    var jpegFallback = canvasToSizedJpeg(fallbackCanvas, quality, maxW, maxH, grayscale);
    destroyCanvas(fallbackCanvas);
    return jpegFallback;
  }
}

/** pdf.js decode + extract — handles JPEG2000 and layered PDFs */
async function compressViaPdfJsExtract(arrayBuffer, stripMetadata, onProgress){
  var pdfDoc = await pdfjsLib.getDocument({
    data: arrayBuffer,
    disableFontFace: false,
    useSystemFonts: true,
    verbosity: 0
  }).promise;

  var newPdf = await PDFLib.PDFDocument.create();
  var total = pdfDoc.numPages;
  var reencodedCount = 0;

  for(var i = 1; i <= total; i++){
    if(onProgress) onProgress(i - 1, total);
    await tick();

    var page = await pdfDoc.getPage(i);
    var extracted = await tryExtractPageAsImage(page, pdfDoc, SETTINGS.dpi);
    if(!extracted) throw new Error('Extract failed on page '+i);

    var vp = extracted.viewport;
    var jpegBytes = canvasToJpegBytes(extracted.canvas, SETTINGS.quality, SETTINGS.grayscale);
    var pageW = vp.width * 72 / vp._effectiveDpi;
    var pageH = vp.height * 72 / vp._effectiveDpi;
    var jpgImage = await newPdf.embedJpg(jpegBytes);
    var newPage = newPdf.addPage([pageW, pageH]);
    newPage.drawImage(jpgImage, { x: 0, y: 0, width: pageW, height: pageH });

    destroyCanvas(extracted.canvas);
    page.cleanup();
    reencodedCount++;
  }

  pdfDoc.destroy();
  applyPdfMetadata(newPdf, stripMetadata);
  return {
    bytes: await newPdf.save({ useObjectStreams: true }),
    reencodedCount: reencodedCount,
    totalPages: total
  };
}

function applyPdfMetadata(pdf, stripMetadata){
  if(stripMetadata){
    pdf.setTitle('');
    pdf.setAuthor('');
    pdf.setSubject('');
    pdf.setKeywords([]);
    pdf.setProducer('VeloTools PDF Compressor');
    pdf.setCreator('');
  } else {
    pdf.setProducer('VeloTools PDF Compressor');
  }
}

/** Re-encode embedded JPEG/PNG streams — works when canvas render fails */
async function compressViaEmbeddedImages(arrayBuffer, stripMetadata, onProgress){
  var srcPdf = await PDFLib.PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  var outPdf = await PDFLib.PDFDocument.create();
  var pages = srcPdf.getPages();
  var reencodedCount = 0;

  for(var i = 0; i < pages.length; i++){
    if(onProgress) onProgress(i, pages.length);
    await tick();

    var pdfPage = pages[i];
    var size = pdfPage.getSize();
    var pageW = size.width;
    var pageH = size.height;
    var images = collectPageImages(pdfPage, srcPdf);

    if(!images.length){
      var copied = await outPdf.copyPages(srcPdf, [i]);
      outPdf.addPage(copied[0]);
      continue;
    }

    images.sort(function(a, b){ return (b.width * b.height) - (a.width * a.height); });

    try {
      var jpegBytes = await reencodeEmbeddedImage(
        images[0], SETTINGS.quality, SETTINGS.dpi, pageW, pageH, SETTINGS.grayscale
      );
      var jpgImage = await outPdf.embedJpg(jpegBytes);
      var newPage = outPdf.addPage([pageW, pageH]);
      newPage.drawImage(jpgImage, { x: 0, y: 0, width: pageW, height: pageH });
      reencodedCount++;
    } catch(e){
      console.warn('Page '+(i + 1)+' pdf-lib re-encode failed, copying page', e);
      var copiedFallback = await outPdf.copyPages(srcPdf, [i]);
      outPdf.addPage(copiedFallback[0]);
    }
  }

  if(reencodedCount === 0) throw new Error('No re-encodable images found');

  applyPdfMetadata(outPdf, stripMetadata);
  return {
    bytes: await outPdf.save({ useObjectStreams: true }),
    reencodedCount: reencodedCount,
    totalPages: pages.length
  };
}

/** Per-page hybrid: pdf.js extract → pdf-lib re-encode → copy page. Never gives up early. */
async function compressViaHybridFallback(file, stripMetadata, onProgress){
  var pdfBytes = await readFileBytes(file);
  var srcPdf = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  var total = srcPdf.getPageCount();

  var pdfJsDoc = null;
  try {
    var jsBytes = await readFileBytes(file);
    pdfJsDoc = await pdfjsLib.getDocument({
      data: jsBytes,
      disableFontFace: false,
      useSystemFonts: true,
      verbosity: 0
    }).promise;
  } catch(e){
    console.warn('pdf.js unavailable in hybrid mode:', e);
  }

  var outPdf = await PDFLib.PDFDocument.create();
  var reencodedCount = 0;
  var copiedCount = 0;

  for(var i = 0; i < total; i++){
    if(onProgress) onProgress(i, total);
    await tick();

    var pageNum = i + 1;
    var processed = false;

    if(pdfJsDoc){
      try {
        var page = await pdfJsDoc.getPage(pageNum);
        var extracted = await tryExtractPageAsImage(page, pdfJsDoc, SETTINGS.dpi);
        if(extracted){
          await addJpegPageFromExtract(outPdf, extracted);
          destroyCanvas(extracted.canvas);
          reencodedCount++;
          processed = true;
        }
        page.cleanup();
      } catch(e){
        console.warn('Page '+pageNum+' pdf.js extract:', e);
      }
    }

    if(!processed){
      try {
        var pdfPage = srcPdf.getPage(i);
        var size = pdfPage.getSize();
        var images = collectPageImages(pdfPage, srcPdf);
        if(images.length){
          images.sort(function(a, b){ return (b.width * b.height) - (a.width * a.height); });
          var jpegBytes = await reencodeEmbeddedImage(
            images[0], SETTINGS.quality, SETTINGS.dpi, size.width, size.height, SETTINGS.grayscale
          );
          var jpgImage = await outPdf.embedJpg(jpegBytes);
          var newPage = outPdf.addPage([size.width, size.height]);
          newPage.drawImage(jpgImage, { x: 0, y: 0, width: size.width, height: size.height });
          reencodedCount++;
          processed = true;
        }
      } catch(e){
        console.warn('Page '+pageNum+' pdf-lib re-encode:', e);
      }
    }

    if(!processed){
      var cp = await outPdf.copyPages(srcPdf, [i]);
      outPdf.addPage(cp[0]);
      copiedCount++;
    }
  }

  if(pdfJsDoc) pdfJsDoc.destroy();

  applyPdfMetadata(outPdf, stripMetadata);
  return {
    bytes: await outPdf.save({ useObjectStreams: true }),
    reencodedCount: reencodedCount,
    copiedCount: copiedCount,
    totalPages: total
  };
}

/** Preserve original pages when nothing else works */
async function compressViaPdfLibCopy(arrayBuffer, stripMetadata){
  var srcPdf = await PDFLib.PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  var outPdf = await PDFLib.PDFDocument.create();
  var copied = await outPdf.copyPages(srcPdf, srcPdf.getPageIndices());
  copied.forEach(function(p){ outPdf.addPage(p); });
  applyPdfMetadata(outPdf, stripMetadata);
  return outPdf.save({ useObjectStreams: true });
}

function needsHybridFallback(err){
  if(!err) return false;
  if(err.code === 'RENDER_FAIL') return true;
  return /could not be rendered|extract failed|re-encodable images|empty jpeg/i.test(err.message || '');
}

async function doCompress(f){
  syncSettings();
  var pdfDoc = null;
  try {
    if(f.file.size > 120 * 1048576){
      throw new Error('File over 120 MB — split or use Screen preset with 72 DPI');
    }

    var pdfBytes = await readFileBytes(f.file);
    var loadTask = pdfjsLib.getDocument({
      data: pdfBytes,
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
      var rendered = null;
      var viewport = null;
      try {
        var renderResult = await renderPageWithFallback(page, SETTINGS.dpi, annotationMode, pdfDoc);
        rendered = renderResult.canvas;
        viewport = renderResult.viewport;
        if(viewport._scaleNote && !f.scaleNote) f.scaleNote = viewport._scaleNote;

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
      applyPdfMetadata(newPdf, true);
    } else {
      applyPdfMetadata(newPdf, false);
    }

    var compressed = await newPdf.save({ useObjectStreams: true });

    f.compressedBytes = compressed;
    f.compressedSize  = compressed.byteLength;
    f.status = 'done';
    f.progress = 100;
    checkPlatformLimit(f);

  } catch(err){
    console.error('Compression error:', err);

    if(needsHybridFallback(err)){
      try {
        f.progress = 10;
        updateProgress(f);
        var hybrid = await compressViaHybridFallback(f.file, SETTINGS.stripMetadata, function(pageIdx, total){
          f.progress = 10 + Math.round((pageIdx / total) * 85);
          updateProgress(f);
          if(!f.pageCount) f.pageCount = total;
        });
        f.compressedBytes = hybrid.bytes;
        f.compressedSize = hybrid.bytes.byteLength;
        f.pageCount = hybrid.totalPages;
        f.status = 'done';
        f.progress = 100;
        f.scaleNote = buildFallbackScaleNote(hybrid);
        checkPlatformLimit(f);
        return;
      } catch(hybridErr){
        console.error('Hybrid compression failed:', hybridErr);
        try {
          f.progress = 95;
          updateProgress(f);
          var copyBytes = await readFileBytes(f.file);
          var copied = await compressViaPdfLibCopy(copyBytes, SETTINGS.stripMetadata);
          f.compressedBytes = copied;
          f.compressedSize = copied.byteLength;
          f.status = 'done';
          f.progress = 100;
          f.scaleNote = 'Light optimize — layered PDF, images preserved. Re-export as flat PDF for 60–80% savings';
          checkPlatformLimit(f);
          return;
        } catch(copyErr){
          console.error('Copy fallback failed:', copyErr);
          f.status = 'error';
          f.error = 'Couldn\u2019t read this PDF — password-protected or unsupported format. Re-export from Canva as Standard PDF, or Adobe \u2192 Save As \u2192 Optimized PDF.';
          return;
        }
      }
    }

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
