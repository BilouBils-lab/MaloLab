'use strict';
/* =========================================================
   MaloLab — exercices de CP (maths, lecture, écriture)
   Lecture : progression par graphèmes, mots 100 % décodables
   (principes de la méthode Alfi et ses amis).
   ========================================================= */

/* =========================================================
   1. PROGRESSION DES SONS
   Ordre proposé par défaut : à ajuster dans l'espace parents
   selon le cahier / manuel Alfi de l'enfant.
   [identifiant, graphies, mot repère, image]
   ========================================================= */
const GRAPHEMES = [
  ['a', 'a', 'ananas', '🍍'], ['i', 'i y', 'île', '🏝️'], ['o', 'o', 'olive', '🫒'], ['u', 'u', 'lune', '🌙'],
  ['é', 'é', 'éléphant', '🐘'], ['e', 'e', 'cheval', '🐴'], ['l', 'l', 'lion', '🦁'], ['r', 'r', 'rat', '🐀'],
  ['m', 'm', 'moto', '🏍️'], ['s', 's', 'serpent', '🐍'], ['f', 'f', 'fusée', '🚀'], ['ch', 'ch', 'chat', '🐱'],
  ['v', 'v', 'vélo', '🚲'], ['j', 'j', 'judo', '🥋'], ['n', 'n', 'nid', '🪺'], ['p', 'p', 'pomme', '🍎'],
  ['t', 't', 'tomate', '🍅'], ['ou', 'ou', 'loup', '🐺'], ['d', 'd', 'dé', '🎲'], ['b', 'b', 'banane', '🍌'],
  ['on', 'on om', 'mouton', '🐑'], ['c', 'c k qu', 'canard', '🦆'], ['an', 'an am en em', 'pantalon', '👖'],
  ['è', 'è ê ai ei', 'fraise', '🍓'], ['g', 'g gu', 'gâteau', '🎂'], ['oi', 'oi', 'roi', '👑'],
  ['in', 'in im ain', 'lapin', '🐰'], ['eu', 'eu œu', 'feu', '🔥'], ['au', 'au eau', 'bateau', '⛵'],
  ['z', 'z', 'zèbre', '🦓'], ['gn', 'gn', 'champignon', '🍄'], ['ill', 'ill', 'gorille', '🦍'],
  ['ph', 'ph', 'phoque', '🦭'], ['x', 'x', 'taxi', '🚕'],
];
const DEFAULT_KNOWN = GRAPHEMES.slice(0, 14).map(g => g[0]);

/* =========================================================
   2. MOTS
   Écriture : graphèmes séparés par « . », syllabes par « / »,
   lettre muette entre parenthèses « (t) »,
   « s=z » = la lettre s se prononce comme le son z.
   ========================================================= */
const LEX = [
  // mots repères
  ['a/n.a/n.a.(s)', '🍍'], ['î.l.(e)', '🏝️'], ['o/l.i/v.(e)', '🫒'], ['l.u/n.(e)', '🌙'], ['é/l.é/ph.an.(t)', '🐘'],
  ['ch.e/v.a.l', '🐴'], ['l.i/on', '🦁'], ['r.a.(t)', '🐀'], ['m.o/t.o', '🏍️'], ['s.e=è.r/p.en.(t)', '🐍'],
  ['f.u/s.é.(e)', '🚀'], ['ch.a.(t)', '🐱'], ['v.é/l.o', '🚲'], ['j.u/d.o', '🥋'], ['n.i.(d)', '🪺'],
  ['p.o/mm.(e)', '🍎'], ['t.o/m.a/t.(e)', '🍅'], ['l.ou.(p)', '🐺'], ['d.é', '🎲'], ['b.a/n.a/n.(e)', '🍌'],
  ['m.ou/t.on', '🐑'], ['c.a/n.a.r.(d)', '🦆'], ['p.an/t.a/l.on', '👖'], ['f.r.ai/s=z.(e)', '🍓'],
  ['g.â/t.eau', '🎂'], ['r.oi', '👑'], ['l.a/p.in', '🐰'], ['f.eu', '🔥'], ['b.a/t.eau', '⛵'],
  ['z.è/b.r.(e)', '🦓'], ['ch.am/p.i/gn.on', '🍄'], ['g.o/r.ill.(e)', '🦍'], ['ph.o/qu.(e)', '🦭'], ['t.a/x.i', '🚕'],
  // autres mots
  ['l.a/m.a', '🦙'], ['l.i.(t)', '🛏️'], ['m.u.r', '🧱'], ['r.o/b.(e)', '👗'], ['f.i.l', '🧵'], ['r.i.(z)', '🍚'],
  ['n.ez', '👃'], ['p.i.e=é.(d)', '🦶'], ['p.ou/l.(e)', '🐔'], ['ou.r.s', '🐻'], ['c.a/d.eau', '🎁'], ['s.a/p.in', '🎄'],
  ['p.an/d.a', '🐼'], ['r.o/b.o.(t)', '🤖'], ['t.o.r/t.u.(e)', '🐢'], ['s.ou/r.i.(s)', '🐭'], ['v.a/ch.(e)', '🐮'],
  ['l.i/v.r.(e)', '📖'], ['f.l.eu.r', '🌸'], ['é/t.oi/l.(e)', '⭐'], ['p.oi/ss.on', '🐟'], ['b.u.s', '🚌'],
  ['s.a.c', '👜'], ['m.ai/s=z.on', '🏠'], ['c.a/m.i/on', '🚚'], ['a/v.i/on', '✈️'], ['r.e/n.a.r.(d)', '🦊'],
  ['d.en.(t)', '🦷'], ['v.a/l.i/s=z.(e)', '🧳'], ['ch.ou', '🥬'], ['b.i/b.e/r.on', '🍼'], ['m.e/l.on', '🍈'],
  ['c.a/r.o/tt.(e)', '🥕'], ['s.a/l.a/d.(e)', '🥗'], ['v.o.l/c.an', '🌋'], ['b.a/ll.on', '🎈'], ['r.o/b.i/n.et', '🚰'],
  ['b.o.l', '🥣'], ['ch.â/t.eau', '🏰'], ['m.ou/ch.(e)', '🪰'], ['b.a/l.ai', '🧹'], ['l.ai.(t)', '🥛'],
  ['r.ou.(e)', '🛞'], ['n.u/a/g=j.(e)', '☁️'], ['p.a/r.a/s.o.l', '⛱️'], ['c.o.q=c', '🐓'], ['s.a/v.on', '🧼'],
  ['c.a/f.é', '☕'], ['p.o.r/t.(e)', '🚪'], ['l.ou/p.(e)', '🔍'], ['f.ou.r/ch.e=è/tt.(e)', '🍴'], ['t.u/l.i/p.(e)', '🌷'],
  ['r.o/s=z.(e)', '🌹'], ['p.i/l.(e)', '🔋'],
];
// Verbes et adjectifs utilisés dans les phrases
const EXTRA = [
  'v.o/l.(e)', 'm.a.r/ch.(e)', 'r.ou/l.(e)', 'n.a/g=j.(e)', 'm.i/au/l.(e)', 'd.o.r.(t)', 'm.an/g=j.(e)',
  'r.ou/g=j.(e)', 'v.e=è.r/t.(e)', 'p.e/t.i/t.(e)', 'p.e/t.i.(t)', 'j.au/n.(e)', 'p.a.r/l.(e)', 's.au/t.(e)',
  'ch.an/t.(e)', 'r.i.(t)', 'a/m.i',
];
// Mots outils (appris « par cœur », sans décodage)
const MOTS_OUTILS = ['le', 'la', 'les', 'un', 'une', 'il', 'elle', 'est', 'et', 'a', 'sur', 'dans', 'de', 'des', 'au', 'avec'];
const DEFAULT_OUTILS = MOTS_OUTILS.slice(0, 14);
// Phrases pour « Vrai ou faux ? » (n'apparaissent que si tous les mots sont lisibles)
const PHRASES = [
  ['Le chat dort sur le lit.', true], ['La moto vole.', false], ['Le poisson nage.', true], ['Le rat a une robe.', false],
  ['La tomate est rouge.', true], ['La souris est petite.', true], ['Le canard nage.', true], ['Le bus vole.', false],
  ['Le robot mange une pomme.', false], ['La banane est jaune.', true], ['Le mouton a une moto.', false],
  ['La tortue marche.', true], ['Le chat miaule.', true], ['Le vélo a un nez.', false], ['La fusée vole.', true],
  ['Le lapin mange la salade.', true], ['Le poisson marche.', false], ['Le bateau vole.', false],
  ['Il dort dans le lit.', true], ['Le loup chante.', false], ['La salade est verte.', true], ['Le cheval saute.', true],
  ['Le gâteau parle.', false], ['Le robinet chante.', false], ['Le gorille mange une banane.', true],
  ['La souris dort sur la lune.', false], ['La vache a un pantalon.', false], ['Le lama a une valise.', false],
  ['La rose est rouge.', true], ['Le phoque nage.', true], ['Le lion dort.', true], ['La poule a un ballon.', false],
  ['Le lama a un vélo.', false], ['Il a un ami.', true], ['Le chat est sur le mur.', true],
  ['Le cheval a un vélo.', false], ['Le rat a un vélo.', false], ['La fusée a un vélo.', false], ['Le chat a un vélo.', false],
];

const EMOJIS_COUNT = ['🍎', '⭐', '🐞', '🐟', '🎈', '🍓', '🚗', '🐥', '🌼', '🍪'];
const PRAISE = ['Bravo', 'Super', 'Génial', 'Bien joué', 'Excellent', 'Parfait'];
const RETRY = ['Essaie encore !', 'Presque ! Essaie encore.', 'Oups, essaie encore.'];
const QUESTIONS_PAR_PARTIE = 5;

/* ---------- Sauvegarde locale ---------- */
const KEY = 'malolab';
const DEFAULTS = { name: 'Malo', level: 1, caps: false, voice: true, syl: true, stars: 0, act: {}, known: DEFAULT_KNOWN, outils: DEFAULT_OUTILS };
const state = (() => {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || localStorage.getItem('ptit-ecolier') || '{}'); } catch {}
  const s = Object.assign({}, DEFAULTS, saved);
  if (!s.name) s.name = DEFAULTS.name;
  return s;
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
const L = s => state.caps ? s.toUpperCase() : s;
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

/* ---------- Décodage des mots ---------- */
// graphie -> son (identifiant de GRAPHEMES)
const SPELL = {
  y: 'i', î: 'i', â: 'a', à: 'a', ô: 'o', k: 'c', qu: 'c', q: 'c', am: 'an', en: 'an', em: 'an',
  ê: 'è', ai: 'è', ei: 'è', et: 'è', er: 'é', ez: 'é', gu: 'g', im: 'in', ain: 'in', ein: 'in',
  œu: 'eu', eau: 'au', om: 'on', ss: 's', mm: 'm', ll: 'l', tt: 't', nn: 'n', pp: 'p', rr: 'r', ff: 'f', ç: 's',
};
function tok(t) {
  if (t.startsWith('(')) return { sp: t.slice(1, -1), silent: true, id: null };
  const [sp, forced] = t.split('=');
  return { sp, silent: false, id: forced || SPELL[sp] || sp };
}
function parseWord(seg) {
  const syls = seg.split('/').map(s => s.split('.').map(tok));
  const toks = syls.flat();
  return { seg, syls, toks, text: toks.map(t => t.sp).join('') };
}
const LEXICON = LEX.map(([seg, e]) => ({ ...parseWord(seg), e }));
const DICT = new Map();
[...LEXICON, ...EXTRA.map(parseWord)].forEach(w => { if (!DICT.has(w.text)) DICT.set(w.text, w); });

const knownSet = () => new Set(state.known);
const decodable = (w, K = knownSet()) => w.toks.every(t => t.silent || K.has(t.id));
const readableWords = () => { const K = knownSet(); return LEXICON.filter(w => decodable(w, K)); };

function parseSentence(s) {
  return s.split(' ').map(raw => {
    const [, word, punct] = raw.match(/^(.*?)([.,!?]*)$/);
    const low = word.toLowerCase();
    return { word, low, punct, w: DICT.get(low) };
  });
}
function sentenceReadable(p, K = knownSet(), MO = new Set(state.outils)) {
  return p.every(x => MO.has(x.low) || (x.w && decodable(x.w, K)));
}
const readableSentences = () => {
  const K = knownSet(), MO = new Set(state.outils);
  return PHRASES.filter(([s]) => sentenceReadable(parseSentence(s), K, MO));
};

// Affichage d'un mot : syllabes en couleurs alternées, lettres muettes en gris
function wordHTML(w, cap = false) {
  const up = (s, first) => (cap && first) ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  if (!state.syl) return esc(L(up(w.text, true)));
  let first = true;
  return w.syls.map((syl, i) => `<span class="s${i % 2}">${syl.map(t => {
    const txt = esc(L(up(t.sp, first))); first = false;
    return t.silent ? `<span class="mute">${txt}</span>` : txt;
  }).join('')}</span>`).join('');
}
function sentenceHTML(p) {
  return p.map((x, i) => {
    const inner = x.w && !state.outils.includes(x.low)
      ? wordHTML(x.w, i === 0)
      : `<span class="${state.syl ? 'mo' : ''}">${esc(L(x.word))}</span>`;
    return `<span class="w" data-say="${esc(x.low)}">${inner}${esc(x.punct)}</span>`;
  }).join(' ');
}

// Syllabes possibles avec les sons connus
const CONS = ['l', 'r', 'm', 's', 'f', 'ch', 'v', 'j', 'n', 'p', 't', 'd', 'b', 'c', 'g', 'z'];
const VOW = ['a', 'i', 'o', 'u', 'é', 'ou', 'on', 'an', 'in', 'oi'];
const HARD = ['a', 'o', 'u', 'ou', 'on', 'an', 'oi']; // c et g restent durs devant ces sons
function syllPool() {
  const K = knownSet(), out = [];
  for (const c of CONS) if (K.has(c)) for (const v of VOW) if (K.has(v)) {
    if ((c === 'c' || c === 'g') && !HARD.includes(v)) continue;
    out.push([c, v]);
  }
  return out;
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

document.addEventListener('pointerdown', () => {
  beep([[1, .01]]);
  if ('speechSynthesis' in window && state.voice) { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); }
}, { once: true });
document.addEventListener('click', e => { const t = e.target.closest('[data-say]'); if (t) say(t.dataset.say, 0.8); });
document.addEventListener('gesturestart', e => e.preventDefault());

/* ---------- Effets ---------- */
function pop(emoji) {
  const d = document.createElement('div');
  d.className = 'pop'; d.textContent = emoji;
  document.body.appendChild(d); setTimeout(() => d.remove(), 1100);
}
function confetti() {
  const set = ['⭐', '🎉', '🌟', '🎈', '✨', '🐘'];
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
   3. TYPES DE QUESTIONS
   { key, text, say, build(zone, answer) } ; answer(true | false, message?)
   ========================================================= */
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

// Remettre les graphèmes dans l'ordre (glisser ou toucher)
// units : [{ sp: 'ch', silent: false }, ...]
function spellQ({ units, word, emoji, kind }) {
  const isWord = kind === 'mot';
  return {
    key: word,
    text: isWord ? 'Écris le mot' : 'Écris la syllabe',
    say: isWord ? `Écris le mot : ${word}` : `Écris la syllabe : ${word}`,
    build(z, answer) {
      const n = units.length;
      let order;
      do order = shuffle(units.map((_, k) => k));
      while (n > 1 && order.every((v, j) => units[v].sp === units[j].sp));
      const fs = sp => sp.length > 2 ? .4 : sp.length > 1 ? .5 : .7;

      z.innerHTML = `
        <button class="${isWord ? 'pic' : 'ear'}" data-say="${esc(word)}" aria-label="Écouter">${isWord ? emoji : '👂'}</button>
        <div class="slots" style="--n:${n}">${units.map((u, k) => `<div class="slot" data-k="${k}" style="font-size:calc(var(--s)*${fs(u.sp)})"></div>`).join('')}</div>
        <div class="tiles" style="--n:${n}">${order.map(k => `<div class="tile" data-l="${esc(units[k].sp)}" style="font-size:calc(var(--s)*${fs(units[k].sp)})">${esc(L(units[k].sp))}</div>`).join('')}</div>`;

      const slots = [...z.querySelectorAll('.slot')];
      let errors = 0, done = 0;
      const nextSlot = () => slots.find(s => !s.classList.contains('ok'));
      const hint = () => {
        z.querySelectorAll('.hint').forEach(t => t.classList.remove('hint'));
        if (errors < 2) return;
        const s = nextSlot(); if (!s) return;
        const t = [...z.querySelectorAll('.tile:not(.used)')].find(t => t.dataset.l === units[s.dataset.k].sp);
        if (t) t.classList.add('hint');
      };
      const fill = (tile, slot) => {
        slot.textContent = tile.textContent; slot.classList.add('ok');
        if (units[slot.dataset.k].silent && state.syl) slot.classList.add('mute');
        tile.classList.add('used'); done++; sfxPop(); hint();
        if (done === n) answer(true);
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
            const target = moved ? slotAt(ev.clientX, ev.clientY) : nextSlot();
            if (!target || target.classList.contains('ok')) return;
            if (units[target.dataset.k].sp === tile.dataset.l) fill(tile, target); else wrong(tile);
          };
          tile.addEventListener('pointermove', mv);
          tile.addEventListener('pointerup', up);
          tile.addEventListener('pointercancel', up);
        });
      });
    },
  };
}

// Repasser sur une lettre / un chiffre
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

      const gc = g.getContext('2d');
      gc.scale(dpr, dpr);
      gc.font = `800 ${Math.round(S * 0.8)}px ${FONT}`;
      gc.textAlign = 'center'; gc.textBaseline = 'alphabetic';
      const txt = L(ch), m = gc.measureText(txt);
      const y = S / 2 + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
      gc.fillStyle = '#ECE4D3'; gc.fillText(txt, S / 2, y);
      gc.lineWidth = 2; gc.strokeStyle = '#D3C7AF'; gc.strokeText(txt, S / 2, y);

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
   4. ACTIVITÉS
   make() renvoie une question, ou null si l'enfant n'a pas
   encore étudié assez de sons pour cet exercice.
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
      { id: 'messons', title: 'Mes sons', icon: '🐘', screen: k => soundsScreen(k) },
      {
        id: 'syllabes', title: 'Les syllabes', icon: '👂',
        make() {
          const P = syllPool(); if (P.length < 3) return null;
          const [c, v] = pick(P), syl = c + v, all = P.map(x => x.join(''));
          const near = P.filter(([c2, v2]) => (c2 === c) !== (v2 === v)).map(x => x.join(''));
          const ds = sample(near.length >= 2 ? near : all.filter(x => x !== syl), 2);
          return {
            key: syl, text: 'Écoute et touche la syllabe', say: `Touche la syllabe : ${syl}`,
            build: choiceBuild({ top: `<button class="ear" data-say="${syl}" aria-label="Écouter">👂</button>`, choices: shuffle([syl, ...ds]), isRight: x => x === syl, label: x => esc(L(x)) }),
          };
        },
      },
      {
        id: 'premierson', title: 'Le premier son', icon: '🔤',
        make() {
          const W = readableWords(), K = [...state.known];
          if (!W.length || K.length < 3) return null;
          const w = pick(W), f = w.toks.find(t => !t.silent).id;
          const ds = sample(K.filter(x => x !== f), 2);
          return {
            key: w.text, text: "Quel son entends-tu au début du mot ?", say: `Quel son entends-tu au début du mot : ${w.text} ?`,
            build: choiceBuild({ top: `<button class="pic" data-say="${esc(w.text)}">${w.e}</button>`, choices: shuffle([f, ...ds]), isRight: x => x === f, label: x => esc(L(x)) }),
          };
        },
      },
      {
        id: 'quelmot', title: 'Quel mot ?', icon: '🖼️',
        make() {
          const W = readableWords(); if (W.length < 3) return null;
          const w = pick(W), ds = sample(W.filter(x => x !== w), 2);
          return {
            key: w.text, text: 'Quel est le bon mot ?', say: "Regarde l'image, et touche le bon mot.",
            build: choiceBuild({ top: `<div class="pic">${w.e}</div>`, choices: shuffle([w, ...ds]), isRight: x => x === w, label: x => wordHTML(x), cls: 'words' }),
          };
        },
      },
      {
        id: 'lismot', title: 'Lis le mot', icon: '👀',
        make() {
          const W = readableWords(); if (W.length < 3) return null;
          const w = pick(W), ds = sample(W.filter(x => x !== w), 2);
          return {
            key: w.text, text: 'Lis le mot et touche la bonne image', say: 'Lis le mot, et touche la bonne image.',
            build: choiceBuild({ top: `<div class="word">${wordHTML(w)}</div>`, choices: shuffle([w, ...ds]), isRight: x => x === w, label: x => x.e, cls: 'pics' }),
          };
        },
      },
      {
        id: 'vraifaux', title: 'Vrai ou faux ?', icon: '🤔',
        make() {
          const S = readableSentences(); if (S.length < 2) return null;
          const [s, truth] = pick(S), p = parseSentence(s);
          return {
            key: s, text: 'Lis la phrase : vrai ou faux ?', say: 'Lis la phrase. Est-ce vrai, ou faux ?',
            build: choiceBuild({
              top: `<div class="sentence">${sentenceHTML(p)}</div>`,
              choices: [true, false], isRight: x => x === truth,
              label: x => x ? '👍<small>Vrai</small>' : '👎<small>Faux</small>', cls: 'vf',
            }),
          };
        },
      },
    ],
  },

  ecriture: {
    title: 'Écriture', icon: '✏️', color: 'var(--ecriture)',
    list: [
      {
        id: 'ecrismot', title: 'Écris le mot', icon: '🧩',
        make() {
          const W = readableWords().filter(w => w.toks.length <= 7); if (!W.length) return null;
          const w = pick(W);
          return spellQ({ units: w.toks, word: w.text, emoji: w.e, kind: 'mot' });
        },
      },
      {
        id: 'dictee', title: 'Dictée de syllabes', icon: '🎧',
        make() {
          const P = syllPool(); if (!P.length) return null;
          const [c, v] = pick(P);
          return spellQ({ units: [{ sp: c }, { sp: v }], word: c + v, kind: 'syllabe' });
        },
      },
      {
        id: 'tracelettres', title: 'Tracer les lettres', icon: '✍️',
        make() {
          const letters = state.known.filter(id => id.length === 1);
          return traceQ(pick(letters.length ? letters : 'aioulrm'.split('')), 'la lettre');
        },
      },
    ],
  },
};

/* =========================================================
   5. ÉCRANS
   ========================================================= */
const app = document.getElementById('app');
const render = html => {
  window.speechSynthesis?.cancel();
  document.querySelectorAll('.confetti,.pop').forEach(e => e.remove());
  app.innerHTML = html; window.scrollTo(0, 0);
};

function home() {
  render(`
    <header class="top">
      <div class="hello"><span class="brand">MaloLab</span>${state.name ? `Coucou ${esc(state.name)} !` : 'Coucou !'} 👋</div>
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
          <span class="ai">${a.icon}</span><span class="at">${a.title}</span>
          <span class="as">${a.screen ? `${state.known.length} sons` : `⭐ ${state.act[a.id] || 0}`}</span>
        </button>`).join('')}
    </main>`);
  $('#back').onclick = home;
  app.querySelectorAll('.act').forEach(b => b.onclick = () => {
    const a = d.list[b.dataset.i];
    say(a.title);
    a.screen ? a.screen(k) : runSession(a, k);
  });
}

// Les sons déjà étudiés, avec leur mot repère
function soundsScreen(dk) {
  const K = knownSet();
  const known = GRAPHEMES.filter(g => K.has(g[0]));
  const newest = known[known.length - 1];
  render(`
    <header class="top">
      <button class="icon" id="back" aria-label="Retour">⬅️</button>
      <div class="title">🐘 Mes sons</div>
    </header>
    <main class="sounds">
      ${known.length ? known.map(g => {
        const w = DICT.get(g[2]);
        return `<button class="snd" data-say="${esc(g[2])}">
          ${g === newest ? '<i>Nouveau</i>' : ''}
          <b>${esc(L(g[1]))}</b><span class="se">${g[3]}</span><span class="sm">${w ? wordHTML(w) : esc(g[2])}</span>
        </button>`;
      }).join('') : '<p class="empty">Demande à papa ou maman de choisir tes sons dans l\'espace parents.</p>'}
    </main>`);
  $('#back').onclick = () => domain(dk);
}

function runSession(act, dk) {
  if (!act.make()) {
    render(`
      <header class="top"><button class="icon" id="back" aria-label="Retour">⬅️</button><div class="title">${act.icon} ${act.title}</div></header>
      <main class="end"><div class="big">🐘</div>
        <h2>Bientôt !</h2>
        <p class="empty">Il faut encore apprendre quelques sons en classe pour cet exercice.<br>Essaie « Mes sons » ou « Les syllabes » !</p>
      </main>`);
    say('Bientôt ! Il faut encore apprendre quelques sons en classe pour cet exercice.');
    $('#back').onclick = () => domain(dk);
    return;
  }

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
  const allActs = Object.values(ACTS).flatMap(d => d.list.filter(a => !a.screen).map(a => `${a.icon} ${a.title} : ⭐ ${state.act[a.id] || 0}`));
  const K = knownSet();

  render(`
    <header class="top">
      <button class="icon" id="back" aria-label="Retour">⬅️</button>
      <div class="title">Espace parents</div>
    </header>
    <main class="settings">
      <label>Prénom de l'enfant
        <input id="name" value="${esc(state.name)}" maxlength="20" autocomplete="off" autocapitalize="words">
      </label>

      <div class="field">Sons déjà étudiés en classe
        <small>Touchez chaque son que ${esc(state.name || "l'enfant")} a déjà vu (voir le cahier ou le manuel Alfi).
        Les exercices de lecture et d'écriture n'utilisent <b>que</b> des mots écrits avec ces sons.</small>
        <div class="chips" id="gr">${GRAPHEMES.map(([id, gs]) => `<button data-id="${esc(id)}" class="${K.has(id) ? 'on' : ''}">${esc(gs)}</button>`).join('')}</div>
        <small id="count"></small>
      </div>

      <div class="field">Mots outils connus
        <small>Petits mots appris par cœur, utilisés dans les phrases.</small>
        <div class="chips" id="mo">${MOTS_OUTILS.map(m => `<button data-id="${m}" class="${state.outils.includes(m) ? 'on' : ''}">${m}</button>`).join('')}</div>
      </div>

      <div class="field">Aide à la lecture
        ${seg('syl', [[true, 'Syllabes en couleur'], [false, 'Texte normal']])}
        <small>Syllabes alternées <span class="s0">bleu</span> / <span class="s1">rouge</span>, lettres muettes en <span class="mute">gris</span>, mots outils <span class="mo">soulignés</span>.</small>
      </div>
      <div class="field">Lettres
        ${seg('caps', [[false, 'minuscules'], [true, 'MAJUSCULES']])}
      </div>
      <div class="field">Niveau en maths
        ${seg('level', [[1, "jusqu'à 5"], [2, "jusqu'à 10"], [3, "jusqu'à 20"]])}
      </div>
      <div class="field">Voix
        ${seg('voice', [[true, '🔊 Activée'], [false, '🔇 Coupée']])}
        <small>Si vous n'entendez rien, vérifiez que l'appareil n'est pas en mode silencieux.</small>
      </div>
      <div class="field">Progrès
        <div class="statsbox">Total : ⭐ ${state.stars}<br>${allActs.join('<br>')}</div>
      </div>
      <button class="btn danger" id="reset">Remettre les étoiles à zéro</button>
      <p class="tip">Pour installer l'application : ouvrez le site dans Safari, touchez Partager, puis « Sur l'écran d'accueil ».</p>
    </main>`);

  const updateCount = () => {
    $('#count').textContent = `→ ${readableWords().length} mots et ${readableSentences().length} phrases lisibles avec ces sons.`;
  };
  updateCount();
  const chips = (sel, key) => app.querySelectorAll(`${sel} button`).forEach(b => b.onclick = () => {
    const id = b.dataset.id, set = new Set(state[key]);
    set.has(id) ? set.delete(id) : set.add(id);
    state[key] = [...set]; save();
    b.classList.toggle('on', set.has(id));
    updateCount();
  });
  chips('#gr', 'known');
  chips('#mo', 'outils');

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
