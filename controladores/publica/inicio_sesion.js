// Constante para establecer el formulario de iniciar sesión.
let SESSION_FORM;

async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    loadTemplate();
    // Carga los componentes de manera síncrona
    const navbarHtml = await loadComponent('../componentes/inicio_de_sesion/inicio_de_sesion.html');
    // Agrega el HTML del encabezado
    appContainer.innerHTML = navbarHtml;

    SESSION_FORM = document.getElementById('loginForm');

    // Método del evento para cuando se envía el formulario de iniciar sesión.
    SESSION_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SESSION_FORM);
        // Petición para determinar si el cliente se encuentra registrado.
        const DATA = await fetchData(USER_API, 'logIn', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        try{
            if (DATA.status) {
                sweetAlert(1, DATA.message, true, 'index.html');
            } else {
                sweetAlert(2, DATA.error, false);
            }
        }catch{
            sweetAlert(2, "No se detecta un usuario", false);
        }
    });

};
