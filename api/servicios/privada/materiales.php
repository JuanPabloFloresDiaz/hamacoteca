<?php
// Se incluye la clase del modelo.
require_once('../../modelos/data/materiales_data.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $material = new MaterialesData;
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
                } elseif ($result['dataset'] = $material->searchRows()) {
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
                    !$material->setNombre($_POST['nombreMaterial']) or
                    !$material->setDescripcion($_POST['descripcionMaterial']) or
                    !$material->setImagen($_FILES['imagenMaterial'])
                ) {
                    $result['error'] = $material->getDataError();
                } elseif ($material->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Material creada correctamente';
                    // Se asigna el estado del archivo después de insertar.
                    $result['fileStatus'] = Validator::saveFile($_FILES['imagenMaterial'], $material::RUTA_IMAGEN);
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el material';
                }
                break;
                // Leer todos
            case 'readAll':
                if ($result['dataset'] = $material->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No hay material registrado';
                }
                break;
                // Leer uno
            case 'readOne':
                if (!$material->setId($_POST['idMaterial'])) {
                    $result['error'] = $material->getDataError();
                } elseif ($result['dataset'] = $material->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Material inexistente';
                }
                break;
                // Actualizar
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$material->setId($_POST['idMaterial']) or
                    !$material->setNombre($_POST['nombreMaterial']) or
                    !$material->setDescripcion($_POST['descripcionMaterial']) or
                    !$material->setImagen($_FILES['imagenMaterial'], $material->getFilename())
                ) {
                    $result['error'] = $material->getDataError();
                } elseif ($material->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Material modificado correctamente';
                    // Se asigna el estado del archivo después de actualizar.
                    $result['fileStatus'] = Validator::changeFile($_FILES['imagenMaterial'], $material::RUTA_IMAGEN, $material->getFilename());
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el material';
                }
                break;
                // Eliminar
            case 'deleteRow':
                if (
                    !$material->setId($_POST['idMaterial']) or
                    !$material->setFilename()
                ) {
                    $result['error'] = $material->getDataError();
                } elseif ($material->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Material eliminada correctamente';
                    // Se asigna el estado del archivo después de eliminar.
                    $result['fileStatus'] = Validator::deleteFile($material::RUTA_IMAGEN, $material->getFilename());
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el material';
                }
                break;
              // Gráfica
              case 'graphic':
                if (
                    !$material->setId($_POST['idMaterial'])
                ) {
                    $result['error'] = $material->getDataError();
                } elseif ($result['dataset'] = $material->graphic()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Gráfica inexistente';
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
