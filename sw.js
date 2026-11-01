const CACHE_NAME = 'carwash-planner-cache-v39';
const ASSETS_TO_CACHE = [
  './',
  'index.html',
  'manifest.json',
  'css/style.css',
  'js/app.js',
  'js/lucide.min.js',
  'js/tailwindcss.js',
  'icon.svg',
  'icon_192.png',
  'icon_512.png',
  'fonts/Vazirmatn[wght].woff2',
  'fonts/Vazirmatn-Regular.woff2',
  'fonts/Vazirmatn-Medium.woff2',
  'fonts/Vazirmatn-Bold.woff2',
  'fonts/Vazirmatn-SemiBold.woff2',
  'js/lang/en.js',
  'js/lang/fa.js'
];

// Install Event - Pre-cache Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch Event - Dynamic and Static caching strategies
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Network-First Strategy for weather forecast APIs to support offline usability
  if (url.origin === 'https://api.open-meteo.com') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open('carwash-weather-cache').then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Serve from weather cache if offline/failed
          return caches.match(event.request);
        })
    );
    return;
  }

  // Skip other external APIs
  if (url.origin !== self.location.origin) {
    return;
  }

  // Cache-First Strategy with Network Fallback for local assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // Cache new local resources dynamically if they are successful
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Return cached index.html as a fallback if offline and not found
        if (event.request.mode === 'navigate') {
          return caches.match('./') || caches.match('index.html');
        }
      });
    })
  );
});

// Helper function to update weather forecast in background
async function updateWeatherInBackground() {
  const cache = await caches.open('carwash-weather-cache');
  const requests = await cache.keys();
  const weatherRequest = requests.find(req => req.url.includes('api.open-meteo.com/v1/forecast'));
  if (weatherRequest) {
    try {
      const response = await fetch(weatherRequest);
      if (response.status === 200) {
        await cache.put(weatherRequest, response);
        // Show a system notification that forecast has been updated
        await self.registration.showNotification('Weather Sync Completed', {
          body: 'Car Wash Planner forecast successfully updated in the background.',
          icon: './icon_192.png',
          badge: './icon.svg',
          tag: 'weather-update-sync'
        });
      }
    } catch (err) {
      console.error('Background weather fetch failed:', err);
    }
  }
}

// Background Sync - Defer tasks to run when internet is stable
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-weather' || event.tag === 'sync-wash-check') {
    event.waitUntil(updateWeatherInBackground());
  }
});

// Periodic Sync - Fetch data at regular intervals in background
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'fetch-weather') {
    event.waitUntil(updateWeatherInBackground());
  }
});

// Web Push Notifications
self.addEventListener('push', (event) => {
  let data = { title: 'Car Wash Planner', body: 'Time to check if you should wash your car!' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Car Wash Planner', body: event.data.text() };
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: './icon_192.png',
      badge: './icon.svg',
      tag: data.tag || 'carwash-push-notification',
      data: data.url || './'
    })
  );
});

// Notification Click Handler - Open/focus app window
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data || './';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});
