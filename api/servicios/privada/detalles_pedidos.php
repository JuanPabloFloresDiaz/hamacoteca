<?php
// Se incluye la clase del modelo.
require_once('../../modelos/data/detalles_pedidos_data.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $pedido = new DetallesPedidosData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idAdministrador']) and Validator::validateSessionTime()) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
                // Leer detalles pedidos
            case 'readOne':
                if (!$pedido->setId($_POST['idPedido'])) {
                    $result['error'] = 'Pedido incorrecto';
                } elseif ($result['dataset'] = $pedido->readOne()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'Pedido inexistente';
                }
                break;
                // Mostrar años disponibles para ver ganancias
            case 'readYears':
                if ($result['dataset'] = $pedido->readYears()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Error en el conteo de ordenes';
                }
                break;
                // Contar ganancias por fecha
            case 'profitsForDate':
                if ($result['dataset'] = $pedido->profitsForDate()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Error en el conteo de ordenes';
                }
                break;
                // Gráfica de ganancias por categoría
            case 'salesByCategoryAndAveragePrice':
                if ($result['dataset'] = $pedido->salesByCategoryAndAveragePrice()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Error en el conteo de ordenes';
                }
                break;
            case 'profitsForYear':
                if (!$pedido->setAño($_POST['year'])) {
                    $result['error'] = 'Pedido incorrecto';
                } elseif ($result['dataset'] = $pedido->profitsForYear()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'Pedido inexistente';
                }
                break;
                // Predecir ganancias por mes
            case 'profitsForDatePrediction':
                if ($result['dataset'] = $pedido->profitsForDatePrediction()) {
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
