import './style.css';
import { fetchCats } from "./api.js";
import { getFavorites, toggleFavorite } from "./storage.js";

const gallery = document.querySelector("#gallery-container");
const btnLoadMore = document.querySelector("#btn-load-more");

const renderCats = (cats) => {
    const favorites = getFavorites();

    cats.forEach(cat => {
        const card = document.createElement("div");
        card.classList.add("cat-card");

        const img = document.createElement("img");
        img.src = cat.url;
        img.alt = "Imagen de un gato";
        img.loading = "lazy";

        const favBtn = document.createElement("button");
        favBtn.classList.add("fav-btn");

        const isFav = favorites.some(f => f.id === cat.id);
        if (isFav) {
            favBtn.classList.add("active");
        }

        favBtn.textContent = "❤️";

        favBtn.addEventListener("click", () => {
            const nowIsFavorite = toggleFavorite(cat);
            if (nowIsFavorite) {
                favBtn.classList.add("active");
            } else {
                favBtn.classList.remove("active");
            }
        })

        card.appendChild(img);
        card.appendChild(favBtn);
        gallery.appendChild(card);
    })
}

const init = async () => {
    const initialCats = await fetchCats(9);
    renderCats(initialCats);
}

btnLoadMore.addEventListener("click", async () => {
    btnLoadMore.disabled = true;
    btnLoadMore.textContent = "Cargando...";

    const moreCats = await fetchCats(9);
    renderCats(moreCats);

    btnLoadMore.disabled = false;
    btnLoadMore.textContent = "Cargar más";
})

init();