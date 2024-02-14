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
            fecha: '2024-02-09'
        },
        {
            imagen: '/recursos/img/foto.png',
            nombre: 'Joel',
            correo: 'joel@gmail.com',
            telefono: '1234-5678',
            dui: '12345678-9',
            fecha: '2024-02-09'
        },
        {
            imagen: '/recursos/img/foto.png',
            nombre: 'Joel',
            correo: 'joel@gmail.com',
            telefono: '1234-5678',
            dui: '12345678-9',
            fecha: '2024-02-09'
        },
        {
            imagen: '/recursos/img/foto.png',
            nombre: 'Joel',
            correo: 'joel@gmail.com',
            telefono: '12345678-9',
            dui: '1234-5678',
            fecha: '2024-02-09'
        }  
    ];
    const cargarTabla = document.getElementById('tabla');

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
                    <td>${row.fecha_registro}</td>
                    <td>
                        <button type="button" class="btn btn-info" onclick="openUpdate(${row.id_categoria})">
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button type="button" class="btn btn-danger" onclick="openDelete(${row.id_categoria})">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                        <button type="button" class="btn btn-warning" onclick="openReport(${row.id_categoria})">
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

/*
*   Función asíncrona para mostrar un gráfico de barras con la cantidad de productos por categoría.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const graficoBarrasCategorias = async () => {
    /*
*   Lista de datos de ejemplo en caso de error al obtener los datos reales.
*/
    const datosEjemplo = [
        {
            categorias: 'Categoria 1',
            cantidades: 10
        },
        {
            categorias: 'Categoria 2',
            cantidades: 15
        },
        {
            categorias: 'Categoria 3',
            cantidades: 20
        },
        {
            categorias: 'Categoria 4',
            cantidades: 26
        }
    ];
    try {
        // Petición para obtener los datos del gráfico.
        let DATA = await fetchData(PRODUCTO_API, '');
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
        if (DATA.status) {
            // Se declaran los arreglos para guardar los datos a graficar.
            let categorias = [];
            let cantidades = [];
            // Se recorre el conjunto de registros fila por fila a través del objeto row.
            DATA.dataset.forEach(row => {
                // Se agregan los datos a los arreglos.
                categorias.push(row.nombre_categoria);
                cantidades.push(row.cantidad);
            });
            // Llamada a la función para generar y mostrar un gráfico de barras. Se encuentra en el archivo components.js
            barGraph('chart1', categorias, cantidades, 'Cantidad de productos', 'Cantidad de productos por categoría');
        } else {
            console.log(DATA.error);
        }
    } catch (error) {
        let categorias = [];
        let cantidades = [];
        datosEjemplo.forEach(filter => {
            categorias.push(filter.categorias);
            cantidades.push(filter.cantidades);
        });
        // Si ocurre un error, se utilizan los datos de ejemplo definidos arriba.
        barGraph('chart1', categorias, cantidades, 'Cantidad de productos', 'Cantidad de productos por categoría');

    }
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('dashboard');

    // Carga los componentes de manera síncrona
    const navbarHtml = await loadComponent('/vistas/privada/componentes/componentes_generales/menu_desplegable/barra_superior.html');
    const dashboardHtml = await loadComponent('/vistas/privada/componentes/dashboard/dashboard.html');
    // Agrega el HTML del encabezado
    appContainer.innerHTML = navbarHtml + dashboardHtml;
    cargarTabla();
    // Llama a la función para mostrar el gráfico de barras
    graficoBarrasCategorias();

};
