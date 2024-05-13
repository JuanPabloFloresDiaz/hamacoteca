async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
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
            categorias: 'Hamacas clásicas',
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

async function cargarGraficaLineal() {
    const datos = [
        { fecha: '2024-01-26', ganancias: 2500 },
        { fecha: '2024-01-27', ganancias: 8800 },
        { fecha: '2024-01-29', ganancias: 5000 },
        { fecha: '2024-02-06', ganancias: 6500 }
    ];
    try {
        // Petición para obtener los datos del gráfico.
        const DATA = await fetchData(PRODUCTO_API, 'gananciasPorFecha');
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
        if (DATA.status) {
            // Se declaran los arreglos para guardar los datos a gráficar.
            let fecha = [];
            let ganancias = [];
            // Se recorre el conjunto de registros fila por fila a través del objeto row.
            DATA.dataset.forEach(row => {
                // Se agregan los datos a los arreglos.
                fecha.push(row.fecha_registro);
                ganancias.push(row.ganancias);
            });
            // Llamada a la función para generar y mostrar un gráfico de pastel. Se encuentra en el archivo components.js
            lineGraph('chart3', fecha, ganancias, 'Ganancias por fecha $', 'Gráfica de ganancias');
        } else {
            document.getElementById('chart3').remove();
            console.log(DATA.error);
        }
    } catch {
        let fecha = [];
        let ganancias = [];
        datos.forEach(filter => {
            fecha.push(filter.fecha);
            ganancias.push(filter.ganancias);
        });
        // Si ocurre un error, se utilizan los datos de ejemplo definidos arriba.
        lineGraph('chart3', fecha, ganancias, 'Ganancias por fecha', 'Gráfica de ganancias');

    }
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');

    // Carga los componentes de manera síncrona
    const dashboardHtml = await loadComponent('../componentes/dashboard/dashboard.html');
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = dashboardHtml;
    const theme = localStorage.getItem('theme'); // Obtener el tema desde localStorage

    // Constante para obtener el número de horas.
    const HOUR = new Date().getHours();
    // Se define una variable para guardar un saludo.
    let greeting = '';
    // Dependiendo del número de horas transcurridas en el día, se asigna un saludo para el usuario.
    try{
        const DATA = await fetchData(USER_API, 'getUser');
        if (HOUR < 12) {
            greeting = 'Buenos días ' + DATA.nombre;
        } else if (HOUR < 19) {
            greeting = 'Buenas tardes ' + DATA.nombre;
        } else if (HOUR <= 23) {
            greeting = 'Buenas noches ' + DATA.nombre;
        }
        
        sweetAlert(1, greeting, true);
    }catch{

    }

    if (theme === 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-bs-theme', 'light');
    }
    // Llama a la función para mostrar el gráfico de barras
    cargarGraficaLineal();
    graficoPastelCategorias();
};
