/**
 * VeloTools — Hero Tomato v9
 * English only, bouncy ball physics, loud drop sound,
 * bubble never covers tomato
 */
(function(){
'use strict';

/* ── AUDIO — громкая капля ── */
function playDrop(){
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    /* первый осциллятор — основной тон */
    var o1 = ctx.createOscillator();
    var g1 = ctx.createGain();
    o1.connect(g1); g1.connect(ctx.destination);
    o1.type = 'sine';
    o1.frequency.setValueAtTime(1200, ctx.currentTime);
    o1.frequency.exponentialRampToValueAtTime(180, ctx.currentTime+.25);
    g1.gain.setValueAtTime(.55, ctx.currentTime);
    g1.gain.exponentialRampToValueAtTime(.001, ctx.currentTime+.28);
    o1.start(); o1.stop(ctx.currentTime+.28);
    /* второй — гармоника */
    var o2 = ctx.createOscillator();
    var g2 = ctx.createGain();
    o2.connect(g2); g2.connect(ctx.destination);
    o2.type = 'sine';
    o2.frequency.setValueAtTime(600, ctx.currentTime);
    o2.frequency.exponentialRampToValueAtTime(90, ctx.currentTime+.2);
    g2.gain.setValueAtTime(.25, ctx.currentTime);
    g2.gain.exponentialRampToValueAtTime(.001, ctx.currentTime+.22);
    o2.start(); o2.stop(ctx.currentTime+.22);
  } catch(e){}
}

function playPop(){
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = 'sine';
    o.frequency.setValueAtTime(520, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(130, ctx.currentTime+.12);
    g.gain.setValueAtTime(.4, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime+.14);
    o.start(); o.stop(ctx.currentTime+.14);
  } catch(e){}
}

/* ── CSS ─────────────────────────────── */
var css = document.createElement('style');
css.textContent = `
#vth-anchor {
  display:inline-block;
  position:relative;
  width:44px; height:44px;
  margin-left:14px;
  vertical-align:middle;
  flex-shrink:0;
}
#vth-wrap {
  position:absolute;
  width:44px; height:44px;
  left:0; top:0;
  cursor:default;
  display:flex; align-items:center; justify-content:center;
  transition: left .72s cubic-bezier(.34,1.55,.64,1),
              top  .72s cubic-bezier(.34,1.55,.64,1);
  z-index:2;
}
#vth-wrap svg {
  width:100%; height:100%;
  overflow:visible;
  transform-origin:50% 68%;
  animation: vth-breathe 3.4s ease-in-out infinite,
             vth-glow    3.4s ease-in-out infinite;
}

/* живое дыхание */
@keyframes vth-breathe {
  0%  { transform:scale(1)    rotate(0deg)  translateY(0) }
  25% { transform:scale(1.08) rotate(-2deg) translateY(-3px) }
  55% { transform:scale(1.05) rotate(1.8deg) translateY(-1px) }
  80% { transform:scale(1.09) rotate(-1deg) translateY(-3px) }
  100%{ transform:scale(1)    rotate(0deg)  translateY(0) }
}

/* свечение */
@keyframes vth-glow {
  0%,100%{
    filter:
      drop-shadow(0 0 6px rgba(255,80,60,.98))
      drop-shadow(0 0 16px rgba(255,50,30,.55))
      drop-shadow(0 0 34px rgba(255,30,10,.24));
  }
  50%{
    filter:
      drop-shadow(0 0 12px rgba(255,120,100,1))
      drop-shadow(0 0 28px rgba(255,80,60,.82))
      drop-shadow(0 0 56px rgba(255,55,32,.42));
  }
}

/* прыжок вправо — мячик */
@keyframes vth-ball-r {
  0%  { transform:scaleX(1.35) scaleY(.68) rotate(6deg) }
  30% { transform:scaleX(.84)  scaleY(1.22) rotate(-5deg) }
  58% { transform:scaleX(1.1)  scaleY(.92) rotate(3deg) }
  78% { transform:scaleX(.97)  scaleY(1.04) rotate(-1deg) }
  100%{ transform:scaleX(1)    scaleY(1)   rotate(0deg) }
}
/* прыжок влево */
@keyframes vth-ball-l {
  0%  { transform:scaleX(1.35) scaleY(.68) rotate(-6deg) }
  30% { transform:scaleX(.84)  scaleY(1.22) rotate(5deg) }
  58% { transform:scaleX(1.1)  scaleY(.92) rotate(-3deg) }
  78% { transform:scaleX(.97)  scaleY(1.04) rotate(1deg) }
  100%{ transform:scaleX(1)    scaleY(1)   rotate(0deg) }
}

/* сдаётся */
@keyframes vth-yay {
  0%  { transform:rotate(0deg) scale(1) }
  18% { transform:rotate(-30deg) scale(1.2) translateY(-12px) }
  42% { transform:rotate(24deg)  scale(1.25) translateY(-16px) }
  64% { transform:rotate(-14deg) scale(1.14) translateY(-6px) }
  82% { transform:rotate(7deg)   scale(1.06) translateY(-2px) }
  100%{ transform:rotate(0deg)   scale(1)    translateY(0) }
}

/* idle трюки */
@keyframes vth-bounce {
  0%,100%{ transform:translateY(0) scaleY(1) }
  25%    { transform:translateY(-13px) scaleY(1.14) scaleX(.9) }
  50%    { transform:translateY(0) scaleY(.85) scaleX(1.12) }
  72%    { transform:translateY(-7px) scaleY(1.08) scaleX(.95) }
  88%    { transform:translateY(0) scaleY(.97) scaleX(1.02) }
}
@keyframes vth-spin {
  0%  { transform:rotate(0deg) scale(1) }
  44% { transform:rotate(198deg) scale(1.22) }
  74% { transform:rotate(348deg) scale(.9) }
  100%{ transform:rotate(360deg) scale(1) }
}
@keyframes vth-wiggle {
  0%,100%{ transform:rotate(0deg) }
  18%    { transform:rotate(-24deg) scale(1.14) }
  40%    { transform:rotate(20deg)  scale(.93) }
  60%    { transform:rotate(-13deg) scale(1.07) }
  78%    { transform:rotate(9deg) }
  92%    { transform:rotate(-3deg) }
}
@keyframes vth-heartbeat {
  0%,100%{ transform:scale(1) }
  14%    { transform:scale(1.34) }
  28%    { transform:scale(1) }
  44%    { transform:scale(1.28) }
  68%    { transform:scale(1) }
}
@keyframes vth-nod {
  0%,100%{ transform:rotate(0deg) translateY(0) }
  26%    { transform:rotate(-18deg) translateY(-5px) }
  54%    { transform:rotate(14deg)  translateY(-7px) }
  78%    { transform:rotate(-7deg)  translateY(-3px) }
}
@keyframes vth-wink {
  0%,90%,100%{ transform:scaleY(1) }
  46%{ transform:scaleY(.05) }
}
.vth-wl #vth-eye-l { animation:vth-wink .32s ease-in-out 1; }
.vth-wr #vth-eye-r { animation:vth-wink .32s ease-in-out 1; }

#vth-wrap.ready { cursor:pointer; }

/* ── BUBBLE — ВСЕГДА СПРАВА или СЛЕВА, никогда не перекрывает томата ── */
#vth-bubble {
  position:fixed;
  z-index:99998;
  pointer-events:none;
  opacity:0;
  transform:scale(.88) translateX(-6px);
  transition:opacity .26s ease, transform .3s cubic-bezier(.34,1.45,.64,1);
  font-family:'DM Sans',system-ui,sans-serif;
}
#vth-bubble.show { opacity:1; transform:scale(1) translateX(0); }
#vth-bi {
  background:linear-gradient(145deg,#182420,#1d2e26);
  border:1.5px solid rgba(62,207,142,.45);
  border-radius:14px;
  padding:13px 16px;
  min-width:195px; max-width:228px;
  box-shadow:
    0 16px 44px rgba(0,0,0,.65),
    0 0 0 1px rgba(62,207,142,.07),
    inset 0 1px 0 rgba(255,255,255,.05);
  position:relative;
}
#vth-bi::before {
  content:'';
  position:absolute;
  left:-8px; top:16px;
  width:13px; height:13px;
  background:#182420;
  border-left:1.5px solid rgba(62,207,142,.45);
  border-bottom:1.5px solid rgba(62,207,142,.45);
  transform:rotate(45deg);
}
.vt { display:block; font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:.08em; color:#3ecf8e; margin-bottom:6px; }
.vx { font-size:13px; line-height:1.62; color:#d8ede6; }
.vc { display:inline-block; margin-top:9px; font-size:11.5px; font-weight:700; color:#ff8060; letter-spacing:.02em; }
`;
document.head.appendChild(css);

/* ── SVG ────────────────────────────── */
var SVG = `<svg viewBox="0 0 60 62" xmlns="http://www.w3.org/2000/svg">
<defs>
<radialGradient id="g1" cx="36%" cy="26%" r="65%">
  <stop offset="0%"   stop-color="#ff8872"/>
  <stop offset="55%"  stop-color="#e6301d"/>
  <stop offset="100%" stop-color="#8c1005"/>
</radialGradient>
<radialGradient id="g2" cx="46%" cy="28%" r="55%">
  <stop offset="0%"   stop-color="rgba(255,255,255,.56)"/>
  <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
</radialGradient>
</defs>
<ellipse cx="30" cy="37" rx="25" ry="23" fill="url(#g1)"/>
<ellipse cx="21" cy="26" rx="9" ry="5.5" fill="url(#g2)" transform="rotate(-20 21 26)"/>
<ellipse cx="38" cy="23" rx="3.5" ry="2.2" fill="rgba(255,255,255,.28)" transform="rotate(-10 38 23)"/>
<path d="M28 17 Q26 8 18 7 Q23 12 27 16" fill="#2d8a2d"/>
<path d="M30 16 Q30 6 38 5 Q34 11 30 16" fill="#237a23"/>
<rect x="28" y="14" width="4" height="11" rx="2" fill="#3aaa3a"/>
<g id="vth-eye-l" style="transform-origin:21px 33px">
  <ellipse cx="21" cy="33" rx="5.5" ry="6.2" fill="white" opacity=".95"/>
  <ellipse cx="21" cy="34" rx="3.6" ry="4.3" fill="#2a0806"/>
  <ellipse cx="22.8" cy="32" rx="1.6" ry="1.6" fill="white"/>
  <ellipse cx="19.8" cy="35.8" rx=".7" ry=".7" fill="rgba(255,255,255,.35)"/>
</g>
<g id="vth-eye-r" style="transform-origin:39px 33px">
  <ellipse cx="39" cy="33" rx="5.5" ry="6.2" fill="white" opacity=".95"/>
  <ellipse cx="39" cy="34" rx="3.6" ry="4.3" fill="#2a0806"/>
  <ellipse cx="40.8" cy="32" rx="1.6" ry="1.6" fill="white"/>
  <ellipse cx="37.8" cy="35.8" rx=".7" ry=".7" fill="rgba(255,255,255,.35)"/>
</g>
<path id="vth-mouth" d="M18 49 Q30 59 42 49" stroke="#6a0f08" stroke-width="2.8" fill="none" stroke-linecap="round"/>
<ellipse cx="13" cy="44" rx="5.5" ry="3" fill="rgba(255,120,100,.22)"/>
<ellipse cx="47" cy="44" rx="5.5" ry="3" fill="rgba(255,120,100,.22)"/>
</svg>`;

/* ── MESSAGES ───────────────────────── */
var CHASE = [
  { t:'😏 not so fast!',    x:'Try one more time.\nFocus Room is waiting.',      c:'→ catch me if you can' },
  { t:'🍅 almost got me!',  x:'Pomodoro timer + lofi music.\nFree. Forever.',    c:'→ one more try' },
];
var FACTS = [
  { t:'🍅 pomodoro method',  x:'25 min focus + 5 min break.\nUsed by millions of devs worldwide.',  c:'→ try Focus Room' },
  { t:'🎵 lofi + deep work', x:'Wordless music boosts\nconcentration by 15%.',                      c:'→ open Focus Room' },
  { t:'🧠 brain science',    x:'Without breaks the brain loses\n40% productivity. Pomodoro fixes it.',c:'→ Focus Room — free' },
  { t:'🔇 zero distractions',x:'One notification = 23 min\nto regain focus. One tab fixes that.',  c:'→ one tab for everything' },
  { t:'⚡ flow state',       x:'Flow is easier with rhythmic\nmusic and a clear timer.',             c:'→ enter the flow' },
  { t:'🌊 white noise',      x:'White noise masks office chaos\nand reduces anxiety.',               c:'→ hear it in Focus Room' },
  { t:'💡 one tab',          x:'Music + timer + focus.\nAll in one free tab.',                      c:'→ simplify your workflow' },
  { t:'🚀 built for makers', x:'Code, design, writing — everything\nis better with a Pomodoro timer.',c:'→ open now' },
];

var hoverCount = 0;
var MAX        = 3;
var busy       = false;
var ready      = false;
var factIdx    = 0;
var leapSeq    = [72,-68,80,-74,66,-70];
var leapIdx    = 0;
var idleTimer, winkTimer;
var IDLES = [
  {n:'vth-bounce',d:820},{n:'vth-spin',d:720},{n:'vth-wiggle',d:760},
  {n:'vth-heartbeat',d:860},{n:'vth-nod',d:760},
];
var lastIdle=-1;

var anchor,wrap,svgEl,bubble,bi;

/* ── BUILD ──────────────────────────── */
function build(){
  var h1 = document.querySelector('.v-hero h1') || document.querySelector('h1');
  if(!h1) return;

  anchor = document.createElement('span');
  anchor.id = 'vth-anchor';
  wrap = document.createElement('span');
  wrap.id = 'vth-wrap';
  wrap.setAttribute('role','button');
  wrap.setAttribute('aria-label','Open Focus Room');
  wrap.setAttribute('tabindex','0');
  wrap.innerHTML = SVG;
  svgEl = wrap.querySelector('svg');
  anchor.appendChild(wrap);
  h1.appendChild(anchor);

  bubble = document.createElement('div'); bubble.id='vth-bubble';
  bi     = document.createElement('div'); bi.id='vth-bi';
  bubble.appendChild(bi);
  document.body.appendChild(bubble);

  wrap.addEventListener('mouseenter', onHover);
  wrap.addEventListener('mouseleave', onLeave);
  wrap.addEventListener('click', onClick);
  wrap.addEventListener('keydown',function(e){
    if(e.key==='Enter'||e.key===' ') onClick();
  });

  scheduleIdle();
  scheduleWink();

  setTimeout(function(){
    if(!busy){ showBubble(FACTS[factIdx++]); setTimeout(hideBubble,4500); }
  }, 6000);
}

/* ── HOVER ──────────────────────────── */
function onHover(){
  if(busy) return;
  playDrop();
  busy = true;
  hoverCount++;

  if(hoverCount >= MAX && !ready){
    ready = true;
    wrap.classList.add('ready');
    playAnim('vth-yay', 780);
    setFace('huge');
    showBubble({
      t:'🎉 you caught me!',
      x:'Focus Room unlocked.\nTimer + Lofi + white noise.\nFree forever.',
      c:'→ open Focus Room'
    });
    setTimeout(function(){ busy=false; }, 820);
    return;
  }

  /* прыжок — мячик */
  var dx = leapSeq[leapIdx % leapSeq.length]; leapIdx++;
  var an = dx>0 ? 'vth-ball-r':'vth-ball-l';
  playAnim(an, 430);
  wrap.style.left = dx+'px';
  wrap.style.top  = '-16px';
  showBubble(CHASE[Math.min(hoverCount-1, CHASE.length-1)]);

  setTimeout(function(){
    wrap.style.left='0px';
    wrap.style.top='0px';
    busy=false;
  }, 880);
}

function onLeave(){
  /* текст пропадает сразу при уходе мыши */
  hideBubble();
}

function onClick(){
  if(ready){ playPop(); window.location.href='/focus/'; }
}

/* ── BUBBLE — никогда не перекрывает томата ── */
function showBubble(msg){
  bi.innerHTML =
    '<span class="vt">'+msg.t+'</span>'+
    '<span class="vx">'+msg.x.replace(/\n/g,'<br>')+'</span>'+
    '<span class="vc">'+msg.c+'</span>';

  /* позиционируем СПРАВА от anchor */
  var rect = anchor.getBoundingClientRect();
  var bw   = 240;
  var left = rect.right + 16;
  /* если не влезает справа — идём влево */
  if(left + bw > window.innerWidth - 8) left = rect.left - bw - 16;
  left = Math.max(8, left);
  /* вертикально — по центру томата */
  var top = rect.top + (rect.height/2) - 60;
  top = Math.max(8, Math.min(window.innerHeight-180, top));
  bubble.style.left = left+'px';
  bubble.style.top  = top+'px';
  bubble.classList.add('show');
}
function hideBubble(){ bubble.classList.remove('show'); }

/* ── IDLE ────────────────────────────── */
function scheduleIdle(){
  clearTimeout(idleTimer);
  var pool=IDLES.filter(function(_,i){return i!==lastIdle;});
  var pick=pool[Math.floor(Math.random()*pool.length)];
  lastIdle=IDLES.indexOf(pick);
  var delay=2800+Math.random()*3200;
  idleTimer=setTimeout(function(){
    if(!busy) playAnim(pick.n, pick.d);
    /* иногда сам показывает факт */
    if(Math.random()>.6 && !ready && !busy){
      var f=FACTS[factIdx%FACTS.length]; factIdx++;
      showBubble(f);
      setTimeout(hideBubble, 4000);
    }
    setTimeout(scheduleIdle, pick.d+300);
  }, delay);
}

/* ── WINK ────────────────────────────── */
function scheduleWink(){
  var d=4000+Math.random()*7000;
  winkTimer=setTimeout(function(){
    if(!busy){
      var s=Math.random()>.5?'vth-wl':'vth-wr';
      wrap.classList.add(s);
      setTimeout(function(){wrap.classList.remove(s);},400);
    }
    scheduleWink();
  },d);
}

/* ── HELPERS ─────────────────────────── */
function playAnim(n,d){
  if(!svgEl) return;
  svgEl.style.animation=n+' '+(d/1000).toFixed(2)+'s cubic-bezier(.22,1,.36,1) 1 forwards,vth-glow 3.4s ease-in-out infinite';
  setTimeout(function(){svgEl.style.animation='';},d+80);
}
function setFace(s){
  var mo=wrap&&wrap.querySelector('#vth-mouth');
  if(!mo) return;
  if(s==='huge') mo.setAttribute('d','M14 48 Q30 62 46 48');
}

/* ── INIT ────────────────────────────── */
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',build);
} else { build(); }

})();