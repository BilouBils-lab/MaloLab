const { chromium } = require('playwright');
const INK = '#1B1B2F';
const st = (w = 4.5) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const star = (cx, cy, n, r1, r2, rot = -90, wob = 0) => Array.from({ length: n * 2 }, (_, i) => { const a = (rot + i * 180 / n) * Math.PI / 180, r = (i % 2 ? r2 : r1) * (1 + wob * Math.sin(i * 2.7)); return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`; }).join(' ');
const pent = (cx, cy, r, rot = -90) => Array.from({ length: 5 }, (_, i) => { const a = (rot + i * 72) * Math.PI / 180; return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`; }).join(' ');
// Œil shōnen : amande, iris, reflet, trait supérieur épais
const eyeS = (x, y, iris, flip = false, k = 1) => `<g>
  <ellipse cx="${x}" cy="${y}" rx="${11*k}" ry="${14*k}" fill="${INK}"/>
  <ellipse cx="${x}" cy="${y + 4*k}" rx="${8*k}" ry="${9*k}" fill="${iris}"/>
  <ellipse cx="${x}" cy="${y + 8*k}" rx="${5*k}" ry="${4*k}" fill="#fff" opacity=".35"/>
  <circle cx="${x + (flip ? 3 : -3)*k}" cy="${y - 5*k}" r="${4.6*k}" fill="#fff"/>
  <circle cx="${x + (flip ? -4 : 4)*k}" cy="${y + 6*k}" r="${2*k}" fill="#fff"/></g>`;
// Sourcils doux : petits arcs qui remontent
const brows = (x1, x2, y) => `<path d="M${x1 - 9} ${y + 2} Q${x1} ${y - 5} ${x1 + 9} ${y}" fill="none" ${st(3.2)}/><path d="M${x2 - 9} ${y} Q${x2} ${y - 5} ${x2 + 9} ${y + 2}" fill="none" ${st(3.2)}/>`;
const blush = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="5" fill="#FF8FA3" opacity=".6"/>`;
const smile = (x, y, w = 14) => `<path d="M${x - w} ${y} Q${x} ${y + 2} ${x + w} ${y} Q${x + w * .7} ${y + w * 1.1} ${x} ${y + w * 1.1} Q${x - w * .7} ${y + w * 1.1} ${x - w} ${y}Z" fill="#7A1F2B" ${st(3)}/><ellipse cx="${x}" cy="${y + w * .85}" rx="${w * .5}" ry="${w * .25}" fill="#FF7A8A"/>`;
const cel = (id, shape, base, shade, dx = -8, dy = -5) => `<defs><clipPath id="${id}"><path d="${shape}"/></clipPath></defs>
  <g clip-path="url(#${id})"><rect width="200" height="200" fill="${shade}"/><path d="${shape}" fill="${base}" transform="translate(${dx} ${dy})"/></g>
  <path d="${shape}" fill="none" ${st()}/>`;
const aura = (c1, c2, cx = 100, cy = 108) => `<circle cx="${cx}" cy="${cy}" r="88" fill="${c1}" opacity=".35"/>
  <circle cx="${cx}" cy="${cy}" r="68" fill="${c2}" opacity=".3"/>
  ${[[30, 40, 8], [172, 34, 10], [178, 120, 6], [24, 120, 6]].map(([x, y, r]) => `<polygon points="${star(x, y, 4, r, r * .35)}" fill="#FFD60A" stroke="${INK}" stroke-width="2"/>`).join('')}`;
const HEAD = 'M62 80 Q62 126 100 140 Q138 126 138 80 Q138 40 100 40 Q62 40 62 80Z';
const sparkle = (x, y, r = 10) => `<polygon points="${star(x, y, 4, r, r * .35)}" fill="#FFD60A" ${st(2.5)}/>`;

const ITEMS = [
  ['Tom le buteur', 'Foot', () => `
    ${aura('#FFB703', '#FB5607')}
    <path d="M48 200 Q50 150 100 144 Q150 150 152 200 Z" fill="#E63946" ${st()}/>
    <path d="M100 144 Q150 150 152 200 L126 200 Q128 160 100 144Z" fill="#B71C2C"/>
    <path d="M48 200 Q50 150 100 144 Q150 150 152 200" fill="none" ${st()}/>
    <path d="M84 146 L100 162 L116 146" fill="#fff" ${st(3.5)}/>
    <text x="100" y="194" text-anchor="middle" font-family="Arial Black,Arial" font-weight="900" font-size="30" fill="#fff" stroke="${INK}" stroke-width="2.5">10</text>
    <ellipse cx="59" cy="94" rx="7" ry="10" fill="#F6C9A0" ${st(3.5)}/><ellipse cx="141" cy="94" rx="7" ry="10" fill="#F6C9A0" ${st(3.5)}/>
    ${cel('h1', HEAD, '#F6C9A0', '#E0A57A')}
    <polygon points="58,96 50,64 36,58 58,52 52,26 76,38 80,10 98,32 114,6 120,34 146,18 140,44 166,44 148,60 152,92 140,74 126,64 110,72 96,62 80,72 66,74 62,94" fill="#8B2E16" ${st()}/>
    <path d="M86 22 l8 16 M120 16 l-4 18 M146 30 l-10 14" stroke="#D65A2E" stroke-width="4" stroke-linecap="round"/>
    ${brows(84, 116, 82)}
    ${eyeS(84, 100, '#2A9D8F')}${eyeS(116, 100, '#2A9D8F', true)}${blush(72, 116)}${blush(128, 116)}
    ${smile(100, 118, 11)}
    <rect x="114" y="104" width="18" height="8" rx="3" fill="#FCE1C6" ${st(2)} transform="rotate(-20 123 108)"/>
    <defs><clipPath id="fb"><circle cx="40" cy="166" r="26"/></clipPath></defs>
    <circle cx="40" cy="166" r="26" fill="#fff"/>
    <g clip-path="url(#fb)"><polygon points="${pent(40, 166, 10)}" fill="${INK}"/>${[0,1,2,3,4].map(i => { const a = (-90 + i * 72) * Math.PI / 180; return `<polygon points="${pent(40 + 27 * Math.cos(a), 166 + 27 * Math.sin(a), 9, -90 + i * 72 + 180)}" fill="${INK}"/>`; }).join('')}</g>
    <circle cx="40" cy="166" r="26" fill="none" ${st(4)}/>
    <path d="M6 150 h12 M2 166 h10 M6 182 h12" ${st(3.5)}/>`],

  ['Super Malo', 'Super-héros', () => `
    ${aura('#FFD60A', '#FFF3B0')}
    <path d="M86 146 Q50 150 22 128 Q34 160 14 172 Q50 180 90 164Z" fill="#E63946" ${st()}/>
    <path d="M52 200 Q54 152 100 146 Q146 152 148 200 Z" fill="#3A86FF" ${st()}/>
    <path d="M100 146 Q146 152 148 200 L124 200 Q124 160 100 146Z" fill="#2667CC"/>
    <path d="M52 200 Q54 152 100 146 Q146 152 148 200" fill="none" ${st()}/>
    <polygon points="104,156 88,180 100,180 94,198 114,170 102,170 110,156" fill="#FFD60A" ${st(3)}/>
    <ellipse cx="59" cy="94" rx="7" ry="10" fill="#F6C9A0" ${st(3.5)}/><ellipse cx="141" cy="94" rx="7" ry="10" fill="#F6C9A0" ${st(3.5)}/>
    ${cel('h2', HEAD, '#F6C9A0', '#E0A57A')}
    <polygon points="60,96 52,70 40,66 56,58 46,36 70,42 70,16 90,34 100,8 112,34 132,14 132,42 156,36 146,58 160,66 148,72 140,94 134,74 118,66 100,74 82,66 66,74" fill="${INK}" ${st()}/>
    <path d="M80 26 l6 18 M112 22 l-2 18 M136 30 l-8 14" stroke="#4A6FA5" stroke-width="4" stroke-linecap="round"/>
    <path d="M64 90 Q100 82 136 90 Q138 108 120 110 Q100 104 80 110 Q62 108 64 90Z" fill="#1D3557" ${st(3.5)}/>
    ${brows(84, 116, 84)}
    ${eyeS(84, 99, '#48CAE4', false, .85)}${eyeS(116, 99, '#48CAE4', true, .85)}${blush(72, 118)}${blush(128, 118)}
    ${smile(100, 120, 10)}
    <polygon points="${star(158, 150, 8, 34, 18)}" fill="#FFD60A" ${st(3)}/>
    <g transform="rotate(-18 158 152)"><rect x="134" y="134" width="48" height="38" rx="12" fill="#F6C9A0" ${st()}/>
    <path d="M146 134 v14 M158 134 v14 M170 134 v14 M136 156 q10 4 18 -2" fill="none" ${st(3)}/></g>`],

  ['Brik', 'Briques', () => `
    ${aura('#FFD60A', '#FF9F1C')}
    <line x1="100" y1="34" x2="100" y2="14" ${st(4)}/><circle cx="100" cy="12" r="7" fill="#FFD60A" ${st(3.5)}/>
    ${[70, 130].map(x => `<rect x="${x - 14}" y="36" width="28" height="12" fill="#E63946" ${st(3.5)}/><ellipse cx="${x}" cy="36" rx="14" ry="5" fill="#FF6B76" ${st(3.5)}/>`).join('')}
    <rect x="40" y="132" width="22" height="40" rx="10" fill="#FFD60A" ${st()} transform="rotate(20 51 132)"/>
    <rect x="138" y="132" width="22" height="40" rx="10" fill="#FFD60A" ${st()} transform="rotate(-20 149 132)"/>
    <circle cx="34" cy="170" r="11" fill="#FFD60A" ${st()}/><circle cx="166" cy="170" r="11" fill="#FFD60A" ${st()}/>
    <rect x="70" y="174" width="26" height="24" rx="4" fill="#4A4E69" ${st()}/><rect x="104" y="174" width="26" height="24" rx="4" fill="#4A4E69" ${st()}/>
    ${cel('b1', 'M62 126 h76 a8 8 0 0 1 8 8 v40 a8 8 0 0 1 -8 8 h-76 a8 8 0 0 1 -8 -8 v-40 a8 8 0 0 1 8 -8z', '#3A86FF', '#2667CC', -10, 0)}
    <circle cx="100" cy="154" r="12" fill="#FFD60A" ${st(3.5)}/><polygon points="${star(100, 154, 5, 7, 3)}" fill="#E63946"/>
    ${cel('b2', 'M48 46 h104 a8 8 0 0 1 8 8 v58 a8 8 0 0 1 -8 8 h-104 a8 8 0 0 1 -8 -8 v-58 a8 8 0 0 1 8 -8z', '#E63946', '#B71C2C', -14, 0)}
    ${brows(78, 122, 64)}
    ${eyeS(78, 84, '#48CAE4')}${eyeS(122, 84, '#48CAE4', true)}${blush(62, 102)}${blush(138, 102)}
    ${smile(100, 100, 11)}`],

  ['Zapi', 'Monstres', () => `
    ${aura('#C77DFF', '#48CAE4')}
    <polygon points="146,150 182,136 168,154 194,150 158,176" fill="#9D4EDD" ${st()}/>
    <polygon points="56,98 14,78 44,124" fill="#4CC9F0" ${st()}/><polygon points="144,98 186,78 156,124" fill="#4CC9F0" ${st()}/>
    <polygon points="50,98 26,88 44,112" fill="#B8F2FF"/><polygon points="150,98 174,88 156,112" fill="#B8F2FF"/>
    <polygon points="68,78 72,40 88,60 100,18 112,60 128,40 132,78" fill="#9D4EDD" ${st()}/>
    <polygon points="84,70 88,52 96,64 100,40 104,64 112,52 116,70" fill="#E0AAFF"/>
    <ellipse cx="78" cy="180" rx="18" ry="10" fill="#2EA8D0" ${st()}/><ellipse cx="122" cy="180" rx="18" ry="10" fill="#2EA8D0" ${st()}/>
    ${cel('m1', 'M50 128 Q46 70 100 66 Q154 70 150 128 Q148 176 100 178 Q52 176 50 128Z', '#4CC9F0', '#2EA8D0')}
    <ellipse cx="100" cy="146" rx="30" ry="24" fill="#E8FBFF" ${st(3.5)}/>
    <polygon points="${star(100, 146, 5, 11, 5)}" fill="#FFD60A" ${st(2.5)}/>
    ${brows(84, 116, 88)}
    ${eyeS(84, 106, '#FFB703')}${eyeS(116, 106, '#FFB703', true)}${blush(70, 124)}${blush(130, 124)}
    ${smile(100, 124, 9)}`],

  ['Rex', 'Dinosaures', () => `
    ${aura('#95D5B2', '#FFB703', 110, 104)}
    <path d="M46 172 Q14 164 4 128 Q28 152 56 150Z" fill="#40916C" ${st()}/>
    ${[[66, 104], [54, 126], [46, 150]].map(([x, y]) => `<polygon points="${x - 8},${y + 6} ${x - 14},${y - 12} ${x + 6},${y}" fill="#FB8500" ${st(3)}/>`).join('')}
    ${cel('r1', 'M40 198 Q30 140 70 104 Q92 94 112 116 Q126 152 116 198Z', '#52B788', '#40916C')}
    <path d="M66 150 Q82 160 100 150 M70 170 Q86 178 104 170" fill="none" stroke="#40916C" stroke-width="4" stroke-linecap="round"/>
    <path d="M110 136 q16 0 20 12 q-8 2 -14 -4" fill="#52B788" ${st(3.5)}/>
    ${cel('r2', 'M68 72 Q72 34 120 36 Q170 38 174 76 Q174 104 140 110 L118 112 Q94 118 80 108 Q64 96 68 72Z', '#52B788', '#40916C')}
    <path d="M118 94 Q146 104 168 90 Q160 108 140 106 Q126 106 118 94Z" fill="#7A1F2B" ${st(3)}/><ellipse cx="146" cy="102" rx="8" ry="3" fill="#FF7A8A"/>
    <polygon points="152,96 156,103 160,95" fill="#fff" ${st(1.5)}/>
    ${blush(118, 86)}
    <circle cx="164" cy="60" r="3" fill="${INK}"/>
    <path d="M72 56 Q120 42 170 56 L168 70 Q120 58 74 70Z" fill="#E63946" ${st(3.5)}/>
    <path d="M76 60 Q50 44 28 52 Q50 60 76 66Z M76 64 Q56 70 36 84 Q60 80 78 70Z" fill="#E63946" ${st(3.5)}/>
    <path d="M122 68 Q132 62 142 68" fill="none" ${st(3.2)}/>
    ${eyeS(132, 80, '#FFB703', true)}`],

  ['Tir de feu', 'Foot', () => `
    <polygon points="70,100 10,66 38,92 4,100 36,110 14,138" fill="#FB5607" ${st(3.5)}/>
    <polygon points="76,100 34,80 52,96 30,102 52,108 38,124" fill="#FFB703"/>
    <defs><clipPath id="tb"><circle cx="120" cy="100" r="50"/></clipPath></defs>
    <circle cx="120" cy="100" r="50" fill="#fff"/>
    <g clip-path="url(#tb)"><path d="M150 60 A50 50 0 0 1 120 150 A60 60 0 0 0 150 60z" fill="#C9D1DB"/>
      <polygon points="${pent(120, 100, 18)}" fill="${INK}"/>${[0,1,2,3,4].map(i => { const a = (-90 + i * 72) * Math.PI / 180; return `<line x1="${120 + 18 * Math.cos(a)}" y1="${100 + 18 * Math.sin(a)}" x2="${120 + 38 * Math.cos(a)}" y2="${100 + 38 * Math.sin(a)}" ${st(3.5)}/><polygon points="${pent(120 + 52 * Math.cos(a), 100 + 52 * Math.sin(a), 16, -90 + i * 72 + 180)}" fill="${INK}"/>`; }).join('')}</g>
    <circle cx="120" cy="100" r="50" fill="none" ${st(5)}/>
    ${sparkle(178, 50, 12)}${sparkle(176, 156, 9)}`],

  ['Brique', 'Briques', () => `
    <polygon points="30,92 58,64 186,64 158,92" fill="#5FA8FF" ${st()}/>
    <polygon points="158,92 186,64 186,124 158,152" fill="#2667CC" ${st()}/>
    <rect x="30" y="92" width="128" height="60" fill="#3A86FF" ${st()}/>
    ${[[64, 86], [106, 86], [148, 86], [80, 70], [122, 70], [164, 70]].map(([x, y]) => `<path d="M${x - 13} ${y} v-9 a13 5 0 0 0 26 0 v9 a13 5 0 0 1 -26 0z" fill="#3A86FF" ${st(3)}/><ellipse cx="${x}" cy="${y - 9}" rx="13" ry="5" fill="#8EC5FF" ${st(3)}/>`).sort().join('')}
    <path d="M42 104 v36" stroke="#8EC5FF" stroke-width="6" stroke-linecap="round"/>
    ${sparkle(30, 46, 11)}`],

  ['Œuf de dino', 'Dinosaures', () => `
    ${cel('e1', 'M100 20 C142 20 166 84 166 122 C166 162 138 184 100 184 C62 184 34 162 34 122 C34 84 58 20 100 20Z', '#FFF1D6', '#EBD3A8')}
    ${[[70, 60, 9], [126, 50, 7], [140, 150, 10], [62, 150, 8], [96, 168, 6]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#95D5B2" ${st(2.5)}/>`).join('')}
    <path d="M36 108 L56 96 L70 112 L88 94 L104 112 L122 94 L138 112 L152 96 L165 106 L164 124 L150 116 L136 132 L120 114 L104 132 L88 114 L72 132 L56 116 L36 126Z" fill="${INK}"/>
    ${eyeS(84, 116, '#FFB703')}${eyeS(118, 116, '#FFB703', true)}
    ${sparkle(170, 40, 12)}${sparkle(28, 60, 8)}`],
];

const burst = id => `<defs><clipPath id="p${id}"><rect x="4" y="4" width="192" height="192" rx="14"/></clipPath></defs>
  <rect x="4" y="4" width="192" height="192" rx="14" fill="#fff"/>
  <g clip-path="url(#p${id})" stroke="#DCE1E8">${Array.from({ length: 64 }, (_, i) => { const a = i * 360 / 64 * Math.PI / 180, r1 = 78 + (i % 4) * 8; return `<line x1="${(100 + r1 * Math.cos(a)).toFixed(1)}" y1="${(100 + r1 * Math.sin(a)).toFixed(1)}" x2="${(100 + 150 * Math.cos(a)).toFixed(1)}" y2="${(100 + 150 * Math.sin(a)).toFixed(1)}" stroke-width="${i % 2 ? 1.5 : 3.5}"/>`; }).join('')}</g>`;
const frame = `<rect x="4" y="4" width="192" height="192" rx="14" fill="none" stroke="${INK}" stroke-width="5"/>`;
const html = `<html><head><style>
body{margin:0;padding:28px;background:#FFF8E7;font-family:system-ui,sans-serif;color:#1B1B2F;width:1240px}
h1{margin:0 0 6px;font-size:30px}.sub{margin:0 0 18px;font-size:17px;opacity:.75}
h2{font-size:22px;margin:22px 0 12px}
.grid{display:grid;grid-template-columns:repeat(5,1fr);gap:18px}.grid.o{grid-template-columns:repeat(3,1fr);width:72%}
figure{margin:0;text-align:center}svg{width:100%;display:block}figcaption{font-weight:800;margin-top:6px;font-size:18px}
figcaption small{display:block;font-weight:600;opacity:.6;font-size:14px}
</style></head><body>
<h1>MaloLab — style manga enfant (v2)</h1>
<p class="sub">Sourcils doux, grands yeux brillants, sourires, joues roses, étincelles. On garde l'énergie (cheveux en pointes, cape, ballon) avec des visages gentils.</p>
<h2>Les compagnons des 5 univers</h2>
<div class="grid">${ITEMS.slice(0, 5).map(([n, u, f], i) => `<figure><svg viewBox="0 0 200 200">${burst(i)}${f()}${frame}</svg><figcaption>${n}<small>${u}</small></figcaption></figure>`).join('')}</div>
<h2>Exemples d'objets</h2>
<div class="grid o">${ITEMS.slice(5).map(([n, u, f], i) => `<figure><svg viewBox="0 0 200 200">${burst(i + 9)}${f()}${frame}</svg><figcaption>${n}<small>${u}</small></figcaption></figure>`).join('')}</div>
</body></html>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1296, height: 900 }, deviceScaleFactor: 1.5 });
  await p.setContent(html); await p.screenshot({ path: '/home/user/malolab-manga-v2.png', fullPage: true });
  await b.close();
})();
