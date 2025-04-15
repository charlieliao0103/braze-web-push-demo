// Import Braze Service Worker first
importScripts('https://js.appboycdn.com/web-sdk/5.8/service-worker.js');

const CACHE_NAME = 'braze-sw-v1';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(['/']))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.map(key => 
        key !== CACHE_NAME ? caches.delete(key) : null
      ))
    )
  );
});

// Delegate to Braze's fetch handler
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
