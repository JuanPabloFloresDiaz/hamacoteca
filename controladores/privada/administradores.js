
async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

let SAVE_MODAL;
let SAVE_FORM;

// Constantes para completar las rutas de la API.
const ADMINISTRADOR_API = '';
const ROL_API = '';
/*
*   Función para preparar el formulario al momento de insertar un registro.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openCreate = () => {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Crear administrador';
    // Se prepara el formulario.
    SAVE_FORM.reset();
    fillSelect(ADMINISTRADOR_API, 'readAll', 'administradores');
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
        FORM.append('id_administrador', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(PRODUCTO_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Actualizar administrador';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            EXISTENCIAS_PRODUCTO.disabled = true;
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_ADMINISTRADOR.value = ROW.id_administrado;
            NOMBRE_ADMINISTRADOR.value = ROW.nombre_administrador;
            APELLIDO_ADMINISTRADOR.value = ROW.apellido_administrador;
            CORREO_ADMINISTRADOR.value = ROW.correo_administrador;
            TELEFONO_ADMINISTRADOR.value = ROW.telefono_administrador;
            DUI_ADMINISTRADOR.value = ROW.dui_administrador;
            NACIMIENTO_ADMINISTRADOR.value = row.fecha_nacimiento_administrador;
            CLAVE_ADMINISTRADOR.value = ROW.clave_administrador;
            ALIAS_ADMINISTRADOR.value = ROW.alias_administrador;
            fillSelect(ROL_API, 'readAll', 'rolAdministrador', ROW.id_rol);
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
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el administrador de forma permanente?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('id_administrador', id);
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
        confirmAction('¿Desea eliminar el administrador de forma permanente?');
    }

}


async function cargarTabla() {
    const lista_datos = [
        {
            imagen: '../../../recursos/img/foto.png',
            nombre: 'Joel',
            correo: 'joel@gmail.com',
            telefono: '1234-5678',
            dui: '12345678-9',
            fecha: '1994-02-09',
            id: 1,
        },
        {
            imagen: '../../../recursos/img/foto.png',
            nombre: 'Joel',
            correo: 'joel@gmail.com',
            telefono: '1234-5678',
            dui: '12345678-9',
            fecha: '1994-02-09',
            id: 2,
        },
        {
            imagen: '../../../recursos/img/foto.png',
            nombre: 'Joel',
            correo: 'joel@gmail.com',
            telefono: '1234-5678',
            dui: '12345678-9',
            fecha: '1994-02-09',
            id: 3,
        },
        {
            imagen: '../../../recursos/img/foto.png',
            nombre: 'Joel',
            correo: 'joel@gmail.com',
            telefono: '1234-5678',
            dui: '12345678-9',
            fecha: '1994-02-09',
            id: 4,
        }
    ];
    const cargarTabla = document.getElementById('tabla_administradores');

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
                    <td><img src="${SERVER_URL}images/categorias/${row.imagen_cliente}" height="50" width="50" class="circulo"></td>
                    <td>${row.nombre_administrador}</td>
                    <td>${row.correo_administrador}</td>
                    <td>${row.telefono_administrador}</td>
                    <td>${row.dui_administrador}</td>
                    <td>${row.fecha_nacimiento}</td>
                    <td>
                        <button type="button" class="btn btn-info" onclick="openUpdate(${row.id_administrador})">
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button type="button" class="btn btn-danger" onclick="openDelete(${row.id_administrador})">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                        <button type="button" class="btn btn-warning" onclick="openReport(${row.id_administrador})">
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
        lista_datos.forEach(row => {
            const tablaHtml = `
            <tr>
                <td><img src="${row.imagen}" height="50" width="50" class="circulo"></td>
                <td>${row.nombre}</td>
                <td>${row.correo}</td>
                <td>${row.telefono}</td>
                <td>${row.dui}</td>
                <td>${row.fecha}</td>
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
    const appContainer = document.getElementById('admin');

    // Carga los componentes de manera síncrona
    const navbarHtml = await loadComponent('../componentes/componentes_generales/menu_desplegable/barra_superior.html');
    const adminHtml = await loadComponent('../componentes/administradores/admins.html');
    // Agrega el HTML del encabezado
    appContainer.innerHTML = navbarHtml + adminHtml;

    cargarTabla();

    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_ADMINISTRADOR = document.getElementById('idAdministrador'),
        NOMBRE_ADMINISTRADOR = document.getElementById('nombreAdministrador'),
        APELLIDO_ADMINISTRADOR = document.getElementById('apellidoAdministrador'),
        CORREO_ADMINISTRADOR = document.getElementById('correoAdministrador'),
        TELEFONO_ADMINISTRADOR = document.getElementById('telefonoAdministrador'),
        DUI_ADMINISTRADOR = document.getElementById('duiAdministrador'),
        NACIMIENTO_ADMINISTRADOR = document.getElementById('nacimientoAdministrador'),
        CLAVE_ADMINISTRADOR = document.getElementById('contraseña'),
        REPETIR_CLAVE = document.getElementById('repetirContraseña'),
        ALIAS_ADMINISTRADOR = document.getElementById('aliasAdministrador'),
        ROL_ADMINISTRADOR = document.getElementById('rolAdministrador');

    // Llamada a la función para establecer la mascara del campo teléfono.
    vanillaTextMask.maskInput({
        inputElement: document.getElementById('telefonoAdministrador'),
        mask: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    });
    // Llamada a la función para establecer la mascara del campo DUI.
    vanillaTextMask.maskInput({
        inputElement: document.getElementById('duiAdministrador'),
        mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/]
    });


    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_ADMINISTRADOR.value) ? action = 'updateRow' : action = 'createRow';
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
            cargarTabla();
        } else {
            sweetAlert(2, DATA.error, false);
        }
    });
};
