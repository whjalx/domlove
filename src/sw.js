import { precacheAndRoute } from 'workbox-precaching';

// Precarga de assets compilados
precacheAndRoute(self.__WB_MANIFEST || []);

// Escuchar notificaciones Push
self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: data.url || '/'
    };
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Click en notificación
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  let targetUrl = '/';
  if (event.notification.data) {
    targetUrl = event.notification.data.startsWith('#') 
      ? '/' + event.notification.data 
      : event.notification.data;
  }
  
  const urlToOpen = new URL(targetUrl, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // Intentar enfocar una pestaña existente
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // O abrir una nueva
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
