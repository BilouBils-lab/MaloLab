const { chromium } = require('playwright');
const INK = '#1B1B2F';
const st = (w = 4.5) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const pts = (cx, cy, n, r1, r2, rot = -90) => Array.from({ length: n * 2 }, (_, i) => { const a = (rot + i * 180 / n) * Math.PI / 180, r = i % 2 ? r2 : r1; return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`; }).join(' ');
const pent = (cx, cy, r, rot = -90) => Array.from({ length: 5 }, (_, i) => { const a = (rot + i * 72) * Math.PI / 180; return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`; }).join(' ');
// Gros yeux brillants
const eye = (x, y, iris, s = 1) => `
  <ellipse cx="${x}" cy="${y}" rx="${12*s}" ry="${16*s}" fill="${INK}"/>
  <ellipse cx="${x}" cy="${y + 5*s}" rx="${8.5*s}" ry="${9*s}" fill="${iris}"/>
  <circle cx="${x - 4*s}" cy="${y - 6*s}" r="${5*s}" fill="#fff"/><circle cx="${x + 4*s}" cy="${y + 8*s}" r="${2.2*s}" fill="#fff"/>`;
const blush = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="6" fill="#FF7A9A" opacity=".55"/>
  <path d="M${x-6} ${y+3} l4 -6 M${x-1} ${y+3} l4 -6 M${x+4} ${y+3} l4 -6" ${st(1.6)} stroke="#E0496D" fill="none"/>`;
// Ombre « cel » : forme sombre dans un clip
const cel = (id, shape, base, shade, light) => `
  <defs><clipPath id="${id}">${shape}</clipPath></defs>
  <g clip-path="url(#${id})"><rect x="0" y="0" width="200" height="200" fill="${shade}"/>${light.replace('FILL', base)}</g>`;

const SUBJ = {
  Chat: () => `
    <polygon points="44,84 56,22 98,62" fill="#F4A259" ${st()}/><polygon points="156,84 144,22 102,62" fill="#F4A259" ${st()}/>
    <polygon points="58,70 62,42 84,62" fill="#FFB3C1"/><polygon points="142,70 138,42 116,62" fill="#FFB3C1"/>
    ${cel('ch', '<ellipse cx="100" cy="116" rx="66" ry="54"/>', '#F4A259', '#D97F35', '<ellipse cx="90" cy="106" rx="66" ry="54" fill="FILL"/>')}
    <ellipse cx="100" cy="116" rx="66" ry="54" fill="none" ${st()}/>
    <path d="M58 70 q8 -4 14 2" fill="none" ${st(3)}/>
    ${eye(76, 110, '#2A9D8F')}${eye(124, 110, '#2A9D8F')}
    ${blush(56, 132)}${blush(144, 132)}
    <path d="M97 125 l3 3 l3 -3 z" fill="${INK}" ${st(2)}/>
    <path d="M89 132 q5.5 6 11 0 q5.5 6 11 0" fill="none" ${st(3)}/>
    <path d="M40 118 l-16 -4 M40 126 l-17 2 M160 118 l16 -4 M160 126 l17 2" ${st(2.5)}/>`,
  Lion: () => `
    <polygon points="${pts(100, 108, 14, 88, 64)}" fill="#E07A1F" ${st()}/>
    <polygon points="${pts(100, 108, 14, 70, 56, -77)}" fill="#C25E0E"/>
    <circle cx="60" cy="66" r="15" fill="#F7C873" ${st()}/><circle cx="140" cy="66" r="15" fill="#F7C873" ${st()}/>
    ${cel('li', '<circle cx="100" cy="112" r="52"/>', '#F7C873', '#E0A54C', '<circle cx="92" cy="104" r="52" fill="FILL"/>')}
    <circle cx="100" cy="112" r="52" fill="none" ${st()}/>
    <path d="M70 86 l14 4 M130 86 l-14 4" ${st(4)}/>
    ${eye(80, 106, '#F4A100', .95)}${eye(120, 106, '#F4A100', .95)}
    ${blush(64, 128)}${blush(136, 128)}
    <path d="M94 124 h12 l-6 6 z" fill="#7A3E12" ${st(2.5)}/>
    <path d="M89 135 q5.5 6 11 0 q5.5 6 11 0" fill="none" ${st(3)}/>`,
  Ballon: () => `
    <path d="M18 70 h40 M10 100 h36 M22 130 h34" ${st(4)} stroke="#9AA3B2"/>
    <defs><clipPath id="bl"><circle cx="112" cy="100" r="68"/></clipPath></defs>
    <circle cx="112" cy="100" r="68" fill="#fff"/>
    <g clip-path="url(#bl)">
      <path d="M150 30 A68 68 0 0 1 112 168 A80 80 0 0 0 150 30z" fill="#C9D1DB"/>
      ${[0,1,2,3,4].map(i => { const a = (-90 + i*72)*Math.PI/180; return `<line x1="${112+24*Math.cos(a)}" y1="${100+24*Math.sin(a)}" x2="${112+52*Math.cos(a)}" y2="${100+52*Math.sin(a)}" ${st(4)}/>`; }).join('')}
      ${[0,1,2,3,4].map(i => { const a = (-90 + i*72); const r = a*Math.PI/180; return `<polygon points="${pent(112+70*Math.cos(r), 100+70*Math.sin(r), 22, a+180)}" fill="${INK}"/>`; }).join('')}
    </g>
    <polygon points="${pent(112,100,24)}" fill="${INK}" ${st(3)}/>
    <circle cx="112" cy="100" r="68" fill="none" ${st(5)}/>
    
    <polygon points="${pts(170, 42, 4, 14, 5)}" fill="#FFD60A" ${st(2.5)}/><polygon points="${pts(176, 156, 4, 10, 4)}" fill="#FFD60A" ${st(2.5)}/>`,
  Fusée: () => `
    <path d="M100 196 l-8 -16 l-8 8 l-2 -24 h36 l-2 24 l-8 -8 z" fill="#FFB703" ${st(3.5)}/>
    <path d="M100 182 l-5 -10 l-4 4 l-1 -12 h20 l-1 12 l-4 -4 z" fill="#FB5607"/>
    <path d="M66 110 L38 154 L72 146 Z" fill="#E63946" ${st()}/><path d="M134 110 L162 154 L128 146 Z" fill="#E63946" ${st()}/>
    <rect x="80" y="138" width="40" height="14" rx="4" fill="#8D99AE" ${st()}/>
    ${cel('fu', '<path d="M100 16 C132 44 140 92 132 142 L68 142 C60 92 68 44 100 16 Z"/>', '#fff', '#D5DCE6',
      '<path d="M100 16 C126 44 128 92 116 142 L60 142 C52 92 68 44 100 16 Z" fill="FILL"/><path d="M60 0 h80 v66 h-80z" fill="#E63946"/><path d="M110 0 h40 v66 h-40z" fill="#B71C2C"/>')}
    <path d="M100 16 C132 44 140 92 132 142 L68 142 C60 92 68 44 100 16 Z M70 66 h60" fill="none" ${st()}/>
    <circle cx="100" cy="96" r="18" fill="#48CAE4" ${st(5)}/>
    <path d="M100 96 m-18 0 a18 18 0 0 0 36 0" fill="#2A8FB8"/>
    <circle cx="100" cy="96" r="18" fill="none" ${st(5)}/>
    <circle cx="94" cy="89" r="5" fill="#fff"/><circle cx="106" cy="102" r="2.2" fill="#fff"/>
    <polygon points="${pts(150, 40, 4, 12, 4)}" fill="#FFD60A" ${st(2.5)}/><polygon points="${pts(44, 70, 4, 9, 3)}" fill="#FFD60A" ${st(2)}/>`,
  Pomme: () => `
    <path d="M100 62 Q102 42 112 28" fill="none" ${st(7)} stroke="#6B3E1E"/>
    <path d="M106 44 Q130 18 156 34 Q132 62 106 44Z" fill="#52B788" ${st()}/><path d="M110 43 Q132 34 150 35" fill="none" ${st(2.5)}/>
    ${cel('po', '<path d="M100 62 C80 44 36 52 38 102 C40 150 74 180 100 168 C126 180 160 150 162 102 C164 52 120 44 100 62 Z"/>', '#E63946', '#B5222F',
      '<path d="M100 62 C80 44 30 50 30 100 C30 148 64 172 92 166 C116 160 140 140 146 102 C152 56 120 44 100 62 Z" fill="FILL"/>')}
    <path d="M100 62 C80 44 36 52 38 102 C40 150 74 180 100 168 C126 180 160 150 162 102 C164 52 120 44 100 62 Z" fill="none" ${st()}/>
    <path d="M56 80 q6 -14 20 -18" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/><circle cx="54" cy="96" r="4" fill="#fff"/>
    <path d="M76 116 q6 -7 12 0 M112 116 q6 -7 12 0" fill="none" ${st(3.5)}/>
    ${blush(70, 130)}${blush(130, 130)}
    <path d="M94 128 q6 7 12 0" fill="none" ${st(3)}/>`,
  'Super-héros': () => `
    <path d="M118 150 Q160 140 186 118 Q176 150 190 160 Q160 172 120 168 Z" fill="#E63946" ${st()}/>
    <path d="M56 200 Q58 152 100 146 Q142 152 144 200 Z" fill="#3A86FF" ${st()}/>
    <path d="M100 146 Q142 152 144 200 L118 200 Q120 160 100 146z" fill="#2667CC"/>
    <path d="M56 200 Q58 152 100 146 Q142 152 144 200" fill="none" ${st()}/>
    <polygon points="${pts(100, 176, 5, 14, 6)}" fill="#FFD60A" ${st(3)}/>
    <path d="M78 148 Q100 162 122 148 Q118 140 100 142 Q82 140 78 148z" fill="#E63946" ${st()}/>
    ${cel('he', '<path d="M60 76 Q60 126 100 140 Q140 126 140 76 Z"/>', '#FAD7B5', '#E8B48D', '<path d="M52 70 Q56 120 100 132 Q132 122 134 70 Z" fill="FILL"/>')}
    <path d="M60 76 Q60 126 100 140 Q140 126 140 76" fill="none" ${st()}/>
    <polygon points="52,92 46,56 62,64 60,30 80,48 92,14 106,42 124,20 128,50 150,40 142,66 158,72 146,90 136,84 118,76 100,82 82,76 64,84" fill="${INK}" ${st()}/>
    <path d="M84 30 l8 18 M118 32 l-4 16" stroke="#4A6FA5" stroke-width="4" stroke-linecap="round"/>
    <path d="M70 88 l20 6 M130 88 l-20 6" ${st(5)}/>
    ${eye(82, 106, '#3A86FF', .9)}${eye(118, 106, '#3A86FF', .9)}
    <path d="M90 124 q10 10 20 0 z" fill="#C2185B" ${st(3)}/>
    <path d="M64 120 l-6 4 M136 120 l6 4" ${st(2)}/>`,
};
// Fond de case manga : lignes de concentration
const burst = id => `<defs><clipPath id="p${id}"><rect x="4" y="4" width="192" height="192" rx="14"/></clipPath></defs>
  <rect x="4" y="4" width="192" height="192" rx="14" fill="#fff"/>
  <g clip-path="url(#p${id})" stroke="#D9DEE6">${Array.from({ length: 56 }, (_, i) => { const a = i * 360 / 56 * Math.PI / 180, r1 = 72 + (i % 3) * 10; return `<line x1="${(100 + r1 * Math.cos(a)).toFixed(1)}" y1="${(100 + r1 * Math.sin(a)).toFixed(1)}" x2="${(100 + 150 * Math.cos(a)).toFixed(1)}" y2="${(100 + 150 * Math.sin(a)).toFixed(1)}" stroke-width="${i % 2 ? 2 : 4}"/>`; }).join('')}</g>`;
const frame = `<rect x="4" y="4" width="192" height="192" rx="14" fill="none" stroke="${INK}" stroke-width="5"/>`;
const html = `<html><head><style>
body{margin:0;padding:28px;background:#FFF8E7;font-family:system-ui,sans-serif;color:#1B1B2F;width:1240px}
h1{margin:0 0 6px;font-size:30px}.sub{margin:0 0 18px;font-size:17px;opacity:.75}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
figure{margin:0;text-align:center}svg{width:100%;display:block}figcaption{font-weight:800;margin-top:6px;font-size:20px}
.mini{display:flex;gap:16px;margin-top:22px;align-items:center;background:#fff;border-radius:20px;padding:14px 20px}
.mini svg{width:110px}.mini p{margin:0;font-size:16px;opacity:.8}
</style></head><body>
<h1>MaloLab — essai de style « manga »</h1>
<p class="sub">Grands yeux brillants, trait d'encre, ombres franches (cel-shading), lignes de vitesse. Vectoriel, ≈ 2-3 Ko par image, animable.</p>
<div class="grid">${Object.entries(SUBJ).map(([n, f], i) => `<figure><svg viewBox="0 0 200 200">${burst(i)}${f()}${frame}</svg><figcaption>${n}</figcaption></figure>`).join('')}</div>
<div class="mini">${Object.values(SUBJ).slice(0, 4).map(f => `<svg viewBox="0 0 200 200">${f()}</svg>`).join('')}<p>Même dessins sans la case, à la taille d'un bouton de réponse sur iPhone.</p></div>
</body></html>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1296, height: 900 }, deviceScaleFactor: 1.5 });
  await p.setContent(html); await p.screenshot({ path: '/home/user/malolab-manga.png', fullPage: true });
  await b.close();
})();
