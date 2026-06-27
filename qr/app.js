/* ============================================================
   VeloTools QR Code Generator — app.js
   Professional, optimized, zero dependencies beyond qr-code-styling
   ============================================================ */
'use strict';

/* ---------- STATE ---------- */
var Q = {
  type:       'url',
  dotStyle:   'square',
  cornerStyle:'square',
  fgColor:    '#000000',
  fgColor2:   '#7C3480',
  bgColor:    '#ffffff',
  bgTransparent: false,
  gradient:   false,
  gradType:   'linear',
  gradAngle:  0,
  logoData:   null,
  logoSize:   0.25,
  logoMargin: 5,
  qrSize:     300,
  margin:     16,
  ecLevel:    'H',
  qrInstance: null,
  debounceTimer: null
};

/* ---------- PRESETS ---------- */
var PRESETS = [
  { dot:'square',  corner:'square', fg:'#000000', fg2:null,     bg:'#ffffff', grad:false, name:'Classic' },
  { dot:'square',  corner:'square', fg:'#ffffff', fg2:null,     bg:'#1a1a2e', grad:false, name:'Dark'    },
  { dot:'rounded', corner:'extra-rounded', fg:'#7C3480', fg2:'#C87AFF', bg:'#ffffff', grad:true,  gradType:'linear', gradAngle:135, name:'Violet'  },
  { dot:'dots',    corner:'extra-rounded', fg:'#0F4C81', fg2:'#00BFFF', bg:'#ffffff', grad:true,  gradType:'linear', gradAngle:135, name:'Ocean'   },
  { dot:'classy-rounded', corner:'extra-rounded', fg:'#FF6B35', fg2:'#F7C948', bg:'#ffffff', grad:true, gradType:'linear', gradAngle:135, name:'Sunset' },
  { dot:'rounded', corner:'dot',   fg:'#1B5E20', fg2:'#66BB6A', bg:'#ffffff', grad:true,  gradType:'linear', gradAngle:135, name:'Forest'  }
];

/* ---------- DOM HELPERS ---------- */
function $(id){ return document.getElementById(id); }

/* ---------- INIT ---------- */
function init(){
  bindTypeTabs();
  bindStyleButtons();
  bindSliders();
  bindColorPickers();
  bindSegButtons();
  bindInputs();
  createQR();
}

/* ---------- TYPE TABS ---------- */
function bindTypeTabs(){
  $('type-tabs').querySelectorAll('.type-tab').forEach(function(btn){
    btn.addEventListener('click', function(){
      $('type-tabs').querySelectorAll('.type-tab').forEach(function(b){ b.classList.remove('act'); });
      btn.classList.add('act');
      Q.type = btn.dataset.type;
      showForm(Q.type);
      scheduleUpdate();
    });
  });
}

function showForm(type){
  ['url','text','wifi','vcard','email','phone','sms','location','event','crypto','zoom','app'].forEach(function(t){
    var el = $('form-'+t);
    if(el) el.style.display = (t===type) ? '' : 'none';
  });
  // focus first input in the active form
  var form = $('form-'+type);
  if(form){
    var first = form.querySelector('input, textarea');
    if(first) setTimeout(function(){ first.focus(); }, 50);
  }
}

/* ---------- BIND ALL INPUT FIELDS ---------- */
function bindInputs(){
  var ids = [
    'f-url','f-text','f-wifi-ssid','f-wifi-pass','f-wifi-hidden',
    'f-vc-first','f-vc-last','f-vc-org','f-vc-title','f-vc-phone','f-vc-email','f-vc-url','f-vc-addr',
    'f-email-to','f-email-subj','f-email-body',
    'f-phone','f-sms-phone','f-sms-msg','f-lat','f-lng',
    // Event (were missing — QR would not update on typing)
    'f-ev-title','f-ev-start','f-ev-end','f-ev-loc','f-ev-desc',
    // Crypto (were missing)
    'f-crypto-addr','f-crypto-amount','f-crypto-label',
    // Meeting / Zoom (were missing)
    'f-zoom-url','f-zoom-id','f-zoom-pass',
    // App (was missing)
    'f-app-url'
  ];
  ids.forEach(function(id){
    var el = $(id);
    if(!el) return;
    el.addEventListener('input', scheduleUpdate);
    el.addEventListener('change', scheduleUpdate);
  });
  // char counter for text area
  var ta = $('f-text');
  if(ta){
    ta.addEventListener('input', function(){
      var n = ta.value.length;
      $('char-count').textContent = n;
      $('char-count').style.color = n > 1800 ? '#ff7c95' : '';
    });
  }
}

/* ---------- DEBOUNCED UPDATE ---------- */
function scheduleUpdate(){
  clearTimeout(Q.debounceTimer);
  Q.debounceTimer = setTimeout(updateQR, 120);
}

/* ---------- BUILD QR DATA STRING ---------- */
function buildData(){
  switch(Q.type){
    case 'url': {
      var url = $('f-url').value.trim();
      if(!url) return '';
      // auto-prepend https if missing
      if(!/^https?:\/\//i.test(url) && url.indexOf('.') !== -1) url = 'https://'+url;
      return url;
    }
    case 'text':
      return $('f-text').value;
    case 'wifi': {
      var ssid = $('f-wifi-ssid').value.trim();
      if(!ssid) return '';
      var pass = $('f-wifi-pass').value;
      var sec  = getSegValue('wifi-security');
      var hidden = $('f-wifi-hidden').checked ? 'true' : 'false';
      if(sec === 'nopass') return 'WIFI:T:nopass;S:'+escapeWifi(ssid)+';;';
      return 'WIFI:T:'+sec+';S:'+escapeWifi(ssid)+';P:'+escapeWifi(pass)+';H:'+hidden+';;';
    }
    case 'vcard': {
      var first = $('f-vc-first').value.trim();
      var last  = $('f-vc-last').value.trim();
      if(!first && !last) return '';
      var lines = ['BEGIN:VCARD','VERSION:3.0'];
      lines.push('N:'+last+';'+first+';;;');
      lines.push('FN:'+[first,last].filter(Boolean).join(' '));
      if($('f-vc-org').value.trim())   lines.push('ORG:'+$('f-vc-org').value.trim());
      if($('f-vc-title').value.trim()) lines.push('TITLE:'+$('f-vc-title').value.trim());
      if($('f-vc-phone').value.trim()) lines.push('TEL:'+$('f-vc-phone').value.trim());
      if($('f-vc-email').value.trim()) lines.push('EMAIL:'+$('f-vc-email').value.trim());
      if($('f-vc-url').value.trim())   lines.push('URL:'+$('f-vc-url').value.trim());
      if($('f-vc-addr').value.trim())  lines.push('ADR:;;'+$('f-vc-addr').value.trim()+';;;;');
      lines.push('END:VCARD');
      return lines.join('\n');
    }
    case 'email': {
      var to = $('f-email-to').value.trim();
      if(!to) return '';
      var parts = [];
      if($('f-email-subj').value.trim()) parts.push('subject='+encodeURIComponent($('f-email-subj').value.trim()));
      if($('f-email-body').value.trim()) parts.push('body='+encodeURIComponent($('f-email-body').value.trim()));
      return 'mailto:'+to+(parts.length?'?'+parts.join('&'):'');
    }
    case 'phone': {
      var num = $('f-phone').value.trim().replace(/\s/g,'');
      return num ? 'tel:'+num : '';
    }
    case 'sms': {
      var num = $('f-sms-phone').value.trim().replace(/\s/g,'');
      if(!num) return '';
      var msg = $('f-sms-msg').value.trim();
      return 'sms:'+num+(msg?'?body='+encodeURIComponent(msg):'');
    }
    case 'location': {
      var lat = parseFloat($('f-lat').value);
      var lng = parseFloat($('f-lng').value);
      if(isNaN(lat)||isNaN(lng)) return '';
      return 'geo:'+lat.toFixed(6)+','+lng.toFixed(6);
    }
    case 'event': {
      var title = $('f-ev-title').value.trim();
      var start = $('f-ev-start').value;
      if(!title || !start) return '';
      var end = $('f-ev-end').value || start;
      var lines = ['BEGIN:VEVENT'];
      lines.push('SUMMARY:'+title);
      lines.push('DTSTART:'+toICSDate(start));
      lines.push('DTEND:'+toICSDate(end));
      if($('f-ev-loc').value.trim())  lines.push('LOCATION:'+$('f-ev-loc').value.trim());
      if($('f-ev-desc').value.trim()) lines.push('DESCRIPTION:'+$('f-ev-desc').value.trim().replace(/\n/g,'\\n'));
      lines.push('END:VEVENT');
      return lines.join('\n');
    }
    case 'crypto': {
      var addr = $('f-crypto-addr').value.trim();
      if(!addr) return '';
      var coin = getSegValue('crypto-coin') || 'bitcoin';
      var scheme = { bitcoin:'bitcoin', ethereum:'ethereum', litecoin:'litecoin' }[coin];
      var params = [];
      var amount = $('f-crypto-amount').value.trim();
      var label  = $('f-crypto-label').value.trim();
      if(amount) params.push('amount='+amount);
      if(label)  params.push('label='+encodeURIComponent(label));
      return scheme+':'+addr+(params.length?'?'+params.join('&'):'');
    }
    case 'zoom': {
      var zurl = $('f-zoom-url').value.trim();
      if(!zurl) return '';
      var extra = [];
      if($('f-zoom-id').value.trim())   extra.push('ID: '+$('f-zoom-id').value.trim());
      if($('f-zoom-pass').value.trim()) extra.push('Passcode: '+$('f-zoom-pass').value.trim());
      return zurl; // extra info shown to user but not encoded — QR stays a clean clickable link
    }
    case 'app': {
      var aurl = $('f-app-url').value.trim();
      return aurl;
    }
  }
  return '';
}

function toICSDate(localDateTime){
  // "2026-06-13T10:30" -> "20260613T103000"
  return localDateTime.replace(/[-:]/g,'').slice(0,15)+'00';
}

function escapeWifi(str){
  // escape special chars for WIFI QR format
  return str.replace(/[\\"';,:]/g, function(c){ return '\\'+c; });
}

function getEffectiveData(){
  return buildData() || 'https://velotools.app';
}

/* ---------- CREATE QR (first time) ---------- */
function createQR(){
  var data = getEffectiveData();
  updateDataDisplay(buildData(), data);

  var opts = buildQROptions(data);
  Q.qrInstance = new QRCodeStyling(opts);

  var wrap = $('qr-canvas-wrap');
  wrap.innerHTML = '';
  Q.qrInstance.append(wrap);
  $('preview-placeholder').style.display = 'none';
}

/* ---------- UPDATE QR ---------- */
function updateQR(){
  var raw = buildData();
  var data = raw || 'https://velotools.app';
  updateDataDisplay(raw, data);

  if(!Q.qrInstance){
    createQR();
    return;
  }
  Q.qrInstance.update(buildQROptions(data));
  $('preview-placeholder').style.display = 'none';
}

function updateDataDisplay(raw, effective){
  effective = effective || raw || getEffectiveData();
  if(!raw){
    $('qr-data-row').style.display='none';
  } else {
    $('qr-data-row').style.display = '';
    var val = raw.length > 55 ? raw.slice(0,52)+'…' : raw;
    $('qr-data-val').textContent = val;
    var lenEl=$('qr-data-len');
    if(lenEl) lenEl.textContent = raw.length+' chars';
  }
  updateScanQuality(effective.length, !raw);
}

function updateScanQuality(len, isPreview){
  var badge=$('sq-badge'), dot=$('sq-dot'), lbl=$('sq-label');
  if(!badge||!dot||!lbl) return;
  var quality, color;
  if(len<=100){     quality='Excellent'; color='#3dbfa8'; }
  else if(len<=250){ quality='Good';      color='#5badd4'; }
  else if(len<=500){ quality='Fair';      color='#e4c951'; }
  else{              quality='Complex';   color='#e07070'; }
  dot.style.background=color;
  dot.style.boxShadow='0 0 8px '+color;
  lbl.textContent=quality+(isPreview?' (demo)':'');
  lbl.style.color=color;
}

function copyQRData(){
  var val=$('qr-data-val'); if(!val) return;
  var btn=$('qr-copy-btn');
  // get full data (not truncated)
  var data=buildData()||'';
  if(!data) return;
  navigator.clipboard.writeText(data).then(function(){
    if(btn){ btn.classList.add('copied'); setTimeout(function(){ btn.classList.remove('copied'); },1800); }
  }).catch(function(){
    // fallback
    var ta=document.createElement('textarea');
    ta.value=data; ta.style.position='fixed'; ta.style.opacity='0';
    document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
    if(btn){ btn.classList.add('copied'); setTimeout(function(){ btn.classList.remove('copied'); },1800); }
  });
}

/* ---------- BUILD OPTIONS OBJECT ---------- */
function buildQROptions(data){
  var opts = {
    width:  Q.qrSize,
    height: Q.qrSize,
    type:   'svg',
    data:   data || 'https://velotools.app',
    margin: Q.margin,
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: Q.ecLevel
    },
    dotsOptions: buildDotOptions(),
    cornersSquareOptions: { color: Q.fgColor, type: Q.cornerStyle },
    cornersDotOptions:    { color: Q.fgColor, type: Q.cornerStyle === 'dot' ? 'dot' : 'square' },
    backgroundOptions:    Q.bgTransparent ? { color: 'transparent' } : { color: Q.bgColor },
  };

  if(Q.logoData){
    opts.image = Q.logoData;
    opts.imageOptions = {
      hideBackgroundDots: true,
      imageSize: Q.logoSize,
      margin: Q.logoMargin,
      crossOrigin: 'anonymous'
    };
  }
  return opts;
}

function buildDotOptions(){
  if(Q.gradient){
    var rotation = Q.gradType === 'linear' ? Q.gradAngle * Math.PI / 180 : 0;
    return {
      type: Q.dotStyle,
      gradient: {
        type: Q.gradType,
        rotation: rotation,
        colorStops: [
          { offset:0, color: Q.fgColor  },
          { offset:1, color: Q.fgColor2 }
        ]
      }
    };
  }
  return { color: Q.fgColor, type: Q.dotStyle };
}

/* ---------- STYLE BUTTONS ---------- */
function bindStyleButtons(){
  // Dot styles
  $('dot-styles').querySelectorAll('.ds').forEach(function(btn){
    btn.addEventListener('click', function(){
      $('dot-styles').querySelectorAll('.ds').forEach(function(b){ b.classList.remove('act'); });
      btn.classList.add('act');
      Q.dotStyle = btn.dataset.dot;
      updatePresetHighlight(-1);
      scheduleUpdate();
    });
  });
  // Corner styles
  $('corner-styles').querySelectorAll('.cs').forEach(function(btn){
    btn.addEventListener('click', function(){
      $('corner-styles').querySelectorAll('.cs').forEach(function(b){ b.classList.remove('act'); });
      btn.classList.add('act');
      Q.cornerStyle = btn.dataset.corner;
      scheduleUpdate();
    });
  });
}

/* ---------- SEGMENT BUTTONS (reusable) ---------- */
function bindSegButtons(){
  document.querySelectorAll('.seg').forEach(function(seg){
    seg.querySelectorAll('.seg-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        seg.querySelectorAll('.seg-btn').forEach(function(b){ b.classList.remove('act'); });
        btn.classList.add('act');
        var segId = seg.id;
        if(segId === 'ec-level'){
          Q.ecLevel = btn.dataset.val;
          updateEcBadge();
        } else if(segId === 'grad-type'){
          Q.gradType = btn.dataset.val;
          $('grad-angle-row').style.display = Q.gradType === 'linear' ? '' : 'none';
        }
        scheduleUpdate();
      });
    });
  });
}

function getSegValue(segId){
  var active = $(segId).querySelector('.seg-btn.act');
  return active ? active.dataset.val : null;
}

function updateEcBadge(){
  var labels = { L:'7%', M:'15%', Q:'25%', H:'30%' };
  $('ec-label').textContent = 'Error correction: '+Q.ecLevel+' ('+labels[Q.ecLevel]+')';
}

/* ---------- SLIDERS ---------- */
function bindSliders(){
  [
    ['sl-size',       'sv-size',       function(v){ Q.qrSize=+v; }],
    ['sl-margin',     'sv-margin',     function(v){ Q.margin=+v; }],
    ['sl-grad-angle', 'sv-grad-angle', function(v){ Q.gradAngle=+v; }, '°'],
    ['sl-logo-size',  'sv-logo-size',  function(v){ Q.logoSize=+v/100; }, '%'],
    ['sl-logo-margin','sv-logo-margin',function(v){ Q.logoMargin=+v; }]
  ].forEach(function(item){
    var el = $(item[0]); if(!el) return;
    el.addEventListener('input', function(){
      var v = this.value;
      $(item[1]).textContent = v+(item[3]||'');
      item[2](v);
      scheduleUpdate();
    });
  });
}

/* ---------- COLOR PICKERS ---------- */
function bindColorPickers(){
  $('col-fg').addEventListener('input', function(){
    Q.fgColor = this.value;
    updatePresetHighlight(-1);
    scheduleUpdate();
  });
  $('col-fg2').addEventListener('input', function(){
    Q.fgColor2 = this.value;
    scheduleUpdate();
  });
  $('col-bg').addEventListener('input', function(){
    Q.bgColor = this.value;
    scheduleUpdate();
  });
}

/* ---------- GRADIENT TOGGLE ---------- */
// eslint-disable-next-line no-unused-vars
function toggleGradient(){
  Q.gradient = $('grad-toggle').checked;
  $('grad-col2-wrap').style.display = Q.gradient ? '' : 'none';
  $('grad-opts').style.display      = Q.gradient ? '' : 'none';
  scheduleUpdate();
}

/* ---------- BG TRANSPARENT TOGGLE ---------- */
// eslint-disable-next-line no-unused-vars
function toggleBgTransparent(){
  Q.bgTransparent = $('bg-transparent').checked;
  $('bg-col-wrap').style.opacity = Q.bgTransparent ? '0.35' : '1';
  scheduleUpdate();
}

/* ---------- LOGO ---------- */
// eslint-disable-next-line no-unused-vars
function onLogoUpload(input){
  var file = input.files[0];
  if(!file) return;
  var reader = new FileReader();
  reader.onload = function(e){
    Q.logoData = e.target.result;
    $('logo-label').textContent = file.name;
    $('logo-controls').style.display = '';
    $('logo-area').classList.add('has-logo');
    // force H correction when logo added
    setEcLevel('H');
    scheduleUpdate();
  };
  reader.readAsDataURL(file);
}
// eslint-disable-next-line no-unused-vars
function removeLogo(){
  Q.logoData = null;
  $('logo-file').value = '';
  $('logo-label').textContent = 'Click to upload logo';
  $('logo-controls').style.display = 'none';
  $('logo-area').classList.remove('has-logo');
  scheduleUpdate();
}
function setEcLevel(level){
  Q.ecLevel = level;
  $('ec-level').querySelectorAll('.seg-btn').forEach(function(b){ b.classList.remove('act'); });
  var target = $('ec-level').querySelector('[data-val="'+level+'"]');
  if(target) target.classList.add('act');
  updateEcBadge();
}

/* ---------- PRESETS ---------- */
// eslint-disable-next-line no-unused-vars
function applyPreset(idx){
  var p = PRESETS[idx]; if(!p) return;
  // update state
  Q.dotStyle    = p.dot;
  Q.cornerStyle = p.corner;
  Q.fgColor     = p.fg;
  Q.fgColor2    = p.fg2 || '#7C3480';
  Q.bgColor     = p.bg;
  Q.gradient    = !!p.grad;
  Q.gradType    = p.gradType || 'linear';
  Q.gradAngle   = p.gradAngle || 0;
  // update UI
  $('col-fg').value  = Q.fgColor;
  $('col-fg2').value = Q.fgColor2;
  $('col-bg').value  = Q.bgColor;
  $('grad-toggle').checked = Q.gradient;
  $('grad-col2-wrap').style.display = Q.gradient ? '' : 'none';
  $('grad-opts').style.display      = Q.gradient ? '' : 'none';
  $('sl-grad-angle').value  = Q.gradAngle;
  $('sv-grad-angle').textContent = Q.gradAngle+'°';
  // dot style
  $('dot-styles').querySelectorAll('.ds').forEach(function(b){ b.classList.toggle('act', b.dataset.dot===Q.dotStyle); });
  $('corner-styles').querySelectorAll('.cs').forEach(function(b){ b.classList.toggle('act', b.dataset.corner===Q.cornerStyle); });
  // grad type
  $('grad-type').querySelectorAll('.seg-btn').forEach(function(b){ b.classList.toggle('act', b.dataset.val===Q.gradType); });
  updatePresetHighlight(idx);
  scheduleUpdate();
}
function updatePresetHighlight(idx){
  document.querySelectorAll('.preset').forEach(function(b,i){ b.classList.toggle('act', i===idx); });
}

/* ---------- LOCATION ---------- */
// eslint-disable-next-line no-unused-vars
function useMyLocation(){
  var btn = $('locate-btn');
  btn.classList.add('loading');
  btn.textContent = 'Detecting…';
  navigator.geolocation.getCurrentPosition(
    function(pos){
      $('f-lat').value = pos.coords.latitude.toFixed(6);
      $('f-lng').value = pos.coords.longitude.toFixed(6);
      btn.classList.remove('loading');
      btn.innerHTML = '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Location set';
      scheduleUpdate();
    },
    function(){
      btn.classList.remove('loading');
      btn.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg> Use my location';
    }
  );
}

/* ---------- PASSWORD TOGGLE ---------- */
// eslint-disable-next-line no-unused-vars
function togglePassword(){
  var inp = $('f-wifi-pass');
  inp.type = inp.type === 'password' ? 'text' : 'password';
}

/* ---------- DOWNLOAD ---------- */
// eslint-disable-next-line no-unused-vars
function downloadQR(format, size){
  if(!Q.qrInstance) return;
  // Flash the main download button for feedback
  var mainBtn = document.querySelector('.exp-btn.exp-main');
  if(mainBtn){ mainBtn.classList.add('dl-flash'); setTimeout(function(){ mainBtn.classList.remove('dl-flash'); },500); }
  var filename = 'velotools-qr-'+Q.type;
  if(format === 'svg'){
    Q.qrInstance.download({ extension:'svg', name:filename });
  } else {
    // create a hi-res instance just for export
    var px = parseInt(size) || 512;
    var exportInstance = new QRCodeStyling(Object.assign({}, buildQROptions(buildData()||'https://velotools.app'), { width:px, height:px, type:'canvas' }));
    exportInstance.download({ extension:'png', name:filename+'-'+px+'px' });
  }
}

/* ---------- COPY TO CLIPBOARD ---------- */
// eslint-disable-next-line no-unused-vars
function copyQR(){
  if(!Q.qrInstance) return;
  var label = $('copy-label');
  // render to canvas internally at 512px
  var tempDiv = document.createElement('div');
  tempDiv.style.cssText = 'position:absolute;left:-9999px;top:-9999px';
  document.body.appendChild(tempDiv);
  var exp = new QRCodeStyling(Object.assign({}, buildQROptions(buildData()||'https://velotools.app'), { width:512, height:512, type:'canvas' }));
  exp.append(tempDiv);
  setTimeout(function(){
    var canvas = tempDiv.querySelector('canvas');
    if(!canvas){ document.body.removeChild(tempDiv); return; }
    canvas.toBlob(function(blob){
      if(!blob){ document.body.removeChild(tempDiv); return; }
      try {
        navigator.clipboard.write([new ClipboardItem({'image/png':blob})]).then(function(){
          label.textContent = '✓ Copied!';
          setTimeout(function(){ label.textContent='Copy PNG'; }, 2000);
        });
      } catch(_e) {
        // fallback: download
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href=url; a.download='velotools-qr.png';
        a.click();
        URL.revokeObjectURL(url);
        label.textContent = '✓ Downloaded!';
        setTimeout(function(){ label.textContent='Copy PNG'; }, 2000);
      }
      document.body.removeChild(tempDiv);
    });
  }, 300);
}

/* ---------- START ---------- */
if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', init); }
else { init(); }