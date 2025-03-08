// Splash Screen System
function createSplashScreen() {
  // Cek hanya di halaman utama
  const isHomePage = window.location.pathname.endsWith("index.html") || 
                    window.location.pathname === "/";
  
  if (!isHomePage) return null;

  // Create container
  const splashScreen = document.createElement("div");
  splashScreen.id = "myDynamicSplash";

  // Create content
  const contentWrapper = document.createElement("div");
  contentWrapper.className = "splash-content";

  // Create title
  const title = document.createElement("div");
  title.className = "splash-title";

  // Create title letters
  const letters = ["M", "y", "A", "n", "i", "m", "e"];
  letters.forEach((letter, index) => {
    const span = document.createElement("span");
    span.textContent = letter;
    span.style.animationDelay = `${0.3 + index * 0.1}s`;
    title.appendChild(span);
  });

  // Create loader
  const cubeGrid = document.createElement("div");
  cubeGrid.className = "sk-cube-grid";
  for (let i = 1; i <= 9; i++) {
    const cube = document.createElement("div");
    cube.className = `sk-cube sk-cube${i}`;
    cubeGrid.appendChild(cube);
  }

  // Create error message
  const errorMessage = document.createElement("div");
  errorMessage.className = "network-status";

  // Assemble components
  contentWrapper.appendChild(title);
  contentWrapper.appendChild(cubeGrid);
  contentWrapper.appendChild(errorMessage);
  splashScreen.appendChild(contentWrapper);

  // Add to DOM
  document.body.prepend(splashScreen);

  return { splashScreen, errorMessage };
}

function initSplashScreen() {
  const splashData = createSplashScreen();
  if (!splashData) return;

  const { splashScreen, errorMessage } = splashData;
  let isLoaded = false;

  // Network error handler
  const showNetworkError = (message) => {
    errorMessage.textContent = message;
    errorMessage.classList.add("show");
  };

  // Initial network check
  if (!navigator.onLine) showNetworkError("Koneksi internet offline");

  // Network event listeners
  window.addEventListener("offline", () => showNetworkError("Koneksi internet offline"));
  window.addEventListener("online", () => errorMessage.classList.remove("show"));

  // Connection quality check
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (connection) {
    connection.addEventListener('change', () => {
      if (connection.effectiveType === "slow-2g" || connection.effectiveType === "2g") {
        showNetworkError("Koneksi internet lemah terdeteksi");
      }
    });
  }

  // Hide splash screen
  const hideSplash = () => {
    if (isLoaded) return;
    isLoaded = true;
    
    splashScreen.style.opacity = "0";
    splashScreen.addEventListener("transitionend", () => {
      splashScreen.remove();
    });
  };

  // Timeout handler
  const loadTimeout = setTimeout(() => {
    if (!isLoaded) showNetworkError("Memuat lebih lama dari biasanya...");
  }, 5000);

  // Load event handler
  const handleLoad = () => {
    clearTimeout(loadTimeout);
    hideSplash();
  };

  // Event listeners
  if (document.readyState === 'complete') {
    handleLoad();
  } else {
    window.addEventListener('load', handleLoad);
    document.addEventListener('DOMContentLoaded', () => {
      if (document.readyState === 'interactive') {
        setTimeout(handleLoad, 1000);
      }
    });
  }
}

// Initialize splash screen
document.addEventListener('DOMContentLoaded', initSplashScreen);

// Login Dan Logout

// LOGIN & FAVORITES SYSTEM
const CLIENT_ID = "429779218315-46milavmlmmbb1b1v5p6v4mbh1o40uk6.apps.googleusercontent.com";
const REDIRECT_URI = "https://ransyah21.github.io/MyAnimeStream/";

// Fungsi Login Google
function handleLogin() {
  localStorage.removeItem('access_token');
  const oauth2Url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=email profile&prompt=select_account`;
  window.location.href = oauth2Url;
}

// Fungsi Logout
function handleLogout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user_info');
  window.location.reload();
}

// Ambil info pengguna
async function getUserInfo(accessToken) {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return await response.json();
  } catch (error) {
    console.error("Gagal mengambil info pengguna:", error);
    return null;
  }
}

// Update menu navigasi
async function updateMenu() {
  const menu = document.getElementById('menu');
  if (!menu) return;

  const accessToken = localStorage.getItem('access_token');
  const userInfo = JSON.parse(localStorage.getItem('user_info'));

  menu.innerHTML = accessToken ? `
    <li><a href="favorites.html">Favorites</a></li>
    <li>
      <a href="#" id="logout-btn" class="profile-btn">
        <img src="${userInfo.picture}" alt="Profile" class="profile-img">
        <span>${userInfo.name}</span>
      </a>
    </li>
    <li><a href="Full.html">FindNime</a></li>
  ` : `
    <li><a href="#" id="google-login-btn">Login</a></li>
    <li><a href="Full.html">FindNime</a></li>
  `;

  // Event delegation untuk login/logout
  document.body.addEventListener('click', (e) => {
    if (e.target.closest('#google-login-btn')) {
      handleLogin();
    }
    if (e.target.closest('#logout-btn')) {
      handleLogout();
    }
  });
}



// Panggil saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  updateMenu();
});

// PAGINATION SYSTEM YANG DIPERBAIKI
let currentPage = 1;
let itemsPerPage = 30;
let totalPages = 1;
let allAnimeData = [];
let filteredData = [];

// PERBAIKAN PATH JSON (gunakan forward slash)
const JSON_PATH = './anime-data.json'; // Sesuaikan dengan path sebenarnya

async function loadAnimeData() {
  try {
    console.log("🔄 Memulai load data dari:", JSON_PATH);
    const response = await fetch(JSON_PATH);
    
    console.log("🔍 Status response:", response.status);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error("Response bukan JSON!");
    }
    
    const data = await response.json();
    console.log("✅ Data diterima:", data);
    
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error("Struktur JSON tidak valid!");
    }
    
    return data.data;
  } catch (error) {
    console.error("❌ Error kritikal:", error);
    showNotification(`Gagal memuat data: ${error.message}`, "error");
    return [];
  }
}

function renderAnimeItems(data) {
  const animeList = document.querySelector('.anime-list');
  if (!animeList) {
    console.error("Container anime tidak ditemukan!");
    return;
  }
  
  // Hapus item statis yang ada di HTML
  animeList.innerHTML = '';
  
  // Render item baru
  animeList.innerHTML = data.map(anime => `
    <div class="anime-item">
      <a href="anime.html?slug=${anime.slug}">
        <img src="${anime.image}" alt="${anime.title}">
      </a>
      <a href="anime.html?slug=${anime.slug}"><span>${anime.title}</span></a>
      <button onclick="addToFavorites({
    title: '${anime.title.replace(/'/g, "\\'")}', 
    image: '${anime.image}', 
    slug: '${anime.slug}'
  })">Favorite</button>
    </div>
  `).join('');
}

// PERBAIKAN PAGINATION CONTROLS
function renderPagination() {
  const paginationContainer = document.querySelector('.pagination-container') || document.createElement('div');
  paginationContainer.className = 'pagination-container';
  
  paginationContainer.innerHTML = `
    <div class="pagination-controls">
      <button class="pagination-btn" id="prev-btn" ${currentPage === 1 ? 'disabled' : ''}>
        Previous
      </button>
      <span class="page-info">Halaman ${currentPage} dari ${totalPages}</span>
      <button class="pagination-btn" id="next-btn" ${currentPage === totalPages ? 'disabled' : ''}>
        Next
      </button>
    </div>
  `;

  // Tambahkan ke DOM jika belum ada
  if (!document.querySelector('.pagination-container')) {
    document.querySelector('main').appendChild(paginationContainer);
  }
}

// INISIALISASI UTAMA YANG DIPERBAIKI
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Inisialisasi Auth dulu
  await initAuth(); 
  
  // 2. Update menu berdasarkan status auth
  updateMenu();
  
  // 3. Load data anime
  allAnimeData = await loadAnimeData();
  
  // 4. Update UI berdasarkan data
  if (allAnimeData.length > 0) {
    filteredData = [...allAnimeData];
    totalPages = Math.ceil(filteredData.length / itemsPerPage);
    updateDisplay();
    renderGenreFilters();
  } else {
    showNotification("Tidak ada data anime", "error");
  }

  
  filteredData = [...allAnimeData];
  totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  // Render awal
  updateDisplay();
  
  // Event listener untuk pagination (menggunakan event delegation)
  document.body.addEventListener('click', (e) => {
    if (e.target.id === 'prev-btn') {
      currentPage = Math.max(1, currentPage - 1);
      updateDisplay();
    }
    
    if (e.target.id === 'next-btn') {
      currentPage = Math.min(totalPages, currentPage + 1);
      updateDisplay();
    }
  });
});

function updateDisplay() {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  
  renderAnimeItems(filteredData.slice(start, end));
  renderPagination();
  window.scrollTo(0, 0);
}

// PERBAIKAN PENCARIAN
document.getElementById('search-input').addEventListener('input', function(e) {
  const searchValue = e.target.value.toLowerCase();
  
  filteredData = allAnimeData.filter(anime => 
    anime.title.toLowerCase().includes(searchValue) ||
    anime.desc.toLowerCase().includes(searchValue)
  );
  
  currentPage = 1;
  totalPages = Math.ceil(filteredData.length / itemsPerPage);
  updateDisplay();
});
// Faforites

function addToFavorites(anime) {
    let accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
        showNotification("Silakan login terlebih dahulu!", "error");
        return;
    }

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.some(fav => fav.slug === anime.slug)) {
        showNotification("Anime sudah ada di daftar favorit!", "info");
        return;
    }

    favorites.push(anime);
    localStorage.setItem('favorites', JSON.stringify(favorites));

    showNotification("Anime berhasil ditambahkan ke favorit!", "success");
}

function addToFavorites(anime) {
  let accessToken = localStorage.getItem('access_token');

  if (!accessToken) {
      showNotification("Silakan login terlebih dahulu!", "error");
      return;
  }

  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  if (favorites.some(fav => fav.slug === anime.slug)) {
      showNotification("Anime sudah ada di daftar favorit!", "info");
      return;
  }

  favorites.push(anime);
  localStorage.setItem('favorites', JSON.stringify(favorites));

  showNotification("Anime berhasil ditambahkan ke favorit!", "success");
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
      notification.style.opacity = "0";
      setTimeout(() => notification.remove(), 500);
  }, 3000);
}


// Inisialisasi Auth dengan Validasi Lebih Baik
async function initAuth() {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');

  if (accessToken) {
    try {
      // Ambil user info dulu sebelum menyimpan token
      const userInfo = await getUserInfo(accessToken);
      if (!userInfo || !userInfo.email) {
        throw new Error("Gagal mendapatkan data user!");
      }

      // Simpan data hanya jika valid
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('user_info', JSON.stringify(userInfo));
      history.replaceState(null, '', window.location.pathname);

      updateMenu();
    } catch (error) {
      console.error("Login gagal:", error);
      showNotification("Login gagal. Coba lagi!", "error");
    }
  }
}


// Variabel global
let selectedGenre = null;

// Fungsi untuk render genre filters
function renderGenreFilters() {
    const genreContainer = document.querySelector('.genre-list');
    const allGenres = new Set();
    
    // Kumpulkan semua genre unik
    allAnimeData.forEach(anime => {
        anime.info.genres.forEach(genre => allGenres.add(genre));
    });

    // Kosongkan container
    genreContainer.innerHTML = '';
    
    // Buat tombol untuk setiap genre
    allGenres.forEach(genre => {
        const button = document.createElement('button');
        button.className = 'genre-btn';
        button.textContent = genre;
        button.addEventListener('click', () => filterByGenre(genre));
        genreContainer.appendChild(button);
    });

    // Tambahkan tombol All
    const allButton = document.createElement('button');
    allButton.className = 'genre-btn selected'; // Set as selected by default
    allButton.textContent = 'All';
    allButton.addEventListener('click', () => filterByGenre(null));
    genreContainer.prepend(allButton);
}

// Fungsi filter genre dengan animasi
function filterByGenre(genre) {
    const container = document.querySelector('.genre-list-container');
    const animeList = document.querySelector('.anime-list');
    
    // Animasi collapse
    container.classList.add('collapsed');
    animeList.style.opacity = '0.5';
    animeList.style.transform = 'translateY(20px)';
    animeList.style.transition = 'all 0.3s ease';
    
    setTimeout(() => {
        selectedGenre = genre;
        currentPage = 1;
        
        // Filter data
        if (!genre) {
            filteredData = [...allAnimeData];
        } else {
            filteredData = allAnimeData.filter(anime => 
                anime.info.genres.some(g => g === genre)
            );
        }
        
        totalPages = Math.ceil(filteredData.length / itemsPerPage);
        
        // Update tombol aktif
        document.querySelectorAll('.genre-btn').forEach(btn => {
            btn.classList.toggle('selected', btn.textContent === (genre || 'All'));
        });
        
        // Update tampilan
        updateDisplay();
        container.classList.remove('collapsed');
        
        // Reset animasi
        setTimeout(() => {
            animeList.style.opacity = '1';
            animeList.style.transform = 'translateY(0)';
        }, 100);
    }, 300);
}

// Toggle genre list (dipindahkan ke luar fungsi renderGenreFilters)
document.querySelector('.genre-header').addEventListener('click', function() {
    const container = document.querySelector('.genre-list-container');
    const arrowDown = document.querySelector('.arrow-down');
    const arrowUp = document.querySelector('.arrow-up');
    
    container.classList.toggle('collapsed');
    arrowDown.style.display = container.classList.contains('collapsed') ? 'none' : 'block';
    arrowUp.style.display = container.classList.contains('collapsed') ? 'block' : 'none';
});
// Fungsi utama
async function loadAnimeData() {
  try {
    const response = await fetch(JSON_PATH);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error("Struktur JSON tidak valid!");
    }
    
    return data.data || [];
  } catch (error) {
    console.error("Error:", error);
    showNotification(`Gagal memuat data: ${error.message}`, "error");
    return [];
  }
}

function renderAnimeItems(data) {
  const animeList = document.querySelector('.anime-list');
  if (!animeList) return;
  
  animeList.innerHTML = data.map(anime => `
    <div class="anime-item">
      <a href="anime.html?slug=${anime.slug}">
        <img src="${anime.image}" alt="${anime.title}">
      </a>
      <a href="anime.html?slug=${anime.slug}"><span>${anime.title}</span></a>
      <button onclick="addToFavorites({
    title: '${anime.title.replace(/'/g, "\\'")}', 
    image: '${anime.image}', 
    slug: '${anime.slug}'
  })">Favorite</button>
    </div>
  `).join('');
}

function renderPagination() {
  const paginationContainer = document.querySelector('.pagination-container') || document.createElement('div');
  paginationContainer.className = 'pagination-container';
  
  paginationContainer.innerHTML = `
    <div class="pagination-controls">
      <button class="pagination-btn" id="prev-btn" ${currentPage === 1 ? 'disabled' : ''}>
        Previous
      </button>
      <span class="page-info">Halaman ${currentPage} dari ${totalPages}</span>
      <button class="pagination-btn" id="next-btn" ${currentPage === totalPages ? 'disabled' : ''}>
        Next
      </button>
    </div>
  `;

  if (!document.querySelector('.pagination-container')) {
    document.querySelector('main').appendChild(paginationContainer);
  }
}

function updateDisplay() {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  
  const sectionTitle = document.querySelector('.nama h2');
  if (selectedGenre) {
    sectionTitle.textContent = `Genre: ${selectedGenre}`;
  } else {
    sectionTitle.textContent = 'Anime Terbaru';
  }
  
  renderAnimeItems(filteredData.slice(start, end));
  renderPagination();
  window.scrollTo(0, 0);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
  document.querySelectorAll('.anime-item').forEach(item => item.remove());
  
  allAnimeData = await loadAnimeData();
  
  if (allAnimeData.length === 0) {
    showNotification("Tidak ada data anime yang ditemukan", "error");
    return;
  }
  
  filteredData = [...allAnimeData];
  totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  renderGenreFilters();
  updateDisplay();
  filterByGenre(null);
  renderGenreFilters();
  
  document.body.addEventListener('click', (e) => {
    if (e.target.id === 'prev-btn') {
      currentPage = Math.max(1, currentPage - 1);
      updateDisplay();
    }
    
    if (e.target.id === 'next-btn') {
      currentPage = Math.min(totalPages, currentPage + 1);
      updateDisplay();
    }
  });
});

document.getElementById('search-input').addEventListener('input', function(e) {
  const searchValue = e.target.value.toLowerCase();
  
  const baseData = selectedGenre ? 
    allAnimeData.filter(anime => anime.info.genres.includes(selectedGenre)) : 
    allAnimeData;
    
  filteredData = baseData.filter(anime => 
    anime.title.toLowerCase().includes(searchValue) ||
    anime.desc.toLowerCase().includes(searchValue)
  );
  
  currentPage = 1;
  totalPages = Math.ceil(filteredData.length / itemsPerPage);
  updateDisplay();
});

// Favorites System
function addToFavorites(anime) {
  let accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    showNotification("Silakan login terlebih dahulu!", "error");
    return;
  }

  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (favorites.some(fav => fav.slug === anime.slug)) {
    showNotification("Anime sudah ada di daftar favorit!", "info");
    return;
  }

  favorites.push(anime);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  showNotification("Anime berhasil ditambahkan ke favorit!", "success");
}

// Notification System
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = "0";
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}
