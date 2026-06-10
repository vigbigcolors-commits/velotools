/* ============================================================
   VeloTools Background Remover — Application Engine v3
   - Scroll-based zoom (pixel-perfect brush at any zoom)
   - Edge decontamination defringe (preserves fur/hair)
   - Fixed Smart Erase
   ============================================================ */
'use strict';

/* ---------- STATE ---------- */
var S = {
  origData:null, maskData:null, aiMaskData:null,
  imgW:0, imgH:0,
  baseScale:1,
  zoom:1,
  bg:'transparent',
  tool:null,
  brushSize:30, brushOpacity:0.85, brushHardness:0.7,
  isDrawing:false, lastX:0, lastY:0,
  undo:[], redo:[],
  needsRender:false,
  altDown:false, spaceDown:false, prevTool:null,
  removeBg:null,
  panStart:null
};

/* ---------- DOM ---------- */
function $(id){ return document.getElementById(id); }
var dispC, dispCtx, ovC, ovCtx;
var workC = document.createElement('canvas');
var workCtx = workC.getContext('2d', { willReadFrequently:true });
var compBuf = null;

/* ---------- AI ENGINE ---------- */
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
  applyDisplaySize();
}

/* ---------- DISPLAY SIZE (zoom) ---------- */
function computeBaseScale(){
  var area=$('cc-area');
  var availW=area.clientWidth-32;
  var availH=area.clientHeight-32;
  if(availW<50||availH<50){ S.baseScale=1; return; }
  S.baseScale=Math.min(availW/S.imgW, availH/S.imgH, 1);
}
function applyDisplaySize(){
  var area=$('cc-area');
  var dispW=S.imgW*S.baseScale*S.zoom;
  var dispH=S.imgH*S.baseScale*S.zoom;
  dispC.style.width=dispW+'px';
  dispC.style.height=dispH+'px';
  ovC.style.width=dispW+'px';
  ovC.style.height=dispH+'px';
  // only reassign width/height if changed — reassigning clears the canvas
  var nw=Math.max(1,Math.round(dispW)), nh=Math.max(1,Math.round(dispH));
  if(ovC.width!==nw || ovC.height!==nh){ ovC.width=nw; ovC.height=nh; }
  // center canvas when smaller than the scroll area; scroll when larger
  var mw=Math.max(0,Math.floor((area.clientWidth -dispW)/2));
  var mh=Math.max(0,Math.floor((area.clientHeight-dispH)/2));
  $('canvases').style.margin=mh+'px '+mw+'px';
}

function setZoom(z, focalClientX, focalClientY){
  var area=$('cc-area');
  var cv=$('canvases');
  var oldZoom=S.zoom;
  S.zoom=Math.max(0.1, Math.min(12, z));

  var areaRect=area.getBoundingClientRect();
  var cvRect=cv.getBoundingClientRect();

  // default focal point = center of visible area
  if(focalClientX===undefined){
    focalClientX=areaRect.left+area.clientWidth/2;
    focalClientY=areaRect.top+area.clientHeight/2;
  }

  // focal point position inside the canvas (CSS pixels, before zoom change)
  var fxInCanvas=focalClientX-cvRect.left;
  var fyInCanvas=focalClientY-cvRect.top;

  // image-space coordinate under focal point
  var imgX=fxInCanvas/S.baseScale/oldZoom;
  var imgY=fyInCanvas/S.baseScale/oldZoom;

  // apply new size (recalculates margins too)
  applyDisplaySize();

  // new canvas size and margin
  var dispW=S.imgW*S.baseScale*S.zoom;
  var dispH=S.imgH*S.baseScale*S.zoom;
  var mw=Math.max(0,Math.floor((area.clientWidth -dispW)/2));
  var mh=Math.max(0,Math.floor((area.clientHeight-dispH)/2));

  // set scroll so that imgX/imgY stays under the focal point
  var fxNew=imgX*S.baseScale*S.zoom;
  var fyNew=imgY*S.baseScale*S.zoom;
  area.scrollLeft=mw+fxNew-(focalClientX-areaRect.left);
  area.scrollTop =mh+fyNew-(focalClientY-areaRect.top);

  $('zlevel').textContent=Math.round(S.zoom*100)+'%';
}
function zoomIn(){ setZoom(S.zoom*1.3); }
function zoomOut(){ setZoom(S.zoom/1.3); }
function zoomFit(){ S.zoom=1; applyDisplaySize(); var a=$('cc-area'); a.scrollLeft=0; a.scrollTop=0; $('zlevel').textContent='100%'; }

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
  var isBrush=(t==='erase-hard'||t==='erase-soft'||t==='restore-hard'||t==='restore-soft');
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

/* ---------- COORDINATES (pixel-perfect at any zoom) ---------- */
function getXY(e){
  var r=dispC.getBoundingClientRect();
  var cx=e.touches?e.touches[0].clientX:e.clientX;
  var cy=e.touches?e.touches[0].clientY:e.clientY;
  var dispW=r.width||1, dispH=r.height||1;
  return {
    x:(cx-r.left)/dispW*S.imgW,
    y:(cy-r.top)/dispH*S.imgH,
    sx:(cx-r.left)/dispW*ovC.width,
    sy:(cy-r.top)/dispH*ovC.height
  };
}

/* ---------- BRUSH PAINTING ---------- */
function paintAt(x,y){
  if(!S.maskData) return;
  var isErase=S.tool==='erase-hard'||S.tool==='erase-soft';
  var isSoft =S.tool==='erase-soft'||S.tool==='restore-soft';
  var r=Math.max(2,S.brushSize*0.5);
  var W=S.imgW,H=S.imgH,md=S.maskData;
  var x0=Math.max(0,Math.floor(x-r-1)),x1=Math.min(W-1,Math.ceil(x+r+1));
  var y0=Math.max(0,Math.floor(y-r-1)),y1=Math.min(H-1,Math.ceil(y+r+1));
  var rr=r*r;
  for(var py=y0;py<=y1;py++){
    var rb=py*W,dyy=(py-y)*(py-y);
    for(var px=x0;px<=x1;px++){
      var d2=(px-x)*(px-x)+dyy;
      if(d2>rr) continue;
      var d=Math.sqrt(d2),a;
      if(isSoft){
        var tt=d/r; a=Math.max(0,1-tt*tt*(3-2*tt))*(0.35+S.brushHardness*0.65);
      } else {
        // hardness controls edge sharpness: 100%=sharp, lower=softer gradient
        var softStart=r*S.brushHardness;
        if(d<=softStart){
          a=1;
        } else {
          var tt2=(d-softStart)/Math.max(0.001,r-softStart);
          a=Math.max(0,1-tt2*tt2*(3-2*tt2));
        }
      }
      var str=a*S.brushOpacity*255,idx=rb+px;
      if(isErase){ var v=md[idx]-str; md[idx]=v<0?0:v; }
      else{ var w=md[idx]+str; md[idx]=w>255?255:w; }
    }
  }
}
function interpolate(x1,y1,x2,y2){
  var d=Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
  var step=Math.max(0.3,S.brushSize*0.06);
  var steps=Math.max(1,Math.ceil(d/step));
  for(var i=0;i<=steps;i++){ var t=i/steps; paintAt(x1+(x2-x1)*t,y1+(y2-y1)*t); }
}

/* ---------- CURSOR ---------- */
function drawCursor(sx,sy){
  if(!ovCtx) return;
  ovCtx.clearRect(0,0,ovC.width,ovC.height);
  if(!S.tool) return;
  var isBrush=(S.tool==='erase-hard'||S.tool==='erase-soft'||S.tool==='restore-hard'||S.tool==='restore-soft');
  if(!isBrush) return;
  var isErase=S.tool==='erase-hard'||S.tool==='erase-soft';
  var scale=ovC.width/S.imgW;
  var r=Math.max(4,S.brushSize*0.5*scale);
  var col=isErase?'255,124,149':'94,232,184';
  ovCtx.beginPath(); ovCtx.arc(sx,sy,r,0,6.283);
  ovCtx.strokeStyle='rgba('+col+',0.95)'; ovCtx.lineWidth=1.5; ovCtx.stroke();
  ovCtx.beginPath(); ovCtx.arc(sx,sy,r,0,6.283);
  ovCtx.fillStyle='rgba('+col+',0.08)'; ovCtx.fill();
  ovCtx.beginPath(); ovCtx.arc(sx,sy,1.5,0,6.283);
  ovCtx.fillStyle='rgba('+col+',0.9)'; ovCtx.fill();
}
function clearCursor(){ if(ovCtx) ovCtx.clearRect(0,0,ovC.width,ovC.height); }

/* ---------- ZOOM CURSOR ---------- */
function updateZoomCursor(){
  if(S.tool!=='magnifier') return;
  dispC.classList.remove('zoom-in-cur','zoom-out-cur');
  dispC.classList.add(S.altDown?'zoom-out-cur':'zoom-in-cur');
}
function zoomAtClick(e){
  var cx=e.clientX, cy=e.clientY;
  if(S.altDown || S.zoom>1.05){ setZoom(1,cx,cy); }
  else { setZoom(3,cx,cy); }
  updateZoomCursor();
}

/* ---------- WHEEL ZOOM ---------- */
function initWheelZoom(){
  $('cc-area').addEventListener('wheel', function(e){
    if(!S.origData) return;
    e.preventDefault();
    var factor=e.deltaY<0?1.12:1/1.12;
    setZoom(S.zoom*factor, e.clientX, e.clientY);
  }, { passive:false });
}

/* ---------- SMART ERASE ---------- */
/* Connected flood-fill (Magic Wand Contiguous):
   - only removes pixels CONNECTED to the clicked point
   - does NOT touch same-colored pixels elsewhere (e.g. skin ≠ bg)
   - smooths the new edge after fill to eliminate jaggies */
function smartErase(x,y){
  if(!S.origData||!S.maskData) return;
  var W=S.imgW,H=S.imgH,od=S.origData,md=S.maskData;
  var xi=Math.max(0,Math.min(W-1,Math.round(x)));
  var yi=Math.max(0,Math.min(H-1,Math.round(y)));
  var start=yi*W+xi;
  if(md[start]<10) return; // clicked on already-transparent pixel

  var pi=start*4;
  var sr=od[pi],sg=od[pi+1],sb=od[pi+2];
  var tol=45;

  // BFS flood fill — efficient with head pointer (no O(n²) shift)
  var visited=new Uint8Array(W*H);
  var queue=new Int32Array(W*H);
  var qHead=0,qTail=0;
  queue[qTail++]=start; visited[start]=1;
  var erased=[];

  while(qHead<qTail){
    var curr=queue[qHead++];
    var cy=Math.floor(curr/W), cx=curr%W;
    var cp=curr*4;
    var dr=od[cp]-sr, dg=od[cp+1]-sg, db=od[cp+2]-sb;
    var dist=Math.sqrt(dr*dr+dg*dg+db*db);
    if(dist>tol||md[curr]<10) continue;

    // smooth fade at tolerance boundary — no hard edge
    var strength=1-(dist/tol);
    erased.push(curr);
    var v=md[curr]-Math.round(strength*255);
    md[curr]=v<0?0:v;

    // 4-connected neighbors
    if(cx>0   &&!visited[curr-1]){ visited[curr-1]=1; queue[qTail++]=curr-1; }
    if(cx<W-1 &&!visited[curr+1]){ visited[curr+1]=1; queue[qTail++]=curr+1; }
    if(cy>0   &&!visited[curr-W]){ visited[curr-W]=1; queue[qTail++]=curr-W; }
    if(cy<H-1 &&!visited[curr+W]){ visited[curr+W]=1; queue[qTail++]=curr+W; }
  }

  // 1-pass edge anti-alias on the boundary of erased region
  var tmp=new Uint8ClampedArray(md);
  for(var i=0;i<erased.length;i++){
    var idx=erased[i];
    var cy2=Math.floor(idx/W), cx2=idx%W;
    if(cx2<1||cx2>W-2||cy2<1||cy2>H-2) continue;
    // only smooth transition pixels (not fully erased)
    if(md[idx]>0&&md[idx]<240){
      tmp[idx]=Math.round(
        (md[idx]*4+md[idx-1]+md[idx+1]+md[idx-W]+md[idx+W])/8
      );
    }
  }
  S.maskData=tmp;
}

/* ---------- REFINE ---------- */
/* Each click removes a thin layer of fringe that matches background color.
   Very gentle — press multiple times to accumulate. */
function autoRefine(){
  if(!S.maskData||!S.origData) return;
  pushUndo();
  var W=S.imgW,H=S.imgH,md=S.maskData,od=S.origData;
  var tmp=new Uint8ClampedArray(md);
  var R=2; // only look 2px away from background — tight edge only

  for(var y=R;y<H-R;y++){
    for(var x=R;x<W-R;x++){
      var idx=y*W+x, a=md[idx];
      if(a===0) continue;

      // collect background color from nearby transparent pixels
      var bgR=0,bgG=0,bgB=0,bgN=0;
      for(var dy=-R;dy<=R;dy++){
        for(var dx=-R;dx<=R;dx++){
          var ni=(y+dy)*W+(x+dx);
          if(md[ni]<15){
            bgR+=od[ni*4]; bgG+=od[ni*4+1]; bgB+=od[ni*4+2]; bgN++;
          }
        }
      }
      if(bgN<2) continue; // must be right at the edge
      bgR/=bgN; bgG/=bgN; bgB/=bgN;

      var p=idx*4;
      var dr=od[p]-bgR, dg=od[p+1]-bgG, db=od[p+2]-bgB;
      var dist=Math.sqrt(dr*dr+dg*dg+db*db);

      // tol=30: only very close matches — no false positives on real subject
      var tol=30;
      if(dist<tol){
        var similarity=1-(dist/tol);        // 1=identical to bg, 0=just at threshold
        var reduction=similarity*0.25;      // max 25% alpha removed per click — very gentle
        var newA=Math.round(a*(1-reduction));
        tmp[idx]=Math.min(a,newA);
      }
    }
  }
  S.maskData=tmp;
  requestRender();
}
function featherMask(r){
  var W=S.imgW,H=S.imgH,md=S.maskData,tmp=new Uint8ClampedArray(md),rr=r*r;
  for(var y=r;y<H-r;y++) for(var x=r;x<W-r;x++){
    var s=0,c=0;
    for(var dy=-r;dy<=r;dy++) for(var dx=-r;dx<=r;dx++){
      if(dx*dx+dy*dy>rr) continue; s+=md[(y+dy)*W+(x+dx)]; c++;
    }
    tmp[y*W+x]=s/c;
  }
  S.maskData=tmp;
}

/* ---------- AI CLEANUP — gentle, fur-preserving ---------- */
function autoCleanup(){
  if(!S.maskData) return;
  var md=S.maskData, W=S.imgW, H=S.imgH;
  // 1) gentle extremes — never touch mid-alpha (that's where fur lives)
  for(var i=0;i<md.length;i++){
    var a=md[i];
    if(a<10) md[i]=0;
    else if(a>248) md[i]=255;
  }
  // 2) alpha-matting refinement on the border band (pulls back fur & whiskers)
  alphaMatteRefine();
  // 3) light edge anti-alias (smooth jaggies only)
  var md2=S.maskData, tmp=new Uint8ClampedArray(md2);
  for(var y=1;y<H-1;y++){
    for(var x=1;x<W-1;x++){
      var idx=y*W+x, cur=md2[idx];
      if(cur===0||cur===255){
        if(md2[idx-1]===cur&&md2[idx+1]===cur&&md2[idx-W]===cur&&md2[idx+W]===cur) continue;
      }
      var s=md2[idx]*4 + md2[idx-1]+md2[idx+1]+md2[idx-W]+md2[idx+W]
            + (md2[idx-W-1]+md2[idx-W+1]+md2[idx+W-1]+md2[idx+W+1])*0.5;
      tmp[idx]=s/10;
    }
  }
  S.maskData=tmp;
  // 4) decontaminate edge color (kills white halo, keeps hair)
  decontaminateEdges();
}

/* Alpha-matting: within the uncertain border band, recompute each edge pixel's
   alpha from how close its color is to confirmed-foreground vs confirmed-background
   samples nearby. This recovers thin structures (whiskers, fur tips) that a hard
   mask clips. Single-pass, local, fast — runs once after AI. */
function alphaMatteRefine(){
  if(!S.maskData||!S.origData) return;
  var W=S.imgW,H=S.imgH,md=S.maskData,od=S.origData;
  var src=new Uint8ClampedArray(md);
  var R=3;                       // sampling radius for fg/bg references
  for(var y=R;y<H-R;y++){
    for(var x=R;x<W-R;x++){
      var idx=y*W+x, a=src[idx];
      if(a>=245 || a<=10) continue;        // only the uncertain band
      // gather nearest confirmed foreground & background colors
      var fr=0,fg=0,fb=0,fn=0, gr=0,gg=0,gb=0,gn=0;
      for(var dy=-R;dy<=R;dy++){
        for(var dx=-R;dx<=R;dx++){
          var ni=(y+dy)*W+(x+dx), na=src[ni], np=ni*4;
          if(na>=245){ fr+=od[np]; fg+=od[np+1]; fb+=od[np+2]; fn++; }
          else if(na<=10){ gr+=od[np]; gg+=od[np+1]; gb+=od[np+2]; gn++; }
        }
      }
      if(fn===0||gn===0) continue;          // need both references
      fr/=fn; fg/=fn; fb/=fn; gr/=gn; gg/=gn; gb/=gn;
      var p=idx*4, pr=od[p],pg=od[p+1],pb=od[p+2];
      // project pixel color onto fg<->bg line -> estimated alpha
      var vx=fr-gr, vy=fg-gg, vz=fb-gb;
      var len2=vx*vx+vy*vy+vz*vz;
      if(len2<1) continue;
      var t=((pr-gr)*vx+(pg-gg)*vy+(pb-gb)*vz)/len2;
      t=t<0?0:t>1?1:t;
      var est=Math.round(t*255);
      // Refine only REMOVES fringe — never increases alpha (never adds background back)
      var newA=Math.min(a, Math.round(a*0.6 + est*0.4));
      md[idx]=newA;
    }
  }
  S.maskData=md;
}

function decontaminateEdges(){
  var W=S.imgW,H=S.imgH,md=S.maskData,od=S.origData;
  for(var y=1;y<H-1;y++){
    for(var x=1;x<W-1;x++){
      var idx=y*W+x, a=md[idx];
      if(a<=8 || a>=250) continue;
      var bestA=a, br=0,bg=0,bb=0, found=false;
      for(var dy=-1;dy<=1;dy++) for(var dx=-1;dx<=1;dx++){
        var ni=(y+dy)*W+(x+dx);
        if(md[ni]>bestA+40){ bestA=md[ni]; br=od[ni*4]; bg=od[ni*4+1]; bb=od[ni*4+2]; found=true; }
      }
      if(found){
        var k=0.5*(1-a/255);
        var p=idx*4;
        od[p]  =od[p]  +(br-od[p])  *k;
        od[p+1]=od[p+1]+(bg-od[p+1])*k;
        od[p+2]=od[p+2]+(bb-od[p+2])*k;
      }
    }
  }
}

/* ---------- UNDO / REDO ---------- */
function pushUndo(){
  if(!S.maskData) return;
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
  paintAt(p.x,p.y); drawCursor(p.sx,p.sy); requestRender();
  e.preventDefault();
}
function onCanvasMove(e){
  if(!S.origData || !S.tool) return;
  if(S.tool==='pan'){ return; }
  if(S.tool==='magnifier'){
    dispC.classList.remove('zoom-in-cur','zoom-out-cur');
    dispC.classList.add(S.altDown?'zoom-out-cur':'zoom-in-cur'); return;
  }
  if(S.isDrawing) return;
  var p=getXY(e); drawCursor(p.sx,p.sy);
}
function onWindowMove(e){
  if(!S.origData || !S.tool) return;
  if(S.tool==='pan' && S.panStart){ doPan(e); e.preventDefault(); return; }
  if(!S.isDrawing) return;
  var p=getXY(e); drawCursor(p.sx,p.sy);
  interpolate(S.lastX,S.lastY,p.x,p.y);
  S.lastX=p.x; S.lastY=p.y; requestRender();
  e.preventDefault();
}
function onUp(){ S.isDrawing=false; endPan(); }
function onLeave(){ if(!S.isDrawing) clearCursor(); }

/* ---------- PAN ---------- */
function startPan(e){
  var area=$('cc-area'); area.classList.add('panning');
  var cx=e.touches?e.touches[0].clientX:e.clientX;
  var cy=e.touches?e.touches[0].clientY:e.clientY;
  S.panStart={ x:cx, y:cy, sl:area.scrollLeft, st:area.scrollTop };
}
function doPan(e){
  if(!S.panStart) return;
  var area=$('cc-area');
  var cx=e.touches?e.touches[0].clientX:e.clientX;
  var cy=e.touches?e.touches[0].clientY:e.clientY;
  area.scrollLeft=S.panStart.sl-(cx-S.panStart.x);
  area.scrollTop =S.panStart.st-(cy-S.panStart.y);
}
function endPan(){ S.panStart=null; var a=$('cc-area'); if(a) a.classList.remove('panning'); }

/* ---------- DOWNLOAD ---------- */
function doDownload(type){
  if(!S.origData) return;
  var W=S.imgW,H=S.imgH;
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
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
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
      model:'isnet',
      output:{ format:'image/png', quality:1.0, type:'foreground' },
      progress:function(key,cur,tot){
        var p=tot>0?Math.round(cur/tot*100):0;
        $('pb-f').style.width=p+'%'; $('pb-l').textContent=p+'%';
        if(key&&key.indexOf('fetch')>=0) $('proc-st').textContent='Downloading AI model (one-time)…';
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
    S.undo=[]; S.redo=[]; S.zoom=1; updateHistory();
    show('s-edit');
    requestAnimationFrame(function(){
      computeBaseScale();
      requestRender();
      zoomFit();
    });
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
    var inField=(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA');
    if(e.key==='Alt'){ S.altDown=true; updateZoomCursor(); }
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
    else if(k==='['){ S.brushSize=Math.max(2,S.brushSize-5); $('sl-size').value=S.brushSize; $('sv-size').textContent=S.brushSize; updateBrushPreview(); }
    else if(k===']'){ S.brushSize=Math.min(120,S.brushSize+5); $('sl-size').value=S.brushSize; $('sv-size').textContent=S.brushSize; updateBrushPreview(); }
  });
  document.addEventListener('keyup', function(e){
    if(e.key==='Alt'){ S.altDown=false; updateZoomCursor(); }
    if(e.code==='Space'||e.key===' '){
      e.preventDefault(); S.spaceDown=false; endPan();
      setTool(S.prevTool||null); S.prevTool=null;
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
  // cursor should stay visible anywhere inside the editing area, not just over the canvas
  $('cc-area').addEventListener('mouseleave', onLeave);
  window.addEventListener('mousemove',onWindowMove);
  window.addEventListener('mouseup',onUp);
  dispC.addEventListener('touchstart',function(e){ e.preventDefault(); onDown(e); },{passive:false});
  window.addEventListener('touchmove',function(e){ if(S.isDrawing||S.panStart){ e.preventDefault(); onWindowMove(e); } },{passive:false});
  window.addEventListener('touchend',onUp);
  window.addEventListener('resize', function(){
    if(!S.origData) return;
    computeBaseScale(); applyDisplaySize();
  });
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