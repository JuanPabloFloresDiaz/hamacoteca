<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../auxiliares/report.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;

// Se verifica si existe un valor para la categoría, de lo contrario se muestra un mensaje.
if (isset($_GET['fecha']) && isset($_GET['fechaFin'])) {
    require_once('../../modelos/data/pedidos_data.php');
    // Se instancia el módelo PedidosData para obtener los datos.
    $pedido = new PedidosData;
    
    // Se inicia el reporte con el encabezado del documento.
    $pdf->startReport('Pedidos por fecha');
    
    // Se establece el valor de la categoría, de lo contrario se muestra un mensaje.
    if ($pedido->setFechaInicial($_GET['fecha']) && $pedido->setFechaFinal($_GET['fechaFin'])) {
        $pdf->cell(0, 7, $pdf->encodeString('Fechas seleccionadas: de ' . $_GET['fecha'] . ' a ' . $_GET['fechaFin']), 0, 1, 'L');
        
        // Se establece un color de relleno para los encabezados.
        $pdf->setFillColor(154, 173, 233);
        // Se establece el color del borde.
        $pdf->setDrawColor(154, 173, 233);
        // Se establece la fuente para los encabezados.
        $pdf->setFont('Arial', 'B', 11);
        // Se imprimen las celdas con los encabezados.
        $pdf->cell(30, 15, 'Foto', 1, 0, 'C', 1);
        $pdf->cell(63, 15, 'Cliente', 1, 0, 'C', 1);
        $pdf->cell(63, 15, 'Direccion', 1, 0, 'C', 1);
        $pdf->cell(30, 15, 'Estado', 1, 1, 'C', 1);
        
        // Se establece la fuente para los datos de los pedidos.
        $pdf->setFont('Arial', '', 11);
        $pdf->setFillColor(240);
        
        // Se verifica si la categoría existe, de lo contrario se muestra un mensaje.
        if ($datapedidos = $pedido->pedidosPorFecha()) {
            foreach ($datapedidos as $rowpedido) {
                // Verifica si se ha creado una nueva página
                if ($pdf->getY() + 15 > 279 - 30) { // Ajusta este valor según el tamaño de tus celdas y la altura de la página
                    $pdf->addPage('P', [216, 279]); // Añade una nueva página
                    $pdf->setFillColor(154, 173, 233);
                    $pdf->setDrawColor(154, 173, 233);
                    $pdf->setFont('Arial', 'B', 11);
                    // Vuelve a imprimir los encabezados en la nueva página
                    $pdf->cell(30, 15, 'Foto', 1, 0, 'C', 1);
                    $pdf->cell(63, 15, 'Cliente', 1, 0, 'C', 1);
                    $pdf->cell(63, 15, 'Direccion', 1, 0, 'C', 1);
                    $pdf->cell(30, 15, 'Estado', 1, 1, 'C', 1);
                }
                
                $currentY = $pdf->getY(); // Obtén la coordenada Y actual
                $pdf->setFillColor(79, 171, 220);
                $pdf->setDrawColor(130, 196, 250);
                $pdf->setFont('Arial', 'B', 11);
                // Imprime las celdas con los datos y la imagen
                $pdf->setFillColor(255, 255, 255);
                $pdf->cell(30, 15, $pdf->image('../../imagenes/clientes/' . $rowpedido['FOTO'], $pdf->getX() + 10, $currentY + 2, 10), 1, 0);
                $pdf->cell(63, 15, $pdf->encodeString($rowpedido['CLIENTE']), 1, 0, 'C');
                $pdf->cell(63, 15, $pdf->encodeString($rowpedido['DIRECCION']), 1, 0, 'C');
                $pdf->cell(30, 15, $pdf->encodeString($rowpedido['ESTADO']), 1, 1, 'C');
            }
        } else {
            $pdf->cell(0, 15, $pdf->encodeString('No hay pedidos para la fecha seleccionada'), 1, 1);
        }
    } else {
        $pdf->cell(0, 15, $pdf->encodeString('Fecha incorrecta o inexistente'), 1, 1);
    }
} else {
    $pdf->cell(0, 10, $pdf->encodeString('No hay pedidos entregados para mostrar'), 1, 1);
}
// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'pedidos.pdf');
?>
