async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

// Constantes para completar las rutas de la API.
const API = 'servicios/recuperacion/recuperacion.php';

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('recu');

    // Carga los componentes de manera síncrona
    const recuHtml = await loadComponent('../componentes/recuperacion/recuperacion.html');
    // Agrega el HTML del encabezado
    appContainer.innerHTML = recuHtml;

    const BOTON = document.getElementById('boton');
    const INPUT1 = document.getElementById('email');

    BOTON.addEventListener('click', async (event) => {
        if (INPUT1.value === '') {
            sweetAlert(2, 'El campo del correo no puede estar vacío.', false);
            return false;
        }
            event.preventDefault();
            
            const fechaActualUTC = new Date();
            const FORM = new FormData();
            FORM.append('correo', INPUT1.value);
            FORM.append('nivel', 1);
            FORM.append('fecha', fechaActualUTC);
            const DATA = await fetchData(API, 'envioCorreo', FORM);
            if (DATA.status) {
                sweetAlert(1, DATA.message, true);
            } else {
                sweetAlert(2, DATA.error, false);
                console.error(DATA.exception);
            }
    });

};
