// sw.js – Service Worker required for Braze Web Push

self.addEventListener("push", function(event) {
    if (event.data) {
      const payload = event.data.json();
      event.waitUntil(
        self.registration.showNotification(payload.title, {
          body: payload.body,
          icon: payload.icon,
          data: payload,
        })
      );
    }
  });
  
  self.addEventListener("notificationclick", function(event) {
    event.notification.close();
    const url = event.notification.data.url || "/";
    event.waitUntil(clients.openWindow(url));
  });
  