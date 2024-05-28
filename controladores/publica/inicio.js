async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

// Constantes para completar la ruta de la API.
const PRODUCTOS_API = 'servicios/publica/hamaca.php';
const CATEGORIAS_API = 'servicios/publica/categoria.php';


async function cargar_productos_semanales() {
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
                         <h5 class="card-title">${product.NOMBRE}</h5>
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
    cargarCategorias();
    cargar_productos_semanales();
};
