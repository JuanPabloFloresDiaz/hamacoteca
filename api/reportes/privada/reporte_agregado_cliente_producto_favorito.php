<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../auxiliares/report.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;

// Se verifica si existe un valor para la , de lo contrario se muestra un mensaje.
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
        $pdf->setFillColor(154, 173, 233);
        $pdf->setDrawColor(154, 173, 233);
        // Se establece la fuente para los encabezados.
        $pdf->setFont('Arial', 'B', 11);
        // Se imprimen las celdas con los encabezados.
        // Explicación de funcionamiento de los valores de las celdas: 
        // (Ancho, Alto, Texto, Borde, Salto de linea, Alineación (Centrado = C, Izquierda = L, Derecha = R), Fondo, Link)
        $pdf->cell(62, 10, 'Imagen', 1, 0, 'C', 1);
        $pdf->cell(84, 10, 'Nombre', 1, 0, 'C', 1);
        $pdf->cell(40, 10, 'Precio (US$)', 1, 1, 'C', 1);

        // Se establece la fuente para los datos de los productos.
        $pdf->setFillColor(79, 171, 220);
        $pdf->setDrawColor(130, 196, 250);
        $pdf->setFont('Arial', '', 11);

        // Se verifica si existen productos, de lo contrario se muestra un mensaje.
        if ($dataFavorito = $favorito->readAllReport()) {
            foreach ($dataFavorito as $rowFavorito) {
                // Verifica si se ha creado una nueva página
                if ($pdf->getY() + 15 > 279 - 30) { // Ajusta este valor según el tamaño de tus celdas y la altura de la página
                    $pdf->addPage('P', 'Letter'); // Añade una nueva página y con letter se define de tamaño carta
                    $pdf->setFillColor(154, 173, 233);
                    $pdf->setDrawColor(154, 173, 233);
                    $pdf->setFont('Arial', 'B', 11);
                    // Vuelve a imprimir los encabezados en la nueva página
                    $pdf->cell(62, 10, 'Imagen', 1, 0, 'C', 1);
                    $pdf->cell(84, 10, 'Nombre', 1, 0, 'C', 1);
                    $pdf->cell(40, 10, 'Precio (US$)', 1, 1, 'C', 1);
                }

                $currentY = $pdf->getY(); // Obtén la coordenada Y actual
                // Se establacen los colores de las celdas
                $pdf->setDrawColor(130, 196, 250);
                $pdf->setFont('Arial', 'B', 11);
                $pdf->setFillColor(255, 255, 255);
                // Imprime las celdas con los datos y la imagen
                $pdf->cell(62, 15, $pdf->image('../../imagenes/hamacas/' . $rowFavorito['IMAGEN'], $pdf->getX() + 25, $currentY + 2, 10), 1, 0);
                $pdf->cell(84, 15, $pdf->encodeString($rowFavorito['NOMBRE']), 1, 0, 'C', false, 'http://localhost/hamacoteca/vistas/publica/paginas/detalle.html?id=' . $rowFavorito['ID']);
                $pdf->cell(40, 15, $pdf->encodeString($rowFavorito['PRECIO']), 1, 1, 'C');
            }
        } else {
            $pdf->cell(0, 10, $pdf->encodeString('No hay productos para la categoría'), 1, 1);
        }

        // Se llama implícitamente al método footer() y se envía el documento al navegador web.
        $pdf->output('I', 'hamacas_favoritas.pdf');
    } else {
        print('Categoría incorrecta');
    }
} else {
    print('Debe seleccionar una categoría');
}
