<?php
// Se incluye la clase para generar archivos PDF.
require_once('../../librerias/fpdf185/fpdf.php');

/*
*   Clase para definir las plantillas de los reportes del sitio privado.
*   Para más información http://www.fpdf.org/
*/
class Invoice extends FPDF
{
    // Constante para definir la ruta de las vistas del sitio privado.
    const CLIENT_URL = 'http://localhost/hamacoteca/vistas/publica/paginas/';
    // Propiedad para guardar el título del reporte.
    private $title = null;

    /*
    *   Método para iniciar el reporte con el encabezado del documento.
    *   Parámetros: $title (título del reporte).
    *   Retorno: ninguno.
    */
    public function startReport($title)
    {
        // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en los reportes.
        session_start();
        // Se verifica si un administrador ha iniciado sesión para generar el documento, de lo contrario se direcciona a la página web principal.
        if (isset($_SESSION['idCliente'])) {
            // Se asigna el título del documento a la propiedad de la clase.
            $this->title = $title;
            // Se establece el título del documento (true = utf-8).
            $this->setTitle('Hamacoteca - Factura', true);
            // Se establecen los márgenes del documento (izquierdo, superior y derecho).
            $this->setMargins(15, 15, 15);
            // Se añade una nueva página al documento con orientación vertical y formato carta, llamando implícitamente al método header()
            $this->addPage('P', 'Letter');
            // Se define un alias para el número total de páginas que se muestra en el pie del documento.
            $this->aliasNbPages();
        } else {
            header('location:' . self::CLIENT_URL);
        }
    }

    /*
    *   Método para codificar una cadena de alfabeto español a UTF-8.
    *   Parámetros: $string (cadena).
    *   Retorno: cadena convertida.
    */
    public function encodeString($string)
    {
        return mb_convert_encoding($string, 'ISO-8859-1', 'utf-8');
    }

    /*
    *   Se sobrescribe el método de la librería para establecer la plantilla del encabezado de los reportes.
    *   Se llama automáticamente en el método addPage()
    */
    public function header()
    {
        // Fondo superior derecho
        $this->image('../../imagenes/fondo_superior_derecho_factura.png', 90, 0, 130);

        // Logo
        $this->image('../../imagenes/logo_factura.png', 0, 0, 120);
        
        // Título
        $this->setFont('Arial', 'B', 24);
        $this->cell(0, 25, $this->encodeString($this->title), 0, 1, 'R');
        
        // Fecha y hora
        $this->setFont('Arial', '', 12);
        $this->cell(0, 2, 'Fecha/Hora: ' . date('d-m-Y H:i:s'), 0, 1, 'R');
        // Se define la imagen del fondo en el centro del reporte
        //  $this->image('../../imagenes/logo_semi_transparente.png', 45, 95, 128, 128);
        // Salto de línea
        $this->ln(40);
        // Fondo inferior derecho
        $this->image('../../imagenes/fondo_inferior_derecho.png', 0, 187, 216, 110);
    }

    /*
    *   Se sobrescribe el método de la librería para establecer la plantilla del pie de los reportes.
    *   Se llama automáticamente en el método output()
    */
    public function footer()
    {
        // Establecer color de texto a azul oscuro
        $this->setTextColor(11, 68, 91);
        // Mensaje de agradecimiento
        $this->setY(-20);
        $this->setFont('Arial', 'B', 12);
        $this->cell(0, 10, $this->encodeString('¡Gracias por su compra!'), 0, 0, 'L');
        // Establecer color de texto a negro
        $this->setTextColor(0, 0, 0);
        // Número de página y usuario
        $this->setFont('Arial', 'I', 10);
        $this->cell(0, 10, $this->encodeString('Factura generada por: ' . $_SESSION['USERNAME']), 0, 1, 'R');
        $this->setY(-10);
        $this->cell(0, 10, $this->encodeString('Página ') . $this->pageNo() . '/{nb}', 0, 1, 'C');
    }
}
?>
