
// // Constantes para completar las rutas de la API.
// const ADMINISTRADOR_API = '';
// // Constantes para establecer los elementos del componente Modal.
// const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
//     MODAL_TITLE = document.getElementById('modalTitle');
// // Constantes para establecer los elementos del formulario de guardar.
// const SAVE_FORM = document.getElementById('saveForm'),
//     ID_ADMINISTRADOR = document.getElementById('idAdministrador'),
//     NOMBRE_ADMINISTRADOR = document.getElementById('nombreAdministrador'),
//     CORREO_ADMINISTRADOR = document.getElementById('correoAdministrador'),
//     CLAVE_ADMINISTRADOR = document.getElementById('contraseña'),
//     REPETIR_CLAVE = document.getElementById('repetirContraseña'),
//     ALIAS_ADMINISTRADOR = document.getElementById('aliasAdministrador'),
//     ROL_ADMINISTRADOR = document.getElementById('rolAdministrador');

async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}


/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el producto de forma permanente?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idProducto', id);
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


async function cargarTabla() {
    const lista_datos = [
        {
            imagen: '/recursos/img/foto.png',
            nombre: 'Joel',
            correo: 'joel@gmail.com',
            telefono: '1234-5678',
            dui: '12345678-9',
            fecha: '1994-02-09',
            id: 1,
        },
        {
            imagen: '/recursos/img/foto.png',
            nombre: 'Joel',
            correo: 'joel@gmail.com',
            telefono: '1234-5678',
            dui: '12345678-9',
            fecha: '1994-02-09',
            id: 2,
        },
        {
            imagen: '/recursos/img/foto.png',
            nombre: 'Joel',
            correo: 'joel@gmail.com',
            telefono: '1234-5678',
            dui: '12345678-9',
            fecha: '1994-02-09',
            id: 3,
        },
        {
            imagen: '/recursos/img/foto.png',
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
                    <td><img src="${SERVER_URL}images/categorias/${row.imagen_cliente}" height="50"></td>
                    <td>${row.nombre_cliente}</td>
                    <td>${row.correo_cliente}</td>
                    <td>${row.telefono_cliente}</td>
                    <td>${row.dui_cliente}</td>
                    <td>${row.fecha_nacimiento}</td>
                    <td>
                        <button type="button" class="btn btn-info" onclick="openUpdate(${row.id_cliente})">
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button type="button" class="btn btn-danger" onclick="openDelete(${row.id_cliente})">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                        <button type="button" class="btn btn-warning" onclick="openReport(${row.id_cliente})">
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
                <td><img src="${row.imagen}" height="50"></td>
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



// // Método del evento para cuando se envía el formulario de guardar.
// SAVE_FORM.addEventListener('submit', async (event) => {
//     // Se evita recargar la página web después de enviar el formulario.
//     event.preventDefault();
//     // Se verifica la acción a realizar.
//     (ID_PRODUCTO.value) ? action = 'updateRow' : action = 'createRow';
//     // Constante tipo objeto con los datos del formulario.
//     const FORM = new FormData(SAVE_FORM);
//     // Petición para guardar los datos del formulario.
//     const DATA = await fetchData(PRODUCTO_API, action, FORM);
//     // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
//     if (DATA.status) {
//         // Se cierra la caja de diálogo.
//         SAVE_MODAL.hide();
//         // Se muestra un mensaje de éxito.
//         sweetAlert(1, DATA.message, true);
//         // Se carga nuevamente la tabla para visualizar los cambios.
//         fillTable();
//     } else {
//         sweetAlert(2, DATA.error, false);
//     }
// });

// /*
// *   Función para preparar el formulario al momento de insertar un registro.
// *   Parámetros: ninguno.
// *   Retorno: ninguno.
// */
// const openCreate = () => {
//     // Se muestra la caja de diálogo con su título.
//     SAVE_MODAL.show();
//     MODAL_TITLE.textContent = 'Crear administrador';
//     // Se prepara el formulario.
//     SAVE_FORM.reset();
//     fillSelect(ADMINISTRADOR_API, 'readAll', 'administradores');
// }


// window.onload
window.onload = async function () {
    
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('admin');

    // Carga los componentes de manera síncrona
    const navbarHtml = await loadComponent('/vistas/privada/componentes/componentes_generales/menu_desplegable/barra_superior.html');
    const adminHtml = await loadComponent('/vistas/privada/componentes/administradores/admins.html');
    // Agrega el HTML del encabezado
    appContainer.innerHTML = navbarHtml + adminHtml;
    cargarTabla();
};
