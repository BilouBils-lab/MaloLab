'use strict';
/* =========================================================
   Écriture cursive (lettres attachées) — tracés vectoriels
   Repère : ligne d'écriture y = 0, hauteur d'une lettre courte = 10
   (1 interligne Seyès). Les y négatifs montent.
   Chaque lettre : b = corps du tracé (commence par M), w = avance,
   ey = hauteur de sortie (0 ou -8 pour les liaisons hautes),
   x = traits ajoutés après (point du i, barre du t...).
   L'attaque (liaison venant de la lettre précédente) est calculée.
   ========================================================= */
const CURSIVE = {
  a: { b: 'M7.3 -8.5 C5.5 -11 1 -10.5 0.8 -5 C0.6 -0.5 6.5 -0.5 7.3 -6 L7.6 -10 L7.3 -2.5 C7.2 0 9.2 0.2 11 -1.2', w: 11, e: [0.9, -5.5, 2.6, -12] },
  b: { b: 'M2.8 -8 C6 -14 7 -24 5 -28 C4 -31 1.5 -30 1.8 -25 L2.4 -3 C3 0 7.5 0 7.8 -5 C8 -8.5 6.5 -10 6 -9 C7 -8 9 -7.8 11 -8', w: 11, ey: -8 },
  c: { b: 'M7 -8.6 C5.5 -11 1 -10.5 0.8 -5 C0.6 -1 3 0.3 5 0 C6.5 -0.3 7.5 -0.8 8.5 -1.2', w: 8.5, e: [0.9, -5.5, 2.6, -12] },
  d: { b: 'M7.3 -8.5 C5.5 -11 1 -10.5 0.8 -5 C0.6 -0.5 6.5 -0.5 7.3 -6 L7.7 -20 L7.3 -2.5 C7.2 0 9.2 0.2 11 -1.2', w: 11, e: [0.9, -5.5, 2.6, -12] },
  e: { b: 'M1.5 -3.5 C5 -4 8 -6 7 -8.5 C6 -11 1 -10 0.8 -5 C0.6 -1 3 0.3 5 0 C6.5 -0.3 7.5 -0.8 8.5 -1.2', w: 8.5 },
  f: { b: 'M2.8 -8 C6 -14 7 -24 5 -28 C4 -31 1.5 -30 1.8 -25 L2.2 15 C2.3 19 5.5 18 5.2 13.5 C5 9 3.5 2 2.6 -0.6 C4.5 -0.8 7 -0.8 9 -1.2', w: 9 },
  g: { b: 'M7.3 -8.5 C5.5 -11 1 -10.5 0.8 -5 C0.6 -0.5 6.5 -0.5 7.3 -6 L7.6 -10 L7.4 14 C7.3 19 2 19 3 14 C4 9 8 1.5 11 -1.2', w: 11, e: [0.9, -5.5, 2.6, -12] },
  h: { b: 'M2.8 -8 C6 -14 7 -24 5 -28 C4 -31 1.5 -30 1.8 -25 L2 0 L2.3 -5 C3.5 -10 8 -11 8 -6 L7.8 -2.5 C7.7 0 9.8 0.2 11.5 -1.2', w: 11.5 },
  i: { b: 'M3 -10 L2.6 -2.5 C2.4 0 4.5 0.2 6.5 -1.2', w: 6.5, x: ['M3.1 -15.2 L3.15 -15.1'] },
  j: { b: 'M3 -10 L3 14 C3 19 -2 19 -1 14 C0 9 4 1.5 7 -1.2', w: 7, x: ['M3.1 -15.2 L3.15 -15.1'] },
  k: { b: 'M2.8 -8 C6 -14 7 -24 5 -28 C4 -31 1.5 -30 1.8 -25 L2 0 L2.3 -5 C4 -10 9 -10 8 -7 C7 -4.5 4.5 -5 3.6 -5 C6 -4 7 -1 8.5 -0.5 C9.5 -0.3 10.5 -0.7 11.5 -1.2', w: 11.5 },
  l: { b: 'M2.8 -8 C6 -14 7 -24 5 -28 C4 -31 1.5 -30 1.8 -25 L2.5 -3 C2.7 0 5 0.2 7 -1.2', w: 7 },
  m: { b: 'M1.2 -8.5 C2.5 -10.5 4 -10 3.8 -7 L3.6 0 L3.9 -6 C5 -10 9 -10.5 9 -6 L8.8 0 L9.1 -6 C10 -10 14.5 -10.5 14.5 -6 L14.3 -2.5 C14.2 0 16.3 0.2 18 -1.2', w: 18 },
  n: { b: 'M1.2 -8.5 C2.5 -10.5 4 -10 3.8 -7 L3.6 0 L3.9 -6 C5 -10 9.5 -10.5 9.5 -6 L9.3 -2.5 C9.2 0 11.3 0.2 13 -1.2', w: 13 },
  o: { b: 'M7 -9 C5.5 -11 1 -10.5 0.8 -5 C0.6 -0.5 7 -0.5 7.3 -6 C7.4 -8 7.2 -9.6 6.5 -9.4 C7.5 -8 9 -7.8 11 -8', w: 11, ey: -8, e: [0.9, -5.5, 2.6, -12] },
  p: { b: 'M2 -10.5 L2.2 18 L2.4 -6 C4 -11 10 -10 9.5 -5 C9 0 4 0.5 2.6 -2 C5 -0.5 9 0 11 -1.2', w: 11 },
  q: { b: 'M7.3 -8.5 C5.5 -11 1 -10.5 0.8 -5 C0.6 -0.5 6.5 -0.5 7.3 -6 L7.6 -10 L7.4 13 C7.4 18 10.5 17 10.2 13 C10 9 9 2 11.5 -1.2', w: 11.5, e: [0.9, -5.5, 2.6, -12] },
  r: { b: 'M2 -10 C3 -11 4 -9.2 5 -9.5 C6 -9.8 6.5 -10 6.8 -9 L6.5 -2.5 C6.4 0 8.5 0.2 10 -1.2', w: 10 },
  s: { b: 'M2 -10 C5 -8 7 -5 6 -2 C5 0.5 1.5 0.2 1.5 -1.5 C3.5 -1 6 -0.8 8.5 -1.2', w: 8.5 },
  t: { b: 'M3 -20 L2.6 -2.5 C2.4 0 4.5 0.2 6.5 -1.2', w: 6.5, x: ['M0.2 -11 L6.2 -11'] },
  u: { b: 'M2.5 -10 L2 -3 C1.8 0 5 0.5 7.5 -4 L8 -10 L7.6 -2.5 C7.4 0 9.5 0.2 11.5 -1.2', w: 11.5 },
  v: { b: 'M1.5 -8.5 C2.5 -10.5 4 -9.5 3.8 -7 C3.5 -3 4.5 -0.5 6 -0.5 C8 -0.5 8.5 -6 8 -10 C8.5 -8.5 10 -8 12 -8', w: 12, ey: -8 },
  w: { b: 'M1.5 -8.5 C2.5 -10.5 4 -9.5 3.8 -7 C3.5 -3 4 -0.5 5.5 -0.5 C7 -0.5 7.8 -4 8 -8 C8 -4 8.8 -0.5 10.3 -0.5 C12 -0.5 13 -6 12.5 -10 C13 -8.5 14.5 -8 16.5 -8', w: 16.5, ey: -8 },
  x: { b: 'M1.5 -9 C3 -10.5 4.5 -10 5.5 -6 C6.5 -2 7.5 0 9.5 -1.2', w: 9.5, x: ['M8 -9.5 L2.2 -0.6'] },
  y: { b: 'M2.5 -10 L2 -3 C1.8 0 5 0.5 7.5 -4 L8 -10 L7.6 14 C7.5 19 2.5 19 3.5 14 C4.5 9 8.5 1.5 11.5 -1.2', w: 11.5 },
  z: { b: 'M1.5 -9 C3.5 -10.5 7 -10.5 7 -8 C7 -5.5 3.5 -1.5 3 -0.5 C5 -1 8 -0.5 7.5 4 C7 9 4 17 2 15 C0.5 13 5 3.5 10 -1.2', w: 10 },
};
// Accents : lettre de base + trait ajouté, centré sur la lettre
const ACCENTS = { 'é': ['e', 'acute'], 'è': ['e', 'grave'], 'ê': ['e', 'circ'], 'à': ['a', 'grave'], 'â': ['a', 'circ'],
  'î': ['i', 'circ'], 'ô': ['o', 'circ'], 'û': ['u', 'circ'], 'ù': ['u', 'grave'] };
const ACCENT_PATH = {
  acute: c => `M${c - 1} -13.5 L${c + 1.6} -16.5`,
  grave: c => `M${c - 1.4} -16.5 L${c + 1.2} -13.5`,
  circ: c => `M${c - 2} -13.5 L${c} -16 L${c + 2} -13.5`,
};
const ACCENT_CENTER = { e: 4.2, a: 4.2, i: 3, o: 4, u: 5 };

const cursiveSupports = text => [...text].every(ch => CURSIVE[ch] || ACCENTS[ch]);

// Construit le tracé d'un mot : { main: 'M...' (un seul geste), extras: [...], width }
function cursiveLayout(text) {
  let x = 0, y = 0, main = '';
  const extras = [], starts = [];
  [...text].forEach((ch, i) => {
    let base = ch, accent = null;
    if (ACCENTS[ch]) [base, accent] = ACCENTS[ch];
    const g = CURSIVE[base];
    const body = g.b.replace(/-?\d+(\.\d+)?/g, (n => { let k = 0; return m => (k++ % 2 === 0 ? (+m + x) : +m).toFixed(2); })());
    const [bx, by] = g.b.match(/^M(-?[\d.]+) (-?[\d.]+)/).slice(1).map(Number);
    // Attaque : courbe depuis la sortie de la lettre précédente (ou la ligne, pour la 1re lettre)
    const sx = i === 0 ? x - 1.5 : x, sy = y;
    const ex = x + bx, ey = by;
    let attack;
    if (g.e && sy > -4) {
      // Lettres rondes : la liaison monte à gauche puis passe par-dessus la boucle
      const [a1, b1, a2, b2] = g.e;
      attack = `M${sx.toFixed(2)} ${sy.toFixed(2)} C${(x + a1).toFixed(2)} ${b1} ${(x + a2).toFixed(2)} ${b2} ${ex.toFixed(2)} ${ey.toFixed(2)}`;
    } else {
      const cx = sx + (ex - sx) * 0.55, cy = sy - (sy - ey) * 0.2;
      attack = `M${sx.toFixed(2)} ${sy.toFixed(2)} Q${cx.toFixed(2)} ${cy.toFixed(2)} ${ex.toFixed(2)} ${ey.toFixed(2)}`;
    }
    starts.push([sx, sy]);
    main += (i === 0 ? attack : attack.replace(/^M[^QC]+/, ' ')) + ' ' + body.replace(/^M[^LCQ]+/, ' ');
    (g.x || []).forEach(p => extras.push(p.replace(/-?\d+(\.\d+)?/g, (n => { let k = 0; return m => (k++ % 2 === 0 ? (+m + x) : +m).toFixed(2); })())));
    if (accent) extras.push(ACCENT_PATH[accent](x + ACCENT_CENTER[base]));
    x += g.w; y = g.ey || -1.2;
  });
  return { main: main.replace(/\s+/g, ' ').trim(), extras, width: x, start: starts[0] };
}

// Cahier Seyès : interlignes fins tous les 10, ligne d'écriture épaisse, marge rouge
function seyesSVG(x0, x1, y0, y1) {
  let s = '';
  for (let y = Math.ceil(y0 / 10) * 10; y <= y1; y += 10) {
    const thick = y % 40 === 0;
    s += `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${thick ? '#8C9BD4' : '#C9D1F0'}" stroke-width="${thick ? 0.45 : 0.25}"/>`;
  }
  for (let x = Math.ceil(x0 / 10) * 10; x <= x1; x += 10) s += `<line x1="${x}" y1="${y0}" x2="${x}" y2="${y1}" stroke="#E2E6F6" stroke-width="0.2"/>`;
  return s;
}

/* =========================================================
   Exercice : repasser en cursive (Apple Pencil ou doigt)
   ========================================================= */
const SVGNS = 'http://www.w3.org/2000/svg';
let penSeen = false; // dès qu'un Apple Pencil est utilisé, les contacts du doigt / de la paume sont ignorés

function samplePath(svg, d, step = 0.6) {
  const p = document.createElementNS(SVGNS, 'path');
  p.setAttribute('d', d); p.setAttribute('fill', 'none'); p.setAttribute('visibility', 'hidden');
  svg.appendChild(p);
  const len = p.getTotalLength(), pts = [];
  for (let l = 0; l <= len; l += step) { const q = p.getPointAtLength(l); pts.push({ x: q.x, y: q.y }); }
  p.remove();
  return { pts, len };
}

// opts.layout : fonction de tracé (cursive par défaut, ou chiffres) ; opts.title : consigne affichée
function cursiveQ(text, kind, opts = {}) {
  const layout = opts.layout || cursiveLayout;
  return {
    key: text,
    text: opts.title || `Écris en attaché : <b class="cw">${esc(text)}</b>`,
    say: `Repasse sur ${kind} ${text}, en partant du point vert.`,
    build(z, answer) {
      const L = layout(text);
      const minW = 34, pad = Math.max(5, (minW - L.width) / 2);
      const x0 = -1.5 - pad, x1 = L.width + pad, y0 = -34, y1 = 22, W = x1 - x0, H = y1 - y0;
      z.innerHTML = `
        <div class="cursive-wrap">
          <svg class="cursive" viewBox="${x0} ${y0} ${W} ${H}" xmlns="${SVGNS}">
            <g class="paper"></g>
            <g class="model">
              <path d="${L.main}"/>${L.extras.map(e => `<path d="${e}"/>`).join('')}
            </g>
            <g class="arrows"></g>
            <path class="demo" d="${L.main}"/>
            <circle class="tip" r="1.1" cx="-99" cy="-99"/>
            <circle class="start" cx="${L.start[0]}" cy="${L.start[1]}" r="1.6"/>
            <g class="ink"></g>
          </svg>
        </div>
        <div class="row">
          <button class="btn sec" id="clr">${ico('eraser')} Effacer</button>
          <button class="btn sec" id="demo">${ico('eye')} Revoir</button>
          <button class="btn" id="fin">${ico('check')} J'ai fini</button>
        </div>
        <p class="pen-hint" ${penSeen ? '' : 'hidden'}>Crayon détecté : tu peux poser ta main sur l'écran.</p>`;

      const svg = z.querySelector('svg.cursive');
      // Cadrage vertical sur la hauteur utile du mot (lettres courtes = cahier moins haut, modèle plus grand)
      const M = samplePath(svg, L.main);
      const E = L.extras.map(e => samplePath(svg, e, 0.4).pts);
      const ys = M.pts.concat(...E).map(q => q.y);
      const vy0 = Math.min(-20, Math.floor((Math.min(...ys) - 3) / 10) * 10);
      const vy1 = Math.max(10, Math.ceil((Math.max(...ys) + 3) / 10) * 10);
      const VH = vy1 - vy0;
      svg.setAttribute('viewBox', `${x0} ${vy0} ${W} ${VH}`);
      svg.querySelector('.paper').innerHTML = `<rect x="${x0}" y="${vy0}" width="${W}" height="${VH}" fill="#fff"/>${seyesSVG(x0, x1, vy0, vy1)}`;
      // Taille : le plus grand possible dans l'espace disponible
      const compact = matchMedia('(orientation: landscape) and (max-height: 560px)').matches;
      const availW = compact ? z.clientWidth * 0.62 : z.clientWidth - 8;
      const availH = window.innerHeight - z.getBoundingClientRect().top - (compact ? 16 : (window.innerWidth < 500 ? 150 : 120));
      const scale = Math.max(3, Math.min(availW / W, availH / VH, 16));
      svg.style.width = (W * scale) + 'px'; svg.style.height = (VH * scale) + 'px';

      // Flèches de sens le long du modèle
      const arrows = svg.querySelector('.arrows');
      const ref = svg.querySelector('.demo');
      for (let l = 9; l < M.len - 4; l += 13) {
        const a = ref.getPointAtLength(l), b = ref.getPointAtLength(l + 0.8);
        const ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
        arrows.insertAdjacentHTML('beforeend', `<path d="M-1 -1 L1.1 0 L-1 1" transform="translate(${a.x.toFixed(2)} ${a.y.toFixed(2)}) rotate(${ang.toFixed(1)})"/>`);
      }

      // Démonstration animée du geste
      const tip = svg.querySelector('.tip');
      let demoRun = 0;
      const demo = () => {
        const run = ++demoRun, dur = Math.min(6000, Math.max(1600, M.len * 28)), t0 = performance.now();
        ref.style.opacity = 1; ref.style.strokeDasharray = M.len; ref.style.strokeDashoffset = M.len;
        const step = now => {
          if (run !== demoRun || !svg.isConnected) return;
          const k = Math.min(1, (now - t0) / dur), l = M.len * k, q = ref.getPointAtLength(l);
          ref.style.strokeDashoffset = M.len - l;
          tip.setAttribute('cx', q.x); tip.setAttribute('cy', q.y);
          if (k < 1) requestAnimationFrame(step);
          else setTimeout(() => { if (run === demoRun) { ref.style.opacity = 0; tip.setAttribute('cx', -99); } }, 700);
        };
        requestAnimationFrame(step);
      };
      setTimeout(demo, 500);
      z.querySelector('#demo').onclick = demo;

      // Tracé de l'enfant
      const ink = svg.querySelector('.ink');
      let strokes = [], cur = null, activeId = null;
      const toSvg = e => { const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const q = pt.matrixTransform(svg.getScreenCTM().inverse()); return { x: q.x, y: q.y }; };
      svg.addEventListener('pointerdown', e => {
        if (e.pointerType === 'pen' && !penSeen) { penSeen = true; z.querySelector('.pen-hint').hidden = false; }
        if (penSeen && e.pointerType === 'touch') return;      // main posée sur l'écran : ignorée
        if (activeId !== null) return;
        e.preventDefault(); try { svg.setPointerCapture(e.pointerId); } catch {} activeId = e.pointerId;
        demoRun++; ref.style.opacity = 0; tip.setAttribute('cx', -99);
        const p = toSvg(e); cur = { pts: [p], el: document.createElementNS(SVGNS, 'path') };
        cur.el.setAttribute('d', `M${p.x.toFixed(2)} ${p.y.toFixed(2)} l0.01 0`);
        ink.appendChild(cur.el); strokes.push(cur);
      });
      svg.addEventListener('pointermove', e => {
        if (e.pointerId !== activeId || !cur) return;
        const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [];
        for (const ev of (evs.length ? evs : [e])) cur.pts.push(toSvg(ev));
        cur.el.setAttribute('d', 'M' + cur.pts.map(p => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' L'));
      });
      const end = e => { if (e.pointerId === activeId) { activeId = null; cur = null; } };
      svg.addEventListener('pointerup', end); svg.addEventListener('pointercancel', end);
      z.querySelector('#clr').onclick = () => { strokes = []; ink.innerHTML = ''; svg.classList.remove('ok'); };

      // Vérification : couverture, précision, sens du geste, petits traits
      z.querySelector('#fin').onclick = () => {
        const C = strokes.flatMap(s => s.pts);
        if (C.length < 6) return answer(false, 'Repasse sur le modèle avec ton crayon.');
        const D = 2.6, D2 = D * D, d2 = (a, b) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
        const near = (p, set, r2) => set.some(q => d2(p, q) < r2);
        const coverage = M.pts.filter(m => near(m, C, D2)).length / M.pts.length;
        const all = M.pts.concat(...E);
        const precision = C.filter(c => near(c, all, 4 * D2)).length / C.length;
        // Sens : on suit le modèle en avançant (fenêtre glissante vers l'avant)
        const first = strokes[0].pts[0];
        const startOk = M.pts.slice(0, Math.max(8, Math.round(M.pts.length * 0.12))).some(m => d2(m, first) < 16 * D2 / 4);
        let idx = 0, onTrack = 0, mainPts = 0;
        for (const c of C) {
          if (!near(c, M.pts, 4 * D2)) continue;
          mainPts++;
          let best = -1, bd = 4 * D2;
          for (let k = Math.max(0, idx - 12); k < Math.min(M.pts.length, idx + 70); k++) { const v = d2(c, M.pts[k]); if (v < bd) { bd = v; best = k; } }
          if (best >= 0) { onTrack++; idx = Math.max(idx, best); }
        }
        const order = mainPts ? onTrack / mainPts : 0;
        const extrasOk = E.every(set => C.some(c => near(c, set, 1.7 * D2)));
        if (!startOk || order < 0.7) return answer(false, 'Attention au sens : pars du point vert et suis les flèches.');
        if (coverage < 0.8) return answer(false, 'Repasse sur tout le modèle, jusqu\'au bout.');
        if (precision < 0.75) return answer(false, 'Essaie de rester bien sur le modèle.');
        if (!extrasOk) return answer(false, 'N\'oublie pas les petits traits : le point, la barre ou l\'accent.');
        svg.classList.add('ok');
        answer(true);
      };
    },
  };
}

/* =========================================================
   Mode papier : l'application dicte, l'enfant écrit sur son cahier,
   puis compare avec le modèle en écriture attachée.
   kind : 'syllabe' | 'mot' ; copie : modèle montré quelques secondes puis caché
   ========================================================= */
function cursiveModelHTML(text) {
  const L = cursiveLayout(text);
  return `<svg class="cursive model-only" xmlns="${SVGNS}"><g class="paper"></g>
    <g class="model ink-model"><path d="${L.main}"/>${L.extras.map(e => `<path d="${e}"/>`).join('')}</g></svg>`;
}
// Cadre l'image sur le mot et ajoute les lignes Seyès (une fois dans la page)
function fitModel(svg, maxW, maxH) {
  const g = svg.querySelector('.ink-model'), b = g.getBBox();
  const x0 = Math.floor(b.x - 6), x1 = Math.ceil(b.x + b.width + 6);
  const y0 = Math.min(-20, Math.floor((b.y - 3) / 10) * 10), y1 = Math.max(10, Math.ceil((b.y + b.height + 3) / 10) * 10);
  const W = Math.max(30, x1 - x0), H = y1 - y0;
  svg.setAttribute('viewBox', `${x0} ${y0} ${W} ${H}`);
  svg.querySelector('.paper').innerHTML = `<rect x="${x0}" y="${y0}" width="${W}" height="${H}" fill="#fff"/>${seyesSVG(x0, x0 + W, y0, y1)}`;
  const sc = Math.max(3, Math.min(maxW / W, maxH / H, 14));
  svg.style.width = (W * sc) + 'px'; svg.style.height = (H * sc) + 'px';
}
// Épeler avec le nom des lettres (écrit pour être bien lu par toutes les voix)
const LETTER_NAMES = { b: 'bé', c: 'sé', d: 'dé', f: 'èffe', g: 'jé', h: 'ache', j: 'ji', k: 'ka', l: 'elle', m: 'èmme', n: 'enne', p: 'pé', q: 'ku', r: 'erre', s: 'èsse', t: 'té', v: 'vé', w: 'double vé', x: 'ixe', y: 'i grec', z: 'zède' };
const spellOut = text => [...text.toLowerCase()].filter(c => /[a-zéèêëàâîïôûüç]/.test(c)).map(c => LETTER_NAMES[c] || c).join(', ');
function paperQ(text, kind, opts = {}) {
  const copie = !!opts.copie, emoji = opts.emoji || '';
  const what = kind === 'mot' ? 'le mot' : 'la syllabe';
  return {
    key: text,
    text: copie ? `Regarde bien ${what}, puis écris-${kind === 'mot' ? 'le' : 'la'} de mémoire` : `Écris ${what} sur ton cahier`,
    say: copie ? `Regarde bien ${what} : ${spellOut(text)} : ${text}. Garde-${kind === 'mot' ? 'le' : 'la'} dans ta tête.` : `Sur ton cahier, écris ${what} : ${text}.`,
    build(z, answer) {
      const avail = () => ({ w: Math.min(z.clientWidth - 8, 640), h: Math.max(140, window.innerHeight * 0.32) });
      const reveal = (title) => {
        z.innerHTML = `<p class="pp-title">${title}</p><div class="cursive-wrap">${cursiveModelHTML(text)}</div>
          <p class="pp-script">${esc(text)}</p>
          <div class="row"><button class="btn" id="pp-ok">${ico('check')} Je l'ai bien écrit</button><button class="btn sec" id="pp-fix">${ico('eraser')} Je corrige</button></div>`;
        const a = avail(); fitModel(z.querySelector('svg'), a.w, a.h);
        say(`Voici le modèle : ${text}. As-tu bien écrit ?`);
        z.querySelector('#pp-ok').onclick = () => answer(true);
        z.querySelector('#pp-fix').onclick = () => {
          answer(false, 'Corrige sur ton cahier, en regardant bien le modèle.');
          z.querySelector('.row').innerHTML = `<button class="btn" id="pp-done">${ico('check')} C'est corrigé</button>`;
          z.querySelector('#pp-done').onclick = () => answer(true);
        };
      };
      const writeStep = () => {
        z.innerHTML = `
          <div class="pp-dict">
            <button class="ear" data-say="${esc(text)}" aria-label="Réécouter">${ico('ear')}</button>
            ${emoji ? `<button class="m-link" id="pp-img">Aide : voir l'image</button><div class="pic pp-pic" hidden>${emoji}</div>` : ''}
          </div>
          <div class="pp-note">${ico('eye')} Écris sur ton cahier, en attaché, puis touche le bouton.</div>
          <div class="row"><button class="btn" id="pp-written">${ico('check')} J'ai écrit</button></div>`;
        const im = z.querySelector('#pp-img');
        if (im) im.onclick = () => { z.querySelector('.pp-pic').hidden = false; im.remove(); };
        z.querySelector('#pp-written').onclick = () => reveal('Compare avec ton cahier :');
      };
      if (!copie) return writeStep();
      // Regarde, cache, écris, vérifie : l'enfant cache le modèle quand il l'a en tête
      const spell = spellOut(text);
      let seen = 0;
      const look = (again) => {
        z.innerHTML = `<p class="pp-title">${again ? 'Regarde encore bien' : 'Regarde bien'}, et garde-${kind === 'mot' ? 'le' : 'la'} dans ta tête</p>
          <div class="cursive-wrap">${cursiveModelHTML(text)}</div><p class="pp-script">${esc(text)}</p>
          <div class="row"><button class="btn" id="pp-hide" disabled>${ico('eye')} Je l'ai dans ma tête</button></div><div class="pp-bar"><i></i></div>`;
        const a = avail(); fitModel(z.querySelector('svg'), a.w, a.h);
        if (again) say(`${spell} : ${text}.`);
        const bt = z.querySelector('#pp-hide');
        const t1 = setTimeout(() => { bt.disabled = false; }, 3000);
        const t2 = setTimeout(() => { if (z.isConnected && z.contains(bt)) hide(); }, 12000);
        bt.onclick = () => { clearTimeout(t1); clearTimeout(t2); hide(); };
      };
      const hide = () => {
        if (!z.isConnected) return;
        z.innerHTML = `<p class="pp-title">Le mot est caché. À toi ! Écris-${kind === 'mot' ? 'le' : 'la'} de mémoire sur ton cahier.</p>
          <div class="row"><button class="btn" id="pp-written">${ico('check')} J'ai écrit</button><button class="btn sec" id="pp-again">${ico('eye')} Revoir</button></div>`;
        say(`À toi ! Écris ${what} de mémoire.`);
        z.querySelector('#pp-written').onclick = () => reveal('Vérifie avec ton cahier :');
        z.querySelector('#pp-again').onclick = () => { if (!seen++) answer(false, 'Regarde encore, puis cache et écris.'); look(true); };
      };
      look(false);
    },
  };
}

/* =========================================================
   Dictée de phrases (mode papier) : l'application dicte, l'enfant écrit
   la phrase sur son cahier, puis compare avec le modèle (mots en attaché).
   ========================================================= */
// Un mot en attaché, à une échelle commune pour tous les mots de la phrase
// (pas de majuscules attachées : la majuscule est montrée à part, en couleur)
function cursiveWordHTML(word) {
  const svg = t => { const L = cursiveLayout(t); return `<svg class="cursive model-only pw-svg" xmlns="${SVGNS}"><g class="paper"></g><g class="model ink-model"><path d="${L.main}"/>${L.extras.map(e => `<path d="${e}"/>`).join('')}</g></svg>`; };
  return word.split("'").map(part => {
    let cap = '';
    if (part && part[0] !== part[0].toLowerCase()) { cap = `<span class="pw-cap">${esc(part[0])}</span>`; part = part.slice(1); }
    const low = part.toLowerCase();
    return cap + (!low ? '' : cursiveSupports(low) ? svg(low) : `<span class="pw-txt">${esc(part)}</span>`);
  }).join('<span class="pw-apo">\'</span>');
}
// Même hauteur de ligne pour tous les mots : les lignes du cahier se suivent d'un mot à l'autre
function fitWords(root, sc, deep) {
  const Y0 = -30, Y1 = deep ? 20 : 8;
  root.style.setProperty('--pwsc', sc);
  root.querySelectorAll('.pw-svg').forEach(svg => {
    const b = svg.querySelector('.ink-model').getBBox();
    const x0 = Math.floor(b.x - 3), W = Math.max(12, Math.ceil(b.width + 6));
    svg.setAttribute('viewBox', `${x0} ${Y0} ${W} ${Y1 - Y0}`);
    svg.querySelector('.paper').innerHTML = seyesSVG(x0, x0 + W, Y0, Y1);
    svg.style.width = (W * sc) + 'px'; svg.style.height = ((Y1 - Y0) * sc) + 'px';
  });
}
function phraseQ(sentence) {
  const words = sentence.replace(/[.!?]$/, '').split(' ');
  return {
    key: sentence,
    text: 'Écoute la phrase, et écris-la sur ton cahier',
    say: `Écris la phrase : ${sentence}`,
    build(z, answer) {
      const writeStep = () => {
        z.innerHTML = `
          <div class="pp-dict">
            <button class="ear" data-say="${esc(sentence)}" aria-label="Réécouter la phrase">${ico('ear')}</button>
            <p class="pp-title">La phrase a ${words.length} mots. Touche un numéro pour réécouter un mot.</p>
            <div class="pw-slots">${words.map((w, i) => `<button class="pw-slot" data-say="${esc(w)}">${i + 1}</button>`).join('')}</div>
          </div>
          <div class="pp-note">${ico('eye')} Écris la phrase en attaché, puis touche le bouton.</div>
          <div class="row"><button class="btn" id="pp-written">${ico('check')} J'ai écrit</button></div>`;
        z.querySelector('#pp-written').onclick = reveal;
      };
      const reveal = () => {
        z.innerHTML = `<p class="pp-title">Compare avec ton cahier :</p>
          <div class="pw-model">${words.map(w => `<span class="pw-word">${cursiveWordHTML(w)}</span>`).join('')}</div>
          <p class="pw-print">${esc(sentence)}</p>
          <div class="pw-check"><span>${ico('check')} Une majuscule au début</span><span>${ico('check')} Un espace entre les mots</span><span>${ico('check')} Un point à la fin</span></div>
          <div class="row"><button class="btn" id="pp-ok">${ico('check')} Je l'ai bien écrite</button><button class="btn sec" id="pp-fix">${ico('eraser')} Je corrige</button></div>`;
        const box = z.querySelector('.pw-model');
        fitWords(box, Math.max(1.6, Math.min(2.8, (z.clientWidth || 360) / 190)), /[fgjpqyz]/.test(sentence));
        say('Voici le modèle. As-tu mis la majuscule et le point ?');
        z.querySelector('#pp-ok').onclick = () => answer(true);
        z.querySelector('#pp-fix').onclick = () => {
          answer(false, 'Corrige sur ton cahier, mot par mot, en regardant bien le modèle.');
          z.querySelector('.row').innerHTML = `<button class="btn" id="pp-done">${ico('check')} C'est corrigé</button>`;
          z.querySelector('#pp-done').onclick = () => answer(true);
        };
      };
      writeStep();
    },
  };
}

