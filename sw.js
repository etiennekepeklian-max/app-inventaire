const CACHE_NAME = 'gestion-stock-art-v4'; // V4

const ASSETS = [
  './',
  './index.html',
  './login.html',
  './ajouter.html',
  './inventaire.html',
  './scanner.html',
  './audit.html',
  './profil.html',
  './aide.html',
  './admin.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://unpkg.com/html5-qrcode',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[PWA] Fichiers sauvegardés en mémoire.');
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[PWA] Suppression de l\'ancien cache : ' + key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method === 'POST') {
    return;
  }
  e.respondWith(
    fetch(e.request)
    .then((response) => {
      if (response && response.status === 200 && response.type === 'basic') {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => { cache.put(e.request, responseClone); });
      }
      return response;
    })
    .catch(() => {
      // ignoreSearch: true pour que inventaire.html?ref=123 fonctionne hors ligne
      return caches.match(e.request, { ignoreSearch: true }).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
      });
    })
  );
});