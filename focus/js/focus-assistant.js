/**
 * VeloTools — Focus Room Assistant
 * Маленький помидорчик-ассистент
 * Светится, подпрыгивает, показывает советы и лайфхаки
 * Отдельный файл — focus/focus-assistant.js
 */
(function(){
'use strict';

/* ── TIPS ── */
var TIPS = [
  { tag:'💡 Lifehack', text:'Schedule your hardest task for the first pomodoro of the day. Willpower peaks in the morning.' },
  { tag:'🧠 Science', text:'After 4 sessions your brain needs 20+ min rest. Use it wisely — walk, not scroll.' },
  { tag:'⚡ Pro tip', text:'Put your phone in another room during focus sessions. Even face-down phones reduce cognitive capacity by 10%.' },
  { tag:'🎯 Strategy', text:'Estimate every task in pomodoros, not hours. 1 pomo = 25 min. After 2 weeks you\'ll become eerily accurate.' },
  { tag:'🌊 Flow', text:'Feeling distracted in the first 5 min is normal. The flow state kicks in around minute 10. Trust the timer.' },
  { tag:'🔥 Streak', text:'One pomodoro a day keeps the streak alive. Even on bad days — just one session counts.' },
  { tag:'💬 Note it', text:'Interrupting thoughts? Write them in the note pad instantly, then forget them until break. Brain dump = focus.' },
  { tag:'🎵 Sound', text:'Cafe sounds at 60-70% volume boost creative thinking. Try it on your next brainstorming session.' },
  { tag:'😴 Energy', text:'Energy level 1-2 before a session? Do 10 jumping jacks first. Seriously — it works better than coffee.' },
  { tag:'🍅 Origin', text:'Pomodoro means "tomato" in Italian. Named after the kitchen timer Francesco Cirillo used as a student.' },
  { tag:'📊 Data', text:'Your energy pattern chart builds over 7 days. Check it every week to find your personal peak hours.' },
  { tag:'🧘 Breathing', text:'The 4-7-8 technique activates your vagus nerve. It\'s the fastest way to exit stress mode.' },
];

var tipIdx = 0;

/* ── CSS ── */
var css = document.createElement('style');
css.textContent = `
#fa-wrap {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 500;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  pointer-events: none;
}

/* tip bubble */
#fa-tip {
  background: var(--bg2, #112530);
  border: 1.5px solid var(--border2, rgba(255,255,255,.14));
  border-radius: 14px 14px 4px 14px;
  padding: 12px 15px;
  max-width: 240px;
  pointer-events: auto;
  opacity: 0;
  transform: scale(.88) translateY(8px);
  transition: opacity .28s ease, transform .32s cubic-bezier(.34,1.45,.64,1);
  box-shadow: 0 14px 40px rgba(0,0,0,.5);
  cursor: default;
}
#fa-tip.show {
  opacity: 1;
  transform: scale(1) translateY(0);
}
#fa-tip-tag {
  display: block;
  font-size: 10px; font-weight: 800;
  text-transform: uppercase; letter-spacing: .08em;
  color: var(--ac, #00c9a7);
  margin-bottom: 5px;
  font-family: 'Syne', system-ui, sans-serif;
}
#fa-tip-text {
  font-size: 12.5px; line-height: 1.65;
  color: var(--tx2, #7ab5a8);
  font-family: 'DM Sans', system-ui, sans-serif;
}
#fa-close {
  position: absolute; top:8px; right:10px;
  background:none; border:none; cursor:pointer;
  color:var(--tx3,#3d7a70); font-size:14px; line-height:1;
  padding:0; pointer-events:auto;
}
#fa-close:hover { color:var(--ac,#00c9a7); }

/* tomato */
#fa-tomato {
  width: 44px; height: 44px;
  cursor: pointer;
  pointer-events: auto;
  position: relative;
  transition: left .65s cubic-bezier(.34,1.5,.64,1),
              top  .65s cubic-bezier(.34,1.5,.64,1);
}
#fa-tomato svg {
  width: 100%; height: 100%;
  overflow: visible;
  transform-origin: 50% 65%;
  animation: fa-breathe 3s ease-in-out infinite,
             fa-glow    3s ease-in-out infinite;
}

@keyframes fa-breathe {
  0%,100%{ transform: scale(1) rotate(0deg) }
  35%    { transform: scale(1.08) rotate(-1.5deg) }
  70%    { transform: scale(1.05) rotate(1.2deg) }
}
@keyframes fa-glow {
  0%,100%{
    filter:
      drop-shadow(0 0 5px rgba(255,80,55,.85))
      drop-shadow(0 0 12px rgba(255,50,30,.4));
  }
  50%{
    filter:
      drop-shadow(0 0 9px rgba(255,110,85,1))
      drop-shadow(0 0 22px rgba(255,70,45,.6));
  }
}

/* jump away */
@keyframes fa-jump-r {
  0%  { transform:scaleX(1.3) scaleY(.72) rotate(5deg) }
  32% { transform:scaleX(.86) scaleY(1.2) rotate(-4deg) }
  60% { transform:scaleX(1.08) scaleY(.94) rotate(2deg) }
  80% { transform:scaleX(.98) scaleY(1.03) }
  100%{ transform:scaleX(1) scaleY(1) rotate(0) }
}
@keyframes fa-jump-l {
  0%  { transform:scaleX(1.3) scaleY(.72) rotate(-5deg) }
  32% { transform:scaleX(.86) scaleY(1.2) rotate(4deg) }
  60% { transform:scaleX(1.08) scaleY(.94) rotate(-2deg) }
  80% { transform:scaleX(.98) scaleY(1.03) }
  100%{ transform:scaleX(1) scaleY(1) rotate(0) }
}

/* idle bounce */
@keyframes fa-bounce {
  0%,100%{ transform:translateY(0) scaleY(1) }
  28%    { transform:translateY(-10px) scaleY(1.1) scaleX(.92) }
  52%    { transform:translateY(0) scaleY(.88) scaleX(1.08) }
  74%    { transform:translateY(-5px) scaleY(1.06) scaleX(.96) }
}
@keyframes fa-spin {
  0%  { transform:rotate(0) scale(1) }
  44% { transform:rotate(195deg) scale(1.15) }
  74% { transform:rotate(348deg) scale(.92) }
  100%{ transform:rotate(360deg) scale(1) }
}
@keyframes fa-wiggle {
  0%,100%{ transform:rotate(0) }
  18%    { transform:rotate(-20deg) scale(1.1) }
  40%    { transform:rotate(17deg) scale(.95) }
  62%    { transform:rotate(-11deg) scale(1.05) }
  80%    { transform:rotate(7deg) }
}
@keyframes fa-wink {
  0%,88%,100%{ transform:scaleY(1) }
  46%        { transform:scaleY(.05) }
}
.fa-blink #fa-el { animation:fa-wink .28s ease-in-out 1 }
.fa-blink #fa-er { animation:fa-wink .3s  ease-in-out 1 }

#fa-tomato.jumping svg {
  animation: fa-jump-r .45s cubic-bezier(.22,1,.36,1) 1 forwards,
             fa-glow 3s ease-in-out infinite;
}
`;
document.head.appendChild(css);

/* ── SVG TOMATO ── */
var SVG = `<svg viewBox="0 0 60 62" xmlns="http://www.w3.org/2000/svg">
<defs>
  <radialGradient id="fag1" cx="36%" cy="26%" r="65%">
    <stop offset="0%"   stop-color="#ff8872"/>
    <stop offset="55%"  stop-color="#e6301d"/>
    <stop offset="100%" stop-color="#8c1005"/>
  </radialGradient>
  <radialGradient id="fag2" cx="46%" cy="28%" r="52%">
    <stop offset="0%"   stop-color="rgba(255,255,255,.52)"/>
    <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
  </radialGradient>
</defs>
<ellipse cx="30" cy="37" rx="25" ry="23" fill="url(#fag1)"/>
<ellipse cx="21" cy="26" rx="8" ry="5" fill="url(#fag2)" transform="rotate(-18 21 26)"/>
<ellipse cx="38" cy="23" rx="3.5" ry="2.2" fill="rgba(255,255,255,.25)" transform="rotate(-10 38 23)"/>
<path d="M28 17 Q26 8 18 7 Q23 12 27 16" fill="#2d8a2d"/>
<path d="M30 16 Q30 6 38 5 Q34 11 30 16" fill="#237a23"/>
<rect x="28" y="14" width="4" height="11" rx="2" fill="#4ab04a"/>
<g id="fa-el" style="transform-origin:21px 33px">
  <ellipse cx="21" cy="33" rx="5.5" ry="6.2" fill="white" opacity=".95"/>
  <ellipse cx="21" cy="34" rx="3.6" ry="4.3" fill="#2a0806"/>
  <ellipse cx="22.8" cy="32" rx="1.6" ry="1.6" fill="white"/>
</g>
<g id="fa-er" style="transform-origin:39px 33px">
  <ellipse cx="39" cy="33" rx="5.5" ry="6.2" fill="white" opacity=".95"/>
  <ellipse cx="39" cy="34" rx="3.6" ry="4.3" fill="#2a0806"/>
  <ellipse cx="40.8" cy="32" rx="1.6" ry="1.6" fill="white"/>
</g>
<path d="M20 47 Q30 55 40 47" stroke="#6a0f08" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<ellipse cx="13" cy="43" rx="5" ry="2.8" fill="rgba(255,120,90,.2)"/>
<ellipse cx="47" cy="43" rx="5" ry="2.8" fill="rgba(255,120,90,.2)"/>
</svg>`;

/* ── BUILD ── */
var wrap, tomato, tip, tipTag, tipText;
var jumpDir = 1;
var jumpOffset = [-44, -52, -38, -48, -42];  /* always left */
var jumpIdx = 0;
var busy = false;
var idleTimer, winkTimer, autoTipTimer;

function build(){
  wrap = document.createElement('div');
  wrap.id = 'fa-wrap';

  tip = document.createElement('div');
  tip.id = 'fa-tip';
  tip.style.position = 'relative';
  tip.innerHTML =
    '<button id="fa-close" onclick="hideFaTip()">✕</button>'+
    '<span id="fa-tip-tag"></span>'+
    '<span id="fa-tip-text"></span>';
  tipTag  = tip.querySelector('#fa-tip-tag');
  tipText = tip.querySelector('#fa-tip-text');

  tomato = document.createElement('div');
  tomato.id = 'fa-tomato';
  tomato.innerHTML = SVG;
  tomato.setAttribute('title', 'Focus Assistant');

  wrap.appendChild(tip);
  wrap.appendChild(tomato);
  document.body.appendChild(wrap);

  tomato.addEventListener('mouseenter', onHover);
  tomato.addEventListener('click', onHover);

  scheduleIdle();
  scheduleWink();

  /* auto tip every 45 sec */
  autoTipTimer = setInterval(function(){
    if(!tip.classList.contains('show')) showNextTip();
  }, 45000);

  /* show first tip after 8s */
  setTimeout(showNextTip, 8000);
}

/* ── HOVER = JUMP + SHOW TIP ── */
function onHover(){
  if(busy) return;
  busy = true;

  var mobile = window.innerWidth < 768;
  var dx = mobile ? -28 : (jumpOffset[jumpIdx % jumpOffset.length]); jumpIdx++;
  var dy = mobile ? -20 : -8;

  var svgEl = tomato.querySelector('svg');
  svgEl.style.animation =
    'fa-jump-l .42s cubic-bezier(.22,1,.36,1) 1 forwards, fa-glow 3s ease-in-out infinite';
  tomato.style.position = 'relative';
  tomato.style.left = dx+'px';
  tomato.style.top  = dy+'px';

  showNextTip();

  setTimeout(function(){
    tomato.style.left = '0px';
    tomato.style.top  = '0px';
    svgEl.style.animation = '';
    busy = false;
  }, 750);
}

/* ── TIPS ── */
function showNextTip(){
  var t = TIPS[tipIdx % TIPS.length]; tipIdx++;
  tipTag.textContent  = t.tag;
  tipText.textContent = t.text;
  tip.classList.add('show');
  clearTimeout(autoTipTimer);
  /* auto-hide after 6s */
  setTimeout(hideFaTip, 6000);
}

window.hideFaTip = function(){
  tip.classList.remove('show');
};

/* ── IDLE ANIMATIONS ── */
var IDLES = [
  {n:'fa-bounce', d:820},
  {n:'fa-spin',   d:720},
  {n:'fa-wiggle', d:760},
  {n:'fa-bounce', d:800},
];
var lastIdle = -1;

function scheduleIdle(){
  idleTimer = setTimeout(function(){
    if(!busy){
      var pool = IDLES.filter(function(_,i){ return i!==lastIdle; });
      var pick = pool[Math.floor(Math.random()*pool.length)];
      lastIdle = IDLES.indexOf(pick);
      var svgEl = tomato && tomato.querySelector('svg');
      if(svgEl){
        svgEl.style.animation = pick.n+' '+(pick.d/1000).toFixed(2)+'s cubic-bezier(.22,1,.36,1) 1 forwards, fa-glow 3s ease-in-out infinite';
        setTimeout(function(){ svgEl.style.animation=''; }, pick.d+80);
      }
    }
    scheduleIdle();
  }, 3500 + Math.random()*4000);
}

function scheduleWink(){
  setTimeout(function(){
    if(!busy){
      tomato.classList.add('fa-blink');
      setTimeout(function(){ tomato.classList.remove('fa-blink'); }, 350);
    }
    scheduleWink();
  }, 5000 + Math.random()*8000);
}

/* ── INIT ── */
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded', build);
} else { build(); }

})();