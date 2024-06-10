async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

// Constantes para completar la ruta de la API.
const PRODUCTOS_API = '';
const FAVORITOS_API = 'servicios/publica/favorito.php';
const PEDIDOS_API = 'servicios/publica/pedido.php';
const DETALLE_PEDIDO_API = 'servicios/publica/detalle_pedido.php';


let DETAIL_MODAL,
    MODAL_TITLE_DETAIL;
let SAVE_MODAL;
let SAVE_FORM,
    ACTUAL_ADMINISTRADOR,
    CLAVE_ADMINISTRADOR,
    REPETIR_CLAVE;

let ROWS_FOUND;
let EDIT_MODAL;
let EDIT_FORM,
    ID_PERFIL,
    NOMBRE_PERFIL,
    APELLIDO_PERFIL,
    CORREO_PERFIL,
    TELEFONO_PERFIL,
    DUI_PERFIL,
    NACIMIENTO_PERFIL,
    GENERO_PERFIL,
    DIRECCION_PERFIL,
    IMAGEN_PERFIL;

const openDetail = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idPedido', id);
    // Se muestra la caja de diálogo con su título.
    DETAIL_MODAL.show();
    MODAL_TITLE_DETAIL.textContent = 'Detalle del pedido ' + id;
    cargarDetalle(FORM);
}

async function openProfile() {
    // Petición para solicitar los datos del producto seleccionado.
    const DATA = await fetchData(USER_API, 'readProfile');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se colocan los datos en la página web de acuerdo con el producto seleccionado previamente.
        document.getElementById('foto').src = SERVER_URL.concat('imagenes/clientes/', DATA.dataset.IMAGEN);
        document.getElementById('nombre').textContent = DATA.dataset.NOMBRE;
        document.getElementById('email').textContent = DATA.dataset.EMAIL;
    } else {

    }
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

    // Se declara e inicializa una variable para calcular el importe por cada producto.
    let subtotal = 0;
    // Se declara e inicializa una variable para sumar cada subtotal y obtener el monto final a pagar.
    let total = 0;
    try {
        cargarTabla.innerHTML = '';
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(DETALLE_PEDIDO_API, 'readOne', form);
        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            DATA.dataset.forEach(row => {
                subtotal = row.PRECIO * row.CANTIDAD;
                total += subtotal;
                const tablaHtml = `
            <tr>
                    <td><img src="${SERVER_URL}imagenes/hamacas/${row.FOTO}" height="50" width="50" class="circulo"></td>
                    <td>${row.PRODUCTO}</td>
                    <td>${row.CANTIDAD}</td>
                    <td>${row.PRECIO}</td>
                    <td>${subtotal.toFixed(2)}</td>
            </tr>
                `;
                cargarTabla.innerHTML += tablaHtml;
                document.getElementById('pago').textContent = total.toFixed(2);
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


/*
*   Función asíncrona para cambiar el estado de un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openState = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmUpdateAction('¿Desea cancelar su pedido?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idPedido', id);
            console.log(id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(PEDIDOS_API, 'changeState', FORM);
            console.log(DATA.status);
            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (DATA.status) {
                // Se muestra un mensaje de éxito.
                await sweetAlert(1, DATA.message, true);
                // Se carga nuevamente la tabla para visualizar los cambios.
                cargarTabla();
            } else {
                sweetAlert(2, DATA.exception, false);
            }
        }
    }
    catch (Error) {
        console.log(Error + ' Error al cargar el mensaje');
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
                    <td>${row.CLIENTE}</td>
                    <td>${row.DIRECCION}</td>
                    <td>${row.FECHA}</td>
                    <td class="${getRowColor(row.ESTADO)}">${row.ESTADO}</td>
                <td>
                        <button type="button" class="btn btn-outline-danger" onclick="openState(${row.ID})">
                            <i class="bi bi-exclamation-octagon"></i>
                        </button>
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
                    <button type="button" class="btn btn-outline-danger" onclick="openState(${row.id})">
                    <i class="bi bi-exclamation-octagon"></i>
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
        productCardsContainer.innerHTML = '';
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(FAVORITOS_API, "readAll");
        console.log(DATA);

        if (DATA.status) {
            // Mostrar cartas de productos obtenidos de la API
            DATA.dataset.forEach(product => {
                const cardHtml = `
                    <div class="col text-center ">
                    <div class="card carta">
                    <img src="${SERVER_URL}imagenes/hamacas/${product.IMAGEN}" class="card-img-top correccion" alt="${product.NOMBRE} ">
                    <a href="detalle.html?id=${product.ID}" class="btn btn-outline-light position-absolute top-50 start-50 translate-middle">Ver detalle</a>
                    <div class="card-body">
                        <h5 class="card-title">${product.NOMBRE}</h5>
                        <p class="card-text">$${product.PRECIO}</p>
                    </div>
                    </div>
                    </div>
                `;
                productCardsContainer.innerHTML += cardHtml;
            });
        } else {
            const cardHtml = `
                    <div class="col text-center ">
                    <p class="card-text">No hay favoritos guardados</p>
                    </div>
                `;
            productCardsContainer.innerHTML += cardHtml;
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

const openPassword = () => {
    // Se abre la caja de diálogo que contiene el formulario.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Cambiar tu contraseña';
    // Se restauran los elementos del formulario.
    SAVE_FORM.reset();
}

const lista_datos = [
    {
        genero: "Masculino",
        id: "Masculino",
    },
    {
        genero: 'Femenino',
        id: 'Femenino',
    },
    {
        genero: 'No definido',
        id: 'No definido',
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
        option.value = item.id; // Suponiendo que hay una propiedad 'id' en los datos
        option.textContent = item.genero; // Cambia 'horario' al nombre de la propiedad que deseas mostrar en el combobox
        selectElement.appendChild(option);
    });

    // Seleccionar el valor especificado si se proporciona
    if (selectedValue !== null) {
        selectElement.value = selectedValue;
    }
};


const openEdit = async (id) => {


    try {
        // Se define un objeto con los datos del registro seleccionado.
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(USER_API, 'readOne');
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            EDIT_MODAL.show();
            EDIT_TITLE.textContent = 'Editar perfil';
            // Se restauran los elementos del formulario.
            EDIT_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            NOMBRE_PERFIL.value = ROW.NOMBRE;
            APELLIDO_PERFIL.value = ROW.APELLIDO;
            CORREO_PERFIL.value = ROW.CORREO;
            TELEFONO_PERFIL.value = ROW.TELÉFONO;
            DUI_PERFIL.value = ROW.DUI;
            NACIMIENTO_PERFIL.value = ROW.NACIMIENTO;
            fillSelected(lista_datos, 'readAll', 'generoPerfil', ROW.GENERO);
            DIRECCION_PERFIL.value = ROW.DIRECCION;
            IMAGEN_PERFIL.value = ROW.IMAGEN;
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        EDIT_MODAL.show();
        EDIT_TITLE.textContent = 'Editar perfil';
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
    openProfile();
    cargarFavoritos();
    cargarTabla();



    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ACTUAL_ADMINISTRADOR = document.getElementById('claveActual'),
        CLAVE_ADMINISTRADOR = document.getElementById('claveCliente'),
        REPETIR_CLAVE = document.getElementById('repetirclaveCliente');

    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SAVE_FORM);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(USER_API, 'changePassword', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se cierra la caja de diálogo.
            SAVE_MODAL.hide();
            // Se muestra un mensaje de éxito.
            sweetAlert(1, DATA.message, true);
        } else {
            sweetAlert(2, DATA.error, false);
        }
    });


    EDIT_MODAL = new bootstrap.Modal('#editModal'),
        EDIT_TITLE = document.getElementById('modalTitleEdit');


    // Constantes para establecer los elementos del formulario de guardar.
    EDIT_FORM = document.getElementById('editForm'),
        NOMBRE_PERFIL = document.getElementById('nombrePerfil'),
        APELLIDO_PERFIL = document.getElementById('apellidoPerfil'),
        CORREO_PERFIL = document.getElementById('correoPerfil'),
        TELEFONO_PERFIL = document.getElementById('telefonoPerfil'),
        DUI_PERFIL = document.getElementById('duiPerfil'),
        NACIMIENTO_PERFIL = document.getElementById('fechanacimientoPerfil'),
        GENERO_PERFIL = document.getElementById('generoPerfil'),
        DIRECCION_PERFIL = document.getElementById('direccionPerfil'),
        IMAGEN_PERFIL = document.getElementById('imagenPerfil');

    // Método del evento para cuando se envía el formulario de guardar.
    EDIT_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(EDIT_FORM);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(USER_API, 'updateRow', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se cierra la caja de diálogo.
            EDIT_MODAL.hide();
            // Se muestra un mensaje de éxito.
            sweetAlert(1, DATA.message, true);
        } else {
            sweetAlert(2, DATA.error, false);
        }
    });


    // Llamada a la función para establecer la mascara del campo teléfono.
    vanillaTextMask.maskInput({
        inputElement: document.getElementById('telefonoPerfil'),
        mask: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    });
    // Llamada a la función para establecer la mascara del campo DUI.
    vanillaTextMask.maskInput({
        inputElement: document.getElementById('duiPerfil'),
        mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/]
    });

};
