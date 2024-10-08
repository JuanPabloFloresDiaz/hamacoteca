let SEARCH_FORM;
// Constantes para completar las rutas de la API.
const PEDIDOS_API = 'servicios/privada/pedidos.php';
const DETALLE_PEDIDO_API = 'servicios/privada/detalles_pedidos.php';
let SAVE_MODAL,
    MODAL_TITLE;
let SAVE_FORM,
    ID_PEDIDO,
    ESTADO;
let DETAIL_MODAL,
    MODAL_TITLE_DETAIL;
let REPORT_MODAL,
    REPORT_MODAL_TITLE;

async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

let ROWS_FOUND;

const openDetail = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idPedido', id);
    // Se muestra la caja de diálogo con su título.
    DETAIL_MODAL.show();
    MODAL_TITLE_DETAIL.textContent = 'Detalle del pedido ' + id;
    cargarDetalle(FORM);
}


const lista_datos = [
    {
        estado: "Entregado",
        id: "Entregado",
    },
    {
        estado: 'En camino',
        id: 'En camino',
    },
    {
        estado: 'Cancelado',
        id: 'Cancelado',
    }
];

// Función para poblar un combobox (select) con opciones quemadas
const fillSelected = (data, action, selectId, selectedValue = null) => {
    const selectElement = document.getElementById(selectId);

    // Limpiar opciones previas del combobox
    selectElement.innerHTML = '';

    // Crear opción por defecto
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecciona a el estado';
    selectElement.appendChild(defaultOption);

    // Llenar el combobox con los datos proporcionados
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.estado; // Suponiendo que hay una propiedad 'id' en los datos
        option.textContent = item.estado; // Cambia 'horario' al nombre de la propiedad que deseas mostrar en el combobox
        selectElement.appendChild(option);
    });

    // Seleccionar el valor especificado si se proporciona
    if (selectedValue !== null) {
        selectElement.value = selectedValue;
    }
};

/*
*   Función asíncrona para cambiar el estado de un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openState = async (id) => {
    try {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idPedido', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(PEDIDOS_API, 'readOneList', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Actualizar estado';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_PEDIDO.value = ROW.ID;
            fillSelected(lista_datos, 'readAll', 'estado', ROW.ESTADO);
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar administrador';
    }

}


/*
*   Función asíncrona para calcular el numero de pedidos entregados
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/

const listapedidos = [
    {
        producto: 'Hamaca ligera',
        precio: 200,
        cantidad: 1,
        cliente: 'Joel Ramírez',
        descricpion: 'Este pedido por una hamaca ligera fue realizado y cotizado a las 22:40 del dia viernes 23 de febrero, Hamacoteca ofrece un servicio de calidad.',
        urlfoto: '../../../recursos/img/hamaca 3.jpg',
        direccion: 'San Salvador, Colonia Escalon',
        fecha: '2023-02-26',
        estado: 'Pendiente',
        id: 1
    },
    {
        producto: 'Hamaca ligera',
        precio: 200,
        cantidad: 1,
        cliente: 'Juan Pablo',
        descricpion: 'Este pedido por una hamaca ligera fue realizado y cotizado a las 13:28 del dia lunes 19 de febrero, Hamacoteca ofrece un servicio de calidad.',
        urlfoto: '../../../recursos/img/hamaca 3.jpg',
        direccion: 'San Salvador, Mejicanos',
        fecha: '2023-03-06',
        estado: 'Cancelado',
        id: 2
    },
    {
        producto: 'Hamaca ligera',
        precio: 200,
        cantidad: 1,
        cliente: 'Xochilt López',
        descricpion: 'Este pedido por una hamaca ligera fue realizado y cotizado a las 12:30 del dia jueves 15 de febrero, Hamacoteca ofrece un servicio de calidad.',
        urlfoto: '../../../recursos/img/hamaca 3.jpg',
        direccion: 'San Salvador, Colonia Escalon',
        fecha: '2023-03-26',
        estado: 'Entregado',
        id: 3
    },
];

async function cargarDetalle(form = null) {
    const cargarTabla = document.getElementById('tabla_detalle');

    try {
        cargarTabla.innerHTML = '';
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(DETALLE_PEDIDO_API, 'readOne', form);
        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            DATA.dataset.forEach(row => {
                const tablaHtml = `
            <tr>
                    <td><img src="${SERVER_URL}imagenes/hamacas/${row.FOTO}" height="50" width="50" class="circulo"></td>
                    <td>${row.PRODUCTO}</td>
                    <td>${row.CANTIDAD}</td>
                    <td>${row.PRECIO}</td>
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
        listapedidos.forEach(row => {
            const tablaHtml = `
            <tr">
                    <td><img src="${row.urlfoto}" height="50" width="50" class="circulo"></td>
                    <td>${row.producto}</td>
                    <td>${row.cantidad}</td>
                    <td>${row.precio}</td>
            </tr>
            `;
            cargarTabla.innerHTML += tablaHtml;
        });
    }
}

// Variables y constantes para la paginación
const pedidosPorPagina = 10;
let paginaActual = 1;
let pedidos = [];

// Función para cargar tabla de técnicos con paginación
async function cargarTabla(form = null) {
    const cargarTabla = document.getElementById('tabla_lista_pedidos');
    try {
        cargarTabla.innerHTML = '';
        // Petición para obtener los registros disponibles.
        let action;
        form ? action = 'searchList' : action = 'readAllList';
        console.log(form);
        const DATA = await fetchData(PEDIDOS_API, action, form);
        console.log(DATA);

        if (DATA.status) {
            pedidos = DATA.dataset;
            mostrarpedidos(paginaActual);
            // Se muestra un mensaje de acuerdo con el resultado.
            ROWS_FOUND.textContent = DATA.message;
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
    }
}

// Función para mostrar técnicos en una página específica
function mostrarpedidos(pagina) {
    const inicio = (pagina - 1) * pedidosPorPagina;
    const fin = inicio + pedidosPorPagina;
    const pedidosPagina = pedidos.slice(inicio, fin);

    const cargarTabla = document.getElementById('tabla_lista_pedidos');
    cargarTabla.innerHTML = '';
    pedidosPagina.forEach(row => {
        const tablaHtml = `
                <tr class="${getRowBackgroundColor(row.ESTADO)}">
                    <td><img src="${SERVER_URL}imagenes/clientes/${row.FOTO}" height="50" width="50" class="circulo"></td>
                    <td>${row.CLIENTE}</td>
                    <td>${row.DIRECCION}</td>
                    <td>${row.FECHA}</td>
                    <td class="${getRowColor(row.ESTADO)}">${row.ESTADO}</td>
                <td>
                        <button type="button" class="btn btn-outline-info" onclick="openDetail(${row.ID})">
                            <i class="bi bi-card-list"></i>
                        </button>
                        <button type="button" class="btn btn-outline-primary" onclick="openState(${row.ID})">
                        <i class="bi bi-exclamation-octagon"></i>
                        </button>
                </td>
                </tr>
        `;
        cargarTabla.innerHTML += tablaHtml;
    });

    actualizarPaginacion();
}

// Función para actualizar los controles de paginación
function actualizarPaginacion() {
    const paginacion = document.querySelector('.pagination');
    paginacion.innerHTML = '';

    const totalPaginas = Math.ceil(pedidos.length / pedidosPorPagina);

    if (paginaActual > 1) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-dark" href="#" onclick="cambiarPagina(${paginaActual - 1})">Anterior</a></li>`;
    }

    for (let i = 1; i <= totalPaginas; i++) {
        paginacion.innerHTML += `<li class="page-item ${i === paginaActual ? 'active' : ''}"><a class="page-link text-dark" href="#" onclick="cambiarPagina(${i})">${i}</a></li>`;
    }

    if (paginaActual < totalPaginas) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-dark" href="#" onclick="cambiarPagina(${paginaActual + 1})">Siguiente</a></li>`;
    }
}

// Función para cambiar de página
function cambiarPagina(nuevaPagina) {
    paginaActual = nuevaPagina;
    mostrarpedidos(paginaActual);
}

function getRowColor(estado) {
    switch (estado) {
        case 'En camino':
            return 'text-warning';
        case 'Cancelado':
            return 'text-danger';
        case 'Entregado':
            return 'text-success';
        default:
            return '';
    }
}

function getRowBackgroundColor(estado) {
    switch (estado) {
        case 'En camino':
            return 'border-warning';
        case 'Cancelado':
            return 'border-danger';
        case 'Entregado':
            return 'border-success';
        default:
            return '';
    }
}

function recharge() {
    checkOrders();
    totalProfits();
    cargarTabla();
}
let chartInstance = null;

async function openModalReport() {
    // Se muestra la caja de diálogo con su título.
    REPORT_MODAL.show();
    REPORT_MODAL_TITLE.textContent = 'Ventas por Categoría y Precio Promedio';
    try {
        // Petición para obtener los datos del gráfico.
        let DATA = await fetchData(DETALLE_PEDIDO_API, 'salesByCategoryAndAveragePrice');
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
        if (DATA.status) {
            // Se declaran los arreglos para guardar los datos a graficar.
            let data = [];
            let categorias = [];

            // Se recorre el conjunto de registros fila por fila a través del objeto row.
            DATA.dataset.forEach(row => {
                // Se agregan los datos a los arreglos.
                categorias.push(row.nombre_categoria);
                data.push(row.precio_promedio);
            });

            // Imprime los datos en la consola para depuración
            console.log(data);
            console.log(categorias);

            // Destruir la instancia existente del gráfico si existe
            if (chartInstance) {
                chartInstance.destroy();
                chartInstance = null; // Asegúrate de restablecer la referencia
            }

            // Restablecer el canvas en caso de que sea necesario
            const canvasContainer = document.getElementById('chart3').parentElement;
            canvasContainer.innerHTML = '<canvas id="chart3"></canvas>';
            // Llamada a la función para generar y mostrar un gráfico de pastel. Se encuentra en el archivo components.js
            chartInstance = DoughnutGraph('chart3', categorias, data, 'Ventas por Categoría y Precio Promedio');
        } else {
            console.log(DATA.error);
        }
    } catch (error) {
        console.log(error);
    }
}


// window.onload
window.onload = async function () {

    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');

    // Carga los componentes de manera síncrona
    const pedidosHtml = await loadComponent('../componentes/pedidos/lista_pedidos.html');
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = pedidosHtml;
    const theme = localStorage.getItem('theme'); // Obtener el tema desde localStorage

    if (theme === 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-bs-theme', 'light');
    }

    DETAIL_MODAL = new bootstrap.Modal('#detailModal'),
        MODAL_TITLE_DETAIL = document.getElementById('exampleModalLabel');
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');
    // Modal del reporte
    REPORT_MODAL = new bootstrap.Modal('#reportModal'),
        REPORT_MODAL_TITLE = document.getElementById('reportModalTitle');
    ROWS_FOUND = document.getElementById('rowsFound');
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
    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_PEDIDO = document.getElementById('idPedido'),
        ESTADO = document.getElementById('estado');
    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SAVE_FORM);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(PEDIDOS_API, 'changeState', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se cierra la caja de diálogo.
            SAVE_MODAL.hide();
            // Se muestra un mensaje de éxito.
            sweetAlert(1, DATA.message, true);
            // Se carga nuevamente la tabla para visualizar los cambios.
            cargarTabla();
        } else {
            sweetAlert(2, DATA.error, false);
            console.error(DATA.exception);
        }
    });
};
