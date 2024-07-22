async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}


let SAVE_MODAL;
let SAVE_FORM,
    ID_PEDIDO,
    CANTIDAD_PEDIDO;
// Constantes para completar las rutas de la API.
let PEDIDO_API = 'servicios/publica/pedido.php';

let ROWS_FOUND;

/*
*   Función para abrir la caja de diálogo con el formulario de cambiar cantidad de producto.
*   Parámetros: id (identificador del producto) y quantity (cantidad actual del producto).
*   Retorno: ninguno.
*/
const openUpdate = async (id, quantity) => {
    // Se abre la caja de diálogo que contiene el formulario.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Actualizar pedido'
    // Se inicializan los campos del formulario con los datos del registro seleccionado.
    document.getElementById('idPedido').value = id;
    document.getElementById('cantidad').value = quantity;
}

//const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
/*
*   Función asíncrona para mostrar un mensaje de confirmación al momento de finalizar el pedido.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
async function finishOrder() {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Está seguro de finalizar el pedido?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Petición para finalizar el pedido en proceso.
        const DATA = await fetchData(PEDIDO_API, 'finishOrder');
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
            const PATH = new URL(`${SERVER_URL}reportes/publica/factura_de_comprobante_de_compra.php`);
            // Se abre el reporte en una nueva pestaña.
            window.open(PATH.href);
            sweetAlert(1, DATA.message, false, 'index.html');
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
}


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
            FORM.append('idPedido', id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(PEDIDO_API, 'deleteDetail', FORM);
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
    const listapedido = [
        {
            nombre_producto: 'Hamaca ligera',
            precio: 200,
            cantidad: 3,
            urlfoto: '../../../recursos/img/hamaca 3.jpg',
            total: 600,
            id: 1
        },
        {
            nombre_producto: 'Hamaca estándar',
            precio: 300,
            cantidad: 3,
            urlfoto: '../../../recursos/img/hamaca1.png',
            total: 900,
            id: 2
        },
        {
            nombre_producto: 'Hamaca grande',
            precio: 400,
            cantidad: 3,
            urlfoto: '../../../recursos/img/hamacaKsK 1.png',
            total: 1200,
            id: 3
        },
    ];
    const cargarTabla = document.getElementById('tabla_pedido');

    try {
        cargarTabla.innerHTML = '';
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(PEDIDO_API, 'readDetail', form);
        console.log(DATA);

        if (DATA.session) {
            if (DATA.status) {

                // Se declara e inicializa una variable para calcular el importe por cada producto.
                let subtotal = 0;
                // Se declara e inicializa una variable para sumar cada subtotal y obtener el monto final a pagar.
                let total = 0;
                // Mostrar elementos de la lista de materiales obtenidos de la API
                DATA.dataset.forEach(row => {
                    subtotal = row.PRECIO * row.CANTIDAD;
                    total += subtotal;
                    const tablaHtml = `
                    <tr>
                        <td><img src="${SERVER_URL}imagenes/hamacas/${row.IMAGEN}" height="50" width="50" class="circulo"></td>
                        <td>${row.NOMBRE}</td>
                        <td>${row.CANTIDAD}</td>
                        <td>${row.PRECIO}</td>
                        <td>${row.TOTAL}</td>
                        <td>
                            <button type="button" class="btn btn-outline-success borde-transparente" onclick="openUpdate(${row.ID}, ${row.CANTIDAD})">
                                <i class="bi bi-plus-slash-minus"></i>
                            </button>
                            <button type="button" class="btn btn-outline-danger borde-transparente" onclick="openDelete(${row.ID})">
                                <i class="bi bi-trash-fill"></i>
                            </button>
                        </td>
                    </tr>
                    `;
                    cargarTabla.innerHTML += tablaHtml;
                    // Se muestra un mensaje de acuerdo con el resultado.
                    ROWS_FOUND.textContent = DATA.message;
                    document.getElementById('pago').textContent = total.toFixed(2);
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
        }
        else {
            sweetAlert(3, DATA.error, true, 'inicio_sesion.html');
        }


    } catch (error) {
        sweetAlert(3, "Debe iniciar sesión para ver el carrito", true, 'inicio_sesion.html');
    }
}


// window.onload
window.onload = async function () {

    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    loadTemplate();

    // Carga los componentes de manera síncrona
    const adminHtml = await loadComponent('../componentes/carrito/carrito.html');
    // Agrega el HTML del encabezado
    appContainer.innerHTML = adminHtml;
    cargarTabla();
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_PEDIDO = document.getElementById('idPedido'),
        CANTIDAD_PEDIDO = document.getElementById('cantidad');

    ROWS_FOUND = document.getElementById('rowsFound');

    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SAVE_FORM);
        // Petición para actualizar la cantidad de producto.
        const DATA = await fetchData(PEDIDO_API, 'updateDetail', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se actualiza la tabla para visualizar los cambios.
            cargarTabla();
            // Se cierra la caja de diálogo del formulario.
            SAVE_MODAL.hide();
            // Se muestra un mensaje de éxito.
            sweetAlert(1, DATA.message, true);

        } else {
            sweetAlert(2, DATA.error, false);
        }
    });


};

