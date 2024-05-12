<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../auxiliares/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla administrador.
 */
class PedidosHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $estado = null;

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT p.id_pedido AS ID, p.estado_pedido AS ESTADO, p.fecha_pedido AS FECHA, 
        p.direccion_pedido AS DIRECCION, CONCAT(c.nombre_cliente, " ", c.apellido_cliente) AS CLIENTE, 
        c.foto_cliente AS FOTO
        FROM pedidos p
        INNER JOIN clientes c ON p.id_cliente = c.id_cliente
        WHERE estado_pedido = "Entregado" OR estado_pedido = "Cancelado" AND nombre_cliente LIKE ? OR apellido_cliente LIKE ?
        ORDER BY CLIENTE;';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT p.id_pedido AS ID, p.estado_pedido AS ESTADO, p.fecha_pedido AS FECHA, 
        p.direccion_pedido AS DIRECCION, CONCAT(c.nombre_cliente, " ", c.apellido_cliente) AS CLIENTE, 
        c.foto_cliente AS FOTO
        FROM pedidos p
        INNER JOIN clientes c ON p.id_cliente = c.id_cliente
        WHERE estado_pedido = "Entregado" OR estado_pedido = "Cancelado"
        ORDER BY CLIENTE;';
        return Database::getRows($sql);
    }

    //Función para leer un administrador.
    public function readOne()
    {
        $sql = 'SELECT p.id_pedido AS ID, p.estado_pedido AS ESTADO, p.fecha_pedido AS FECHA, 
        p.direccion_pedido AS DIRECCION, CONCAT(c.nombre_cliente, " ", c.apellido_cliente) AS CLIENTE, 
        c.foto_cliente AS FOTO
        FROM pedidos p
        INNER JOIN clientes c ON p.id_cliente = c.id_cliente
        WHERE estado_pedido = "Entregado" OR estado_pedido = "Cancelado" AND id_pedido = ?
        ORDER BY CLIENTE;';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    //Función para contar los pedidos entregados
    public function checkOrders()
    {
        $sql = 'SELECT COUNT(*) AS TOTAL
        FROM pedidos
        WHERE estado_pedido = "Entregado";
        ';
        return Database::getRows($sql);
    }

    //Función para contar las ganancias
    public function totalProfits()
    {
        $sql = 'SELECT SUM(dp.precio_producto) AS TOTAL
        FROM pedidos p
        INNER JOIN detalles_pedidos dp ON p.id_pedido = dp.id_pedido
        WHERE p.estado_pedido = "Entregado";     
        ';
        return Database::getRows($sql);
    }

    //Función para leer la imagen del id desde la base.
    public function readFilename()
    {
        $sql = 'SELECT c.foto_cliente AS FOTO
                FROM pedidos p
                INNER JOIN clientes c ON p.id_cliente = c.id_cliente
                WHERE id_pedido = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }


    //Función para cambiar el estado de un cliente.
    public function changeState()
    {
        $sql = 'CALL actualizar_estado_pedido(?,?);';
        $params = array($this->id, $this->estado);
        return Database::executeRow($sql, $params);
    }
}
