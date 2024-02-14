async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('dashboard');

    // Carga los componentes de manera síncrona
    const navbarHtml = await loadComponent('/vistas/privada/componentes/componentes_generales/menu_desplegable/barra_superior.html');
    // Agrega el HTML del encabezado
    appContainer.innerHTML = navbarHtml;

};
