<?php
// Se incluye la clase del modelo.
require_once('../../modelos/data/hamacas_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se instancia la clase correspondiente.
    $producto = new HamacasData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null);
    // Se compara la acción a realizar según la petición del controlador.
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
            // Leer todos
        case 'readAll':
            if ($result['dataset'] = $producto->readAll()) {
                $result['status'] = 1;
                $result['message'] = 'Mostrando ' . count($result['dataset']) . ' productos';
            } else {
                $result['error'] = 'No existen productos registrados';
            }
            break;
            //Leer uno
        case 'readOne':
            if (!$producto->setId($_POST['idProducto'])) {
                $result['error'] = $producto->getDataError();
            } elseif ($result['dataset'] = $producto->readDetail()) {
                $result['status'] = 1;
            } else {
                $result['error'] = 'Producto inexistente';
            }
            break;
            //Leer mas vendidos
        case 'readMostSell':
            if ($result['dataset'] = $producto->readMostSell()) {
                $result['status'] = 1;
                $result['message'] = 'Mostrando ' . count($result['dataset']) . ' productos';
            } else {
                $result['error'] = 'No existen productos registrados';
            }
            break;
            //Filtrar productos
        case 'filterRows':
            $_POST = Validator::validateForm($_POST);
            if (
                !$producto->setCategorias($_POST['categorias']) or
                !$producto->setMateriales($_POST['materiales']) or
                !$producto->setMinimo($_POST['minimo']) or
                !$producto->setMaximo($_POST['maximo'])
            ) {
                $result['error'] = $producto->getDataError();
            } elseif ($result['dataset'] = $producto->filterRows()) {
                $result['status'] = 1;
                $result['message'] = 'Filtrando ' . count($result['dataset']) . ' productos';
            } else {
                $result['error'] = 'Producto inexistente';
            }
            break;
            // Leer productos por categoría 
        case 'readProductosCategoria':
            if (!$producto->setCategoria($_POST['idCategoria'])) {
                $result['error'] = $producto->getDataError();
            } elseif ($result['dataset'] = $producto->readProductosCategoria()) {
                $result['status'] = 1;
                $result['message'] = 'Mostrando ' . count($result['dataset']) . ' productos';
            } else {
                $result['error'] = 'No existen productos para mostrar';
            }
            break;
        default:
            $result['error'] = 'Acción no disponible';
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
