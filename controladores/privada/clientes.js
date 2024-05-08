let SEARCH_FORM;
// Constantes para completar las rutas de la API.
const CLIENTES_API = 'servicios/privada/clientes.php';

async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}


/*
*   Función asíncrona para cambiar el estado de un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openState = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmUpdateAction('¿Desea cambiar el estado del cliente?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idCliente', id);
            console.log(id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(CLIENTES_API, 'changeState', FORM);
            console.log(DATA.status);
            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (DATA.status) {
                // Se muestra un mensaje de éxito.
                await sweetAlert(1, DATA.message, true);
                // Se carga nuevamente la tabla para visualizar los cambios.
                cargarTabla();
            } else {
                sweetAlert(2, DATA.error, false);
            }
        }
    }
    catch (Error) {
        console.log(Error + ' Error al cargar el mensaje');
    }

}


async function cargarTabla(form = null) {
    const lista_datos = [
        {
            imagen: '../../../recursos/img/mujer.jpg',
            nombre: 'Roxana',
            correo: 'roxy@gmail.com',
            telefono: '1234-5678',
            dui: '87654321-0',
            estado: '1980-01-27',
            id: 1,
        },
        {
            imagen: '../../../recursos/img/lisa.jpg',
            nombre: 'Lisa',
            correo: 'lalisa@gmail.com',
            telefono: '7549-3974',
            dui: '92848195-4',
            estado: '2004-09-09',
            id: 2,
        },
        {
            imagen: '../../../recursos/img/mujer.jpg',
            nombre: 'Patricia',
            correo: 'Paty@gmail.com',
            telefono: '3832-0584',
            dui: '82649264-5',
            estado: '1999-08-24',
            id: 3,
        },
        {
            imagen: '../../../recursos/img/lisa.jpg',
            nombre: 'Rumberta',
            correo: 'rumbi@gmail.com',
            telefono: '1963-7484',
            dui: '21846285-4',
            estado: '2006-12-31',
            id: 4,
        }
    ];
    const cargarTabla = document.getElementById('tabla_clientes');

    try {
        cargarTabla.innerHTML = '';
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(CLIENTES_API, action, form);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            DATA.dataset.forEach(row => {
                const tablaHtml = `
                <tr>
                    <td><img src="${SERVER_URL}imagenes/clientes/${row.FOTO}" height="50" width="50" class="circulo"></td>
                    <td>${row.NOMBRE}</td>
                    <td>${row.CORREO}</td>
                    <td>${row.TELEFONO}</td>
                    <td>${row.DUI}</td>
                    <td>${row.ESTADO}</td>
                    <td>
                    <button type="button" class="btn btn-outline-primary" onclick="openState(${row.ID})">
                    <i class="bi bi-exclamation-octagon"></i>
                    </button>
                    </td>
                </tr>
                `;
                cargarTabla.innerHTML += tablaHtml;
            });
        } else {
            sweetAlert(4, DATA.error, true);
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        // Mostrar materiales de respaldo
        lista_datos.forEach(row => {
            const tablaHtml = `
            <tr>
                <td><img src="${row.imagen}" height="50" width="50" class="circulo"></td>
                <td>${row.nombre}</td>
                <td>${row.correo}</td>
                <td>${row.telefono}</td>
                <td>${row.dui}</td>
                <td>${row.estado}</td>
                <td>
                <button type="button" class="btn btn-outline-primary" onclick="openUpdate(${row.id})">
                <i class="bi bi-exclamation-octagon"></i>
                </button>
                </td>
            </tr>
            `;
            cargarTabla.innerHTML += tablaHtml;
        });
    }
}


// window.onload
window.onload = async function () {

    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');

    // Carga los componentes de manera síncrona
    const clienteHtml = await loadComponent('../componentes/clientes/clientes.html');
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = clienteHtml;

    const theme = localStorage.getItem('theme'); // Obtener el tema desde localStorage

    if (theme === 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-bs-theme', 'light');
    }
    cargarTabla();
    // Constante para establecer el formulario de buscar.
    SEARCH_FORM = document.getElementById('searchForm');
    // Verificar si SEARCH_FORM está seleccionado correctamente
    console.log(SEARCH_FORM)
    // Método del evento para cuando se envía el formulario de buscar.
    SEARCH_FORM.addEventListener('submit', (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SEARCH_FORM);
        console.log(SEARCH_FORM);
        console.log(FORM);
        // Llamada a la función para llenar la tabla con los resultados de la búsqueda.
        cargarTabla(FORM);
    });
};
