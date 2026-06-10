/* ============================================================
   VeloTools Background Remover — Application Engine v2
   ============================================================ */
'use strict';

/* ---------- STATE ---------- */
var S = {
  origData:null, maskData:null, aiMaskData:null,
  imgW:0, imgH:0,
  bg:'transparent',
  tool:null,
  brushSize:30, brushOpacity:0.85, brushHardness:0.7,
  isDrawing:false, lastX:0, lastY:0,
  undo:[], redo:[],
  needsRender:false,
  zoomLevel:1,
  altDown:false,
  spaceDown:false,
  prevTool:null,
  removeBg:null,
  panStart:null, panOffset:{x:0,y:0}, panLast:{x:0,y:0}
};

/* ---------- DOM ---------- */
function $(id){ return document.getElementById(id); }
var dispC, dispCtx, ovC, ovCtx;
var workC = document.createElement('canvas');
var workCtx = workC.getContext('2d', { willReadFrequently:true });
var compBuf = null;

/* ---------- AI ENGINE PRELOAD ---------- */
var bgEnginePromise = null;
function preloadEngine(){
  if(bgEnginePromise) return bgEnginePromise;
  bgEnginePromise = import('https://esm.sh/@imgly/background-removal@1.7.0')
    .then(function(mod){ S.removeBg = mod.removeBackground; return mod.removeBackground; })
    .catch(function(e){ console.warn('Engine preload failed', e); bgEnginePromise=null; });
  return bgEnginePromise;
}

/* ---------- RENDER LOOP ---------- */
function renderLoop(){
  if(S.needsRender){ renderNow(); S.needsRender=false; }
  requestAnimationFrame(renderLoop);
}
function requestRender(){ S.needsRender=true; }

function renderNow(){
  if(!S.origData || !S.maskData) return;
  var W=S.imgW, H=S.imgH;
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
  'smart-erase':['tt-smart'],
  'erase-hard':['tt-erase'],
  'erase-soft':['tt-erase-soft'],
  'restore-hard':['tt-restore'],
  'restore-soft':['tt-restore-soft'],
  'magnifier':['tt-mag'],
  'pan':['tt-pan']
};
function setTool(t){
  S.tool=t;
  document.querySelectorAll('.ttb').forEach(function(b){ b.classList.remove('act'); });
  var area=$('cc-area');
  area.classList.remove('tool-pan');
  dispC.classList.remove('brush-cur','zoom-in-cur','zoom-out-cur');
  clearCursor();
  if(!t) return;
  (TOOL_BTNS[t]||[]).forEach(function(id){ var el=$(id); if(el) el.classList.add('act'); });
  var isBrush = (t==='erase-hard'||t==='erase-soft'||t==='restore-hard'||t==='restore-soft');
  if(isBrush){ dispC.classList.add('brush-cur'); }
  else if(t==='pan'){ area.classList.add('tool-pan'); }
  else if(t==='magnifier'){ updateZoomCursor(); }
}

/* ---------- BACKGROUND ---------- */
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
  var isErase = S.tool==='erase-hard'||S.tool==='erase-soft';
  var isSoft  = S.tool==='erase-soft'||S.tool==='restore-soft';
  var r = Math.max(2, S.brushSize * 0.5);
  var W=S.imgW, H=S.imgH, md=S.maskData;
  var x0=Math.max(0,Math.floor(x-r-1)), x1=Math.min(W-1,Math.ceil(x+r+1));
  var y0=Math.max(0,Math.floor(y-r-1)), y1=Math.min(H-1,Math.ceil(y+r+1));
  var rr=r*r;
  for(var py=y0;py<=y1;py++){
    var rb=py*W, dyy=(py-y)*(py-y);
    for(var px=x0;px<=x1;px++){
      var d2=(px-x)*(px-x)+dyy;
      if(d2>rr) continue;
      var d=Math.sqrt(d2), a=1;
      if(isSoft){
        var tt=d/r;
        a=Math.max(0,1-tt*tt*(3-2*tt))*(0.35+S.brushHardness*0.65);
      }
      var str=a*S.brushOpacity*255, idx=rb+px;
      if(isErase){ var v=md[idx]-str; md[idx]=v<0?0:v; }
      else { var w=md[idx]+str; md[idx]=w>255?255:w; }
    }
  }
}
function interpolate(x1,y1,x2,y2){
  var d=Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
  var step=Math.max(0.5, S.brushSize*0.12);
  var steps=Math.max(1,Math.ceil(d/step));
  for(var i=0;i<=steps;i++){ var t=i/steps; paintAt(x1+(x2-x1)*t,y1+(y2-y1)*t); }
}

/* ---------- CURSOR ---------- */
function drawCursor(sx,sy){
  syncOverlay();
  ovCtx.clearRect(0,0,ovC.width,ovC.height);
  if(!S.tool) return;
  var isBrush=(S.tool==='erase-hard'||S.tool==='erase-soft'||S.tool==='restore-hard'||S.tool==='restore-soft');
  if(!isBrush) return;
  var isErase=S.tool==='erase-hard'||S.tool==='erase-soft';
  var scale=dispC.offsetWidth/S.imgW;
  var r=Math.max(4, S.brushSize*0.5*scale);
  var col=isErase?'255,124,149':'94,232,184';
  ovCtx.beginPath(); ovCtx.arc(sx,sy,r,0,6.283);
  ovCtx.strokeStyle='rgba('+col+',0.95)'; ovCtx.lineWidth=1.5; ovCtx.stroke();
  ovCtx.beginPath(); ovCtx.arc(sx,sy,r,0,6.283);
  ovCtx.fillStyle='rgba('+col+',0.08)'; ovCtx.fill();
  ovCtx.beginPath(); ovCtx.arc(sx,sy,1.5,0,6.283);
  ovCtx.fillStyle='rgba('+col+',0.9)'; ovCtx.fill();
}
function clearCursor(){ if(ovCtx) ovCtx.clearRect(0,0,ovC.width,ovC.height); }

/* ---------- ZOOM ---------- */
function updateZoomCursor(){
  if(S.tool!=='magnifier') return;
  dispC.classList.remove('zoom-in-cur','zoom-out-cur');
  dispC.classList.add(S.altDown ? 'zoom-out-cur' : 'zoom-in-cur');
}
function setViewZoom(z, originX, originY){
  S.zoomLevel = Math.max(0.2, Math.min(8, z));
  var cv=$('canvases');
  cv.style.transformOrigin = 'center center';
  applyPanTransform();
  $('zlevel').textContent=Math.round(S.zoomLevel*100)+'%';
  syncOverlay();
}
function zoomIn(){ setViewZoom(S.zoomLevel*1.3); }
function zoomOut(){ setViewZoom(S.zoomLevel/1.3); }
function zoomFit(){ S.panOffset={x:0,y:0}; setViewZoom(1); }

function zoomAtClick(e){
  if(S.altDown || S.zoomLevel > 1.1){
    S.panOffset={x:0,y:0}; setViewZoom(1);
  } else {
    setViewZoom(3);
  }
  updateZoomCursor();
}

/* ---------- WHEEL ZOOM ---------- */
function initWheelZoom(){
  var area = $('cc-area');
  area.addEventListener('wheel', function(e){
    e.preventDefault();
    var factor = e.deltaY < 0 ? 1.12 : 1/1.12;
    setViewZoom(S.zoomLevel * factor);
  }, { passive:false });
}

/* ---------- SMART ERASE ---------- */
function smartErase(x,y){
  var W=S.imgW, H=S.imgH;
  var xi=Math.max(0,Math.min(W-1,Math.round(x)));
  var yi=Math.max(0,Math.min(H-1,Math.round(y)));
  var pi=(yi*W+xi)*4;
  var sr=S.origData[pi], sg=S.origData[pi+1], sb=S.origData[pi+2];
  var tol=58, od=S.origData, md=S.maskData;
  for(var i=0,n=W*H;i<n;i++){
    var p=i*4, dr=od[p]-sr, dg=od[p+1]-sg, db=od[p+2]-sb;
    var d=Math.sqrt(dr*dr+dg*dg+db*db);
    if(d<tol){ var v=md[i]-((1-d/tol)*255*S.brushOpacity); md[i]=v<0?0:v; }
  }
}

/* ---------- AUTO REFINE ---------- */
function autoRefine(){
  if(!S.maskData) return;
  pushUndo();
  edgeFeatherInternal(2);
  requestRender();
}
function edgeFeatherInternal(r){
  var W=S.imgW, H=S.imgH, md=S.maskData, tmp=new Uint8ClampedArray(md), rr=r*r;
  for(var y=r;y<H-r;y++) for(var x=r;x<W-r;x++){
    var s=0, c=0;
    for(var dy=-r;dy<=r;dy++) for(var dx=-r;dx<=r;dx++){
      if(dx*dx+dy*dy>rr) continue; s+=md[(y+dy)*W+(x+dx)]; c++;
    }
    tmp[y*W+x]=s/c;
  }
  S.maskData=tmp;
}

/* ---------- AI CLEANUP (precision) ---------- */
function autoCleanup(){
  if(!S.maskData) return;
  var md=S.maskData, W=S.imgW, H=S.imgH;
  var od=S.origData;

  // Step 1: hard threshold — kill near-zero alpha, solidify near-full
  for(var i=0;i<md.length;i++){
    var a=md[i];
    if(a<18) md[i]=0;
    else if(a>237) md[i]=255;
  }

  // Step 2: color-aware defringe — if edge pixel color is similar to BG neighbors, reduce alpha
  var tmp=new Uint8ClampedArray(md);
  for(var y=2;y<H-2;y++){
    for(var x=2;x<W-2;x++){
      var idx=y*W+x;
      var cur=md[idx];
      if(cur===0||cur===255) continue; // only process edge/transition pixels

      // sample surrounding fully-transparent neighbors
      var bgR=0,bgG=0,bgB=0,bgCount=0;
      for(var dy=-2;dy<=2;dy++) for(var dx=-2;dx<=2;dx++){
        var ni=(y+dy)*W+(x+dx);
        if(md[ni]===0){ bgR+=od[ni*4]; bgG+=od[ni*4+1]; bgB+=od[ni*4+2]; bgCount++; }
      }
      if(bgCount>0){
        bgR/=bgCount; bgG/=bgCount; bgB/=bgCount;
        var pr=od[idx*4], pg=od[idx*4+1], pb=od[idx*4+2];
        var dist=Math.sqrt((pr-bgR)*(pr-bgR)+(pg-bgG)*(pg-bgG)+(pb-bgB)*(pb-bgB));
        // if this pixel looks like the background → reduce alpha
        if(dist<30) tmp[idx]=Math.round(cur*dist/30);
      }
    }
  }
  S.maskData=tmp;

  // Step 3: anti-alias edge pass
  var tmp2=new Uint8ClampedArray(S.maskData);
  for(var y2=1;y2<H-1;y2++){
    for(var x2=1;x2<W-1;x2++){
      var i2=y2*W+x2, cur2=S.maskData[i2];
      if(cur2===0||cur2===255){
        if(S.maskData[i2-1]===cur2&&S.maskData[i2+1]===cur2&&
           S.maskData[i2-W]===cur2&&S.maskData[i2+W]===cur2) continue;
      }
      var s2 = S.maskData[i2]*4
             + S.maskData[i2-1]+S.maskData[i2+1]
             + S.maskData[i2-W]+S.maskData[i2+W]
             + (S.maskData[i2-W-1]+S.maskData[i2-W+1]+S.maskData[i2+W-1]+S.maskData[i2+W+1])*0.5;
      tmp2[i2] = s2/10;
    }
  }
  S.maskData=tmp2;
}

/* ---------- UNDO / REDO ---------- */
function pushUndo(){
  S.undo.push(new Uint8ClampedArray(S.maskData));
  if(S.undo.length>60) S.undo.shift();
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

/* ---------- POINTER EVENTS ---------- */
function onDown(e){
  if(!S.origData || !S.tool) return;
  if(S.tool==='pan'){ startPan(e); e.preventDefault(); return; }
  if(S.tool==='magnifier'){ zoomAtClick(e); return; }
  var p=getXY(e);
  if(S.tool==='smart-erase'){ pushUndo(); smartErase(p.x,p.y); requestRender(); return; }
  pushUndo();
  S.isDrawing=true; S.lastX=p.x; S.lastY=p.y;
  paintAt(p.x,p.y); requestRender();
  e.preventDefault();
}
/* move on the canvas — only for cursor preview when NOT drawing */
function onCanvasMove(e){
  if(!S.origData || !S.tool) return;
  if(S.tool==='pan'){ return; }
  if(S.tool==='magnifier'){
    dispC.classList.remove('zoom-in-cur','zoom-out-cur');
    dispC.classList.add(S.altDown?'zoom-out-cur':'zoom-in-cur');
    return;
  }
  if(S.isDrawing) return; // window handler does the painting
  var p=getXY(e);
  drawCursor(p.sx,p.sy);
}
/* move on the WINDOW — handles painting + panning even outside the canvas */
function onWindowMove(e){
  if(!S.origData || !S.tool) return;
  if(S.tool==='pan' && S.panStart){ doPan(e); e.preventDefault(); return; }
  if(!S.isDrawing) return;
  var p=getXY(e);
  drawCursor(p.sx,p.sy);
  interpolate(S.lastX,S.lastY,p.x,p.y);
  S.lastX=p.x; S.lastY=p.y; requestRender();
  e.preventDefault();
}
function onUp(e){ S.isDrawing=false; endPan(); }
function onLeave(){ if(!S.isDrawing) clearCursor(); }

/* ---------- PAN ---------- */
function startPan(e){
  var area=$('cc-area');
  area.classList.add('panning');
  var cx = e.touches ? e.touches[0].clientX : e.clientX;
  var cy = e.touches ? e.touches[0].clientY : e.clientY;
  S.panStart = { x: cx, y: cy };
  S.panLast  = { x: cx, y: cy };
}
function doPan(e){
  if(!S.panStart) return;
  var cx = e.touches ? e.touches[0].clientX : e.clientX;
  var cy = e.touches ? e.touches[0].clientY : e.clientY;
  var dx = cx - S.panLast.x;
  var dy = cy - S.panLast.y;
  S.panLast = { x: cx, y: cy };
  S.panOffset.x += dx;
  S.panOffset.y += dy;
  applyPanTransform();
}
function applyPanTransform(){
  var cv=$('canvases');
  cv.style.transform = 'scale('+S.zoomLevel+') translate('
    + (S.panOffset.x/S.zoomLevel)+'px,'
    + (S.panOffset.y/S.zoomLevel)+'px)';
}
function endPan(){
  S.panStart = null;
  var area=$('cc-area');
  if(area) area.classList.remove('panning');
}

/* ---------- DOWNLOAD ---------- */
function doDownload(type){
  if(!S.origData) return;
  var W=S.imgW, H=S.imgH;
  var c=document.createElement('canvas'); c.width=W; c.height=H;
  var ctx=c.getContext('2d');
  if(type==='jpg-white'){ ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H); }
  else if(type==='jpg-bg'){
    if(S.bg==='grad'){ var g=ctx.createLinearGradient(0,0,W,H); g.addColorStop(0,'#3A1875'); g.addColorStop(1,'#C4909F'); ctx.fillStyle=g; }
    else if(S.bg!=='transparent'){ ctx.fillStyle=S.bg; } else { ctx.fillStyle='#fff'; }
    ctx.fillRect(0,0,W,H);
  }
  var out=new Uint8ClampedArray(W*H*4), od=S.origData, md=S.maskData;
  for(var i=0,n=W*H;i<n;i++){ var j=i*4; out[j]=od[j]; out[j+1]=od[j+1]; out[j+2]=od[j+2]; out[j+3]=md[i]; }
  var tc=document.createElement('canvas'); tc.width=W; tc.height=H;
  tc.getContext('2d').putImageData(new ImageData(out,W,H),0,0);
  ctx.drawImage(tc,0,0);
  var fmt=type==='png'?'image/png':type==='webp'?'image/webp':'image/jpeg';
  var ext=type==='png'?'.png':type==='webp'?'.webp':'.jpg';
  c.toBlob(function(blob){
    if(!blob){ alert('Export failed. Try PNG.'); return; }
    var url=URL.createObjectURL(blob);
    var a=document.createElement('a');
    a.download='velotools-bg-removed'+ext; a.href=url;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    setTimeout(function(){ URL.revokeObjectURL(url); },1500);
  }, fmt, 0.95);
}

/* ---------- STAGES ---------- */
function show(id){ ['s-upload','s-proc','s-err','s-edit'].forEach(function(s){ $(s).style.display=(s===id)?'block':'none'; }); }
function gotoUpload(){ show('s-upload'); $('file-input').value=''; S.undo=[]; S.redo=[]; S.origData=null; S.maskData=null; }

/* ---------- PROCESS FILE ---------- */
async function processFile(file){
  if(!file) return;
  show('s-proc');
  $('pb-f').style.width='0%'; $('pb-l').textContent='0%';
  $('proc-st').textContent='Loading AI engine…';
  try{
    var fn = S.removeBg || await preloadEngine();
    if(!fn) throw new Error('Could not load AI engine. Check your connection.');

    var resultBlob = await fn(file, {
      device: 'gpu',
      model: 'isnet',          // full quality model (not fp16)
      output: { format:'image/png', quality:1.0, type:'foreground' },
      progress: function(key,cur,tot){
        var p=tot>0?Math.round(cur/tot*100):0;
        $('pb-f').style.width=p+'%'; $('pb-l').textContent=p+'%';
        if(key&&key.indexOf('fetch')>=0) $('proc-st').textContent='Downloading AI model (one-time ~20MB)…';
        else if(key&&key.indexOf('compute')>=0) $('proc-st').textContent='Analyzing image with AI…';
      }
    });
    $('proc-st').textContent='Refining edges…';

    var origURL=URL.createObjectURL(file);
    var origImg=new Image();
    await new Promise(function(res,rej){ origImg.onload=res; origImg.onerror=rej; origImg.src=origURL; });
    var resURL=URL.createObjectURL(resultBlob);
    var resImg=new Image();
    await new Promise(function(res,rej){ resImg.onload=res; resImg.onerror=rej; resImg.src=resURL; });

    S.imgW=origImg.naturalWidth; S.imgH=origImg.naturalHeight;

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

    URL.revokeObjectURL(origURL);
    URL.revokeObjectURL(resURL);

    $('cc-info').textContent=S.imgW+' × '+S.imgH;
    S.undo=[]; S.redo=[]; S.zoomLevel=1; S.panOffset={x:0,y:0}; setViewZoom(1); updateHistory();
    requestRender();
    show('s-edit');
    setTool(null);
  }catch(err){
    console.error('BG removal error:',err);
    $('err-msg').textContent=(err&&err.message)?('Error: '+err.message):'Could not process this image.';
    show('s-err');
  }
}

/* ---------- UPLOAD ---------- */
function initUpload(){
  var zone=$('s-upload'), inp=$('file-input');
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
    var inField = (e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA');
    if(e.key==='Alt'){ S.altDown=true; updateZoomCursor(); }

    // Photoshop-style Space: hold to pan, release to restore.
    // ALWAYS block the default page-scroll while in the editor.
    if((e.code==='Space'||e.key===' ') && !inField){
      e.preventDefault();
      if(!S.spaceDown){
        S.spaceDown=true;
        if(S.origData && S.tool!=='pan'){ S.prevTool=S.tool; setTool('pan'); }
      }
      return;
    }
    if(inField) return;

    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'&&!e.shiftKey){ e.preventDefault(); doUndo(); return; }
    if((e.ctrlKey||e.metaKey)&&(e.key.toLowerCase()==='y'||(e.key.toLowerCase()==='z'&&e.shiftKey))){ e.preventDefault(); doRedo(); return; }
    if(e.ctrlKey||e.metaKey) return;

    var k=e.key.toLowerCase();
    if(k==='e') setTool('erase-hard');
    else if(k==='r') setTool('restore-hard');
    else if(k==='z') setTool('magnifier');
    else if(k==='s') setTool('smart-erase');
    else if(k==='b') setTool('erase-soft');
    else if(k==='='||k==='+'){ e.preventDefault(); zoomIn(); }
    else if(k==='-'){ e.preventDefault(); zoomOut(); }
    else if(k==='0'){ e.preventDefault(); zoomFit(); }
    else if(k==='['){
      S.brushSize=Math.max(2,S.brushSize-5);
      $('sl-size').value=S.brushSize; $('sv-size').textContent=S.brushSize; updateBrushPreview();
    }
    else if(k===']'){
      S.brushSize=Math.min(120,S.brushSize+5);
      $('sl-size').value=S.brushSize; $('sv-size').textContent=S.brushSize; updateBrushPreview();
    }
  });
  document.addEventListener('keyup', function(e){
    if(e.key==='Alt'){ S.altDown=false; updateZoomCursor(); }
    if(e.code==='Space'||e.key===' '){
      e.preventDefault();
      S.spaceDown=false;
      endPan();
      setTool(S.prevTool||null);
      S.prevTool=null;
    }
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
  dispC.addEventListener('mousemove',onCanvasMove);
  dispC.addEventListener('mouseleave',onLeave);
  // window-level so painting & panning continue outside the canvas
  window.addEventListener('mousemove',onWindowMove);
  window.addEventListener('mouseup',onUp);
  dispC.addEventListener('touchstart',function(e){ e.preventDefault(); onDown(e); },{passive:false});
  window.addEventListener('touchmove',function(e){ if(S.isDrawing||S.panStart){ e.preventDefault(); onWindowMove(e); } },{passive:false});
  window.addEventListener('touchend',onUp);
  window.addEventListener('resize', syncOverlay);
}

/* ---------- EXPOSE ---------- */
window.setTool=setTool; window.setBg=setBg; window.doUndo=doUndo; window.doRedo=doRedo;
window.doReset=doReset; window.doDownload=doDownload; window.gotoUpload=gotoUpload;
window.autoRefine=autoRefine; window.zoomIn=zoomIn; window.zoomOut=zoomOut; window.zoomFit=zoomFit;

/* ---------- INIT ---------- */
function init(){
  dispC=$('disp-c'); dispCtx=dispC.getContext('2d',{willReadFrequently:true});
  ovC=$('ov-c'); ovCtx=ovC.getContext('2d');
  initUpload(); initSliders(); initKeyboard(); initCanvas(); initWheelZoom();
  updateBrushPreview();
  renderLoop();
  show('s-upload');
  preloadEngine();
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
else init();