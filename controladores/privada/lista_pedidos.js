
async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}


// Constantes para completar las rutas de la API.
const LISTA_PEDIDOS_API = '';


/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openUpdate = async (id) => {
    try {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('id_cliente', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(CLIENTES_API, 'readOne', FORM);
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

async function cargarTabla() {
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
                    <td><img src="${SERVER_URL}images/categorias/${row.imagen_hamaca}" height="50" width="50" class="circulo"></td>
                    <td>${row.nombre_hamaca}</td>
                    <td>${row.nombre_cliente}</td>
                    <td>${row.descripcion_pedido}</td>
                    <td>${row.direccion_pedido}</td>
                    <td>${row.cantidad_hamaca}</td>
                    <td>${row.precio_hamaca}</td>
                    <td>${row.fecha_pedido}</td>
                    <td>${row.estado_pedido}</td>
                    <td>
                    <button type="button" class="btn btn-info" onclick="openUpdate(${row.id_administrador})">
                    <i class="bi bi-pencil-fill"></i>
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
        listapedidos.forEach(row => {
            const tablaHtml = `
            <tr>
                <td><img src="${row.urlfoto}" height="50" width="50" class="circulo"></td>
                    <td>${row.producto}</td>
                    <td>${row.cliente}</td>
                    <td>${row.descricpion}</td>
                    <td>${row.direccion}</td>
                    <td>${row.cantidad}</td>
                    <td>${row.precio}</td>
                    <td>${row.fecha}</td>
                    <td class="text-warning">${row.estado}</td>
                <td>
                <button type="button" class="btn btn-outline-success" onclick="openUpdate(${row.id})">
                <i class="bi bi-pencil-fill"></i>
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
    const appContainer = document.getElementById('listaPedidos');

    // Carga los componentes de manera síncrona
    const navbarHtml = await loadComponent('../componentes/componentes_generales/menu_desplegable/barra_superior.html');
    const listapedidosHtml = await loadComponent('../componentes/pedidos/lista_pedidos.html');
    // Agrega el HTML del encabezado
    appContainer.innerHTML = navbarHtml + listapedidosHtml;
    cargarTabla();
};
