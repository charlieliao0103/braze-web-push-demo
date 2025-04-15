const CACHE_NAME = 'braze-sw-v1';

// Installation
self.addEventListener('install', (event) => {
    console.log('SW installing');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(['/']))
            .then(() => self.skipWaiting())
    );
});

// Activation
self.addEventListener('activate', (event) => {
    console.log('SW activated');
    event.waitUntil(self.clients.claim());
});

// Push Notifications
self.addEventListener('push', (event) => {
    console.log('Push received:', event.data.text());
    event.waitUntil(
        self.registration.showNotification('Test Notification', {
            body: 'Service Worker is working!',
            icon: '/icon.png'
        })
    );
});

// Message Handling
self.addEventListener('message', (event) => {
    console.log('SW received message:', event.data);
});
