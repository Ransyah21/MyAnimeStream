// Nama cache (ganti versi jika kamu update file yang di-cache, misal jadi v2, v3, dst)
const CACHE_NAME = 'myanimestream-cache-v1';

// ==== DAFTAR FILE YANG AKAN DI-CACHE ====
// !! PENTING: Sesuaikan daftar ini dengan file-file di proyekmu !!
const urlsToCache = [
  // Root dan Halaman HTML Utama
  '/MyAnimeStream/', // Root direktori proyekmu
  '/MyAnimeStream/index.html', // Halaman utama

  // Halaman HTML Lainnya (Tambahkan semua halaman HTML kamu!)
  '/MyAnimeStream/anime.html',
  '/MyAnimeStream/favorites.html',
  '/MyAnimeStream/streaming.html', // Jika ada halaman streaming
  '/MyAnimeStream/About.html', // Jika ada halaman about

  // File CSS (Ganti path jika nama folder/file berbeda)
  // Contoh: '/MyAnimeStream/css/style.css',
  // Tambahkan semua file CSS yang kamu gunakan

  // File JavaScript (Ganti path jika nama folder/file berbeda)
  // Contoh: '/MyAnimeStream/js/script.js',
  // Tambahkan semua file JS yang kamu gunakan

  // File JSON Data
  '/MyAnimeStream/anime-data.json',

  // Gambar Penting (Logo, ikon, gambar UI utama)
  '/MyAnimeStream/Gambar/logo-Myanime192.png', // Ikon PWA (sesuaikan nama jika diubah)
  '/MyAnimeStream/Gambar/logo-Myanime512.png', // Ikon PWA 512px (sesuaikan nama)
  '/MyAnimeStream/Gambar/Searchlogo.png',
  // Tambahkan gambar penting lainnya
  // '/MyAnimeStream/Gambar/background.jpg', // Contoh

  // Font (Jika kamu pakai font custom)
  // Contoh: '/MyAnimeStream/fonts/namafont.woff2',

  // File manifest itu sendiri juga bisa di-cache
  '/MyAnimeStream/manifest.json'
];
// ==== AKHIR DAFTAR FILE ====


// Event 'install': Menyimpan file ke cache saat Service Worker diinstall
self.addEventListener('install', event => {
  console.log('Service Worker: Menginstall...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Membuka Cache & Menambahkan file inti ke cache');
        // Pakai {cache: 'reload'} agar browser selalu fetch versi terbaru saat install,
        // meskipun file sudah ada di cache HTTP browser.
        const stack = [];
        urlsToCache.forEach(url => stack.push(
            cache.add(new Request(url, {cache: 'reload'}))
        ));
        return Promise.all(stack);
      })
      .then(() => {
        console.log('Service Worker: Semua file inti berhasil di-cache.');
        return self.skipWaiting(); // Aktifkan SW baru secepatnya
      })
      .catch(error => {
        console.error('Service Worker: Gagal menambahkan file inti ke cache:', error);
        // Jika satu file gagal di-cache, proses install akan gagal.
        // Pastikan semua path di urlsToCache benar dan file ada.
      })
  );
});

// Event 'activate': Membersihkan cache lama
self.addEventListener('activate', event => {
  console.log('Service Worker: Aktif.');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          // Hapus cache yang namanya tidak sama dengan CACHE_NAME saat ini
          return cacheName.startsWith('myanimestream-cache-') && cacheName !== CACHE_NAME;
        }).map(cacheName => {
          console.log('Service Worker: Menghapus cache lama:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
    .then(() => self.clients.claim()) // Ambil kontrol halaman yang terbuka
  );
});

// Event 'fetch': Menangani request network, mengembalikan dari cache jika ada
self.addEventListener('fetch', event => {
  // Hanya tangani request GET
  if (event.request.method !== 'GET') return;

  // Strategi: Cache First, then Network
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Kembalikan dari cache jika ada
        if (cachedResponse) {
          // console.log(`SW: Mengambil dari cache: ${event.request.url}`);
          return cachedResponse;
        }

        // Jika tidak ada di cache, fetch dari network
        // console.log(`SW: Mengambil dari network: ${event.request.url}`);
        return fetch(event.request).then(networkResponse => {
            // (Opsional) Clone response karena response hanya bisa dibaca sekali
            // let responseToCache = networkResponse.clone();
            // Buka cache dan simpan response network (jika diperlukan caching dinamis)
            // caches.open(CACHE_NAME).then(cache => {
            //   cache.put(event.request, responseToCache);
            // });
            return networkResponse; // Kembalikan response network asli ke browser
          }).catch(error => {
            console.error('SW: Gagal fetch dari network:', error);
            // (Opsional) Jika fetch gagal (offline), tampilkan halaman offline default
            // return caches.match('/MyAnimeStream/offline.html'); // Pastikan file ini ada di urlsToCache
          });
      })
  );
});