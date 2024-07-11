<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../auxiliares/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla detalles de pedidos.
 */
class DetallesPedidosHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    //Leer el detalle de pedido
    public function readOne()
    {
        $sql = 'SELECT h.foto_principal AS FOTO, h.nombre_hamaca AS PRODUCTO, 
        dp.cantidad_comprada AS CANTIDAD, dp.precio_producto AS PRECIO
        FROM detalles_pedidos dp INNER JOIN hamacas h ON dp.id_hamaca = h.id_hamaca 
        WHERE id_pedido = ?
        ORDER BY PRODUCTO;';
        $params = array($this->id);
        return Database::getRows($sql, $params);
    }

    //Función para cargar gráfica de ganancias por fecha
    public function profitsForDate()
    {
        $sql = 'SELECT CASE 
        WHEN MONTH(fecha_pedido) = 1 THEN "Enero"
        WHEN MONTH(fecha_pedido) = 2 THEN "Febrero"
        WHEN MONTH(fecha_pedido) = 3 THEN "Marzo"
        WHEN MONTH(fecha_pedido) = 4 THEN "Abril"
        WHEN MONTH(fecha_pedido) = 5 THEN "Mayo"
        WHEN MONTH(fecha_pedido) = 6 THEN "Junio"
        WHEN MONTH(fecha_pedido) = 7 THEN "Julio"
        WHEN MONTH(fecha_pedido) = 8 THEN "Agosto"
        WHEN MONTH(fecha_pedido) = 9 THEN "Septiembre"
        WHEN MONTH(fecha_pedido) = 10 THEN "Octubre"
        WHEN MONTH(fecha_pedido) = 11 THEN "Noviembre"
        WHEN MONTH(fecha_pedido) = 12 THEN "Diciembre"
        END AS MES,
        YEAR(fecha_pedido) AS AÑO,
        SUM(precio_producto) AS GANANCIAS
        FROM detalles_pedidos
        INNER JOIN pedidos USING(id_pedido)
        WHERE estado_pedido = "Entregado"
        GROUP BY AÑO, MES
        ORDER BY AÑO ASC, MONTH(fecha_pedido) ASC;
        ';
        return Database::getRows($sql);
    }

    //Función para leer la imagen del id desde la base.
    public function readFilename()
    {
        $sql = 'SELECT h.foto_principal AS FOTO
        FROM detalles_pedidos dp INNER JOIN hamacas h ON dp.id_hamaca = h.id_hamaca 
        WHERE id_pedido = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }
}
