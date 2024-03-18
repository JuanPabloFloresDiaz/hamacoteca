async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

async function cargar_productos() {
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
        const response = await fetch(PRODUCTOS_API);
        if (!response.ok) {
            throw new Error('Error al obtener los datos de la API');
        }
        const data = await response.json();

        if (data && Array.isArray(data) && data.length > 0) {
            // Mostrar cartas de productos obtenidos de la API
            data.forEach(producto => {
                const cartasHtml = `
                <div class="col">
                 <div class="card carta-personalizada" onclick="redireccionarDetalleID(${producto.id_hamaca})">
                    <div class="position-relative">
                    <img src="${producto.url}" height="200" class="card-img-top" alt="${producto.nombre_hamaca}">
                    <a href="detalle.html?id=${producto.id_producto}" class="btn btn-outline-light position-absolute top-50 start-50 translate-middle">Ver detalle</a>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${producto.nombre_hamaca}</h5>
                        <p class="card-text">$${producto.precio}</p>
                    </div>
                 </div>
                </div>
                `;
                contenedorCartasProductos.innerHTML += cartasHtml;
            });
        } else {
            throw new Error('La respuesta de la API no contiene datos válidos');
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
        const response = await fetch(CATEGORIAS_API);
        if (!response.ok) {
            throw new Error('Error al obtener los datos de la API');
        }
        const data = await response.json();

        if (data && Array.isArray(data) && data.length > 0) {
            // Mostrar elementos de la lista de categorias obtenidos de la API
            data.forEach(categoria => {
                const categoriasHtml = `
                <option value="${categoria.id_categoria}">${categoria.nombre_categoria}</option>
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
                <option value="${categoria.id}">${categoria.nombre}</option>
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
        const response = await fetch(MATERIALES_API);
        if (!response.ok) {
            throw new Error('Error al obtener los datos de la API');
        }
        const data = await response.json();

        if (data && Array.isArray(data) && data.length > 0) {
            // Mostrar elementos de la lista de materiales obtenidos de la API
            data.forEach(materiales => {
                const materialesHtml = `
                <option value="${materiales.id_material}">${materiales.nombre_material}</option>
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
                <option value="${materiales.id}">${materiales.nombre}</option>
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

// Constantes para completar la ruta de la API.
const CATEGORIAS_API = '';
const COLORES_API = '';
const MATERIALES_API = '';
const PRODUCTOS_API = '';


window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('tienda');

    // Carga los componentes de manera síncrona
    const headerHtml = await loadComponent('../componentes/componentes_generales/barra_superior/barra_superior.html');
    const productsHtml = await loadComponent('../componentes/tienda/productos.html');
    const footerHtml = await loadComponent('../componentes/componentes_generales/barra_inferior/barra_inferior.html');
    // Agrega el HTML del encabezado
    appContainer.innerHTML += `${headerHtml}`;
    appContainer.innerHTML += `${productsHtml}`;
    appContainer.innerHTML += `${footerHtml}`;

    const rango = document.getElementById('customRange1');
    const rangoValor = document.getElementById('rangoValor');

    // Actualizar el valor mostrado al arrastrar el rango
    rango.addEventListener('input', () => {
        rangoValor.textContent = rango.value;
    });

    cargar_productos();
    cargar_categorias();
    cargar_materiales();
    ordenar_resultados();
    document.getElementById('toggleFooterBtn').addEventListener('click', function() {
        var footer = document.querySelector('footer');
        footer.classList.toggle('d-none');
    });
};