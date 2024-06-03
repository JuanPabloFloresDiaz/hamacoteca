async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

let ROWS_FOUND;
let SEARCH_FORM;
let FILTER_FORM;

let CATEGORIAS;
let MATERIALES;


const PRODUCTO_API = 'servicios/publica/hamaca.php';
const MATERIALES_API = 'servicios/publica/material.php';
const CATEGORIAS_API = 'servicios/publica/categoria.php';

// Constante tipo objeto para obtener los parámetros disponibles en la URL.
const PARAMS = new URLSearchParams(location.search);

const listahamacas = [
    {
        id_hamaca: 1,
        nombre_producto: 'Hamaca ligera',
        precio: 200,
        urlfoto: '../../../recursos/img/hamaca 3.jpg'
    },
    {
        id_hamaca: 2,
        nombre_producto: 'Hamaca ligera',
        precio: 200,
        urlfoto: '../../../recursos/img/hamaca 3.jpg'
    },
    {
        id_hamaca: 3,
        nombre_producto: 'Hamaca ligera',
        precio: 200,
        urlfoto: '../../../recursos/img/hamaca 3.jpg'
    },
    {
        id_hamaca: 4,
        nombre_producto: 'Hamaca estándar',
        precio: 300,
        urlfoto: '../../../recursos/img/hamaca1.png'
    },
    {
        id_hamaca: 5,
        nombre_producto: 'Hamaca estándar',
        precio: 300,
        urlfoto: '../../../recursos/img/hamaca1.png'
    },
    {
        id_hamaca: 6,
        nombre_producto: 'Hamaca estándar',
        precio: 300,
        urlfoto: '../../../recursos/img/hamaca1.png'
    },
    {
        id_hamaca: 7,
        nombre_producto: 'Hamaca grande',
        precio: 400,
        urlfoto: '../../../recursos/img/hamacaKsK 1.png'
    },
    {
        id_hamaca: 8,
        nombre_producto: 'Hamaca grande',
        precio: 400,
        urlfoto: '../../../recursos/img/hamacaKsK 1.png'
    },
    {
        id_hamaca: 9,
        nombre_producto: 'Hamaca grande',
        precio: 400,
        urlfoto: '../../../recursos/img/hamacaKsK 1.png'
    }
];

const productosPorPagina = 9;
let paginaActual = 1;
let productos = [];

// Función para cargar productos con paginación
async function cargar_productos(form = null) {
    const contenedorCartasProductos = document.getElementById('productos-cartas');
    try {
        contenedorCartasProductos.innerHTML = '';
        // Petición para obtener los registros disponibles.
        let action;
        (form) ? action = 'searchRows' : action = 'readAll';
        const DATA = await fetchData(PRODUCTO_API, action, form);
        console.log(DATA);

        if (DATA.status) {
            productos = DATA.dataset;
            mostrarProductos(paginaActual);
            // Se muestra un mensaje de acuerdo con el resultado.
            ROWS_FOUND.textContent = DATA.message;
        } else {
            // Se muestra un mensaje de acuerdo con el resultado.
            ROWS_FOUND.textContent = "Existen 0 coincidencias";
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
    }
}

async function mostrarProductosPorCategoria() {
    const contenedorCartasProductos = document.getElementById('productos-cartas');
    contenedorCartasProductos.innerHTML = '';
    try {
        // Se define un objeto con los datos de la categoría seleccionada.
        const FORM = new FormData();
        FORM.append('idCategoria', PARAMS.get('idCategoria'));
        // Se verifica la acción a realizar.
        const DATA = await fetchData(PRODUCTO_API, "readProductosCategoria", FORM);
        console.log(DATA);

        if (DATA.status) {
            productos = DATA.dataset;
            mostrarProductos(paginaActual);
            // Se muestra un mensaje de acuerdo con el resultado.
            ROWS_FOUND.textContent = DATA.message;
        } else {
            // Se muestra un mensaje de acuerdo con el resultado.
            ROWS_FOUND.textContent = "Existen 0 coincidencias";
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
    }
}


async function filtrarProductos(form) {
    const contenedorCartasProductos = document.getElementById('productos-cartas');
    contenedorCartasProductos.innerHTML = '';
    try {
        // Se verifica la acción a realizar.
        const DATA = await fetchData(PRODUCTO_API, "filterRows", form);
        console.log(DATA);

        if (DATA.status) {
            productos = DATA.dataset;
            mostrarProductos(paginaActual);
            // Se muestra un mensaje de acuerdo con el resultado.
            ROWS_FOUND.textContent = DATA.message;
        } else {
            // Se muestra un mensaje de acuerdo con el resultado.
            ROWS_FOUND.textContent = "Existen 0 coincidencias";
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
    }
}

function mostrarProductos(pagina) {
    const inicio = (pagina - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;
    const productosPagina = productos.slice(inicio, fin);

    const contenedorCartasProductos = document.getElementById('productos-cartas');
    contenedorCartasProductos.innerHTML = '';
    productosPagina.forEach(producto => {
        const cartasHtml = `
            <div class="col">
                <div class="card carta-personalizada">
                    <div class="position-relative">
                        <img src="${SERVER_URL}imagenes/HAMACAS/${producto.IMAGEN}" height="200" class="card-img-top" alt="${producto.NOMBRE}">
                        <a href="detalle.html?id=${producto.ID}" class="btn btn-outline-light position-absolute top-50 start-50 translate-middle">Ver detalle</a>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${producto.NOMBRE}</h5>
                        <p class="card-text">$${producto.PRECIO}</p>
                    </div>
                </div>
            </div>
        `;
        contenedorCartasProductos.innerHTML += cartasHtml;
    });

    actualizarPaginacion();
}

function actualizarPaginacion() {
    const paginacion = document.querySelector('.pagination');
    paginacion.innerHTML = '';

    const totalPaginas = Math.ceil(productos.length / productosPorPagina);

    if (paginaActual > 1) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-dark" href="#" onclick="cambiarPagina(${paginaActual - 1})">Anterior</a></li>`;
    }

    for (let i = 1; i <= totalPaginas; i++) {
        paginacion.innerHTML += `<li class="page-item ${i === paginaActual ? 'active' : ''}"><a class="page-link text-dark" href="#" onclick="cambiarPagina(${i})">${i}</a></li>`;
    }

    if (paginaActual < totalPaginas) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-dark" href="#" onclick="cambiarPagina(${paginaActual + 1})">Siguiente</a></li>`;
    }
}

function cambiarPagina(nuevaPagina) {
    paginaActual = nuevaPagina;
    mostrarProductos(paginaActual);
}
const lista_categorias = [
    {
        nombre: 'Hamaca colgante',
        id: 1
    },
    {
        nombre: 'Hamaca clásica',
        id: 2
    },
    {
        nombre: 'Hamaca silla',
        id: 3
    },
    {
        nombre: 'Hamaca con soporte',
        id: 4
    }
];

async function cargar_categorias() {

    const cargarListaCategorias = document.getElementById('categorias');

    try {
        cargarListaCategorias.innerHTML = "";
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(CATEGORIAS_API, "readAll");
        console.log(DATA);

        if (DATA.status) {
            // Mostrar cartas de productos obtenidos de la API
            DATA.dataset.forEach(categoria => {
                const categoriasHtml = `
                <div class="form-check col-md-12 col-sm-4">
                    <input class="form-check-input" type="checkbox" name="categorias" id="${categoria.NOMBRE}" value="${categoria.ID}">${categoria.NOMBRE}</input>
                </div>
                `;
                cargarListaCategorias.innerHTML += categoriasHtml;
            });
        } else {
            throw new Error('La respuesta de la API no contiene datos válidos');
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        // Mostrar categorias de respaldo
        lista_categorias.forEach(categoria => {
            const categoriasHtml = `
            <div class="form-check col-md-12 col-sm-4">
                <input class="form-check-input" type="checkbox" name="${categoria.nombre}" id="${categoria.nombre}" value="${categoria.id}">${categoria.nombre}</input>
            </div>
                `;
            cargarListaCategorias.innerHTML += categoriasHtml;
        });
    }
}

const lista_materiales = [
    {
        nombre: 'Lana',
        id: 1
    },
    {
        nombre: 'Nylon',
        id: 2
    },
    {
        nombre: 'Poliéster',
        id: 3
    },
    {
        nombre: 'Tela',
        id: 4
    }
];
async function cargar_materiales() {

    const cargarListaMateriales = document.getElementById('materiales');

    try {
        cargarListaMateriales.innerHTML = "";
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(MATERIALES_API, "readAll");
        console.log(DATA);

        if (DATA.status) {
            // Mostrar cartas de productos obtenidos de la API
            DATA.dataset.forEach(materiales => {
                const materialesHtml = `
                <div class="form-check col-md-12 col-sm-4">
                <input class="form-check-input" type="checkbox" name="materiales" id="${materiales.NOMBRE}" value="${materiales.ID}">${materiales.NOMBRE}</input>
                </div>
                `;
                cargarListaMateriales.innerHTML += materialesHtml;
            });
        } else {
            throw new Error('La respuesta de la API no contiene datos válidos');
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        // Mostrar materiales de respaldo
        lista_materiales.forEach(materiales => {
            const materialesHtml = `
                <div class="form-check col-md-12 col-sm-4">
                <input class="form-check-input" type="checkbox" name="${materiales.nombre}" id="${materiales.nombre}" value="${materiales.id}">${materiales.nombre}</input>
                </div>
                `;
            cargarListaMateriales.innerHTML += materialesHtml;
        });
    }
}

async function recharge() {
    cargar_productos();
    FILTER_FORM.reset();
}

window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    loadTemplate();

    // Carga los componentes de manera síncrona
    const productsHtml = await loadComponent('../componentes/tienda/productos.html');
    // Agrega el HTML del encabezado
    appContainer.innerHTML += `${productsHtml}`;

    const rango = document.getElementById('customRange1');
    const rangoValor = document.getElementById('rangoValor');

    // Actualizar el valor mostrado al arrastrar el rango
    rango.addEventListener('input', () => {
        rangoValor.textContent = rango.value;
    });

    ROWS_FOUND = document.getElementById('rowsFound');

    if(PARAMS.get('idCategoria')){
        mostrarProductosPorCategoria();
    }else{
        cargar_productos();
    }
    cargar_categorias();
    cargar_materiales();

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
        cargar_productos(FORM);
    });

    // Constante para establecer el formulario de buscar.
    FILTER_FORM = document.getElementById('filterForm');
    // Verificar si SEARCH_FORM está seleccionado correctamente
    console.log(SEARCH_FORM)
    // Método del evento para cuando se envía el formulario de buscar.
    FILTER_FORM.addEventListener('submit', (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Llamada a la función para llenar las cartas con los resultados de la búsqueda filtrada.
        const FORM = new FormData(FILTER_FORM);
        const categoriaIds = [];
        const materialIds = [];

        FILTER_FORM.querySelectorAll('input[name=categorias]:checked').forEach(checkbox => {
            categoriaIds.push(checkbox.value);
        });

        FILTER_FORM.querySelectorAll('input[name=materiales]:checked').forEach(checkbox => {
            materialIds.push(checkbox.value);
        });

        FORM.set('categorias', categoriaIds.join(','));
        FORM.set('materiales', materialIds.join(','))
        filtrarProductos(FORM);
    });
};