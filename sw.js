const CACHE_NAME = 'udem-carnet-v26';
const ASSETS = [
  './index.html',
  './styles.css',
  './app.js',
  './qrcode.min.js',
  './manifest.json',
  './logo_udemedellin2.png',
  './assets/estudiante.PNG',
  './assets/estudiante_mujer.jpg',
  './valentina/index.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
