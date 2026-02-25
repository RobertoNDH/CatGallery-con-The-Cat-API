import './style.css';
import { fetchCats } from "./api.js";

const init = async () => {
    console.log("Solicitando datos de gatos...");

    const cats = await fetchCats(9);

    if (cats.length > 0) {
        console.log("Datos de gatos recibidos!");
        console.table(cats);
    } else {
        console.warn("No se recibieron datos de gatos.");
    }
}

init();
