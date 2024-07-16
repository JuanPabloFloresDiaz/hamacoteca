let SAVE_MODAL;
let SAVE_FORM,
    ID_CATEGORIA,
    IMAGEN_CATEGORIA,
    NOMBRE_CATEGORIA,
    DESCRIPCION_CATEGORIA;
let SEARCH_FORM;
// Constantes para completar las rutas de la API.
const CATEGORIA_API = 'servicios/privada/categorias.php';

let ROWS_FOUND;
async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

/*
*   Función para preparar el formulario al momento de insertar un registro.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openCreate = () => {
    // Se muestra la caja de diálogo con su título.

    // Se prepara el formulario.
    SAVE_FORM.reset();
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Crear categorías';
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
        FORM.append('idCategoria', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(CATEGORIA_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();

            MODAL_TITLE.textContent = 'Actualizar categorías';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_CATEGORIA.value = ROW.ID;
            NOMBRE_CATEGORIA.value = ROW.NOMBRE;
            DESCRIPCION_CATEGORIA.value = ROW.DESCRIPCION;
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar categorías';
    }

}

/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar la categoría de forma permanente?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idCategoria', id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(CATEGORIA_API, 'deleteRow', FORM);
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

/* async function cargarTabla(form = null) {
    const listacategoria = [
        {
            nombre_producto: 'Colgante',
            descripcion: 'Es una hamaca bonita, ligera y cómoda',
            id: 1
        },
        {
            nombre_producto: 'Silla',
            descripcion: 'Es una hamaca colorada, bonita y cómoda',
            id: 2
        },
    ];
    const cargarTabla = document.getElementById('tabla_categoria');

    try {
        cargarTabla.innerHTML = '';
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(CATEGORIA_API, action, form);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            DATA.dataset.forEach(row => {
                const tablaHtml = `
                <tr>
                <td><img src="${SERVER_URL}imagenes/categorias/${row.IMAGEN}" height="50" width="50" class="circulo"></td>
                <td>${row.NOMBRE}</td>
                <td>${row.DESCRIPCION}</td>
                <td>
                    <button type="button" class="btn btn-outline-success" onclick="openUpdate(${row.ID})">
                        <i class="bi bi-pencil-fill"></i>
                    </button>
                    <button type="button" class="btn btn-outline-danger" onclick="openDelete(${row.ID})">
                        <i class="bi bi-trash-fill"></i>
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
        // Mostrar categorias de respaldo
        listacategoria.forEach(row => {
            const tablaHtml = `
            <tr>
                <td>${row.nombre_producto}</td>
                <td>${row.descripcion}</td>
                <td>
                    <button type="button" class="btn btn-outline-success" onclick="openUpdate(${row.id})">
                        <i class="bi bi-pencil-fill"></i>
                    </button>
                    <button type="button" class="btn btn-outline-danger" onclick="openDelete(${row.id})">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </td>
            </tr>
            `;
            cargarTabla.innerHTML += tablaHtml;
        });
    }
} */


// Variables y constantes para la paginación
const categoriasPorPagina = 10;
let paginaActual = 1;
let categorias = [];

// Función para cargar tabla de técnicos con paginación
async function cargarTabla(form = null) {
    const cargarTabla = document.getElementById('tabla_categoria');
    try {
        cargarTabla.innerHTML = '';
        // Petición para obtener los registros disponibles.
        let action;
        form ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        const DATA = await fetchData(CATEGORIA_API, action, form);
        console.log(DATA);

        if (DATA.status) {
            categorias = DATA.dataset;
            mostrarcategorias(paginaActual);
            // Se muestra un mensaje de acuerdo con el resultado.
            ROWS_FOUND.textContent = DATA.message;
        } else {
            // Se muestra un mensaje de acuerdo con el resultado.
            ROWS_FOUND.textContent = "Existen 0 coincidencias";
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
    }
}

// Función para mostrar técnicos en una página específica
function mostrarcategorias(pagina) {
    const inicio = (pagina - 1) * categoriasPorPagina;
    const fin = inicio + categoriasPorPagina;
    const categoriasPagina = categorias.slice(inicio, fin);

    const cargarTabla = document.getElementById('tabla_categoria');
    cargarTabla.innerHTML = '';
    categoriasPagina.forEach(row => {
        const tablaHtml = `
                <tr>
                <td><img src="${SERVER_URL}imagenes/categorias/${row.IMAGEN}" height="50" width="50" class="circulo"></td>
                <td>${row.NOMBRE}</td>
                <td>${row.DESCRIPCION}</td>
                <td>
                    <button type="button" class="btn btn-outline-success" onclick="openUpdate(${row.ID})">
                        <i class="bi bi-pencil-fill"></i>
                    </button>
                    <button type="button" class="btn btn-outline-danger" onclick="openDelete(${row.ID})">
                        <i class="bi bi-trash-fill"></i>
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

    const totalPaginas = Math.ceil(categorias.length / categoriasPorPagina);

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
    mostrarcategorias(paginaActual);
}

// window.onload
window.onload = async function () {

    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');

    // Carga los componentes de manera síncrona
    const adminHtml = await loadComponent('../componentes/categorias/categorias.html');
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


    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_CATEGORIA = document.getElementById('idCategoria'),
        IMAGEN_CATEGORIA = document.getElementById('imagenCategoria'),
        NOMBRE_CATEGORIA = document.getElementById('nombreCategoria'),
        DESCRIPCION_CATEGORIA = document.getElementById('descripcionCategoria');

    ROWS_FOUND = document.getElementById('rowsFound');
    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_CATEGORIA.value) ? action = 'updateRow' : action = 'createRow';
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SAVE_FORM);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(CATEGORIA_API, action, FORM);
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
