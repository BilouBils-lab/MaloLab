// Service worker : permet à l'application de fonctionner hors ligne.
// ⚠️ Après chaque modification de l'app, augmentez le numéro de version ci-dessous.
const CACHE = 'malolab-v34';
const ASSETS = [
  './', './index.html', './style.css', './art.js', './cursive.js', './lecture.js', './maths.js', './sync.js', './shop.js', './app.js', './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png',
  './assets/compagnon-foot.webp', './assets/compagnon-heros.webp', './assets/compagnon-briques.webp',
  './assets/compagnon-monstres.webp', './assets/compagnon-dinos.webp',
  './assets/decor-briques.webp', './assets/decor-monstres.webp', './assets/decor-dinos.webp',
  './assets/decor-foot.webp', './assets/decor-heros.webp',
  './assets/decor-foot-paysage.webp', './assets/decor-heros-paysage.webp', './assets/decor-briques-paysage.webp',
  './assets/decor-monstres-paysage.webp', './assets/decor-dinos-paysage.webp',
  './assets/victoire.webp', './assets/dos-de-carte.webp',
  './assets/legende-foot.webp', './assets/legende-heros.webp', './assets/legende-briques.webp',
  './assets/legende-monstres.webp', './assets/legende-dinos.webp',
  // cartes de la boutique
  ...['foot-ballon', 'foot-crampons', 'foot-tir', 'foot-capitaine', 'foot-coupe', 'foot-gants', 'heros-eclair', 'heros-chien', 'heros-repaire', 'heros-cape', 'heros-masque', 'heros-bouclier', 'briques-brique', 'briques-cle', 'briques-fusee', 'briques-geant', 'briques-voiture', 'monstres-aquabulle', 'monstres-flammeche', 'monstres-cristal', 'monstres-oeuf', 'briques-turbo', 'dinos-empreinte', 'dinos-os', 'monstres-zapi', 'monstres-feuillo', 'dinos-triceratops', 'dinos-oeuf', 'dinos-volcan', 'dinos-pterodactyle'].map(id => `./assets/carte-${id}.webp`),
];

// Le numéro de version est envoyé à la page sur demande (affiché dans l'espace parents)
self.addEventListener('message', e => { if (e.data === 'version' && e.source) e.source.postMessage({ version: CACHE }); });

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Réseau d'abord (pour recevoir les mises à jour), sinon le cache (hors ligne)
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    // « no-cache » : toujours demander au serveur s'il y a une version plus récente (le cache du navigateur gardait parfois l'ancienne)
    fetch(e.request, { cache: 'no-cache' })
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./index.html')))
  );
});
