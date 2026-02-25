const BASE_URL = 'https://api.thecatapi.com/v1/images/search';

export const fetchCats = async (limit = 9) => {
    try {
        const params = new URLSearchParams();
        params.append("limit", limit);
        params.append("order", "DESC");

        const requestUrl = `${BASE_URL}?${params.toString()}`;
        const response = await fetch(requestUrl);

        if (!response.ok) {
            throw new Error("No se pudo conectar con la API");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en la solicitud:", error.message);
        return [];
    }
}