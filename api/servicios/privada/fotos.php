<?php
// Se incluye la clase del modelo.
require_once('../../modelos/data/fotos_data.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $foto = new FotosData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idAdministrador']) and Validator::validateSessionTime()) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $foto->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$foto->setHamaca($_POST['idHamacas']) or
                    !$foto->setImagen($_FILES['inputFoto'])
                ) {
                    $result['error'] = $foto->getDataError();
                } elseif ($foto->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Foto creada correctamente';
                    // Se asigna el estado del archivo después de insertar.
                    $result['fileStatus'] = Validator::saveFile($_FILES['inputFoto'], $foto::RUTA_IMAGEN);
                } else {
                    $result['error'] = 'Ocurrió un problema al crear la foto';
                }
                break;
                case 'readAll':
                    if (!$foto->setHamaca($_POST['idHamaca'])) {
                        $result['error'] = 'Hamaca incorrecta';
                    } elseif ($result['dataset'] = $foto->readAll()) {
                        $result['status'] = 1;
                        $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                    } else {
                        $result['error'] = 'Hamaca inexistente';
                    }
                    break;
            case 'readOne':
                if (!$foto->setId($_POST['idFoto'])) {
                    $result['error'] = $foto->getDataError();
                } elseif ($result['dataset'] = $foto->readOne()) {
                    $result['status'] = 1;
                    $result['message'] = 'Se selecciono una foto correctamente';
                } else {
                    $result['error'] = 'Foto inexistente';
                }
                break;
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$foto->setId($_POST['idFoto']) or
                    !$foto->setHamaca($_POST['idHamacas']) or
                    !$foto->setImagen($_FILES['inputFoto'], $foto->getFilename())
                ) {
                    $result['error'] = $foto->getDataError();
                } elseif ($foto->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Foto modificada correctamente';
                    // Se asigna el estado del archivo después de actualizar.
                    $result['fileStatus'] = Validator::changeFile($_FILES['inputFoto'], $foto::RUTA_IMAGEN, $foto->getFilename());
                
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar la foto';
                }
                break;
            case 'deleteRow':
                if (
                    !$foto->setId($_POST['idFoto']) or
                    !$foto->setFilename()
                ) {
                    $result['error'] = $foto->getDataError();
                } elseif ($foto->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Foto eliminada correctamente';
                    // Se asigna el estado del archivo después de eliminar.
                    $result['fileStatus'] = Validator::deleteFile($foto::RUTA_IMAGEN, $foto->getFilename());
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar la foto';
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
