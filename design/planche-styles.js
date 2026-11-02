const { chromium } = require('playwright');
const PAL = {
  A: { red:'#E63946', blue:'#3A86FF', yellow:'#FFB703', orange:'#F4A259', green:'#52B788', dark:'#2B2D42', skin:'#F2C29B', white:'#FFFFFF', light:'#FFF1E0', brown:'#8C4A1E', mane:'#C8691C', face:'#F6C26B', gray:'#ADB5BD', sky:'#48CAE4', pink:'#E76F8A', inner:'#F7C59F', hair:'#5C3D2E', navy:'#1D3557', flame:'#FB8500', shade:'#E3E7EC' },
  C: { red:'#F28482', blue:'#84A9FF', yellow:'#F6D365', orange:'#F7B98B', green:'#95D5B2', dark:'#4A4E69', skin:'#F8D3B9', white:'#FFFFFF', light:'#FFF6EC', brown:'#B07D62', mane:'#E0A26B', face:'#F9DB9A', gray:'#CED4DA', sky:'#A0E7F5', pink:'#F4A6B8', inner:'#FAD4BC', hair:'#8D6E63', navy:'#5A6B8C', flame:'#F9A66C', shade:'#EDF0F4' },
};
PAL.B = PAL.A;
const pent = (cx, cy, r, rot = -90) => Array.from({length:5}, (_, i) => { const a = (rot + i*72) * Math.PI/180; return `${(cx + r*Math.cos(a)).toFixed(1)},${(cy + r*Math.sin(a)).toFixed(1)}`; }).join(' ');
const star = (cx, cy, r) => Array.from({length:10}, (_, i) => { const a = (-90 + i*36) * Math.PI/180, rr = i%2 ? r*.45 : r; return `${(cx+rr*Math.cos(a)).toFixed(1)},${(cy+rr*Math.sin(a)).toFixed(1)}`; }).join(' ');
const SUBJ = {
  Chat: c => `
    <polygon class="f" points="45,82 58,24 96,60" fill="${c.orange}"/><polygon class="f" points="155,82 142,24 104,60" fill="${c.orange}"/>
    <polygon points="59,70 63,42 85,62" fill="${c.inner}"/><polygon points="141,70 137,42 115,62" fill="${c.inner}"/>
    <ellipse class="f" cx="100" cy="112" rx="64" ry="56" fill="${c.orange}"/>
    <ellipse cx="100" cy="134" rx="30" ry="21" fill="${c.light}"/>
    <ellipse cx="77" cy="106" rx="7" ry="10" fill="${c.dark}"/><ellipse cx="123" cy="106" rx="7" ry="10" fill="${c.dark}"/>
    <circle cx="79" cy="102" r="2.5" fill="#fff"/><circle cx="125" cy="102" r="2.5" fill="#fff"/>
    <polygon points="93,124 107,124 100,132" fill="${c.pink}" stroke="${c.pink}" stroke-linejoin="round" stroke-width="3"/>
    <path d="M100 132 q-6 9 -13 4 M100 132 q6 9 13 4" fill="none" stroke="${c.dark}" stroke-width="3" stroke-linecap="round"/>
    <path d="M70 130 L40 124 M70 137 L42 142 M130 130 L160 124 M130 137 L158 142" stroke="${c.dark}" stroke-width="2.5" stroke-linecap="round" opacity=".6"/>`,
  Lion: c => `
    ${Array.from({length:12}, (_, i) => { const a = i*30*Math.PI/180; return `<circle class="f" cx="${(100+66*Math.cos(a)).toFixed(1)}" cy="${(108+66*Math.sin(a)).toFixed(1)}" r="24" fill="${c.mane}"/>`; }).join('')}
    <circle cx="100" cy="108" r="70" fill="${c.mane}"/>
    <circle class="f" cx="62" cy="68" r="15" fill="${c.face}"/><circle class="f" cx="138" cy="68" r="15" fill="${c.face}"/>
    <circle class="f" cx="100" cy="110" r="52" fill="${c.face}"/>
    <ellipse cx="100" cy="132" rx="27" ry="19" fill="${c.light}"/>
    <circle cx="82" cy="102" r="6.5" fill="${c.dark}"/><circle cx="118" cy="102" r="6.5" fill="${c.dark}"/>
    <circle cx="84" cy="99.5" r="2" fill="#fff"/><circle cx="120" cy="99.5" r="2" fill="#fff"/>
    <path d="M90 120 h20 q0 10 -10 13 q-10 -3 -10 -13z" fill="${c.brown}"/>
    <path d="M100 133 v6 M100 139 q-7 6 -13 2 M100 139 q7 6 13 2" fill="none" stroke="${c.dark}" stroke-width="3" stroke-linecap="round"/>`,
  Ballon: c => `
    <defs><clipPath id="cb${c.k}"><circle cx="100" cy="100" r="78"/></clipPath></defs>
    <circle class="f" cx="100" cy="100" r="78" fill="${c.white}"/>
    <g clip-path="url(#cb${c.k})">
      <path d="M100 178 A78 78 0 0 0 178 100 A70 70 0 0 1 100 178z" fill="${c.shade}"/>
      ${[0,1,2,3,4].map(i => { const a = (-90 + i*72)*Math.PI/180; return `<line x1="${100+27*Math.cos(a)}" y1="${100+27*Math.sin(a)}" x2="${100+60*Math.cos(a)}" y2="${100+60*Math.sin(a)}" stroke="${c.dark}" stroke-width="4"/>`; }).join('')}
      ${[0,1,2,3,4].map(i => { const a = (-90 + i*72); const r = a*Math.PI/180; return `<polygon points="${pent(100+80*Math.cos(r), 100+80*Math.sin(r), 24, a+180)}" fill="${c.dark}"/>`; }).join('')}
    </g>
    <polygon points="${pent(100,100,28)}" fill="${c.dark}" stroke="${c.dark}" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="100" cy="100" r="78" fill="none" class="o"/>`,
  Fusée: c => `
    <path d="M84 150 Q100 198 116 150 Z" fill="${c.yellow}"/><path d="M91 150 Q100 180 109 150 Z" fill="${c.flame}"/>
    <path class="f" d="M68 112 L40 152 L72 146 Z" fill="${c.red}"/><path class="f" d="M132 112 L160 152 L128 146 Z" fill="${c.red}"/>
    <rect class="f" x="80" y="138" width="40" height="13" rx="4" fill="${c.gray}"/>
    <path class="f" d="M100 18 C132 44 140 92 132 142 L68 142 C60 92 68 44 100 18 Z" fill="${c.white}"/>
    <path d="M100 18 C117 32 126 50 130 66 L70 66 C74 50 83 32 100 18 Z" fill="${c.red}"/>
    <path class="f o" d="M100 18 C132 44 140 92 132 142 L68 142 C60 92 68 44 100 18 Z" fill="none"/>
    <circle class="f" cx="100" cy="95" r="17" fill="${c.sky}" stroke-width="0"/>
    <circle cx="100" cy="95" r="17" fill="none" stroke="${c.gray}" stroke-width="6"/>
    <path d="M92 88 q5 -6 12 -4" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  Pomme: c => `
    <path d="M100 64 Q102 44 112 30" stroke="${c.brown}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path class="f" d="M106 46 Q130 22 154 36 Q130 62 106 46Z" fill="${c.green}"/>
    <path class="f" d="M100 64 C80 46 38 54 40 102 C42 148 74 178 100 166 C126 178 158 148 160 102 C162 54 120 46 100 64 Z" fill="${c.red}"/>
    <ellipse cx="68" cy="98" rx="9" ry="19" fill="#fff" opacity=".45" transform="rotate(18 68 98)"/>`,
  'Super-héros': c => `
    <path class="f" d="M44 192 Q48 122 100 116 Q152 122 156 192 Z" fill="${c.red}"/>
    <path class="f" d="M60 192 Q62 142 100 136 Q138 142 140 192 Z" fill="${c.blue}"/>
    <polygon points="${star(100,166,15)}" fill="${c.yellow}"/>
    <rect x="90" y="112" width="20" height="18" fill="${c.skin}"/>
    <circle class="f" cx="100" cy="82" r="40" fill="${c.skin}"/>
    <path d="M60 80 Q60 38 100 40 Q140 38 140 80 Q126 60 100 62 Q76 60 60 80Z" fill="${c.hair}"/>
    <path d="M62 80 Q100 68 138 80 L136 98 Q100 89 64 98 Z" fill="${c.navy}"/>
    <ellipse cx="84" cy="86" rx="9" ry="6.5" fill="#fff"/><ellipse cx="116" cy="86" rx="9" ry="6.5" fill="#fff"/>
    <circle cx="85" cy="86" r="3.5" fill="${c.dark}"/><circle cx="117" cy="86" r="3.5" fill="${c.dark}"/>
    <path d="M88 104 q12 10 24 0" stroke="${c.dark}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
};
const STY = {
  A: { title: 'A · Aplat moderne', desc: 'Formes simples, couleurs franches, sans contour. Sobre et élégant.', css: '.o{stroke:#D3D9E1;stroke-width:4}' },
  B: { title: 'B · Album jeunesse', desc: 'Contour épais arrondi, comme un autocollant ou un livre pour enfants. Très lisible.', css: '.f,.o{stroke:#2B2D42;stroke-width:5;stroke-linejoin:round}' },
  C: { title: 'C · Doux pastel', desc: 'Couleurs tendres, volumes adoucis, petite ombre. Calme et chaleureux.', css: '.o{stroke:#E1E6EE;stroke-width:3}' },
};
const tile = (k, name) => {
  const c = { ...PAL[k], k };
  const bg = k === 'C' ? `<circle cx="100" cy="104" r="92" fill="#EEF4FF"/>` : '';
  const filt = k === 'C' ? `<defs><filter id="sh${k}${name.length}" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="#4A4E69" flood-opacity=".18"/></filter></defs>` : '';
  return `<figure><svg viewBox="0 0 200 200" class="s${k}">${filt}${bg}<g ${k==='C'?`filter="url(#sh${k}${name.length})"`:''}>${SUBJ[name](c)}</g></svg><figcaption>${name}</figcaption></figure>`;
};
const html = `<html><head><style>
body{margin:0;padding:28px;background:#FFF8E7;font-family:system-ui,sans-serif;color:#2B2D42;width:1240px}
h1{margin:0 0 6px;font-size:30px} .sub{margin:0 0 20px;font-size:17px;opacity:.75}
section{background:#fff;border-radius:22px;padding:18px 22px;margin-bottom:18px;box-shadow:0 4px 0 rgba(0,0,0,.06)}
h2{margin:0;font-size:22px} p{margin:4px 0 10px;opacity:.75}
.row{display:flex;gap:10px} figure{margin:0;text-align:center;flex:1} svg{width:100%;height:auto;display:block}
figcaption{font-weight:700;margin-top:2px}
${Object.entries(STY).map(([k,s]) => s.css.split('}').filter(Boolean).map(r => `.s${k} ${r}}`).join('\n')).join('\n')}
</style></head><body>
<h1>MaloLab — choix de la direction artistique</h1><p class="sub">Mêmes sujets, trois styles. Tout est dessiné en vectoriel (≈ 1 à 2 Ko par image), animable en CSS.</p>
${Object.entries(STY).map(([k,s]) => `<section><h2>${s.title}</h2><p>${s.desc}</p><div class="row">${Object.keys(SUBJ).map(n => tile(k,n)).join('')}</div></section>`).join('')}
</body></html>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1296, height: 900 }, deviceScaleFactor: 1.5 });
  await p.setContent(html); await p.screenshot({ path: '/home/user/ptit-ecolier/../malolab-styles.png', fullPage: true });
  require('fs').writeFileSync(process.argv[2] + '/planche.html', html);
  await b.close();
})();
