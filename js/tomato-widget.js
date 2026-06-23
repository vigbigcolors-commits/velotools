/**
 * VeloTools — Focus Lamp v6 FINAL
 * - Стоит справа от "Free. Private. Instant." без сдвига текста
 * - Каждый hover → летит к ДРУГОМУ элементу nav (по кругу)
 * - Мигает ярче, вспышка при hover как звезда
 * - Оптимизирован для mobile + desktop
 */
(function(){
'use strict';

/* ── CSS ── */
var css = document.createElement('style');
css.textContent = `
#vt-anchor{
  display:inline-block;
  width:26px;height:26px;
  vertical-align:middle;
  margin-left:10px;
  position:relative;
  flex-shrink:0;
}
#vt-lamp{
  position:absolute;
  left:50%;top:50%;
  transform:translate(-50%,-50%);
  width:20px;height:20px;
  cursor:pointer;
  border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  z-index:2;
  -webkit-tap-highlight-color:transparent;
}
#vt-lamp::before{
  content:'';
  position:absolute;
  inset:-12px;
  border-radius:50%;
  background:radial-gradient(circle,
    rgba(62,207,142,.3) 0%,
    rgba(62,207,142,.09) 52%,
    transparent 70%
  );
  animation:lt-halo 2.2s ease-in-out infinite;
  pointer-events:none;
}
#vt-dot{
  width:13px;height:13px;
  border-radius:50%;
  position:relative;z-index:1;
  background:radial-gradient(circle at 34% 30%,
    #d4f9ea 0%,#3ecf8e 38%,#1e9962 70%,#0d6640 100%
  );
  box-shadow:
    0 0 0 2px   rgba(62,207,142,.6),
    0 0 10px    rgba(62,207,142,1),
    0 0 22px    rgba(62,207,142,.75),
    0 0 44px    rgba(62,207,142,.38),
    0 0 80px    rgba(62,207,142,.18);
  animation:lt-pulse 2.2s ease-in-out infinite;
  pointer-events:none;
  will-change:box-shadow,opacity;
}
#vt-dot::after{
  content:'';
  position:absolute;
  top:2px;left:3px;
  width:4px;height:3px;
  border-radius:50%;
  background:rgba(255,255,255,.7);
  transform:rotate(-20deg);
}

@keyframes lt-pulse{
  0%,100%{
    box-shadow:
      0 0 0 2px   rgba(62,207,142,.6),
      0 0 10px    rgba(62,207,142,1),
      0 0 22px    rgba(62,207,142,.75),
      0 0 44px    rgba(62,207,142,.38),
      0 0 80px    rgba(62,207,142,.18);
    opacity:1;
  }
  35%{
    box-shadow:
      0 0 0 2px rgba(62,207,142,.18),
      0 0 4px  rgba(62,207,142,.35),
      0 0 9px  rgba(62,207,142,.12);
    opacity:.45;
  }
  50%{
    box-shadow:
      0 0 0 2px   rgba(62,207,142,.6),
      0 0 10px    rgba(62,207,142,1),
      0 0 22px    rgba(62,207,142,.75),
      0 0 44px    rgba(62,207,142,.38),
      0 0 80px    rgba(62,207,142,.18);
    opacity:1;
  }
}
@keyframes lt-halo{
  0%,100%{opacity:1;transform:scale(1)}
  35%{opacity:.1;transform:scale(.72)}
  50%{opacity:1;transform:scale(1)}
}

/* вспышка при hover — звезда */
#vt-lamp:hover #vt-dot{
  animation:lt-star .6s ease-out forwards;
}
@keyframes lt-star{
  0%{
    box-shadow:
      0 0 0 2px rgba(62,207,142,.6),
      0 0 10px rgba(62,207,142,1),
      0 0 22px rgba(62,207,142,.75),
      0 0 44px rgba(62,207,142,.38),
      0 0 80px rgba(62,207,142,.18);
    transform:scale(1);
  }
  30%{
    box-shadow:
      0 0 0 3px  rgba(62,207,142,1),
      0 0 18px   rgba(62,207,142,1),
      0 0 40px   rgba(62,207,142,1),
      0 0 80px   rgba(62,207,142,.85),
      0 0 140px  rgba(62,207,142,.55),
      0 0 220px  rgba(62,207,142,.25);
    transform:scale(1.35);
    opacity:1;
  }
  100%{
    box-shadow:
      0 0 0 2px  rgba(62,207,142,.7),
      0 0 14px   rgba(62,207,142,1),
      0 0 30px   rgba(62,207,142,.9),
      0 0 60px   rgba(62,207,142,.6),
      0 0 100px  rgba(62,207,142,.3);
    transform:scale(1.15);
    opacity:1;
  }
}

/* полёт */
#vt-lamp.flying{
  position:fixed!important;
  transform:none!important;
  margin:0;
  pointer-events:none;
  z-index:99999;
  will-change:left,top;
}
#vt-lamp.flying #vt-dot{
  animation:none;
  box-shadow:
    0 0 0 2px  rgba(62,207,142,.9),
    0 0 14px   rgba(62,207,142,1),
    0 0 32px   rgba(62,207,142,.9),
    0 0 64px   rgba(62,207,142,.55);
  transform:scale(1.15);
  opacity:1;
}

/* след */
.vt-trail{
  position:fixed;
  width:5px;height:5px;
  border-radius:50%;
  background:#3ecf8e;
  pointer-events:none;
  z-index:99998;
  will-change:opacity,transform;
}
`;
document.head.appendChild(css);

/* ── STATE ── */
var anchor, lamp;
var flying   = false;
var _raf     = null;
var navIdx   = 0;   /* какой nav-элемент следующий */

/* ── BUILD ── */
function build(){
  var h1 = document.querySelector('.v-hero h1');
  if(!h1) return;
  var em = h1.querySelector('em');
  if(!em) return;

  anchor = document.createElement('span');
  anchor.id = 'vt-anchor';

  lamp = document.createElement('span');
  lamp.id = 'vt-lamp';
  lamp.setAttribute('role','button');
  lamp.setAttribute('tabindex','0');
  lamp.setAttribute('aria-label','Explore our tools');

  var dot = document.createElement('div');
  dot.id  = 'vt-dot';
  lamp.appendChild(dot);
  anchor.appendChild(lamp);

  /* после em — справа от текста, не сдвигает */
  em.insertAdjacentElement('afterend', anchor);

  lamp.addEventListener('mouseenter', onHover);
  lamp.addEventListener('click', function(){
    window.location.href = '/focus/';
  });
  lamp.addEventListener('keydown', function(e){
    if(e.key==='Enter'||e.key===' ') onHover();
  });
}

/* ── HOVER ── */
function onHover(){
  if(flying) return;
  flying = true;

  /* собираем все ссылки nav */
  var targets = [];
  document.querySelectorAll('.v-nav-links a, .v-nav a.v-nl').forEach(function(a){
    targets.push(a);
  });
  /* добавим логотип как бонусную цель */
  var logo = document.querySelector('.v-logo, .v-ln');
  if(logo) targets.push(logo);

  if(!targets.length){ flying=false; return; }

  /* выбираем следующий по кругу */
  var target = targets[navIdx % targets.length];
  navIdx++;

  /* координаты */
  var lr = lamp.getBoundingClientRect();
  var sx = lr.left + lr.width/2;
  var sy = lr.top  + lr.height/2;

  var tr = target.getBoundingClientRect();
  var cx = tr.left + tr.width/2;
  var cy = tr.top  + tr.height/2;
  var orbitR = Math.max(tr.width/2 + 22, 30);

  /* перевод в fixed */
  lamp.style.cssText =
    'position:fixed;left:'+(sx-10)+'px;top:'+(sy-10)+'px;'+
    'width:20px;height:20px;z-index:99999;'+
    'pointer-events:none;border-radius:50%;'+
    'display:flex;align-items:center;justify-content:center;';
  lamp.classList.add('flying');
  document.body.appendChild(lamp);

  var FLY_T   = 680;
  var ORBIT_T = 2800;   /* ~1.5 оборота */
  var RET_T   = 580;
  var trails  = [];
  var t0 = null;
  var phase = 'fly';
  var retFrom = {x:0,y:0};

  function trail(x,y){
    var t = document.createElement('div');
    t.className = 'vt-trail';
    t.style.cssText = 'left:'+(x-2.5)+'px;top:'+(y-2.5)+'px;opacity:.75';
    document.body.appendChild(t);
    trails.push(t);
    requestAnimationFrame(function(){
      t.style.transition = 'opacity .32s,transform .32s';
      t.style.opacity = '0';
      t.style.transform = 'scale(0)';
    });
    setTimeout(function(){ t.remove(); }, 350);
    if(trails.length > 60) trails.shift();
  }

  function ease(p){ return 1-Math.pow(1-p,3); }

  function tick(ts){
    if(!t0) t0=ts;
    var el=ts-t0, x, y;

    if(phase==='fly'){
      var p=Math.min(el/FLY_T,1), e=ease(p);
      x=sx+(cx-sx)*e;
      y=sy+(cy-sy)*e - Math.sin(p*Math.PI)*50;
      move(x,y); trail(x,y);
      if(p>=1){ phase='orbit'; t0=null; }

    } else if(phase==='orbit'){
      /* луна вокруг Земли — плавный эллипс */
      var a = (el/ORBIT_T)*Math.PI*3; /* 1.5 оборота */
      x = cx + Math.cos(a)*orbitR;
      y = cy + Math.sin(a)*orbitR*0.5;
      move(x,y); trail(x,y);
      if(el>=ORBIT_T){ retFrom={x:x,y:y}; phase='return'; t0=null; }

    } else if(phase==='return'){
      var ar  = anchor.getBoundingClientRect();
      var tx  = ar.left + ar.width/2;
      var ty  = ar.top  + ar.height/2;
      var p2  = Math.min(el/RET_T,1), e2=ease(p2);
      x = retFrom.x+(tx-retFrom.x)*e2;
      y = retFrom.y+(ty-retFrom.y)*e2;
      move(x,y); trail(x,y);
      if(p2>=1){
        end();
        return;
      }
    }
    _raf = requestAnimationFrame(tick);
  }

  _raf = requestAnimationFrame(tick);

  function end(){
    lamp.classList.remove('flying');
    lamp.style.cssText = '';
    anchor.appendChild(lamp);
    flying = false;
    trails.forEach(function(t){ try{t.remove();}catch(_e){} });
    trails = [];
  }
}

function move(x,y){
  lamp.style.left=(x-10)+'px';
  lamp.style.top=(y-10)+'px';
}

/* ── INIT ── */
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',build);
} else { build(); }

})();