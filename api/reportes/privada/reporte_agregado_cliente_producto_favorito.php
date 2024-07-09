<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../auxiliares/report.php');;

// Se instancia la clase para crear el reporte.
$pdf = new Report;
// Se verifica si existe un valor para la categoría, de lo contrario se muestra un mensaje.
if (isset($_GET['idCliente'])) {
    // Se incluyen las clases para la transferencia y acceso a datos.
    require_once('../../modelos/data/favoritos_data.php');
    // Se instancian las entidades correspondientes.
    $favorito = new FavoritosData;
    // Se inicia el reporte con el encabezado del documento.
    $pdf->startReport('Hamacas favoritas');
    // Se establece el valor de la categoría, de lo contrario se muestra un mensaje.
    if ($favorito->setId($_GET['idCliente'])) {
        // Se establece un color de relleno para los encabezados.
        $pdf->setFillColor(225);
        // Se establece la fuente para los encabezados.
        $pdf->setFont('Arial', 'B', 11);
        // Se imprimen las celdas con los encabezados.
        $pdf->cell(62, 10, 'Imagen', 1, 0, 'C', 1);
        $pdf->cell(62, 10, 'Nombre', 1, 0, 'C', 1);
        $pdf->cell(62, 10, 'Precio (US$)', 1, 1, 'C', 1);
        // Se establece la fuente para los datos de los productos.
        $pdf->setFont('Arial', '', 11);
        // Se verifica si la categoría existe, de lo contrario se muestra un mensaje.
        if ($dataFavorito = $favorito->readAllReport()) {
            $y = 58;
            // Se recorren los registros fila por fila.
            foreach ($dataFavorito as $rowFavorito) {
                // Se imprimen las celdas con los datos de los productos.
                $pdf->cell(62, 15, $pdf->image('../../imagenes/hamacas/' . $rowFavorito['IMAGEN'], 41, $y, 10), 1, 0);
                $pdf->cell(62, 15, $pdf->encodeString($rowFavorito['NOMBRE']), 1, 0);
                $pdf->cell(62, 15, $pdf->encodeString($rowFavorito['PRECIO']), 1, 1);
                $y += 15;
            }
        } else {
            $pdf->cell(0, 10, $pdf->encodeString('No hay productos para la categoría'), 1, 1);
        }
        // Se llama implícitamente al método footer() y se envía el documento al navegador web.
        $pdf->output('I', 'categoria.pdf');
    } else {
        print('Categoría incorrecta');
    }
} else {
    print('Debe seleccionar una categoría');
}
