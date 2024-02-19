async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');

    // Carga los componentes de manera síncrona
    const navbarHtml = await loadComponent('../componentes/inicio_de_sesion/inicio_de_sesion.html');
    // Agrega el HTML del encabezado
    appContainer.innerHTML = navbarHtml;

};
