// Constante para establecer el formulario de inicio de sesión.
let LOGIN_FORM;
// Constante para completar la ruta de la API.
const USER_API = 'services/admin/administrador.php';

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
    LOGIN_FORM = document.getElementById('loginForm');
    // Método del evento para cuando se envía el formulario de inicio de sesión.
    LOGIN_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(LOGIN_FORM);
        // Petición para iniciar sesión.
        const DATA = await fetchData(USER_API, 'logIn', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            sweetAlert(1, DATA.message, true, 'dashboard.html');
        } else {
            sweetAlert(2, DATA.error, false);
        }
    });
};
