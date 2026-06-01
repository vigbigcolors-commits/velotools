/**
 * VeloTools — Focus Room Assistant v2
 * Томатик в правом нижнем углу
 * Клик/наведение → показывает совет (без прыжков)
 * Закрывается через 10 сек, крестиком, или кликом вне блока
 */
(function(){
'use strict';

var TIPS = [
  { tag:'💡 Lifehack',   text:'Schedule your hardest task for the first pomodoro of the day. Willpower peaks in the morning.' },
  { tag:'🧠 Science',    text:'After 4 sessions your brain needs 20+ min rest. Use it wisely — walk, not scroll.' },
  { tag:'⚡ Pro tip',    text:'Put your phone in another room during focus sessions. Even face-down phones reduce cognitive capacity by 10%.' },
  { tag:'🎯 Strategy',   text:'Estimate every task in pomodoros, not hours. 1 pomo = 25 min. After 2 weeks you\'ll become eerily accurate.' },
  { tag:'🌊 Flow',       text:'Feeling distracted in the first 5 min is normal. The flow state kicks in around minute 10. Trust the timer.' },
  { tag:'🔥 Streak',     text:'One pomodoro a day keeps the streak alive. Even on bad days — just one session counts.' },
  { tag:'💬 Note it',    text:'Interrupting thoughts? Write them in the note pad instantly, then forget them until the break. Brain dump = focus.' },
  { tag:'🎵 Sound',      text:'Cafe sounds at 60–70% volume boost creative thinking. Try it on your next brainstorming session.' },
  { tag:'😴 Energy',     text:'Energy level 1–2 before a session? Do 10 jumping jacks first. It works better than coffee.' },
  { tag:'🍅 Origin',     text:'Pomodoro means "tomato" in Italian. Named after the kitchen timer Francesco Cirillo used as a student in the 80s.' },
  { tag:'📊 Data',       text:'Your energy pattern chart builds over 7 days. Check it every week to find your personal peak performance hours.' },
  { tag:'🧘 Breathing',  text:'The 4-7-8 technique activates your vagus nerve. It\'s the fastest way to exit stress mode between sessions.' },
  { tag:'🧬 Neuroscience', text:'25 min of uninterrupted focus produces more myelin growth than 3 hours of distracted practice. Quality beats quantity.' },
  { tag:'🕐 Timing',     text:'Most people have a 2–3 hour peak cognitive window in the morning. Guard it like your most valuable asset.' },
  { tag:'🎮 Gamify it',  text:'Treat your streak like a game. Once you hit 7 days, your brain starts protecting it automatically.' },
];

var tipIdx = 0;
var hideTimer = null;

/* ── CSS ── */
var css = document.createElement('style');
css.textContent = `
#fa-wrap {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 9000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

/* bubble */
#fa-tip {
  position: relative;
  background: var(--bg2, #112530);
  border: 1.5px solid rgba(0,201,167,.35);
  border-radius: 14px 14px 4px 14px;
  padding: 14px 36px 14px 14px;
  width: 250px;
  opacity: 0;
  pointer-events: none;
  transform: translateY(8px) scale(.94);
  transition: opacity .24s ease, transform .28s cubic-bezier(.34,1.45,.64,1);
  box-shadow: 0 12px 36px rgba(0,0,0,.55);
}
#fa-tip.show {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0) scale(1);
}
#fa-tip-tag {
  display: block;
  font-size: 10px; font-weight: 800;
  text-transform: uppercase; letter-spacing: .08em;
  color: var(--ac, #00c9a7);
  margin-bottom: 6px;
  font-family: 'Syne', system-ui, sans-serif;
}
#fa-tip-text {
  font-size: 13px; line-height: 1.7;
  color: var(--tx, #e8f4f0);
  font-family: 'DM Sans', system-ui, sans-serif;
}
#fa-tip-prog {
  position: absolute;
  bottom: 0; left: 0;
  height: 2px;
  background: var(--ac, #00c9a7);
  border-radius: 0 0 0 14px;
  width: 100%;
  transform-origin: left;
  transition: transform 10s linear;
}
#fa-tip.show #fa-tip-prog { transform: scaleX(0); }

#fa-close {
  position: absolute; top: 10px; right: 10px;
  width: 20px; height: 20px;
  background: rgba(255,255,255,.06); border: none; border-radius: 50%;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  color: var(--tx3, #3d7a70); font-size: 12px; line-height: 1;
  transition: background .15s, color .15s;
  pointer-events: auto;
}
#fa-close:hover { background: rgba(255,255,255,.12); color: var(--ac, #00c9a7); }

/* tomato */
#fa-tomato {
  width: 48px; height: 48px;
  cursor: pointer;
  position: relative;
  -webkit-tap-highlight-color: transparent;
}
#fa-tomato svg {
  width: 100%; height: 100%;
  overflow: visible;
  transform-origin: 50% 65%;
  animation: fa-breathe 3.2s ease-in-out infinite,
             fa-glow    3.2s ease-in-out infinite;
}
#fa-tomato:hover svg { animation: fa-bounce .7s ease-in-out 1, fa-glow 3.2s ease-in-out infinite; }

@keyframes fa-breathe {
  0%,100%{ transform: scale(1) rotate(0deg) translateY(0) }
  30%    { transform: scale(1.08) rotate(-1.8deg) translateY(-2px) }
  65%    { transform: scale(1.05) rotate(1.4deg) translateY(-1px) }
}
@keyframes fa-glow {
  0%,100%{
    filter: drop-shadow(0 0 5px rgba(255,80,55,.85))
            drop-shadow(0 0 12px rgba(255,50,30,.38));
  }
  50%{
    filter: drop-shadow(0 0 9px rgba(255,110,85,1))
            drop-shadow(0 0 22px rgba(255,70,45,.58));
  }
}
@keyframes fa-bounce {
  0%,100%{ transform: translateY(0) scaleY(1) }
  28%    { transform: translateY(-12px) scaleY(1.12) scaleX(.91) }
  52%    { transform: translateY(0) scaleY(.87) scaleX(1.1) }
  74%    { transform: translateY(-6px) scaleY(1.07) scaleX(.96) }
}
@keyframes fa-spin {
  0%  { transform: rotate(0) scale(1) }
  44% { transform: rotate(195deg) scale(1.15) }
  74% { transform: rotate(348deg) scale(.92) }
  100%{ transform: rotate(360deg) scale(1) }
}
@keyframes fa-wiggle {
  0%,100%{ transform: rotate(0) }
  18%    { transform: rotate(-22deg) scale(1.1) }
  40%    { transform: rotate(18deg) scale(.95) }
  62%    { transform: rotate(-11deg) scale(1.05) }
  80%    { transform: rotate(7deg) }
}
@keyframes fa-wink {
  0%,88%,100%{ transform: scaleY(1) }
  46%        { transform: scaleY(.05) }
}
.fa-blink #fa-el { animation: fa-wink .28s ease-in-out 1 }
.fa-blink #fa-er { animation: fa-wink .30s ease-in-out 1 }

/* mobile */
@media(max-width:768px){
  #fa-wrap  { bottom:12px; right:12px; }
  #fa-tomato{ width:40px; height:40px; }
  #fa-tip   { width:210px; font-size:12px; }
}
`;
document.head.appendChild(css);

/* ── SVG ── */
var SVG = `<svg viewBox="0 0 60 62" xmlns="http://www.w3.org/2000/svg">
<defs>
  <radialGradient id="fag1" cx="36%" cy="26%" r="65%">
    <stop offset="0%" stop-color="#ff8872"/>
    <stop offset="55%" stop-color="#e6301d"/>
    <stop offset="100%" stop-color="#8c1005"/>
  </radialGradient>
  <radialGradient id="fag2" cx="46%" cy="28%" r="52%">
    <stop offset="0%" stop-color="rgba(255,255,255,.52)"/>
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
var wrap, tomato, tip, tipTag, tipText, prog;
var idleTimer, winkTimer;
var IDLES = [
  {n:'fa-bounce',d:800},{n:'fa-spin',d:720},
  {n:'fa-wiggle',d:760},{n:'fa-bounce',d:820},
];
var lastIdle = -1;

function build(){
  wrap = document.createElement('div');
  wrap.id = 'fa-wrap';

  /* tip bubble */
  tip = document.createElement('div');
  tip.id = 'fa-tip';
  tip.innerHTML =
    '<button id="fa-close" onclick="hideTip()">✕</button>'+
    '<span id="fa-tip-tag"></span>'+
    '<span id="fa-tip-text"></span>'+
    '<div id="fa-tip-prog"></div>';
  tipTag  = tip.querySelector('#fa-tip-tag');
  tipText = tip.querySelector('#fa-tip-text');
  prog    = tip.querySelector('#fa-tip-prog');

  /* tomato */
  tomato = document.createElement('div');
  tomato.id = 'fa-tomato';
  tomato.setAttribute('title','Focus tips & tricks');
  tomato.innerHTML = SVG;

  wrap.appendChild(tip);
  wrap.appendChild(tomato);
  document.body.appendChild(wrap);

  /* click on tomato → show next tip */
  tomato.addEventListener('click', function(e){
    e.stopPropagation();
    showTip();
  });

  /* close on click outside */
  document.addEventListener('click', function(e){
    if(tip.classList.contains('show') && !tip.contains(e.target) && e.target !== tomato){
      hideTip();
    }
  });

  /* expose close button */
  window.hideTip = hideTip;

  scheduleIdle();
  scheduleWink();

  /* tips show only on click */
}

/* ── SHOW / HIDE ── */
function showTip(){
  var t = TIPS[tipIdx % TIPS.length]; tipIdx++;
  tipTag.textContent  = t.tag;
  tipText.textContent = t.text;

  /* reset progress bar */
  prog.style.transition = 'none';
  prog.style.transform  = 'scaleX(1)';

  tip.classList.add('show');

  /* animate progress bar */
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      prog.style.transition = 'transform 10s linear';
      prog.style.transform  = 'scaleX(0)';
    });
  });

  /* auto hide after 10s */
  clearTimeout(hideTimer);
  hideTimer = setTimeout(hideTip, 10000);
}

function hideTip(){
  tip.classList.remove('show');
  clearTimeout(hideTimer);
}

/* ── IDLE ANIMATIONS ── */
function scheduleIdle(){
  clearTimeout(idleTimer);
  var pool = IDLES.filter(function(_,i){ return i !== lastIdle; });
  var pick = pool[Math.floor(Math.random() * pool.length)];
  lastIdle = IDLES.indexOf(pick);
  idleTimer = setTimeout(function(){
    var svgEl = tomato && tomato.querySelector('svg');
    if(svgEl){
      svgEl.style.animation =
        pick.n + ' ' + (pick.d/1000).toFixed(2) +
        's cubic-bezier(.22,1,.36,1) 1 forwards, fa-glow 3.2s ease-in-out infinite';
      setTimeout(function(){ svgEl.style.animation = ''; }, pick.d + 80);
    }
    scheduleIdle();
  }, 4000 + Math.random() * 5000);
}

/* ── WINK — both eyes realistic ── */
function scheduleWink(){
  setTimeout(function(){
    tomato.classList.add('fa-blink');
    setTimeout(function(){ tomato.classList.remove('fa-blink'); }, 340);
    scheduleWink();
  }, 5000 + Math.random() * 9000);
}

/* ── INIT ── */
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', build);
} else { build(); }

})();