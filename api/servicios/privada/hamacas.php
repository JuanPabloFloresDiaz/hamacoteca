<?php
// Se incluye la clase del modelo.
require_once('../../modelos/data/hamacas_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $producto = new HamacasData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idAdministrador']) and Validator::validateSessionTime()) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
                // Buscar
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $producto->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
                // Crear
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$producto->setNombre($_POST['nombreHamaca']) or
                    !$producto->setDescripcion($_POST['descripcionHamaca']) or
                    !$producto->setExistencias($_POST['cantidadHamaca']) or
                    !$producto->setPrecio($_POST['precioHamaca']) or
                    !$producto->setCategoria($_POST['categorias']) or
                    !$producto->setMaterial($_POST['materiales']) or
                    !$producto->setImagen($_FILES['imagenHamaca'])
                ) {
                    $result['error'] = $producto->getDataError();
                } elseif ($producto->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Producto creado correctamente';
                    // Se asigna el estado del archivo después de insertar.
                    $result['fileStatus'] = Validator::saveFile($_FILES['imagenHamaca'], $producto::RUTA_IMAGEN);
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el producto';
                }
                break;
                // Leer todos
            case 'readAll':
                if ($result['dataset'] = $producto->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen productos registrados';
                }
                break;
                // Leer uno
            case 'readOne':
                if (!$producto->setId($_POST['idHamaca'])) {
                    $result['error'] = $producto->getDataError();
                } elseif ($result['dataset'] = $producto->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Producto inexistente';
                }
                break;
                // Actualizar
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$producto->setId($_POST['idHamaca']) or
                    !$producto->setFilename() or
                    !$producto->setNombre($_POST['nombreHamaca']) or
                    !$producto->setDescripcion($_POST['descripcionHamaca']) or
                    !$producto->setExistencias($_POST['cantidadHamaca']) or
                    !$producto->setPrecio($_POST['precioHamaca']) or
                    !$producto->setCategoria($_POST['categorias']) or
                    !$producto->setMaterial($_POST['materiales']) or
                    !$producto->setImagen($_FILES['imagenHamaca'], $producto->getFilename())
                ) {
                    $result['error'] = $producto->getDataError();
                } elseif ($producto->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Producto modificado correctamente';
                    // Se asigna el estado del archivo después de actualizar.
                    $result['fileStatus'] = Validator::changeFile($_FILES['imagenHamaca'], $producto::RUTA_IMAGEN, $producto->getFilename());
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el producto';
                }
                break;
                // Eliminar
            case 'deleteRow':
                if (
                    !$producto->setId($_POST['idHamaca']) or
                    !$producto->setFilename()
                ) {
                    $result['error'] = $producto->getDataError();
                } elseif ($producto->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Producto eliminado correctamente';
                    // Se asigna el estado del archivo después de eliminar.
                    $result['fileStatus'] = Validator::deleteFile($producto::RUTA_IMAGEN, $producto->getFilename());
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el producto';
                }
                break;
                // Estado
            case 'changeState':
                if (
                    !$producto->setId($_POST['idHamaca'])
                ) {
                    $result['error'] = $producto->getDataError();
                } elseif ($producto->changeState()) {
                    $result['status'] = 1;
                    $result['message'] = 'Estado del producto cambiado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al alterar el estado del administrador';
                }
                break;
                // Contar hamacas
            case 'totalProducts':
                if ($result['dataset'] = $producto->totalProducts()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Error en el conteo de ordenes';
                }
                break;
                // Contar productos por categoría
            case 'productsForCategory':
                if ($result['dataset'] = $producto->productsForCategory()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Error en el conteo de ordenes';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
        // Se obtiene la excepción del servidor de base de datos por si ocurrió un problema.
        $result['exception'] = Database::getException();
        // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
        header('Content-type: application/json; charset=utf-8');
        // Se imprime el resultado en formato JSON y se retorna al controlador.
        print(json_encode($result));
    } else {
        print(json_encode('Acceso denegado'));
    }
} else {
    print(json_encode('Recurso no disponible'));
}
