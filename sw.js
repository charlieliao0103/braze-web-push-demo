const CACHE_NAME = 'braze-sw-v4';
const CACHE_URLS = [
    '/',
    'https://js.appboycdn.com/web-sdk/5.8/braze.min.js'
];

// Installation
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(CACHE_URLS))
            .then(() => self.skipWaiting())
    );
});

// Activation
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

// Fetch Handling
self.addEventListener('fetch', (event) => {
    // Bypass Braze SDK requests
    if (event.request.url.includes('braze.com')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Cache Braze SDK for future use
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }
    
    // Cache-first strategy for other assets
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});

// Push Notifications
self.addEventListener('push', (event) => {
    const data = event.data.json();
    event.waitUntil(
        self.registration.showNotification(data.title || 'New Notification', {
            body: data.body || 'You have a new message',
            icon: data.icon || '/icon.png',
            data: { url: data.url }
        })
    );
});

// Notification Click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    if (event.notification.data.url) {
        clients.openWindow(event.notification.data.url);
    }
});
