let SAVE_MODAL;
let SAVE_FORM,
    ACTUAL_ADMINISTRADOR,
    CLAVE_ADMINISTRADOR,
    REPETIR_CLAVE;

// Constantes para completar las rutas de la API.
const ADMINISTRADOR_API = 'servicios/privada/administradores.php';

async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}


/*
*   Función para preparar el formulario al momento de cambiar la constraseña.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openPassword = () => {
    // Se abre la caja de diálogo que contiene el formulario.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Cambiar tu contraseña';
    // Se restauran los elementos del formulario.
    SAVE_FORM.reset();
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');

    // Carga los componentes de manera síncrona
    const adminHtml = await loadComponent('../componentes/configuracion/configuracion.html');
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = adminHtml;
    const theme = localStorage.getItem('theme'); // Obtener el tema desde localStorage

    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ACTUAL_ADMINISTRADOR = document.getElementById('claveActual'),
        CLAVE_ADMINISTRADOR = document.getElementById('claveAdministrador'),
        REPETIR_CLAVE = document.getElementById('repetirclaveAdministrador');

    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SAVE_FORM);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(ADMINISTRADOR_API, 'changePassword', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se cierra la caja de diálogo.
            SAVE_MODAL.hide();
            // Se muestra un mensaje de éxito.
            sweetAlert(1, DATA.message, true);
        } else {
            sweetAlert(2, DATA.error, false);
        }
    });

    if (theme === 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-bs-theme', 'light');
    }

    const switchInput = document.getElementById('flexSwitchCheckChecked');

    switchInput.addEventListener('change', function () {
        if (this.checked) {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    });

    function enableDarkMode() {
        document.documentElement.setAttribute('data-bs-theme', 'light');
        localStorage.setItem('theme', 'light');
        // Guardar el estado en localStorage o cookies si lo deseas
    }

    function disableDarkMode() {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        // Guardar el estado en localStorage o cookies si lo deseas
    }
};
