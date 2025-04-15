const CACHE_NAME = 'braze-sw-v1';
const CACHE_URLS = [
  'https://js.appboycdn.com/web-sdk/5.8/braze.min.js',
  '/notification-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_URLS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('push', (event) => {
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/notification-icon.png',
      data: { url: data.url }
    })
  );
});
