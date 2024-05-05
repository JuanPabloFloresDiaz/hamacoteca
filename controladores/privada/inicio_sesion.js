// Constante para establecer el formulario de inicio de sesión.
let LOGIN_FORM;
// Constante para completar la ruta de la API.
const USER_API = 'servicios/privada/administradores.php';

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

    // Petición para consultar los usuarios registrados.
    const DATA = await fetchData(USER_API, 'readUsers');
    // Se comprueba si existe una sesión, de lo contrario se sigue con el flujo normal.
    if (DATA.session) {
        // Se direcciona a la página web de bienvenida.
        location.href = 'dashboard.html';
    } else if (DATA.status) {
        // Se mantiene en el login.
        console.log('Formulario para iniciar sesión');
        LOGIN_FORM = document.getElementById('loginForm');
        // Método del evento para cuando se envía el formulario de inicio de sesión.
        LOGIN_FORM.addEventListener('submit', async (event) => {
            // Se evita recargar la página web después de enviar el formulario.
            event.preventDefault();
            // Constante tipo objeto con los datos del formulario.
            const FORM = new FormData(LOGIN_FORM);
            try {
                // Petición para iniciar sesión.
                const DATA = await fetchData(USER_API, 'logIn', FORM);
                console.log(DATA);
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (DATA.status) {
                    sweetAlert(1, DATA.message, true, 'dashboard.html');
                } else {
                    sweetAlert(2, DATA.error, false);
                    console.log(DATA.exception);
                }
            } catch {
                sweetAlert(2, "No se detecta un usuario", false);
            }
        });

    } else {
        // Se direcciona a la página web del primer uso.
        location.href = 'primer_uso.html';
        sweetAlert(4, DATA.error, true);
    }
};
