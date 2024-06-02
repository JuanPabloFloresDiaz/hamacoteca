<?php
// Se incluye la clase del modelo.
require_once('../../modelos/data/favoritos_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $favorito = new FavoritosData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'recaptcha' => 0, 'message' => null, 'error' => null, 'exception' => null, 'username' => null);
    // Se verifica si existe una sesión iniciada como cliente para realizar las acciones correspondientes.
    if (isset($_SESSION['idCliente'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un cliente ha iniciado sesión.
        switch ($_GET['action']) {
            case 'readAll':
                if ($result['dataset'] = $favorito->readAll()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No existen favoritos para mostrar';
                }
                break;
                // Leer favoritos
            case 'verifySave':
                if (!$favorito->setId($_POST['idProducto'])) {
                    $result['error'] = 'Hamaca incorrecta';
                } elseif ($result['dataset'] = $favorito->verifySave()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Favoritos inexistente';
                }
                break;
                // Crear
            case 'favoriteSave':
                $_POST = Validator::validateForm($_POST);
                if (!$favorito->setId($_POST['idProducto'])) {
                    $result['error'] = $favorito->getDataError();
                } else {
                    $duplicateCheck = $favorito->checkDuplicate();
                    if ($duplicateCheck['VERIFICAR'] > 0) {
                        $result['error'] = 'El producto ya está en favoritos';
                    } elseif ($favorito->createRow()) {
                        $result['status'] = 1;
                        $result['message'] = 'Producto agregado a favoritos correctamente';
                    } else {
                        $result['error'] = 'Ocurrió un problema al agregar el producto a favoritos';
                    }
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
    } else {
        print(json_encode('Acceso denegado'));
    }
    // Se obtiene la excepción del servidor de base de datos por si ocurrió un problema.
    $result['exception'] = Database::getException();
    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('Content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print(json_encode($result));
} else {
    print(json_encode('Recurso no disponible'));
}
