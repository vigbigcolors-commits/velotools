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
  'erase-soft':['tt-erase-soft'],   // soft tools still accessible via keyboard (B)
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
  if(t){
    (TOOL_BTNS[t]||[]).forEach(function(id){ var el=$(id); if(el) el.classList.add('act'); });
    var isBrush=(t==='erase-hard'||t==='erase-soft'||t==='restore-hard'||t==='restore-soft');
    if(isBrush){ dispC.classList.add('brush-cur'); }
    else if(t==='pan'){ area.classList.add('tool-pan'); }
    else if(t==='magnifier'){ updateZoomCursor(); }
  }
  updateMobBar();
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

/* ---------- PINCH ZOOM (mobile) ---------- */
var pinchState={active:false,lastDist:0};
function initPinchZoom(){
  var area=$('cc-area');
  area.addEventListener('touchstart',function(e){
    if(e.touches.length===2){
      e.preventDefault();
      S.isDrawing=false; endPan(); // cancel any brush/pan in progress
      var t0=e.touches[0],t1=e.touches[1];
      var dx=t0.clientX-t1.clientX,dy=t0.clientY-t1.clientY;
      pinchState.active=true;
      pinchState.lastDist=Math.sqrt(dx*dx+dy*dy);
    }
  },{passive:false});
  area.addEventListener('touchmove',function(e){
    if(e.touches.length===2&&pinchState.active){
      e.preventDefault();
      var t0=e.touches[0],t1=e.touches[1];
      var dx=t0.clientX-t1.clientX,dy=t0.clientY-t1.clientY;
      var dist=Math.sqrt(dx*dx+dy*dy);
      if(pinchState.lastDist>0&&dist>0){
        var mx=(t0.clientX+t1.clientX)/2,my=(t0.clientY+t1.clientY)/2;
        setZoom(S.zoom*(dist/pinchState.lastDist),mx,my);
      }
      pinchState.lastDist=dist;
    }
  },{passive:false});
  area.addEventListener('touchend',function(e){
    if(e.touches.length<2) pinchState.active=false;
  });
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
  var tol=65;

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

    // stop expanding if color too different from seed
    if(dist>tol) continue;

    // erase only if pixel is still visible
    if(md[curr]>0){
      var strength=1-(dist/tol);
      erased.push(curr);
      var v=md[curr]-Math.round(strength*255);
      md[curr]=v<0?0:v;
    }

    // always expand to neighbors (even through transparent — catches gradients)
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
/* Smooth 1-pixel Gaussian erosion — removes literally one thin layer of fringe
   with NO sharp zigzags. Each click shrinks the edge by ~1 CSS pixel.
   Algorithm:
     1. 3×3 Gaussian blur of the mask (smooth local average)
     2. Edge pixels (where blurred < current) are eroded proportionally
     3. Final 4-neighbor anti-alias pass eliminates any residual staircase */
function autoRefine(){
  if(!S.maskData) return;
  pushUndo();
  removeIsolatedNoise();

  var W=S.imgW, H=S.imgH, md=S.maskData;
  var tmp=new Uint8ClampedArray(md);
  var STR=0.055; // ~5.5% erosion per click — ultra-gentle, sub-pixel

  for(var y=1;y<H-1;y++){
    for(var x=1;x<W-1;x++){
      var idx=y*W+x;
      var a=md[idx];
      if(a===0) continue;

      // 3×3 Gaussian weights: corners=1, edges=2, centre=4 (sum=16)
      var g=(
        md[(y-1)*W+(x-1)] + md[(y-1)*W+(x+1)] +
        md[(y+1)*W+(x-1)] + md[(y+1)*W+(x+1)]
      ) + (
        md[(y-1)*W+x] + md[y*W+(x-1)] + md[y*W+(x+1)] + md[(y+1)*W+x]
      )*2 + a*4;
      g = g / 16;

      // Interior pixels: Gaussian ≈ self → skip (no erosion on solid regions)
      if(g > a - 3) continue;

      // Edge strength: how much lower is the neighbourhood average vs self
      var edge = (a - g) / Math.max(1, a); // 0=interior → 1=cliff
      tmp[idx] = Math.max(0, Math.round(a * (1 - edge * STR)));
    }
  }

  // Anti-alias pass — gently smooths any remaining staircase artifacts
  var out = new Uint8ClampedArray(tmp);
  for(var y2=1;y2<H-1;y2++){
    for(var x2=1;x2<W-1;x2++){
      var i2=y2*W+x2;
      var av=tmp[i2];
      if(av===0||av===255) continue; // skip transparent and fully solid
      var avg4=(tmp[(y2-1)*W+x2]+tmp[(y2+1)*W+x2]+tmp[y2*W+(x2-1)]+tmp[y2*W+(x2+1)])/4;
      if(Math.abs(avg4-av)<3) continue; // skip already-smooth pixels
      out[i2]=Math.round(av*0.75+avg4*0.25); // 75% self, 25% neighbours
    }
  }
  S.maskData=out;
  requestRender();
}
// eslint-disable-next-line no-unused-vars
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

/* ---------- ISOLATED NOISE REMOVAL ---------- */
/* BFS flood-fill from all confirmed-foreground pixels (alpha ≥ SEED).
   Expands into any connected semi-transparent pixel (alpha ≥ CONN).
   Any non-zero pixel NOT reached = isolated patch → zero it out.
   This removes scattered background specks while keeping all fur/hair
   that is physically connected to the main subject. */
function removeIsolatedNoise(){
  if(!S.maskData) return;
  var W=S.imgW, H=S.imgH, md=S.maskData;
  var SEED=180; // definitely foreground
  var CONN=8;   // traverse semi-transparent connections (hair strands alpha ~10-30)
  var n=W*H;

  var visited=new Uint8Array(n);
  var queue=new Int32Array(n);
  var qHead=0, qTail=0;

  // Seed: all solid foreground pixels
  for(var i=0;i<n;i++){
    if(md[i]>=SEED){ visited[i]=1; queue[qTail++]=i; }
  }

  // BFS — expand to connected semi-transparent neighbors
  while(qHead<qTail){
    var curr=queue[qHead++];
    var cy=Math.floor(curr/W), cx=curr%W;
    if(cx>0   && !visited[curr-1] && md[curr-1]>=CONN){ visited[curr-1]=1; queue[qTail++]=curr-1; }
    if(cx<W-1 && !visited[curr+1] && md[curr+1]>=CONN){ visited[curr+1]=1; queue[qTail++]=curr+1; }
    if(cy>0   && !visited[curr-W] && md[curr-W]>=CONN){ visited[curr-W]=1; queue[qTail++]=curr-W; }
    if(cy<H-1 && !visited[curr+W] && md[curr+W]>=CONN){ visited[curr+W]=1; queue[qTail++]=curr+W; }
  }

  // Zero out any non-zero pixel that was never reached
  for(var j=0;j<n;j++){
    if(!visited[j] && md[j]>0) md[j]=0;
  }
}

/* ---------- AI CLEANUP — gentle, fur-preserving ---------- */
function autoCleanup(){
  if(!S.maskData) return;
  var md=S.maskData, W=S.imgW, H=S.imgH;
  // 1) clean extremes — raise floor to 15 to catch more background noise
  for(var i=0;i<md.length;i++){
    var a=md[i];
    if(a<15) md[i]=0;
    else if(a>248) md[i]=255;
  }
  // 2) remove isolated background patches BEFORE matting (faster, less work after)
  removeIsolatedNoise();
  // 3) alpha-matting refinement on the border band (pulls back fur & whiskers)
  alphaMatteRefine();
  // 4) light edge anti-alias (smooth jaggies only)
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
  // 5) decontaminate edge color (kills white halo, keeps hair)
  decontaminateEdges();
  // 6) second noise pass — catches any specks introduced by matting
  removeIsolatedNoise();
}

/* Alpha-matting: within the uncertain border band, recompute each edge pixel's
   alpha from how close its color is to confirmed-foreground vs confirmed-background
   samples nearby. This recovers thin structures (whiskers, fur tips) that a hard
   mask clips. Single-pass, local, fast — runs once after AI. */
function alphaMatteRefine(){
  if(!S.maskData||!S.origData) return;
  var W=S.imgW,H=S.imgH,md=S.maskData,od=S.origData;
  var src=new Uint8ClampedArray(md);
  // R=5: larger sampling window catches thin hair strands and fur tips
  var R=5;
  for(var y=R;y<H-R;y++){
    for(var x=R;x<W-R;x++){
      var idx=y*W+x, a=src[idx];
      if(a>=248 || a<=8) continue; // only the uncertain border band
      var fr=0,fg=0,fb=0,fn=0, gr=0,gg=0,gb=0,gn=0;
      for(var dy=-R;dy<=R;dy++){
        for(var dx=-R;dx<=R;dx++){
          var ni=(y+dy)*W+(x+dx), na=src[ni], np=ni*4;
          if(na>=248){ fr+=od[np]; fg+=od[np+1]; fb+=od[np+2]; fn++; }
          else if(na<=8){ gr+=od[np]; gg+=od[np+1]; gb+=od[np+2]; gn++; }
        }
      }
      if(fn===0||gn===0) continue;
      fr/=fn; fg/=fn; fb/=fn; gr/=gn; gg/=gn; gb/=gn;
      var p=idx*4, pr=od[p],pg=od[p+1],pb=od[p+2];
      // project pixel color onto fg↔bg line → estimated alpha
      var vx=fr-gr, vy=fg-gg, vz=fb-gb;
      var len2=vx*vx+vy*vy+vz*vz;
      if(len2<16) continue; // fg and bg too similar to be useful
      var t=((pr-gr)*vx+(pg-gg)*vy+(pb-gb)*vz)/len2;
      t=t<0?0:t>1?1:t;
      var est=Math.round(t*255);
      // 50/50 blend: allows slight increases (recovers hair) + slight decreases (removes fringe)
      // capped at 1.15× original to prevent hallucination
      var newA=Math.round(a*0.5+est*0.5);
      md[idx]=Math.max(0,Math.min(255,Math.min(Math.round(a*1.15),newA)));
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
  var mu=$('mtt-undo'); if(mu) mu.classList.toggle('disabled',S.undo.length===0);
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

/* ---------- MOBILE TOOLBAR ---------- */
function updateMobBar(){
  var map={smart:'smart-erase','erase':'erase-hard','restore':'restore-hard'};
  Object.keys(map).forEach(function(k){
    var el=$('mtt-'+k); if(!el) return;
    el.classList.toggle('act',S.tool===map[k]);
    if(k==='erase') el.classList.toggle('ttb-erase',true);
    if(k==='restore') el.classList.toggle('ttb-restore',true);
  });
  var mu=$('mtt-undo'); if(mu) mu.classList.toggle('disabled',S.undo.length===0);
}
function toggleMobileSidebar(){
  var rb=document.querySelector('.rb');
  var ov=$('mob-overlay');
  if(!rb||!ov) return;
  var open=rb.classList.toggle('open');
  ov.classList.toggle('show',open);
}

/* ---------- PAN TOGGLE ---------- */
function togglePan(){
  if(S.tool==='pan') setTool(null);
  else setTool('pan');
}

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
function gotoUpload(){ show('s-upload'); $('file-input').value=''; S.undo=[]; S.redo=[]; S.origData=null; S.maskData=null; var b=$('gpu-badge'); if(b) b.style.opacity='0'; }

/* ---------- PROCESS FILE ---------- */
async function processFile(file){
  if(!file) return;
  show('s-proc');
  $('pb-f').style.width='0%'; $('pb-l').textContent='0%';
  $('proc-st').textContent='Loading image…';

  try{
    // 1. Load original image first to get dimensions and pixels
    var origURL=URL.createObjectURL(file);
    var origImg=new Image();
    await new Promise(function(res,rej){ origImg.onload=res; origImg.onerror=rej; origImg.src=origURL; });
    URL.revokeObjectURL(origURL);
    S.imgW=origImg.naturalWidth; S.imgH=origImg.naturalHeight;

    var sc=document.createElement('canvas'); sc.width=S.imgW; sc.height=S.imgH;
    var sctx=sc.getContext('2d',{willReadFrequently:true}); sctx.drawImage(origImg,0,0);
    S.origData=sctx.getImageData(0,0,S.imgW,S.imgH).data;

    // 2. Pre-resize for AI — large images slow the model and can OOM on mobile
    var MAX_AI=1920;
    var aiFile=file;
    if(S.imgW>MAX_AI||S.imgH>MAX_AI){
      var ratio=Math.min(MAX_AI/S.imgW,MAX_AI/S.imgH);
      var aiW=Math.round(S.imgW*ratio), aiH=Math.round(S.imgH*ratio);
      var rc2=document.createElement('canvas'); rc2.width=aiW; rc2.height=aiH;
      rc2.getContext('2d').drawImage(origImg,0,0,aiW,aiH);
      $('proc-st').textContent='Optimizing for AI ('+aiW+'×'+aiH+')…';
      aiFile=await new Promise(function(res){ rc2.toBlob(res,'image/jpeg',0.95); });
    }

    // 3. Load AI engine
    $('proc-st').textContent='Loading AI engine…';
    var fn=S.removeBg||await preloadEngine();
    if(!fn) throw new Error('Could not load AI engine. Check your connection.');

    // 4. Detect acceleration — try GPU, auto-fallback to CPU on any WebGPU error
    var useGpu=!!navigator.gpu;
    var accelLabel=useGpu?'GPU ⚡':'CPU';
    $('proc-st').textContent='Starting AI ('+accelLabel+')…';
    var badge=$('gpu-badge'),lbl=$('gpu-label');
    if(badge&&lbl){ lbl.textContent=useGpu?'WebGPU acceleration active':'Running on CPU'; badge.style.opacity='1'; badge.style.color=useGpu?'var(--teal)':'var(--tx3)'; }

    var progressCb=function(key,cur,tot){
      var p=tot>0?Math.round(cur/tot*100):0;
      $('pb-f').style.width=p+'%'; $('pb-l').textContent=p+'%';
      if(key&&key.indexOf('fetch')>=0) $('proc-st').textContent='Downloading AI model (~40MB, one-time)…';
      else if(key&&key.indexOf('compute')>=0) $('proc-st').textContent='AI analyzing image ('+accelLabel+')…';
    };

    var resultBlob;
    try{
      resultBlob=await fn(aiFile,{
        model:'isnet_fp16', device:'gpu',
        output:{format:'image/png',quality:1.0,type:'foreground'},
        progress:progressCb
      });
    }catch(gpuErr){
      // createBuffer / GPUDevice / session errors = GPU not capable → retry on CPU
      var isGpuIssue=gpuErr&&gpuErr.message&&(
        gpuErr.message.indexOf('createBuffer')>=0||
        gpuErr.message.indexOf('GPUDevice')>=0||
        gpuErr.message.indexOf('session')>=0||
        gpuErr.message.indexOf('WebGPU')>=0||
        gpuErr.message.indexOf('mappedAtCreation')>=0
      );
      if(isGpuIssue){
        accelLabel='CPU';
        if(badge&&lbl){lbl.textContent='GPU unavailable — using CPU';badge.style.color='var(--tx3)';}
        $('proc-st').textContent='GPU unavailable, switching to CPU…';
        $('pb-f').style.width='0%'; $('pb-l').textContent='0%';
        resultBlob=await fn(aiFile,{
          model:'isnet_fp16', device:'cpu',
          output:{format:'image/png',quality:1.0,type:'foreground'},
          progress:progressCb
        });
      } else {
        throw gpuErr;
      }
    }
    $('proc-st').textContent='Refining edges…';

    // 5. Load AI result and scale mask up to original dimensions
    var resURL=URL.createObjectURL(resultBlob);
    var resImg=new Image();
    await new Promise(function(res,rej){ resImg.onload=res; resImg.onerror=rej; resImg.src=resURL; });
    URL.revokeObjectURL(resURL);

    var rc=document.createElement('canvas'); rc.width=S.imgW; rc.height=S.imgH;
    var rctx=rc.getContext('2d',{willReadFrequently:true});
    rctx.drawImage(resImg,0,0,S.imgW,S.imgH); // bilinear upscale if pre-resized
    var rd=rctx.getImageData(0,0,S.imgW,S.imgH).data;
    S.maskData=new Uint8ClampedArray(S.imgW*S.imgH);
    for(var i=0,n=S.imgW*S.imgH;i<n;i++) S.maskData[i]=rd[i*4+3];

    autoCleanup();
    S.aiMaskData=new Uint8ClampedArray(S.maskData);

    $('cc-info').textContent=S.imgW+' × '+S.imgH;
    S.undo=[]; S.redo=[]; S.zoom=1; updateHistory();
    show('s-edit');
    requestAnimationFrame(function(){
      computeBaseScale();
      requestRender();
      zoomFit();
    });
    setTool(null);
    updateMobBar();
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
    else if(k==='p') togglePan();
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
  dispC.addEventListener('touchstart',function(e){
    if(e.touches.length>1) return; // 2+ fingers → pinch handled by cc-area
    e.preventDefault(); onDown(e);
  },{passive:false});
  window.addEventListener('touchmove',function(e){
    if(e.touches.length>1) return; // 2+ fingers → pinch
    if(S.isDrawing||S.panStart){ e.preventDefault(); onWindowMove(e); }
  },{passive:false});
  window.addEventListener('touchend',onUp);
  window.addEventListener('resize', function(){
    if(!S.origData) return;
    computeBaseScale(); applyDisplaySize();
  });
}

/* ---------- CLEAN NOISE (manual button) ---------- */
function doCleanNoise(){
  if(!S.maskData) return;
  pushUndo();
  removeIsolatedNoise();
  requestRender();
}

/* ---------- EXPOSE ---------- */
window.setTool=setTool; window.setBg=setBg; window.doUndo=doUndo; window.doRedo=doRedo;
window.doReset=doReset; window.doDownload=doDownload; window.gotoUpload=gotoUpload;
window.autoRefine=autoRefine; window.zoomIn=zoomIn; window.zoomOut=zoomOut; window.zoomFit=zoomFit;
window.toggleMobileSidebar=toggleMobileSidebar; window.doCleanNoise=doCleanNoise; window.togglePan=togglePan;

/* ---------- INIT ---------- */
function init(){
  dispC=$('disp-c'); dispCtx=dispC.getContext('2d',{willReadFrequently:true});
  ovC=$('ov-c'); ovCtx=ovC.getContext('2d');
  initUpload(); initSliders(); initKeyboard(); initCanvas(); initWheelZoom(); initPinchZoom();
  updateBrushPreview();
  renderLoop();
  show('s-upload');
  preloadEngine();
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
else init();