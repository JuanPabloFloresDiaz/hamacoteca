async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}


let SAVE_MODAL;
let SAVE_FORM;
let SEARCH_FORM;

// Constantes para completar las rutas de la API.
const ROL_API = 'servicios/privada/roles.php';
/*
*   Función para preparar el formulario al momento de insertar un registro.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openCreate = () => {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Crear rol de administrador';
    // Se prepara el formulario.
    SAVE_FORM.reset();
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
        console.log(FORM);
        FORM.append('idRol', id);
        console.log(id);
        console.log('idRol');
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(ROL_API, 'readOne', FORM);
        console.log(DATA);
        console.log(DATA.status);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Actualizar rol de administrador';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_ROL.value = ROW.ID;
            NOMBRE_ROL.value = ROW.NOMBRE;
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        sweetAlert(2, Error, false);
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar rol de administrador';
    }

}


/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el rol de administrador de forma permanente?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idRol', id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(ROL_API, 'deleteRow', FORM);
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
        confirmAction('¿Desea eliminar el rol de administrador de forma permanente?');
    }

}


async function cargarTabla(form = null) {
    const listacategoria = [
        {
            nombre: 'Root',
            id: 1
        },
        {
            nombre: 'Administrador de usuarios',
            id: 2
        },
    ];
    const cargarTabla = document.getElementById('tabla_rol');
    try {
        cargarTabla.innerHTML = '';
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(ROL_API, action, form);

        if (DATA.status) {
            // Mostrar elementos de la lista de materiales obtenidos de la API
            DATA.dataset.forEach(row => {
                const tablaHtml = `
                <tr>
                <td>${row.NOMBRE}</td>
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
        } else {
            throw new Error('La respuesta de la API no contiene datos válidos');
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        // Mostrar materiales de respaldo
        listacategoria.forEach(row => {
            const tablaHtml = `
            <tr>
                <td>${row.nombre}</td>
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
    const appContainer = document.getElementById('roles');

    // Carga los componentes de manera síncrona
    const navbarHtml = await loadComponent('../componentes/componentes_generales/menu_desplegable/barra_superior.html');
    const adminHtml = await loadComponent('../componentes/administradores/roles_admin.html');
    // Agrega el HTML del encabezado
    appContainer.innerHTML = navbarHtml + adminHtml;
    cargarTabla();
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');


    // Constante para establecer el formulario de buscar.
    SEARCH_FORM = document.getElementById('searchForm');
    // Verificar si SEARCH_FORM está seleccionado correctamente
    console.log(SEARCH_FORM);
    // Método del evento para cuando se envía el formulario de buscar.
    SEARCH_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SEARCH_FORM);
        // Llamada a la función para llenar la tabla con los resultados de la búsqueda.
        cargarTabla(FORM);
    });

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_ROL = document.getElementById('idRol'),
        NOMBRE_ROL = document.getElementById('nombreRol'),

        // Método del evento para cuando se envía el formulario de guardar.
        SAVE_FORM.addEventListener('submit', async (event) => {
            // Se evita recargar la página web después de enviar el formulario.
            event.preventDefault();
            // Se verifica la acción a realizar.
            (ID_ROL.value) ? action = 'updateRow' : action = 'createRow';
            console.log(action);
            console.log(ID_ROL.value);

            // Constante tipo objeto con los datos del formulario.
            const FORM = new FormData(SAVE_FORM);
            console.log(FORM)
            console.log(SAVE_FORM)
            // Petición para guardar los datos del formulario.
            const DATA = await fetchData(ROL_API, action, FORM);
            console.log(DATA);
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


};
