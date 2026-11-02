'use strict';
/* =========================================================
   Illustrations vectorielles des exercices (style assorti aux
   illustrations : trait fin brun, couleurs douces, lumière en
   haut à gauche, petite ombre au sol). Repère 0..100.
   Les dessins sont regroupés dans une planche SVG unique,
   insérée une fois dans la page et réutilisée via <use>.
   ========================================================= */
(() => {
  const K = '#5A4535';                                   // couleur du trait
  const O = `stroke="${K}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"`;
  const c = {
    red: '#E8685A', orange: '#F2A65A', yellow: '#F6D365', green: '#8CC084', dkgreen: '#5E9C6A', blue: '#6FA8DC',
    ltblue: '#A9D6F5', purple: '#A98BD8', pink: '#F4A6B8', brown: '#B07D5B', dkbrown: '#8A5A3C', beige: '#F3DEC0',
    gray: '#B9BEC7', dkgray: '#7D8591', white: '#FFFDF8', cream: '#FFF1D6', ink: '#4A3B33', gold: '#F4C542', sky: '#CFE8F7',
  };
  // Forme pleine + lumière/ombre douce + contour
  const P = (d, f) => `<path d="${d}" fill="${f}"/><path d="${d}" fill="url(#sh)"/><path d="${d}" fill="none" ${O}/>`;
  const C = (x, y, r, f) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#sh)"/><circle cx="${x}" cy="${y}" r="${r}" fill="none" ${O}/>`;
  const E = (x, y, rx, ry, f, rot = 0) => { const t = rot ? ` transform="rotate(${rot} ${x} ${y})"` : ''; return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}"${t}/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#sh)"${t}/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="none" ${O}${t}/>`; };
  const R = (x, y, w, h, r, f) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${f}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="url(#sh)"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="none" ${O}/>`;
  const L = (d, w = 2.2, col = K) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const F = (d, f, op = 1) => `<path d="${d}" fill="${f}" opacity="${op}"/>`;          // remplissage sans contour
  const ground = (x = 50, rx = 30, y = 92) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="3.5" fill="${K}" opacity=".12"/>`;
  const eyes = (x1, x2, y, r = 3.4) => [x1, x2].map(x => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c.ink}"/><circle cx="${x - r * .35}" cy="${y - r * .4}" r="${r * .38}" fill="#fff"/>`).join('');
  const eye1 = (x, y, r = 3.4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c.ink}"/><circle cx="${x - r * .35}" cy="${y - r * .4}" r="${r * .38}" fill="#fff"/>`;
  const cheek1 = (x, y, r = 3.6) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .6}" fill="#F28B9B" opacity=".55"/>`;
  const cheeks = (x1, x2, y, r = 3.6) => [x1, x2].map(x => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .6}" fill="#F28B9B" opacity=".55"/>`).join('');
  const smile = (x, y, w = 5) => L(`M${x - w} ${y} Q${x} ${y + w * .8} ${x + w} ${y}`, 2);
  const shine = (x, y, rx = 4, ry = 7, rot = -25) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff" opacity=".5" transform="rotate(${rot} ${x} ${y})"/>`;
  const star = (x, y, r1, r2, f, n = 5) => P(Array.from({ length: n * 2 }, (_, i) => { const a = (-90 + i * 180 / n) * Math.PI / 180, r = i % 2 ? r2 : r1; return `${i ? 'L' : 'M'}${(x + r * Math.cos(a)).toFixed(1)} ${(y + r * Math.sin(a)).toFixed(1)}`; }).join(' ') + 'Z', f);
  const sparkle = (x, y, r = 4, f = c.gold) => F(`M${x} ${y - r} Q${x + r * .2} ${y - r * .2} ${x + r} ${y} Q${x + r * .2} ${y + r * .2} ${x} ${y + r} Q${x - r * .2} ${y + r * .2} ${x - r} ${y} Q${x - r * .2} ${y - r * .2} ${x} ${y - r}Z`, f);
  const wheel = (x, y, r) => C(x, y, r, c.ink) + C(x, y, r * .55, c.gray) + `<circle cx="${x}" cy="${y}" r="${r * .15}" fill="${K}"/>`;

  const ART = {
    // ---------- Mots ----------
    'ananas': () => ground(50, 22) + P('M50 8 L44 26 L38 14 L42 30 L32 22 L40 34 L60 34 L68 22 L58 30 L62 14 L56 26Z', c.dkgreen) + E(50, 62, 20, 28, c.gold) +
      L('M36 46 L62 82 M32 60 L54 88 M44 38 L66 70 M64 46 L38 82 M68 60 L46 88 M56 38 L34 70', 1.4, '#C9962F'),
    'île': () => E(50, 78, 44, 12, c.ltblue) + P('M18 78 Q50 56 82 78Z', c.beige) + P('M52 74 Q54 50 47 30 L51 29 Q60 50 57 74Z', c.brown) +
      P('M49 30 Q34 18 18 28 Q34 26 49 30Z', c.green) + P('M49 30 Q62 14 82 22 Q64 24 49 30Z', c.green) + P('M49 30 Q40 34 30 48 Q44 38 49 30Z', c.dkgreen) + P('M49 30 Q64 34 70 46 Q58 38 49 30Z', c.dkgreen),
    'olive': () => L('M14 22 Q46 30 86 74', 3, c.dkbrown) + P('M30 26 Q38 10 54 14 Q42 26 30 26Z', c.green) + P('M60 46 Q76 36 86 44 Q74 54 60 46Z', c.green) +
      E(36, 50, 13, 17, '#8FA650', -20) + E(62, 70, 12, 16, '#6E8B3D', 15) + shine(32, 44, 3, 5) + shine(58, 64, 3, 5),
    'lune': () => P('M60 10 A40 40 0 1 0 88 66 A32 32 0 1 1 60 10Z', c.gold) + L('M38 52 Q42 56 46 52', 2) + cheek1(36, 58) +
      sparkle(80, 20, 5) + sparkle(88, 40, 3),
    'cheval': () => P('M30 92 L34 64 Q22 58 18 46 Q14 34 26 30 L40 22 Q46 10 54 12 Q60 6 64 12 Q80 22 80 44 L76 92Z', c.brown) +
      P('M54 12 Q66 14 72 26 Q78 40 76 60 Q70 44 62 34 Q58 24 54 12Z', c.dkbrown) + eye1(36, 36, 3) +
      `<ellipse cx="22" cy="44" rx="2" ry="2.6" fill="${K}"/>` + cheek1(30, 44) + P('M44 20 L46 8 L52 16Z', c.brown),
    'rat': () => ground(48, 30) + L('M74 72 Q92 70 90 54 Q88 44 80 48', 2.6) + E(50, 70, 28, 18, c.gray) + C(30, 46, 9, c.gray) + C(30, 46, 5, c.pink) +
      P('M24 66 Q14 58 18 50 Q24 44 34 50 Q40 58 34 68Z', c.gray) + eye1(24, 56, 2.6) + C(13, 58, 3, c.pink) +
      L('M14 62 L4 60 M14 64 L5 68', 1.4),
    'moto': () => ground(50, 40, 90) + wheel(22, 74, 14) + wheel(78, 74, 14) + P('M22 74 L40 48 L66 48 L78 74 L62 74 L54 60 L38 62 Z', c.red) +
      R(36, 40, 26, 9, 4, c.ink) + L('M66 48 L72 32 L82 30', 3) + C(82, 30, 3, c.gray) + R(44, 58, 14, 8, 3, c.gray),
    'fusée': () => P('M42 78 Q50 98 58 78Z', c.orange) + P('M46 78 Q50 90 54 78Z', c.gold) + P('M34 60 L22 82 L38 76Z', c.red) + P('M66 60 L78 82 L62 76Z', c.red) +
      P('M50 6 Q70 26 66 76 L34 76 Q30 26 50 6Z', c.white) + P('M50 6 Q62 18 65 32 L35 32 Q38 18 50 6Z', c.red) + C(50, 48, 9, c.ltblue) + shine(47, 45, 2.5, 3.5),
    'chat': () => P('M22 40 L28 10 L46 30Z', c.orange) + P('M78 40 L72 10 L54 30Z', c.orange) + F('M28 32 L30 18 L40 30Z', c.pink) + F('M72 32 L70 18 L60 30Z', c.pink) +
      E(50, 56, 34, 30, c.orange) + E(50, 68, 15, 11, c.cream) + eyes(37, 63, 52, 4) + cheeks(28, 72, 64) +
      F('M46 62 L54 62 L50 66Z', c.pink) + L('M50 66 Q46 71 42 68 M50 66 Q54 71 58 68', 1.8) + L('M24 62 L8 58 M24 67 L9 70 M76 62 L92 58 M76 67 L91 70', 1.4),
    'vélo': () => ground(50, 42, 88) + C(24, 68, 17, 'none') + C(76, 68, 17, 'none') + `<circle cx="24" cy="68" r="3" fill="${K}"/><circle cx="76" cy="68" r="3" fill="${K}"/>` +
      L('M24 68 L42 44 L66 44 L76 68 M42 44 L50 68 L66 44 M50 68 L24 68', 3.2, c.blue) + L('M38 36 L48 36', 4) + L('M64 44 L60 30 L70 28', 3),
    'judo': () => P('M30 18 L50 30 L70 18 L90 34 L80 50 L72 44 L72 90 L28 90 L28 44 L20 50 L10 34Z', c.white) + L('M30 18 L50 60 L70 18', 2) + R(26, 58, 48, 9, 2, c.ink) +
      P('M46 66 L40 84 L48 82 L50 68Z', c.ink) + P('M54 66 L60 84 L52 82 L50 68Z', c.ink),
    'nid': () => E(36, 46, 9, 12, '#BFE3F0') + E(52, 42, 9, 12, '#D7EEF7') + E(66, 48, 9, 12, '#BFE3F0') + P('M12 50 Q50 64 88 50 Q84 84 50 86 Q16 84 12 50Z', c.brown) +
      L('M18 60 Q50 70 82 60 M22 70 Q50 80 78 70 M30 56 L44 78 M56 58 L70 80', 1.4, c.dkbrown),
    'pomme': () => ground(50, 28) + L('M50 26 Q52 14 58 8', 3.4, c.dkbrown) + P('M54 18 Q68 4 82 12 Q68 26 54 18Z', c.green) +
      P('M50 26 C38 16 12 22 14 50 C16 78 36 92 50 86 C64 92 84 78 86 50 C88 22 62 16 50 26Z', c.red) + shine(30, 44, 5, 9),
    'tomate': () => ground(50, 32) + E(50, 56, 36, 30, c.red) + star(50, 30, 16, 6, c.dkgreen, 5) + L('M50 26 L52 16', 3, c.dkgreen) + shine(32, 48, 5, 8),
    'loup': () => P('M20 44 L24 10 L42 30Z', c.dkgray) + P('M80 44 L76 10 L58 30Z', c.dkgray) + F('M26 34 L27 18 L37 30Z', c.pink) + F('M74 34 L73 18 L63 30Z', c.pink) +
      P('M14 44 Q16 26 50 26 Q84 26 86 44 Q88 68 64 78 L50 90 L36 78 Q12 68 14 44Z', c.gray) + P('M36 62 Q50 54 64 62 Q62 80 50 88 Q38 80 36 62Z', c.white) +
      eyes(37, 63, 50, 3.6) + E(50, 66, 5, 3.6, c.ink),
    'dé': () => ground(50, 32) + P('M50 10 L86 26 L50 42 L14 26Z', c.white) + P('M14 26 L50 42 L50 88 L14 70Z', '#EEE7DC') + P('M86 26 L50 42 L50 88 L86 70Z', '#E2D8C9') +
      [[50, 26], [28, 40], [36, 56], [30, 64], [62, 52], [74, 42], [66, 72], [76, 58]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3.2" ry="2.6" fill="${c.ink}"/>`).join(''),
    'banane': () => ground(50, 32) + P('M14 32 Q20 78 70 80 Q88 78 90 70 Q60 70 40 52 Q26 38 22 26 Z', c.yellow) + L('M22 34 Q34 64 74 74', 1.4, '#C9A43A') +
      P('M14 32 L12 24 L20 24 L22 26Z', c.dkbrown),
    'lama': () => ground(50, 26) + P('M30 90 L30 58 Q30 46 44 46 L52 46 L52 18 Q52 8 62 8 Q72 8 72 18 L72 60 Q72 70 66 72 L66 90 L58 90 L58 74 L40 74 L40 90Z', c.cream) +
      P('M58 10 L56 0 L62 6Z', c.cream) + P('M68 10 L70 0 L72 8Z', c.cream) + eyes(60, 68, 20, 2.4) + E(64, 28, 4, 3, c.pink) + cheeks(56, 72, 26, 2.4) +
      F('M40 46 Q46 52 52 46 L52 58 Q46 62 40 58Z', c.red, .8),
    'lit': () => ground(50, 42, 90) + R(10, 40, 8, 48, 3, c.brown) + R(82, 54, 8, 34, 3, c.brown) + R(14, 60, 72, 16, 4, c.brown) + E(30, 52, 13, 7, c.white) +
      P('M40 46 L86 54 L86 66 L40 66Z', c.blue) + L('M50 52 L50 66 M62 54 L62 66 M74 56 L74 66', 1.4, '#4E86BC'),
    'mur': () => [[8, 14, 26], [36, 14, 28], [66, 14, 26], [8, 32, 12], [22, 32, 28], [52, 32, 28], [82, 32, 10], [8, 50, 26], [36, 50, 28], [66, 50, 26], [8, 68, 12], [22, 68, 28], [52, 68, 28], [82, 68, 10]]
      .map(([x, y, w], i) => R(x, y, w, 16, 2, i % 3 ? c.red : '#D9584C')).join(''),
    'robe': () => ground(50, 26) + P('M38 10 L44 10 Q50 18 56 10 L62 10 L64 34 L58 38 L82 86 L18 86 L42 38 L36 34Z', c.pink) + P('M40 36 L60 36 L60 42 L40 42Z', c.white) +
      [[38, 64], [56, 58], [50, 76], [66, 76], [32, 78]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#fff" opacity=".85"/>`).join(''),
    'fil': () => ground(46, 26) + R(24, 16, 44, 9, 3, c.brown) + R(24, 75, 44, 9, 3, c.brown) + R(30, 25, 32, 50, 4, c.red) + L('M32 34 L60 30 M32 44 L60 40 M32 54 L60 50 M32 64 L60 60', 1.4, '#C24E42') +
      L('M62 60 Q84 66 80 80 Q76 90 90 90', 2.4, c.red),
    'riz': () => ground(50, 34, 90) + P('M18 50 Q30 22 50 24 Q70 22 82 50Z', c.white) + [[34, 38], [46, 32], [58, 36], [66, 44], [40, 46], [54, 44]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3" ry="1.6" fill="#E8E1D4"/>`).join('') +
      P('M12 50 L88 50 Q84 84 50 86 Q16 84 12 50Z', c.ltblue) + L('M22 62 Q50 70 78 62', 1.6, '#6E9CC4'),
    'nez': () => E(50, 52, 38, 36, c.beige) + P('M46 26 Q40 48 34 60 Q32 70 42 70 Q46 76 50 72 Q54 76 58 70 Q68 70 66 60 Q60 48 54 26Z', '#F0C9A6') +
      `<ellipse cx="43" cy="66" rx="3" ry="2" fill="${K}" opacity=".6"/><ellipse cx="57" cy="66" rx="3" ry="2" fill="${K}" opacity=".6"/>` + cheeks(26, 74, 62, 5),
    'pied': () => ground(50, 28) + [[28, 30, 7.5], [41, 24, 6.5], [53, 23, 6], [63, 26, 5.2], [71, 32, 4.6]].map(([x, y, r]) => C(x, y, r, c.beige)).join('') +
      P('M24 40 Q34 30 50 32 Q70 32 74 42 Q78 60 68 74 Q60 90 44 90 Q28 90 24 74 Q20 56 24 40Z', c.beige) + cheek1(40, 70, 4),
    'poule': () => ground(50, 28) + E(52, 60, 30, 26, c.white) + P('M66 48 Q86 30 88 52 Q84 66 72 64Z', c.white) + C(36, 34, 15, c.white) +
      P('M30 22 Q32 12 38 18 Q42 10 46 20 Q50 16 48 26Z', c.red) + P('M20 34 L10 38 L20 42Z', c.orange) + F('M26 42 Q24 50 30 48Z', c.red) + eye1(32, 32, 2.6) +
      L('M46 86 L44 94 M58 86 L60 94', 2.4, c.orange),
    'ours': () => C(24, 26, 11, c.brown) + C(76, 26, 11, c.brown) + C(24, 26, 5.5, c.beige) + C(76, 26, 5.5, c.beige) + E(50, 54, 34, 32, c.brown) +
      E(50, 66, 14, 11, c.beige) + E(50, 61, 5, 3.6, c.ink) + eyes(37, 63, 48, 3.6) + cheeks(28, 72, 60) + smile(50, 68, 4),
    'robot': () => ground(50, 26) + L('M50 14 L50 6', 2.6) + C(50, 5, 3.4, c.red) + R(26, 14, 48, 34, 8, c.gray) + R(32, 22, 36, 20, 6, c.sky) + eyes(42, 58, 31, 3.2) + smile(50, 36, 4) +
      R(30, 52, 40, 32, 6, c.blue) + C(50, 66, 5, c.gold) + R(14, 54, 12, 24, 5, c.gray) + R(74, 54, 12, 24, 5, c.gray) + R(34, 84, 10, 8, 2, c.dkgray) + R(56, 84, 10, 8, 2, c.dkgray),
    'tortue': () => ground(48, 34, 88) + E(80, 64, 9, 8, c.green) + eye1(82, 62, 2) +
      E(30, 80, 7, 6, c.green) + E(62, 80, 7, 6, c.green) + P('M14 74 Q16 34 46 32 Q76 34 76 74Z', '#7FB069') +
      L('M30 74 L36 50 L56 50 L62 74 M36 50 L46 36 L56 50 M22 60 L36 50 M70 60 L56 50', 1.6, '#4F7D3E'),
    'souris': () => ground(50, 30) + L('M74 76 Q94 78 90 60', 2.4) + C(28, 30, 14, c.gray) + C(72, 30, 14, c.gray) + C(28, 30, 8, c.pink) + C(72, 30, 8, c.pink) +
      E(50, 60, 28, 26, c.gray) + eyes(40, 60, 54, 3.4) + C(50, 64, 3.4, c.pink) + cheeks(32, 68, 66) + L('M36 66 L20 64 M36 70 L22 74 M64 66 L80 64 M64 70 L78 74', 1.3),
    'vache': () => P('M22 30 Q10 22 14 14 Q22 22 30 24Z', c.cream) + P('M78 30 Q90 22 86 14 Q78 22 70 24Z', c.cream) + E(16, 40, 9, 6, c.white, -20) + E(84, 40, 9, 6, c.white, 20) +
      E(50, 48, 30, 32, c.white) + F('M26 36 Q34 24 44 30 Q42 44 30 46Z', c.ink, .85) + F('M70 52 Q80 48 78 60 Q72 64 68 58Z', c.ink, .85) +
      E(50, 72, 22, 14, c.pink) + `<ellipse cx="42" cy="72" rx="3" ry="4" fill="${K}" opacity=".7"/><ellipse cx="58" cy="72" rx="3" ry="4" fill="${K}" opacity=".7"/>` + eyes(38, 62, 48, 3.6),
    'livre': () => ground(50, 40, 88) + P('M50 26 Q30 16 8 22 L8 80 Q30 74 50 84Z', c.white) + P('M50 26 Q70 16 92 22 L92 80 Q70 74 50 84Z', c.white) +
      L('M16 34 Q30 30 42 36 M16 44 Q30 40 42 46 M16 54 Q30 50 42 56 M58 36 Q70 30 84 34 M58 46 Q70 40 84 44 M58 56 Q70 50 84 54', 1.4, c.gray) + P('M8 80 Q30 74 50 84 Q70 74 92 80 L92 86 Q70 80 50 90 Q30 80 8 86Z', c.red),
    'bus': () => ground(50, 42, 90) + R(8, 24, 84, 54, 10, c.gold) + R(14, 32, 16, 18, 3, c.sky) + R(34, 32, 16, 18, 3, c.sky) + R(54, 32, 16, 18, 3, c.sky) + R(74, 32, 12, 30, 3, c.sky) +
      L('M8 58 L74 58', 2.4, '#D9A21F') + wheel(26, 80, 9) + wheel(72, 80, 9) + C(88, 70, 2.6, c.white),
    'renard': () => P('M14 18 L36 34 L22 50Z', c.orange) + P('M86 18 L64 34 L78 50Z', c.orange) + F('M19 25 L31 34 L24 44Z', c.ink, .7) + F('M81 25 L69 34 L76 44Z', c.ink, .7) +
      P('M14 44 Q16 28 50 30 Q84 28 86 44 Q80 70 50 88 Q20 70 14 44Z', c.orange) + P('M24 54 Q38 56 50 66 Q62 56 76 54 Q70 74 50 88 Q30 74 24 54Z', c.white) +
      eyes(36, 64, 50, 3.4) + E(50, 80, 5, 3.6, c.ink) + cheeks(28, 72, 60),
    'chou': () => ground(50, 32) + C(50, 56, 32, '#9CCB86') + P('M24 46 Q30 22 50 24 Q70 22 76 46 Q64 36 50 40 Q36 36 24 46Z', '#B8DCA4') + P('M34 56 Q40 40 50 40 Q60 40 66 56 Q58 50 50 52 Q42 50 34 56Z', '#CDE8BC') +
      L('M50 52 L50 84 M50 66 L36 78 M50 66 L64 78', 1.6, '#5E9C6A'),
    'salade': () => ground(50, 34, 90) + P('M14 52 Q12 34 24 30 Q28 16 42 22 Q50 10 60 22 Q74 16 76 30 Q90 34 86 52Z', c.green) + P('M30 50 Q30 36 42 36 Q46 28 54 34 Q66 32 66 50Z', '#B8DCA4') +
      C(34, 46, 6, c.red) + C(62, 44, 6, c.red) + P('M12 50 L88 50 Q84 84 50 86 Q16 84 12 50Z', c.white) + L('M20 60 Q50 68 80 60', 1.6, c.ltblue),
    'bol': () => ground(50, 34, 88) + E(50, 40, 38, 10, '#E9D2B0') + P('M12 40 Q14 80 50 84 Q86 80 88 40 Q70 50 50 50 Q30 50 12 40Z', c.orange) + E(50, 40, 38, 10, 'none') + L('M24 60 Q50 70 76 60', 2, c.white),
    'mouche': () => E(36, 34, 16, 10, '#E3F2FB', -30) + E(64, 34, 16, 10, '#E3F2FB', 30) + E(50, 58, 16, 22, c.dkgray) + L('M38 54 L62 54 M38 64 L62 64', 1.4, c.gray) + C(50, 36, 12, c.dkgray) +
      C(44, 34, 5, c.red) + C(56, 34, 5, c.red) + L('M36 68 L24 76 M64 68 L76 76 M38 76 L30 88 M62 76 L70 88', 2),
    'roue': () => ground(50, 32) + C(50, 50, 40, c.ink) + C(50, 50, 26, c.gray) + C(50, 50, 7, c.dkgray) + L('M50 24 L50 76 M24 50 L76 50 M32 32 L68 68 M68 32 L32 68', 2.4, c.dkgray) + shine(34, 30, 4, 8, -45),
    'nuage': () => P('M24 70 Q8 70 8 56 Q8 42 24 42 Q24 22 46 22 Q62 22 66 36 Q72 30 80 34 Q92 38 90 52 Q96 70 78 70Z', c.white) + eyes(40, 60, 50, 3) + cheeks(34, 66, 58, 3) + smile(50, 56, 4),
    'parasol': () => ground(52, 32) + L('M50 34 L58 92', 3.4, c.dkbrown) + P('M8 40 Q50 0 92 40 Q80 34 71 40 Q60 32 50 40 Q40 32 29 40 Q20 34 8 40Z', c.red) +
      F('M29 40 Q35 16 50 10 Q42 24 40 37Z', c.white, .9) + F('M71 40 Q65 16 50 10 Q58 24 60 37Z', c.white, .9),
    'porte': () => ground(50, 30, 92) + R(22, 8, 56, 84, 6, c.brown) + R(30, 16, 40, 30, 3, '#C59272') + R(30, 52, 40, 32, 3, '#C59272') + C(66, 52, 3.6, c.gold),
    'loupe': () => L('M62 62 L86 86', 9, c.dkbrown) + L('M62 62 L86 86', 5, c.brown) + C(42, 42, 28, c.sky) + C(42, 42, 22, '#E7F4FC') + shine(32, 32, 4, 9, -45) + C(42, 42, 28, 'none'),
    'tulipe': () => ground(50, 20) + L('M50 46 L50 90', 3, c.dkgreen) + P('M50 84 Q30 76 26 56 Q42 62 50 78Z', c.green) + P('M50 80 Q70 70 72 52 Q58 60 50 74Z', c.green) +
      P('M30 18 L40 28 L50 12 L60 28 L70 18 Q74 48 50 52 Q26 48 30 18Z', c.red),
    'pile': () => ground(50, 22) + R(40, 8, 20, 8, 2, c.gray) + R(30, 14, 40, 76, 6, c.ink) + R(30, 14, 40, 30, 6, c.gold) + L('M50 24 L50 34 M45 29 L55 29', 2.4, c.ink) + L('M45 74 L55 74', 2.4, c.white),
    'but': () => ground(50, 44, 90) + P('M10 86 L10 26 L90 26 L90 86', 'none') + `<g opacity=".55">${L('M10 40 L90 40 M10 54 L90 54 M10 68 L90 68 M24 26 L24 86 M38 26 L38 86 M52 26 L52 86 M66 26 L66 86 M80 26 L80 86', 1.2, c.dkgray)}</g>` +
      L('M10 88 L10 24 L90 24 L90 88', 5, c.white) + L('M10 88 L10 24 L90 24 L90 88', 1.4) + C(50, 78, 9, c.white) + F('M50 72 L55 75 L53 81 L47 81 L45 75Z', c.ink),
    'stade': () => P('M6 70 L6 46 Q50 22 94 46 L94 70 Q50 84 6 70Z', c.gray) + P('M16 66 Q50 54 84 66 Q50 80 16 66Z', c.green) + L('M50 58 L50 76', 1.4, c.white) +
      [[16, 14], [50, 6], [84, 14]].map(([x, y]) => L(`M${x} ${y + 30} L${x} ${y}`, 2) + R(x - 7, y - 4, 14, 8, 2, c.gold)).join('') + P('M6 46 Q50 22 94 46 L94 52 Q50 30 6 52Z', c.red),
    'héros': () => P('M14 94 Q20 60 50 58 Q80 60 86 94Z', c.red) + P('M24 94 Q26 66 50 64 Q74 66 76 94Z', c.blue) + P('M50 70 L42 84 L50 82 L46 94 L58 78 L50 80 L54 70Z', c.gold) +
      C(50, 38, 22, '#F6D2B4') + P('M28 36 Q26 12 50 14 Q76 12 72 36 Q66 24 50 26 Q36 24 28 36Z', c.dkbrown) + P('M30 36 Q50 30 70 36 L68 46 Q50 42 32 46Z', c.ink) +
      `<ellipse cx="41" cy="40" rx="4.5" ry="3.5" fill="#fff"/><ellipse cx="59" cy="40" rx="4.5" ry="3.5" fill="#fff"/><circle cx="41" cy="40" r="2" fill="${c.ink}"/><circle cx="59" cy="40" r="2" fill="${c.ink}"/>` + smile(50, 50, 5),
    'épée': () => P('M46 64 L44 18 L50 6 L56 18 L54 64Z', '#DDE3EA') + L('M50 12 L50 60', 1.2, '#AEB8C4') + R(30, 62, 40, 8, 4, c.gold) + R(45, 70, 10, 18, 3, c.brown) + C(50, 92, 4.5, c.gold),
    'fée': () => E(32, 46, 18, 12, '#DDF2FB', -30) + E(68, 46, 18, 12, '#DDF2FB', 30) + P('M50 52 L32 90 L68 90Z', c.pink) + C(50, 36, 14, '#F6D2B4') +
      P('M36 34 Q36 18 50 20 Q64 18 64 34 Q58 26 50 28 Q42 26 36 34Z', c.gold) + eyes(45, 55, 38, 2.4) + cheeks(41, 59, 43, 2.4) + L('M68 62 L84 34', 2.2, c.dkbrown) + star(85, 30, 7, 3, c.gold),
    'magie': () => L('M22 82 L66 34', 7, c.ink) + L('M58 42 L66 34', 7, c.white) + star(72, 26, 15, 6.5, c.gold) + sparkle(30, 30, 6) + sparkle(84, 56, 5) + sparkle(46, 18, 4, c.pink),
    'tour': () => ground(50, 24) + R(30, 66, 40, 22, 3, c.red) + R(34, 46, 32, 20, 3, c.blue) + R(30, 26, 40, 20, 3, c.gold) + P('M30 26 L50 6 L70 26Z', c.green) +
      [[40, 66], [60, 66], [44, 46], [56, 46], [40, 26], [60, 26]].map(([x, y]) => E(x, y, 5, 2, '#fff8').replace(/fill="url\(#sh\)"/, 'fill="none"')).join(''),
    'dino': () => ground(48, 34, 90) + P('M14 84 Q10 64 30 58 Q42 54 50 60 L56 26 Q58 10 70 10 Q84 10 82 22 Q80 30 70 30 L66 62 Q72 66 86 70 Q74 76 64 74 L62 88 L52 88 L52 76 L36 76 L36 88 L26 88 L26 78Z', c.green) +
      eye1(72, 18, 2.6) + L('M74 25 Q78 27 81 24', 1.6) + [[34, 62], [44, 64], [40, 70]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="#5E9C6A"/>`).join(''),
    'os': () => ground(50, 30, 82) + P('M28 40 Q12 30 16 20 Q22 12 30 20 Q34 10 42 14 Q50 20 42 30 L60 52 Q70 46 76 50 Q90 54 86 64 Q84 70 78 70 Q84 80 76 84 Q66 86 64 74 Q62 64 58 60 L40 38 Q34 44 28 40Z', c.cream),
    'éléphant': () => ground(50, 34, 90) + C(20, 42, 16, '#C9CED8') + C(80, 42, 16, '#C9CED8') + C(20, 42, 10, c.pink) + C(80, 42, 10, c.pink) +
      E(50, 46, 28, 26, '#C9CED8') + P('M42 58 Q40 78 46 88 Q52 94 58 86 Q54 80 56 60Z', '#C9CED8') + eyes(40, 60, 42, 3.6) + cheeks(32, 68, 52) +
      P('M30 68 Q34 82 46 80 L46 70Z', c.white).replace(/<path d="M30 68[^>]*fill="url\(#sh\)"\/>/, ''),
    'lion': () => P(Array.from({ length: 18 }, (_, i) => { const a = (i * 20) * Math.PI / 180, r = i % 2 ? 36 : 44; return `${i ? 'L' : 'M'}${(50 + r * Math.cos(a)).toFixed(1)} ${(52 + r * Math.sin(a)).toFixed(1)}`; }).join(' ') + 'Z', c.orange) +
      C(30, 30, 8, c.gold) + C(70, 30, 8, c.gold) + C(50, 54, 28, c.gold) + E(50, 64, 12, 9, c.cream) + F('M45 59 L55 59 L50 64Z', c.dkbrown) + eyes(40, 60, 50, 3.4) + cheeks(32, 68, 60) + L('M50 64 Q46 69 42 67 M50 64 Q54 69 58 67', 1.8),
    'serpent': () => ground(50, 34, 90) + P('M10 80 Q10 64 26 64 L60 64 Q70 64 70 56 Q70 48 60 48 L40 48 Q22 48 22 32 Q22 16 40 16 L58 16 Q76 16 76 30 L66 30 Q66 26 58 26 L40 26 Q32 26 32 32 Q32 38 40 38 L60 38 Q80 38 80 56 Q80 74 60 74 L26 74 Q20 74 20 80Z', c.green) +
      E(80, 26, 12, 9, c.green) + eyes(78, 86, 22, 2.4) + L('M92 28 L98 30 M98 30 L96 26 M98 30 L96 34', 1.6, c.red) + [[30, 69], [46, 69], [56, 43], [42, 21]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="#5E9C6A"/>`).join(''),
    // ---------- Mots du fichier de la classe ----------
    'amis': () => ground(50, 42, 93) + P('M6 93 Q8 68 30 66 Q50 68 52 93Z', c.blue) + P('M48 93 Q50 68 70 66 Q92 68 94 93Z', c.red) +
      C(30, 44, 17, '#F6D2B4') + C(70, 44, 17, '#E3AD86') + P('M13 42 Q12 22 30 24 Q48 22 47 42 Q42 31 30 33 Q19 31 13 42Z', c.dkbrown) +
      P('M53 44 Q50 22 70 24 Q90 22 87 44 Q84 33 78 35 Q70 28 62 35 Q56 35 53 44Z', c.ink) +
      eyes(24, 36, 45, 2.5) + eyes(64, 76, 45, 2.5) + smile(30, 52, 4.5) + smile(70, 52, 4.5) + cheeks(21, 39, 51, 2.6) + cheeks(61, 79, 51, 2.6),
    'rue': () => R(6, 8, 88, 84, 12, c.sky) + P('M6 16 L32 30 L32 78 L6 92Z', '#E9B79C') + P('M94 16 L68 30 L68 78 L94 92Z', '#C7D5E8') +
      [[12, 34], [22, 38], [12, 54], [22, 56]].map(([x, y]) => R(x, y, 6, 9, 1.5, c.sky)).join('') + [[82, 34], [72, 38], [82, 54], [72, 56]].map(([x, y]) => R(x, y, 6, 9, 1.5, '#FFF6D8')).join('') +
      P('M32 78 L68 78 L88 92 L12 92Z', c.gray) + L('M50 80 L50 83 M50 86 L50 90', 2.4, c.white) + C(50, 26, 6, c.gold),
    'ressort': () => ground(50, 24, 92) + (d => L(d, 7, c.dkgray) + L(d, 3.4, '#C9CED6'))('M30 14 C72 14 72 24 30 24 C72 24 72 34 30 34 C72 34 72 44 30 44 C72 44 72 54 30 54 C72 54 72 64 30 64 C72 64 72 74 30 74 C72 74 72 84 50 86'),
    'niche': () => ground(50, 40) + P('M20 90 L20 50 L50 26 L80 50 L80 90Z', c.beige) + P('M10 52 L50 14 L90 52 L82 58 L50 28 L18 58Z', c.red) +
      P('M36 90 L36 68 Q50 52 64 68 L64 90Z', c.ink) + eye1(45, 72, 2.4) + eye1(55, 72, 2.4) + `<ellipse cx="50" cy="79" rx="3.4" ry="2.4" fill="#111"/>` + R(42, 36, 16, 7, 2, c.white),
    'ara': () => L('M14 84 L86 84', 4.5, c.brown) + P('M42 74 L34 98 L46 96 L54 74Z', c.blue) + E(50, 54, 19, 26, c.red) +
      P('M44 44 Q74 48 68 80 Q54 74 44 44Z', c.blue) + F('M48 52 Q64 54 64 64 Q54 60 48 52Z', c.gold) + C(52, 26, 15, c.red) + E(46, 26, 7, 8, c.white) +
      eye1(46, 25, 2.4) + P('M38 22 Q24 26 30 38 Q34 32 40 31Z', c.ink) + L('M44 82 L42 88 M56 82 L58 88', 2.4, c.dkgray),
    'lilas': () => L('M50 94 L50 56', 3, c.dkgreen) + P('M50 76 Q30 66 26 80 Q38 88 50 80Z', c.green) + P('M50 70 Q70 60 74 74 Q62 82 50 74Z', c.green) +
      [[50, 12, 6], [43, 21, 6], [57, 21, 6], [38, 30, 6.5], [50, 29, 6.5], [62, 30, 6.5], [34, 40, 6.5], [45, 39, 6.5], [56, 39, 6.5], [66, 40, 6], [40, 49, 6], [51, 48, 6], [61, 48, 5.5]]
        .map(([x, y, r], i) => C(x, y, r, ['#B596D6', '#9C7CC6', '#C9B0E3'][i % 3])).join(''),
    'iris': () => ground(50, 18) + L('M50 92 L50 54', 3, c.dkgreen) + P('M48 92 Q34 70 30 50 Q42 66 50 84Z', c.green) +
      P('M50 50 Q42 24 50 10 Q58 24 50 50Z', '#9AA6EC') + P('M50 50 Q30 34 30 22 Q46 30 50 50Z', '#9AA6EC') + P('M50 50 Q70 34 70 22 Q54 30 50 50Z', '#9AA6EC') +
      P('M50 50 Q28 44 22 62 Q40 66 50 50Z', '#6E7FD6') + P('M50 50 Q72 44 78 62 Q60 66 50 50Z', '#6E7FD6') + P('M50 50 Q44 66 50 76 Q56 66 50 50Z', '#6E7FD6') + F('M46 54 Q50 62 54 54Z', c.gold),
    'sirop': () => ground(50, 24) + R(40, 4, 20, 9, 2, c.dkbrown) + P('M42 13 L58 13 L58 24 Q70 32 70 46 L70 86 Q70 92 64 92 L36 92 Q30 92 30 86 L30 46 Q30 32 42 24Z', '#EEF4F8') +
      F('M32 52 L68 52 L68 86 Q68 90 64 90 L36 90 Q32 90 32 86Z', c.red, .85) + R(36, 60, 28, 18, 3, c.cream) + C(50, 69, 5, c.red) +
      L('M42 13 L58 13 L58 24 Q70 32 70 46 L70 86 Q70 92 64 92 L36 92 Q30 92 30 86 L30 46 Q30 32 42 24Z') + shine(38, 40, 2.5, 7, 0),
    'lasso': () => L('M18 44 A32 22 0 1 0 82 44 A32 22 0 1 0 18 44', 5, c.brown) + L('M28 44 A22 14 0 1 0 72 44 A22 14 0 1 0 28 44', 4, '#C79A6E') +
      L('M62 62 Q70 82 90 90', 5, c.brown) + C(62, 62, 5, c.dkbrown),
    'sofa': () => ground(50, 42, 90) + R(16, 34, 68, 32, 10, c.blue) + R(10, 58, 80, 20, 8, '#5C93C8') + R(4, 46, 18, 34, 8, c.blue) + R(78, 46, 18, 34, 8, c.blue) +
      L('M50 38 L50 62', 1.6, '#4E86BC') + R(14, 80, 6, 8, 2, c.dkbrown) + R(80, 80, 6, 8, 2, c.dkbrown),
    'fourmi': () => ground(50, 38, 84) + L('M42 56 L32 76 M46 58 L44 80 M50 56 L60 78 M40 54 L26 64', 2.4, '#5A3A2A') +
      E(70, 56, 17, 13, '#7A4A34') + E(46, 54, 9, 8, '#7A4A34') + C(26, 46, 11, '#7A4A34') + L('M22 37 Q18 22 10 18 M30 36 Q32 22 40 16', 2, '#5A3A2A') +
      eye1(23, 45, 2.6) + smile(27, 51, 3),
    'louche': () => ground(46, 24) + L('M70 8 Q78 36 58 62', 7, c.dkgray) + L('M70 8 Q78 36 58 62', 3.5, c.gray) + E(44, 70, 26, 16, c.gray) + E(44, 64, 24, 8, '#8E96A3') + shine(32, 72, 3, 6, -60),
    'foulard': () => P('M14 30 Q50 46 86 30 L88 46 Q50 64 12 46Z', c.red) + P('M58 52 L64 90 L76 86 L70 50Z', '#D9584C') +
      L('M20 36 Q50 50 82 36 M18 42 Q50 56 84 42', 1.4, c.white) + L('M64 90 L63 95 M68 89 L67 94 M72 88 L71 93 M76 86 L76 91', 1.6, c.red),
    'ruche': () => ground(50, 34) + R(18, 84, 64, 7, 2, c.brown) + P('M26 84 L26 60 Q26 18 50 16 Q74 18 74 60 L74 84Z', c.gold) +
      L('M28 36 Q50 30 72 36 M26 50 Q50 44 74 50 M26 64 Q50 58 74 64 M26 76 Q50 72 74 76', 1.8, '#C9962F') + E(50, 74, 7, 6, c.dkbrown) +
      E(84, 26, 7, 5, c.gold) + E(82, 20, 5, 3, '#E3F2FB') + E(88, 20, 5, 3, '#E3F2FB') + L('M82 24 L82 29 M86 24 L86 29', 1.6),
    'farine': () => ground(50, 30) + P('M24 90 Q18 60 28 34 L72 34 Q82 60 76 90Z', c.cream) + P('M28 34 Q50 24 72 34 L66 22 Q50 30 34 22Z', c.beige) +
      L('M50 82 L50 50', 2, '#C9962F') + [[46, 56], [54, 60], [46, 66], [54, 70], [50, 50]].map(([x, y]) => E(x, y, 3, 5, '#E3B85A', x < 50 ? -30 : 30)).join(''),
    'momie': () => ground(50, 30) + P('M24 92 L26 40 Q26 14 50 14 Q74 14 74 40 L76 92Z', c.cream) +
      L('M26 28 Q50 34 74 26 M26 58 Q50 52 76 60 M26 72 Q50 78 76 70 M26 86 Q50 82 76 88', 1.6, '#C9B79A') + R(30, 36, 40, 15, 7, c.ink) +
      eye1(42, 43, 3.6) + eye1(58, 43, 3.6) + smile(50, 62, 5) + cheeks(36, 64, 60, 3),
    'rame': () => L('M18 88 L62 32', 6, c.dkbrown) + L('M18 88 L62 32', 3, c.brown) + P('M58 36 Q62 10 84 6 Q92 16 74 40 Q66 44 58 36Z', c.brown) + R(12, 86, 12, 8, 3, c.dkbrown),
    'cheminée': () => ground(50, 40, 94) + R(14, 30, 72, 62, 4, '#D9C7B3') + R(8, 22, 84, 10, 3, '#B8A089') + P('M30 92 L30 60 Q50 44 70 60 L70 92Z', c.ink) +
      P('M38 92 Q34 76 44 66 Q44 76 50 72 Q48 60 56 56 Q66 70 62 92Z', c.orange) + F('M44 92 Q44 82 50 78 Q54 84 56 92Z', c.gold) + R(34, 88, 32, 5, 2, c.dkbrown),
    'mamie': () => P('M24 50 Q22 22 50 22 Q78 22 76 50 Q70 34 50 34 Q30 34 24 50Z', '#D8DCE2') + C(50, 16, 9, '#D8DCE2') + C(50, 54, 26, '#F6D2B4') +
      P('M26 48 Q30 30 50 30 Q70 30 74 48 Q66 38 50 38 Q34 38 26 48Z', '#D8DCE2') + C(40, 54, 7.5, 'none') + C(60, 54, 7.5, 'none') + L('M47.5 54 L52.5 54', 2) +
      eye1(40, 54, 2.4) + eye1(60, 54, 2.4) + smile(50, 66, 6) + cheeks(31, 69, 63, 3.6),
    // ---------- Objets à compter ----------
    'ballon': () => C(50, 50, 38, c.white) + P('M50 34 L65 45 L59 62 L41 62 L35 45Z', c.ink) + L('M50 34 L50 14 M65 45 L84 38 M59 62 L70 80 M41 62 L30 80 M35 45 L16 38', 1.8) +
      F('M42 13 L58 13 L54 20 L46 20Z', c.ink) + F('M86 44 L84 58 L78 52Z', c.ink) + F('M14 44 L22 52 L16 58Z', c.ink) + shine(34, 30, 5, 9, -45),
    'crampon': () => ground(50, 38, 86) + P('M10 66 Q10 50 24 48 L44 44 Q50 30 62 28 L70 28 Q78 46 90 56 Q94 70 84 76 L16 76 Q10 74 10 66Z', c.red) + P('M10 70 L90 70 L86 78 L14 78Z', c.white) +
      L('M50 44 L62 50 M48 50 L60 56', 2, c.white) + [[22, 82], [40, 82], [58, 82], [76, 82]].map(([x, y]) => F(`M${x - 3} ${y - 4} L${x + 3} ${y - 4} L${x} ${y + 3}Z`, c.ink)).join(''),
    'coupe': () => ground(50, 24) + P('M28 14 L72 14 Q74 50 50 58 Q26 50 28 14Z', c.gold) + L('M28 22 Q12 24 16 38 Q20 46 32 44 M72 22 Q88 24 84 38 Q80 46 68 44', 3.4, c.gold) +
      R(44, 58, 12, 14, 2, c.gold) + R(32, 72, 36, 12, 3, c.brown) + shine(38, 28, 3.5, 8, -10) + star(50, 32, 7, 3, '#FFF3B0'),
    'gant': () => P('M24 90 L24 52 Q16 44 20 36 Q26 30 30 38 L30 22 Q30 14 37 14 Q44 14 44 22 L44 16 Q44 8 51 8 Q58 8 58 16 L58 20 Q58 12 65 12 Q72 12 72 20 L72 30 Q72 24 78 24 Q84 26 84 34 L80 66 Q78 80 70 90Z', c.orange) +
      R(22, 80, 50, 12, 4, c.white) + L('M44 22 L44 46 M58 18 L58 46 M72 30 L70 50', 1.4, '#C47A33'),
    'médaille': () => P('M30 6 L44 6 L56 40 L42 40Z', c.blue) + P('M70 6 L56 6 L44 40 L58 40Z', c.red) + C(50, 60, 26, c.gold) + C(50, 60, 18, '#FFE08A') + star(50, 60, 10, 4.5, c.gold),
    'bouclier': () => P('M50 8 L86 20 Q86 64 50 92 Q14 64 14 20Z', c.red) + P('M50 18 L76 27 Q76 60 50 82 Q24 60 24 27Z', c.white) + P('M50 26 L68 32 Q68 56 50 72 Q32 56 32 32Z', c.blue) + star(50, 48, 10, 4.5, c.white),
    'éclair': () => P('M58 6 L22 54 L46 54 L36 94 L78 40 L54 40 L66 6Z', c.gold) + shine(52, 26, 3, 9, 35),
    'masque': () => P('M8 44 Q12 28 30 30 Q42 32 50 40 Q58 32 70 30 Q88 28 92 44 Q92 62 74 64 Q60 64 50 54 Q40 64 26 64 Q8 62 8 44Z', c.blue) +
      E(31, 46, 9, 7, c.white) + E(69, 46, 9, 7, c.white) + L('M8 44 L0 38 M92 44 L100 38', 2.4),
    'étoile': () => star(50, 52, 42, 18, c.gold) + eyes(42, 58, 52, 3) + cheeks(36, 64, 60, 3) + smile(50, 58, 4),
    'brique': () => ground(50, 38, 86) + P('M10 46 L30 30 L90 30 L70 46Z', '#EF8578') + P('M70 46 L90 30 L90 66 L70 82Z', '#C9483D') + R(10, 46, 60, 36, 2, c.red) +
      [[26, 38], [46, 38], [66, 38], [38, 34].slice(0, 0)].filter(a => a.length).map(([x, y]) => E(x, y - 3, 7, 3, '#F49A8E') + F(`M${x - 7} ${y - 3} L${x - 7} ${y + 1} A7 3 0 0 0 ${x + 7} ${y + 1} L${x + 7} ${y - 3}Z`, '#D9584C')).join(''),
    'clé': () => L('M30 70 L66 34', 10, c.dkgray) + L('M30 70 L66 34', 6, c.gray) + P('M60 20 Q66 8 80 12 L72 22 L78 28 L88 20 Q92 34 80 40 Q72 42 66 38Z', c.gray) + C(24, 76, 10, c.gray) + C(24, 76, 4, c.white),
    'boulon': () => P('M50 10 L84 30 L84 70 L50 90 L16 70 L16 30Z', c.gray) + C(50, 50, 16, '#E6E9EE') + shine(34, 30, 4, 9, -30),
    'engrenage': () => P(Array.from({ length: 16 }, (_, i) => { const a = (i * 22.5) * Math.PI / 180, r = i % 2 ? 30 : 40; return `${i ? 'L' : 'M'}${(50 + r * Math.cos(a)).toFixed(1)} ${(50 + r * Math.sin(a)).toFixed(1)}`; }).join(' ') + 'Z', c.orange) + C(50, 50, 12, c.white),
    'cristal': () => ground(50, 22) + P('M50 6 L76 34 L50 92 L24 34Z', '#C3A6EE') + P('M50 6 L60 34 L50 92 L40 34Z', '#E2D3FA') + L('M24 34 L76 34', 1.4, '#8C6CC8') + sparkle(80, 16, 5, '#fff'),
    'œuf': () => ground(50, 24) + P('M50 8 Q78 8 80 56 Q80 90 50 90 Q20 90 20 56 Q22 8 50 8Z', '#EBDDF9') + C(38, 40, 6, c.purple) + C(62, 30, 4.5, c.purple) + C(64, 62, 7, c.purple) + C(40, 72, 4.5, c.purple) + shine(36, 26, 3.5, 7),
    'boule': () => ground(50, 26, 90) + R(30, 76, 40, 12, 4, c.dkbrown) + C(50, 46, 32, '#C9B4F2') + C(50, 46, 32, 'none') + sparkle(42, 38, 6, '#fff') + sparkle(60, 54, 4, '#fff') + shine(36, 32, 5, 10, -40),
    'monstre': () => ground(50, 28) + P('M38 22 L42 8 L48 20 L52 6 L58 20 L62 8 L66 22Z', c.purple) + E(52, 54, 32, 34, '#7FC8E8') + E(52, 66, 18, 14, c.white) +
      eyes(42, 62, 46, 4) + cheeks(34, 70, 56) + smile(52, 58, 5) + E(34, 88, 8, 4, '#5BAFD3') + E(70, 88, 8, 4, '#5BAFD3'),
    'œuf-dino': () => ground(50, 24) + P('M50 8 Q78 8 80 56 Q80 90 50 90 Q20 90 20 56 Q22 8 50 8Z', c.cream) + C(36, 42, 6, c.green) + C(62, 30, 5, c.green) + C(62, 64, 7, c.green) + C(38, 74, 4.5, c.green) + shine(36, 26, 3.5, 7),
    'empreinte': () => E(50, 62, 22, 26, c.dkbrown) + E(26, 26, 9, 14, c.dkbrown, -25) + E(50, 18, 9, 14, c.dkbrown) + E(74, 26, 9, 14, c.dkbrown, 25),
    'fougère': () => L('M50 92 Q48 50 62 10', 2.6, c.dkgreen) + Array.from({ length: 7 }, (_, i) => { const y = 82 - i * 10, x = 49 + i * 1.6, s = 22 - i * 2.2;
      return P(`M${x} ${y} Q${x - s * .6} ${y - 10} ${x - s} ${y - 2} Q${x - s * .6} ${y + 3} ${x} ${y}Z`, c.green) + P(`M${x} ${y} Q${x + s * .6} ${y - 12} ${x + s} ${y - 6} Q${x + s * .6} ${y + 2} ${x} ${y}Z`, c.green); }).join(''),
  };
  // Alias : clé unique (sans accents) pour les identifiants SVG
  const id = k => 'a-' + k.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/œ/g, 'oe').replace(/[^a-z0-9-]/gi, '');
  const defs = `<defs><linearGradient id="sh" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#3a2a1f" stop-opacity=".2"/></linearGradient></defs>`;
  const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">${defs}${Object.entries(ART).map(([k, f]) => `<symbol id="${id(k)}" viewBox="0 0 100 100">${f()}</symbol>`).join('')}</svg>`;
  const mount = () => document.body.insertAdjacentHTML('afterbegin', sprite);
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);

  // Dessin si disponible, sinon emoji de secours
  window.hasArt = k => Object.prototype.hasOwnProperty.call(ART, k);
  window.artHTML = (k, fallback = '', label = '') => hasArt(k)
    ? `<svg class="art" viewBox="0 0 100 100" role="img" aria-label="${label || k}"><use href="#${id(k)}"/></svg>`
    : `<span class="art-emoji">${fallback}</span>`;
  window.ART_KEYS = Object.keys(ART);
})();
