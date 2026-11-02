const { chromium } = require('playwright');
const INK = '#1B1B2F';
const st = (w = 4.5) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const star = (cx, cy, n, r1, r2, rot = -90, wob = 0) => Array.from({ length: n * 2 }, (_, i) => { const a = (rot + i * 180 / n) * Math.PI / 180, r = (i % 2 ? r2 : r1) * (1 + wob * Math.sin(i * 2.7)); return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`; }).join(' ');
const pent = (cx, cy, r, rot = -90) => Array.from({ length: 5 }, (_, i) => { const a = (rot + i * 72) * Math.PI / 180; return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`; }).join(' ');
// Œil shōnen : amande, iris, reflet, trait supérieur épais
const eyeS = (x, y, iris, flip = false) => `<g ${flip ? `transform="translate(${2 * x} 0) scale(-1 1)"` : ''}>
  <path d="M${x - 13} ${y + 1} Q${x - 2} ${y - 11} ${x + 13} ${y - 4} Q${x + 6} ${y + 9} ${x - 13} ${y + 1}Z" fill="#fff" ${st(2.5)}/>
  <circle cx="${x + 1}" cy="${y - 1}" r="6.5" fill="${iris}"/><circle cx="${x + 1.5}" cy="${y - 1}" r="3.3" fill="${INK}"/>
  <circle cx="${x - 1.5}" cy="${y - 4}" r="2" fill="#fff"/>
  <path d="M${x - 16} ${y} Q${x - 2} ${y - 15} ${x + 15} ${y - 5}" fill="none" ${st(5)}/></g>`;
const cel = (id, shape, base, shade, dx = -8, dy = -5) => `<defs><clipPath id="${id}"><path d="${shape}"/></clipPath></defs>
  <g clip-path="url(#${id})"><rect width="200" height="200" fill="${shade}"/><path d="${shape}" fill="${base}" transform="translate(${dx} ${dy})"/></g>
  <path d="${shape}" fill="none" ${st()}/>`;
const aura = (c1, c2, cx = 100, cy = 108) => `<polygon points="${star(cx, cy, 18, 98, 70, -90, .12)}" fill="${c1}" opacity=".55"/>
  <polygon points="${star(cx, cy, 14, 80, 60, -80, .1)}" fill="${c2}" opacity=".45"/>`;
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
    <path d="M70 84 L94 91 M130 84 L106 91" ${st(6)}/>
    ${eyeS(84, 100, '#2A9D8F')}${eyeS(116, 100, '#2A9D8F', true)}
    <path d="M84 116 L116 116 Q114 132 100 133 Q86 132 84 116Z" fill="#fff" ${st(3)}/>
    <ellipse cx="100" cy="128" rx="8" ry="3.5" fill="#E5636F"/>
    <rect x="114" y="104" width="18" height="8" rx="3" fill="#FCE1C6" ${st(2)} transform="rotate(-20 123 108)"/>
    <defs><clipPath id="fb"><circle cx="40" cy="166" r="26"/></clipPath></defs>
    <circle cx="40" cy="166" r="26" fill="#fff"/>
    <g clip-path="url(#fb)"><polygon points="${pent(40, 166, 10)}" fill="${INK}"/>${[0,1,2,3,4].map(i => { const a = (-90 + i * 72) * Math.PI / 180; return `<polygon points="${pent(40 + 27 * Math.cos(a), 166 + 27 * Math.sin(a), 9, -90 + i * 72 + 180)}" fill="${INK}"/>`; }).join('')}</g>
    <circle cx="40" cy="166" r="26" fill="none" ${st(4)}/>
    <path d="M6 150 h12 M2 166 h10 M6 182 h12" ${st(3.5)}/>`],

  ['Super Malo', 'Super-héros', () => `
    ${aura('#FFD60A', '#3A86FF')}
    <path d="M86 146 Q50 150 22 128 Q34 160 14 172 Q50 180 90 164Z" fill="#E63946" ${st()}/>
    <path d="M52 200 Q54 152 100 146 Q146 152 148 200 Z" fill="#3A86FF" ${st()}/>
    <path d="M100 146 Q146 152 148 200 L124 200 Q124 160 100 146Z" fill="#2667CC"/>
    <path d="M52 200 Q54 152 100 146 Q146 152 148 200" fill="none" ${st()}/>
    <polygon points="104,156 88,180 100,180 94,198 114,170 102,170 110,156" fill="#FFD60A" ${st(3)}/>
    <ellipse cx="59" cy="94" rx="7" ry="10" fill="#F6C9A0" ${st(3.5)}/><ellipse cx="141" cy="94" rx="7" ry="10" fill="#F6C9A0" ${st(3.5)}/>
    ${cel('h2', HEAD, '#F6C9A0', '#E0A57A')}
    <polygon points="60,96 52,70 40,66 56,58 46,36 70,42 70,16 90,34 100,8 112,34 132,14 132,42 156,36 146,58 160,66 148,72 140,94 134,74 118,66 100,74 82,66 66,74" fill="${INK}" ${st()}/>
    <path d="M80 26 l6 18 M112 22 l-2 18 M136 30 l-8 14" stroke="#4A6FA5" stroke-width="4" stroke-linecap="round"/>
    <path d="M62 92 Q100 80 138 92 L136 108 Q100 100 64 108 Z" fill="#1D3557" ${st(3.5)}/>
    <path d="M70 86 L94 92 M130 86 L106 92" ${st(6)}/>
    ${eyeS(84, 100, '#90E0EF')}${eyeS(116, 100, '#90E0EF', true)}
    <path d="M88 120 Q100 128 114 118" fill="none" ${st(4)}/>
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
    <path d="M62 66 L90 74 M138 66 L110 74" ${st(6)}/>
    ${eyeS(78, 84, '#48CAE4')}${eyeS(122, 84, '#48CAE4', true)}
    <path d="M86 102 Q100 112 114 100" fill="none" ${st(4)}/>`],

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
    <path d="M70 92 L92 98 M130 92 L108 98" ${st(5)}/>
    ${eyeS(84, 106, '#FFB703')}${eyeS(116, 106, '#FFB703', true)}
    <path d="M88 122 Q100 132 112 122" fill="none" ${st(4)}/><path d="M104 125 l3 7 l3 -8z" fill="#fff" ${st(2)}/>`],

  ['Rex', 'Dinosaures', () => `
    ${aura('#95D5B2', '#FFB703', 110, 104)}
    <path d="M46 172 Q14 164 4 128 Q28 152 56 150Z" fill="#40916C" ${st()}/>
    ${[[66, 104], [54, 126], [46, 150]].map(([x, y]) => `<polygon points="${x - 8},${y + 6} ${x - 14},${y - 12} ${x + 6},${y}" fill="#FB8500" ${st(3)}/>`).join('')}
    ${cel('r1', 'M40 198 Q30 140 70 104 Q92 94 112 116 Q126 152 116 198Z', '#52B788', '#40916C')}
    <path d="M66 150 Q82 160 100 150 M70 170 Q86 178 104 170" fill="none" stroke="#40916C" stroke-width="4" stroke-linecap="round"/>
    <path d="M110 136 q16 0 20 12 q-8 2 -14 -4" fill="#52B788" ${st(3.5)}/>
    <path d="M118 96 L172 96 L160 114 L122 116Z" fill="#8E1B2A"/>
    <path d="M94 112 Q122 122 162 108 Q158 128 126 132 Q102 132 94 112Z" fill="#52B788" ${st()}/>
    ${[126, 140, 154].map(x => `<polygon points="${x},${113 - (x - 120) * .1} ${x + 5},${104} ${x + 10},${112 - (x - 120) * .1}" fill="#fff" ${st(2)}/>`).join('')}
    ${cel('r2', 'M68 72 Q72 34 120 36 Q170 38 174 72 L174 96 L124 98 L116 112 Q94 118 80 108 Q64 96 68 72Z', '#52B788', '#40916C')}
    ${[132, 146, 160].map(x => `<polygon points="${x},96 ${x + 5},106 ${x + 10},96" fill="#fff" ${st(2)}/>`).join('')}
    <circle cx="164" cy="60" r="3" fill="${INK}"/>
    <path d="M72 56 Q120 42 170 56 L168 70 Q120 58 74 70Z" fill="#E63946" ${st(3.5)}/>
    <path d="M76 60 Q50 44 28 52 Q50 60 76 66Z M76 64 Q56 70 36 84 Q60 80 78 70Z" fill="#E63946" ${st(3.5)}/>
    <path d="M114 70 L136 76" ${st(6)}/>
    ${eyeS(128, 84, '#FFB703', true)}`],

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
<h1>MaloLab — style shōnen</h1>
<p class="sub">Regards déterminés, cheveux en pointes, auras d'énergie, poses d'action. Personnages originaux, dessinés en vectoriel et animables.</p>
<h2>Les compagnons des 5 univers</h2>
<div class="grid">${ITEMS.slice(0, 5).map(([n, u, f], i) => `<figure><svg viewBox="0 0 200 200">${burst(i)}${f()}${frame}</svg><figcaption>${n}<small>${u}</small></figcaption></figure>`).join('')}</div>
<h2>Exemples d'objets</h2>
<div class="grid o">${ITEMS.slice(5).map(([n, u, f], i) => `<figure><svg viewBox="0 0 200 200">${burst(i + 9)}${f()}${frame}</svg><figcaption>${n}<small>${u}</small></figcaption></figure>`).join('')}</div>
</body></html>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1296, height: 900 }, deviceScaleFactor: 1.5 });
  await p.setContent(html); await p.screenshot({ path: '/home/user/malolab-shonen.png', fullPage: true });
  await b.close();
})();
