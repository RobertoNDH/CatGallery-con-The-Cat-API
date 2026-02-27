import './style.css';
import { fetchCats } from "./api.js";
import { getFavorites, toggleFavorite } from "./storage.js";

const gallery = document.querySelector("#gallery-container");
const btnLoadMore = document.querySelector("#btn-load-more");
const loader = document.querySelector('#loader');
const btnHome = document.querySelector('#btn-home');
const btnFavs = document.querySelector('#btn-favs');

let isShowingFavorites = false;

const toggleLoader = (isVisible) => {
  if (isVisible) {
    loader.classList.remove('hidden');
  } else {
    loader.classList.add('hidden');
  }
}

const clearGallery = () => {
  gallery.innerHTML = '';
}

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
                if (isShowingFavorites) {
                    card.remove();
                }
            }
        })

        card.appendChild(img);
        card.appendChild(favBtn);
        gallery.appendChild(card);
    })
}

const init = async () => {
    toggleLoader(true);
    const initialCats = await fetchCats(9);
    renderCats(initialCats);
    toggleLoader(false);
}

btnLoadMore.addEventListener("click", async () => {
    btnLoadMore.disabled = true;
    btnLoadMore.textContent = "Cargando...";

    const moreCats = await fetchCats(9);
    renderCats(moreCats);

    toggleLoader(false);
    btnLoadMore.disabled = false;
    btnLoadMore.textContent = "Cargar más";
})

btnFavs.addEventListener('click', () => {
  isShowingFavorites = true;
  btnFavs.classList.add('active');
  btnHome.classList.remove('active');
  btnLoadMore.classList.add('hidden'); 

  clearGallery();
  const favs = getFavorites();
  
  if (favs.length === 0) {
    gallery.innerHTML = '<p>No tienes favoritos todavía. ¡Ve a buscar gatos!</p>';
  } else {
    renderCats(favs);
  }
})

btnHome.addEventListener('click', async () => {
  isShowingFavorites = false;
  btnHome.classList.add('active');
  btnFavs.classList.remove('active');
  btnLoadMore.classList.remove('hidden');

  clearGallery();
  toggleLoader(true);
  const freshCats = await fetchCats(9);
  renderCats(freshCats);
  toggleLoader(false);
})

let isLoading = false;

const loadMoreCats = async () => {
  if (isLoading) return;

  isLoading = true;
  btnLoadMore.disabled = true;
  btnLoadMore.textContent = 'Cargando más...';
  toggleLoader(true);

  const newCats = await fetchCats(9);
  
  if (newCats.length > 0) {
    renderCats(newCats);
  }

  toggleLoader(false);
  btnLoadMore.disabled = false;
  btnLoadMore.textContent = 'Ver más gatitos';
  isLoading = false;
}

const handleScroll = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      if (!isLoading) {
        if (!isShowingFavorites) {
            setTimeout(async () => {
            if (!isLoading) {
              await loadMoreCats();
            }
          }, 600)
        }
      }
    }
  })
}

const scrollObserver = new IntersectionObserver(handleScroll, {
  root: null,
  rootMargin: '0px', 
  threshold: 1.0 
})

if (btnLoadMore) {
  scrollObserver.observe(btnLoadMore);
  btnLoadMore.addEventListener('click', loadMoreCats);
}

init();