/*
*   Controlador de uso general en las páginas web del sitio privado.
*   Sirve para manejar la plantilla del encabezado y pie del documento.
*/

// Constante para completar la ruta de la API.
const USER_API = 'servicios/privada/administradores.php';
// Constante para establecer el elemento del contenido principal.
const MAIN = document.querySelector('main');

/*  Función asíncrona para cargar el encabezado y pie del documento.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const loadTemplate = async () => {
    // Petición para obtener en nombre del usuario que ha iniciado sesión.
    const DATA = await fetchData(USER_API, 'getUser');
    // Se verifica si el usuario está autenticado, de lo contrario se envía a iniciar sesión.
    if (DATA.session ) {
        // Se comprueba si existe un alias definido para el usuario, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            console.log(DATA);
            // Se agrega el encabezado de la página web antes del contenido principal.
            MAIN.insertAdjacentHTML('beforebegin', `
            <header class="header">
            <nav class="navbar navbar-expand-lg fixed-top">
                <div class="container-fluid">
                    <!-- Botón con icono en la parte izquierda -->
                    <button type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample"
                        aria-controls="offcanvasExample">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <!-- Logo y nombre a la izquierda -->
                    <a class="navbar-brand" href="dashboard.html">
                        <img src="../../../recursos/img/logo.png" alt="Logo de Hamacoteca" width="30" height="30"
                            class="d-inline-block align-top">
                        <strong class="tamaño-cabecera">HAMACOTECA</strong>
                    </a>
        
                    <div class="pastilla">
                        <span class="navbar-text ms-3">
                             ${DATA.username}
                        </span>
                        <img src="../../../recursos/img/foto.png" alt="Logo de Hamacoteca" width="30" height="30"
                            class="ms-3 me-3 d-inline-block align-top rounded-circle">
                    </div>
        
                </div>
            </nav>
        </header>
        
        
        <!-- Offcanvas -->
        <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="offcanvasExampleLabel">Menú</h5>
                <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <ul class="navbar-nav flex-column">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="dashboard.html"><i
                                class="bi bi-speedometer2 me-2"></i>Dashboard</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            <i class="bi bi-box me-2"></i>Productos
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><a class="dropdown-item" href="productos.html">Hamacas</a>
                            </li>
                            <li><a class="dropdown-item" href="materiales.html">Materiales</a></li>
                            <li><a class="dropdown-item" href="categoria.html">Categorías</a></li>
                            <li><a class="dropdown-item" href="valoraciones.html">Valoraciones</a>
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            <i class="bi bi-cart me-2"></i>Pedidos
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><a class="dropdown-item" href="lista_pedido.html">Lista de
                                    pedidos</a></li>
                            <li><a class="dropdown-item" href="historial_pedidos.html">Historial de
                                    pedidos</a></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            <i class="bi bi-person me-2"></i>Usuarios
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><a class="dropdown-item" href="administradores.html">Administradores</a></li>
                            <li><a class="dropdown-item" href="clientes.html">Clientes</a>
                            </li>
                            <li><a class="dropdown-item" href="roles_administradores.html">Roles de
                                    administradores</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="configuracion.html"><i class="bi bi-gear me-2"></i>Configuraciones</a>
                    </li>
                </ul>
                <ul class="navbar-nav flex-column fixed-bottom m-3 w-25">
                    <!-- Nuevas pantallas -->
                    <li class="nav-item">
                        <a class="nav-link" href="" data-bs-toggle="modal" data-bs-target="#modalAyuda"><i
                                class="bi bi-question-circle me-2"></i>Ayuda</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="" data-bs-toggle="modal" data-bs-target="#modalContactanos"><i
                                class="bi bi-chat-dots me-2"></i>Contáctanos</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-danger" href="#" onclick="logOut()"><i
                                class="bi bi-door-closed me-2 text-danger"></i>Cerrar sesión</a>
                    </li>
                </ul>
                <!-- Contenido del offcanvas aquí -->
                <!-- Puedes colocar enlaces de navegación u otros elementos aquí -->
            </div>
        </div>
        <!-- Modal Ayuda -->
        <div class="modal fade" id="modalAyuda" tabindex="-1" aria-labelledby="modalAyudaLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <i class="bi bi-question-circle-fill text-primary fs-3"></i>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <h3 class="modal-title mb-2" id="modalAyudaLabel">Ayuda</h3>
                        Si necesitas ayuda con el funcionamiento del sistema, no dudes en contactar con nuestro equipo de
                        soporte
                        técnico. Puedes enviar un correo electrónico a soportehamacoteca@gmail.com o llamar al número 5451-5896.
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Aceptar</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Modal Contactanos -->
        <div class="modal fade" id="modalContactanos" tabindex="-1" aria-labelledby="modalContactanosLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <i class="bi bi-chat-dots-fill text-primary fs-3"></i>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <h3 class="modal-title mb-2" id="modalContactanosLabel">Contáctanos</h3>
                        En caso de cualquier problema contacte con el siguinete número: 5451-5896
                        o escribe a este correo: hamacotecasv@gmail.com.
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Aceptar</button>
                    </div>
                </div>
            </div>
        </div>
            `);
        } else {
            sweetAlert(3, DATA.error, false, 'index.html');
        }
    } else {
        // Se comprueba si la página web es la principal, de lo contrario se direcciona a iniciar sesión.
        if (location.pathname.endsWith('index.html')) {

        } else {
            location.href = 'index.html';
        }
    }
}