<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../auxiliares/report.php');
require_once('../../modelos/data/pedidos_data.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;
// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Pedidos por fecha');
// Se instancia el módelo Categoría para obtener los datos.
$pedido = new PedidosData;
// Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
if ($datapedidos = $pedido->readAll()) {
    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(200);
    // Se establece la fuente para los encabezados.
    $pdf->setFont('Arial', 'B', 11);
    // Se imprimen las celdas con los encabezados.
    $pdf->cell(40, 10, 'Fecha', 1, 0, 'C', 1);
    $pdf->cell(51, 10, 'Cliente', 1, 0, 'C', 1);
    $pdf->cell(55, 10, 'Direccion', 1, 0, 'C', 1);
    $pdf->cell(40, 10, 'Estado', 1, 1, 'C', 1);

    // Se establece un color de relleno para mostrar el nombre de la categoría.
    $pdf->setFillColor(240);
    // Se establece la fuente para los datos de los pedidos.
    $pdf->setFont('Arial', '', 11);

    // Se recorren los registros fila por fila.
    foreach ($datapedidos as $rowpedido) {
        // Se imprime una celda con el nombre de la categoría.
        $pdf->cell(0, 10, $pdf->encodeString('Pedido del: ' . $rowpedido['FECHA']), 1, 1, 'C', 1);
        // Se establece la categoría para obtener sus pedidos, de lo contrario se imprime un mensaje de error.
        if ($pedido->setFecha($rowpedido['FECHA'])) {
            // Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
            if ($datapedidos = $pedido->pedidosPorFecha()) {
                // Se recorren los registros fila por fila.
                foreach ($datapedidos as $rowpedido) {
                    ($rowpedido['ESTADO']) ? $estado = 'Activo' : $estado = 'Inactivo';
                    // Se imprimen las celdas con los datos de los pedidos.
                    $pdf->cell(40, 10, $pdf->encodeString($rowpedido['FECHA']), 1, 0);
                    $pdf->cell(51, 10, $pdf->encodeString($rowpedido['CLIENTE']), 1, 0);
                    $pdf->cell(55, 10, $pdf->encodeString($rowpedido['DIRECCION']), 1, 0);
                    $pdf->cell(40, 10, $pdf->encodeString($rowpedido['ESTADO']), 1, 0);
                }
            } else {
                $pdf->cell(0, 10, $pdf->encodeString('No hay pedidos para la fecha seleccionada'), 1, 1);
            }
        } else {
            $pdf->cell(0, 10, $pdf->encodeString('Pedido incorrecto o inexistente'), 1, 1);
        }
    }
} else {
    $pdf->cell(0, 10, $pdf->encodeString('No hay pedidos para mostrar'), 1, 1);
}
// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'pedidos.pdf');
