self.addEventListener('push', event => {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/icon.png'
    });
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    clients.openWindow('https://your-website.com');
});
