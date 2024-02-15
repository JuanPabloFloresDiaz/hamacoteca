async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}


async function cargarTabla(){
    const lista_datos = [
        {
            imagen: '/recursos/img/foto.png',
            nombre: 'Joel',
            correo: 'joel@gmail.com',
            telefono: '1234-5678',
            dui: '12345678-9',
            fecha: '1994-02-09'
        },
        {
            imagen: '/recursos/img/foto.png',
            nombre: 'Joel',
            correo: 'joel@gmail.com',
            telefono: '1234-5678',
            dui: '12345678-9',
            fecha: '1994-02-09'
        },
        {
            imagen: '/recursos/img/foto.png',
            nombre: 'Joel',
            correo: 'joel@gmail.com',
            telefono: '1234-5678',
            dui: '12345678-9',
            fecha: '1994-02-09'
        },
        {
            imagen: '/recursos/img/foto.png',
            nombre: 'Joel',
            correo: 'joel@gmail.com',
            telefono: '1234-5678',
            dui: '12345678-9',
            fecha: '1994-02-09'
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
                    <button type="button" class="btn btn-outline-success" onclick="openUpdate(${row.id_categoria})">
                        <i class="bi bi-pencil-fill"></i>
                    </button>
                    <button type="button" class="btn btn-outline-danger" onclick="openDelete(${row.id_categoria})">
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
    const navbarHtml = await loadComponent('/vistas/privada/componentes/componentes_generales/menu_desplegable/barra_superior.html');
    const adminHtml = await loadComponent('/vistas/privada/componentes/administradores/admins.html');
    // Agrega el HTML del encabezado
    appContainer.innerHTML = navbarHtml + adminHtml;
    cargarTabla();
};
