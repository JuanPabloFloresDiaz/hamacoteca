<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once ('../../auxiliares/report.php');
// Se incluye la clase con la que se asignaran los datos para generar reportes.
require_once ('../../modelos/data/clientes_data.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;
// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Clientes registrados');
// Se instancia el módelo ClientesData para obtener los datos.
$clientes = new ClientesData;

// Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
if ($dataclientes = $clientes->readAll()) {
    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(154, 173, 233);
    // Se establece el color del borde.
    $pdf->setDrawColor(154, 173, 233);
    // Se establece la fuente para los encabezados.
    $pdf->setFont('Arial', 'B', 11);
    // Se imprimen las celdas con los encabezados.
    // Explicación de funcionamiento de los valores de las celdas: 
    // (Ancho, Alto, Texto, Borde, Salto de linea, Alineación (Centrado = C, Izquierda = L, Derecha = R), Fondo, Link)
    $pdf->cell(25, 15, 'Foto', 1, 0, 'C', 1);
    $pdf->cell(86, 15, 'Cliente', 1, 0, 'C', 1);
    $pdf->cell(49, 15, 'Fecha de registro', 1, 0, 'C', 1);
    $pdf->cell(25, 15, 'Estado', 1, 1, 'C', 1);

    $pdf->setFillColor(240);
    // Se establece la fuente para los datos de los clientes.
    $pdf->setFont('Arial', '', 11);

    // Se verifica si existen clientes y se recorren los registros por fila, de lo contrario se muestra un mensaje.
    foreach ($dataclientes as $rowclientes) {
        // Verifica si se ha creado una nueva página
        if ($pdf->getY() + 15 > 279 - 30) { // Ajusta este valor según el tamaño de tus celdas y la altura de la página
            $pdf->addPage('P', 'Letter'); // Añade una nueva página y con letter se define de tamaño carta
            $pdf->setFillColor(154, 173, 233);
            $pdf->setDrawColor(154, 173, 233);
            $pdf->setFont('Arial', 'B', 11);
            // Vuelve a imprimir los encabezados en la nueva página
            $pdf->cell(25, 15, 'Foto', 1, 0, 'C', 1);
            $pdf->cell(86, 15, 'Cliente', 1, 0, 'C', 1);
            $pdf->cell(49, 15, 'Fecha de registro', 1, 0, 'C', 1);
            $pdf->cell(25, 15, 'Estado', 1, 1, 'C', 1);
        }

        $currentY = $pdf->getY(); // Obtén la coordenada Y actual
        // Se establacen los colores de las celdas
        $pdf->setFillColor(79, 171, 220);
        $pdf->setDrawColor(130, 196, 250);
        $pdf->setFont('Arial', 'B', 11);
        // Imprime las celdas con los datos y la imagen
        $pdf->setFillColor(255, 255, 255);
        $pdf->cell(25, 15, $pdf->image('../../imagenes/clientes/' . $rowclientes['FOTO'], $pdf->getX() + 7, $currentY + 2, 10), 1, 0);
        $pdf->cell(86, 15, $pdf->encodeString($rowclientes['NOMBRE_COMPLETO']), 1, 0, 'C');
        $pdf->cell(49, 15, $pdf->encodeString($rowclientes['FECHA']), 1, 0, 'C');
        $pdf->cell(25, 15, $pdf->encodeString($rowclientes['ESTADO']), 1, 1, 'C');
    }
} else {
    $pdf->cell(0, 15, $pdf->encodeString('No hay clientes registrados para mostrar'), 1, 1);
}

// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'clientes.pdf');
