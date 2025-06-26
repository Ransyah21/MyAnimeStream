// File: service-worker.js

// Versi cache dinaikkan ke v3 untuk memaksa update
const CACHE_NAME = 'myanimestream-cache-v3'; 
const URLS_TO_CACHE = [
  './',
  './index.html',
  './About.html',
  './anime.html',       // PERUBAHAN: Menambahkan anime.html
  './streaming.html',   // PERUBAHAN: Menambahkan streaming.html
  './anime-data.json',
  './manifest.json',
  './Gambar/Logo-APL-Myanime.png', // Logo utama
  './Gambar/default-thumbnail.png'
];

self.addEventListener('install', event => {
  // Langsung aktifkan service worker baru tanpa menunggu
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching assets');
        // Menggunakan addAll dengan opsi untuk tidak gagal jika salah satu URL error
        const cachePromises = URLS_TO_CACHE.map(urlToCache => {
            return cache.add(urlToCache).catch(err => {
                console.warn(`Failed to cache ${urlToCache}:`, err);
            });
        });
        return Promise.all(cachePromises);
      })
  );
});

self.addEventListener('fetch', event => {
  // Strategi: Cache-first, lalu network.
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika ada di cache, langsung kembalikan
        if (response) {
          return response;
        }
        // Jika tidak, fetch dari network
        return fetch(event.request).then(
          (networkResponse) => {
            // Jika request berhasil, simpan ke cache untuk lain waktu
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
          }
        ).catch(() => {
            // Jika fetch gagal (misal: offline), berikan fallback jika ada
            // Di sini kita bisa mengembalikan halaman offline custom, tapi untuk sekarang biarkan default error
        });
      })
  );
});

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