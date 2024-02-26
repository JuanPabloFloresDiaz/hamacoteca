
async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}


// Constantes para completar las rutas de la API.
const VALORACIONES_API = '';


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
        confirmUpdateAction('¿Desea cambiar el estado del comentario?')
    }

}


async function cargarTabla() {
    const lista_datos = [
        {
            imagen: '../../../recursos/img/mujer.jpg',
            nombre: 'Roxana',
            producto: 'Hamaca de tela',
            comentario: '¡Me encanta mi nueva hamaca! Es muy cómoda y resistente. La calidad del tejido es excelente y los colores son hermosos. Definitivamente recomendaría este producto a cualquiera que esté buscando una hamaca de calidad.',
            fecha: '2024-01-27',
            id: 1,
        },
        {
            imagen: '../../../recursos/img/mujer.jpg',
            nombre: 'Lisa',
            producto: 'Hamaca de color rojo',
            comentario: 'No estoy contento con mi compra. La hamaca que recibí no coincide con la descripción en el sitio web. La calidad del material es pobre y se ve muy frágil. Además, el proceso de entrega fue lento y la comunicación con el vendedor fue deficiente.',
            fecha: '2024-02-16',
            id: 2,
        },
        {
            imagen: '../../../recursos/img/mujer.jpg',
            nombre: 'Rumberta',
            producto: 'Hamaca de red',
            comentario: 'I am neither happy nor dissatisfied, they gave me what I expected.',
            fecha: '2024-02-29',
            id: 4,
        },
    ];
    const cargarTabla = document.getElementById('tabla_valoracion');

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
                <td>${row.producto}</td>
                <td>${row.comentario}</td>
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
    const appContainer = document.getElementById('valoraciones');

    // Carga los componentes de manera síncrona
    const navbarHtml = await loadComponent('../componentes/componentes_generales/menu_desplegable/barra_superior.html');
    const valoracionHtml = await loadComponent('../componentes/valoraciones/valoraciones.html');
    // Agrega el HTML del encabezado
    appContainer.innerHTML = navbarHtml + valoracionHtml;

    cargarTabla();

};
