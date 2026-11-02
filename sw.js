// Service worker : permet à l'application de fonctionner hors ligne.
// ⚠️ Après chaque modification de l'app, augmentez le numéro de version ci-dessous.
const CACHE = 'malolab-v7';
const ASSETS = [
  './', './index.html', './style.css', './app.js', './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './apple-touch-icon.png',
  './assets/compagnon-foot.webp', './assets/compagnon-heros.webp', './assets/compagnon-briques.webp',
  './assets/compagnon-monstres.webp', './assets/compagnon-dinos.webp',
  './assets/decor-briques.webp', './assets/decor-monstres.webp', './assets/decor-dinos.webp',
  './assets/victoire.webp', './assets/dos-de-carte.webp',
];

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
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./index.html')))
  );
});
