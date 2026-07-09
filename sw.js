const CACHE_NAME = 'stock-cache-v0.9';
const urlsToCache = [
  './index.html',
  './login.html',
  './scanner.html',
  './ajouter.html',
  './inventaire.html',
  './deplacer.html',
  './sortir.html',
  './audit.html',
  './admin.html',
  './profil.html',
  './aide.html',
  './manifest.json',
  './icon-192.png',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://unpkg.com/html5-qrcode'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});