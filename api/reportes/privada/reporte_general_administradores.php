<?php
require_once ('../../auxiliares/report.php');
require_once ('../../modelos/data/administradores_data.php');

$pdf = new Report;
$pdf->startReport('Administradores registrados');
$admin = new AdministradoresData;

if ($dataadmin = $admin->readAll()) {
    $pdf->setFillColor(154, 173, 233);
    $pdf->setDrawColor(154, 173, 233);
    $pdf->setFont('Arial', 'B', 11);
    $pdf->cell(25, 15, 'Foto', 1, 0, 'C', 1);
    $pdf->cell(86, 15, 'Administrador', 1, 0, 'C', 1);
    $pdf->cell(49, 15, 'DUI', 1, 0, 'C', 1);
    $pdf->cell(25, 15, 'Estado', 1, 1, 'C', 1);

    $pdf->setFillColor(240);
    $pdf->setFont('Arial', '', 11);

    foreach ($dataadmin as $rowadmin) {
        // Verifica si se ha creado una nueva página
        if ($pdf->getY() + 15 > 279 - 30) { // Ajusta este valor según el tamaño de tus celdas y la altura de la página
            $pdf->addPage('P', 'Letter'); // Añade una nueva página y con letter se define de tamaño carta
            $pdf->setFillColor(154, 173, 233);
            $pdf->setDrawColor(154, 173, 233);
            $pdf->setFont('Arial', 'B', 11);
            // Vuelve a imprimir los encabezados en la nueva página
            $pdf->cell(25, 15, 'Foto', 1, 0, 'C', 1);
            $pdf->cell(86, 15, 'Administrador', 1, 0, 'C', 1);
            $pdf->cell(49, 15, 'DUI', 1, 0, 'C', 1);
            $pdf->cell(25, 15, 'Estado', 1, 1, 'C', 1);
        }

        $currentY = $pdf->getY(); // Obtén la coordenada Y actual
        $pdf->setFillColor(79, 171, 220);
        $pdf->setDrawColor(130, 196, 250);
        $pdf->setFont('Arial', 'B', 11);
        // Imprime las celdas con los datos y la imagen
        $pdf->setFillColor(255, 255, 255);
        $pdf->cell(25, 15, $pdf->image('../../imagenes/administradores/' . $rowadmin['IMAGEN'], $pdf->getX() + 7, $currentY + 2, 10), 1, 0);
        $pdf->cell(86, 15, $pdf->encodeString($rowadmin['NOMBRE']), 1, 0, 'C');
        $pdf->cell(49, 15, $pdf->encodeString($rowadmin['DUI']), 1, 0, 'C');
        $pdf->cell(25, 15, $pdf->encodeString($rowadmin['ESTADO']), 1, 1, 'C');
    }
} else {
    $pdf->cell(0, 15, $pdf->encodeString('No hay administradores registrados para mostrar'), 1, 1);
}

$pdf->output('I', 'administradores.pdf');
