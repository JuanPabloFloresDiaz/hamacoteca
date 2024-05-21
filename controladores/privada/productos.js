
async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

let TOAST,
    TITLE_TOAST,
    MESSAGE_TOAST;
let SAVE_MODAL;
let IMAGE_MODAL;
let SAVE_FORM,
    ID_HAMACA,
    IMAGEN_HAMACA,
    NOMBRE_HAMACA,
    CANTIDAD_HAMACA,
    PRECIO_HAMACA,
    CATEGORIA,
    MATERIAL,
    DESCRIPCION_HAMACA;
let IMAGE_FORM,
    ID_FOTO,
    HAMACA,
    FOTO;
let SEARCH_FORM;

let ROWS_FOUND;
// Constantes para completar las rutas de la API.
const HAMACA_API = 'servicios/privada/hamacas.php';
const FOTOS_API = 'servicios/privada/fotos.php';
const MATERIALES_API = 'servicios/privada/materiales.php';
const CATEGORIAS_API = 'servicios/privada/categorias.php';
/*
*   Función para preparar el formulario al momento de insertar un registro.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openCreate = () => {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Crear hamaca';
    // Se prepara el formulario.
    SAVE_FORM.reset();
    fillSelect(MATERIALES_API, 'readAll', 'materiales');
    fillSelect(CATEGORIAS_API, 'readAll', 'categorias');
}
const openImage = async (id) => {
    IMAGE_FORM.reset();
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idHamaca', id);
    // Se muestra la caja de diálogo con su título.
    IMAGE_MODAL.show();
    MODAL_TITLE_IMAGE.textContent = 'Agregar fotos de la hamaca ' + id;
    cargarFotos(FORM);
    HAMACA.value = id;
}
/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openUpdate = async (id) => {
    try {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idHamaca', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(HAMACA_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Actualizar hamaca';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_HAMACA.value = ROW.ID;
            NOMBRE_HAMACA.value = ROW.NOMBRE;
            CANTIDAD_HAMACA.value = ROW.CANTIDAD;
            PRECIO_HAMACA.value = ROW.PRECIO;
            DESCRIPCION_HAMACA.value = ROW.DESCRIPCIÓN;
            fillSelect(MATERIALES_API, 'readAll', 'materiales', ROW.MATERIAL);
            fillSelect(CATEGORIAS_API, 'readAll', 'categorias', ROW.CATEGORIA);

        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar hamaca';
    }

}


/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar la hamaca de forma permanente?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idHamaca', id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(HAMACA_API, 'deleteRow', FORM);
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


/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openUpdatePhoto = async (id) => {
    try {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idFoto', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(FOTOS_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se prepara el formulario.
            IMAGE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_FOTO.value = ROW.ID;
            HAMACA.value = ROW.HAMACA;
            TOAST.show();
            TITLE_TOAST.textContent = 'Confirmación';
            MESSAGE_TOAST.textContent = 'Se selecciono la foto ' + id;
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
    }

}

/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDeletePhoto = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar la foto de la hamaca de forma permanente?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idFoto', id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(FOTOS_API, 'deleteRow', FORM);
            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (DATA.status) {
                // Se muestra un mensaje de éxito.
                await sweetAlert(1, DATA.message, true);
                openImage(HAMACA.value);
            } else {
                sweetAlert(2, DATA.error, false);
            }
        }
    }
    catch (Error) {
        console.log(Error + ' Error al cargar el mensaje');
    }

}


/*
*   Función asíncrona para cambiar el estado de un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openState = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmUpdateAction('¿Desea cambiar el estado del producto?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idHamaca', id);
            console.log(id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(HAMACA_API, 'changeState', FORM);
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

async function cargarFotos(form = null) {
    const cargarTabla = document.getElementById('fotos');
    try {
        cargarTabla.innerHTML = '';
        console.log(form);
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(FOTOS_API, 'readAll', form);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar elementos de la lista obtenidos de la API
            DATA.dataset.forEach(row => {
                const tablaHtml = `
                            <div class="col-md-4">
                                <div class="card mb-4 shadow-sm">
                                    <img src="${SERVER_URL}imagenes/fotos/${row.IMAGEN}"
                                        class="card-img-top img-thumbnail" alt="Imagen de ejemplo"">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-center align-items-center">
                                            <button type="button" class="btn btn-outline-success" onclick="openUpdatePhoto(${row.ID})">
                                                <i class="bi bi-pencil-fill"></i>
                                            </button>
                                            <button type="button" class="btn btn-outline-danger" onclick="openDeletePhoto(${row.ID})">
                                                <i class="bi bi-trash-fill"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                `;
                cargarTabla.innerHTML += tablaHtml;

            });
        } else {
            const tablaHtml = `
                            <div class="col-md-12">
                                <div class="card mb-4 shadow-sm">
                                    <img src="../../../recursos/img/404.jpg"
                                        class="card-img-top img-thumbnail" alt="Imagen de ejemplo"">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-center align-items-center">
                                           <p class="${getRowColor('Agotado')}">${DATA.error} </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                `;
            cargarTabla.innerHTML += tablaHtml;
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        sweetAlert(4, error, true);
    }
}

async function cargarTabla(form = null) {
    const listahamacas = [
        {
            nombre_producto: 'Hamaca ligera',
            precio: 200,
            cantidad: 3,
            descripcion: 'Es una hamaca bonita, ligera y cómoda',
            urlfoto: '../../../recursos/img/hamaca 3.jpg',
            fecha: '2023-02-16',
            estado: 'Disponible',
            id: 1
        },
        {
            nombre_producto: 'Hamaca estandar',
            precio: 300,
            cantidad: 3,
            descripcion: 'Es una hamaca colorada, bonita y cómoda',
            urlfoto: '../../../recursos/img/hamaca1.png',
            fecha: '2023-02-15',
            estado: 'Disponible',
            id: 2
        },
        {
            nombre_producto: 'Hamaca grande',
            precio: 400,
            cantidad: 3,
            descripcion: 'Es una hamaca grande, preciosa y cómoda',
            urlfoto: '../../../recursos/img/hamacaKsK 1.png',
            fecha: '2023-02-12',
            estado: 'Disponible',
            id: 3
        },
    ];
    const cargarTabla = document.getElementById('tabla_hamacas');

    try {
        cargarTabla.innerHTML = '';
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(HAMACA_API, action, form);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar elementos de la lista obtenidos de la API
            DATA.dataset.forEach(row => {
                const tablaHtml = `
                <tr class="${getRowBackgroundColor(row.ESTADO)}">
                    <td><img src="${SERVER_URL}imagenes/hamacas/${row.IMAGEN}" height="50" width="50" class="circulo"></td>
                    <td>${row.NOMBRE}</td>
                    <td>${row.DESCRIPCIÓN}</td>
                    <td>${row.CANTIDAD}</td>
                    <td>${row.PRECIO}</td>
                    <td class="${getRowColor(row.ESTADO)}">${row.ESTADO}</td>
                    <td>
                        <button type="button" class="btn btn-outline-primary" onclick="openState(${row.ID})">
                            <i class="bi bi-exclamation-octagon"></i>
                        </button>
                        <button type="button" class="btn btn-outline-success" onclick="openUpdate(${row.ID})">
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button type="button" class="btn btn-outline-danger" onclick="openDelete(${row.ID})">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                        <button type="button" class="btn btn-outline-primary" onclick="openImage(${row.ID})">
                        <i class="bi bi-card-image"></i>
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
                <tr class="${getRowBackgroundColor('Agotado')}">
                <td class="${getRowColor('Agotado')}">${DATA.error}</td>
                </tr>
                `;
            cargarTabla.innerHTML += tablaHtml;
            // Se muestra un mensaje de acuerdo con el resultado.
            ROWS_FOUND.textContent = "Existen 0 coincidencias";
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        // Mostrar materiales de respaldo
        listahamacas.forEach(row => {
            const tablaHtml = `
            <tr>
                <td><img src="${row.urlfoto}" height="50" width="50" class="circulo"></td>
                <td>${row.nombre_producto}</td>
                <td>${row.descripcion}</td>
                <td>${row.cantidad}</td>
                <td>${row.precio}</td>
                <td>${row.estado}</td>
                <td>
                    <button type="button" class="btn btn-outline-success" onclick="openUpdate(${row.id})">
                        <i class="bi bi-pencil-fill"></i>
                    </button>
                    <button type="button" class="btn btn-outline-danger" onclick="openDelete(${row.id})">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                    <button type="button" class="btn btn-outline-primary" onclick="openImage(${row.id_hamaca})">
                        <i class="bi bi-card-image"></i>
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
        case 'Agotado':
            return 'text-danger';
        case 'Disponible':
            return 'text-success';
        default:
            return '';
    }
}

function getRowBackgroundColor(estado) {
    switch (estado) {
        case 'Agotado':
            return 'border-danger';
        case 'Disponible':
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
    const adminHtml = await loadComponent('../componentes/hamacas/hamacas.html');
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = adminHtml;
    cargarTabla();
    const theme = localStorage.getItem('theme'); // Obtener el tema desde localStorage

    if (theme === 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-bs-theme', 'light');
    }
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    IMAGE_MODAL = new bootstrap.Modal('#modalAgregarFoto'),
        MODAL_TITLE_IMAGE = document.getElementById('exampleModalLabel');


    ROWS_FOUND = document.getElementById('rowsFound');

    // Constantes para establecer los elementos del componente Toast.
    TOAST = new bootstrap.Toast(document.getElementById('toast')),
        TITLE_TOAST = document.getElementById('titleToast'),
        MESSAGE_TOAST = document.getElementById('messageToast');

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_HAMACA = document.getElementById('idHamaca'),
        NOMBRE_HAMACA = document.getElementById('nombreHamaca'),
        CANTIDAD_HAMACA = document.getElementById('cantidadHamaca'),
        PRECIO_HAMACA = document.getElementById('precioHamaca'),
        DESCRIPCION_HAMACA = document.getElementById('descripcionHamaca'),
        CATEGORIA = document.getElementById('categorias'),
        MATERIAL = document.getElementById('materiales'),
        IMAGEN_HAMACA = document.getElementById('imagenHamaca');

    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_HAMACA.value) ? action = 'updateRow' : action = 'createRow';
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SAVE_FORM);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(HAMACA_API, action, FORM);
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
        }
    });


    // Constantes para establecer los elementos del formulario de guardar.
    IMAGE_FORM = document.getElementById('photoForm'),
        ID_FOTO = document.getElementById('idFoto'),
        HAMACA = document.getElementById('idHamacas'),
        FOTO = document.getElementById('inputFoto');
    ROWS_FOUND = document.getElementById('rowsFound');

    // Método del evento para cuando se envía el formulario de guardar.
    IMAGE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_FOTO.value) ? action = 'updateRow' : action = 'createRow';
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(IMAGE_FORM);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(FOTOS_API, action, FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra un mensaje de éxito.
            sweetAlert(1, DATA.message, true);
            openImage(HAMACA.value);
        } else {
            sweetAlert(2, DATA.error, false);
        }
    });

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
