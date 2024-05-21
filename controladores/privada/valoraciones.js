let SEARCH_FORM;
// Constantes para completar las rutas de la API.
const VALORACIONES_API = 'servicios/privada/valoraciones.php';

let ROWS_FOUND;

async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/

const openState = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmUpdateAction('¿Desea cambiar el estado del comentario?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idValoracion', id);
            console.log(id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(VALORACIONES_API, 'changeState', FORM);
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
            producto: 'Hamaca de tela',
            comentario: '¡Me encanta mi nueva hamaca! Es muy cómoda y resistente. La calidad del tejido es excelente y los colores son hermosos. Definitivamente recomendaría este producto a cualquiera que esté buscando una hamaca de calidad.',
            fecha: '2024-01-27',
            estado: 'bloqueado',
            id: 1,
        },
        {
            imagen: '../../../recursos/img/lisa.jpg',
            nombre: 'Lisa',
            producto: 'Hamaca de color rojo',
            comentario: 'I am neither happy nor dissatisfied, they gave me what I expected',
            fecha: '2024-02-16',
            estado: 'bloqueado',
            id: 2,
        },
        {
            imagen: '../../../recursos/img/mujer.jpg',
            nombre: 'Rumberta',
            producto: 'Hamaca de red',
            comentario: 'No estoy contento con mi compra. La hamaca que recibí no coincide con la descripción en el sitio web. La calidad del material es pobre y se ve muy frágil. Además, el proceso de entrega fue lento y la comunicación con el vendedor fue deficiente.',
            fecha: '2024-02-29',
            estado: 'bloqueado',
            id: 3,
        },
    ];
    const cargarTabla = document.getElementById('tabla_valoracion');

    try {
        cargarTabla.innerHTML = '';
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(VALORACIONES_API, action, form);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar elementos de la lista obtenidos de la API
            DATA.dataset.forEach(row => {
                const tablaHtml = `
                <tr class="${getRowBackgroundColor(row.ESTADO)}">
                    <td><img src="${SERVER_URL}imagenes/clientes/${row.IMAGEN}" height="50" width="50" class="circulo"></td>
                    <td>${row.NOMBRE}</td>
                    <td>${row.PRODUCTO}</td>
                    <td>${row.COMENTARIO}</td>
                    <td>${row.CALIFICACIÓN}</td>
                    <td class="${getRowColor(row.ESTADO)}">${row.ESTADO}</td>
                    <td>
                    <button type="button" class="btn btn-outline-primary" onclick="openState(${row.ID})">
                    <i class="bi bi-exclamation-octagon"></i>
                    </button>
                    </td>
                </tr>
                `;
                cargarTabla.innerHTML += tablaHtml;
                // Se muestra un mensaje de acuerdo con el resultado.
                ROWS_FOUND.textContent = DATA.message;
            });
        } else {
            const tablaHtml = `
            <tr class="border-danger">
                <td class="text-danger">${DATA.error}</td>
            </tr>
            `;
            cargarTabla.innerHTML += tablaHtml;
            // Se muestra un mensaje de acuerdo con el resultado.
            ROWS_FOUND.textContent = "Existen 0 coincidencias";
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        // Mostrar materiales de respaldo
        lista_datos.forEach(row => {
            const tablaHtml = `
            <tr>
                <td><img src="${row.imagen}" height="50" width="50" class="circulo"></td>
                <td>${row.nombre}</td>
                <td>${row.producto}</td>
                <td>${row.comentario}</td>
                <td>${row.fecha}</td>
                <td>${row.estado}</td>
                <td>
                <button type="button" class="btn btn-outline-primary" onclick="openState(${row.id})">
                <i class="bi bi-exclamation-octagon"></i>
                </button>
                </td>
            </tr>
            `;
            cargarTabla.innerHTML += tablaHtml;
        });
    }
}


function getRowColor(estado) {
    switch (estado) {
        case 'Bloqueado':
            return 'text-danger';
        case 'Activo':
            return 'text-success';
        default:
            return '';
    }
}

function getRowBackgroundColor(estado) {
    switch (estado) {
        case 'Bloqueado':
            return 'border-danger';
        case 'Activo':
            return 'border-success';
        default:
            return '';
    }
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los componentes de manera síncrona
    const valoracionHtml = await loadComponent('../componentes/valoraciones/valoraciones.html');
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = valoracionHtml;
    cargarTabla();
    ROWS_FOUND = document.getElementById('rowsFound');
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
