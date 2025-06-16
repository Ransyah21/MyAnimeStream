const CACHE_NAME = 'myanime-cache-v1';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './Gambar/logo-Myanime512.png',
  './Gambar/logo-Myanime192.png',
  // Tambahkan file CSS, JS, gambar penting lainnya
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
