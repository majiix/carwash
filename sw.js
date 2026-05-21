const CACHE_NAME = 'carwash-planner-cache-v7';
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
  'js/lang/es.js',
  'js/lang/fr.js',
  'js/lang/zh.js',
  'js/lang/hi.js',
  'js/lang/ar.js',
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

// Fetch Event - Cache-First Strategy with Network Fallback
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip external APIs (like Open-Meteo or Nominatim) to fetch live weather
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) {
    // For weather requests or geocoding, go network-only but fail gracefully
    return;
  }

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
