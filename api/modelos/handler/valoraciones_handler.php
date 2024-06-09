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
        c.id_cliente AS "IDENTIFICADOR",
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

    //Función para leer los comentarios de un producto
    public function readOneComment()
    {
        $sql = 'SELECT V.id_valoracion AS "ID",
        foto_cliente AS "IMAGEN",
        c.id_cliente AS "IDENTIFICADOR",
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
        WHERE V.id_valoracion = ? AND V.estado_comentario = 1';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */

    public function verificarCompra()
    {
        $sql = 'SELECT dp.id_detalles_pedidos AS id_detalle
        FROM detalles_pedidos dp
        INNER JOIN pedidos p ON dp.id_pedido = p.id_pedido
        WHERE p.id_cliente = ?
        AND dp.id_hamaca = ?
        AND p.estado_pedido = "Entregado"
        ORDER BY dp.id_detalles_pedidos DESC
        LIMIT 1;';
        $params = array($_SESSION['idCliente'], $this->producto);
        if ($data = Database::getRow($sql, $params)) {
            $_SESSION['idDetalle'] = $data['id_detalle'];
            return true;
        } else {
            return false;
        }
    }

    public function createRow()
    {
        $sql = 'CALL insertar_comentario(?, ?, ?, ?)';
        $params = array($_SESSION['idCliente'], $this->calificacion, $this->comentario, $this->producto);
        return Database::executeRow($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'CALL actualizar_comentario(?, ?, ?, ?, ?)';
        $params = array($_SESSION['idCliente'], $this->calificacion, $this->comentario, $this->producto, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'CALL eliminar_comentario(?, ?, ?)';
        $params = array($_SESSION['idCliente'], $this->producto, $this->id);
        return Database::executeRow($sql, $params);
    }
}
