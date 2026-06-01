const CACHE_NAME = 'vt-focus-v1';
const ASSETS = [
  './',
  './index.html',
  './js/focus-assistant.js',
  './sounds/rain.mp3',
  './sounds/lofi.mp3',
  './sounds/cafe.mp3',
  './sounds/forest.mp3',
  './sounds/fire.mp3',
  './sounds/ocean.mp3'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});