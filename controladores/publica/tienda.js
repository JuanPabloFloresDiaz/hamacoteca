async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

let ROWS_FOUND;
let SEARCH_FORM;

const PRODUCTO_API = 'servicios/publica/hamaca.php';
const MATERIALES_API = 'servicios/publica/material.php';
const CATEGORIAS_API = 'servicios/publica/categoria.php';

async function cargar_productos(form = null) {
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

    const contenedorCartasProductos = document.getElementById('productos-cartas');

    try {
        contenedorCartasProductos.innerHTML = '';
        // Petición para obtener los registros disponibles.
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';
        const DATA = await fetchData(PRODUCTO_API, action, form);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar cartas de productos obtenidos de la API
            DATA.dataset.forEach(producto => {
                const cartasHtml = `
                <div class="col">
                 <div class="card carta-personalizada"">
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
            // Se muestra un mensaje de acuerdo con el resultado.
            ROWS_FOUND.textContent = DATA.message;
        } else {
            // Se muestra un mensaje de acuerdo con el resultado.
            ROWS_FOUND.textContent = "Existen 0 coincidencias";
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        // Mostrar cartas de productos de respaldo
        listahamacas.forEach(producto => {
            const cartasHtml = `
                <div class="col">
                    <div class="card carta-personalizada">
                    <div class="position-relative">
                    <img src="${producto.urlfoto}" height="200" class="card-img-top" alt="${producto.nombre_producto}">
                    <a href="detalle.html?id=${producto.id_hamaca}" class="btn btn-outline-light position-absolute top-50 start-50 translate-middle">Ver detalle</a>
                    </div>
                        <div class="card-body">
                            <h5 class="card-title">${producto.nombre_producto}</h5>
                            <p class="card-text">$${producto.precio}</p>
                        </div>
                    </div>
                </div>
            `;
            contenedorCartasProductos.innerHTML += cartasHtml;
        });
    }



}

async function cargar_categorias() {
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
                    <input class="form-check-input" type="checkbox" name="${categoria.NOMBRE}" id="${categoria.NOMBRE}" value="${categoria.ID}">${categoria.NOMBRE}</input>
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

async function cargar_materiales() {
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
                <input class="form-check-input" type="checkbox" name="${materiales.NOMBRE}" id="${materiales.NOMBRE}" value="${materiales.ID}">${materiales.NOMBRE}</input>
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

async function ordenar_resultados() {
    const lista_filtros = [
        {
            nombre: 'Orden alfabético'
        },
        {
            nombre: 'Mayor precio'
        },
        {
            nombre: 'Menor precio'
        },
        {
            nombre: 'Compra reciente'
        }
    ];

    const ordenarFiltros = document.getElementById('Ordenar-resultados');
    // Mostrar datos de la lista de respaldo
    lista_filtros.forEach(filter => {
        const elementHtml = `
            <li><a class="dropdown-item objetos" href="#">${filter.nombre}</a></li>
            `;
        ordenarFiltros.innerHTML += elementHtml;
    });
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

    cargar_productos();
    cargar_categorias();
    cargar_materiales();
    ordenar_resultados();

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
};