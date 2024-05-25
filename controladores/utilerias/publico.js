/*
*   Controlador es de uso general en las páginas web del sitio público.
*   Sirve para manejar las plantillas del encabezado y pie del documento.
*/

// Constante para completar la ruta de la API.
const USER_API = 'servicios/publica/cliente.php';
// Constante para establecer el elemento del contenido principal.
const MAIN = document.querySelector('main');
MAIN.style.paddingTop = '';
MAIN.style.paddingBottom = '200px';

/*  Función asíncrona para cargar el encabezado y pie del documento.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const loadTemplate = async () => {
    // Petición para obtener en nombre del usuario que ha iniciado sesión.
    const DATA = await fetchData(USER_API, 'getUser');
    // Se comprueba si el usuario está autenticado para establecer el encabezado respectivo.
    if (DATA.session) {
        // Se verifica si la página web no es el inicio de sesión, de lo contrario se direcciona a la página web principal.
        if (!location.pathname.endsWith('inicio_sesion.html')) {
            // Se agrega el encabezado de la página web antes del contenido principal.
            MAIN.insertAdjacentHTML('beforebegin', `
            <header class="header">
            <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
                <div class="container">
                    <!-- Logo y nombre a la izquierda -->
                    <a class="navbar-brand" href="index.html">
                        <img src="../../../recursos/img/logo.png" alt="Logo de Hamacoteca" width="30" height="30"
                            class="d-inline-block align-top">
                        <strong class="tamaño-cabecera">HAMACOTECA</strong>
                    </a>
                    <!-- Botón de colapso para dispositivos móviles -->
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <!-- Contenido de la barra de navegación -->
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav mx-auto"> <!-- Utiliza mx-auto para centrar este bloque -->
                            <li class="nav-item">
                                <a class="nav-link active" aria-current="page"
                                    href="index.html">Inicio</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="tienda.html">Tienda</a>
                            </li>
                        </ul>
                        <!-- Íconos de usuario y carrito a la derecha -->
                        <ul class="navbar-nav">
                            <li class="nav-item">
                                <a class="nav-link" href="perfil.html">
                                <img src="../../../api/imagenes/clientes/${DATA.foto}" alt="Perfil" width="30" height="30"
                                class="borde-redondo">
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="carrito.html">
                                    <img src="../../../recursos/img/cart-icon.png" class="borde-redondo bg-dark"
                                        alt="Ícono de carrito de compras" width="30" height="30">
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            </header>
            `);
            // Se agrega el pie de la página web después del contenido principal.
            MAIN.insertAdjacentHTML('afterend', `
        <footer
        class="container-fluid d-md-flex bg-light bg-gradient justify-content-between align-items-center flex-wrap fixed-bottom">
        <!-- Imagen -->
        <img src="../../../recursos/img/flor_transparente.png" alt="..." height="75"
            class="d-none d-md-inline-block align-top col-md-auto order-md-2">
    
        <!-- Contenedor del contenido principal -->
        <div class='col-md-6 text-center text-md-start order-md-1'>
            <!-- Título y texto de Hamacoteca -->
            <h4 class='description-footer mb-0'>Hamacoteca</h4>
            <p>En Hamacoteca, combinamos la calidez de un servicio personalizado con la profesionalidad en la fabricación de
                hamacas de calidad. Diseñamos conforme a tus necesidades, brindando un toque único a tu hogar.</p>
        </div>
    
        <!-- Contenedor de los íconos -->
        <div class="col-md-6 text-start order-md-2">
            <!-- Iconos de redes sociales -->
            <div class="description-icons">
                <a class="icon-facebook m-1" href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-facebook"></i>
                </a>
                <a class="icon-x m-1" href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-x-twitter"></i>
                </a>
                <a class="icon-instagram" href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-instagram"></i>
                </a>
            </div>
        </div>
    
        <!-- Contenedor del texto de copyright y términos y condiciones -->
        <div class="col-md-6 order-md-3">
            <div class="terminos-condiciones mt-3 text-center">
                <p class="small">Copyright 2024 hamacoteca_sv@gmail.com. Todos los derechos reservados.</p>
            </div>
        </div>
        </footer>
    
        <button id="toggleFooterBtn" class="btn btn-light d-md-none fixed-bottom"><i class="bi bi-chevron-up"></i></button>
        `);
        } else {
            location.href = 'index.html';
        }
    } else {
        if (!location.pathname.endsWith('inicio_sesion.html') 
            && !location.pathname.endsWith('registro.html')
            && !location.pathname.endsWith('recuperacion.html')
            && !location.pathname.endsWith('codigo_verificacio.html')
            && !location.pathname.endsWith('cambiar_contra.html')) {
            // Se agrega el encabezado de la página web antes del contenido principal.
            MAIN.insertAdjacentHTML('beforebegin', `
        <header class="header">
        <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
            <div class="container">
                <!-- Logo y nombre a la izquierda -->
                <a class="navbar-brand" href="index.html">
                    <img src="../../../recursos/img/logo.png" alt="Logo de Hamacoteca" width="30" height="30"
                        class="d-inline-block align-top">
                    <strong class="tamaño-cabecera">HAMACOTECA</strong>
                </a>
                <!-- Botón de colapso para dispositivos móviles -->
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <!-- Contenido de la barra de navegación -->
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav mx-auto"> <!-- Utiliza mx-auto para centrar este bloque -->
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page"
                                href="index.html">Inicio</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="tienda.html">Tienda</a>
                        </li>
                    </ul>
                    <!-- Íconos de usuario y carrito a la derecha -->
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link" href="inicio_sesion.html">
                                <img src="../../../recursos/img/user-icon.png" class="borde-redondo bg-dark"
                                    alt="Ícono de usuario" width="30" height="30">
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="carrito.html">
                                <img src="../../../recursos/img/cart-icon.png" class="borde-redondo bg-dark"
                                    alt="Ícono de carrito de compras" width="30" height="30">
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        </header>
        `);
            // Se agrega el pie de la página web después del contenido principal.
            MAIN.insertAdjacentHTML('afterend', `
        <footer
        class="container-fluid d-md-flex bg-light bg-gradient justify-content-between align-items-center flex-wrap fixed-bottom">
        <!-- Imagen -->
        <img src="../../../recursos/img/flor_transparente.png" alt="..." height="75"
            class="d-none d-md-inline-block align-top col-md-auto order-md-2">
    
        <!-- Contenedor del contenido principal -->
        <div class='col-md-6 text-center text-md-start order-md-1'>
            <!-- Título y texto de Hamacoteca -->
            <h4 class='description-footer mb-0'>Hamacoteca</h4>
            <p>En Hamacoteca, combinamos la calidez de un servicio personalizado con la profesionalidad en la fabricación de
                hamacas de calidad. Diseñamos conforme a tus necesidades, brindando un toque único a tu hogar.</p>
        </div>
    
        <!-- Contenedor de los íconos -->
        <div class="col-md-6 text-start order-md-2">
            <!-- Iconos de redes sociales -->
            <div class="description-icons">
                <a class="icon-facebook m-1" href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-facebook"></i>
                </a>
                <a class="icon-x m-1" href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-x-twitter"></i>
                </a>
                <a class="icon-instagram" href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-instagram"></i>
                </a>
            </div>
        </div>
    
        <!-- Contenedor del texto de copyright y términos y condiciones -->
        <div class="col-md-6 order-md-3">
            <div class="terminos-condiciones mt-3 text-center">
                <p class="small">Copyright 2024 hamacoteca_sv@gmail.com. Todos los derechos reservados.</p>
            </div>
        </div>
        </footer>
    
        <button id="toggleFooterBtn" class="btn btn-light d-md-none fixed-bottom"><i class="bi bi-chevron-up"></i></button>
        `);
        } else {
            MAIN.style.paddingTop = '200px';
            // Se agrega el encabezado de la página web antes del contenido principal.
            MAIN.insertAdjacentHTML('beforebegin', `
                <header class="header">
                <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
                    <div class="container">
                        <!-- Logo y nombre a la izquierda -->
                        <a class="navbar-brand" href="index.html">
                            <img src="../../../recursos/img/logo.png" alt="Logo de Hamacoteca" width="30" height="30"
                                class="d-inline-block align-top">
                            <strong class="tamaño-cabecera">HAMACOTECA</strong>
                        </a>
                        <!-- Botón de colapso para dispositivos móviles -->
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <!-- Contenido de la barra de navegación -->
                        <div class="collapse navbar-collapse" id="navbarNav">
                            <ul class="navbar-nav mx-auto"> <!-- Utiliza mx-auto para centrar este bloque -->
                                <li class="nav-item">
                                    <a class="nav-link active" aria-current="page"
                                        href="index.html">Inicio</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="tienda.html">Tienda</a>
                                </li>
                            </ul>
                            <!-- Íconos de usuario y carrito a la derecha -->
                            <ul class="navbar-nav">
                                <li class="nav-item">
                                    <a class="nav-link" href="inicio_sesion.html">
                                        <img src="../../../recursos/img/user-icon.png" class="borde-redondo bg-dark"
                                            alt="Ícono de usuario" width="30" height="30">
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="carrito.html">
                                        <img src="../../../recursos/img/cart-icon.png" class="borde-redondo bg-dark"
                                            alt="Ícono de carrito de compras" width="30" height="30">
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                </header>
                `);
        }
    }

    document.getElementById('toggleFooterBtn').addEventListener('click', function () {
        var footer = document.querySelector('footer');
        footer.classList.toggle('d-none');
    });
}