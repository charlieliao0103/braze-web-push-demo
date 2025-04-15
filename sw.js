const CACHE_NAME = 'braze-final-v2';

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

// Modified fetch handler
self.addEventListener('fetch', (event) => {
    // Bypass all Braze-related requests
    if (event.request.url.includes('braze.com')) {
        event.respondWith(fetch(event.request));
        return;
    }
    
    // Cache-first strategy for local assets
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
