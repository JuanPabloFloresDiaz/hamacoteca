<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../auxiliares/report.php');
// Se incluyen las clases para la transferencia y acceso a datos.
require_once('../../modelos/data/hamacas_data.php');
require_once('../../modelos/data/categorias_data.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;

// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Hamacas por categoría');

// Se instancia el modelo Categoría para obtener los datos.
$categoria = new CategoriasData;

// Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
if ($dataCategorias = $categoria->readAll()) {
    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(154, 173, 233);
    // Se establece el color del borde.
    $pdf->setDrawColor(154, 173, 233);
    // Se establece la fuente para los encabezados.
    $pdf->setFont('Arial', 'B', 11);
    // Se imprimen las celdas con los encabezados.
    // Explicación de funcionamiento de los valores de las celdas: 
    // (Ancho, Alto, Texto, Borde, Salto de linea, Alineación (Centrado = C, Izquierda = L, Derecha = R), Fondo, Link)
    $pdf->cell(30, 10, 'Imagen', 1, 0, 'C', 1); // Nueva columna para imagen
    $pdf->cell(90, 10, 'Nombre', 1, 0, 'C', 1);
    $pdf->cell(30, 10, 'Precio (US$)', 1, 0, 'C', 1);
    $pdf->cell(30, 10, 'Estado', 1, 1, 'C', 1);

    // Se establece un color de relleno para mostrar el nombre de la categoría.
    $pdf->setFillColor(240);
    // Se establece la fuente para los datos de los productos.
    $pdf->setFont('Arial', '', 11);

    // Se recorren los registros fila por fila.
    foreach ($dataCategorias as $rowCategoria) {
        // Verifica si se ha creado una nueva página
        if ($pdf->getY() + 15 > 279 - 30) { // Ajusta este valor según el tamaño de tus celdas y la altura de la página
            $pdf->addPage('P', 'Letter'); // Añade una nueva página y con letter se define de tamaño carta
            $pdf->setFillColor(154, 173, 233);
            $pdf->setDrawColor(154, 173, 233);
            $pdf->setFont('Arial', 'B', 11);
            // Vuelve a imprimir los encabezados en la nueva página
            $pdf->cell(30, 10, 'Imagen', 1, 0, 'C', 1);
            $pdf->cell(90, 10, 'Nombre', 1, 0, 'C', 1);
            $pdf->cell(30, 10, 'Precio (US$)', 1, 0, 'C', 1);
            $pdf->cell(30, 10, 'Estado', 1, 1, 'C', 1);
        }

        $pdf->setFillColor(154, 173, 233);
        $pdf->setDrawColor(154, 173, 233);
        $pdf->setFont('Arial', 'B', 11);
        // Imprime una celda con el nombre de la categoría.
        $pdf->cell(180, 10, $pdf->encodeString('Categoría: ' . $rowCategoria['NOMBRE']), 1, 1, 'C', 1);

        // Se instancia el modelo Producto para procesar los datos.
        $producto = new HamacasData;
        // Se establece la categoría para obtener sus productos, de lo contrario se imprime un mensaje de error.
        if ($producto->setCategoria($rowCategoria['ID'])) {
            // Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
            if ($dataProductos = $producto->productosCategoria()) {
                foreach ($dataProductos as $rowProducto) {
                    ($rowProducto['estado_venta']) ? $estado = 'Disponible' : $estado = 'No disponible';
                    // Verifica si se ha creado una nueva página
                    if ($pdf->getY() + 15 > 279 - 30) { // Ajusta este valor según el tamaño de tus celdas y la altura de la página
                        $pdf->addPage('P', 'Letter'); // Añade una nueva página y con letter se define de tamaño carta
                        $pdf->setFillColor(154, 173, 233);
                        $pdf->setDrawColor(154, 173, 233);
                        $pdf->setFont('Arial', 'B', 11);
                        // Vuelve a imprimir los encabezados en la nueva página
                        $pdf->cell(30, 10, 'Imagen', 1, 0, 'C', 1);
                        $pdf->cell(90, 10, 'Nombre', 1, 0, 'C', 1);
                        $pdf->cell(30, 10, 'Precio (US$)', 1, 0, 'C', 1);
                        $pdf->cell(30, 10, 'Estado', 1, 1, 'C', 1);
                    }

                    $currentY = $pdf->getY(); // Obtén la coordenada Y actual
                    // Se establacen los colores de las celdas
                    $pdf->setDrawColor(130, 196, 250);
                    $pdf->setFont('Arial', 'B', 11);
                    $pdf->setFillColor(255, 255, 255);
                    // Imprime las celdas con los datos y la imagen
                    $pdf->cell(30, 15, $pdf->image('../../imagenes/hamacas/' . $rowProducto['foto_principal'], $pdf->getX() + 10, $currentY + 2, 10), 1, 0);
                    // Imprime las celdas con los datos del producto.
                    $pdf->cell(90, 15, $pdf->encodeString($rowProducto['nombre_hamaca']), 1, 0, 'C', false, 'http://hamacoteca.online/hamacoteca/vistas/publica/paginas/detalle.html?id=' . $rowProducto['ID']);
                    $pdf->cell(30, 15, $rowProducto['precio'], 1, 0);
                    $pdf->cell(30, 15, $estado, 1, 1);
                }
            } else {
                $pdf->cell(0, 10, $pdf->encodeString('No hay productos para la categoría'), 1, 1);
            }
        } else {
            $pdf->cell(0, 10, $pdf->encodeString('Categoría incorrecta o inexistente'), 1, 1);
        }
    }
} else {
    $pdf->cell(0, 10, $pdf->encodeString('No hay categorías para mostrar'), 1, 1);
}

// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'productos.pdf');
