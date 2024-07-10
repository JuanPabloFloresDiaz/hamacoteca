<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../auxiliares/report.php');
require_once('../../modelos/data/hamacas_data.php');
// Se instancia la clase para crear el reporte.
$pdf = new Report;
// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Productos');
// Se instancia el módelo Categoría para obtener los datos.
$hamacas = new HamacasData;
// Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
if ($dataHamacas = $hamacas->readAll()) {
    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(255, 255, 255);
        $pdf->setDrawColor(130,196,250);
    // Se establece la fuente para los encabezados.
    $pdf->setFont('Arial', 'B', 11);
    // Se imprimen las celdas con los encabezados.
    $pdf->cell(37, 15, 'Imagen', 1, 0, 'C', 1);
    $pdf->cell(49, 15, 'Nombre', 1, 0, 'C', 1);
    $pdf->cell(25, 15, 'Cantidad', 1, 0, 'C', 1);
    $pdf->cell(37, 15, 'Precio (US$)', 1, 0, 'C', 1);
    $pdf->cell(37, 15, 'Estado', 1, 1, 'C', 1);

    // Se establece un color de relleno para mostrar el nombre de la categoría.
    $pdf->setFillColor(240);
    // Se establece la fuente para los datos de los productos.
    $pdf->setFont('Arial', '', 11);
    // Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.

    $y = 77;
    // Se recorren los registros fila por fila.
    foreach ($dataHamacas as $rowHamacas) {
        // Se imprimen las celdas con los datos de los pedidos.
        $pdf->cell(37, 15, $pdf->image('../../imagenes/hamacas/' . $rowHamacas['IMAGEN'], 29, $y, 10), 1, 0);
        $pdf->cell(49, 15, $pdf->encodeString($rowHamacas['NOMBRE']), 1, 0, 'C');
        $pdf->cell(25, 15, $pdf->encodeString($rowHamacas['CANTIDAD']), 1, 0, 'C');
        $pdf->cell(37, 15, $pdf->encodeString($rowHamacas['PRECIO']), 1, 0,'C');
        $pdf->cell(37, 15, $pdf->encodeString($rowHamacas['ESTADO']), 1, 1, 'C');
        $y += 15;
    }
} else {
    $pdf->cell(0, 15, $pdf->encodeString('No hay categorías para mostrar'), 1, 1);
}
// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'productos.pdf');
