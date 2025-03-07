document.addEventListener("DOMContentLoaded", function() {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let container = document.getElementById("favorites-container");

    if (favorites.length === 0) {
        container.innerHTML = "<p>Belum ada anime favorit.</p>";
        return;
    }

    favorites.forEach((anime, index) => {
        let animeElement = document.createElement("div");
        animeElement.classList.add("anime-card");
        animeElement.innerHTML = `
            <img src="${anime.image}" alt="${anime.title}">
            <p>${anime.title}</p>
            <button onclick="removeFromFavorites(${index})">Hapus</button>
        `;
        container.appendChild(animeElement);
    });
});

// Fungsi buat hapus anime favorit
function removeFromFavorites(index) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    location.reload(); // Refresh biar langsung ke-update
}
