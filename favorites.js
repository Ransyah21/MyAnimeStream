function removeFromFavorites(slug) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Filter anime yang mau dihapus
    favorites = favorites.filter(anime => anime.slug !== slug);

    // Simpan lagi ke localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));

    // Update tampilan setelah hapus
    renderFavorites();  

    // Tampilkan notifikasi
    showNotification("Anime berhasil dihapus dari favorit!", "success");
}

// Fungsi render ulang daftar favorit
function renderFavorites() {
    const container = document.getElementById('favorites-container');
    container.innerHTML = ''; // Hapus konten lama

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.length === 0) {
        container.innerHTML = "<p>Belum ada anime favorit.</p>";
        return;
    }

    favorites.forEach(anime => {
        const animeItem = document.createElement('div');
        animeItem.className = 'anime-card';
        animeItem.innerHTML = `
            <img src="${anime.image}" alt="${anime.title}">
            <p>${anime.title}</p>
            <a href="anime.html?slug=${anime.slug}" class="btn-streaming">Lihat Detail</a>
            <button onclick="removeFromFavorites('${anime.slug}')">Hapus</button>
        `; 
        container.appendChild(animeItem);
    });
}

// Panggil pas halaman favorit dibuka
document.addEventListener('DOMContentLoaded', renderFavorites);

function renderFavorites() {
    const container = document.getElementById("favorites-container");
    container.innerHTML = ""; // Bersihin dulu

    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    favorites.forEach(anime => {
        if (!anime.image || !anime.title || !anime.slug) {
            console.warn("Data anime tidak valid:", anime);
            return; // Skip kalau ada yang kosong
        }

        const animeItem = document.createElement('div');
        animeItem.className = 'anime-card';
        animeItem.innerHTML = `
            <img src="${anime.image}" alt="${anime.title}">
            <p>${anime.title}</p>
            <a href="anime.html?slug=${anime.slug}" class="btn-streaming">Lihat Detail</a>
            <button onclick="removeFromFavorites('${anime.slug}')">Hapus</button>
        `;
        container.appendChild(animeItem);
    });
}
