async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}
// Constantes para completar la ruta de la API.
const PRODUCTO_API = 'servicios/publica/hamaca.php';
const FOTO_API = 'servicios/publica/foto.php';
const FAVORITO_API = 'servicios/publica/favorito.php';
const PEDIDO_API = 'servicios/publica/pedido.php';
const VALORACIONES_API = 'servicios/publica/valoracion.php';
// Constante tipo objeto para obtener los parámetros disponibles en la URL.
const PARAMS = new URLSearchParams(location.search);

// Constante para establecer el formulario de agregar un producto al carrito de compras.
let SHOPPING_FORM,
    CANTIDAD;
let COMENTARIO_FORM,
    COMENTARIO,
    CALIFICACIÓN,
    PRODUCTO;
function validarCantidad(input) {
    // Obtener el valor ingresado como un número entero
    var valor = parseInt(input.value);
    // Verificar si el campo está vacío
    if (input.value === "") {
        // Establecer el valor predeterminado en 1
        input.value = 1;
    }
    // Verificar si el valor es negativo
    if (valor < 1) {
        // Si es negativo, establecer el valor como 1
        input.value = 1;
    }
}

async function cargarFotos() {
    const carouselInner = document.getElementById('carousel-inner');
    try {
        // Constante tipo objeto con los datos del producto seleccionado.
        const FORM = new FormData();
        FORM.append('idProducto', PARAMS.get('id'));

        // Petición para solicitar los datos del producto seleccionado.
        const DATA = await fetchData(FOTO_API, 'readAll', FORM);

        if (DATA.status) {
            let isActive = true;
            let itemsHtml = ''; // Almacena el HTML de cada slide
            let rowHtml = ''; // Almacena el HTML de cada fila
            let count = 0;

            // Mostrar fotos de productos obtenidos de la API
            DATA.dataset.forEach((product, index) => {
                rowHtml += `
                    <div class="col-4">
                        <img src="${SERVER_URL}imagenes/fotos/${product.IMAGEN}" class="d-block w-100" alt="${product.nombre_hamaca}">
                    </div>
                `;
                count++;

                // Cada tres imágenes, crea una nueva slide
                if (count === 3 || index === DATA.dataset.length - 1) {
                    itemsHtml += `
                        <div class="carousel-item ${isActive ? 'active' : ''}">
                            <div class="row">
                                ${rowHtml}
                            </div>
                        </div>
                    `;
                    rowHtml = ''; // Reinicia el HTML de la fila
                    count = 0; // Reinicia el contador
                    isActive = false; // Después del primer slide, todos los demás no serán activos
                }
            });

            carouselInner.innerHTML = itemsHtml; // Inserta todos los slides en el carrusel
        } else {
            const noPhotosHtml = `
                <div class="carousel-item active">
                    <div class="row">
                        <div class="col-12 text-center">
                            <p>No existen fotos extra de este producto</p>
                        </div>
                    </div>
                </div>
            `;
            carouselInner.innerHTML += noPhotosHtml;
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
    }
}
const listacomentarios = [
    {
        index: 1,
        nombre_usuario: 'Hamaca lover 3000',
        valoracion: '¡Me encanta mi nueva hamaca! Es muy cómoda y resistente. La calidad del tejido es excelente y los colores son hermosos. Definitivamente recomendaría este producto a cualquiera que esté buscando una hamaca de calidad.',
        urlfoto: '../../../recursos/img/foto.png',
        nota: 5
    },
    {
        index: 2,
        nombre_usuario: 'Hamaca hater 1000',
        valoracion: 'No estoy contento con mi compra. La hamaca que recibí no coincide con la descripción en el sitio web. La calidad del material es pobre y se ve muy frágil. Además, el proceso de entrega fue lento y la comunicación con el vendedor fue deficiente.',
        urlfoto: '../../../recursos/img/foto.png',
        nota: 1
    },
    {
        index: 3,
        nombre_usuario: 'Jhon Turner',
        valoracion: 'I am neither happy nor dissatisfied, they gave me what I expected.',
        urlfoto: '../../../recursos/img/foto.png',
        nota: 3
    },
];

async function cargarComentarios(listacomentarios = null) {
    const contenedorComentarios = document.getElementById('comentarios');
    try {
        // Constante tipo objeto con los datos del producto seleccionado.
        const FORM = new FormData();
        FORM.append('idProducto', PARAMS.get('id'));
        const data = await fetchData(VALORACIONES_API, 'readOne', FORM); // Asumiendo que el método `readOne` obtiene todos los comentarios
        listacomentarios = data.dataset;
        console.log(listacomentarios);

        // Mostrar cartas de productos obtenidos de la API
        contenedorComentarios.innerHTML = ''; // Limpiar contenedor de comentarios
        listacomentarios.forEach((valoracion, index) => {
            const valoracionHtml = `
            <div class="row g-0 carta-comentario">
                <div class="col-md-2 d-flex align-items-start p-2">
                    <img src="${SERVER_URL}imagenes/clientes/${valoracion.IMAGEN}" class="img-fluid circulo mt-3 ms-5 me-3" width="50px" height="50px" alt="${valoracion.nombre_usuario}">
                    <h5 class="card-title">${valoracion.NOMBRE}</h5>
                </div>
                <div class="col-md-10">
                    <div class="card-body d-flex align-items-start">
                        <div class="ms-5">
                            <p class="card-text">${valoracion.COMENTARIO}</p>
                            <p class="d-none" id="ratingValue">${valoracion.CALIFICACIÓN}</p>
                            <div class="rating pb-5">
                                <input type="radio" id="star5_${index}" name="rating_${index}" value="5"><label for="star5_${index}"></label>
                                <input type="radio" id="star4_${index}" name="rating_${index}" value="4"><label for="star4_${index}"></label>
                                <input type="radio" id="star3_${index}" name="rating_${index}" value="3"><label for="star3_${index}"></label>
                                <input type="radio" id="star2_${index}" name="rating_${index}" value="2"><label for="star2_${index}"></label>
                                <input type="radio" id="star1_${index}" name="rating_${index}" value="1"><label for="star1_${index}"></label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
            contenedorComentarios.innerHTML += valoracionHtml;
        });

        // Marcar las estrellas según la calificación
        listacomentarios.forEach((valoracion, index) => {
            const nota = valoracion.CALIFICACIÓN;
            if (nota) {
                document.getElementById(`star${nota}_${index}`).checked = true;
                // Desactivar las estrellas para que no sean interactivas
                for (let i = 1; i <= 5; i++) {
                    document.getElementById(`star${i}_${index}`).disabled = true;
                }
            }
        });
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
    }
}


async function cargarRecomendaciones() {
    const productCardsContainer = document.getElementById('product-cards');
    try {

        productCardsContainer.innerHTML = '';
        // Constante tipo objeto con los datos del producto seleccionado.
        const FORM = new FormData();
        FORM.append('idProducto', PARAMS.get('id'));
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(PRODUCTO_API, "readRecommended", FORM);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar cartas de productos obtenidos de la API
            DATA.dataset.forEach(product => {
                const cardHtml = `
                    <div class="col-lg-4 col-md-4 col-sm-12 text-center">
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

async function verifyFav() {
    const FORM = new FormData();
    FORM.append('idProducto', PARAMS.get('id'));

    const DATA = await fetchData(FAVORITO_API, 'verifySave', FORM);

    if (DATA.status) {
        const dataset = DATA.dataset;
        if (dataset.length > 0) {
            const VERIFICAR = parseInt(dataset[0].FAVORITO, 10);
            console.log("valor de verificar: " + VERIFICAR);

            const favButton = document.getElementById('favorito');
            if (VERIFICAR >= 1) {
                document.getElementById('icon-fav').classList.remove('bi-bookmark');
                document.getElementById('icon-fav').classList.add('bi-bookmark-fill');
            } else {
                document.getElementById('icon-fav').classList.remove('bi-bookmark-fill');
                document.getElementById('icon-fav').classList.add('bi-bookmark');
            }
        } else {
            document.getElementById('favorito').textContent = "Fallo en el dataset";
        }
    } else {
        document.getElementById('icon-fav').classList.add('bi-bookmark');
    }
}

async function verifyCart() {
    const FORM = new FormData();
    FORM.append('idProducto', PARAMS.get('id'));

    const DATA = await fetchData(PEDIDO_API, 'verifyCart', FORM);

    if (DATA.status) {
        const dataset = DATA.dataset;
        if (dataset.length > 0) {
            const VERIFICAR = parseInt(dataset[0].CARRITO, 10);
            console.log("valor de verificar: " + VERIFICAR);
            if (VERIFICAR >= 1) {
                document.getElementById('icon-cart').classList.remove('bi-cart-check');
                document.getElementById('icon-cart').classList.add('bi-cart-check-fill');
            } else {
                document.getElementById('icon-cart').classList.remove('bi-cart-check-fill');
                document.getElementById('icon-cart').classList.add('bi-cart-check');
            }
        } else {
            document.getElementById('carrito').textContent = "Fallo en el dataset";
        }
    } else {
        document.getElementById('icon-cart').classList.remove('bi-cart-check');
    }
}

async function openDetail() {
    // Constante tipo objeto con los datos del producto seleccionado.
    const FORM = new FormData();
    FORM.append('idProducto', PARAMS.get('id'));
    // Petición para solicitar los datos del producto seleccionado.
    const DATA = await fetchData(PRODUCTO_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se colocan los datos en la página web de acuerdo con el producto seleccionado previamente.
        document.getElementById('imagenProducto').src = SERVER_URL.concat('imagenes/hamacas/', DATA.dataset.IMAGEN);
        document.getElementById('nombreProducto').textContent = DATA.dataset.NOMBRE;
        document.getElementById('descripcionProducto').textContent = DATA.dataset.DESCRIPCION;
        document.getElementById('precioProducto').textContent = DATA.dataset.PRECIO;
        document.getElementById('existenciasProducto').textContent = DATA.dataset.CANTIDAD;
        document.getElementById('categoria').textContent = DATA.dataset.CATEGORIA;
        document.getElementById('material').textContent = DATA.dataset.MATERIAL;
        document.getElementById('idProducto').value = DATA.dataset.ID;
        document.getElementById('producto').value = DATA.dataset.ID;
        if (DATA.dataset.PROMEDIO > 0) {
            const ratingValue = parseFloat(DATA.dataset.PROMEDIO);
            document.getElementById('ratingValue').textContent = ratingValue.toFixed(2);

            const wholeStars = Math.floor(ratingValue);
            const fractionalPart = ratingValue - wholeStars;

            const starContainer = document.createElement('div');
            starContainer.classList.add('star-container');

            for (let i = 1; i <= 5; i++) {
                const star = document.createElement('div');
                star.classList.add('star');
                if (i <= wholeStars) {
                    star.classList.add('full');
                } else if (i === wholeStars + 1 && fractionalPart > 0) {
                    star.classList.add('half');
                }
                starContainer.appendChild(star);
            }

            const ratingElement = document.getElementById('rating');
            ratingElement.innerHTML = ''; // Limpiar cualquier contenido previo
            ratingElement.appendChild(starContainer);
        } else {
            document.getElementById('ratingValue').textContent = "No existen calificaciones aún para este producto";
            document.getElementById('rating').remove();
        }
    } else {
        // Se presenta un mensaje de error cuando no existen datos para mostrar.
        document.getElementById('mainTitle').textContent = DATA.error;
        // Se limpia el contenido cuando no hay datos para mostrar.
        document.getElementById('detalle').innerHTML = '';
    }
}


/*
*   Función asíncrona para cambiar el estado de un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const saveFavs = async () => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmUpdateAction('¿Desea manipular el estado del favorito?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idProducto', PARAMS.get('id'));
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(FAVORITO_API, 'favoriteSave', FORM);
        console.log(DATA.status);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra un mensaje de éxito.
            await sweetAlert(1, DATA.message, true);
            // Se carga nuevamente la tabla para visualizar los cambios.
            verifyFav();
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } else {
        console.error("ocurrio un error")
    }

}

// window.onload
window.onload = async function () {

    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    loadTemplate();
    // Carga los componentes de manera síncrona
    const detalleHtml = await loadComponent('../componentes/detalle_producto/producto/detalle_producto.html');
    const valoracionesHtml = await loadComponent('../componentes/detalle_producto/valoraciones/valoraciones.html');
    const recomendacionesHtml = await loadComponent('../componentes/detalle_producto/recomendaciones/recomendaciones.html');
    // Agrega el HTML del encabezado
    appContainer.innerHTML += `${detalleHtml}`;
    appContainer.innerHTML += `${valoracionesHtml}`;
    appContainer.innerHTML += `${recomendacionesHtml}`;

    openDetail();
    cargarFotos();
    cargarComentarios();
    cargarRecomendaciones();
    verifyFav();
    verifyCart();
    SHOPPING_FORM = document.getElementById('shoppingForm'),
        CANTIDAD = document.getElementById('quantityInputs');

    // Método del evento para cuando se envía el formulario de agregar un producto al carrito.
    SHOPPING_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SHOPPING_FORM);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(PEDIDO_API, 'manipulateDetail', FORM);
        try {
            // Se comprueba si la respuesta es satisfactoria, de lo contrario se constata si el cliente ha iniciado sesión.
            if (DATA.status) {
                sweetAlert(1, DATA.message, false, 'carrito.html');
            } else if (DATA.session) {
                sweetAlert(2, DATA.error, false);
            } else {
                sweetAlert(3, DATA.error, true, 'inicio_sesion.html');
            }
        } catch (error) {
            sweetAlert(3, "Debe iniciar sesión para agregar el producto al carrito", true, 'inicio_sesion.html');
        }
    });

    COMENTARIO_FORM = document.getElementById('comentarioForm');

    // Método del evento para cuando se envía el formulario de agregar un producto al carrito.
    COMENTARIO_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(COMENTARIO_FORM);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(VALORACIONES_API, 'createRow', FORM);
        try {
            // Se comprueba si la respuesta es satisfactoria, de lo contrario se constata si el cliente ha iniciado sesión.
            if (DATA.status) {
                sweetAlert(1, DATA.message, false);
                cargarComentarios();
                COMENTARIO_FORM.reset();
            } else {
                sweetAlert(3, DATA.exception, true);
            }
        } catch (error) {
            sweetAlert(3, "Debe iniciar sesión para hacer un comentario al producto", true);
        }
    });
};
