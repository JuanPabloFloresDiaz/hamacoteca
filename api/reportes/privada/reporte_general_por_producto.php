<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../auxiliares/report.php');
// Se incluye la clase con la que se asignaran los datos para generar reportes.
require_once('../../modelos/data/hamacas_data.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;
// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Productos');
// Se instancia el módelo HamacasData para obtener los datos.
$hamacas = new HamacasData;

// Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
if ($dataHamacas = $hamacas->readAll()) {
    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(154, 173, 233);
    // Se establece el color del borde.
    $pdf->setDrawColor(154, 173, 233);
    // Se establece la fuente para los encabezados.
    $pdf->setFont('Arial', 'B', 11);
    // Se imprimen las celdas con los encabezados.
    // Explicación de funcionamiento de los valores de las celdas: 
    // (Ancho, Alto, Texto, Borde, Salto de linea, Alineación (Centrado = C, Izquierda = L, Derecha = R), Fondo, Link)
    $pdf->cell(37, 15, 'Imagen', 1, 0, 'C', 1);
    $pdf->cell(63, 15, 'Nombre', 1, 0, 'C', 1);
    $pdf->cell(25, 15, 'Cantidad', 1, 0, 'C', 1);
    $pdf->cell(30, 15, 'Precio (US$)', 1, 0, 'C', 1);
    $pdf->cell(30, 15, 'Estado', 1, 1, 'C', 1);

    $pdf->setFillColor(240);
    // Se establece la fuente para los datos de los productos.
    $pdf->setFont('Arial', '', 11);

    // Se verifica si existen hamacas y se recorren los registros por fila, de lo contrario se muestra un mensaje.
    foreach ($dataHamacas as $rowHamacas) {
        // Verifica si se ha creado una nueva página
        if ($pdf->getY() + 15 > 279 - 30) { // Ajusta este valor según el tamaño de tus celdas y la altura de la página
            $pdf->addPage('P', 'Letter'); // Añade una nueva página y con letter se define de tamaño carta
            $pdf->setFillColor(154, 173, 233);
            $pdf->setDrawColor(154, 173, 233);
            $pdf->setFont('Arial', 'B', 11);
            // Vuelve a imprimir los encabezados en la nueva página
            $pdf->cell(37, 15, 'Imagen', 1, 0, 'C', 1);
            $pdf->cell(63, 15, 'Nombre', 1, 0, 'C', 1);
            $pdf->cell(25, 15, 'Cantidad', 1, 0, 'C', 1);
            $pdf->cell(30, 15, 'Precio (US$)', 1, 0, 'C', 1);
            $pdf->cell(30, 15, 'Estado', 1, 1, 'C', 1);
        }

        $currentY = $pdf->getY(); // Obtén la coordenada Y actual
        // Se establacen los colores de las celdas
        $pdf->setFillColor(79, 171, 220);
        $pdf->setDrawColor(130, 196, 250);
        $pdf->setFont('Arial', 'B', 11);
        // Imprime las celdas con los datos y la imagen
        $pdf->setFillColor(255, 255, 255);
        $pdf->cell(37, 15, $pdf->image('../../imagenes/hamacas/' . $rowHamacas['IMAGEN'], $pdf->getX() + 10, $currentY + 2, 10), 1, 0);
        $pdf->cell(63, 15, $pdf->encodeString($rowHamacas['NOMBRE']), 1, 0, 'C', false, 'http://hamacoteca.online/hamacoteca/vistas/publica/paginas/detalle.html?id=' . $rowHamacas['ID']);
        $pdf->cell(25, 15, $pdf->encodeString($rowHamacas['CANTIDAD']), 1, 0, 'C');
        $pdf->cell(30, 15, $pdf->encodeString($rowHamacas['PRECIO']), 1, 0, 'C');
        $pdf->cell(30, 15, $pdf->encodeString($rowHamacas['ESTADO']), 1, 1, 'C');
    }
} else {
    $pdf->cell(0, 15, $pdf->encodeString('No hay categorías para mostrar'), 1, 1);
}

// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'productos.pdf');
