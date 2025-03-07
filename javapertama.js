function createSplashScreen() {
  // Cek apakah halaman utama ("My Anime"), kalau bukan, jangan buat splash
  if (!window.location.pathname.includes("index.html")) return null;

  const splashScreen = document.createElement("div");
  splashScreen.id = "myDynamicSplash";

  // Tambahkan container untuk konten
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

  // Create cube grid
  const cubeGrid = document.createElement("div");
  cubeGrid.className = "sk-cube-grid";
  for (let i = 1; i <= 9; i++) {
    const cube = document.createElement("div");
    cube.className = `sk-cube sk-cube${i}`;
    cubeGrid.appendChild(cube);
  }

  // Tambahkan elemen untuk pesan error
  const errorMessage = document.createElement("div");
  errorMessage.className = "network-status";

  contentWrapper.appendChild(title);
  contentWrapper.appendChild(cubeGrid);
  contentWrapper.appendChild(errorMessage);
  splashScreen.appendChild(contentWrapper);

  // Tambahkan style ke halaman
  const style = document.createElement("style");
  style.textContent = `
    #myDynamicSplash {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background: #181818;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      z-index: 9999;
      transition: opacity 0.5s ease;
    }

    .splash-title {
      font-size: 45px;
      margin-bottom: 2rem;
      display: flex;
      justify-content: center;
      position: relative;
    }

    .splash-title span {
      display: inline-flex;
      font-family: "Play", sans-serif;
      animation: title-bounce 2.5s infinite, fire 2s ease-in-out infinite alternate;
      margin: 0 3px;
      color: #ffa200;
      text-shadow: 0 0 10px #ff6b00;
    }

    @keyframes title-bounce {
      0%, 60%, 100% {
        transform: translateY(0) scale(1);
      }
      30% {
        transform: translateY(-25px) scale(1.15);
      }
    }

    @keyframes fire {
      0% { text-shadow: 0 0 10px #ff6b00, 0 0 20px #ff6b00, 0 0 30px #ff6b00; }
      100% { text-shadow: 0 0 20px #ff6b00, 0 0 40px #ff6b00, 0 0 50px #ff6b00; }
    }

    .sk-cube-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 5px;
      width: 40px;
      height: 40px;
      justify-content: center;
      align-items: center;
      margin: auto;
    }

    .sk-cube {
      width: 10px;
      height: 10px;
      background-color: #ffa200;
      animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out;
    }

    @keyframes sk-cubeGridScaleDelay {
      0%, 70%, 100% { transform: scale3D(1, 1, 1); }
      35% { transform: scale3D(0, 0, 1); }
    }

    .network-status {
      position: absolute;
      bottom: 20%;
      color: #ff5555;
      font-size: 1.2em;
      text-align: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .network-status.show {
      opacity: 1;
    }
  `;

  document.head.appendChild(style);
  document.body.prepend(splashScreen);

  return { splashScreen, errorMessage };
}

function initSplashScreen() {
  const splashData = createSplashScreen();
  if (!splashData) return; // Kalau bukan halaman "My Anime", langsung return

  const { splashScreen, errorMessage } = splashData;
  let isLoaded = false;

  const showNetworkError = (message) => {
    errorMessage.textContent = message;
    errorMessage.classList.add("show");
  };

  if (!navigator.onLine) {
    showNetworkError("Your connection is offline");
  }

  window.addEventListener("offline", () => {
    showNetworkError("Your connection is offline");
  });

  window.addEventListener("online", () => {
    errorMessage.classList.remove("show");
  });

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (connection && (connection.effectiveType === "slow-2g" || connection.effectiveType === "2g")) {
    showNetworkError("Poor network connection detected");
  }

  const hideSplash = () => {
    if (isLoaded) return;
    isLoaded = true;

    splashScreen.style.opacity = "0";
    splashScreen.addEventListener("transitionend", () => {
      splashScreen.remove();
      document.head.querySelector("style").remove();
    });
  };

  const loadTimeout = setTimeout(() => {
    if (!isLoaded) {
      showNetworkError("Taking longer than usual...");
    }
  }, 5000);

  window.addEventListener("load", () => {
    clearTimeout(loadTimeout);
    hideSplash();
  });
}

window.addEventListener("DOMContentLoaded", initSplashScreen);


const data = [
  "Seiken Gakuin no Makentsukai",
  "Nagasarete Airantou",
  "chiyu mahou no machigatta tsukaikata",
  "Chijou Saikyou no Yome",
  "Kouritsu Ebisugawa Koukou Tenmonbu",
  "ichigo 100%",
  "Otona no bouguya-san",
  "Shironeko Project: Zero Chronicle",
  "Sakura-sou no Pet na Kanojo",
  "Kusuriya no Hitorigoto",
  "Amagi Brilliant Park",
  "Midara na Ao-chan wa Benkyou ga Dekinai",
  "Asu no Yoichi!",
  "Bokura wa Minna Kawai-sou",
  "Busou Shoujo Machiavellianism",
  "Cheat Kusushi no Slow Life",
  "Danna ga Nani wo Itteiru ka Wakaranai Ken",
  "Denpa Onna to Seishun Otoko",
  "Kyuukyoku Shinka shita Full Dive RPG",
  "Full Metal Panic!",
  "Bokutachi no Remake",
  "Gamers!",
  "Aishen Qiaokeli-ing...",
  "ReLIFE",
  "Kotoura-san",
  "UQ Holder! Mahou Sensei Negima! 2",
  "Mahou Sensei Negima!",
  "Bucchigiri?!",
  "Seisen Cerberus: Ryuukoku no Fatalités",
  "Mairimashita! Iruma-kun",
  "Kimi wa Meido-sama.",
  "Dokyuu Hentai HxEros",
  "Toaru Ossan no VRMMO Katsudouki",
  "Jashin-chan Dropkick",
  "Rewrite",
  "Ladies versus Butlers!",
  "coba",
];

// Ambil elemen-elemen yang diperlukan
const searchInput = document.getElementById("search-input");
const animeItems = document.querySelectorAll(".anime-item");

// Event listener untuk pencarian
searchInput.addEventListener("keyup", function (event) {
  const searchValue = searchInput.value.toLowerCase();
  console.log("Searching for:", searchValue); // Debugging

  // Perulangan untuk semua elemen <div> dalam .anime-item
  animeItems.forEach(function (item, index) {
    if (index < data.length) {
      const animeTitle = data[index].toLowerCase();
      if (animeTitle.includes(searchValue)) {
        item.style.display = "block"; // Tampilkan elemen
      } else {
        item.style.display = "none"; // Sembunyikan elemen
      }
    }
  });
});

document.addEventListener("DOMContentLoaded", async function () {
  const searchInput = document.getElementById("search-input");
  const resultsContainer = document.querySelector("main"); // Elemen tempat menampilkan hasil

  if (searchInput) {
    const data = await fetchData(); // Ambil data dari Database.html
    console.log("Data fetched:", data);

    // Event listener untuk pencarian
    searchInput.addEventListener("keyup", function () {
      const searchValue = searchInput.value.toLowerCase();

      // Filter data berdasarkan pencarian
      const results = data.filter((item) =>
        item.toLowerCase().includes(searchValue)
      );

      // Tampilkan hasil pencarian
      resultsContainer.innerHTML = results
        .map(
          (anime) =>
            `<div class="anime-item">
               <span>${anime}</span>
             </div>`
        )
        .join("");
    });
  }
});
  
  function ShowAlert(event) {
    event.preventDefault();
    alert("maaf Masih dalam perbaikan!!");
  }
  
  // Menyimpan posisi scroll sebelum keluar halaman
  window.addEventListener("beforeunload", () => {
    sessionStorage.setItem("scrollPosition", window.scrollY);
  });
  
  // Mengembalikan posisi scroll saat halaman dimuat ulang
  window.addEventListener("load", () => {
    const savedPosition = sessionStorage.getItem("scrollPosition");
    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition, 10));
    }
  });
  
  document.querySelectorAll(".anime-item img").forEach((img) => {
    img.addEventListener("touchstart", () => {
      img.style.transform = "scale(1.4)";
    });
  
    img.addEventListener("touchend", () => {
      img.style.transform = "scale(1)";
    });
  });
  
  function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    // Kirim token ke backend (opsional) untuk validasi
  }
  const CLIENT_ID =
    "429779218315-26p4ufctrmdd18pbgv5irgk9mms2tl2u.apps.googleusercontent.com";
  const REDIRECT_URI = "https://ransyah21.github.io/-AniStream/";
  const menu = document.getElementById("menu");
  
  // Fungsi untuk login dengan Google
  function handleLogin() {
    const oauth2Url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email`;
    window.location.href = oauth2Url;
  }
  
  // Fungsi untuk logout
  function handleLogout() {
    localStorage.removeItem("access_token");
    window.location.reload();
  }
  
  // Fungsi untuk mendapatkan informasi pengguna
  async function getUserInfo(accessToken) {
    try {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch user info");
      return await response.json();
    } catch (error) {
      console.error("Error fetching user info:", error);
      return null;
    }
  }
  
  // Fungsi untuk memperbarui menu
  async function updateMenu() {
    console.log("Update menu dipanggil");
    console.log(localStorage.getItem("access_token"));
  
    const menu = document.getElementById("menu"); // Ganti dengan ID yang sesuai
    if (!menu) {
      console.error("Elemen menu tidak ditemukan!");
      return;
    }
  
    // Hapus menu sebelumnya
    menu.innerHTML = "";
  
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      const userInfo = await getUserInfo(accessToken);
      if (!userInfo || !userInfo.picture) {
        console.error("Gagal mengambil info pengguna");
        localStorage.removeItem("access_token");
        window.location.reload();
        return;
      }
  
      // Tambahkan menu untuk pengguna yang sudah login
      menu.innerHTML = `

        <li><a href="favorites.html">Favorites</a></li>
        <li>
          <a href="#" id="logout-btn" style="display: flex; align-items: center; text-decoration: none;">
            <div style="width: 30px; height: 30px; background: white; border-radius: 50%; border: 2px solid orange; display: flex; justify-content: center; align-items: center;">
              <img src="${userInfo.picture}" alt="Foto Profil" style="border-radius: 50%; width: 30px; height: 30px;">
            </div>
            <div style="margin-left: 10px;">
              <span>${userInfo.name}</span>
            </div>
          </a>
        </li>
        <li><a href="Full.html">FindNime</a></li>
      `;
  
      // Tambahkan event listener ke kedua tombol logout
      document.querySelectorAll("#logout-btn").forEach((btn) => {
        btn.addEventListener("click", handleLogout);
      });
    } else {
      // Tambahkan menu untuk pengguna yang belum login
      menu.innerHTML = `<li><a id="google-login-btn" href="#">Login</a></li>
      <li><a href="Full.html">FindNime</a></li>`;
      document
        .getElementById("google-login-btn")
        .addEventListener("click", handleLogin);
        console.log(typeof handleLogin);
    }
  }
  
  // Ambil access token dari URL
  function extractAccessToken() {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get("access_token");
    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
      history.replaceState(null, "", window.location.pathname); // Hapus access token dari URL
    }
  }
  
  // Jalankan saat halaman dimuat
  window.addEventListener("DOMContentLoaded", () => {
    extractAccessToken();
    updateMenu();
  });
  
  // Uji coba
  
  async function addToFavorites(animeTitle, animeImage) {
    // Cek apakah pengguna sudah login
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
        showNotification("Silakan login terlebih dahulu untuk menambahkan ke favorit.", "error");
        return; // Hentikan proses jika belum login
    }

    // Validasi token login dengan Google API (opsional)
    try {
        const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!response.ok) {
            throw new Error("Token login tidak valid atau telah kedaluwarsa.");
        }
    } catch (error) {
        console.error("Validasi login gagal:", error);
        showNotification("Silakan login ulang untuk melanjutkan.", "error");
        return;
    }

    // Proses menambahkan ke favorit
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    // Cek biar tidak ada duplikasi
    let isExist = favorites.some(anime => anime.title === animeTitle);
    if (!isExist) {
        favorites.push({ title: animeTitle, image: animeImage });
        localStorage.setItem("favorites", JSON.stringify(favorites));
        showNotification("Anime berhasil ditambahkan ke favorit!", "success");
    } else {
        showNotification("Anime sudah ada di daftar favorit!", "info");
    }
}

function showNotification(message, type) {
  const notification = document.getElementById("notification");
  if (!notification) {
      console.error("Elemen notifikasi tidak ditemukan.");
      return;
  }

  // Set pesan
  notification.textContent = message;

  // Ubah warna berdasarkan tipe
  if (type === "success") {
      notification.style.backgroundColor = "#28a745";
  } else if (type === "error") {
      notification.style.backgroundColor = "#dc3545";
  } else if (type === "info") {
      notification.style.backgroundColor = "#007bff";
  }

  notification.classList.add("visible");

  // Sembunyikan notifikasi setelah 3 detik
  setTimeout(() => {
      notification.classList.remove("visible");
  }, 3000);
}

// Theme management
const themeButtons = document.querySelectorAll('.theme-btn');
const body = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'default';
body.setAttribute('data-theme', savedTheme);

// Theme button click handler
themeButtons.forEach(button => {
  button.addEventListener('click', () => {
    const theme = button.dataset.theme;
    body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  });
});

// Logout function
document.getElementById('logout-btn').addEventListener('click', function(e) {
  e.preventDefault();
  // Logout logic here
  localStorage.removeItem('access_token');
  window.location.href = '/login';
});

// COOKIE

// Cookie Consent
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    const expires = "expires="+ d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i=0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
    }
    return null;
}

function showCookieConsent() {
    if (!getCookie('cookie_consent')) {
        document.getElementById('cookie-consent').style.display = 'block';
    }
}

document.getElementById('accept-cookies').addEventListener('click', function() {
    setCookie('cookie_consent', 'accepted', 30);
    document.getElementById('cookie-consent').style.display = 'none';
});

document.getElementById('customize-cookies').addEventListener('click', function() {
    // Tambahkan logika kustomisasi cookie jika diperlukan
    alert('Fitur kustomisasi cookie sedang dalam pengembangan');
});

// Panggil saat halaman dimuat
window.addEventListener('load', showCookieConsent);

function handleLogout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user_id');
  window.location.reload();
}

// Panggil initFavoriteButtons di halaman utama
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.favorite-btn')) {
      initFavoriteButtons();
  }
});

