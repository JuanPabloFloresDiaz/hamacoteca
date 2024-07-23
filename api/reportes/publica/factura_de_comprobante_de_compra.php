<?php
require_once('../../auxiliares/invoice.php');
require_once('../../modelos/data/pedidos_data.php');

$pdf = new Invoice;
$pdf->startReport('Comprobante de compra');
$pedidos = new PedidosData;

if ($datapedidos = $pedidos->readDetailReport()) {
    $pdf->setFillColor(150, 219, 163);
    $pdf->setDrawColor(150, 219, 163);
    $pdf->setFont('Arial', 'B', 11);
    $pdf->cell(37, 15, 'Imagen', 1, 0, 'C', 1);
    $pdf->cell(63, 15, 'Producto', 1, 0, 'C', 1);
    $pdf->cell(25, 15, 'Cantidad', 1, 0, 'C', 1);
    $pdf->cell(30, 15, 'Precio (US$)', 1, 0, 'C', 1);
    $pdf->cell(30, 15, 'Subtotal (US$)', 1, 1, 'C', 1);

    $pdf->setFillColor(240);
    $pdf->setFont('Arial', '', 11);
    $total = 0;

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
        $subtotal = $rowpedidos['PRECIO'] * $rowpedidos['CANTIDAD'];
        $total += $subtotal;
        $currentY = $pdf->getY(); // Obtén la coordenada Y actual
        $pdf->setFillColor(79, 171, 220);
        $pdf->setDrawColor(72, 163, 85);
        $pdf->setFont('Arial', 'B', 11);
        // Imprime las celdas con los datos y la imagen
        $pdf->setFillColor(255, 255, 255);
        $pdf->cell(37, 15, $pdf->image('../../imagenes/hamacas/' . $rowpedidos['IMAGEN'], $pdf->getX() + 10, $currentY + 2, 10), 1, 0);
        $pdf->cell(63, 15, $pdf->encodeString($rowpedidos['NOMBRE']), 1, 0, 'C', false, 'http://localhost/hamacoteca/vistas/publica/paginas/detalle.html?id=' . $rowpedidos['IDP']);
        $pdf->cell(25, 15, $pdf->encodeString($rowpedidos['CANTIDAD']), 1, 0, 'C');
        $pdf->cell(30, 15, $pdf->encodeString('$' . $rowpedidos['PRECIO']), 1, 0, 'C');
        $pdf->cell(30, 15, '$' . $subtotal, 1, 1, 'C');
    }
    $pdf->setFont('Arial', 'B', 11);
    $pdf->setFillColor(255);
    $pdf->cell(125, 10, 'Factura a nombre de: ' . $pdf->encodeString($_SESSION['USERNAME']), 1, 0, 'C', 1);
    $pdf->cell(60, 10, 'Total: $' . $total, 1, 1, 'C', 1);
    $pdf->cell(125, 10, $pdf->encodeString('Dirección: ' . $_SESSION['direccionCliente']), 1, 0, 'C', 1);
    $pdf->cell(60, 10, 'DUI: ' . $pdf->encodeString($_SESSION['duiCliente']), 1, 1, 'C', 1);
} else {
    $pdf->cell(0, 15, $pdf->encodeString('No hay productos para mostrar'), 1, 1);
}

$pdf->output('I', 'factura.pdf');
// Guarda el PDF en un archivo temporal
$tempFile = tempnam(sys_get_temp_dir(), 'factura_') . '.pdf';
$pdf->output('F', $tempFile);

$titulo = 'Cliente ' . $_SESSION['USERNAME'];
$mensaje = 'Aquí puedes ver a detalle la factura';
$mailSubject = 'Tu pedido ha sido finalizado';
$mailAltBody = '¡Te saludamos de hamacoteca para confirmarte, que tu pedido';
$mailAltBody2 = ' ya ha sido finalizado y se te enviara a ' . $_SESSION['direccionCliente'] . '!';

// Cargar plantilla HTML
$template = file_get_contents('../../auxiliares/email/email.html');
// Reemplazar marcadores de posición con contenido dinámico
$mailBody = str_replace(
    ['{{subject}}', '{{title}}', '{{body}}', '{{bodytwo}}', '{{message}}'],
    [$mailSubject, $titulo, $mailAltBody, $mailAltBody2, $mensaje],
    $template
);

// Enviar el correo con el archivo adjunto
$mailSent = false;
try {
    $mailSent = Props::sendMail($_SESSION['correoCliente'], $mailSubject, $mailBody, $tempFile);
    return $mailSent;
} catch (Exception $e) {
    error_log('Error al enviar el correo: ' . $e->getMessage());
} finally {
    // Elimina el archivo temporal
    unlink($tempFile);
}
