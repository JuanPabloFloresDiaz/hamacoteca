async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

// Constantes para completar la ruta de la API.
const PRODUCTOS_API = '';


let DETAIL_MODAL,
    MODAL_TITLE_DETAIL;

    
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

async function cargarTabla(form = null) {
    const cargarTabla = document.getElementById('tabla_pedidos');

    try {
        cargarTabla.innerHTML = '';
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(PEDIDOS_API, action, form);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            DATA.dataset.forEach(row => {
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
        listapedidos.forEach(row => {
            const tablaHtml = `
            <tr class="${getRowBackgroundColor(row.estado)}">
                    <td><img src="${row.urlfoto}" height="50" width="50" class="circulo"></td>
                    <td>${row.cliente}</td>
                    <td>${row.direccion}</td>
                    <td>${row.fecha}</td>
                    <td class="${getRowColor(row.estado)}">${row.estado}</td>
                    <td>
                    <button type="button" class="btn btn-outline-info" onclick="openDetail(${row.id})">
                    <i class="bi bi-card-list"></i>
                    </button>
                    <button type="button" class="btn btn-outline-info" onclick="openDetail(${row.id})">
                    <i class="bi bi-card-list"></i>
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

async function cargarFavoritos() {
    const listahamacas = [
        {
            id_hamaca: 1,
            nombre_producto: 'Hamaca ligera',
            descripcion: '¡Descubre la comodidad y estilo de nuestras hamacas exclusivas! Sumérgete en la suave brisa del verano mientras te relajas en una de nuestras hermosas hamacas tejidas a mano. Desde diseños clásicos hasta modernos, nuestras hamacas están hechas con los mejores materiales para garantizar durabilidad y confort. Ya sea que busques el complemento perfecto para tu jardín, terraza o sala de estar, encontrarás la hamaca perfecta para ti en nuestra colección. ¡Aprovecha nuestras promociones especiales y haz de cada día un día de descanso y relax en una de nuestras hamacas!',
            urlfoto: '../../../recursos/img/hamaca 3.jpg',
            precio: 200
        },
        {
            id_hamaca: 4,
            nombre_producto: 'Hamaca estándar',
            descripcion: '¡Descubre la comodidad y estilo de nuestras hamacas exclusivas! Sumérgete en la suave brisa del verano mientras te relajas en una de nuestras hermosas hamacas tejidas a mano. Desde diseños clásicos hasta modernos, nuestras hamacas están hechas con los mejores materiales para garantizar durabilidad y confort. Ya sea que busques el complemento perfecto para tu jardín, terraza o sala de estar, encontrarás la hamaca perfecta para ti en nuestra colección. ¡Aprovecha nuestras promociones especiales y haz de cada día un día de descanso y relax en una de nuestras hamacas!',
            urlfoto: '../../../recursos/img/hamaca1.png',
            precio: 300
        },
        {
            id_hamaca: 7,
            nombre_producto: 'Hamaca grande',
            descripcion: '¡Descubre la comodidad y estilo de nuestras hamacas exclusivas! Sumérgete en la suave brisa del verano mientras te relajas en una de nuestras hermosas hamacas tejidas a mano. Desde diseños clásicos hasta modernos, nuestras hamacas están hechas con los mejores materiales para garantizar durabilidad y confort. Ya sea que busques el complemento perfecto para tu jardín, terraza o sala de estar, encontrarás la hamaca perfecta para ti en nuestra colección. ¡Aprovecha nuestras promociones especiales y haz de cada día un día de descanso y relax en una de nuestras hamacas!',
            urlfoto: '../../../recursos/img/hamacaKsK 1.png',
            precio: 400
        }
    ];

    const productCardsContainer = document.getElementById('favorites-cards');
    try {
        const response = await fetch(PRODUCTOS_API);
        if (!response.ok) {
            throw new Error('Error al obtener los datos de la API');
        }
        const data = await response.json();

        if (data && Array.isArray(data) && data.length > 0) {
            // Mostrar cartas de productos obtenidos de la API
            data.forEach(product => {
                const cardHtml = `
                    <div class="col text-center ">
                        <div class="card carta">
                            <img src="${product.url}" height="400" class="card-img-top" alt="${product.nombre_hamaca} ">
                            <a href="detalle.html?id=${producto.id_producto}" class="btn btn-outline-light position-absolute top-50 start-50 translate-middle">Ver detalle</a>
                            <div class="card-body">
                                <h5 class="card-title">${product.nombre_hamaca}</h5>
                                <p class="card-text">${product.precio}</p>
                            </div>
                        </div>
                    </div>
                `;
                productCardsContainer.innerHTML += cardHtml;
            });
        } else {
            throw new Error('La respuesta de la API no contiene datos válidos');
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        // Mostrar cartas de productos de respaldo
        listahamacas.forEach(product => {
            const cardHtml = `
                <div class="col-lg-4 col-md-4 col-sm-12 text-center">
                    <div class="card carta">
                        <img src="${product.urlfoto}" height="400" class="card-img-top" alt="${product.nombre_producto}">
                        <a href="detalle.html?id=${product.id_hamaca}" class="btn btn-outline-light position-absolute top-50 start-50 translate-middle">Ver detalle</a>
                        <div class="card-body">
                            <h5 class="card-title">${product.nombre_producto}</h5>
                            <p class="card-text">${product.precio}</p>
                        </div>
                    </div>
                </div>
            `;
            productCardsContainer.innerHTML += cardHtml;
        });
    }
}




// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Obtiene el contenedor principal
    loadTemplate();

    const profileHtml = await loadComponent('../componentes/perfil/perfil.html');
    // Agrega el HTML del encabezado
    appContainer.innerHTML += profileHtml;

    
    DETAIL_MODAL = new bootstrap.Modal('#detailModal'),
        MODAL_TITLE_DETAIL = document.getElementById('exampleModalLabel');

        
    ROWS_FOUND = document.getElementById('rowsFound');

    cargarFavoritos();
    cargarTabla();
};
