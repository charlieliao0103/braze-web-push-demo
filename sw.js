const CACHE_NAME = 'braze-sw-final-v4';
const BRAZE_ENDPOINT = 'sdk.iad-03.braze.com';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.add('/'))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    // Bypass all Braze API requests
    if (event.request.url.includes(BRAZE_ENDPOINT)) {
        event.respondWith(fetch(event.request));
        return;
    }
    
    // Cache-first strategy for local assets
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
