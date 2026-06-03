/* ============================================================
   VeloTools Background Remover — Application Engine
   Optimized, modular, professional.
   ============================================================ */
'use strict';

/* ---------- STATE ---------- */
var S = {
  origData:null, maskData:null, aiMaskData:null, origImgEl:null,
  imgW:0, imgH:0,
  bg:'transparent',
  tool:null,                 // NOTHING selected by default
  brushSize:30, brushOpacity:0.85, brushHardness:0.7,
  isDrawing:false, lastX:0, lastY:0,
  undo:[], redo:[],
  needsRender:false,
  zoomLevel:1,
  altDown:false,
  removeBg:null,
  mouseOnCanvas:false
};

var MAG = { zoom:5, imgX:0, imgY:0, scrX:0, scrY:0, dirty:false };

/* ---------- DOM HELPERS ---------- */
function $(id){ return document.getElementById(id); }
var dispC, dispCtx, ovC, ovCtx;
/* offscreen composite canvas — reused every frame (perf) */
var workC = document.createElement('canvas');
var workCtx = workC.getContext('2d', { willReadFrequently:true });
/* persistent ImageData buffer (perf — avoid realloc) */
var compBuf = null;

/* ---------- PRELOAD AI ENGINE (speed) ---------- */
/* Start fetching the library the moment the page loads, in parallel with
   the user choosing a file. By upload time it is usually ready. */
var bgEnginePromise = null;
function preloadEngine(){
  if(bgEnginePromise) return bgEnginePromise;
  bgEnginePromise = import('https://esm.sh/@imgly/background-removal@1.7.0')
    .then(function(mod){ S.removeBg = mod.removeBackground; return mod.removeBackground; })
    .catch(function(e){ console.warn('Engine preload failed, will retry on demand', e); bgEnginePromise=null; });
  return bgEnginePromise;
}

/* ---------- RENDER LOOP ---------- */
function renderLoop(){
  if(S.needsRender){ renderNow(); S.needsRender=false; }
  if(S.tool==='magnifier-lens' && MAG.dirty){ /* reserved */ }
  requestAnimationFrame(renderLoop);
}
function requestRender(){ S.needsRender=true; }

/* CORE COMPOSITE — fixes the background bug.
   Why the old code failed: putImageData() REPLACES pixels including the
   alpha channel, so it overwrote the background fill with transparency.
   Correct approach: paint the RGBA cutout onto an offscreen canvas, then
   drawImage() it over the chosen background — drawImage blends by alpha. */
function renderNow(){
  if(!S.origData || !S.maskData) return;
  var W=S.imgW, H=S.imgH;

  // (re)allocate composite buffer only when size changes
  if(!compBuf || compBuf.length !== W*H*4){ compBuf = new Uint8ClampedArray(W*H*4); }
  var od=S.origData, md=S.maskData, out=compBuf;
  for(var i=0,n=W*H;i<n;i++){
    var j=i*4;
    out[j]=od[j]; out[j+1]=od[j+1]; out[j+2]=od[j+2]; out[j+3]=md[i];
  }
  workC.width=W; workC.height=H;
  workCtx.putImageData(new ImageData(out,W,H),0,0);

  dispC.width=W; dispC.height=H;
  dispCtx.clearRect(0,0,W,H);
  if(S.bg==='grad'){
    var g=dispCtx.createLinearGradient(0,0,W,H);
    g.addColorStop(0,'#3A1875'); g.addColorStop(1,'#C4909F');
    dispCtx.fillStyle=g; dispCtx.fillRect(0,0,W,H);
  } else if(S.bg!=='transparent'){
    dispCtx.fillStyle=S.bg; dispCtx.fillRect(0,0,W,H);
  }
  // blend the cutout over the background (respects alpha) -> background now WORKS
  dispCtx.drawImage(workC,0,0);

  syncOverlay();
}

function syncOverlay(){
  var w=dispC.offsetWidth, h=dispC.offsetHeight;
  if(ovC.width!==w || ovC.height!==h){
    ovC.width=w; ovC.height=h;
    ovC.style.width=w+'px'; ovC.style.height=h+'px';
  }
}

/* ---------- TOOL SELECTION ---------- */
var TOOL_BTNS = {
  'smart-erase':['t-smart','tt-smart'],
  'erase-hard':['t-erase-hard','tt-erase'],
  'erase-soft':['t-erase-soft'],
  'erase-hair':['t-erase-hair'],
  'restore-hard':['t-rest-hard','tt-restore'],
  'restore-soft':['t-rest-soft'],
  'restore-hair':['t-rest-hair'],
  'magnifier':['t-mag','tt-mag'],
  'pan':['t-pan']
};
function setTool(t){
  S.tool=t;
  document.querySelectorAll('.tb,.ttb').forEach(function(b){ b.classList.remove('act'); });
  var area=$('cc-area');
  area.classList.remove('tool-pan');
  dispC.classList.remove('brush-cur','zoom-in-cur','zoom-out-cur');
  $('zoom-hint').style.display='none';
  clearCursor();
  if(!t) return;   // null = no tool selected: default cursor, nothing active, no crash
  (TOOL_BTNS[t]||[]).forEach(function(id){ var el=$(id); if(el) el.classList.add('act'); });
  var isBrush=(t.indexOf('erase')===0 || t.indexOf('restore')===0) && t!=='smart-erase';
  if(isBrush){ dispC.classList.add('brush-cur'); }
  else if(t==='pan'){ area.classList.add('tool-pan'); }
  else if(t==='magnifier'){ updateZoomCursor(); }
}

/* ---------- BACKGROUND PREVIEW (now functional) ---------- */
function setBg(color, idx){
  S.bg=color;
  for(var i=0;i<=9;i++){ var el=$('sw-'+i); if(el) el.classList.remove('act'); }
  if(idx!==null && idx!==undefined){ var sw=$('sw-'+idx); if(sw) sw.classList.add('act'); }
  requestRender();
}

/* ---------- BRUSH PREVIEW ---------- */
function updateBrushPreview(){
  var bp=$('brush-prev'); if(!bp) return;
  var sz=Math.max(8,Math.min(64,S.brushSize));
  bp.style.width=sz+'px'; bp.style.height=sz+'px';
  bp.style.background='radial-gradient(circle,rgba(200,122,255,'+S.brushOpacity+'),rgba(200,122,255,'+(S.brushOpacity*0.3)+'))';
}

/* ---------- COORDINATES ---------- */
function getXY(e){
  var r=dispC.getBoundingClientRect();
  var cx=e.touches?e.touches[0].clientX:e.clientX;
  var cy=e.touches?e.touches[0].clientY:e.clientY;
  return {
    x:(cx-r.left)/r.width*S.imgW,
    y:(cy-r.top)/r.height*S.imgH,
    sx:cx-r.left, sy:cy-r.top
  };
}

/* ---------- BRUSH PAINTING ---------- */
function paintAt(x,y){
  if(!S.maskData) return;
  var isErase=S.tool.indexOf('erase')===0;
  var isHair=S.tool.indexOf('-hair')>=0;
  var isSoft=S.tool.indexOf('-soft')>=0 || isHair;
  var r=isHair?Math.max(2,S.brushSize*0.15):Math.max(2,S.brushSize*0.5);
  var W=S.imgW,H=S.imgH,md=S.maskData;
  var x0=Math.max(0,Math.floor(x-r-1)), x1=Math.min(W-1,Math.ceil(x+r+1));
  var y0=Math.max(0,Math.floor(y-r-1)), y1=Math.min(H-1,Math.ceil(y+r+1));
  var rr=r*r;
  for(var py=y0;py<=y1;py++){
    var rb=py*W, dyy=(py-y)*(py-y);
    for(var px=x0;px<=x1;px++){
      var dxx=(px-x)*(px-x);
      var d2=dxx+dyy;
      if(d2>rr) continue;
      var d=Math.sqrt(d2);
      var a=1;
      if(isSoft){ var tt=d/r; a=Math.max(0,1-tt*tt*(3-2*tt))*(0.4+S.brushHardness*0.6); }
      var str=a*S.brushOpacity*255;
      var idx=rb+px;
      if(isErase){ var v=md[idx]-str; md[idx]=v<0?0:v; }
      else{ var w=md[idx]+str; md[idx]=w>255?255:w; }
    }
  }
}
function interpolate(x1,y1,x2,y2){
  var d=Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
  var isHair=S.tool.indexOf('-hair')>=0;
  var step=Math.max(0.5,isHair?1:S.brushSize*0.12);
  var steps=Math.max(1,Math.ceil(d/step));
  for(var i=0;i<=steps;i++){ var t=i/steps; paintAt(x1+(x2-x1)*t,y1+(y2-y1)*t); }
}

/* ---------- CUSTOM BRUSH CURSOR ---------- */
function drawCursor(sx,sy){
  syncOverlay();
  ovCtx.clearRect(0,0,ovC.width,ovC.height);
  if(!S.tool) return;
  var isBrush=(S.tool.indexOf('erase')===0||S.tool.indexOf('restore')===0)&&S.tool!=='smart-erase';
  if(!isBrush) return;
  var isHair=S.tool.indexOf('-hair')>=0;
  var isErase=S.tool.indexOf('erase')===0;
  var scale=dispC.offsetWidth/S.imgW;
  var r=Math.max(4,(isHair?Math.max(2,S.brushSize*0.15):S.brushSize*0.5)*scale);
  var col=isErase?'255,124,149':'94,232,184';
  ovCtx.beginPath(); ovCtx.arc(sx,sy,r,0,6.283); ovCtx.strokeStyle='rgba('+col+',0.95)'; ovCtx.lineWidth=1.5; ovCtx.stroke();
  ovCtx.beginPath(); ovCtx.arc(sx,sy,r,0,6.283); ovCtx.fillStyle='rgba('+col+',0.08)'; ovCtx.fill();
  ovCtx.beginPath(); ovCtx.arc(sx,sy,1.5,0,6.283); ovCtx.fillStyle='rgba('+col+',0.9)'; ovCtx.fill();
}
function clearCursor(){ if(ovCtx) ovCtx.clearRect(0,0,ovC.width,ovC.height); }

/* ---------- CLICK-TO-ZOOM (Z tool) ---------- */
function updateZoomCursor(){
  if(S.tool!=='magnifier') return;
  dispC.classList.remove('zoom-in-cur','zoom-out-cur');
  if(S.altDown || S.zoomLevel>1){ dispC.classList.add('zoom-out-cur'); }
  else { dispC.classList.add('zoom-in-cur'); }
}
function zoomAtPoint(e){
  var r=dispC.getBoundingClientRect();
  var px=(e.clientX-r.left)/r.width*100;
  var py=(e.clientY-r.top)/r.height*100;
  var cv=$('canvases');
  if(S.altDown || S.zoomLevel>1){
    // zoom back to original
    cv.style.transformOrigin='center center';
    cv.style.transform='scale(1)';
    S.zoomLevel=1;
  } else {
    // zoom in 3x centered on the click point
    cv.style.transformOrigin=px+'% '+py+'%';
    cv.style.transform='scale(3)';
    S.zoomLevel=3;
  }
  $('zlevel').textContent=Math.round(S.zoomLevel*100)+'%';
  updateZoomCursor();
}

/* ---------- POINTER EVENTS ---------- */
function onDown(e){
  if(!S.origData || !S.tool) return;
  if(S.tool==='pan') return;
  if(S.tool==='magnifier'){ zoomAtPoint(e); return; }
  var p=getXY(e);
  if(S.tool==='smart-erase'){ pushUndo(); smartErase(p.x,p.y); requestRender(); return; }
  pushUndo();
  S.isDrawing=true; S.lastX=p.x; S.lastY=p.y;
  paintAt(p.x,p.y); requestRender();
  e.preventDefault();
}
function onMove(e){
  if(!S.origData || !S.tool) return;
  var p=getXY(e);
  if(S.tool==='magnifier'){ moveZoomHint(e); return; }
  drawCursor(p.sx,p.sy);
  if(!S.isDrawing) return;
  interpolate(S.lastX,S.lastY,p.x,p.y);
  S.lastX=p.x; S.lastY=p.y; requestRender();
  e.preventDefault();
}
function onUp(){ S.isDrawing=false; }
function onLeave(){ S.isDrawing=false; S.mouseOnCanvas=false; clearCursor(); $('zoom-hint').style.display='none'; }
function onEnter(){ S.mouseOnCanvas=true; }

/* small floating lens hint that follows the cursor in zoom mode */
function moveZoomHint(e){
  var h=$('zoom-hint');
  h.style.display='flex';
  h.style.left=e.clientX+'px';
  h.style.top=e.clientY+'px';
  h.innerHTML = (S.altDown||S.zoomLevel>1)
    ? '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>'
    : '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/><line x1="11" y1="8" x2="11" y2="14"/></svg>';
}

/* ---------- SMART ERASE ---------- */
function smartErase(x,y){
  var W=S.imgW,H=S.imgH;
  var xi=Math.max(0,Math.min(W-1,Math.round(x)));
  var yi=Math.max(0,Math.min(H-1,Math.round(y)));
  var pi=(yi*W+xi)*4;
  var sr=S.origData[pi],sg=S.origData[pi+1],sb=S.origData[pi+2];
  var tol=58, od=S.origData, md=S.maskData;
  for(var i=0,n=W*H;i<n;i++){
    var p=i*4, dr=od[p]-sr, dg=od[p+1]-sg, db=od[p+2]-sb;
    var d=Math.sqrt(dr*dr+dg*dg+db*db);
    if(d<tol){ var v=md[i]-((1-d/tol)*255*S.brushOpacity); md[i]=v<0?0:v; }
  }
}

/* ---------- EDGE OPS ---------- */
function edgeSmooth(){
  if(!S.maskData) return; pushUndo();
  var W=S.imgW,H=S.imgH,md=S.maskData,tmp=new Uint8ClampedArray(md);
  for(var y=1;y<H-1;y++) for(var x=1;x<W-1;x++){
    var i=y*W+x,s=0;
    for(var dy=-1;dy<=1;dy++) for(var dx=-1;dx<=1;dx++) s+=md[(y+dy)*W+(x+dx)];
    tmp[i]=s/9;
  }
  S.maskData=tmp; requestRender();
}
function edgeFeather(){
  if(!S.maskData) return; pushUndo();
  var W=S.imgW,H=S.imgH,md=S.maskData,tmp=new Uint8ClampedArray(md),r=3,rr=r*r;
  for(var y=r;y<H-r;y++) for(var x=r;x<W-r;x++){
    var s=0,c=0;
    for(var dy=-r;dy<=r;dy++) for(var dx=-r;dx<=r;dx++){ if(dx*dx+dy*dy>rr) continue; s+=md[(y+dy)*W+(x+dx)]; c++; }
    tmp[y*W+x]=s/c;
  }
  S.maskData=tmp; requestRender();
}
function edgeExpand(){
  if(!S.maskData) return; pushUndo();
  var W=S.imgW,H=S.imgH,md=S.maskData,tmp=new Uint8ClampedArray(md);
  for(var y=2;y<H-2;y++) for(var x=2;x<W-2;x++){
    var m=md[y*W+x]; if(m>=250) continue;
    for(var dy=-2;dy<=2;dy++) for(var dx=-2;dx<=2;dx++){ var v=md[(y+dy)*W+(x+dx)]; if(v>m)m=v; }
    tmp[y*W+x]=m;
  }
  S.maskData=tmp; requestRender();
}
function edgeContract(){
  if(!S.maskData) return; pushUndo();
  var W=S.imgW,H=S.imgH,md=S.maskData,tmp=new Uint8ClampedArray(md);
  for(var y=2;y<H-2;y++) for(var x=2;x<W-2;x++){
    var m=md[y*W+x]; if(m<=5) continue;
    for(var dy=-2;dy<=2;dy++) for(var dx=-2;dx<=2;dx++){ var v=md[(y+dy)*W+(x+dx)]; if(v<m)m=v; }
    tmp[y*W+x]=m;
  }
  S.maskData=tmp; requestRender();
}
function maskInvert(){
  if(!S.maskData) return; pushUndo();
  for(var i=0;i<S.maskData.length;i++) S.maskData[i]=255-S.maskData[i];
  requestRender();
}
function autoRefine(){ edgeSmooth(); edgeFeather(); }

/* ---------- AUTO EDGE CLEANUP (after AI) ---------- */
function autoCleanup(){
  if(!S.maskData) return;
  var md=S.maskData, W=S.imgW, H=S.imgH;
  // defringe: kill faint halo, solidify subject
  for(var i=0;i<md.length;i++){
    var a=md[i];
    if(a<28) md[i]=0; else if(a>228) md[i]=255;
  }
  // one-pass edge anti-alias (only on transition pixels)
  var tmp=new Uint8ClampedArray(md);
  for(var y=1;y<H-1;y++){
    for(var x=1;x<W-1;x++){
      var idx=y*W+x, cur=md[idx];
      if(cur===0||cur===255){
        if(md[idx-1]===cur&&md[idx+1]===cur&&md[idx-W]===cur&&md[idx+W]===cur) continue;
      }
      var s=md[idx]*4 + md[idx-1]+md[idx+1]+md[idx-W]+md[idx+W]
            + (md[idx-W-1]+md[idx-W+1]+md[idx+W-1]+md[idx+W+1])*0.5;
      tmp[idx]=s/10;
    }
  }
  S.maskData=tmp;
}

/* ---------- UNDO / REDO ---------- */
function pushUndo(){
  S.undo.push(new Uint8ClampedArray(S.maskData));
  if(S.undo.length>50) S.undo.shift();
  S.redo=[]; updateHistory();
}
function doUndo(){ if(!S.undo.length) return; S.redo.push(new Uint8ClampedArray(S.maskData)); S.maskData=S.undo.pop(); requestRender(); updateHistory(); }
function doRedo(){ if(!S.redo.length) return; S.undo.push(new Uint8ClampedArray(S.maskData)); S.maskData=S.redo.pop(); requestRender(); updateHistory(); }
function doReset(){ if(!S.aiMaskData) return; pushUndo(); S.maskData=new Uint8ClampedArray(S.aiMaskData); requestRender(); }
function updateHistory(){
  var u=$('tt-undo'), r=$('tt-redo');
  if(u) u.classList.toggle('disabled', S.undo.length===0);
  if(r) r.classList.toggle('disabled', S.redo.length===0);
}

/* ---------- TOOLBAR ZOOM (the +/- buttons) ---------- */
function setViewZoom(z){
  S.zoomLevel=Math.max(0.25,Math.min(5,z));
  var cv=$('canvases');
  cv.style.transformOrigin='center center';
  cv.style.transform='scale('+S.zoomLevel+')';
  $('zlevel').textContent=Math.round(S.zoomLevel*100)+'%';
  syncOverlay();
}
function zoomIn(){ setViewZoom(S.zoomLevel*1.25); }
function zoomOut(){ setViewZoom(S.zoomLevel/1.25); }
function zoomFit(){ setViewZoom(1); }

/* ---------- DOWNLOAD (all formats) ---------- */
function doDownload(type){
  if(!S.origData) return;
  var W=S.imgW,H=S.imgH;
  var c=document.createElement('canvas'); c.width=W; c.height=H;
  var ctx=c.getContext('2d');
  // For JPG (no alpha) we must paint a background first
  if(type==='jpg-white'){ ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H); }
  else if(type==='jpg-bg'){
    if(S.bg==='grad'){ var g=ctx.createLinearGradient(0,0,W,H); g.addColorStop(0,'#3A1875'); g.addColorStop(1,'#C4909F'); ctx.fillStyle=g; }
    else if(S.bg!=='transparent'){ ctx.fillStyle=S.bg; } else { ctx.fillStyle='#fff'; }
    ctx.fillRect(0,0,W,H);
  }
  // paint cutout (blends over bg for JPG, stays transparent for PNG/WebP)
  var out=new Uint8ClampedArray(W*H*4), od=S.origData, md=S.maskData;
  for(var i=0,n=W*H;i<n;i++){ var j=i*4; out[j]=od[j]; out[j+1]=od[j+1]; out[j+2]=od[j+2]; out[j+3]=md[i]; }
  var tc=document.createElement('canvas'); tc.width=W; tc.height=H;
  tc.getContext('2d').putImageData(new ImageData(out,W,H),0,0);
  ctx.drawImage(tc,0,0);

  var fmt=type==='png'?'image/png':type==='webp'?'image/webp':'image/jpeg';
  var ext=type==='png'?'.png':type==='webp'?'.webp':'.jpg';
  c.toBlob(function(blob){
    if(!blob){ alert('Export failed for this format. Try PNG.'); return; }
    var url=URL.createObjectURL(blob);
    var a=document.createElement('a');
    a.download='velotools-bg-removed'+ext; a.href=url; document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    setTimeout(function(){ URL.revokeObjectURL(url); },1500);
  }, fmt, 0.95);
}

/* ---------- COMPARE SLIDER ---------- */
var cmpDrag=false;
function setCmpPos(clientX){
  var stack=$('cmp-stack'); if(!stack) return;
  var rect=stack.getBoundingClientRect();
  var p=Math.max(0,Math.min(100,(clientX-rect.left)/rect.width*100));
  $('cmp-after-layer').style.width=p+'%';
  $('cmp-line').style.left=p+'%';
  $('cmp-hdl').style.left=p+'%';
}
function initCompare(){
  var area=$('cmp-area');
  area.addEventListener('mousedown',function(e){ cmpDrag=true; setCmpPos(e.clientX); e.preventDefault(); });
  document.addEventListener('mousemove',function(e){ if(cmpDrag) setCmpPos(e.clientX); });
  document.addEventListener('mouseup',function(){ cmpDrag=false; });
  area.addEventListener('touchstart',function(e){ cmpDrag=true; setCmpPos(e.touches[0].clientX); },{passive:true});
  document.addEventListener('touchmove',function(e){ if(cmpDrag) setCmpPos(e.touches[0].clientX); },{passive:true});
  document.addEventListener('touchend',function(){ cmpDrag=false; });
}
function refreshCompare(){
  if(!S.origData) return;
  var W=S.imgW,H=S.imgH;
  // BEFORE: rebuild from the original pixels (reliable, never a dead URL)
  var bc=document.createElement('canvas'); bc.width=W; bc.height=H;
  bc.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(S.origData),W,H),0,0);
  $('cmp-before-img').src=bc.toDataURL('image/png');
  // AFTER: composite the current cutout
  var ac=document.createElement('canvas'); ac.width=W; ac.height=H;
  var out=new Uint8ClampedArray(W*H*4), od=S.origData, md=S.maskData;
  for(var i=0,n=W*H;i<n;i++){ var j=i*4; out[j]=od[j]; out[j+1]=od[j+1]; out[j+2]=od[j+2]; out[j+3]=md[i]; }
  ac.getContext('2d').putImageData(new ImageData(out,W,H),0,0);
  $('cmp-after-img').src=ac.toDataURL('image/png');
  // centre the divider once laid out
  setTimeout(function(){
    $('cmp-after-layer').style.width='50%';
    $('cmp-line').style.left='50%';
    $('cmp-hdl').style.left='50%';
  },60);
}

/* ---------- TABS ---------- */
function switchTab(tab){
  $('ctab-e').classList.toggle('act',tab==='edit');
  $('ctab-c').classList.toggle('act',tab==='compare');
  $('canvases').style.display=tab==='edit'?'inline-block':'none';
  $('cmp-area').style.display=tab==='compare'?'flex':'none';
  if(tab==='compare') refreshCompare();
}

/* ---------- STAGES ---------- */
function show(id){ ['s-upload','s-proc','s-err','s-edit'].forEach(function(s){ $(s).style.display=(s===id)?'block':'none'; }); }
function gotoUpload(){ show('s-upload'); $('file-input').value=''; }

/* ---------- PROCESS FILE ---------- */
async function processFile(file){
  if(!file) return;
  show('s-proc');
  $('pb-f').style.width='0%'; $('pb-l').textContent='0%';
  $('proc-st').textContent='Loading AI engine…';
  try{
    var fn = S.removeBg || await preloadEngine();
    if(!fn){ throw new Error('Could not load AI engine. Check your connection.'); }

    var resultBlob = await fn(file,{
      device:'gpu',
      model:'isnet_fp16',
      output:{ format:'image/png', quality:0.9 },
      progress:function(key,cur,tot){
        var p=tot>0?Math.round(cur/tot*100):0;
        $('pb-f').style.width=p+'%'; $('pb-l').textContent=p+'%';
        if(key&&key.indexOf('fetch')>=0) $('proc-st').textContent='Downloading AI model (one-time, ~10MB)…';
        else if(key&&key.indexOf('compute')>=0) $('proc-st').textContent='Analyzing image with AI…';
      }
    });
    $('proc-st').textContent='Finalizing…';

    var origURL=URL.createObjectURL(file);
    var origImg=new Image();
    await new Promise(function(res,rej){ origImg.onload=res; origImg.onerror=rej; origImg.src=origURL; });
    var resURL=URL.createObjectURL(resultBlob);
    var resImg=new Image();
    await new Promise(function(res,rej){ resImg.onload=res; resImg.onerror=rej; resImg.src=resURL; });

    S.imgW=origImg.naturalWidth; S.imgH=origImg.naturalHeight; S.origImgEl=origImg;

    var sc=document.createElement('canvas'); sc.width=S.imgW; sc.height=S.imgH;
    var sctx=sc.getContext('2d',{willReadFrequently:true}); sctx.drawImage(origImg,0,0);
    S.origData=sctx.getImageData(0,0,S.imgW,S.imgH).data;

    var rc=document.createElement('canvas'); rc.width=S.imgW; rc.height=S.imgH;
    var rctx=rc.getContext('2d',{willReadFrequently:true}); rctx.drawImage(resImg,0,0);
    var rd=rctx.getImageData(0,0,S.imgW,S.imgH).data;
    S.maskData=new Uint8ClampedArray(S.imgW*S.imgH);
    for(var i=0,n=S.imgW*S.imgH;i<n;i++) S.maskData[i]=rd[i*4+3];

    autoCleanup();
    S.aiMaskData=new Uint8ClampedArray(S.maskData);

    URL.revokeObjectURL(resURL); // keep origURL alive for the session

    $('cc-info').textContent=S.imgW+' × '+S.imgH;
    S.undo=[]; S.redo=[]; S.zoomLevel=1; setViewZoom(1); updateHistory();
    requestRender();
    show('s-edit');
    setTool(null);             // <-- NO tool auto-selected
  }catch(err){
    console.error('BG removal error:',err);
    $('err-msg').textContent=(err&&err.message)?('Error: '+err.message):'Could not process this image. Try a different file.';
    show('s-err');
  }
}

/* ---------- UPLOAD HANDLERS ---------- */
function initUpload(){
  var zone=$('s-upload'), inp=$('file-input');
  // warm up the engine as soon as the user shows intent
  zone.addEventListener('mouseenter', preloadEngine, { once:true });
  zone.addEventListener('click', function(){ inp.click(); });
  zone.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); inp.click(); } });
  inp.addEventListener('change', function(){ if(inp.files[0]) processFile(inp.files[0]); });
  zone.addEventListener('dragover', function(e){ e.preventDefault(); zone.classList.add('drag'); preloadEngine(); });
  zone.addEventListener('dragleave', function(){ zone.classList.remove('drag'); });
  zone.addEventListener('drop', function(e){ e.preventDefault(); zone.classList.remove('drag'); var f=e.dataTransfer.files[0]; if(f) processFile(f); });
  document.addEventListener('paste', function(e){ if(!e.clipboardData) return; var f=Array.prototype.slice.call(e.clipboardData.files).find(function(f){ return f.type.indexOf('image/')===0; }); if(f) processFile(f); });
}

/* ---------- KEYBOARD ---------- */
function initKeyboard(){
  document.addEventListener('keydown', function(e){
    if(e.key==='Alt'){ S.altDown=true; updateZoomCursor(); }
    if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA') return;
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'&&!e.shiftKey){ e.preventDefault(); doUndo(); return; }
    if((e.ctrlKey||e.metaKey)&&(e.key.toLowerCase()==='y'||(e.key.toLowerCase()==='z'&&e.shiftKey))){ e.preventDefault(); doRedo(); return; }
    if(e.ctrlKey||e.metaKey) return;
    var k=e.key.toLowerCase();
    if(k==='e') setTool('erase-hard');
    else if(k==='r') setTool('restore-hard');
    else if(k==='z') setTool('magnifier');
    else if(k==='s') setTool('smart-erase');
    else if(k==='b') setTool('erase-soft');
    else if(k==='h') setTool('erase-hair');
    else if(k===' '){ e.preventDefault(); setTool('pan'); }
    else if(k==='['){
      if(S.tool==='magnifier'){ MAG.zoom=Math.max(2,MAG.zoom-1); }
      else { S.brushSize=Math.max(2,S.brushSize-5); $('sl-size').value=S.brushSize; $('sv-size').textContent=S.brushSize; updateBrushPreview(); }
    }
    else if(k===']'){
      if(S.tool==='magnifier'){ MAG.zoom=Math.min(14,MAG.zoom+1); }
      else { S.brushSize=Math.min(120,S.brushSize+5); $('sl-size').value=S.brushSize; $('sv-size').textContent=S.brushSize; updateBrushPreview(); }
    }
  });
  document.addEventListener('keyup', function(e){
    if(e.key==='Alt'){ S.altDown=false; updateZoomCursor(); }
  });
}

/* ---------- SLIDERS ---------- */
function initSliders(){
  $('sl-size').addEventListener('input', function(){ S.brushSize=parseInt(this.value); $('sv-size').textContent=S.brushSize; updateBrushPreview(); });
  $('sl-op').addEventListener('input', function(){ S.brushOpacity=parseInt(this.value)/100; $('sv-op').textContent=this.value+'%'; updateBrushPreview(); });
  $('sl-hard').addEventListener('input', function(){ S.brushHardness=parseInt(this.value)/100; $('sv-hard').textContent=this.value+'%'; });
  var cc=$('custom-bg-col'); if(cc) cc.addEventListener('input', function(){ setBg(this.value,null); });
}

/* ---------- CANVAS BINDING ---------- */
function initCanvas(){
  dispC.addEventListener('mousedown',onDown);
  dispC.addEventListener('mousemove',onMove);
  dispC.addEventListener('mouseup',onUp);
  dispC.addEventListener('mouseleave',onLeave);
  dispC.addEventListener('mouseenter',onEnter);
  dispC.addEventListener('touchstart',function(e){ e.preventDefault(); onDown(e); },{passive:false});
  dispC.addEventListener('touchmove',function(e){ e.preventDefault(); onMove(e); },{passive:false});
  dispC.addEventListener('touchend',onUp);
  window.addEventListener('resize', syncOverlay);
}

/* ---------- EXPOSE FOR INLINE HANDLERS ---------- */
window.setTool=setTool; window.setBg=setBg; window.doUndo=doUndo; window.doRedo=doRedo;
window.doReset=doReset; window.doDownload=doDownload; window.gotoUpload=gotoUpload;
window.switchTab=switchTab; window.maskInvert=maskInvert; window.autoRefine=autoRefine;
window.edgeSmooth=edgeSmooth; window.edgeFeather=edgeFeather; window.edgeExpand=edgeExpand;
window.edgeContract=edgeContract; window.zoomIn=zoomIn; window.zoomOut=zoomOut; window.zoomFit=zoomFit;

/* ---------- INIT ---------- */
function init(){
  dispC=$('disp-c'); dispCtx=dispC.getContext('2d',{willReadFrequently:true});
  ovC=$('ov-c'); ovCtx=ovC.getContext('2d');
  initUpload(); initSliders(); initKeyboard(); initCanvas(); initCompare();
  updateBrushPreview();
  renderLoop();
  show('s-upload');
  preloadEngine();            // start fetching the AI engine immediately
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
else init();