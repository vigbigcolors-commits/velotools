/* ============================================================
   VeloTools Invoice Generator — app.js
   ============================================================ */
'use strict';

/* ---------- CURRENCIES ---------- */
var CURRENCIES = {
  USD:{sym:'$',  code:'USD'}, EUR:{sym:'€',  code:'EUR'},
  GBP:{sym:'£',  code:'GBP'}, CAD:{sym:'C$', code:'CAD'},
  AUD:{sym:'A$', code:'AUD'}, JPY:{sym:'¥',  code:'JPY'},
  CHF:{sym:'CHF ',code:'CHF'},NOK:{sym:'kr ', code:'NOK'},
  SEK:{sym:'kr ', code:'SEK'},DKK:{sym:'kr ', code:'DKK'},
  AED:{sym:'د.إ ',code:'AED'},SAR:{sym:'﷼',  code:'SAR'},
  RUB:{sym:'₽',  code:'RUB'}, CNY:{sym:'¥',  code:'CNY'},
  INR:{sym:'₹',  code:'INR'}, BRL:{sym:'R$', code:'BRL'},
  MXN:{sym:'MX$',code:'MXN'},SGD:{sym:'S$', code:'SGD'},
  HKD:{sym:'HK$',code:'HKD'},AMD:{sym:'֏',  code:'AMD'}
};

/* ---------- STATE ---------- */
var INV = {
  fromName:'', fromEmail:'', fromPhone:'', fromAddress:'',
  fromCity:'', fromCountry:'', fromWebsite:'', fromTaxId:'',
  logo: null,
  toName:'', toCompany:'', toEmail:'', toPhone:'',
  toAddress:'', toCity:'', toCountry:'', toTaxId:'',
  number:'INV-001', poNumber:'', date:'', dueDate:'',
  currency:'USD', terms:'Net 30',
  items:[],
  discount:0, shipping:0,
  tax1Name:'Tax', tax1Rate:0, tax2Name:'Tax 2', tax2Rate:0, tax2Enabled:false,
  notes:'', bank:'', tc:'', footer:'', payments:['Bank Transfer'],
  template:'classic', accentColor:'#c83919'
};

var debounceTimer = null;
function schedule(){ clearTimeout(debounceTimer); debounceTimer = setTimeout(render, 80); }

/* ---------- INIT ---------- */
function init(){
  setDefaultDates();
  loadFromStorage();
  bindEditorTabs();
  bindTemplateBtns();
  bindAccentSwatches();
  bindAllInputs();
  bindItemEvents();
  if(!INV.items.length) addItem();
  render();
  window.addEventListener('resize', scalePreview);
  scalePreview();
}

/* ---------- DATES ---------- */
function setDefaultDates(){
  var now = new Date();
  var fmt = function(d){ return d.toISOString().split('T')[0]; };
  var due = new Date(now); due.setDate(due.getDate()+30);
  var d = document.getElementById('inv-date');
  var dd = document.getElementById('inv-due');
  if(d && !d.value) d.value = fmt(now);
  if(dd && !dd.value) dd.value = fmt(due);
}

/* ---------- EDITOR TABS ---------- */
function bindEditorTabs(){
  document.querySelectorAll('.ed-tab').forEach(function(btn){
    btn.addEventListener('click', function(){
      document.querySelectorAll('.ed-tab').forEach(function(b){ b.classList.remove('act'); });
      document.querySelectorAll('.ed-panel').forEach(function(p){ p.style.display='none'; });
      btn.classList.add('act');
      var panel = document.getElementById('panel-'+btn.dataset.panel);
      if(panel) panel.style.display='';
    });
  });
}

/* ---------- TEMPLATE BUTTONS ---------- */
function bindTemplateBtns(){
  document.querySelectorAll('.tmpl-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      document.querySelectorAll('.tmpl-btn').forEach(function(b){ b.classList.remove('act'); });
      btn.classList.add('act');
      INV.template = btn.dataset.tmpl;
      setTemplate(INV.template);
      saveToStorage();
    });
  });
}
function setTemplate(tmpl){
  var inv = document.getElementById('invoice');
  inv.className = 'invoice tmpl-'+tmpl;
}

/* ---------- ACCENT SWATCHES ---------- */
function bindAccentSwatches(){
  document.querySelectorAll('.arc-sw').forEach(function(sw){
    sw.addEventListener('click', function(){
      document.querySelectorAll('.arc-sw').forEach(function(s){ s.classList.remove('act'); });
      sw.classList.add('act');
      INV.accentColor = sw.dataset.col;
      applyAccent(INV.accentColor);
      saveToStorage();
    });
  });
  var custom = document.getElementById('arc-custom');
  if(custom){
    custom.addEventListener('input', function(){
      document.querySelectorAll('.arc-sw').forEach(function(s){ s.classList.remove('act'); });
      INV.accentColor = this.value;
      applyAccent(INV.accentColor);
    });
    custom.addEventListener('change', saveToStorage);
  }
}
function applyAccent(color){
  document.documentElement.style.setProperty('--inv-accent', color);
  // derive a lighter/darker variant
  document.documentElement.style.setProperty('--inv-accent-light', color+'22');
}

/* ---------- BIND ALL INPUTS ---------- */
function bindAllInputs(){
  var map = {
    'from-name':'fromName','from-email':'fromEmail','from-phone':'fromPhone',
    'from-address':'fromAddress','from-city':'fromCity','from-country':'fromCountry',
    'from-website':'fromWebsite','from-tax-id':'fromTaxId',
    'to-name':'toName','to-company':'toCompany','to-email':'toEmail',
    'to-phone':'toPhone','to-address':'toAddress','to-city':'toCity',
    'to-country':'toCountry','to-tax-id':'toTaxId',
    'inv-number':'number','inv-po':'poNumber','inv-date':'date',
    'inv-due':'dueDate','inv-discount':'discount','inv-shipping':'shipping',
    'tax1-name':'tax1Name','tax1-rate':'tax1Rate',
    'tax2-name':'tax2Name','tax2-rate':'tax2Rate',
    'inv-notes':'notes','inv-bank':'bank','inv-tc':'tc','inv-footer':'footer'
  };
  Object.keys(map).forEach(function(id){
    var el = document.getElementById(id);
    if(!el) return;
    el.addEventListener('input', function(){
      INV[map[id]] = this.value;
      schedule();
    });
    el.addEventListener('change', function(){
      INV[map[id]] = this.value;
      saveToStorage();
    });
  });
  // currency
  var cur = document.getElementById('inv-currency');
  if(cur){
    cur.addEventListener('change', function(){
      INV.currency = this.value;
      updateCurrencySymbols();
      schedule();
      saveToStorage();
    });
  }
  // terms
  var terms = document.getElementById('inv-terms');
  if(terms){
    terms.addEventListener('change', function(){
      INV.terms = this.value.split(' — ')[0];
      saveToStorage();
      schedule();
    });
  }
}

function updateCurrencySymbols(){
  var sym = getCurrSym();
  var el = document.getElementById('ship-symbol');
  if(el) el.textContent = sym;
}

/* ---------- PAYMENT METHODS ---------- */
// eslint-disable-next-line no-unused-vars
function updatePayments(){
  INV.payments = [];
  document.querySelectorAll('.pm-check input:checked').forEach(function(cb){
    INV.payments.push(cb.value);
  });
  schedule();
}

/* ---------- ITEMS ---------- */
function bindItemEvents(){ /* delegated — see addItem */ }

var itemIdCounter = 0;
var UNITS = ['hrs','days','pcs','words','pages','sessions','months','fixed','other'];

function addItem(desc, qty, unit, rate){
  var id = ++itemIdCounter;
  INV.items.push({ id:id, desc:desc||'', qty:qty||1, unit:unit||'hrs', rate:rate||0 });
  renderItemsList();
}

// eslint-disable-next-line no-unused-vars
function removeItem(id){
  INV.items = INV.items.filter(function(i){ return i.id!==id; });
  renderItemsList();
  schedule();
}

function renderItemsList(){
  var list = document.getElementById('items-list');
  if(!list) return;
  list.innerHTML = '';
  INV.items.forEach(function(item){
    var row = document.createElement('div');
    row.className = 'item-row';
    row.dataset.id = item.id;
    var unitOpts = UNITS.map(function(u){
      return '<option value="'+u+'"'+(item.unit===u?' selected':'')+'>'+u+'</option>';
    }).join('');
    row.innerHTML = [
      '<div class="item-desc-wrap">',
        '<input class="fi item-desc" type="text" placeholder="Description of service or product" value="'+escHtml(item.desc)+'" data-field="desc">',
      '</div>',
      '<div class="item-row-meta">',
        '<div class="fg-sm"><label>Qty</label><input class="fi" type="number" min="0" step="any" value="'+item.qty+'" data-field="qty"></div>',
        '<div class="fg-sm"><label>Unit</label><select class="fi" data-field="unit">'+unitOpts+'</select></div>',
        '<div class="fg-sm"><label>Rate</label><input class="fi" type="number" min="0" step="0.01" value="'+item.rate+'" data-field="rate"></div>',
        '<div class="fg-sm fg-amount"><label>Amount</label><div class="item-amount" data-amount-id="'+item.id+'">'+fmt(item.qty*item.rate)+'</div></div>',
        '<button class="item-del" title="Remove" onclick="removeItem('+item.id+')"><svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg></button>',
      '</div>'
    ].join('');
    // bind inputs
    row.querySelectorAll('[data-field]').forEach(function(inp){
      inp.addEventListener('input', function(){
        var it = INV.items.find(function(i){ return i.id===+row.dataset.id; });
        if(!it) return;
        it[this.dataset.field] = this.dataset.field==='desc' ? this.value : +this.value;
        var amtEl = row.querySelector('[data-amount-id]');
        if(amtEl) amtEl.textContent = fmt(it.qty*it.rate);
        schedule();
      });
    });
    list.appendChild(row);
  });
}

// eslint-disable-next-line no-unused-vars
function toggleTax2(){
  INV.tax2Enabled = !INV.tax2Enabled;
  var block = document.getElementById('tax2-block');
  var btn = document.getElementById('add-tax-btn');
  if(block){ block.style.display = INV.tax2Enabled ? '' : 'none'; }
  if(btn){ btn.querySelector('svg').style.transform = INV.tax2Enabled ? 'rotate(45deg)' : ''; }
  schedule();
}

/* ---------- LOGO ---------- */
function onLogoUpload(input){
  var file = input.files[0]; if(!file) return;
  var reader = new FileReader();
  reader.onload = function(e){
    INV.logo = e.target.result;
    var prev = document.getElementById('logo-preview');
    var icon = document.getElementById('lu-icon');
    var rm = document.getElementById('remove-logo');
    if(prev){ prev.src = e.target.result; prev.style.display='block'; }
    if(icon) icon.style.display='none';
    if(rm) rm.style.display='block';
    schedule();
  };
  reader.readAsDataURL(file);
}
// eslint-disable-next-line no-unused-vars
function removeLogo(){
  INV.logo = null;
  var prev = document.getElementById('logo-preview');
  var icon = document.getElementById('lu-icon');
  var rm = document.getElementById('remove-logo');
  var lf = document.getElementById('logo-file');
  if(prev){ prev.src=''; prev.style.display='none'; }
  if(icon) icon.style.display='';
  if(rm) rm.style.display='none';
  if(lf) lf.value='';
  schedule();
}

/* ---------- CURRENCY / FORMAT ---------- */
function getCurrSym(){ return (CURRENCIES[INV.currency]||CURRENCIES.USD).sym; }
function fmt(n){
  var sym = getCurrSym();
  var v = parseFloat(n)||0;
  var s = v.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,',');
  return sym+s;
}

/* ---------- RENDER ---------- */
function render(){
  renderLogos();
  renderFromBlock();
  renderMetaBlock();
  renderBillTo();
  renderTable();
  renderTotals();
  renderFooter();
}

function renderLogos(){
  ['inv-logo','inv-logo-e','inv-logo-m','inv-logo-s'].forEach(function(id){
    var el = document.getElementById(id);
    if(!el) return;
    if(INV.logo){ el.src=INV.logo; el.style.display='block'; }
    else { el.src=''; el.style.display='none'; }
  });
}

function renderFromBlock(){
  var name = INV.fromName || 'Your Company';
  var lines = [];
  if(INV.fromEmail)   lines.push(INV.fromEmail);
  if(INV.fromPhone)   lines.push(INV.fromPhone);
  if(INV.fromAddress) lines.push(INV.fromAddress);
  if(INV.fromCity)    lines.push(INV.fromCity);
  if(INV.fromCountry) lines.push(INV.fromCountry);
  if(INV.fromWebsite) lines.push(INV.fromWebsite);
  if(INV.fromTaxId)   lines.push('Tax ID: '+INV.fromTaxId);
  var detail = lines.join(' · ');

  setTxt('inv-from-name', name);
  setTxt('inv-from-details', detail);
  setTxt('inv-elegant-name', name);
  setTxt('inv-elegant-details', lines.join('\n'));
  setTxt('inv-minimal-name', name);
  setTxt('inv-minimal-details', detail);
  setTxt('inv-stripe-company', name);
  var stripeFrom = [];
  if(INV.fromEmail)   stripeFrom.push(INV.fromEmail);
  if(INV.fromPhone)   stripeFrom.push(INV.fromPhone);
  if(INV.fromAddress) stripeFrom.push(INV.fromAddress);
  if(INV.fromCity)    stripeFrom.push(INV.fromCity);
  setTxt('inv-stripe-from', stripeFrom.join('\n'));
}

function renderMetaBlock(){
  var num = INV.number || 'INV-001';
  var date = INV.date ? fmtDate(INV.date) : today();
  var due  = INV.dueDate ? fmtDate(INV.dueDate) : '';
  var rows = [
    '<div class="meta-row"><span class="meta-lbl">Invoice #</span><span class="meta-val">'+escHtml(num)+'</span></div>',
    INV.poNumber ? '<div class="meta-row"><span class="meta-lbl">PO #</span><span class="meta-val">'+escHtml(INV.poNumber)+'</span></div>' : '',
    '<div class="meta-row"><span class="meta-lbl">Date</span><span class="meta-val">'+date+'</span></div>',
    due ? '<div class="meta-row"><span class="meta-lbl">Due</span><span class="meta-val">'+due+'</span></div>' : '',
    INV.terms ? '<div class="meta-row"><span class="meta-lbl">Terms</span><span class="meta-val">'+escHtml(INV.terms)+'</span></div>' : ''
  ].filter(Boolean).join('');
  var elegantMeta = num+' &nbsp;·&nbsp; '+date+(due?' &nbsp;·&nbsp; Due: '+due:'');
  var el = document.getElementById('inv-meta');           if(el) el.innerHTML=rows;
  var em = document.getElementById('inv-elegant-meta');   if(em) em.innerHTML=elegantMeta;
  var mm = document.getElementById('inv-minimal-meta');   if(mm) mm.innerHTML=rows;
  var sm = document.getElementById('inv-stripe-meta');    if(sm) sm.innerHTML=rows;
}

function renderBillTo(){
  var name = [INV.toName, INV.toCompany].filter(Boolean).join('\n');
  var lines = [];
  if(INV.toEmail)   lines.push(INV.toEmail);
  if(INV.toPhone)   lines.push(INV.toPhone);
  if(INV.toAddress) lines.push(INV.toAddress);
  if(INV.toCity)    lines.push(INV.toCity);
  if(INV.toCountry) lines.push(INV.toCountry);
  if(INV.toTaxId)   lines.push('Tax ID: '+INV.toTaxId);
  var bn = document.getElementById('inv-bill-name');
  var bd = document.getElementById('inv-bill-details');
  if(bn) bn.textContent = name || 'Client Name';
  if(bd) bd.textContent = lines.join('\n');
}

function renderTable(){
  var tbody = document.getElementById('inv-tbody');
  if(!tbody) return;
  tbody.innerHTML = '';
  INV.items.forEach(function(item, i){
    var tr = document.createElement('tr');
    tr.className = i%2===0 ? '' : 'alt';
    var amt = (parseFloat(item.qty)||0) * (parseFloat(item.rate)||0);
    tr.innerHTML = [
      '<td class="col-desc">'+escHtml(item.desc||'—')+'</td>',
      '<td class="col-qty">'+item.qty+'</td>',
      '<td class="col-unit">'+escHtml(item.unit||'')+'</td>',
      '<td class="col-rate">'+fmt(item.rate)+'</td>',
      '<td class="col-amount">'+fmt(amt)+'</td>'
    ].join('');
    tbody.appendChild(tr);
  });
}

function renderTotals(){
  var subtotal = INV.items.reduce(function(s,i){ return s+(parseFloat(i.qty)||0)*(parseFloat(i.rate)||0); }, 0);
  var discAmt  = subtotal * ((parseFloat(INV.discount)||0)/100);
  var afterDisc = subtotal - discAmt;
  var tax1Amt  = afterDisc * ((parseFloat(INV.tax1Rate)||0)/100);
  var tax2Amt  = INV.tax2Enabled ? afterDisc * ((parseFloat(INV.tax2Rate)||0)/100) : 0;
  var shipAmt  = parseFloat(INV.shipping)||0;
  var total    = afterDisc + tax1Amt + tax2Amt + shipAmt;

  setTxt('t-subtotal', fmt(subtotal));
  setTxt('t-total', fmt(total));

  var dr = document.getElementById('t-discount-row');
  if(dr) dr.style.display = discAmt>0 ? '' : 'none';
  setTxt('t-discount-label', 'Discount ('+(INV.discount||0)+'%)');
  setTxt('t-discount', '–'+fmt(discAmt));

  var tr1 = document.getElementById('t-tax1-row');
  if(tr1) tr1.style.display = (parseFloat(INV.tax1Rate)||0)>0 ? '' : 'none';
  setTxt('t-tax1-label', (INV.tax1Name||'Tax')+' ('+(INV.tax1Rate||0)+'%)');
  setTxt('t-tax1', fmt(tax1Amt));

  var tr2 = document.getElementById('t-tax2-row');
  if(tr2) tr2.style.display = (INV.tax2Enabled && (parseFloat(INV.tax2Rate)||0)>0) ? '' : 'none';
  setTxt('t-tax2-label', (INV.tax2Name||'Tax 2')+' ('+(INV.tax2Rate||0)+'%)');
  setTxt('t-tax2', fmt(tax2Amt));

  var sr = document.getElementById('t-ship-row');
  if(sr) sr.style.display = shipAmt>0 ? '' : 'none';
  setTxt('t-shipping', fmt(shipAmt));
}

function renderFooter(){
  var nb = document.getElementById('inv-notes-block');
  var nt = document.getElementById('inv-notes-text');
  if(nb && nt){
    nb.style.display = INV.notes ? '' : 'none';
    nt.textContent = INV.notes;
  }
  var pb = document.getElementById('inv-payment-block');
  var pm = document.getElementById('inv-payment-methods');
  var bt = document.getElementById('inv-bank-text');
  if(pb){
    pb.style.display = (INV.payments.length || INV.bank) ? '' : 'none';
    if(pm) pm.textContent = INV.payments.join(' · ');
    if(bt) bt.textContent = INV.bank;
  }
  var tcb = document.getElementById('inv-tc-block');
  var tct = document.getElementById('inv-tc-text');
  if(tcb && tct){
    tcb.style.display = INV.tc ? '' : 'none';
    tct.textContent = INV.tc;
  }
  var fl = document.getElementById('inv-footer-line');
  if(fl) fl.textContent = INV.footer;
}

/* ---------- SCALE PREVIEW ---------- */
function scalePreview(){
  var outer = document.getElementById('preview-outer');
  var wrap  = document.getElementById('preview-scale-wrap');
  var inv   = document.getElementById('invoice');
  if(!outer||!wrap||!inv) return;
  var ow = outer.clientWidth - 40;
  var naturalW = 794; // A4 ~px at 96dpi
  var scale = Math.min(1, ow / naturalW);
  wrap.style.transform = 'scale('+scale+')';
  wrap.style.transformOrigin = 'top center';
  outer.style.minHeight = Math.round(1123 * scale + 40)+'px'; // A4 height
}

/* ---------- EXPORT ---------- */
// eslint-disable-next-line no-unused-vars
function downloadPDF(){
  // Hide editor, print, restore
  document.getElementById('editor').style.display = 'none';
  document.getElementById('preview-outer').classList.add('print-full');
  window.print();
  document.getElementById('editor').style.display = '';
  document.getElementById('preview-outer').classList.remove('print-full');
}

// eslint-disable-next-line no-unused-vars
function downloadPNG(){
  var inv = document.getElementById('invoice');
  if(!inv) return;
  var btn = document.querySelector('.exp-png');
  if(btn){ btn.textContent='Generating…'; btn.disabled=true; }
  // Temporarily reset scale for capture
  var wrap = document.getElementById('preview-scale-wrap');
  var prevTransform = wrap.style.transform;
  wrap.style.transform = 'scale(1)';
  wrap.style.transformOrigin = 'top left';
  setTimeout(function(){
    html2canvas(inv, { scale:2, useCORS:true, backgroundColor:'#ffffff', logging:false }).then(function(canvas){
      wrap.style.transform = prevTransform;
      wrap.style.transformOrigin = 'top center';
      var link = document.createElement('a');
      link.download = 'invoice-'+(INV.number||'001')+'.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      if(btn){ btn.innerHTML='<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> Download PNG'; btn.disabled=false; }
    }).catch(function(){
      wrap.style.transform = prevTransform;
      if(btn){ btn.innerHTML='Download PNG'; btn.disabled=false; }
    });
  }, 50);
}

/* ---------- RESET ---------- */
// eslint-disable-next-line no-unused-vars
function resetInvoice(){
  if(!confirm('Reset all invoice data? This cannot be undone.')) return;
  localStorage.removeItem('velotools_invoice');
  location.reload();
}

/* ---------- STORAGE ---------- */
function saveToStorage(){
  try { localStorage.setItem('velotools_invoice', JSON.stringify(INV)); } catch(_e){}
}
function loadFromStorage(){
  try {
    var raw = localStorage.getItem('velotools_invoice');
    if(!raw) return;
    var saved = JSON.parse(raw);
    Object.assign(INV, saved);
    // populate form fields
    populateFields();
    setTemplate(INV.template);
    applyAccent(INV.accentColor);
    // highlight correct template btn
    document.querySelectorAll('.tmpl-btn').forEach(function(b){
      b.classList.toggle('act', b.dataset.tmpl===INV.template);
    });
    // highlight correct accent swatch
    document.querySelectorAll('.arc-sw').forEach(function(s){
      s.classList.toggle('act', s.dataset.col===INV.accentColor);
    });
  } catch(_e){}
}
function populateFields(){
  var map = {
    'from-name':INV.fromName,'from-email':INV.fromEmail,'from-phone':INV.fromPhone,
    'from-address':INV.fromAddress,'from-city':INV.fromCity,'from-country':INV.fromCountry,
    'from-website':INV.fromWebsite,'from-tax-id':INV.fromTaxId,
    'to-name':INV.toName,'to-company':INV.toCompany,'to-email':INV.toEmail,
    'to-phone':INV.toPhone,'to-address':INV.toAddress,'to-city':INV.toCity,
    'to-country':INV.toCountry,'to-tax-id':INV.toTaxId,
    'inv-number':INV.number,'inv-po':INV.poNumber,
    'inv-date':INV.date,'inv-due':INV.dueDate,
    'inv-discount':INV.discount,'inv-shipping':INV.shipping,
    'tax1-name':INV.tax1Name,'tax1-rate':INV.tax1Rate,
    'tax2-name':INV.tax2Name,'tax2-rate':INV.tax2Rate,
    'inv-notes':INV.notes,'inv-bank':INV.bank,'inv-tc':INV.tc,'inv-footer':INV.footer
  };
  Object.keys(map).forEach(function(id){
    var el = document.getElementById(id);
    if(el && map[id]!==undefined) el.value = map[id];
  });
  var cur = document.getElementById('inv-currency');
  if(cur) cur.value = INV.currency;
  // items
  if(INV.items && INV.items.length){
    itemIdCounter = Math.max.apply(null, INV.items.map(function(i){ return i.id||0; }));
    renderItemsList();
  }
  // logo
  if(INV.logo) onLogoUpload({ files:[{ name:'logo' }], result:INV.logo }, true);
  updateCurrencySymbols();
  if(INV.tax2Enabled){
    var block = document.getElementById('tax2-block');
    if(block) block.style.display='';
  }
}

/* ---------- HELPERS ---------- */
function setTxt(id, val){
  var el = document.getElementById(id);
  if(el) el.textContent = val||'';
}
function escHtml(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function fmtDate(s){
  if(!s) return '';
  var d = new Date(s+'T00:00:00');
  return d.toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'});
}
function today(){
  return fmtDate(new Date().toISOString().split('T')[0]);
}

/* ---------- AUTO-SAVE ON CHANGE ---------- */
document.addEventListener('input', function(){ saveToStorage(); });

/* ---------- PRINT STYLES APPLIED VIA JS ---------- */
window.addEventListener('beforeprint', function(){
  document.getElementById('preview-scale-wrap').style.transform = 'none';
});
window.addEventListener('afterprint', function(){
  scalePreview();
});

/* ---------- START ---------- */
if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded',init); }
else { init(); }