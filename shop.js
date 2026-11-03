'use strict';
/* =========================================================
   Boutique de vignettes : les étoiles gagnées se dépensent.
   Solde = étoiles gagnées (tous appareils) − prix des vignettes achetées.
   (Chargé avant app.js : n'utilise ses fonctions qu'au moment de l'appel.)
   ========================================================= */
const RARITY = {
  c: { name: 'Commune', price: 3 },
  r: { name: 'Rare', price: 8 },
  s: { name: 'Super rare', price: 15 },
  l: { name: 'Légendaire', price: 30 },
};
// [univers, rareté, nom, dessin (clé de art.js) ou image]
const CARDS = [
  ['foot', 'c', 'Ballon', 'ballon'], ['foot', 'c', 'Crampons', 'crampon'], ['foot', 'c', 'Gants du gardien', 'gant'],
  ['foot', 'r', 'Coupe', 'coupe'], ['foot', 'r', 'Médaille', 'médaille'], ['foot', 'r', 'But !', 'but'],
  ['foot', 's', 'Le stade', 'stade'], ['foot', 'l', 'Le retourné de Tom', 'assets/legende-foot.webp'],
  ['heros', 'c', 'Éclair', 'éclair'], ['heros', 'c', 'Bouclier', 'bouclier'], ['heros', 'c', 'Masque', 'masque'],
  ['heros', 'r', 'Super-héros', 'héros'], ['heros', 'r', 'Étoile', 'étoile'],
  ['heros', 's', 'Fusée', 'fusée'], ['heros', 'l', "L'envol de Super Malo", 'assets/legende-heros.webp'],
  ['briques', 'c', 'Brique', 'brique'], ['briques', 'c', 'Clé', 'clé'], ['briques', 'c', 'Boulon', 'boulon'],
  ['briques', 'r', 'Robot', 'robot'], ['briques', 'r', 'Tour', 'tour'],
  ['briques', 's', 'Engrenage', 'engrenage'], ['briques', 'l', 'Le château de Brik', 'assets/legende-briques.webp'],
  ['monstres', 'c', 'Cristal', 'cristal'], ['monstres', 'c', 'Œuf mystère', 'œuf'],
  ['monstres', 'r', 'Petit monstre', 'monstre'], ['monstres', 'r', 'Boule magique', 'boule'],
  ['monstres', 's', 'Baguette magique', 'magie'], ['monstres', 'l', "L'évolution de Zapi", 'assets/legende-monstres.webp'],
  ['dinos', 'c', 'Os', 'os'], ['dinos', 'c', 'Empreinte', 'empreinte'], ['dinos', 'c', 'Fougère', 'fougère'],
  ['dinos', 'r', 'Œuf de dino', 'œuf-dino'], ['dinos', 'r', 'Tortue', 'tortue'],
  ['dinos', 's', 'Dino', 'dino'], ['dinos', 'l', 'Rex et les bébés', 'assets/legende-dinos.webp'],
].map(([th, r, name, art]) => ({ id: th + ':' + art.replace(/^assets\/|\.webp$/g, ''), th, r, name, art, price: RARITY[r].price }));
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

/* ---------- Affichage d'une vignette ---------- */
const cardArt = c => c.art.startsWith('assets/')
  ? `<img src="${c.art}" alt="" draggable="false">`
  : artHTML(c.art, '', c.name);
const cardFace = (c, big = false) => `<span class="vc-face r-${c.r}${big ? ' big' : ''}"><span class="vc-art">${cardArt(c)}</span>${c.r === 's' || c.r === 'l' ? '<span class="vc-shine"></span>' : ''}</span>`;

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
