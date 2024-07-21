<?php
require_once('../../auxiliares/report.php');

// Función para agregar imágenes base64 al PDF
function addBase64Image($pdf, $base64, $x, $y, $w, $h) {
    if (strpos($base64, 'base64,') !== false) {
        $base64 = explode('base64,', $base64)[1];
    }

    $imgdata = base64_decode($base64);
    $f = finfo_open();
    $mime_type = finfo_buffer($f, $imgdata, FILEINFO_MIME_TYPE);
    $ext = '';
    switch ($mime_type) {
        case 'image/jpeg':
            $ext = 'jpeg';
            break;
        case 'image/png':
            $ext = 'png';
            break;
        case 'image/gif':
            $ext = 'gif';
            break;
    }
    if ($ext) {
        $tempfile = tempnam(sys_get_temp_dir(), 'img') . ".$ext";
        file_put_contents($tempfile, $imgdata);
        $pdf->image($tempfile, $x, $y, $w, $h);
        unlink($tempfile);
    }
}

// Obtener los datos base64 desde el cuerpo de la solicitud POST
$data = json_decode(file_get_contents('php://input'), true);

// Se instancia la clase para crear el reporte.
$pdf = new Report;
$pdf->startReport('Reporte con Gráficas');

// Añadir las imágenes de las gráficas si están disponibles
if (isset($data['ventas'])) {
    addBase64Image($pdf, $data['ventas'], 15, 60, 180, 140);
}
$pdf->addPage();
if (isset($data['prediccion'])) {
    addBase64Image($pdf, $data['prediccion'], 15, 60, 180, 140);
}

// Resto del reporte

$pdf->output('I', 'reporte_con_graficas.pdf');
?>
