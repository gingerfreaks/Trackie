self.addEventListener('install', (event) => {
  self.skipWaiting();
});


self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});


self.addEventListener('push', (event) => {
  let data = { title: 'Trackie Update', body: 'New notification received.', url: './index.html' };
  try {
    if (event.data) data = event.data.json();
  } catch (e) {
    if (event.data) data.body = event.data.text();
  }


  const options = {
    body: data.body,
    icon: './icon-512.png',
    badge: './icon-512.png',
    vibrate: [200, 100, 200],
    data: { url: data.url }
  };


  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});


self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || './index.html';


  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url.includes('index.html') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

