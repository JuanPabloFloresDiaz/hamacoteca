async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}


let SAVE_MODAL;
let SAVE_FORM;
// Constantes para completar las rutas de la API.
const CATEGORIA_API = '';
/*
*   Función para preparar el formulario al momento de insertar un registro.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openCreate = () => {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Crear categorías';
    // Se prepara el formulario.
    SAVE_FORM.reset();
    fillSelect(CATEGORIA_API, 'readAll', 'categorias');
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
        FORM.append('id_categoria', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(PRODUCTO_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Actualizar categorías';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            EXISTENCIAS_PRODUCTO.disabled = true;
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_CATEGORIA.value = ROW.id_categoria;
            NOMBRE_CATEGORIA.value = ROW.nombre_categoria;
            DESCRIPCION_CATEGORIA.value = ROW.descripcion_categoria;
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
            FORM.append('id_categoria', id);
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
        confirmAction('¿Desea eliminar la categoría de forma permanente?');
    }

}


async function cargarTabla() {
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
                    <td>${row.nombre_categoria}</td>
                    <td>${row.descripcion_categoria}</td>
                    <td>
                        <button type="button" class="btn btn-info" onclick="openUpdate(${row.id_hamaca})">
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button type="button" class="btn btn-danger" onclick="openDelete(${row.id_hamaca})">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                        <button type="button" class="btn btn-warning" onclick="openReport(${row.id_hamaca})">
                            <i class="bi bi-filetype-pdf"></i>
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
}


// window.onload
window.onload = async function () {

    // Obtiene el contenedor principal
    const appContainer = document.getElementById('categorias');

    // Carga los componentes de manera síncrona
    const navbarHtml = await loadComponent('../componentes/componentes_generales/menu_desplegable/barra_superior.html');
    const adminHtml = await loadComponent('../componentes/categorias/categorias.html');
    // Agrega el HTML del encabezado
    appContainer.innerHTML = navbarHtml + adminHtml;
    cargarTabla();
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');


    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_CATEGORIA = document.getElementById('idCategoria'),
        NOMBRE_CATEGORIA = document.getElementById('nombreCategoria'),
        DESCRIPCION_CATEGORIA = document.getElementById('descripcionCategoria'),

        // Método del evento para cuando se envía el formulario de guardar.
        SAVE_FORM.addEventListener('submit', async (event) => {
            // Se evita recargar la página web después de enviar el formulario.
            event.preventDefault();
            // Se verifica la acción a realizar.
            (ID_PRODUCTO.value) ? action = 'updateRow' : action = 'createRow';
            // Constante tipo objeto con los datos del formulario.
            const FORM = new FormData(SAVE_FORM);
            // Petición para guardar los datos del formulario.
            const DATA = await fetchData(PRODUCTO_API, action, FORM);
            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (DATA.status) {
                // Se cierra la caja de diálogo.
                SAVE_MODAL.hide();
                // Se muestra un mensaje de éxito.
                sweetAlert(1, DATA.message, true);
                // Se carga nuevamente la tabla para visualizar los cambios.
                fillTable();
            } else {
                sweetAlert(2, DATA.error, false);
            }
        });
};
