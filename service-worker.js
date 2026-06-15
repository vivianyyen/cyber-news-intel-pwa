// Minimal service worker - required for PWA installability
const CACHE_NAME = 'cyber-news-intel-v1';
const PRECACHE_URLS = [
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Only handle our own shell files; let the Streamlit iframe content
// pass straight through to the network (don't try to cache it).
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (PRECACHE_URLS.includes(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
  }
  // else: do nothing -> default browser network handling
});
