async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

async function cargar_productos_semanales(){
    const listahamacas = [
        {
            nombre_producto: 'Hamaca',
            descripcion: '¡Descubre la comodidad y estilo de nuestras hamacas exclusivas! Sumérgete en la suave brisa del verano mientras te relajas en una de nuestras hermosas hamacas tejidas a mano. Desde diseños clásicos hasta modernos, nuestras hamacas están hechas con los mejores materiales para garantizar durabilidad y confort. Ya sea que busques el complemento perfecto para tu jardín, terraza o sala de estar, encontrarás la hamaca perfecta para ti en nuestra colección. ¡Aprovecha nuestras promociones especiales y haz de cada día un día de descanso y relax en una de nuestras hamacas!',
            urlfoto: '/recursos/img/hamaca 3.jpg',
            precio: 200 
        },
        {
            nombre_producto: 'Hamaca',
            descripcion: '¡Descubre la comodidad y estilo de nuestras hamacas exclusivas! Sumérgete en la suave brisa del verano mientras te relajas en una de nuestras hermosas hamacas tejidas a mano. Desde diseños clásicos hasta modernos, nuestras hamacas están hechas con los mejores materiales para garantizar durabilidad y confort. Ya sea que busques el complemento perfecto para tu jardín, terraza o sala de estar, encontrarás la hamaca perfecta para ti en nuestra colección. ¡Aprovecha nuestras promociones especiales y haz de cada día un día de descanso y relax en una de nuestras hamacas!',
            urlfoto: '/recursos/img/hamaca 3.jpg',
            precio: 200
        },
        {
            nombre_producto: 'Hamaca',
            descripcion: '¡Descubre la comodidad y estilo de nuestras hamacas exclusivas! Sumérgete en la suave brisa del verano mientras te relajas en una de nuestras hermosas hamacas tejidas a mano. Desde diseños clásicos hasta modernos, nuestras hamacas están hechas con los mejores materiales para garantizar durabilidad y confort. Ya sea que busques el complemento perfecto para tu jardín, terraza o sala de estar, encontrarás la hamaca perfecta para ti en nuestra colección. ¡Aprovecha nuestras promociones especiales y haz de cada día un día de descanso y relax en una de nuestras hamacas!',
            urlfoto: '/recursos/img/hamaca 3.jpg',
            precio: 200
        }
    ];

    const productCardsContainer = document.getElementById('product-cards');
    try {
        const response = await fetch(PRODUCTOS_API);
        if (!response.ok) {
            throw new Error('Error al obtener los datos de la API');
        }
        const data = await response.json();
        
        if (data && Array.isArray(data) && data.length > 0) {
            // Mostrar cartas de productos obtenidos de la API
            data.forEach(product => {
                const cardHtml = `
                    <div class="col text-center">
                        <div class="card carta">
                            <img src="${product.url}" class="card-img-top" alt="${product.nombre_hamaca}">
                            <div class="card-body">
                                <h5 class="card-title">${product.nombre_hamaca}</h5>
                                <p class="card-text">${product.precio}</p>
                            </div>
                        </div>
                    </div>
                `;
                productCardsContainer.innerHTML += cardHtml;
            });
        } else {
            throw new Error('La respuesta de la API no contiene datos válidos');
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        // Mostrar cartas de productos de respaldo
        listahamacas.forEach(product => {
            const cardHtml = `
                <div class="col text-center">
                    <div class="card carta">
                        <img src="${product.urlfoto}" class="card-img-top" alt="${product.nombre_producto}">
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

// Constantes para completar la ruta de la API.
const PRODUCTOS_API = '';

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('app');

    // Carga los componentes de manera síncrona
    const headerHtml = await loadComponent('../componentes/componentes_generales/barra_superior/barra_superior.html');
    const carrouselHtml = await loadComponent('../componentes/inicio/carrusel_de_imagenes/carrusel.html');
    const cardsHtml = await loadComponent('../componentes/inicio/cartas_de_productos_de_la_semana/cartas.html');
    const footerHtml = await loadComponent('../componentes/componentes_generales/barra_inferior/barra_inferior.html');
    // Agrega el HTML del encabezado
    appContainer.innerHTML += `${headerHtml}`;
    appContainer.innerHTML += carrouselHtml;
    appContainer.innerHTML += `${cardsHtml}`;
    appContainer.innerHTML += `${footerHtml}`;
    cargar_productos_semanales();

};
