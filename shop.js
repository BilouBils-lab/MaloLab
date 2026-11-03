'use strict';
/* =========================================================
   Boutique de vignettes : les étoiles gagnées se dépensent.
   Solde = étoiles gagnées (tous appareils) − prix des vignettes achetées.
   (Chargé avant app.js : n'utilise ses fonctions qu'au moment de l'appel.)
   ========================================================= */
const RARITY = {
  c: { name: 'Commune', price: 3, sym: '●' },
  r: { name: 'Rare', price: 8, sym: '◆' },
  s: { name: 'Brillante', price: 15, sym: '★' },
  l: { name: 'Légendaire', price: 30, sym: '♛' },
};
// [identifiant (= assets/carte-<id>.webp), rareté, nom, dessin provisoire en attendant l'illustration]
const CARD_LIST = [
  ['foot-ballon', 'c', 'Le ballon de cuir', 'ballon'], ['foot-crampons', 'c', 'Les crampons', 'crampon'], ['foot-gants', 'c', 'Les gants du gardien', 'gant'],
  ['foot-coupe', 'r', "La coupe d'or", 'coupe'], ['foot-capitaine', 'r', 'Le capitaine', 'assets/compagnon-foot.webp'],
  ['foot-tir', 's', 'Le tir de feu', 'but'], ['foot-legende', 'l', 'Le retourné de Tom', 'assets/legende-foot.webp'],
  ['heros-bouclier', 'c', 'Le bouclier', 'bouclier'], ['heros-masque', 'c', 'Le masque', 'masque'], ['heros-cape', 'c', 'La cape', 'héros'],
  ['heros-repaire', 'r', 'Le repaire secret', 'porte'], ['heros-chien', 'r', 'Super Toutou', 'étoile'],
  ['heros-eclair', 's', "L'éclair de Super Malo", 'éclair'], ['heros-legende', 'l', "L'envol de Super Malo", 'assets/legende-heros.webp'],
  ['briques-brique', 'c', 'La brique rouge', 'brique'], ['briques-cle', 'c', 'La clé à molette', 'clé'], ['briques-voiture', 'c', 'La voiture en briques', 'roue'],
  ['briques-geant', 'r', 'Le robot géant', 'robot'], ['briques-fusee', 'r', 'La fusée en briques', 'fusée'],
  ['briques-turbo', 's', 'Brik turbo', 'engrenage'], ['briques-legende', 'l', 'Le château de Brik', 'assets/legende-briques.webp'],
  ['monstres-oeuf', 'c', "L'œuf mystère", 'œuf'], ['monstres-cristal', 'c', 'Le cristal', 'cristal'], ['monstres-flammeche', 'c', 'Flammèche', 'renard'],
  ['monstres-aquabulle', 'r', 'Aquabulle', 'boule'], ['monstres-feuillo', 'r', 'Feuillo', 'fougère'],
  ['monstres-zapi', 's', 'Zapi électrique', 'monstre'], ['monstres-legende', 'l', "L'évolution de Zapi", 'assets/legende-monstres.webp'],
  ['dinos-os', 'c', "L'os fossile", 'os'], ['dinos-empreinte', 'c', "L'empreinte", 'empreinte'], ['dinos-oeuf', 'c', "L'œuf de dino", 'œuf-dino'],
  ['dinos-triceratops', 'r', 'Le tricératops', 'dino'], ['dinos-pterodactyle', 'r', 'Le ptérodactyle', 'lune'],
  ['dinos-volcan', 's', 'Rex et le volcan', 'tortue'], ['dinos-legende', 'l', 'Rex et les bébés', 'assets/legende-dinos.webp'],
];
// Illustrations déjà reçues (assets/carte-<id>.webp) : ajouter l'identifiant ici
const CARD_IMAGES = new Set(['foot-ballon', 'foot-crampons', 'foot-tir', 'foot-capitaine', 'foot-coupe', 'foot-gants', 'heros-eclair', 'heros-chien', 'heros-repaire', 'heros-cape', 'heros-masque', 'heros-bouclier', 'briques-brique', 'briques-cle', 'briques-fusee', 'briques-geant', 'briques-voiture']);
const CARDS = CARD_LIST.map(([id, r, name, art], i) => ({
  id, th: id.split('-')[0], r, name, price: RARITY[r].price, num: i + 1,
  art: CARD_IMAGES.has(id) ? `assets/carte-${id}.webp` : art,
}));
const cardById = id => CARDS.find(c => c.id === id);

/* ---------- Comptes ---------- */
function buysAll() {
  const all = {};
  [...others().map(d => d.buys || {}), state.buys || {}].forEach(b => Object.assign(all, b));
  return all;
}
const owned = id => !!buysAll()[id];
const spent = () => Object.keys(buysAll()).reduce((s, id) => s + ((cardById(id) || {}).price || 0), 0);
const balance = () => Math.max(0, totalStars() - spent());
const etoiles = n => `${n} étoile${n > 1 ? 's' : ''}`;

/* ---------- Affichage d'une carte (cadre façon cartes à collectionner) ---------- */
const cardArt = c => c.art.startsWith('assets/')
  ? `<img src="${c.art}" alt="" draggable="false">`
  : artHTML(c.art, '', c.name);
const cardFace = (c, big = false) => `
  <span class="vc-face r-${c.r} th-${c.th}${big ? ' big' : ''}">
    <span class="vc-art">${cardArt(c)}</span>
    ${big ? `<span class="vc-band"><span class="vc-bname">${esc(c.name)}</span></span>` : ''}
    <span class="vc-foot"><span class="vc-sym">${RARITY[c.r].sym}</span><span class="vc-num">${c.num}/${CARDS.length}</span></span>
    ${c.r !== 'c' ? '<span class="vc-holo"></span>' : ''}${c.r === 'l' ? '<span class="vc-spark"></span>' : ''}
  </span>`;
// Effet 3D : la carte s'incline et le reflet suit le doigt
function tiltCard(el) {
  if (!el) return;
  const move = e => {
    const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', `${(0.5 - y) * 16}deg`); el.style.setProperty('--ry', `${(x - 0.5) * 18}deg`);
    el.style.setProperty('--mx', `${x * 100}%`); el.style.setProperty('--my', `${y * 100}%`);
  };
  const reset = () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); };
  el.addEventListener('pointermove', move); el.addEventListener('pointerleave', reset); el.addEventListener('pointerup', reset);
}

/* ---------- Objectif (vignette épinglée) ---------- */
function goalHTML() {
  const g = cardById(state.goal);
  if (!g || owned(g.id)) return '';
  const bal = balance(), miss = Math.max(0, g.price - bal), pct = Math.min(100, Math.round(bal / g.price * 100));
  return `<div class="goal">${cardFace(g)}<div class="goal-txt"><b>Mon objectif : ${esc(g.name)}</b>
    <span class="goal-bar"><i style="width:${pct}%"></i></span>
    <small>${miss ? `Encore ${miss} ⭐ (${bal} / ${g.price})` : 'Tu peux l\'acheter ! 🎉'}</small></div></div>`;
}

/* ---------- La boutique ---------- */
function shop(th = state.theme) {
  const bal = balance(), B = buysAll();
  const list = CARDS.filter(c => c.th === th);
  render(`
    <header class="top">
      <button class="icon" id="back" aria-label="Retour">⬅️</button>
      <div class="title">🛍️ Boutique</div>
      <div class="stars piggy">🐷 ${bal} ⭐</div>
    </header>
    ${goalHTML()}
    <nav class="shop-tabs">${Object.entries(THEMES).map(([k, t]) => {
      const n = CARDS.filter(c => c.th === k), o = n.filter(c => B[c.id]).length;
      return `<button class="${k === th ? 'on' : ''}" data-th="${k}"><img src="${t.img}" alt=""><span>${o}/${n.length}</span></button>`;
    }).join('')}</nav>
    <main class="shop-grid">${list.map(c => {
      const own = !!B[c.id], can = bal >= c.price;
      return `<button class="vcard${own ? ' owned' : can ? '' : ' cant'}" data-id="${c.id}">
        ${cardFace(c)}${state.goal === c.id && !own ? '<span class="vc-pin">📌</span>' : ''}
        <span class="vc-name">${esc(c.name)}</span>
        ${own ? '<span class="vc-own">✓ À moi</span>' : `<span class="vc-price r-${c.r}">${c.price} ⭐</span>`}
      </button>`;
    }).join('')}</main>`);
  $('#back').onclick = home;
  app.querySelectorAll('.shop-tabs button').forEach(b => b.onclick = () => { sfxPop(); shop(b.dataset.th); });
  app.querySelectorAll('.vcard').forEach(b => b.onclick = () => cardModal(cardById(b.dataset.id)));
  const g = app.querySelector('.goal'); if (g) g.onclick = () => cardModal(cardById(state.goal));
  window.__screen = 'shop:' + th;
}

function closeModal() { document.querySelectorAll('.modal').forEach(m => m.remove()); }
function cardModal(c) {
  closeModal();
  const bal = balance(), own = owned(c.id), can = bal >= c.price, miss = c.price - bal;
  let body;
  if (own) body = `<p class="m-big">Elle est à toi ! 🎉</p><div class="row"><button class="btn" id="m-ok">👍 Super</button></div>`;
  else if (can) body = `
    <p class="m-calc"><span>🐷 ${bal} ⭐</span><b>−</b><span class="r-${c.r}">${c.price} ⭐</span><b>=</b><span class="q">?</span></p>
    <p class="m-txt">Tu as <b>${bal}</b> étoiles. Cette vignette coûte <b>${c.price}</b> étoiles.</p>
    <div class="row"><button class="btn" id="m-buy">🛒 Acheter</button><button class="btn sec" id="m-no">Pas maintenant</button></div>
    ${state.goal === c.id ? '' : '<button class="m-link" id="m-goal">📌 En faire mon objectif</button>'}`;
  else body = `
    <p class="m-txt">Cette vignette coûte <b>${c.price}</b> étoiles. Tu as <b>${bal}</b> étoile${bal > 1 ? 's' : ''}.</p>
    <p class="m-big">Il te manque ${miss} ⭐</p>
    <div class="row">${state.goal === c.id ? '<button class="btn sec" id="m-ungoal">Retirer mon objectif</button>' : '<button class="btn" id="m-goal">📌 C\'est mon objectif !</button>'}<button class="btn sec" id="m-no">Fermer</button></div>`;
  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal"><div class="m-box">
      ${cardFace(c, true)}
      <h2>${esc(c.name)}</h2><span class="m-rar r-${c.r}">${RARITY[c.r].name}</span>
      <div class="m-body">${body}</div>
    </div></div>`);
  const m = document.querySelector('.modal');
  tiltCard(m.querySelector('.vc-face'));
  m.onclick = e => { if (e.target === m) closeModal(); };
  const on = (id, f) => { const el = m.querySelector('#' + id); if (el) el.onclick = f; };
  on('m-ok', closeModal); on('m-no', closeModal);
  on('m-buy', () => buy(c));
  on('m-goal', () => { state.goal = c.id; markSettings(); save(); sfxPop(); say(`C'est ton objectif : ${c.name}. ${can ? '' : `Il te manque ${etoiles(miss)}.`}`); closeModal(); shop(c.th); });
  on('m-ungoal', () => { state.goal = ''; markSettings(); save(); closeModal(); shop(c.th); });
  say(own ? `${c.name}. Elle est à toi !` : can ? `${c.name}. Elle coûte ${etoiles(c.price)}. Tu as ${etoiles(bal)}. Combien t'en restera-t-il si tu l'achètes ?`
    : `${c.name}. Elle coûte ${etoiles(c.price)}. Il te manque ${etoiles(miss)}.`);
}

function buy(c) {
  const before = balance();
  if (before < c.price || owned(c.id)) return;
  state.buys = state.buys || {}; state.buys[c.id] = Date.now();
  if (state.goal === c.id) { state.goal = ''; markSettings(); }
  save();
  const after = before - c.price, m = document.querySelector('.modal');
  m.querySelector('.m-calc .q').textContent = `${after} ⭐`;
  m.querySelector('.m-calc .q').classList.add('done');
  m.querySelector('.m-body').insertAdjacentHTML('beforeend', '<p class="m-big">Elle est à toi ! 🎉</p>');
  m.querySelectorAll('.m-body .row, .m-body .m-link, .m-txt').forEach(e => e.remove());
  m.querySelector('.vc-face').classList.add('bought');
  sfxOK(); confetti();
  say(`Tu avais ${etoiles(before)}. Moins ${c.price}, il te reste ${etoiles(after)}. ${c.name} est à toi !`);
  m.querySelector('.m-body').insertAdjacentHTML('beforeend', '<div class="row"><button class="btn" id="m-ok2">👍 Super</button></div>');
  m.querySelector('#m-ok2').onclick = () => { closeModal(); shop(c.th); };
  m.onclick = e => { if (e.target === m) { closeModal(); shop(c.th); } };
}
