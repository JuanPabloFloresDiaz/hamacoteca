async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('cambiarcontra');

    // Carga los componentes de manera síncrona
    const cambiarcontraHtml = await loadComponent('../componentes/recuperacion/cambiarcontra.html');
    // Agrega el HTML del encabezado
    appContainer.innerHTML = cambiarcontraHtml;

};
