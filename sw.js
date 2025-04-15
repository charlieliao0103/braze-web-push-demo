const CACHE_VERSION = 'braze-sw-v2.1';
const CACHE_ASSETS = [
    '/',
    '/braze-sdk-proxy',
    'https://js.appboycdn.com/web-sdk/5.8/braze.min.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then(cache => {
                return cache.addAll(CACHE_ASSETS)
                    .then(() => self.skipWaiting());
            })
            .catch(error => {
                sendMessageToClients('Install failed: ' + error.message);
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => name !== CACHE_VERSION)
                          .map(name => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('braze.com')) {
        event.respondWith(
            cacheFirstWithUpdate(event.request)
        );
    } else {
        event.respondWith(fetch(event.request));
    }
});

async function cacheFirstWithUpdate(request) {
    const cache = await caches.open(CACHE_VERSION);
    const cachedResponse = await cache.match(request);
    
    // Always update in background
    const fetchPromise = fetch(request).then(networkResponse => {
        cache.put(request, networkResponse.clone());
        return networkResponse;
    });

    return cachedResponse || await fetchPromise;
}

// Braze Specific Handlers
self.addEventListener('push', (event) => {
    const data = event.data.json();
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon || '/default-icon.png',
            data: data.click_action
        })
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    if (event.notification.data) {
        clients.openWindow(event.notification.data);
    }
});

// Debugging Utilities
function sendMessageToClients(message) {
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({
                type: 'braze-sw-status',
                message: message
            });
        });
    });
}

// Error Handling
self.addEventListener('error', (event) => {
    sendMessageToClients(`SW Error: ${event.message}`);
});

self.addEventListener('unhandledrejection', (event) => {
    sendMessageToClients(`SW Promise Rejection: ${event.reason}`);
});
