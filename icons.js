'use strict';
/* =========================================================
   Icônes de l'interface (remplacent les emojis)
   - ico(nom) : icône au trait, couleur du texte (currentColor)
   - STAR : étoile dorée dessinée
   - actIcon(id) : pastille éducative de chaque exercice
   ========================================================= */
(() => {
  const S = (d, extra = '') => `<path d="${d}" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
  const F = (d, fill = 'currentColor') => `<path d="${d}" fill="${fill}"/>`;
  const ICONS = {
    gear: S('M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z') + S('M19.4 13.5c.1-.5.1-1 .1-1.5s0-1-.1-1.5l2-1.6-2-3.4-2.4 1a7.6 7.6 0 0 0-2.6-1.5L14 2.5h-4l-.4 2.5A7.6 7.6 0 0 0 7 6.5l-2.4-1-2 3.4 2 1.6c-.1.5-.1 1-.1 1.5s0 1 .1 1.5l-2 1.6 2 3.4 2.4-1a7.6 7.6 0 0 0 2.6 1.5l.4 2.5h4l.4-2.5a7.6 7.6 0 0 0 2.6-1.5l2.4 1 2-3.4Z'),
    speaker: F('M4 9.5h3.5L12 5.5v13l-4.5-4H4z') + S('M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11'),
    mute: F('M4 9.5h3.5L12 5.5v13l-4.5-4H4z') + S('M16 9.5l5 5M21 9.5l-5 5'),
    close: S('M6 6l12 12M18 6L6 18', ' stroke-width="3"'),
    back: S('M14.5 5.5L8 12l6.5 6.5', ' stroke-width="3"'),
    next: S('M9.5 5.5L16 12l-6.5 6.5', ' stroke-width="3"'),
    home: S('M3.5 11.5L12 4l8.5 7.5') + S('M6 10v9.5h4.5V14h3v5.5H18V10'),
    replay: S('M4.5 12a7.5 7.5 0 1 0 2.2-5.3') + S('M4.5 4v4.5H9'),
    eraser: S('M8.5 19.5l-4-4a1.5 1.5 0 0 1 0-2.1l8.9-8.9a1.5 1.5 0 0 1 2.1 0l4 4a1.5 1.5 0 0 1 0 2.1l-8.4 8.9Z') + S('M8.5 19.5H20M9.8 8.1l6.1 6.1'),
    eye: S('M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z') + F('M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'),
    check: S('M4.5 12.5l5 5 10-11', ' stroke-width="3"'),
    ear: S('M7 9.5a5 5 0 0 1 10 0c0 3-2.5 4-3.2 6.2-.6 1.8-1.6 3.3-3.6 3.3A3.2 3.2 0 0 1 7 15.8') + S('M10 10a2 2 0 0 1 4 0c0 1.5-1.8 1.8-1.8 3.5'),
    bag: S('M5 8h14l-1.2 12H6.2Z') + S('M9 10V7a3 3 0 0 1 6 0v3'),
    cart: S('M3 4h2.5l2.2 10.5h10l2-7.5H6.6') + F('M9.5 20.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM16.5 20.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z'),
    pin: F('M14.5 3l6.5 6.5-2.3.8-3.5 3.5.4 4.2-1.6 1.6-3.7-3.7L5.5 20.5 3.5 18.5l4.6-4.8-3.7-3.7L6 8.4l4.2.4 3.5-3.5Z', '#E0476A'),
    thumb: S('M7.5 10.5v9H4.5v-9ZM7.5 10.5l3.8-6.5c1.6 0 2.6 1.3 2.2 3l-.7 2.7h5c1.3 0 2.2 1.2 1.9 2.4l-1.5 6.2A2.5 2.5 0 0 1 15.8 20H7.5'),
    no: S('M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM5.6 5.6l12.8 12.8'),
    timer: S('M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM12 9v4.5l3 2M9.5 2.5h5'),
    play: F('M8 5.5v13l10.5-6.5Z'),
    stop: F('M6.5 6.5h11v11h-11z'),
    sync: S('M19.5 9A7.8 7.8 0 0 0 5.6 7.4L4 9M4.5 15a7.8 7.8 0 0 0 13.9 1.6L20 15') + S('M4 4.5V9h4.5M20 19.5V15h-4.5'),
    warn: S('M12 3.5l9.5 16.5h-19ZM12 10v4.5') + F('M12 18.3a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z'),
    sparkle: F('M12 2.5l2.1 6.4 6.4 2.1-6.4 2.1L12 19.5l-2.1-6.4-6.4-2.1 6.4-2.1Z', '#F4B400') + F('M19 15.5l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9Z', '#F4B400'),
    party: F('M3.5 20.5l4.5-12 7.5 7.5Z', '#F4A259') + S('M14 4.5c.5 1.5 0 3-1.5 3.5M19.5 10c-1.5-.5-3 0-3.5 1.5M18 3.5l.5 2M21 7l-2 .5'),
    trophy: S('M7.5 4h9v5a4.5 4.5 0 0 1-9 0ZM7.5 6H4.5c0 3 1.5 4.5 3.3 4.7M16.5 6h3c0 3-1.5 4.5-3.3 4.7M12 13.5V17M8.5 20h7l-.8-3h-5.4Z'),
  };
  const STAR_PATH = 'M12 2.6l2.85 5.95 6.5.85-4.78 4.5 1.2 6.45L12 17.2l-5.77 3.15 1.2-6.45-4.78-4.5 6.5-.85Z';
  window.ico = (name, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ''}</svg>`;
  window.STAR = `<svg class="ico star" viewBox="0 0 24 24" aria-label="étoile"><path d="${STAR_PATH}" fill="#FFC83D" stroke="#C98A00" stroke-width="1.4" stroke-linejoin="round"/><path d="M12 5.5l1.7 3.6" stroke="#FFF3C4" stroke-width="1.6" stroke-linecap="round" fill="none"/></svg>`;
  window.STAR_OFF = `<svg class="ico star off" viewBox="0 0 24 24" aria-hidden="true"><path d="${STAR_PATH}" fill="#E7DFD2" stroke="#CFC4B2" stroke-width="1.4" stroke-linejoin="round"/></svg>`;

  /* ---------- Pastilles des exercices ---------- */
  const T = (txt, size = 15, fill = 'currentColor', y = 0) => `<text x="20" y="${21.5 + y}" text-anchor="middle" dominant-baseline="middle" font-family="ui-rounded, 'Arial Rounded MT Bold', system-ui, sans-serif" font-weight="900" font-size="${size}" fill="${fill}">${txt}</text>`;
  const badge = inner => `<svg class="aico" viewBox="0 0 40 40" aria-hidden="true">${inner}</svg>`;
  const dots = (n, cx, cy) => { const p = { 5: [[-6, -6], [6, -6], [0, 0], [-6, 6], [6, 6]] }[n]; return p.map(([x, y]) => `<circle cx="${cx + x}" cy="${cy + y}" r="2.6" fill="currentColor"/>`).join(''); };
  const cur = (txt, h = 22) => (typeof cursiveMini === 'function') ? cursiveMini(txt, 'cw-aico') : txt;
  const ACT = {
    // Maths
    compter: () => badge(`<rect x="9" y="9" width="22" height="22" rx="5" fill="none" stroke="currentColor" stroke-width="2.3"/>${dots(5, 20, 20)}`),
    nlettres: () => badge(T('1', 16, 'currentColor', -6) + T('un', 11, 'currentColor', 8)),
    suite: () => badge(T('1·2·3', 11)),
    plusun: () => badge(T('+1', 17)),
    comparer: () => badge(T('&lt; &gt;', 15)),
    additions: () => badge(T('+', 26, 'currentColor', -1)),
    soustractions: () => badge(T('−', 26, 'currentColor', -1)),
    motifs: () => badge(['#3A86FF', '#E63946', '#3A86FF', '#E63946'].map((c, i) => `<circle cx="${8 + i * 8}" cy="20" r="3.4" fill="${c}"/>`).join('')),
    formes: () => badge(`<polygon points="12,9 18,19 6,19" fill="#F2A65A"/><rect x="21" y="9.5" width="10" height="9" rx="1" fill="#6FA8DC"/><circle cx="20" cy="27" r="5" fill="#E8685A"/>`),
    tracechiffres: () => badge(`<path d="M15 14c1-3.5 9.5-4 9.5 1 0 4-6.5 7.5-9.5 12h10.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.1 4.2"/><circle cx="15" cy="14" r="2.6" fill="#2EC4B6"/>`),
    // Lecture
    messons: () => badge(T('ou', 17)),
    lettres: () => badge(T('Aa', 16)),
    entends: () => `<span class="aico-ico">${window.ico('ear')}</span>`,
    fusion: () => badge(T('r', 13, 'currentColor', -7) + T('+a', 13, 'currentColor', 7)),
    syllabes: () => badge(T('ra', 18)),
    meli: () => badge(T('ra', 11, 'currentColor', -7) + T('ar', 11, 'currentColor', 7)),
    premierson: () => badge(`<rect x="8" y="10" width="11" height="20" rx="3" fill="currentColor" opacity=".18"/>` + T('ch', 13, 'currentColor') ),
    quelmot: () => `<span class="aico-art">${artHTML('chat')}</span>`,
    lismot: () => badge(T('lit', 15)),
    bonnephrase: () => badge(`<path d="M9 14h22M9 20h16M9 26h19" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>`),
    fluence: () => `<span class="aico-ico">${window.ico('timer')}</span>`,
    // Écriture
    ecrismot: () => badge(['c', 'h', 'a'].map((l, k) => `<rect x="${5 + k * 10.5}" y="12" width="9" height="16" rx="2.5" fill="${k < 2 ? 'currentColor' : 'none'}" fill-opacity="${k < 2 ? .16 : 0}" stroke="currentColor" stroke-width="1.8"${k === 2 ? ' stroke-dasharray="2.5 2"' : ''}/>` + (k < 2 ? `<text x="${9.5 + k * 10.5}" y="21.5" text-anchor="middle" dominant-baseline="middle" font-family="ui-rounded, system-ui, sans-serif" font-weight="900" font-size="11" fill="currentColor">${l}</text>` : '')).join('')),
    dictee: () => `<span class="aico-ico">${window.ico('ear')}</span>`,
    'cursive-lettres': () => `<span class="aico-cur">${cur('a')}</span>`,
    'cursive-syllabes': () => `<span class="aico-cur">${cur('la')}</span>`,
    'cursive-mots': () => `<span class="aico-cur">${cur('ami')}</span>`,
  };
  window.actIcon = id => ACT[id] ? ACT[id]() : '';
})();
