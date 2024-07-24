let SEARCH_FORM;
// Constantes para completar las rutas de la API.
const PEDIDOS_API = 'servicios/privada/pedidos.php';
const DETALLE_PEDIDO_API = 'servicios/privada/detalles_pedidos.php';
let SAVE_MODAL,
    MODAL_TITLE;
let REPORT_MODAL,
    REPORT_MODAL_TITLE;
let SAVE_FORM,
    ID_PEDIDO,
    ESTADO;
let DETAIL_MODAL,
    MODAL_TITLE_DETAIL;
let REPORT_FORM,
    FECHA_PEDIDO,
    FECHA_PEDIDO_FINAL;
let GRAPHIC_MODAL;

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

const openGraphic = () => {
    // Se muestra la caja de diálogo con su título.
    GRAPHIC_MODAL.show();
    MODAL_TITLE_GRAPHIC.textContent = 'Gráfica predictiva de productos mas vendidos del mes';
    cargarGraficaLinealPredicticion();
    cargarGraficaLineal();
    console.log(localStorage.getItem('graficaPrediccion'));
    console.log(localStorage.getItem('graficaVentas'));
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Función para cargar la gráfica lineal predictiva
const cargarGraficaLinealPredicticion = async () => {
    try {
        const DATA = await fetchData(DETALLE_PEDIDO_API, 'profitsForDatePrediction');
        if (DATA.status) {
            let fecha = [];
            let ganancias = [];
            DATA.dataset.forEach(row => {
                fecha.push(`${row.MES} ${row.AÑO}`);
                ganancias.push(row.GANANCIAS);
            });
            lineGraph('prediccion', fecha, ganancias, 'Ganancias por mes $', 'Predicción de ganancias del siguiente año');
            await delay(500);
            const canvas = document.getElementById('prediccion');
            if (canvas) {
                // Verificar que el canvas tiene contenido
                console.log(canvas.toDataURL('image/png')); // Esto debería mostrar una cadena de base64
                const imgURL = canvas.toDataURL('image/png');
                localStorage.setItem('graficaPrediccion', imgURL);
                console.log(`graficaPrediccion:`, imgURL);
            } else {
                console.log(`Canvas con ID ${canvas} no encontrado.`);
            }
            /* const imgURL = canvas.toDataURL('image/png');
            localStorage.setItem('graficaPrediccion', imgURL);
            console.log('Grafica Prediccion:', imgURL); */
        } else {
            document.getElementById('prediccion').remove();
            console.log(DATA.error);
        }
    } catch (error) {
        console.log('Error:', error);
    }
}

// Función para cargar la gráfica lineal
const cargarGraficaLineal = async () => {
    try {
        const DATA = await fetchData(DETALLE_PEDIDO_API, 'profitsForDate');
        if (DATA.status) {
            let fecha = [];
            let ganancias = [];
            DATA.dataset.forEach(row => {
                fecha.push(`${row.MES} ${row.AÑO}`);
                ganancias.push(row.GANANCIAS);
            });
            lineGraph('ventas', fecha, ganancias, 'Ganancias por mes $', 'Gráfica de ganancias historicas');
            await delay(500);
            const canvas = document.getElementById('ventas');
            if (canvas) {
                // Verificar que el canvas tiene contenido
                console.log(canvas.toDataURL('image/png')); // Esto debería mostrar una cadena de base64
                const imgURL = canvas.toDataURL('image/png');
                localStorage.setItem('graficaVentas', imgURL);
                console.log(`graficaVentas:`, imgURL);
            } else {
                console.log(`Canvas con ID ${canvas} no encontrado.`);
            }
            /* const imgURL = canvas.toDataURL('image/png');
            localStorage.setItem('graficaVentas', imgURL);
            console.log('Grafica Ventas:', imgURL); */
        } else {
            document.getElementById('ventas').remove();
            console.log(DATA.error);
        }
    } catch (error) {
        console.log('Error:', error);
    }
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
        const DATA = await fetchData(PEDIDOS_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            // Se prepara el formulario.
            SAVE_FORM.reset();
            MODAL_TITLE.textContent = 'Actualizar estado';
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

async function checkOrders() {
    try {
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(PEDIDOS_API, 'checkOrders');
        console.log(DATA);

        if (DATA.status) {
            // Accede al primer elemento del array dataset y luego obtén el valor TOTAL
            const totalPedidos = DATA.dataset[0].TOTAL;
            document.getElementById('numero').textContent = totalPedidos;
        } else {
            sweetAlert(4, DATA.error, true);
        }
    } catch (error) {
        console.error('Error al obtener datos de la API: ', error);
    }
}

async function totalProfits() {
    try {
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(PEDIDOS_API, 'totalProfits');
        console.log(DATA);

        if (DATA.status) {
            // Accede al primer elemento del array dataset y luego obtén el valor TOTAL
            const totalPedidos = DATA.dataset[0].TOTAL;
            document.getElementById('ganancias').textContent = "$" + totalPedidos + "💵";
        } else {
            sweetAlert(4, DATA.error, true);
        }
    } catch (error) {
        console.error('Error al obtener datos de la API: ', error);
    }
}

async function openModalReport() {
    // Se muestra la caja de diálogo con su título.
    REPORT_MODAL.show();
    REPORT_MODAL_TITLE.textContent = 'Reporte de pedidos entregados por fecha';
}

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
    const cargarTabla = document.getElementById('tabla_pedidos');
    try {
        cargarTabla.innerHTML = '';
        // Petición para obtener los registros disponibles.
        let action;
        form ? action = 'searchRows' : action = 'readAll';
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

    const cargarTabla = document.getElementById('tabla_pedidos');
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
        case 'Pendiente':
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
        case 'Pendiente':
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

/*
*   Función para abrir un reporte parametrizado de productos de una categoría.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openReport = () => {
    // Obtener los valores de las fechas.
    const fechaInicio = FECHA_PEDIDO.value;
    const fechaFin = FECHA_PEDIDO_FINAL.value;

    // Verificar si las fechas son válidas.
    if (new Date(fechaInicio) > new Date(fechaFin)) {
        sweetAlert(2, 'La fecha de inicio no puede ser mayor que la fecha final.', true);
        return;
    }

    // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
    const PATH = new URL(`${SERVER_URL}reportes/privada/pedidos_entregados_por_fecha.php`);

    console.log(fechaInicio);
    console.log(fechaFin);

    // Se agrega un parámetro a la ruta con el valor del registro seleccionado.
    PATH.searchParams.append('fecha', fechaInicio);
    PATH.searchParams.append('fechaFin', fechaFin);

    // Se abre el reporte en una nueva pestaña.
    window.open(PATH.href);
}


// window.onload
window.onload = async function () {

    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');

    // Carga los componentes de manera síncrona
    const pedidosHtml = await loadComponent('../componentes/pedidos/historial_pedidos.html');
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = pedidosHtml;
    const theme = localStorage.getItem('theme'); // Obtener el tema desde localStorage

    if (theme === 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-bs-theme', 'light');
    }

    GRAPHIC_MODAL = new bootstrap.Modal('#graphicModal'),
        MODAL_TITLE_GRAPHIC = document.getElementById('modalTitle3')
    DETAIL_MODAL = new bootstrap.Modal('#detailModal'),
        MODAL_TITLE_DETAIL = document.getElementById('exampleModalLabel');
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');
    REPORT_MODAL = new bootstrap.Modal('#reportModal'),
        REPORT_MODAL_TITLE = document.getElementById('reportModalTitle');
    recharge();
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
    ROWS_FOUND = document.getElementById('rowsFound');
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
            recharge();
        } else {
            sweetAlert(2, DATA.error, false);
            console.error(DATA.exception);
        }
    });
    // Constantes para establecer los elementos del formulario de guardar.
    REPORT_FORM = document.getElementById('saveForm'),
        FECHA_PEDIDO = document.getElementById('fecha'),
        FECHA_PEDIDO_FINAL = document.getElementById('fechaFinal');
};
