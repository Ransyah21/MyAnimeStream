// File: service-worker.js

const CACHE_NAME = 'myanimestream-cache-v2'; // Ganti versi cache agar update
const URLS_TO_CACHE = [
  './', // Ini akan mengacu ke https://ransyah21.github.io/MyAnimeStream/
  './index.html',
  './About.html', // Cache halaman About juga!
  './anime-data.json', // Cache data anime agar bisa dibuka offline!
  './manifest.json',
  './Gambar/logo-Myanime512.png',
  './Gambar/logo-Myanime192.png',
  './Gambar/default-thumbnail.png' // Cache gambar default
  // Kalau kamu punya file CSS atau JS eksternal, tambahkan di sini.
  // Contoh: './style.css', './script.js'
];

// Event 'install' - dijalankan saat service worker pertama kali diinstal
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching assets');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Event 'fetch' - dijalankan setiap kali ada request network dari halaman
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika request ada di cache, kembalikan dari cache.
        // Jika tidak, lakukan fetch ke network.
        return response || fetch(event.request);
      })
  );
});

// Event 'activate' - untuk membersihkan cache lama
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});