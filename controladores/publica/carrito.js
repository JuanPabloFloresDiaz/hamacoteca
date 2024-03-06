/*async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('carrito');

    // Carga los componentes de manera síncrona
    const headerHtml = await loadComponent('../componentes/componentes_generales/barra_superior/barra_superior.html');
    const footerHtml = await loadComponent('../componentes/componentes_generales/barra_inferior/barra_inferior.html');
    // Agrega el HTML del encabezado
    appContainer.innerHTML += `${headerHtml}`;
    appContainer.innerHTML += `${footerHtml}`;

};*/


async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}


let SAVE_MODAL;
let SAVE_FORM;
// Constantes para completar las rutas de la API.
const PEDIDO_API = '';


/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el pedido de forma permanente?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('id_pedido', id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(PRODUCTO_API, 'deleteRow', FORM);
            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (DATA.status) {
                // Se muestra un mensaje de éxito.
                await sweetAlert(1, DATA.message, true);
                // Se carga nuevamente la tabla para visualizar los cambios.
                fillTable();
            } else {
                sweetAlert(2, DATA.error, false);
            }
        }
    }
    catch (Error) {
        console.log(Error + ' Error al cargar el mensaje');
        confirmAction('¿Desea eliminar el pedido de forma permanente?');
    }

}


async function cargarTabla() {
    const listahamacas = [
        {
            nombre_producto: 'Hamaca ligera',
            precio: 200,
            cantidad: 3,
            urlfoto: '../../../recursos/img/hamaca 3.jpg',
            id: 1
        },
        {
            nombre_producto: 'Hamaca estandar',
            precio: 300,
            cantidad: 3,
            urlfoto: '../../../recursos/img/hamaca1.png',
            id: 2
        },
        {
            nombre_producto: 'Hamaca grande',
            precio: 400,
            cantidad: 3,
            urlfoto: '../../../recursos/img/hamacaKsK 1.png',
            id: 3
        },
    ];
    const cargarTabla = document.getElementById('tabla_pedido');

    try {
        const response = await fetch(DATOS_TABLA_API);
        if (!response.ok) {
            throw new Error('Error al obtener los datos de la API');
        }
        const data = await response.json();

        if (data && Array.isArray(data) && data.length > 0) {
            // Mostrar elementos de la lista de materiales obtenidos de la API
            data.forEach(row => {
                const tablaHtml = `
                <tr>
                    <td><img src="${SERVER_URL}images/categorias/${row.imagen_hamaca}" height="50" width="50" class="circulo"></td>
                    <td>${row.nombre_hamaca}</td>
                    <td>${row.cantidad_hamaca}</td>
                    <td>${row.precio_hamaca}</td>
                    <td>
                        <button type="button" class="btn btn-danger" onclick="openDelete(${row.id_hamaca})">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </td>
                </tr>
                `;
                cargarTabla.innerHTML += tablaHtml;
            });
        } else {
            throw new Error('La respuesta de la API no contiene datos válidos');
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        // Mostrar materiales de respaldo
        listahamacas.forEach(row => {
            const tablaHtml = `
            <tr>
                <td><img src="${row.urlfoto}" height="50" width="50" class="circulo"></td>
                <td>${row.nombre_producto}</td>
                <td>${row.cantidad}</td>
                <td>${row.precio}</td>
                <td>
                    <button type="button" class="btn btn-outline-danger" onclick="openDelete(${row.id})">
                        <i class="bi bi-trash-fill"></i>
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
    const appContainer = document.getElementById('carrito');

    // Carga los componentes de manera síncrona
    // Carga los componentes de manera síncrona
    const headerHtml = await loadComponent('../componentes/componentes_generales/barra_superior/barra_superior.html');
    const adminHtml = await loadComponent('../componentes/carrito/carrito.html');
    const footerHtml = await loadComponent('../componentes/componentes_generales/barra_inferior/barra_inferior.html');
    // Agrega el HTML del encabezado
    appContainer.innerHTML = adminHtml + headerHtml;
    cargarTabla();
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');


};

