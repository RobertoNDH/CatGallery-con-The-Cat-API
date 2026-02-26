const FAVORITES_KEY = 'cat_gallery_favs';

export const getFavorites = () => {
    const data = localStorage.getItem(FAVORITES_KEY);

    if (data) {
        return JSON.parse(data);
    }
    return [];
}

export const toggleFavorite = (cat) => {
    const favorites = getFavorites();

    const index = favorites.findIndex(fav => fav.id === cat.id);
    const alreadyExists = index !== -1;

    if (alreadyExists) {
        favorites.splice(index, 1);
    } else {
        favorites.push(cat);
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));

    return !alreadyExists;
}