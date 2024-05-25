// Función asincrónica para cargar componentes
async function loadComponent(path) {
    // Realiza una solicitud para obtener el componente
    const response = await fetch(path);
    // Obtiene el texto del componente
    const text = await response.text();
    // Retorna el texto del componente
    return text;
}

// Acción cuando se carga la ventana
window.onload = async function () {
    // Obtiene el contenedor principal donde se cargará el componente
    const appContainer = document.getElementById('main');
    // Carga el componente HTML de cambio de contraseña de manera asincrónica
    const cambiarcontraHtml = await loadComponent('../componentes/recuperacion/cambiar_contra.html');
    // Agrega el HTML del componente al contenedor principal
    appContainer.innerHTML = cambiarcontraHtml;
};
