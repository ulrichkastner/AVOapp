const CACHE_NAME = 'avo-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/manifest.json',
  '/js/sw.js',
  '/modules/screening.html',
  '/modules/safetyplan.html',
  '/modules/distresscurve.html',
  '/modules/tips-tools.html',
  '/modules/ki-assistenz.html',
  '/modules/search.html',
  '/modules/add.html',
  '/modules/suggestions.html',
  '/modules/settings.html',
  '/modules/skills.html',
  '/modules/safety/warning.html',
  '/modules/safety/distraction.html,'
  '/modules/safety/enviroment.html',
  '/modules/safety/professional.html',
  '/modules/safety/suppport.html',
  '/modules/safety/strategies.html',
  '/assets/icons/avo-icon-192.png',
  '/assets/icons/avo-icon-512.png',
  '/assets/icons/screening-icon.png',
  '/assets/icons/safety-icon.png',
  '/assets/icons/distress-icon.png',
  '/assets/icons/tipps-icon.png',
  '/assets/icons/search-inactive.png',
  '/assets/icons/home-active.png',
  '/assets/icons/plus-inactive.png',
  '/assets/icons/suggestion-inactive.png',
  '/assets/icons/settings-inactive.png',
  '/assets/images/avatar.jpg',
  '/assets/images/impulse1.jpg',
  '/assets/images/impulse2.jpg'
];

// Install Service Worker and cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});

// Fetch from cache or network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});