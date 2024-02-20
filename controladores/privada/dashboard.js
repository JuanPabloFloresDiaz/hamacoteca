async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

async function cargarTabla() {
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
                    <td><img src="${SERVER_URL}images/categorias/${row.imagen_cliente}" height="50" width="50" class="circulo"></td>
                    <td>${row.nombre_cliente}</td>
                    <td>${row.correo_cliente}</td>
                    <td>${row.telefono_cliente}</td>
                    <td>${row.dui_cliente}</td>
                    <td>${row.fecha_registro}</td>
                    <td>
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
                <td><img src="${row.imagen}" height="50" width="50" class="circulo"></td>
                <td>${row.nombre}</td>
                <td>${row.correo}</td>
                <td>${row.telefono}</td>
                <td>${row.dui}</td>
                <td>${row.fecha}</td>
                <td>
                    <button type="button" class="btn btn-warning" onclick="openReport(${row.id_categoria})">
                        <i class="bi bi-filetype-pdf"></i>
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
            categorias: 'Hamacas clasicas',
            cantidades: 26
        },
        {
            categorias: 'Hamacas con soporte',
            cantidades: 5
        },
        {
            categorias: 'Hamaca silla',
            cantidades: 7
        },
        {
            categorias: 'Hamaca colgante',
            cantidades: 24
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


/*
*   Función asíncrona para mostrar un gráfico de pastel con el porcentaje de productos por categoría.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const graficoPastelCategorias = async () => {
    /*
*   Lista de datos de ejemplo en caso de error al obtener los datos reales.
*/
    const datosEjemplo = [
        {
            categorias: 'Hamacas clasicas',
            cantidades: 26
        },
        {
            categorias: 'Hamacas con soporte',
            cantidades: 5
        },
        {
            categorias: 'Hamaca silla',
            cantidades: 7
        },
        {
            categorias: 'Hamaca colgante',
            cantidades: 24
        }
    ];
    try {
        // Petición para obtener los datos del gráfico.
        const DATA = await fetchData(PRODUCTO_API, 'porcentajeProductosCategoria');
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
        if (DATA.status) {
            // Se declaran los arreglos para guardar los datos a gráficar.
            let categorias = [];
            let porcentajes = [];
            // Se recorre el conjunto de registros fila por fila a través del objeto row.
            DATA.dataset.forEach(row => {
                // Se agregan los datos a los arreglos.
                categorias.push(row.nombre_categoria);
                porcentajes.push(row.porcentaje);
            });
            // Llamada a la función para generar y mostrar un gráfico de pastel. Se encuentra en el archivo components.js
            pieGraph('chart2', categorias, porcentajes, 'Porcentaje de productos por categoría');
        } else {
            document.getElementById('chart2').remove();
            console.log(DATA.error);
        }
    } catch {
        let categorias = [];
        let cantidades = [];
        datosEjemplo.forEach(filter => {
            categorias.push(filter.categorias);
            cantidades.push(filter.cantidades);
        });
        // Si ocurre un error, se utilizan los datos de ejemplo definidos arriba.
        pieGraph('chart2', categorias, cantidades, 'Porcentaje de productos por categoría');

    }

}

async function datosGrafica() {
    const datos = [
        { fecha: '2024-01-26', ganancias: 2500 },
        { fecha: '2024-01-27', ganancias: 8800 },
        { fecha: '2024-01-29', ganancias: 5000 },
        { fecha: '2024-02-06', ganancias: 6500 }
    ];

    drawLineChart(datos, 'Ganancias por Fecha', 'Fecha', 'Ganancias');
}

function drawLineChart(data, title, xAxisLabel, yAxisLabel) {
    const chartContainer = document.getElementById('chart');
    const canvas = document.createElement('canvas');
    chartContainer.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    canvas.width = chartContainer.clientWidth;
    canvas.height = 400;

    const margin = { top: 40, right: 20, bottom: 60, left: 70 }; // Ajustado para dar espacio a las etiquetas
    const width = canvas.width - margin.left - margin.right;
    const height = canvas.height - margin.top - margin.bottom;

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.fecha))
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.ganancias)])
        .range([height, 0]);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    data.forEach((d, i) => {
        const x = xScale(d.fecha) + margin.left + xScale.bandwidth() / 2;
        const y = yScale(d.ganancias) + margin.top;
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        // Agregar etiquetas con los valores de las ganancias
        ctx.fillStyle = 'black';
        ctx.font = '10px Arial';
        ctx.fillText(d.ganancias.toString(), x, y - 10); // Ajustado para evitar superposiciones
    });
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, canvas.height - margin.bottom);
    ctx.lineTo(canvas.width - margin.right, canvas.height - margin.bottom);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Agregar etiquetas para el eje X (fechas)
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.font = '10px Arial';
    data.forEach((d, i) => {
        const x = xScale(d.fecha) + margin.left + xScale.bandwidth() / 2;
        const y = canvas.height - margin.bottom + 15;
        ctx.fillText(d.fecha, x, y);
    });

    // Agregar título
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(title, canvas.width / 2, margin.top / 2);

    // Agregar etiquetas para el eje Y (valores de ganancias)
    ctx.textAlign = 'right';
    ctx.fillStyle = 'black';
    ctx.font = '10px Arial';
    const yValues = yScale.ticks(8); // Ajustado para determinar el número de etiquetas en el eje Y
    yValues.forEach(value => {
        const y = yScale(value) + margin.top;
        ctx.fillText(value.toString(), margin.left - 10, y);
    });

    // Agregar etiqueta para el eje X
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.font = '10px Arial';
    ctx.fillText(xAxisLabel, canvas.width / 2, canvas.height - margin.bottom / 3);

    // Agregar etiqueta para el eje Y
    ctx.save();
    ctx.translate(margin.left / 2, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.font = '10px Arial';
    ctx.fillText(yAxisLabel, 0, 0);
    ctx.restore();
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
    graficoPastelCategorias();
};
