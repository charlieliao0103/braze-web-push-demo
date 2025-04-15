const CACHE_NAME = 'braze-final-v1';
const CACHE_URLS = ['/'];

// Simplified Installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Force Activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
    .then(() => self.clients.claim())
  );
});

// Bypass Braze Requests
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('braze.com')) {
    return; // Let Braze handle its own requests
  }
  event.respondWith(caches.match(event.request) || fetch(event.request));
});
