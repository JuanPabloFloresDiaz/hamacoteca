<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../auxiliares/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla administrador.
 */
class ValoracionesHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $producto = null;
    protected $comentario = null;
    protected $calificacion = null;


    protected $estado = null;

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    //Función para buscar valoraciones.
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT * FROM vista_tabla_valoraciones
                WHERE NOMBRE LIKE ?
                ORDER BY NOMBRE;';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    //Función para mostrar todas las valoraciones.
    public function readAll()
    {
        $sql = 'SELECT * FROM vista_tabla_valoraciones
                ORDER BY NOMBRE;';
        return Database::getRows($sql);
    }

    //Función para cambiar el estado de una valoración.
    public function changeState()
    {
        $sql = 'CALL cambiar_estado_valoracion(?);';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    //Función para leer los comentarios de un producto
    public function readOne()
    {
        $sql = 'SELECT V.id_valoracion AS "ID",
        foto_cliente AS "IMAGEN",
        CONCAT(nombre_cliente, " ", apellido_cliente) AS "NOMBRE",
        nombre_hamaca AS "PRODUCTO",
        comentario_producto AS "COMENTARIO", 
        calificacion_producto AS "CALIFICACIÓN",
        fecha_valoracion AS "FECHA",
            CASE 
                WHEN estado_comentario = 1 THEN "Activo"
                WHEN estado_comentario = 0 THEN "Bloqueado"
            END AS "ESTADO"
        FROM valoraciones v
        INNER JOIN detalles_pedidos dp ON dp.id_detalles_pedidos = v.id_detalles_pedidos
        INNER JOIN hamacas h ON h.id_hamaca = dp.id_hamaca
        INNER JOIN pedidos p ON p.id_pedido = dp.id_pedido
        INNER JOIN clientes c ON c.id_cliente = p.id_cliente 
        WHERE h.id_hamaca = ? AND V.estado_comentario = 1';
        $params = array($this->producto);
        return Database::getRows($sql, $params);
    }

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */
    // Método en procedimiento, para manipular el detalle de pedido y simplificar el paso a paso
    public function createRow()
    {
        // Se realiza una subconsulta para obtener el precio del producto.
        $sql = 'CALL insertar_comentario(?, ?, ?, ?)';
        $params = array($_SESSION['idCliente'],$this->calificacion,$this->comentario,$this->producto);
        return Database::executeRow($sql, $params);
    }
}
