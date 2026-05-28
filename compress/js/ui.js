/**
 * VeloTools — ui.js
 * Orchestrates UI: loads file, switches panels, triggers processing,
 * renders result, BA slider, filename editor, continue-editing flow.
 * Depends on: state.js, effects.js, converter.js, image-processor.js
 */
(function () {
  'use strict';

  var S = VState;
  var P = VProcessor;
  var E = VEffects;
  var C = VConverter;

  /* ── DOM ───────────────────── */
  function $(id){ return document.getElementById(id); }
  function $$(s){ return document.querySelectorAll(s); }

  /* ── INIT ──────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    // Drag/drop on dz
    var dz = $('v-dz');
    dz.addEventListener('dragover',  function(e){ e.preventDefault(); dz.classList.add('over'); });
    dz.addEventListener('dragleave', function(){ dz.classList.remove('over'); });
    dz.addEventListener('drop',      function(e){ e.preventDefault(); dz.classList.remove('over'); var f=e.dataTransfer.files[0]; if(f) loadFile(f); });

    // Quality
    $('v-qsl').addEventListener('input', function(){
      S.quality = parseInt(this.value);
      updateSlider(this, $('v-qnum'), this.value+'%');
      if (S.origImg) triggerLive();
    });
    updateSlider($('v-qsl'), $('v-qnum'), '80%');

    // Adj sliders
    [['v-ef-br','brightness'],['v-ef-co','contrast'],['v-ef-sa','saturation'],['v-ef-hu','hue'],['v-ef-sh','sharpness'],['v-ef-dn','denoise']].forEach(function(pair){
      var el = $(pair[0]); if(!el) return;
      el.addEventListener('input', function(){
        S[pair[1]] = parseInt(this.value);
        var vEl = $(pair[0]+'-v'); if(vEl) vEl.textContent = this.value+(pair[1]==='hue'?'°':'');
        if(S.origImg && S.activePanel==='effects') triggerLive();
      });
    });

    // Blur amount
    var ba = $('v-blur-amt');
    if(ba) ba.addEventListener('input', function(){
      S.blurAmt=parseInt(this.value);
      $('v-blur-amt-v').textContent=this.value;
      if(S.origImg && S.activePanel==='blur') triggerLive();
    });

    // Resize
    $('v-rw').addEventListener('input', onW);
    $('v-rh').addEventListener('input', onH);

    // Batch init
    if(window.VBatch) VBatch.init();
  });

  /* ── LOAD FILE ─────────────── */
  window.loadFile = function(file){
    if(!file||!file.type.startsWith('image/')) return;
    S.reset();
    S.file=file; S.fileMime=file.type||'image/jpeg';
    syncAdjSliders(); resetRotBtns(); resetEfxBtns();

    var r=new FileReader();
    r.onload=function(e){
      S.origUrl=e.target.result;
      var img=new Image();
      img.onload=function(){
        S.origImg=img; S.origW=img.width; S.origH=img.height;
        S.ar=img.width/img.height; S.targetW=img.width; S.targetH=img.height;
        $('v-rw').value=img.width; $('v-rh').value=img.height;
        $('v-dz').style.display='none';
        $('v-editor').classList.add('on');
        $('v-prev-img').src=S.origUrl;
        setFInfo('v-fi-orig',file.name,file.size,img.width,img.height,file.type,null,null);
        $('v-result').classList.remove('on');
        checkPNG();
        switchPanel('compress',$('v-tb-compress'));
      };
      img.src=e.target.result;
    };
    r.readAsDataURL(file);
  };

  /* ── LIVE PREVIEW ──────────── */
  function triggerLive(){ if(S.origImg) P.livePreview(S.origImg, snap(), $('v-prev-img'), 140); }
  function snap(){
    return {
      quality:S.quality,format:S.format,rotation:S.rotation,
      targetW:S.targetW||S.origW,targetH:S.targetH||S.origH,
      fileMime:S.fileMime,activePanel:S.activePanel,
      blurType:S.blurType,blurAmt:S.blurAmt,
      brightness:S.brightness,contrast:S.contrast,saturation:S.saturation,
      hue:S.hue,sharpness:S.sharpness,denoise:S.denoise
    };
  }

  /* ── PANELS ────────────────── */
  window.switchPanel=function(id,btn){
    ['compress','convert','resize','rotate','effects','blur'].forEach(function(p){
      var pan=$('v-pan-'+p),tb=$('v-tb-'+p);
      if(pan) pan.classList.remove('on');
      if(tb)  tb.classList.remove('on');
    });
    var pan=$('v-pan-'+id); if(pan) pan.classList.add('on');
    if(btn) btn.classList.add('on');
    S.activePanel=id;
    var labels={compress:'⚡ Compress Image',convert:'⚡ Convert Format',resize:'⚡ Resize Image',rotate:'⚡ Apply Rotation',effects:'⚡ Apply Effects',blur:'⚡ Apply Blur'};
    $('v-gobtn').textContent=labels[id]||'⚡ Process';
    checkPNG();
    if(S.origImg) triggerLive();
  };

  /* ── SETTINGS ──────────────── */
  window.setQPreset=function(v){ $('v-qsl').value=v; S.quality=v; updateSlider($('v-qsl'),$('v-qnum'),v+'%'); if(S.origImg) triggerLive(); };
  window.setFmt=function(fmt,btn){ S.format=fmt; $$('.v-fmt').forEach(function(b){b.classList.remove('on');}); btn.classList.add('on'); checkPNG(); if(S.origImg) triggerLive(); };
  window.setRot=function(r,btn){ S.rotation=(S.rotation===r)?null:r; resetRotBtns(); if(S.rotation) btn.classList.add('on'); if(S.origImg) triggerLive(); };
  window.setBlur=function(t,btn){ S.blurType=t; $$('.v-blbtn').forEach(function(b){b.classList.remove('on');}); btn.classList.add('on'); if(S.origImg&&S.activePanel==='blur') triggerLive(); };
  window.applyPreset=function(name,btn){ E.applyPreset(name,S); $$('.v-ebtn').forEach(function(b){b.classList.remove('on');}); btn.classList.add('on'); syncAdjSliders(); if(S.origImg) triggerLive(); };
  window.toggleLock=function(){ S.lockAR=!S.lockAR; var b=$('v-lkbtn'); b.classList.toggle('on',S.lockAR); };
  window.qResize=function(w,h){ S.targetW=w;S.targetH=h;S.lockAR=false;$('v-rw').value=w;$('v-rh').value=h;$('v-lkbtn').classList.remove('on'); };
  window.autoWebP=function(){ S.format='image/webp'; $$('.v-fmt').forEach(function(b){b.classList.remove('on');}); $('v-fmt-webp').classList.add('on'); $('v-warn').classList.remove('on'); switchPanel('convert',$('v-tb-convert')); };

  function onW(){ var w=parseInt($('v-rw').value)||S.origW; S.targetW=w; if(S.lockAR){S.targetH=Math.round(w/S.ar);$('v-rh').value=S.targetH;} else {S.targetH=parseInt($('v-rh').value)||S.origH;} }
  function onH(){ var h=parseInt($('v-rh').value)||S.origH; S.targetH=h; if(S.lockAR){S.targetW=Math.round(h*S.ar);$('v-rw').value=S.targetW;} else {S.targetW=parseInt($('v-rw').value)||S.origW;} }

  /* ── PROCESS ───────────────── */
  window.process=function(){
    if(!S.origImg) return;
    $('v-proc').classList.add('on');
    $('v-gobtn').disabled=true;
    $('v-result').classList.remove('on');
    var pb=$('v-pb'),prog=0;
    var iv=setInterval(function(){prog=Math.min(prog+20,88);pb.style.width=prog+'%';},90);

    P.process(S.origImg,snap()).then(function(res){
      clearInterval(iv); pb.style.width='100%';
      S.resultBlob=res.blob;
      if(S.resultUrl) URL.revokeObjectURL(S.resultUrl);
      S.resultUrl=URL.createObjectURL(res.blob);
      S.resultExt=C.ext(res.mime);
      $('v-res-img').src=S.resultUrl;
      var base=S.file.name.replace(/\.[^.]+$/,'');
      $('v-fnin').value=base+'_velo';
      $('v-fnext').textContent='.'+S.resultExt;
      setFInfo('v-fi-res',base+'_velo.'+S.resultExt,res.blob.size,res.canvas.width,res.canvas.height,res.mime,S.file.size,res.blob.size);
      showCompare(S.file.size,res.blob.size,res.canvas.width,res.canvas.height);
      buildBA(S.origUrl,S.resultUrl);
      $('v-prev-img').src=S.origUrl;
      setTimeout(function(){
        $('v-proc').classList.remove('on');
        pb.style.width='0%';
        $('v-gobtn').disabled=false;
        $('v-result').classList.add('on');
        $('v-result').scrollIntoView({behavior:'smooth',block:'start'});
      },280);
    }).catch(function(err){
      clearInterval(iv);
      $('v-proc').classList.remove('on');
      pb.style.width='0%';
      $('v-gobtn').disabled=false;
      alert('Processing error. Try another image or format.');
      console.error('[VeloTools]',err);
    });
  };

  /* ── DOWNLOAD ──────────────── */
  window.dlFile=function(){
    if(!S.resultBlob) return;
    var nm=($('v-fnin').value||'compressed').trim();
    var ex=$('v-fnext').textContent.replace('.','');
    var a=document.createElement('a'); a.href=S.resultUrl; a.download=nm+'.'+ex; a.click();
  };

  /* ── EDIT RESULT ───────────── */
  window.editResult=function(){
    if(!S.resultUrl||!S.resultBlob) return;
    var nm=($('v-fnin').value||'result')+'.'+S.resultExt;
    S.file=new File([S.resultBlob],nm,{type:S.resultBlob.type});
    S.fileMime=S.resultBlob.type; S.origUrl=S.resultUrl; S.rotation=null;
    var img=new Image();
    img.onload=function(){
      S.origImg=img; S.origW=img.width; S.origH=img.height;
      S.ar=img.width/img.height; S.targetW=img.width; S.targetH=img.height;
      $('v-rw').value=img.width; $('v-rh').value=img.height;
      $('v-prev-img').src=S.origUrl;
      setFInfo('v-fi-orig',S.file.name,S.file.size,img.width,img.height,S.file.type,null,null);
      $('v-result').classList.remove('on'); S.resultBlob=null; S.resultUrl=null;
      checkPNG();
      window.scrollTo({top:$('v-editor').getBoundingClientRect().top+window.scrollY-80,behavior:'smooth'});
    };
    img.src=S.origUrl;
  };

  /* ── NEW FILE ──────────────── */
  window.newFile=function(){
    S.reset(); resetAdjSliders(); resetRotBtns(); resetEfxBtns();
    $('v-editor').classList.remove('on');
    $('v-dz').style.display='';
    $('v-fi').value='';
    $('v-result').classList.remove('on');
    window.scrollTo({top:0,behavior:'smooth'});
  };

  /* ── MODAL ─────────────────── */
  window.openModal=function(which){ var s=which===1?S.resultUrl:S.origUrl; if(!s) return; $('v-modal-img').src=s; $('v-modal').classList.add('open'); document.body.style.overflow='hidden'; };
  window.closeModal=function(){ $('v-modal').classList.remove('open'); document.body.style.overflow=''; };
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') closeModal(); });

  /* ── HELPERS ───────────────── */
  function updateSlider(sl,numEl,text){
    if(numEl) numEl.textContent=text;
    var v=parseInt(sl.value), pct=((v-10)/90)*100;
    sl.style.background='linear-gradient(to right,var(--ac) '+pct+'%,var(--br-2) '+pct+'%)';
  }

  function checkPNG(){
    var warn=$('v-warn'); if(!warn) return;
    var isPNG=S.fileMime==='image/png'&&S.format==='original'&&S.activePanel==='compress';
    warn.classList.toggle('on',isPNG);
    var tip=$('v-png-tip'); if(tip) tip.style.display=isPNG?'inline':'none';
  }

  function setFInfo(elId,name,size,w,h,fmt,origSize,newSize){
    var saved=(origSize&&newSize&&origSize>newSize)?Math.round((1-newSize/origSize)*100):null;
    var noSave=(origSize&&newSize&&saved<=0);
    var fl=(fmt||'').split('/')[1]||'';
    fl=fl.replace('jpeg','JPG').replace('png','PNG').replace('webp','WebP').replace('avif','AVIF').toUpperCase();
    var el=$(elId); if(!el) return;
    el.innerHTML=
      '<span class="v-tag v-tag-lbl">'+(elId.includes('res')?'RESULT':'ORIGINAL')+':</span>'+
      '<span class="v-tag v-tag-nm">'+name+'</span>'+
      '<span class="v-tag v-tag-sz">'+C.fmtBytes(size)+'</span>'+
      '<span class="v-tag v-tag-dm">'+w+'×'+h+'</span>'+
      '<span class="v-tag v-tag-ft">'+fl+'</span>'+
      (saved>0?'<span class="v-tag v-tag-ok">✓ Saved '+saved+'%</span>':'')+
      (noSave?'<span class="v-tag v-tag-wa">⚠ PNG is lossless — use WebP</span>':'');
  }

  function showCompare(orig,res,w,h){
    var saved=Math.max(0,Math.round((1-res/orig)*100));
    var noGain=saved<=0;
    $('v-cmp').innerHTML=
      '<div class="v-crow"><span class="v-clbl">Original</span><div class="v-cbw"><div class="v-cb" style="width:100%;background:var(--br-2)"></div></div><span class="v-cval">'+C.fmtBytes(orig)+'</span></div>'+
      '<div class="v-crow"><span class="v-clbl">Result</span><div class="v-cbw"><div class="v-cb" style="width:'+Math.round(res/orig*100)+'%;background:var(--gn)"></div></div><span class="v-cval">'+C.fmtBytes(res)+'</span></div>'+
      '<div class="v-cres" style="color:'+(noGain?'var(--am)':'var(--gn)')+'">'+
        (noGain?'⚠ PNG is lossless. Use Convert → WebP to reduce file size.':'✓ '+saved+'% smaller — saved '+C.fmtBytes(orig-res))+
      '</div>';
  }

  function buildBA(origSrc,resSrc){
    $('v-ba-wrap').innerHTML=
      '<div class="v-ba-lbl">Before / After — drag the slider</div>'+
      '<div id="vbac" class="v-ba">'+
        '<img id="vba-bg" class="v-ba-bg" src="'+origSrc+'">'+
        '<div id="vba-ol" class="v-ba-ol" style="width:50%"><img src="'+resSrc+'"></div>'+
        '<div id="vba-ln" class="v-ba-ln" style="left:50%"></div>'+
        '<div id="vba-kn" class="v-ba-kn" style="left:50%">'+
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l-6-6 6-6M15 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>'+
        '</div>'+
        '<span class="v-ba-tag" style="left:10px;background:rgba(0,0,0,.6)">ORIGINAL</span>'+
        '<span class="v-ba-tag" style="right:10px;background:rgba(91,108,249,.8)">RESULT</span>'+
      '</div>';
    var c=document.getElementById('vbac'), drag=false;
    function mv(x){ var r=c.getBoundingClientRect(),p=Math.min(100,Math.max(0,((x-r.left)/r.width)*100)); document.getElementById('vba-ol').style.width=p+'%'; document.getElementById('vba-ln').style.left=p+'%'; document.getElementById('vba-kn').style.left=p+'%'; }
    c.addEventListener('mousedown', function(e){drag=true;mv(e.clientX);});
    c.addEventListener('touchstart',function(e){drag=true;mv(e.touches[0].clientX);},{passive:true});
    document.addEventListener('mousemove', function(e){if(drag)mv(e.clientX);});
    document.addEventListener('touchmove', function(e){if(drag)mv(e.touches[0].clientX);},{passive:true});
    document.addEventListener('mouseup',   function(){drag=false;});
    document.addEventListener('touchend',  function(){drag=false;});
  }

  function syncAdjSliders(){
    var map=[['v-ef-br',S.brightness,''],['v-ef-co',S.contrast,''],['v-ef-sa',S.saturation,''],['v-ef-hu',S.hue,'°'],['v-ef-sh',S.sharpness,''],['v-ef-dn',S.denoise,'']];
    map.forEach(function(m){ var el=$(m[0]); if(!el) return; el.value=m[1]; var vEl=$(m[0]+'-v'); if(vEl) vEl.textContent=m[1]+m[2]; });
  }
  function resetAdjSliders(){ S.brightness=100;S.contrast=100;S.saturation=100;S.hue=0;S.sharpness=0;S.denoise=0; syncAdjSliders(); }
  function resetRotBtns(){ $$('.v-rbtn').forEach(function(b){b.classList.remove('on');}); }
  function resetEfxBtns(){ $$('.v-ebtn').forEach(function(b){b.classList.remove('on');}); var n=$('v-efx-none'); if(n) n.classList.add('on'); }

  window.vTf=function(btn){ btn.parentElement.classList.toggle('op'); };
})();
