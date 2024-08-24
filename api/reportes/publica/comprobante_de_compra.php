<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../auxiliares/invoice.php');

// Se instancia la clase para crear el reporte.
$pdf = new Invoice;
// Se verifica si existe un valor para la categoría, de lo contrario se muestra un mensaje.
if (isset($_GET['id'])) {
    // Se incluyen las clases para la transferencia y acceso a datos.
    require_once('../../modelos/data/pedidos_data.php');
    // Se instancia el módelo PedidosData para obtener los datos.
    $pedidos = new PedidosData;

    // Se inicia el reporte con el encabezado del documento.
    $pdf->startReport('Comprobante de compra');
    // Se verifica si existe un valor para las fechas de forma correcta, de lo contrario se muestra un mensaje.
    if ($pedidos->setIdPedido($_GET['id'])) {
        // Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
        if ($datapedidos = $pedidos->readDetailReportHistory()) {
            // Se establece un color de relleno para los encabezados.
            $pdf->setFillColor(150, 219, 163);
            // Se establece el color del borde.
            $pdf->setDrawColor(150, 219, 163);
            // Se establece la fuente para los encabezados.
            $pdf->setFont('Arial', 'B', 11);
            // Se imprimen las celdas con los encabezados.
            // Explicación de funcionamiento de los valores de las celdas: 
            // (Ancho, Alto, Texto, Borde, Salto de linea, Alineación (Centrado = C, Izquierda = L, Derecha = R), Fondo, Link)
            $pdf->cell(37, 15, 'Imagen', 1, 0, 'C', 1);
            $pdf->cell(63, 15, 'Producto', 1, 0, 'C', 1);
            $pdf->cell(25, 15, 'Cantidad', 1, 0, 'C', 1);
            $pdf->cell(30, 15, 'Precio (US$)', 1, 0, 'C', 1);
            $pdf->cell(30, 15, 'Subtotal (US$)', 1, 1, 'C', 1);

            // Se establece la fuente para los datos de los pedidos.
            $pdf->setFillColor(240);
            $pdf->setFont('Arial', '', 11);
            // Se establece la variable de total en 0 para su uso mas adelante.
            $total = 0;

            // Se verifica si existen pedidos, de lo contrario se muestra un mensaje.
            foreach ($datapedidos as $rowpedidos) {
                // Verifica si se ha creado una nueva página
                if ($pdf->getY() + 15 > 279 - 30) { // Ajusta este valor según el tamaño de tus celdas y la altura de la página
                    $pdf->addPage('P', 'Letter'); // Añade una nueva página y con letter se define de tamaño carta
                    $pdf->setFillColor(150, 219, 163);
                    $pdf->setDrawColor(150, 219, 163);
                    $pdf->setFont('Arial', 'B', 11);
                    // Vuelve a imprimir los encabezados en la nueva página
                    $pdf->cell(37, 15, 'Imagen', 1, 0, 'C', 1);
                    $pdf->cell(63, 15, 'Producto', 1, 0, 'C', 1);
                    $pdf->cell(25, 15, 'Cantidad', 1, 0, 'C', 1);
                    $pdf->cell(30, 15, 'Precio (US$)', 1, 0, 'C', 1);
                    $pdf->cell(30, 15, 'Subtotal (US$)', 1, 1, 'C', 1);
                }
                // Se establece el valor del subtotal multiplicando el precio por la cantidad.
                $subtotal = $rowpedidos['PRECIO'] * $rowpedidos['CANTIDAD'];
                // Se establece el valor del total, como la suma de todos los subtotales.
                $total += $subtotal;
                $currentY = $pdf->getY(); // Obtén la coordenada Y actual
                $pdf->setFillColor(79, 171, 220);
                // Se establacen los colores de las celdas
                $pdf->setDrawColor(72, 163, 85);
                $pdf->setFont('Arial', 'B', 11);
                // Imprime las celdas con los datos y la imagen
                $pdf->setFillColor(255, 255, 255);
                $pdf->cell(37, 15, $pdf->image('../../imagenes/hamacas/' . $rowpedidos['IMAGEN'], $pdf->getX() + 10, $currentY + 2, 10), 1, 0);
                $pdf->cell(63, 15, $pdf->encodeString($rowpedidos['NOMBRE']), 1, 0, 'C', false, 'http://hamacoteca.online/hamacoteca/vistas/publica/paginas/detalle.html?id=' . $rowpedidos['IDP']);
                $pdf->cell(25, 15, $pdf->encodeString($rowpedidos['CANTIDAD']), 1, 0, 'C');
                $pdf->cell(30, 15, $pdf->encodeString('$' . $rowpedidos['PRECIO']), 1, 0, 'C');
                $pdf->cell(30, 15, '$' . $subtotal, 1, 1, 'C');
            }
            // Imprime las celdas con los datos del cliente que genero la factura
            $pdf->setFont('Arial', 'B', 11);
            $pdf->setFillColor(255);
            $pdf->cell(125, 10, 'Factura a nombre de: ' . $pdf->encodeString($_SESSION['USERNAME']), 1, 0, 'C', 1);
            $pdf->cell(60, 10, 'Total: $' . $total, 1, 1, 'C', 1);
            $pdf->cell(125, 10, $pdf->encodeString('Dirección: ' . $_SESSION['direccionCliente']), 1, 0, 'C', 1);
            $pdf->cell(60, 10, 'DUI: ' . $pdf->encodeString($_SESSION['duiCliente']), 1, 1, 'C', 1);
        } else {
            $pdf->cell(0, 15, $pdf->encodeString('No hay productos para mostrar'), 1, 1);
        }
    } else {
        $pdf->cell(0, 15, $pdf->encodeString('No hay detalle para el pedido elegido'), 1, 1);
    }
} else {
    $pdf->cell(0, 10, $pdf->encodeString('No hay detalles para el pedido'), 1, 1);
}
// Se llama implícitamente al método footer() y se envía el documento al navegador web.
header('Content-type: application/pdf');
$pdf->output('I', 'factura.pdf');
