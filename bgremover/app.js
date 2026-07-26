/* ============================================================
   VeloTools Background Remover — Application Engine v4
   - Stronger AI pass (PNG input, better model/device selection)
   - Smart mask post-process: contrast, holes, speckles, matting
   - Edge decontamination without killing hair/fur detail
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
  panStart:null,
  objDX:0, objDY:0,
  dragObj:null
};

/* ---------- DOM ---------- */
function $(id){ return document.getElementById(id); }
var dispC, dispCtx, ovC, ovCtx;
var workC = document.createElement('canvas');
var workCtx = workC.getContext('2d', { willReadFrequently:true });
var compBuf = null;

/* ---------- AI ENGINE ---------- */
var IMGLY_VER = '1.7.0';
var IMGLY_IMPORTS = [
  'https://esm.sh/@imgly/background-removal@' + IMGLY_VER,
  'https://cdn.jsdelivr.net/npm/@imgly/background-removal@' + IMGLY_VER + '/+esm'
];
var bgEnginePromise = null;

function isMobileDevice(){
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent||'') ||
    (navigator.maxTouchPoints>1 && Math.min(screen.width,screen.height)<900);
}
function pickModel(){
  // fp16 = best reliability/quality balance. Full isnet is huge and often stalls.
  if(isMobileDevice()) return 'isnet_quint8';
  return 'isnet_fp16';
}
function baseAiConfig(extra){
  // Do NOT override publicPath — wrong path hangs model download forever.
  var cfg = {
    proxyToWorker: true,
    model: pickModel(),
    output: { format:'image/png', quality:1, type:'foreground' }
  };
  if(extra){ for(var k in extra) cfg[k]=extra[k]; }
  return cfg;
}
function preloadEngine(){
  if(bgEnginePromise) return bgEnginePromise;
  bgEnginePromise = (async function(){
    var lastErr = null;
    for(var i=0;i<IMGLY_IMPORTS.length;i++){
      try{
        var mod = await import(IMGLY_IMPORTS[i]);
        var fn = mod.removeBackground || mod.default;
        if(typeof fn !== 'function') throw new Error('removeBackground export missing');
        S.removeBg = fn;
        return fn;
      }catch(e){ lastErr = e; console.warn('BG engine import failed', IMGLY_IMPORTS[i], e); }
    }
    bgEnginePromise = null;
    throw lastErr || new Error('Could not load AI engine');
  })();
  return bgEnginePromise;
}

function withTimeout(promise, ms, label){
  return new Promise(function(resolve, reject){
    var done=false;
    var t=setTimeout(function(){
      if(done) return;
      done=true;
      reject(new Error((label||'Operation')+' timed out after '+Math.round(ms/1000)+'s'));
    }, ms);
    promise.then(function(v){
      if(done) return;
      done=true; clearTimeout(t); resolve(v);
    }, function(e){
      if(done) return;
      done=true; clearTimeout(t); reject(e);
    });
  });
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
  // Draw cutout at object offset (Move tool)
  dispCtx.drawImage(workC, Math.round(S.objDX), Math.round(S.objDY));
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

/** Click same tool again → turn it off */
function toggleTool(t){
  if(S.tool===t) setTool(null);
  else setTool(t);
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

/* Display → mask coordinates (accounts for Move offset) */
function toMaskXY(x,y){
  return { x:x - S.objDX, y:y - S.objDY };
}
function maskAlphaAt(mx,my){
  var xi=Math.round(mx), yi=Math.round(my);
  if(xi<0||yi<0||xi>=S.imgW||yi>=S.imgH||!S.maskData) return 0;
  return S.maskData[yi*S.imgW+xi];
}

/* ---------- BRUSH PAINTING ---------- */
function paintAt(x,y){
  if(!S.maskData) return;
  var m=toMaskXY(x,y);
  x=m.x; y=m.y;
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
  var m=toMaskXY(x,y);
  x=m.x; y=m.y;
  var W=S.imgW,H=S.imgH,od=S.origData,md=S.maskData;
  var xi=Math.max(0,Math.min(W-1,Math.round(x)));
  var yi=Math.max(0,Math.min(H-1,Math.round(y)));
  var start=yi*W+xi;
  if(md[start]<10) return; // clicked on already-transparent pixel

  var pi=start*4;
  var sr=od[pi],sg=od[pi+1],sb=od[pi+2];
  var tol=58;
  var maxR=Math.max(48, Math.min(220, S.brushSize*4.5));
  var maxR2=maxR*maxR;

  var visited=new Uint8Array(W*H);
  var queue=new Int32Array(W*H);
  var qHead=0,qTail=0;
  queue[qTail++]=start; visited[start]=1;
  var erased=[];

  while(qHead<qTail){
    var curr=queue[qHead++];
    var cy=Math.floor(curr/W), cx=curr%W;
    var dx0=cx-xi, dy0=cy-yi;
    if(dx0*dx0+dy0*dy0>maxR2) continue;

    var cp=curr*4;
    var dr=od[cp]-sr, dg=od[cp+1]-sg, db=od[cp+2]-sb;
    var dist=Math.sqrt(dr*dr+dg*dg+db*db);
    if(dist>tol) continue;

    if(md[curr]>0){
      var strength=1-(dist/tol);
      var spat=1-Math.sqrt(dx0*dx0+dy0*dy0)/maxR;
      strength*=0.55+0.45*spat;
      erased.push(curr);
      var v=md[curr]-Math.round(strength*255);
      md[curr]=v<0?0:v;
    }

    if(cx>0   &&!visited[curr-1]){ visited[curr-1]=1; queue[qTail++]=curr-1; }
    if(cx<W-1 &&!visited[curr+1]){ visited[curr+1]=1; queue[qTail++]=curr+1; }
    if(cy>0   &&!visited[curr-W]){ visited[curr-W]=1; queue[qTail++]=curr-W; }
    if(cy<H-1 &&!visited[curr+W]){ visited[curr+W]=1; queue[qTail++]=curr+W; }
  }

  var tmp=new Uint8ClampedArray(md);
  for(var i=0;i<erased.length;i++){
    var idx=erased[i];
    var cy2=Math.floor(idx/W), cx2=idx%W;
    if(cx2<1||cx2>W-2||cy2<1||cy2>H-2) continue;
    if(md[idx]>0&&md[idx]<240){
      tmp[idx]=Math.round(
        (md[idx]*4+md[idx-1]+md[idx+1]+md[idx-W]+md[idx+W])/8
      );
    }
  }
  S.maskData=tmp;
}

/* ---------- REFINE ---------- */
/* Each click peels ~2px of fringe inward with a smooth feather. */
function autoRefine(ev){
  if(ev){ ev.preventDefault(); ev.stopPropagation(); }
  endPan();
  S.dragObj=null;
  if(!S.maskData || !S.imgW) return;
  pushUndo();

  var W=S.imgW, H=S.imgH, md=S.maskData;
  var out=new Uint8ClampedArray(md);
  var BG=48;          // treat as background
  var HARD=1.25;      // fully remove within this distance (px)
  var SOFT=2.15;      // feather band ends here (~2px total peel)
  var R=3;

  for(var y=0;y<H;y++){
    for(var x=0;x<W;x++){
      var idx=y*W+x;
      var a=md[idx];
      if(a===0) continue;

      var minD=SOFT+2;
      for(var dy=-R;dy<=R;dy++){
        for(var dx=-R;dx<=R;dx++){
          var d=Math.sqrt(dx*dx+dy*dy);
          if(d>=minD || d>SOFT+0.8) continue;
          var nx=x+dx, ny=y+dy;
          var na=(nx<0||ny<0||nx>=W||ny>=H)?0:md[ny*W+nx];
          if(na<BG){
            // Closer when neighbor is more transparent
            var soft=d+(na/BG)*0.25;
            if(soft<minD) minD=soft;
          }
        }
      }

      if(minD>=SOFT) continue;

      var keep;
      if(minD<=HARD){
        // Outer 1–1.25px: wipe fringe hard (tiny residual for AA)
        keep=Math.max(0, minD/HARD)*0.12;
      } else {
        // 1.25–2.15px: smooth ramp back to full opacity
        var t=(minD-HARD)/(SOFT-HARD);
        t=t*t*(3-2*t);
        keep=0.12+0.88*t;
      }
      out[idx]=Math.max(0, Math.min(255, Math.round(a*keep)));
    }
  }

  // Crush leftover fog in the peeled band
  for(var i=0;i<out.length;i++){
    if(out[i]>0 && out[i]<14) out[i]=0;
  }

  // Edge-only anti-alias
  var final=new Uint8ClampedArray(out);
  for(var y2=1;y2<H-1;y2++){
    for(var x2=1;x2<W-1;x2++){
      var i2=y2*W+x2;
      var av=out[i2];
      if(av===0) continue;
      // Only smooth pixels that actually changed or sit on a transition
      if(out[i2]===md[i2] && av>250){
        var n0=out[i2-1],n1=out[i2+1],n2=out[i2-W],n3=out[i2+W];
        if(n0>250&&n1>250&&n2>250&&n3>250) continue;
      }
      if(av===255){
        var anyLow=out[i2-1]<200||out[i2+1]<200||out[i2-W]<200||out[i2+W]<200;
        if(!anyLow) continue;
      }
      var avg4=(out[i2-1]+out[i2+1]+out[i2-W]+out[i2+W])/4;
      final[i2]=Math.round(av*0.55+avg4*0.45);
    }
  }
  S.maskData=final;

  // Kill color halo left by the peeled fringe
  if(S.origData) decontaminateEdges(S.maskData, W, H, S.origData);

  renderNow();

  // Visible click feedback on the button
  var btn=$('tt-refine');
  if(btn){
    btn.classList.add('act');
    clearTimeout(btn._refineFlash);
    btn._refineFlash=setTimeout(function(){ btn.classList.remove('act'); }, 220);
  }
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

/* ---------- CONNECTED COMPONENTS ---------- */
function labelComponents(md, W, H, thresh){
  var n=W*H;
  var labels=new Int32Array(n);
  var areas=[];
  var maxA=[];
  var touchesBorder=[];
  var label=0;
  var stack=new Int32Array(n);

  for(var i=0;i<n;i++){
    if(labels[i]||md[i]<thresh) continue;
    label++;
    var area=0, peak=0, border=false;
    var sp=0;
    stack[sp++]=i;
    labels[i]=label;
    while(sp){
      var curr=stack[--sp];
      area++;
      if(md[curr]>peak) peak=md[curr];
      var cy=(curr/W)|0, cx=curr%W;
      if(cx===0||cy===0||cx===W-1||cy===H-1) border=true;
      if(cx>0   && !labels[curr-1] && md[curr-1]>=thresh){ labels[curr-1]=label; stack[sp++]=curr-1; }
      if(cx<W-1 && !labels[curr+1] && md[curr+1]>=thresh){ labels[curr+1]=label; stack[sp++]=curr+1; }
      if(cy>0   && !labels[curr-W] && md[curr-W]>=thresh){ labels[curr-W]=label; stack[sp++]=curr-W; }
      if(cy<H-1 && !labels[curr+W] && md[curr+W]>=thresh){ labels[curr+W]=label; stack[sp++]=curr+W; }
    }
    areas[label]=area;
    maxA[label]=peak;
    touchesBorder[label]=border;
  }
  return { labels:labels, areas:areas, maxA:maxA, touchesBorder:touchesBorder, count:label };
}

/* Drop tiny disconnected speckles; keep largest + any sizable secondary subjects */
function removeSmallSpeckles(md, W, H, frac, minPeak){
  if(!md) return;
  W=W||S.imgW; H=H||S.imgH;
  var n=W*H;
  var cc=labelComponents(md, W, H, 18);
  if(cc.count===0) return;

  var minArea=Math.max(64, Math.round(n*(frac||0.0006)));
  var keep=new Uint8Array(cc.count+1);
  var best=1;
  for(var L=1;L<=cc.count;L++){
    if(cc.areas[L]>cc.areas[best]) best=L;
  }
  keep[best]=1;
  for(var L2=1;L2<=cc.count;L2++){
    if(L2===best) continue;
    if(cc.areas[L2] >= minArea && cc.maxA[L2] >= (minPeak||160)) keep[L2]=1;
    else if(cc.areas[L2] >= Math.max(minArea*3, Math.round(n*0.004))) keep[L2]=1;
  }
  for(var i=0;i<n;i++){
    var lab=cc.labels[i];
    if(lab && !keep[lab]) md[i]=0;
  }
}

/* Fill enclosed background holes inside the subject */
function fillInteriorHoles(md, W, H, maxFrac){
  if(!md) return;
  W=W||S.imgW; H=H||S.imgH;
  var n=W*H;
  var inv=new Uint8ClampedArray(n);
  for(var i=0;i<n;i++) inv[i]=md[i]<40?255:0;
  var cc=labelComponents(inv, W, H, 128);
  var maxHole=Math.max(80, Math.round(n*(maxFrac||0.015)));
  for(var L=1;L<=cc.count;L++){
    if(cc.touchesBorder[L]) continue;
    if(cc.areas[L] > maxHole) continue;
    for(var j=0;j<n;j++){
      if(cc.labels[j]===L) md[j]=255;
    }
  }
}

/* Soft contrast on alpha: crush weak bg fog, lock solid subject, keep hair band */
function contrastStretchMask(md){
  if(!md) return;
  for(var i=0;i<md.length;i++){
    var a=md[i];
    if(a<=6){ md[i]=0; continue; }
    if(a>=250){ md[i]=255; continue; }
    var shaped;
    if(a<55){
      shaped=Math.pow(a/55, 1.65)*55;
    } else if(a>210){
      shaped=210+Math.pow((a-210)/45, 0.75)*45;
    } else {
      shaped=55+((a-55)/155)*155;
      var u=(shaped-55)/155;
      shaped=55+(u*u*(3-2*u))*155;
    }
    md[i]=Math.max(0, Math.min(255, Math.round(shaped)));
  }
}

/* Backward-compatible alias used by manual Clean Noise button */
function removeIsolatedNoise(){
  removeSmallSpeckles(S.maskData, S.imgW, S.imgH, 0.0006, 150);
}

/* ---------- AI CLEANUP — smart, fur-preserving ---------- */
function autoCleanup(md, W, H, od){
  md=md||S.maskData;
  W=W||S.imgW; H=H||S.imgH;
  od=od||S.origData;
  if(!md) return;
  contrastStretchMask(md);
  removeSmallSpeckles(md, W, H, 0.0007, 145);
  fillInteriorHoles(md, W, H, 0.012);
  alphaMatteRefine(md, W, H, od);
  edgeOnlyAntiAlias(md, W, H);
  decontaminateEdges(md, W, H, od);
  removeSmallSpeckles(md, W, H, 0.00035, 170);
}

/* Edge-only AA — never blur solid interiors or empty bg */
function edgeOnlyAntiAlias(md, W, H){
  md=md||S.maskData;
  W=W||S.imgW; H=H||S.imgH;
  if(!md) return;
  var tmp=new Uint8ClampedArray(md);
  for(var y=1;y<H-1;y++){
    for(var x=1;x<W-1;x++){
      var idx=y*W+x, cur=md[idx];
      if(cur===0||cur===255) continue;
      var n0=md[idx-1], n1=md[idx+1], n2=md[idx-W], n3=md[idx+W];
      var avg=(n0+n1+n2+n3)/4;
      if(Math.abs(avg-cur)<4) continue;
      var minN=Math.min(n0,n1,n2,n3), maxN=Math.max(n0,n1,n2,n3);
      if(maxN-minN<18 && Math.abs(cur-avg)<12) continue;
      tmp[idx]=Math.round(cur*0.62 + avg*0.38);
    }
  }
  for(var i=0;i<md.length;i++) md[i]=tmp[i];
}

/* Guided local alpha matting on uncertain border band */
function alphaMatteRefine(md, W, H, od){
  md=md||S.maskData;
  W=W||S.imgW; H=H||S.imgH;
  od=od||S.origData;
  if(!md||!od) return;
  var src=new Uint8ClampedArray(md);
  var R=4; // smaller window = much faster, still recovers hair
  for(var y=R;y<H-R;y++){
    for(var x=R;x<W-R;x++){
      var idx=y*W+x, a=src[idx];
      // Only uncertain band — skip solid/empty (big speed win)
      if(a<=12 || a>=243) continue;

      var fr=0,fg=0,fb=0,fn=0, gr=0,gg=0,gb=0,gn=0;
      for(var dy=-R;dy<=R;dy++){
        for(var dx=-R;dx<=R;dx++){
          if(dx*dx+dy*dy>R*R) continue;
          var ni=(y+dy)*W+(x+dx), na=src[ni], np=ni*4;
          if(na>=235){ fr+=od[np]; fg+=od[np+1]; fb+=od[np+2]; fn++; }
          else if(na<=18){ gr+=od[np]; gg+=od[np+1]; gb+=od[np+2]; gn++; }
        }
      }
      if(fn<2||gn<2) continue;
      fr/=fn; fg/=fn; fb/=fn; gr/=gn; gg/=gn; gb/=gn;
      var p=idx*4, pr=od[p],pg=od[p+1],pb=od[p+2];
      var vx=fr-gr, vy=fg-gg, vz=fb-gb;
      var len2=vx*vx+vy*vy+vz*vz;
      if(len2<36) continue;
      var t=((pr-gr)*vx+(pg-gg)*vy+(pb-gb)*vz)/len2;
      t=t<0?0:t>1?1:t;
      var est=Math.round(t*255);
      var conf=Math.min(1, Math.sqrt(len2)/90);
      var blend=0.35 + 0.45*conf;
      var newA=Math.round(a*(1-blend)+est*blend);
      if(est>a) newA=Math.min(255, Math.max(newA, Math.round(a*0.55+est*0.45)));
      md[idx]=Math.max(0, Math.min(255, newA));
    }
  }
}

/* Push fringe RGB toward nearby solid foreground — kills color halo */
function decontaminateEdges(md, W, H, od){
  md=md||S.maskData;
  W=W||S.imgW; H=H||S.imgH;
  od=od||S.origData;
  if(!md||!od) return;
  for(var y=2;y<H-2;y++){
    for(var x=2;x<W-2;x++){
      var idx=y*W+x, a=md[idx];
      if(a<=12 || a>=248) continue;
      var bestA=a, br=0,bgc=0,bb=0, found=false;
      for(var dy=-2;dy<=2;dy++){
        for(var dx=-2;dx<=2;dx++){
          var ni=(y+dy)*W+(x+dx);
          if(md[ni]>bestA+28){
            bestA=md[ni];
            br=od[ni*4]; bgc=od[ni*4+1]; bb=od[ni*4+2];
            found=true;
          }
        }
      }
      if(!found) continue;
      var k=0.72*(1-a/255);
      if(k<0.08) continue;
      var p=idx*4;
      od[p]  =od[p]  +(br-od[p])  *k;
      od[p+1]=od[p+1]+(bgc-od[p+1])*k;
      od[p+2]=od[p+2]+(bb-od[p+2])*k;
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
function doUndo(){
  if(!S.undo.length) return;
  S.redo.push(new Uint8ClampedArray(S.maskData));
  S.maskData=S.undo.pop();
  renderNow();
  updateHistory();
}
function doRedo(){
  if(!S.redo.length) return;
  S.undo.push(new Uint8ClampedArray(S.maskData));
  S.maskData=S.redo.pop();
  renderNow();
  updateHistory();
}
function doReset(){
  if(!S.aiMaskData) return;
  pushUndo();
  S.maskData=new Uint8ClampedArray(S.aiMaskData);
  S.objDX=0; S.objDY=0;
  requestRender();
}
function updateHistory(){
  var u=$('tt-undo'), r=$('tt-redo');
  if(u) u.classList.toggle('disabled', S.undo.length===0);
  if(r) r.classList.toggle('disabled', S.redo.length===0);
  var mu=$('mtt-undo'); if(mu) mu.classList.toggle('disabled',S.undo.length===0);
}

/* ---------- POINTER EVENTS ---------- */
function onDown(e){
  if(!S.origData) return;
  // Space = always viewport pan
  if(S.spaceDown || (S.tool==='pan' && e.altKey)){
    startViewPan(e); e.preventDefault(); return;
  }
  if(S.tool==='pan'){
    startObjDrag(e); e.preventDefault(); return;
  }
  if(!S.tool) return;
  if(S.tool==='magnifier'){ zoomAtClick(e); return; }
  var p=getXY(e);
  if(S.tool==='smart-erase'){ pushUndo(); smartErase(p.x,p.y); requestRender(); return; }
  pushUndo();
  S.isDrawing=true; S.lastX=p.x; S.lastY=p.y;
  paintAt(p.x,p.y); drawCursor(p.sx,p.sy); requestRender();
  e.preventDefault();
}
function onCanvasMove(e){
  if(!S.origData) return;
  if(S.tool==='pan' && !S.spaceDown){
    // Show grab cursor; drag handled on window move
    return;
  }
  if(!S.tool) return;
  if(S.tool==='magnifier'){
    dispC.classList.remove('zoom-in-cur','zoom-out-cur');
    dispC.classList.add(S.altDown?'zoom-out-cur':'zoom-in-cur'); return;
  }
  if(S.isDrawing) return;
  var p=getXY(e); drawCursor(p.sx,p.sy);
}
function onWindowMove(e){
  if(!S.origData) return;
  if(S.panStart){ doViewPan(e); e.preventDefault(); return; }
  if(S.dragObj){ doObjDrag(e); e.preventDefault(); return; }
  if(!S.tool || !S.isDrawing) return;
  var p=getXY(e); drawCursor(p.sx,p.sy);
  interpolate(S.lastX,S.lastY,p.x,p.y);
  S.lastX=p.x; S.lastY=p.y; requestRender();
  e.preventDefault();
}
function onUp(){ S.isDrawing=false; endPan(); S.dragObj=null; }
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

/* ---------- PAN / MOVE TOGGLE ---------- */
function togglePan(){
  if(S.tool==='pan') setTool(null);
  else setTool('pan');
}

/* Viewport pan (Space) */
function startViewPan(e){
  var area=$('cc-area'); area.classList.add('panning');
  var cx=e.touches?e.touches[0].clientX:e.clientX;
  var cy=e.touches?e.touches[0].clientY:e.clientY;
  S.panStart={ x:cx, y:cy, sl:area.scrollLeft, st:area.scrollTop };
  S.dragObj=null;
}
function doViewPan(e){
  if(!S.panStart) return;
  var area=$('cc-area');
  var cx=e.touches?e.touches[0].clientX:e.clientX;
  var cy=e.touches?e.touches[0].clientY:e.clientY;
  area.scrollLeft=S.panStart.sl-(cx-S.panStart.x);
  area.scrollTop =S.panStart.st-(cy-S.panStart.y);
}
function endPan(){ S.panStart=null; var a=$('cc-area'); if(a) a.classList.remove('panning'); }

/* Move cutout object (Pan/Move tool) */
function startObjDrag(e){
  var p=getXY(e);
  var m=toMaskXY(p.x,p.y);
  // Allow drag from subject OR empty — empty still moves if already offset / always move
  // Prefer starting on subject; if miss, still allow drag (user expectation)
  S.dragObj={
    x:p.x, y:p.y,
    dx:S.objDX, dy:S.objDY,
    onSubject: maskAlphaAt(m.x,m.y)>12
  };
  var area=$('cc-area'); if(area) area.classList.add('panning');
}
function doObjDrag(e){
  if(!S.dragObj) return;
  var p=getXY(e);
  S.objDX=S.dragObj.dx+(p.x-S.dragObj.x);
  S.objDY=S.dragObj.dy+(p.y-S.dragObj.y);
  // Soft clamp so object can't fully leave the frame
  var limX=S.imgW*0.85, limY=S.imgH*0.85;
  if(S.objDX>limX) S.objDX=limX;
  if(S.objDX<-limX) S.objDX=-limX;
  if(S.objDY>limY) S.objDY=limY;
  if(S.objDY<-limY) S.objDY=-limY;
  requestRender();
}

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
  ctx.drawImage(tc, Math.round(S.objDX), Math.round(S.objDY));
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
function gotoUpload(){
  show('s-upload'); $('file-input').value='';
  S.undo=[]; S.redo=[]; S.origData=null; S.maskData=null;
  S.objDX=0; S.objDY=0; S.dragObj=null; endPan();
  var b=$('gpu-badge'); if(b) b.style.opacity='0';
}

/* ---------- PROCESS FILE ---------- */
function extractAlpha(rgba, w, h){
  var md=new Uint8ClampedArray(w*h);
  for(var i=0;i<w*h;i++) md[i]=rgba[i*4+3];
  return md;
}

function upscaleMask(md, srcW, srcH, dstW, dstH){
  if(srcW===dstW && srcH===dstH) return new Uint8ClampedArray(md);
  var src=document.createElement('canvas'); src.width=srcW; src.height=srcH;
  var sctx=src.getContext('2d',{willReadFrequently:true});
  var img=sctx.createImageData(srcW, srcH);
  for(var i=0;i<srcW*srcH;i++){
    var j=i*4; img.data[j]=255; img.data[j+1]=255; img.data[j+2]=255; img.data[j+3]=md[i];
  }
  sctx.putImageData(img,0,0);
  var dst=document.createElement('canvas'); dst.width=dstW; dst.height=dstH;
  var dctx=dst.getContext('2d',{willReadFrequently:true});
  dctx.imageSmoothingEnabled=true;
  if(dctx.imageSmoothingQuality) dctx.imageSmoothingQuality='high';
  dctx.clearRect(0,0,dstW,dstH);
  dctx.drawImage(src,0,0,dstW,dstH);
  return extractAlpha(dctx.getImageData(0,0,dstW,dstH).data, dstW, dstH);
}

function enterEditor(modelName){
  $('cc-info').textContent=S.imgW+' × '+S.imgH+(modelName?' · '+modelName:'');
  S.undo=[]; S.redo=[]; S.zoom=1; S.objDX=0; S.objDY=0; S.dragObj=null;
  updateHistory();
  show('s-edit');
  // Default to Move so user can drag the cutout immediately
  setTool('pan');
  updateMobBar();
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      computeBaseScale();
      renderNow();
      zoomFit();
      requestRender();
    });
  });
}

async function processFile(file){
  if(!file) return;
  show('s-proc');
  $('pb-f').style.width='0%'; $('pb-l').textContent='0%';
  $('proc-st').textContent='Loading image…';

  try{
    var origURL=URL.createObjectURL(file);
    var origImg=new Image();
    await new Promise(function(res,rej){ origImg.onload=res; origImg.onerror=rej; origImg.src=origURL; });
    URL.revokeObjectURL(origURL);
    S.imgW=origImg.naturalWidth; S.imgH=origImg.naturalHeight;
    if(!S.imgW||!S.imgH) throw new Error('Could not read image dimensions.');

    var sc=document.createElement('canvas'); sc.width=S.imgW; sc.height=S.imgH;
    var sctx=sc.getContext('2d',{willReadFrequently:true}); sctx.drawImage(origImg,0,0);
    S.origData=sctx.getImageData(0,0,S.imgW,S.imgH).data;

    // Cap AI input — PNG keeps edges; smaller = faster & stable
    var mobile=isMobileDevice();
    var MAX_AI=mobile?1280:1600;
    var aiW=S.imgW, aiH=S.imgH;
    if(S.imgW>MAX_AI||S.imgH>MAX_AI){
      var ratio=Math.min(MAX_AI/S.imgW,MAX_AI/S.imgH);
      aiW=Math.round(S.imgW*ratio); aiH=Math.round(S.imgH*ratio);
    }

    var aiCanvas=document.createElement('canvas'); aiCanvas.width=aiW; aiCanvas.height=aiH;
    var aiCtx=aiCanvas.getContext('2d',{willReadFrequently:true});
    aiCtx.imageSmoothingEnabled=true;
    if(aiCtx.imageSmoothingQuality) aiCtx.imageSmoothingQuality='high';
    aiCtx.drawImage(origImg,0,0,aiW,aiH);
    var aiOrigRGBA=aiCtx.getImageData(0,0,aiW,aiH).data;

    $('proc-st').textContent='Preparing AI input ('+aiW+'×'+aiH+')…';
    var aiFile=await new Promise(function(res,rej){
      aiCanvas.toBlob(function(b){ if(b) res(b); else rej(new Error('Failed to encode AI input')); }, 'image/png');
    });

    $('proc-st').textContent='Loading AI engine…';
    var fn=S.removeBg;
    try{ if(!fn) fn=await withTimeout(preloadEngine(), 60000, 'AI engine download'); }
    catch(loadErr){ throw new Error('Could not load AI engine. Check your connection and try again.'); }
    if(!fn) throw new Error('Could not load AI engine. Check your connection.');

    var modelName=pickModel();
    var preferGpu=!!navigator.gpu && !mobile;
    var accelLabel=preferGpu?'GPU ⚡':'CPU';
    $('proc-st').textContent='Starting AI ('+accelLabel+', '+modelName+')…';
    var badge=$('gpu-badge'),lbl=$('gpu-label');
    if(badge&&lbl){
      lbl.textContent=preferGpu?'WebGPU acceleration active':'Running on CPU';
      badge.style.opacity='1';
      badge.style.color=preferGpu?'var(--teal)':'var(--tx3)';
    }

    var progressCb=function(key,cur,tot){
      var p=tot>0?Math.round(cur/tot*100):0;
      $('pb-f').style.width=p+'%'; $('pb-l').textContent=p+'%';
      if(key&&String(key).indexOf('fetch')>=0) $('proc-st').textContent='Downloading AI model (one-time)…';
      else if(key&&String(key).indexOf('compute')>=0) $('proc-st').textContent='AI analyzing image ('+accelLabel+')…';
      else if(key) $('proc-st').textContent='Processing…';
    };

    async function runAi(device, model){
      return withTimeout(fn(aiFile, baseAiConfig({
        device: device,
        model: model,
        progress: progressCb
      })), 180000, 'AI background removal');
    }

    var resultBlob;
    async function runWithFallback(device){
      try{
        return await runAi(device, modelName);
      }catch(modelErr){
        if(modelName==='isnet_fp16'){
          console.warn('isnet_fp16 failed, trying isnet_quint8', modelErr);
          modelName='isnet_quint8';
          $('proc-st').textContent='Retrying with lighter model…';
          return await runAi(device, modelName);
        }
        throw modelErr;
      }
    }

    if(preferGpu){
      try{
        resultBlob=await runWithFallback('gpu');
      }catch(gpuErr){
        console.warn('GPU path failed, falling back to CPU', gpuErr);
        accelLabel='CPU';
        if(badge&&lbl){ lbl.textContent='GPU unavailable — using CPU'; badge.style.color='var(--tx3)'; }
        $('proc-st').textContent='GPU unavailable, switching to CPU…';
        $('pb-f').style.width='0%'; $('pb-l').textContent='0%';
        resultBlob=await runWithFallback('cpu');
      }
    } else {
      resultBlob=await runWithFallback('cpu');
    }

    if(!resultBlob) throw new Error('AI returned empty result.');

    $('proc-st').textContent='Refining cutout…';
    $('pb-f').style.width='92%'; $('pb-l').textContent='92%';

    var resURL=URL.createObjectURL(resultBlob);
    var resImg=new Image();
    await new Promise(function(res,rej){ resImg.onload=res; resImg.onerror=rej; resImg.src=resURL; });
    URL.revokeObjectURL(resURL);

    // Work at AI resolution first (fast), then upscale mask
    var rw=resImg.naturalWidth||aiW, rh=resImg.naturalHeight||aiH;
    var rc=document.createElement('canvas'); rc.width=rw; rc.height=rh;
    var rctx=rc.getContext('2d',{willReadFrequently:true});
    rctx.drawImage(resImg,0,0);
    var aiMask=extractAlpha(rctx.getImageData(0,0,rw,rh).data, rw, rh);

    // If AI returned different size, align color buffer
    var colorRGBA=aiOrigRGBA;
    if(rw!==aiW||rh!==aiH){
      var c2=document.createElement('canvas'); c2.width=rw; c2.height=rh;
      var c2x=c2.getContext('2d',{willReadFrequently:true});
      c2x.drawImage(origImg,0,0,rw,rh);
      colorRGBA=c2x.getImageData(0,0,rw,rh).data;
    }

    autoCleanup(aiMask, rw, rh, colorRGBA);

    S.maskData=upscaleMask(aiMask, rw, rh, S.imgW, S.imgH);
    // Light full-res defringe only (mask already cleaned)
    decontaminateEdges(S.maskData, S.imgW, S.imgH, S.origData);
    S.aiMaskData=new Uint8ClampedArray(S.maskData);

    // Sanity: empty mask → show error instead of blank canvas
    var nonzero=0;
    for(var zi=0;zi<S.maskData.length;zi+=64){ if(S.maskData[zi]>8){ nonzero++; if(nonzero>20) break; } }
    if(nonzero===0) throw new Error('AI produced an empty cutout. Try another photo or a clearer subject.');

    $('pb-f').style.width='100%'; $('pb-l').textContent='100%';
    enterEditor(modelName);
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
    var inField=(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.isContentEditable);
    if(e.key==='Alt'){ S.altDown=true; updateZoomCursor(); }

    // Ctrl/Cmd+Z = Undo, Ctrl/Cmd+Y = Redo (also Ctrl+Shift+Z)
    // Use capture + e.code so browser chrome / focused buttons don't steal it
    var mod=e.ctrlKey||e.metaKey;
    if(mod && !inField){
      var code=e.code||'';
      var k=(e.key||'').toLowerCase();
      if((code==='KeyZ'||k==='z') && !e.shiftKey){
        e.preventDefault(); e.stopPropagation();
        doUndo();
        return;
      }
      if(code==='KeyY'||k==='y'||((code==='KeyZ'||k==='z')&&e.shiftKey)){
        e.preventDefault(); e.stopPropagation();
        doRedo();
        return;
      }
    }

    if((e.code==='Space'||e.key===' ') && !inField){
      e.preventDefault();
      if(!S.spaceDown){
        S.spaceDown=true;
        var area=$('cc-area');
        if(area) area.classList.add('tool-pan');
      }
      return;
    }
    if(inField) return;
    if(e.ctrlKey||e.metaKey) return;
    var key=e.key.toLowerCase();
    if(key==='e') setTool('erase-hard');
    else if(key==='r') setTool('restore-hard');
    else if(key==='z') setTool('magnifier');
    else if(key==='s') toggleTool('smart-erase');
    else if(key==='b') setTool('erase-soft');
    else if(key==='p') togglePan();
    else if(key==='='||key==='+'){ e.preventDefault(); zoomIn(); }
    else if(key==='-'){ e.preventDefault(); zoomOut(); }
    else if(key==='0'){ e.preventDefault(); zoomFit(); }
    else if(key==='['){ S.brushSize=Math.max(2,S.brushSize-5); $('sl-size').value=S.brushSize; $('sv-size').textContent=S.brushSize; updateBrushPreview(); }
    else if(key===']'){ S.brushSize=Math.min(120,S.brushSize+5); $('sl-size').value=S.brushSize; $('sv-size').textContent=S.brushSize; updateBrushPreview(); }
  }, true);
  document.addEventListener('keyup', function(e){
    if(e.key==='Alt'){ S.altDown=false; updateZoomCursor(); }
    if(e.code==='Space'||e.key===' '){
      e.preventDefault(); S.spaceDown=false; endPan();
      var area=$('cc-area');
      if(area && S.tool!=='pan') area.classList.remove('tool-pan');
    }
  }, true);
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
window.setTool=setTool; window.toggleTool=toggleTool; window.setBg=setBg; window.doUndo=doUndo; window.doRedo=doRedo;
window.doReset=doReset; window.doDownload=doDownload; window.gotoUpload=gotoUpload;
window.autoRefine=autoRefine; window.zoomIn=zoomIn; window.zoomOut=zoomOut; window.zoomFit=zoomFit;
window.toggleMobileSidebar=toggleMobileSidebar; window.doCleanNoise=doCleanNoise; window.togglePan=togglePan;

/* ---------- INIT ---------- */
function init(){
  dispC=$('disp-c'); dispCtx=dispC.getContext('2d',{willReadFrequently:true});
  ovC=$('ov-c'); ovCtx=ovC.getContext('2d');
  initUpload(); initSliders(); initKeyboard(); initCanvas(); initWheelZoom(); initPinchZoom();
  var refineBtn=$('tt-refine');
  if(refineBtn){
    // pointerdown so it always fires even while Move tool is capturing mouse intent
    refineBtn.addEventListener('pointerdown', function(e){
      e.preventDefault(); e.stopPropagation();
      autoRefine(e);
    });
  }
  updateBrushPreview();
  renderLoop();
  show('s-upload');
  preloadEngine();
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
else init();