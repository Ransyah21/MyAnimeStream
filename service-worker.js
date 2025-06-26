// File: service-worker.js

// PERUBAHAN: Versi cache dinaikkan ke v4 untuk memaksa update
const CACHE_NAME = 'myanimestream-cache-v4'; 
const URLS_TO_CACHE = [
  './',
  './index.html',
  './About.html',
  './anime.html',
  './streaming.html',
  './anime-data.json',
  './manifest.json',
  './Gambar/Logo-APL-Myanime.png',
  './Gambar/default-thumbnail.png'
];

// Event 'install' - dijalankan saat service worker pertama kali diinstal
self.addEventListener('install', event => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching assets');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// PERUBAHAN: Event 'fetch' dengan strategi "Network First, then Cache"
self.addEventListener('fetch', event => {
  // Hanya terapkan strategi ini untuk request penting seperti data atau halaman utama
  if (event.request.url.includes('anime-data.json') || event.request.mode === 'navigate') {
    event.respondWith(
      // 1. Coba ambil dari network dulu
      fetch(event.request)
        .then(networkResponse => {
          // Jika berhasil, simpan ke cache dan kembalikan ke browser
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          // 2. Jika network gagal (offline), baru ambil dari cache
          return caches.match(event.request);
        })
    );
  } else {
    // Untuk aset lain (gambar, font, dll), gunakan strategi "Cache First" agar cepat
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request);
        })
    );
  }
});


// Event 'activate' - untuk membersihkan cache lama (tidak berubah)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});