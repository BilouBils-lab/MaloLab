'use strict';
/* =========================================================
   P'tit Écolier — exercices de CP (maths, lecture, écriture)
   ========================================================= */

/* ---------- Données (faciles à modifier) ---------- */
// [mot, image]. Ajoutez ou retirez des mots ici.
const WORDS = [
  ['dé', '🎲'], ['clé', '🔑'], ['lit', '🛏️'], ['rat', '🐀'], ['bus', '🚌'], ['sac', '👜'],
  ['nez', '👃'], ['ours', '🐻'], ['chat', '🐱'], ['lune', '🌙'], ['vélo', '🚲'], ['robe', '👗'],
  ['moto', '🏍️'], ['lion', '🦁'], ['loup', '🐺'], ['pied', '🦶'], ['main', '✋'], ['lama', '🦙'],
  ['kiwi', '🥝'], ['bébé', '👶'], ['pomme', '🍎'], ['poule', '🐔'], ['lapin', '🐰'], ['sapin', '🎄'],
  ['avion', '✈️'], ['fusée', '🚀'], ['robot', '🤖'], ['vache', '🐮'], ['livre', '📖'], ['fleur', '🌸'],
  ['arbre', '🌳'], ['nuage', '☁️'], ['pizza', '🍕'], ['panda', '🐼'], ['zèbre', '🦓'], ['tomate', '🍅'],
  ['tortue', '🐢'], ['souris', '🐭'], ['canard', '🦆'], ['cheval', '🐴'], ['maison', '🏠'], ['banane', '🍌'],
  ['citron', '🍋'], ['gâteau', '🎂'], ['ballon', '🎈'], ['bateau', '⛵'], ['soleil', '☀️'], ['étoile', '⭐'],
  ['cadeau', '🎁'], ['mouton', '🐑'],
];
// Mots dont la 1re lettre ne correspond pas au 1er son (évite la confusion en CP)
const NO_FIRST = new Set(['chat', 'cheval', 'ours', 'citron']);
const CONSONNES = 'mlprstnvfbdj'.split('');
const VOYELLES = ['a', 'i', 'o', 'u', 'é'];
const EMOJIS_COUNT = ['🍎', '⭐', '🐞', '🐟', '🎈', '🍓', '🚗', '🐥', '🌼', '🍪'];
const PRAISE = ['Bravo', 'Super', 'Génial', 'Bien joué', 'Excellent', 'Parfait'];
const RETRY = ['Essaie encore !', 'Presque ! Essaie encore.', 'Oups, essaie encore.'];
const QUESTIONS_PAR_PARTIE = 5;

/* ---------- Sauvegarde locale ---------- */
const KEY = 'ptit-ecolier';
const DEFAULTS = { name: '', level: 1, caps: false, voice: true, stars: 0, act: {} };
const state = (() => {
  try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(KEY) || '{}')); }
  catch { return { ...DEFAULTS }; }
})();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} };

/* ---------- Outils ---------- */
const $ = s => document.querySelector(s);
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const sample = (a, n) => shuffle(a).slice(0, n);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const maxN = () => [5, 10, 20][state.level - 1];
const L = s => state.caps ? s.toUpperCase() : s;          // minuscules / MAJUSCULES
const words = () => WORDS.filter(([w]) => w.length <= [4, 5, 99][state.level - 1]);
const emojis = (e, n) => Array(n).fill(`<span>${e}</span>`).join('');
const FONT = getComputedStyle(document.documentElement).getPropertyValue('--font');

function numChoices(ans, lo, hi, k = 3) {
  const s = new Set([ans]);
  for (let t = 0; s.size < k && t < 60; t++) {
    const c = ans + pick([-3, -2, -1, 1, 2, 3]);
    if (c >= lo && c <= hi) s.add(c);
  }
  while (s.size < k) s.add(hi + s.size);
  return shuffle([...s]);
}

/* ---------- Voix & sons ---------- */
let frVoice = null;
function pickVoice() {
  if (!('speechSynthesis' in window)) return;
  const vs = speechSynthesis.getVoices();
  frVoice = vs.find(v => v.lang === 'fr-FR' && /Amélie|Audrey|Marie|Thomas/i.test(v.name))
         || vs.find(v => v.lang === 'fr-FR') || vs.find(v => v.lang.startsWith('fr')) || null;
}
if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }

function say(text, rate = 0.9) {
  if (!state.voice || !('speechSynthesis' in window) || !text) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'fr-FR'; u.rate = rate;
  if (frVoice) u.voice = frVoice;
  speechSynthesis.speak(u);
}

let ac = null;
function beep(seq) {
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    if (ac.state === 'suspended') ac.resume();
    let t = ac.currentTime;
    for (const [f, d] of seq) {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g).connect(ac.destination);
      o.start(t); o.stop(t + d + 0.05);
      t += d * 0.8;
    }
  } catch {}
}
const sfxOK = () => beep([[523, .14], [659, .14], [784, .3]]);
const sfxNo = () => beep([[240, .12], [200, .25]]);
const sfxPop = () => beep([[700, .08]]);

// iOS : le son et la voix doivent être « débloqués » par un premier toucher
document.addEventListener('pointerdown', () => {
  beep([[1, .01]]);
  if ('speechSynthesis' in window && state.voice) { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); }
}, { once: true });

// Tout élément avec data-say lit son texte quand on le touche
document.addEventListener('click', e => { const t = e.target.closest('[data-say]'); if (t) say(t.dataset.say, 0.8); });
document.addEventListener('gesturestart', e => e.preventDefault()); // pas de zoom au pincement

/* ---------- Effets ---------- */
function pop(emoji) {
  const d = document.createElement('div');
  d.className = 'pop'; d.textContent = emoji;
  document.body.appendChild(d); setTimeout(() => d.remove(), 1100);
}
function confetti() {
  const set = ['⭐', '🎉', '🌟', '🎈', '✨', '🍬'];
  for (let i = 0; i < 28; i++) {
    const d = document.createElement('div');
    d.className = 'confetti'; d.textContent = pick(set);
    d.style.left = Math.random() * 100 + 'vw';
    d.style.animationDuration = (2 + Math.random() * 2) + 's';
    d.style.animationDelay = Math.random() * 0.8 + 's';
    document.body.appendChild(d); setTimeout(() => d.remove(), 5000);
  }
}

/* =========================================================
   Types de questions
   Chaque question = { key, text (affiché), say (lu), build(zone, answer) }
   answer(true) = réussi ; answer(false, message?) = erreur
   ========================================================= */

// Question à choix (boutons)
function choiceBuild({ top = '', choices, isRight, label = c => c, cls = '' }) {
  return (z, answer) => {
    z.innerHTML = `<div class="visual">${top}</div>
      <div class="choices ${cls}">${choices.map((c, i) => `<button class="choice" data-i="${i}">${label(c)}</button>`).join('')}</div>`;
    z.querySelectorAll('.choice').forEach(b => b.addEventListener('click', () => {
      if (isRight(choices[b.dataset.i])) {
        b.classList.add('good');
        z.querySelectorAll('.choice').forEach(x => x.disabled = true);
        answer(true);
      } else {
        b.classList.add('bad'); b.disabled = true;
        answer(false);
      }
    }));
  };
}

// Remettre les lettres dans l'ordre (glisser ou toucher)
function spellQ(word, emoji) {
  const letters = [...word];
  const isWord = !!emoji;
  return {
    key: word,
    text: isWord ? 'Écris le mot' : 'Écris la syllabe',
    say: isWord ? `Écris le mot : ${word}` : `Écris la syllabe : ${word}`,
    build(z, answer) {
      let order;
      do order = shuffle(letters.map((_, k) => k));
      while (letters.length > 1 && order.every((v, j) => letters[v] === letters[j]));

      z.innerHTML = `
        <button class="${isWord ? 'pic' : 'ear'}" data-say="${esc(word)}" aria-label="Écouter">${isWord ? emoji : '👂'}</button>
        <div class="slots" style="--n:${letters.length}">${letters.map((_, k) => `<div class="slot" data-k="${k}"></div>`).join('')}</div>
        <div class="tiles" style="--n:${letters.length}">${order.map(k => `<div class="tile" data-l="${esc(letters[k])}">${esc(L(letters[k]))}</div>`).join('')}</div>`;

      const slots = [...z.querySelectorAll('.slot')];
      let errors = 0, done = 0;
      const nextSlot = () => slots.find(s => !s.classList.contains('ok'));

      // Après 2 erreurs, on montre la bonne lettre
      const hint = () => {
        z.querySelectorAll('.hint').forEach(t => t.classList.remove('hint'));
        if (errors < 2) return;
        const s = nextSlot(); if (!s) return;
        const t = [...z.querySelectorAll('.tile:not(.used)')].find(t => t.dataset.l === letters[s.dataset.k]);
        if (t) t.classList.add('hint');
      };
      const fill = (tile, slot) => {
        slot.textContent = tile.textContent; slot.classList.add('ok');
        tile.classList.add('used'); done++; sfxPop(); hint();
        if (done === letters.length) answer(true);
      };
      const wrong = tile => {
        errors++; tile.classList.remove('shake'); void tile.offsetWidth; tile.classList.add('shake');
        answer(false); hint();
      };
      const slotAt = (x, y) => {
        let best = null, bd = Infinity;
        for (const s of slots) {
          const r = s.getBoundingClientRect();
          const d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2));
          if (d < bd && d < r.width * 1.1) { bd = d; best = s; }
        }
        return best;
      };

      z.querySelectorAll('.tile').forEach(tile => {
        tile.addEventListener('pointerdown', e => {
          if (tile.classList.contains('used')) return;
          e.preventDefault();
          tile.setPointerCapture(e.pointerId);
          const sx = e.clientX, sy = e.clientY; let moved = false;
          tile.classList.add('drag');
          const mv = ev => {
            const dx = ev.clientX - sx, dy = ev.clientY - sy;
            if (Math.hypot(dx, dy) > 8) moved = true;
            tile.style.transform = `translate(${dx}px, ${dy}px) scale(1.1)`;
          };
          const up = ev => {
            tile.removeEventListener('pointermove', mv);
            tile.removeEventListener('pointerup', up);
            tile.removeEventListener('pointercancel', up);
            tile.classList.remove('drag'); tile.style.transform = '';
            if (ev.type === 'pointercancel') return;
            const target = moved ? slotAt(ev.clientX, ev.clientY) : nextSlot(); // toucher = case suivante
            if (!target || target.classList.contains('ok')) return;
            if (letters[target.dataset.k] === tile.dataset.l) fill(tile, target); else wrong(tile);
          };
          tile.addEventListener('pointermove', mv);
          tile.addEventListener('pointerup', up);
          tile.addEventListener('pointercancel', up);
        });
      });
    },
  };
}

// Repasser sur une lettre / un chiffre avec le doigt (ou l'Apple Pencil)
function traceQ(ch, kind) {
  return {
    key: ch,
    text: `Trace ${kind} ${L(ch)}`,
    say: `Repasse sur ${kind} ${ch} avec ton doigt.`,
    build(z, answer) {
      z.innerHTML = `<div class="tracebox"><canvas class="guide"></canvas><canvas class="ink"></canvas></div>
        <div class="row"><button class="btn sec" id="clr">🧽 Effacer</button><button class="btn" id="fin">✅ J'ai fini</button></div>`;
      const box = z.querySelector('.tracebox');
      const [g, ink] = box.querySelectorAll('canvas');
      const S = Math.floor(Math.min(z.clientWidth - 8, window.innerHeight * 0.52, 460));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      box.style.width = box.style.height = S + 'px';
      for (const c of [g, ink]) c.width = c.height = Math.round(S * dpr);

      // Modèle en gris clair
      const gc = g.getContext('2d');
      gc.scale(dpr, dpr);
      gc.font = `800 ${Math.round(S * 0.8)}px ${FONT}`;
      gc.textAlign = 'center'; gc.textBaseline = 'alphabetic';
      const txt = L(ch), m = gc.measureText(txt);
      const y = S / 2 + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
      gc.fillStyle = '#ECE4D3'; gc.fillText(txt, S / 2, y);
      gc.lineWidth = 2; gc.strokeStyle = '#D3C7AF'; gc.strokeText(txt, S / 2, y);

      // Encre de l'enfant
      const ic = ink.getContext('2d');
      ic.scale(dpr, dpr);
      ic.lineCap = ic.lineJoin = 'round';
      ic.lineWidth = S * 0.075;
      ic.strokeStyle = ic.fillStyle = getComputedStyle(z).getPropertyValue('--c') || '#3A86FF';
      let drawing = false, last = null;
      const pos = e => { const r = ink.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
      ink.addEventListener('pointerdown', e => {
        e.preventDefault(); ink.setPointerCapture(e.pointerId);
        drawing = true; last = pos(e);
        ic.beginPath(); ic.arc(last[0], last[1], ic.lineWidth / 2, 0, Math.PI * 2); ic.fill();
      });
      ink.addEventListener('pointermove', e => {
        if (!drawing) return;
        const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
        for (const ev of (evs.length ? evs : [e])) {
          const p = pos(ev);
          ic.beginPath(); ic.moveTo(last[0], last[1]); ic.lineTo(p[0], p[1]); ic.stroke();
          last = p;
        }
      });
      const end = () => { drawing = false; };
      ink.addEventListener('pointerup', end);
      ink.addEventListener('pointercancel', end);

      z.querySelector('#clr').onclick = () => ic.clearRect(0, 0, S, S);
      z.querySelector('#fin').onclick = () => {
        const W = g.width;
        const gd = gc.getImageData(0, 0, W, W).data, id = ic.getImageData(0, 0, W, W).data;
        const step = Math.max(2, Math.round(3 * dpr));
        let letter = 0, covered = 0, inked = 0, outside = 0;
        for (let yy = 0; yy < W; yy += step) for (let xx = 0; xx < W; xx += step) {
          const i = (yy * W + xx) * 4 + 3;
          const isL = gd[i] > 40, isI = id[i] > 40;
          if (isL) { letter++; if (isI) covered++; }
          if (isI) { inked++; if (!isL) outside++; }
        }
        const cov = covered / Math.max(1, letter), out = inked ? outside / inked : 1;
        if (cov >= 0.5 && out <= 0.6) answer(true);
        else if (cov < 0.5) answer(false, inked ? 'Repasse sur toute la forme.' : 'Repasse sur le modèle avec ton doigt.');
        else answer(false, 'Essaie de rester bien sur le modèle.');
      };
    },
  };
}

/* =========================================================
   Activités
   ========================================================= */
const ACTS = {
  maths: {
    title: 'Maths', icon: '🔢', color: 'var(--maths)',
    list: [
      {
        id: 'compter', title: 'Compter', icon: '🍎',
        make() {
          const n = rnd(1, state.level === 1 ? 5 : state.level === 2 ? 10 : 15), e = pick(EMOJIS_COUNT);
          return {
            key: n, text: 'Combien y en a-t-il ?', say: 'Compte, et touche le bon nombre.',
            build: choiceBuild({ top: `<div class="count">${emojis(e, n)}</div>`, choices: numChoices(n, 1, 20), isRight: c => c === n }),
          };
        },
      },
      {
        id: 'additions', title: 'Additions', icon: '➕',
        make() {
          const M = maxN(), s = rnd(2, M), a = rnd(1, s - 1), b = s - a, e = pick(EMOJIS_COUNT);
          const vis = s <= 10 ? `<div class="add"><div class="grp">${emojis(e, a)}</div>+<div class="grp">${emojis(e, b)}</div></div>` : '';
          return {
            key: `${a}+${b}`, text: `${a} + ${b} = ?`, say: `Combien font ${a} plus ${b} ?`,
            build: choiceBuild({ top: vis + `<div class="eq">${a} + ${b} = <span class="q">?</span></div>`, choices: numChoices(s, 0, M + 3), isRight: c => c === s }),
          };
        },
      },
      {
        id: 'plusgrand', title: 'Le plus grand', icon: '🐘',
        make() {
          const M = maxN(), a = rnd(0, M); let b; do b = rnd(0, M); while (b === a);
          return {
            key: [a, b].sort().join('-'), text: 'Touche le nombre le plus grand', say: 'Touche le nombre le plus grand.',
            build: choiceBuild({
              choices: [a, b], isRight: c => c === Math.max(a, b),
              label: c => `${c}${c > 0 && c <= 10 ? `<small class="dots">${'●'.repeat(c)}</small>` : ''}`,
            }),
          };
        },
      },
      {
        id: 'suite', title: 'La suite', icon: '🪜',
        make() {
          const M = maxN(), len = 4, s = rnd(0, Math.max(0, M - len + 1)), miss = rnd(0, len - 1);
          const seq = Array.from({ length: len }, (_, i) => s + i), ans = seq[miss];
          return {
            key: `${s}-${miss}`, text: 'Quel nombre manque ?', say: 'Quel nombre manque dans la suite ?',
            build: choiceBuild({
              top: `<div class="seq">${seq.map((v, i) => i === miss ? '<span class="q">?</span>' : `<span>${v}</span>`).join('')}</div>`,
              choices: numChoices(ans, 0, M + 1), isRight: c => c === ans,
            }),
          };
        },
      },
      { id: 'tracechiffres', title: 'Tracer les chiffres', icon: '✍️', make: () => traceQ(String(rnd(0, 9)), 'le chiffre') },
    ],
  },

  lecture: {
    title: 'Lecture', icon: '📖', color: 'var(--lecture)',
    list: [
      {
        id: 'syllabes', title: 'Les syllabes', icon: '👂',
        make() {
          const c = pick(CONSONNES), v = pick(VOYELLES), syl = c + v;
          const d1 = c + pick(VOYELLES.filter(x => x !== v)), d2 = pick(CONSONNES.filter(x => x !== c)) + v;
          return {
            key: syl, text: 'Écoute et touche la syllabe', say: `Touche la syllabe : ${syl}`,
            build: choiceBuild({ top: `<button class="ear" data-say="${syl}" aria-label="Écouter">👂</button>`, choices: shuffle([syl, d1, d2]), isRight: x => x === syl, label: L }),
          };
        },
      },
      {
        id: 'premiere', title: 'Première lettre', icon: '🔤',
        make() {
          const [w, e] = pick(words().filter(([w]) => !NO_FIRST.has(w))), f = w[0];
          const others = sample('abdfilmnoprstv'.split('').filter(x => x !== f), 2);
          return {
            key: w, text: 'Par quelle lettre commence le mot ?', say: `Par quelle lettre commence le mot : ${w} ?`,
            build: choiceBuild({ top: `<button class="pic" data-say="${esc(w)}">${e}</button>`, choices: shuffle([f, ...others]), isRight: x => x === f, label: L }),
          };
        },
      },
      {
        id: 'quelmot', title: 'Quel mot ?', icon: '🖼️',
        make() {
          const pool = words(), [w, e] = pick(pool);
          const ds = sample(pool.filter(x => x[0] !== w), 2).map(x => x[0]);
          return {
            key: w, text: 'Quel est le bon mot ?', say: "Regarde l'image, et touche le bon mot.",
            build: choiceBuild({ top: `<div class="pic">${e}</div>`, choices: shuffle([w, ...ds]), isRight: x => x === w, label: x => esc(L(x)), cls: 'words' }),
          };
        },
      },
      {
        id: 'lismot', title: 'Lis le mot', icon: '👀',
        make() {
          const pool = words(), [w, e] = pick(pool);
          const ds = sample(pool.filter(x => x[0] !== w), 2);
          return {
            key: w, text: 'Lis le mot et touche la bonne image', say: 'Lis le mot, et touche la bonne image.',
            build: choiceBuild({ top: `<div class="word">${esc(L(w))}</div>`, choices: shuffle([[w, e], ...ds]), isRight: x => x[0] === w, label: x => x[1], cls: 'pics' }),
          };
        },
      },
    ],
  },

  ecriture: {
    title: 'Écriture', icon: '✏️', color: 'var(--ecriture)',
    list: [
      { id: 'ecrismot', title: 'Écris le mot', icon: '🧩', make() { const [w, e] = pick(words()); return spellQ(w, e); } },
      { id: 'dictee', title: 'Dictée de syllabes', icon: '🎧', make: () => spellQ(pick(CONSONNES) + pick(VOYELLES)) },
      { id: 'tracelettres', title: 'Tracer les lettres', icon: '✍️', make: () => traceQ(pick('abcdefghijklmnopqrstuvwxyz'.split('')), 'la lettre') },
    ],
  },
};

/* =========================================================
   Écrans
   ========================================================= */
const app = document.getElementById('app');
const render = html => { window.speechSynthesis?.cancel(); document.querySelectorAll('.confetti,.pop').forEach(e => e.remove()); app.innerHTML = html; window.scrollTo(0, 0); };

function home() {
  render(`
    <header class="top">
      <div class="hello">${state.name ? `Coucou ${esc(state.name)} !` : 'Coucou !'} 👋</div>
      <div class="stars">⭐ ${state.stars}</div>
      <button class="icon" id="gear" aria-label="Espace parents">⚙️</button>
    </header>
    <main class="home">
      ${Object.entries(ACTS).map(([k, d]) => `
        <button class="domain" style="--c:${d.color}" data-d="${k}"><span class="di">${d.icon}</span><span>${d.title}</span></button>`).join('')}
    </main>`);
  app.querySelectorAll('.domain').forEach(b => b.onclick = () => { say(ACTS[b.dataset.d].title); domain(b.dataset.d); });
  holdToOpen($('#gear'), 1500, settings);
}

function domain(k) {
  const d = ACTS[k];
  render(`
    <header class="top">
      <button class="icon" id="back" aria-label="Retour">⬅️</button>
      <div class="title">${d.icon} ${d.title}</div>
      <div class="stars">⭐ ${state.stars}</div>
    </header>
    <main class="acts">
      ${d.list.map((a, i) => `
        <button class="act" style="--c:${d.color}" data-i="${i}">
          <span class="ai">${a.icon}</span><span class="at">${a.title}</span><span class="as">⭐ ${state.act[a.id] || 0}</span>
        </button>`).join('')}
    </main>`);
  $('#back').onclick = home;
  app.querySelectorAll('.act').forEach(b => b.onclick = () => runSession(d.list[b.dataset.i], k));
}

function runSession(act, dk) {
  const total = QUESTIONS_PAR_PARTIE, seen = new Set();
  let i = 0, got = 0;

  const next = () => {
    if (i >= total) return finish();
    let q, t = 0;
    do q = act.make(); while (seen.has(q.key) && t++ < 20);
    seen.add(q.key);
    let firstTry = true, locked = false;

    render(`
      <header class="top">
        <button class="icon" id="back" aria-label="Quitter">✖️</button>
        <div class="prog">${Array.from({ length: total }, (_, j) => `<span class="${j < i ? 'done' : j === i ? 'cur' : ''}"></span>`).join('')}</div>
        <button class="icon" id="spk" aria-label="Réécouter la consigne">🔊</button>
      </header>
      <main class="play" style="--c:${ACTS[dk].color}">
        <h2 class="instr">${q.text}</h2>
        <div id="zone" class="zone" style="--c:${ACTS[dk].color}"></div>
      </main>`);
    $('#back').onclick = () => domain(dk);
    const speak = () => say(q.say || q.text);
    $('#spk').onclick = speak;

    q.build($('#zone'), (ok, msg) => {
      if (locked) return;
      if (ok) {
        locked = true;
        if (firstTry) got++;
        sfxOK(); pop(firstTry ? '⭐' : '👍');
        say(`${pick(PRAISE)}${state.name ? ' ' + state.name : ''} !`);
        setTimeout(() => { i++; next(); }, 1500);
      } else {
        firstTry = false; sfxNo();
        setTimeout(() => say(msg || pick(RETRY)), 250);
      }
    });
    setTimeout(speak, 300);
  };

  const finish = () => {
    state.stars += got;
    state.act[act.id] = (state.act[act.id] || 0) + got;
    save();
    const msg = got >= 4 ? 'Bravo' : got >= 2 ? 'Bien joué' : 'Continue comme ça';
    render(`
      <main class="end">
        <div class="big">${got >= 4 ? '🏆' : got >= 2 ? '🎉' : '💪'}</div>
        <h2>${msg}${state.name ? ' ' + esc(state.name) : ''} !</h2>
        <div class="earned">${'⭐'.repeat(got)}${'<span class="off">⭐</span>'.repeat(total - got)}</div>
        <div class="row">
          <button class="btn" id="again" style="--c:${ACTS[dk].color}">🔁 Rejouer</button>
          <button class="btn sec" id="menu">🏠 Menu</button>
        </div>
      </main>`);
    confetti();
    setTimeout(() => say(`${msg}${state.name ? ' ' + state.name : ''} ! Tu as gagné ${got} étoile${got > 1 ? 's' : ''}.`), 200);
    $('#again').onclick = () => runSession(act, dk);
    $('#menu').onclick = () => domain(dk);
  };

  next();
}

// Le bouton parents s'ouvre après un appui long (évite les ouvertures par l'enfant)
function holdToOpen(el, ms, fn) {
  let t;
  const stop = () => { clearTimeout(t); el.classList.remove('holding'); };
  el.addEventListener('pointerdown', e => {
    e.preventDefault(); el.classList.add('holding');
    t = setTimeout(() => { stop(); fn(); }, ms);
  });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => el.addEventListener(ev, stop));
  el.addEventListener('contextmenu', e => e.preventDefault());
}

function settings() {
  const seg = (k, opts) => `<div class="seg" data-k="${k}">${opts.map(([v, lab]) =>
    `<button data-v='${JSON.stringify(v)}' class="${state[k] === v ? 'on' : ''}">${lab}</button>`).join('')}</div>`;
  const allActs = Object.values(ACTS).flatMap(d => d.list.map(a => `${a.icon} ${a.title} : ⭐ ${state.act[a.id] || 0}`));

  render(`
    <header class="top">
      <button class="icon" id="back" aria-label="Retour">⬅️</button>
      <div class="title">Espace parents</div>
    </header>
    <main class="settings">
      <label>Prénom de l'enfant
        <input id="name" value="${esc(state.name)}" maxlength="20" autocomplete="off" autocapitalize="words">
      </label>
      <div class="field">Niveau
        ${seg('level', [[1, "1 · jusqu'à 5"], [2, "2 · jusqu'à 10"], [3, "3 · jusqu'à 20"]])}
        <small>Règle la taille des nombres en maths et la longueur des mots (4, 5 lettres, ou plus).</small>
      </div>
      <div class="field">Lettres
        ${seg('caps', [[false, 'minuscules'], [true, 'MAJUSCULES']])}
      </div>
      <div class="field">Voix
        ${seg('voice', [[true, '🔊 Activée'], [false, '🔇 Coupée']])}
        <small>Si vous n'entendez rien, vérifiez que l'iPhone n'est pas en mode silencieux.</small>
      </div>
      <div class="field">Progrès
        <div class="statsbox">Total : ⭐ ${state.stars}<br>${allActs.join('<br>')}</div>
      </div>
      <button class="btn danger" id="reset">Remettre les étoiles à zéro</button>
      <p class="tip">Pour installer l'application : ouvrez le site dans Safari, touchez le bouton Partager, puis « Sur l'écran d'accueil ».</p>
    </main>`);

  $('#back').onclick = home;
  $('#name').oninput = e => { state.name = e.target.value.trim(); save(); };
  app.querySelectorAll('.seg').forEach(s => s.querySelectorAll('button').forEach(b => b.onclick = () => {
    state[s.dataset.k] = JSON.parse(b.dataset.v); save();
    s.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
  }));
  $('#reset').onclick = () => {
    if (confirm('Remettre toutes les étoiles à zéro ?')) { state.stars = 0; state.act = {}; save(); settings(); }
  };
}

/* ---------- Démarrage ---------- */
home();
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
navigator.storage?.persist?.().catch(() => {});
