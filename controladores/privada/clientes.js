
async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}


// Constantes para completar las rutas de la API.
const CLIENTES_API = '';


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
        confirmUpdateAction('¿Desea cambiar el estado del cliente?')
    }

}


async function cargarTabla() {
    const lista_datos = [
        {
            imagen: '../../../recursos/img/mujer.jpg',
            nombre: 'Roxana',
            correo: 'roxy@gmail.com',
            telefono: '1234-5678',
            dui: '87654321-0',
            fecha: '1980-01-27',
            id: 1,
        },
        {
            imagen: '../../../recursos/img/lisa.jpg',
            nombre: 'Lisa',
            correo: 'lalisa@gmail.com',
            telefono: '7549-3974',
            dui: '92848195-4',
            fecha: '2004-09-09',
            id: 2,
        },
        {
            imagen: '../../../recursos/img/mujer.jpg',
            nombre: 'Patricia',
            correo: 'Paty@gmail.com',
            telefono: '3832-0584',
            dui: '82649264-5',
            fecha: '1999-08-24',
            id: 3,
        },
        {
            imagen: '../../../recursos/img/lisa.jpg',
            nombre: 'Rumberta',
            correo: 'rumbi@gmail.com',
            telefono: '1963-7484',
            dui: '21846285-4',
            fecha: '2006-12-31',
            id: 4,
        }
    ];
    const cargarTabla = document.getElementById('tabla_clientes');

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
    const appContainer = document.getElementById('clientes');

    // Carga los componentes de manera síncrona
    const navbarHtml = await loadComponent('../componentes/componentes_generales/menu_desplegable/barra_superior.html');
    const clienteHtml = await loadComponent('../componentes/clientes/clientes.html');
    // Agrega el HTML del encabezado
    appContainer.innerHTML = navbarHtml + clienteHtml;

    const theme = localStorage.getItem('theme'); // Obtener el tema desde localStorage

    if (theme === 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-bs-theme', 'light');
    }
    cargarTabla();

};
