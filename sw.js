importScripts('https://js.appboycdn.com/web-sdk/5.8/service-worker.js');

const CACHE_NAME = 'braze-sw-v2';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll([
        '/',
        '/index.html'
      ]))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});
