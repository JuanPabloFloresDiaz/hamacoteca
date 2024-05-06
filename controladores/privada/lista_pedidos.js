let SEARCH_FORM;
// Constantes para completar las rutas de la API.
const PEDIDOS_API = '';

async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
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
        FORM.append('idPedido', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(PEDIDOS_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Actualizar cliente';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            EXISTENCIAS_PRODUCTO.disabled = true;
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_ADMINISTRADOR.value = ROW.id_administrado;
            NOMBRE_ADMINISTRADOR.value = ROW.nombre_administrador;
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
        confirmUpdateAction('¿Desea cambiar el estado del pedido?')
    }

}

async function cargarTabla(form = null) {
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
            estado: 'Pendiente',
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
            estado: 'Pendiente',
            id: 3
        },
    ];
    const cargarTabla = document.getElementById('tabla_lista_pedidos');

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
                <td>${row.cliente}</td>
                <td>${row.direccion}</td>
                <td>${row.fecha}</td>
                <td class="text-warning">${row.estado}</td>
            <td>
                <button type="button" class="btn btn-outline-info" onclick="openReport(${row.id})">
                <i class="bi bi-card-list"></i>
                </button>
                <button type="button" class="btn btn-outline-primary" onclick="openUpdate(${row.id})">
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
            <tr>
                    <td>${row.cliente}</td>
                    <td>${row.direccion}</td>
                    <td>${row.fecha}</td>
                    <td class="text-warning">${row.estado}</td>
                <td>
                <button type="button" class="btn btn-outline-info" onclick="openReport(${row.id})">
                <i class="bi bi-card-list"></i>
                </button>
                <button type="button" class="btn btn-outline-primary" onclick="openUpdate(${row.id})">
                <i class="bi bi-exclamation-octagon"></i>
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
    const appContainer = document.getElementById('main');
    // Carga los componentes de manera síncrona
    const listapedidosHtml = await loadComponent('../componentes/pedidos/lista_pedidos.html');
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = listapedidosHtml;
    const theme = localStorage.getItem('theme'); // Obtener el tema desde localStorage
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-bs-theme', 'light');
    }
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
