/* ═══════════════════════════════════════════════════════
   VELOTOOLS — NEURAL CANVAS ANIMATION
   File: js/neuron-canvas.js

   Sections:
   1. CONFIG — node colours, sizes, motion params
   2. INIT / RESIZE
   3. PULSES — travelling signals between nodes
   4. DRAW LOOP — connections, nodes, effects
   5. WANDERER — red neuron that roams the network
   6. INTERACTION — grab, struggle, ripples, cursor
═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  var cv = document.getElementById('ncw');
  if (!cv) return;
  var ctx = cv.getContext('2d');

  /* ── 1. CONFIG ────────────────────────────────────── */
  var DEF = [
    { col:'#9b87f5', r:4.5, fx:.00031, fy:.00019, px:.15, py:.35, ax:0.12, ay:0.1  },
    { col:'#5dcaa5', r:1.8, fx:.00017, fy:.00041, px:.5,  py:.2,  ax:0.23, ay:0.19 },
    { col:'#e8a0c8', r:3.2, fx:.00023, fy:.00013, px:.8,  py:.6,  ax:0.19, ay:0.18 },
    { col:'#9b87f5', r:1.4, fx:.00039, fy:.00027, px:.3,  py:.7,  ax:0.24, ay:0.14 },
    { col:'#6ee7c7', r:5,   fx:.00013, fy:.00033, px:.65, py:.45, ax:0.17, ay:0.21 },
    { col:'#e8a0c8', r:2,   fx:.00028, fy:.00021, px:.5,  py:.8,  ax:0.22, ay:0.12 },
    { col:'#b8a4ff', r:1.2, fx:.00044, fy:.00015, px:.2,  py:.5,  ax:0.2,  ay:0.17 },
    { col:'#5dcaa5', r:3.8, fx:.00018, fy:.00037, px:.75, py:.25, ax:0.18, ay:0.19 },
    { col:'#9b87f5', r:2.5, fx:.00033, fy:.00025, px:.4,  py:.55, ax:0.12, ay:0.1  },
    { col:'#e8a0c8', r:1.6, fx:.00021, fy:.00043, px:.9,  py:.4,  ax:0.15, ay:0.2  }
  ];

  /* ── 2. INIT / RESIZE ─────────────────────────────── */
  var W, H, t = 0, nodes = [], pulses = [];

  /* interaction state — declared here so draw() can access them */
  var queenGrabbed = false, mx = 0, my = 0;
  var ripples = [], struggleT = 0, curX = -1, curY = -1;
  var wand = null;

  function resize() {
    var rect = cv.getBoundingClientRect();
    W = Math.floor(rect.width) || cv.offsetWidth || 600;
    H = 200;
    cv.width  = W; cv.height = H;
    cv.style.width  = W + 'px';
    cv.style.height = H + 'px';
    nodes = DEF.map(function (d) {
      return Object.assign({}, d, {
        ox: Math.random() * Math.PI * 2,
        oy: Math.random() * Math.PI * 2,
        x: d.px * W,
        y: d.py * H,
        fire: 0
      });
    });
  }

  var _ro = new ResizeObserver(function () { resize(); });
  _ro.observe(cv);

  /* ── 3. PULSES ────────────────────────────────────── */
  function launch() {
    var a = nodes[Math.floor(Math.random() * nodes.length)];
    var b = nodes[Math.floor(Math.random() * nodes.length)];
    if (a === b) return;
    a.fire = 1;
    pulses.push({
      ax: a.x, ay: a.y, bx: b.x, by: b.y,
      ti: nodes.indexOf(b), col: a.col,
      p: 0, sp: .0025 + Math.random() * .002
    });
  }
  setInterval(launch, 1100);
  setInterval(launch, 1800);

  /* ── 4. DRAW LOOP ─────────────────────────────────── */
  function draw() {
    t += 1;
    ctx.clearRect(0, 0, W, H);

    /* wanderer repulsion source */
    var qx = -1, qy = -1;
    if (wand && (wand.phase === 'travel' || wand.phase === 'pause' || wand.phase === 'held')) {
      if (wand.phase === 'held') {
        qx = mx; qy = my;
      } else {
        var si2 = wand.seg < wand.path.length - 1 ? wand.seg : wand.path.length - 2;
        var na2 = nodes[wand.path[si2]], nb2 = nodes[wand.path[si2 + 1]];
        var pp2 = wand.phase === 'pause' ? 1 : (.5 - .5 * Math.cos(wand.p * Math.PI));
        qx = na2.x + (nb2.x - na2.x) * pp2;
        qy = na2.y + (nb2.y - na2.y) * pp2;
      }
    }

    /* node positions + fear */
    nodes.forEach(function (n) {
      n.x = (n.px + Math.sin(t * n.fx + n.ox) * n.ax) * W;
      n.y = (n.py + Math.sin(t * n.fy + n.oy) * n.ay) * H;
      if (qx >= 0) {
        var fdx = n.x - qx, fdy = n.y - qy;
        var fd  = Math.hypot(fdx, fdy) || 1;
        var str = Math.max(0, 1 - fd / (W * .42)) * (queenGrabbed ? 1.8 : 0.7);
        n.fearDx = (n.fearDx || 0) + fdx / fd * str * 1.6;
        n.fearDy = (n.fearDy || 0) + fdy / fd * str * 1.6;
      }
      n.fearDx = (n.fearDx || 0) * 0.94;
      n.fearDy = (n.fearDy || 0) * 0.94;
      n.x += n.fearDx; n.y += n.fearDy;
      n.x = Math.max(n.r * 3, Math.min(W - n.r * 3, n.x));
      n.y = Math.max(n.r * 3, Math.min(H - n.r * 3, n.y));
    });

    /* connections */
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var na = nodes[i], nb = nodes[j];
        var d = Math.hypot(na.x - nb.x, na.y - nb.y), maxD = W * .55;
        if (d < maxD) {
          var al = .13 * (1 - d / maxD) * (1 - d / maxD);
          ctx.beginPath(); ctx.moveTo(na.x, na.y); ctx.lineTo(nb.x, nb.y);
          ctx.strokeStyle = 'rgba(155,135,245,' + al + ')';
          ctx.lineWidth = .7; ctx.stroke();
        }
      }
    }

    /* travelling pulses */
    for (var i = pulses.length - 1; i >= 0; i--) {
      var p = pulses[i]; p.p += p.sp;
      if (p.p >= 1) { if (nodes[p.ti]) nodes[p.ti].fire = 1; pulses.splice(i, 1); continue; }
      var e   = .5 - .5 * Math.cos(p.p * Math.PI);
      var ppx = p.ax + (p.bx - p.ax) * e, ppy = p.ay + (p.by - p.ay) * e;
      var g   = ctx.createRadialGradient(ppx, ppy, 0, ppx, ppy, 9);
      g.addColorStop(0, p.col + 'dd'); g.addColorStop(.5, p.col + '33'); g.addColorStop(1, p.col + '00');
      ctx.beginPath(); ctx.arc(ppx, ppy, 9, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); ctx.arc(ppx, ppy, 1.8, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fill();
    }

    /* nodes */
    nodes.forEach(function (n) {
      if (n.fire > 0) n.fire -= .018;
      var br = .92 + .08 * Math.sin(t * .009 + n.ox), r = n.r * br;
      if (n.fire > .04) {
        ctx.beginPath(); ctx.arc(n.x, n.y, r * 5 * n.fire, 0, Math.PI * 2);
        ctx.fillStyle = n.col + '18'; ctx.fill();
      }
      var g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 2.2);
      g.addColorStop(0, n.col + 'cc'); g.addColorStop(1, n.col + '00');
      ctx.beginPath(); ctx.arc(n.x, n.y, r * 2.2, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); ctx.arc(n.x, n.y, r * .55, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.fill();
    });

    drawWanderer();

    /* cursor indicator */
    if (curX >= 0 && !queenGrabbed) {
      ctx.beginPath(); ctx.arc(curX, curY, 14, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.09)'; ctx.lineWidth = 1; ctx.stroke();
      ctx.beginPath(); ctx.arc(curX, curY, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fill();
    }

    /* ripples */
    if (queenGrabbed) struggleT += 1; else struggleT = 0;
    for (var ri = ripples.length - 1; ri >= 0; ri--) {
      var rp = ripples[ri];
      rp.r += 2.8; rp.alpha -= 0.03;
      if (rp.alpha <= 0) { ripples.splice(ri, 1); continue; }
      ctx.beginPath(); ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,' + rp.alpha + ')'; ctx.lineWidth = 1.2; ctx.stroke();
      if (rp.r < 10) {
        ctx.beginPath(); ctx.arc(rp.x, rp.y, rp.r * .4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,' + (rp.alpha * .4) + ')'; ctx.fill();
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  draw();

  /* ── 5. WANDERER ──────────────────────────────────── */

  function spawnWanderer() {
    if (wand) return;
    var path = [];
    var cur  = Math.floor(Math.random() * nodes.length);
    path.push(cur);
    var steps = 3 + Math.floor(Math.random() * 4);
    for (var s = 0; s < steps; s++) {
      var candidates = [];
      for (var k = 0; k < nodes.length; k++) {
        if (k !== cur && Math.hypot(nodes[k].x - nodes[cur].x, nodes[k].y - nodes[cur].y) < W * .55)
          candidates.push(k);
      }
      if (!candidates.length) break;
      var next = candidates[Math.floor(Math.random() * candidates.length)];
      path.push(next); cur = next;
    }
    if (path.length < 2) return;
    wand = { path: path, seg: 0, p: 0, sp: .0015 + Math.random() * .001, pause: 0, alpha: 0, phase: 'fadein' };
  }

  function scheduleWanderer() {
    setTimeout(function () { spawnWanderer(); }, 5000 + Math.random() * 9000);
  }
  scheduleWanderer();

  function drawWanderer() {
    if (!wand) return;
    if (wand.phase === 'fadein')  { wand.alpha += .025; if (wand.alpha >= 1) { wand.alpha = 1; wand.phase = 'travel'; } }
    if (wand.phase === 'held')    { wand.alpha = 1; }
    if (wand.phase === 'travel')  {
      wand.p += wand.sp;
      if (wand.p >= 1) {
        wand.p = 0; wand.seg++;
        wand.phase = wand.seg >= wand.path.length - 1 ? 'pause' : 'travel';
        if (wand.phase === 'pause') wand.pause = 60;
      }
    }
    if (wand.phase === 'pause')   {
      wand.pause--;
      var pk = wand.path[wand.path.length - 1];
      nodes[pk].fire = Math.max(nodes[pk].fire, wand.pause / 60);
      if (wand.pause <= 0) wand.phase = 'fadeout';
    }
    if (wand.phase === 'fadeout') {
      wand.alpha -= .018;
      if (wand.alpha <= 0) { wand = null; scheduleWanderer(); return; }
    }

    var wx, wy;
    if (wand.phase === 'held') {
      /* struggle — overlapping sinusoids = chaotic escape attempt */
      var sAmp = 12 + Math.sin(struggleT * .05) * 5;
      wx = mx + Math.sin(struggleT * .44) * sAmp + Math.sin(struggleT * .17) * sAmp * .6 + Math.sin(struggleT * .29) * sAmp * .3;
      wy = my + Math.cos(struggleT * .38) * sAmp + Math.cos(struggleT * .23) * sAmp * .6 + Math.cos(struggleT * .11) * sAmp * .35;
    } else if (wand.phase === 'fadeout' && wand.rx !== undefined) {
      wx = wand.rx; wy = wand.ry;
    } else {
      var si = wand.seg < wand.path.length - 1 ? wand.seg : wand.path.length - 2;
      var na = nodes[wand.path[si]], nb = nodes[wand.path[si + 1]];
      var pp = wand.phase === 'pause' ? 1 : (.5 - .5 * Math.cos(wand.p * Math.PI));
      wx = na.x + (nb.x - na.x) * pp;
      wy = na.y + (nb.y - na.y) * pp;
    }

    var al     = wand.alpha;
    var isHeld = wand.phase === 'held';

    /* panic glow */
    if (isHeld) {
      var panicR = 20 + Math.sin(struggleT * .3) * 6;
      var pg = ctx.createRadialGradient(wx, wy, 0, wx, wy, panicR * 2);
      pg.addColorStop(0, 'rgba(255,80,80,' + (al * .4) + ')');
      pg.addColorStop(1, 'rgba(255,0,0,0)');
      ctx.beginPath(); ctx.arc(wx, wy, panicR * 2, 0, Math.PI * 2); ctx.fillStyle = pg; ctx.fill();
      ctx.beginPath(); ctx.arc(wx, wy, panicR, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,120,120,' + (al * .55) + ')'; ctx.lineWidth = 1.5; ctx.stroke();
    }

    var gw = ctx.createRadialGradient(wx, wy, 0, wx, wy, isHeld ? 20 : 14);
    gw.addColorStop(0, 'rgba(255,60,60,'  + (al * .85) + ')');
    gw.addColorStop(.4, 'rgba(255,30,30,' + (al * .35) + ')');
    gw.addColorStop(.75,'rgba(200,0,0,'   + (al * .12) + ')');
    gw.addColorStop(1,  'rgba(255,0,0,0)');
    ctx.beginPath(); ctx.arc(wx, wy, 16, 0, Math.PI * 2); ctx.fillStyle = gw; ctx.fill();
    ctx.beginPath(); ctx.arc(wx, wy, 3,  0, Math.PI * 2); ctx.fillStyle = 'rgba(255,200,200,' + al + ')'; ctx.fill();
    ctx.beginPath(); ctx.arc(wx, wy, 1.2, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,' + al + ')'; ctx.fill();
  }

  /* ── 6. INTERACTION ───────────────────────────────── */

  function getCanvasPos(e) {
    var r   = cv.getBoundingClientRect();
    var src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - r.left, y: src.clientY - r.top };
  }

  function onDown(e) {
    var pos = getCanvasPos(e);
    ripples.push({ x: pos.x, y: pos.y, r: 1, alpha: 0.65 });
    if (!wand || wand.phase === 'fadein' || wand.phase === 'fadeout') return;
    var wx, wy;
    if (wand.phase === 'held') { wx = mx; wy = my; }
    else {
      var si = wand.seg < wand.path.length - 1 ? wand.seg : wand.path.length - 2;
      var na = nodes[wand.path[si]], nb = nodes[wand.path[si + 1]];
      var pp = wand.phase === 'pause' ? 1 : (.5 - .5 * Math.cos(wand.p * Math.PI));
      wx = na.x + (nb.x - na.x) * pp;
      wy = na.y + (nb.y - na.y) * pp;
    }
    if (Math.hypot(pos.x - wx, pos.y - wy) < 28) {
      queenGrabbed = true; mx = pos.x; my = pos.y;
      wand.phase = 'held';
      e.preventDefault();
    }
  }

  function onMove(e) {
    if (!queenGrabbed) return;
    var pos = getCanvasPos(e);
    mx = pos.x; my = pos.y;
    e.preventDefault();
  }

  function onUp() {
    if (!queenGrabbed) return;
    queenGrabbed = false;
    if (wand) { wand.phase = 'fadeout'; wand.rx = mx; wand.ry = my; }
    nodes.forEach(function (n) { n.fearDx = n.fearDx || 0; n.fearDy = n.fearDy || 0; });
  }

  cv.addEventListener('mousedown',  onDown);
  cv.addEventListener('mousemove',  onMove);
  cv.addEventListener('mouseup',    onUp);
  cv.addEventListener('touchstart', onDown, { passive: false });
  cv.addEventListener('touchmove',  onMove, { passive: false });
  cv.addEventListener('touchend',   onUp);

  cv.addEventListener('mousemove',  function (e) { var p = getCanvasPos(e); curX = p.x; curY = p.y; });
  cv.addEventListener('mouseleave', function ()  { curX = -1; curY = -1; });

}); /* end DOMContentLoaded */