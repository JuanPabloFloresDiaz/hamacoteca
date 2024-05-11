let SEARCH_FORM;
// Constantes para completar las rutas de la API.
const PEDIDOS_API = '';
let DETAIL_MODAL,
    MODAL_TITLE_DETAIL;

async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}


const openDetail = async (id) => {
    // Se muestra la caja de diálogo con su título.
    DETAIL_MODAL.show();
    MODAL_TITLE_DETAIL.textContent = 'Detalle del pedido ' + id;
    cargarDetalle();
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
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(PEDIDOS_API, action, form);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            DATA.dataset.forEach(row => {
                const tablaHtml = `
            <tr>
                    <td>${row.FOTO}</td>
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
                    <td>${row.fecha}</td>
                    <td>${row.precio}</td>
            </tr>
            `;
            cargarTabla.innerHTML += tablaHtml;
        });
    }
}

async function cargarTabla(form = null) {
    const cargarTabla = document.getElementById('tabla_pedidos');

    try {
        cargarTabla.innerHTML = '';
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(PEDIDOS_API, action, form);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            DATA.dataset.forEach(row => {
                const tablaHtml = `
                <tr class="${getRowBackgroundColor(row.ESTADO)}">
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
        } else {
            sweetAlert(4, DATA.error, true);
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        // Mostrar materiales de respaldo
        listapedidos.forEach(row => {
            const tablaHtml = `
            <tr class="${getRowBackgroundColor(row.estado)}">
                    <td>${row.cliente}</td>
                    <td>${row.direccion}</td>
                    <td>${row.fecha}</td>
                    <td class="${getRowColor(row.estado)}">${row.estado}</td>
                    <td>
                    <button type="button" class="btn btn-outline-info" onclick="openDetail(${row.id})">
                    <i class="bi bi-card-list"></i>
                    </button>
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

    DETAIL_MODAL = new bootstrap.Modal('#detailModal'),
        MODAL_TITLE_DETAIL = document.getElementById('exampleModalLabel');

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
