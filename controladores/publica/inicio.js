async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

// Constantes para completar la ruta de la API.
const PRODUCTOS_API = 'servicios/publica/hamaca.php';
const CATEGORIAS_API = 'servicios/publica/categoria.php';

let dynamicCarousels;

const listahamacas = [
    {
        id_hamaca: 1,
        nombre_producto: 'Hamaca ligera',
        descripcion: '¡Descubre la comodidad y estilo de nuestras hamacas exclusivas! Sumérgete en la suave brisa del verano mientras te relajas en una de nuestras hermosas hamacas tejidas a mano. Desde diseños clásicos hasta modernos, nuestras hamacas están hechas con los mejores materiales para garantizar durabilidad y confort. Ya sea que busques el complemento perfecto para tu jardín, terraza o sala de estar, encontrarás la hamaca perfecta para ti en nuestra colección. ¡Aprovecha nuestras promociones especiales y haz de cada día un día de descanso y relax en una de nuestras hamacas!',
        urlfoto: '../../../recursos/img/hamaca 3.jpg',
        precio: 200
    },
    {
        id_hamaca: 4,
        nombre_producto: 'Hamaca estándar',
        descripcion: '¡Descubre la comodidad y estilo de nuestras hamacas exclusivas! Sumérgete en la suave brisa del verano mientras te relajas en una de nuestras hermosas hamacas tejidas a mano. Desde diseños clásicos hasta modernos, nuestras hamacas están hechas con los mejores materiales para garantizar durabilidad y confort. Ya sea que busques el complemento perfecto para tu jardín, terraza o sala de estar, encontrarás la hamaca perfecta para ti en nuestra colección. ¡Aprovecha nuestras promociones especiales y haz de cada día un día de descanso y relax en una de nuestras hamacas!',
        urlfoto: '../../../recursos/img/hamaca1.png',
        precio: 300
    },
    {
        id_hamaca: 7,
        nombre_producto: 'Hamaca grande',
        descripcion: '¡Descubre la comodidad y estilo de nuestras hamacas exclusivas! Sumérgete en la suave brisa del verano mientras te relajas en una de nuestras hermosas hamacas tejidas a mano. Desde diseños clásicos hasta modernos, nuestras hamacas están hechas con los mejores materiales para garantizar durabilidad y confort. Ya sea que busques el complemento perfecto para tu jardín, terraza o sala de estar, encontrarás la hamaca perfecta para ti en nuestra colección. ¡Aprovecha nuestras promociones especiales y haz de cada día un día de descanso y relax en una de nuestras hamacas!',
        urlfoto: '../../../recursos/img/hamacaKsK 1.png',
        precio: 400
    }
];

async function cargar_productos_semanales() {


    const productCardsContainer = document.getElementById('product-cards');
    try {

        productCardsContainer.innerHTML = '';
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(PRODUCTOS_API, "readMostSell");
        console.log(DATA);

        if (DATA.status) {
            // Mostrar cartas de productos obtenidos de la API
            DATA.dataset.forEach(product => {
                const cardHtml = `
                    <div class="col-lg-4 col-md-4 col-sm-12  text-center ">
                        <div class="card carta">
                            <img src="${SERVER_URL}imagenes/hamacas/${product.IMAGEN}" class="card-img-top correccion" alt="${product.NOMBRE} ">
                            <a href="detalle.html?id=${product.ID}" class="btn btn-outline-light position-absolute top-50 start-50 translate-middle">Ver detalle</a>
                            <div class="card-body">
                                <h5 class="card-title">${product.NOMBRE}</h5>
                                <p class="card-text">$${product.PRECIO}</p>
                            </div>
                        </div>
                    </div>
                `;
                productCardsContainer.innerHTML += cardHtml;
            });
        } else {
            console.log("Error al obtener datos");
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        // Mostrar cartas de productos de respaldo
        listahamacas.forEach(product => {
            const cardHtml = `
                <div class="col-lg-4 col-md-4 col-sm-12 text-center">
                    <div class="card carta">
                        <img src="${product.urlfoto}" class="card-img-top correccion" alt="${product.nombre_producto}">
                        <a href="detalle.html?id=${product.id_hamaca}" class="btn btn-outline-light position-absolute top-50 start-50 translate-middle">Ver detalle</a>
                        <div class="card-body">
                            <h5 class="card-title">${product.nombre_producto}</h5>
                            <p class="card-text">${product.precio}</p>
                        </div>
                    </div>
                </div>
            `;
            productCardsContainer.innerHTML += cardHtml;
        });
    }
}



async function cargarCategorias() {
    const listacategorias = [
        {
            id: 1,
            categoria: 'Clasicas',
            urlfoto: '../../../recursos/img/hamaca 3.jpg',
        },
        {
            id: 2,
            categoria: 'Colgantes',
            urlfoto: '../../../recursos/img/hamaca 3.jpg',
        },
        {
            id: 3,
            categoria: 'Soporte',
            urlfoto: '../../../recursos/img/hamaca 3.jpg',
        },
        {
            id: 4,
            categoria: 'Modernas',
            urlfoto: '../../../recursos/img/hamaca 3.jpg',
        }
    ];

    const productCardsContainer = document.getElementById('category');
    try {
        productCardsContainer.innerHTML = '';
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(CATEGORIAS_API, "readAll");
        console.log(DATA);

        if (DATA.status) {
            // Mostrar cartas de productos obtenidos de la API
            DATA.dataset.forEach(product => {
                const cardHtml = `
                <div class="col-lg-2 col-md-2 col-sm-12 text-center">
                 <div class="card categoria">
                   <a href="tienda.html?idCategoria=${product.ID}" class="text-secondary">
                     <div class="card-body">
                         <img src="${SERVER_URL}imagenes/categorias/${product.IMAGEN}" class="card-img-top category" alt="${product.NOMBRE}">
                         <p class="card-title titulito">${product.NOMBRE}</p>
                     </div>
                    </a>
                 </div>
                </div>
                `;
                productCardsContainer.innerHTML += cardHtml;
            });
        } else {
            console.log(DATA.error);
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        // Mostrar cartas de productos de respaldo
        listacategorias.forEach(product => {
            const cardHtml = `
                <div class="col-lg-2 col-md-2 col-sm-12 text-center">
                    <div class="card categoria">
                        <a href="tienda.html" class="text-secondary">
                        <div class="card-body">
                            <img src="${product.urlfoto}" class="card-img-top category" alt="${product.categoria}">
                            <h5 class="card-title">${product.categoria}</h5>
                        </div>
                        </a>
                    </div>
                </div>
            `;
            productCardsContainer.innerHTML += cardHtml;
        });
    }
}



async function cargarProductosPorCategoria() {
    try {
        // Petición para obtener las categorías
        const categories = await fetchData(CATEGORIAS_API, 'readAll');

        const container = document.createElement('div');
        container.className = 'container';

        for (const category of categories.dataset) {
            // Petición para obtener los productos de la categoría
            const form = new FormData();
            form.append('idCategoria', category.ID);
            const productsResponse = await fetchData(PRODUCTOS_API, 'readProductosCategoria', form);
            const products = productsResponse.dataset;

            // Crear un div para contener el título de la sección
            const titleContainer = document.createElement('div');
            titleContainer.className = 'col-12 pb-1';

            // Agregar título de la sección
            const sectionTitle = document.createElement('strong');
            sectionTitle.className = 'text-start mb-1 d-block'; // Añadido d-block para que el título ocupe toda la fila
            sectionTitle.textContent = `Busca tus hamacas de categoría ${category.NOMBRE} aquí`;

            // Agregar el título al contenedor principal
            titleContainer.appendChild(sectionTitle);
            container.appendChild(titleContainer);

            // Se crea un carrusel por categoría
            const carouselId = `carousel-${category.ID}`;
            const carouselContainer = document.createElement('div');
            carouselContainer.className = 'col-12 mb-4'; // Añadido mb-4 para margen inferior

            // Crear el carrusel
            const carousel = document.createElement('div');
            carousel.className = 'carousel slide';
            carousel.id = carouselId;
            carousel.dataset.bsRide = 'carousel';

            let innerHTML = '';

            if (Array.isArray(products) && products.length > 0) {
                innerHTML = `
                    <div class="carousel-inner">
                `;
                // Agrupar productos en grupos de tres
                for (let i = 0; i < products.length; i += 3) {
                    innerHTML += `
                        <div class="carousel-item ${i === 0 ? 'active' : ''}">
                            <div class="row">
                    `;
                    // Mostrar hasta tres productos en cada grupo
                    for (let j = i; j < i + 3 && j < products.length; j++) {
                        const product = products[j];
                        innerHTML += `
                    <div class="col-lg-4 col-md-4 col-sm-12  text-center ">
                        <div class="card carta">
                            <img src="${SERVER_URL}imagenes/hamacas/${product.IMAGEN}" class="card-img-top correccion" alt="${product.NOMBRE} ">
                            <a href="detalle.html?id=${product.ID}" class="btn btn-outline-light position-absolute top-50 start-50 translate-middle">Ver detalle</a>
                            <div class="card-body">
                                <h5 class="card-title">${product.NOMBRE}</h5>
                                <p class="card-text">$${product.PRECIO}</p>
                            </div>
                        </div>
                    </div>
                    `;
                    }
                    innerHTML += `
                            </div>
                        </div>
                    `;
                }
                innerHTML += `
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Anterior</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Siguiente</span>
                    </button>
                `;
            } else {
                innerHTML = `<p>No hay productos disponibles para esta categoría.</p>`;
            }

            carousel.innerHTML = innerHTML;
            carouselContainer.appendChild(carousel);
            container.appendChild(carouselContainer);
        }
        dynamicCarousels.appendChild(container);
    } catch (error) {
        console.error('Error en la api:', error);
    }
}


// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    loadTemplate();
    // Carga los componentes de manera síncrona
    const carrouselHtml = await loadComponent('../componentes/inicio/carrusel_de_imagenes/carrusel.html');
    const categoriesHtml = await loadComponent('../componentes/inicio/categorias/categorias.html');
    const cardsHtml = await loadComponent('../componentes/inicio/cartas_de_productos_de_la_semana/cartas.html');
    // Agrega el HTML del encabezado
    appContainer.innerHTML += carrouselHtml + categoriesHtml + cardsHtml;
    dynamicCarousels = document.getElementById('dynamicCarousels');
    console.log(dynamicCarousels);
    cargarCategorias();
    cargar_productos_semanales();
    cargarProductosPorCategoria();
};
