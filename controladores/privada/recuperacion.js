async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('recu');

    // Carga los componentes de manera síncrona
    const recuHtml = await loadComponent('/vistas/privada/componentes/recuperacion/recuperacion.html');
    // Agrega el HTML del encabezado
    appContainer.innerHTML = recuHtml;

};
