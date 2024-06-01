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
    protected $id_pedido = null;
    protected $id_detalle = null;
    protected $cliente = null;
    protected $producto = null;
    protected $cantidad = null;
    protected $estado = null;


    /*
    *   ESTADOS DEL PEDIDO
    *   Pendiente (valor por defecto en la base de datos). Pedido en proceso y se puede modificar el detalle.
    *   En camino. Pedido terminado por el cliente y ya no es posible modificar el detalle.
    *   Entregado. Pedido enviado al cliente.
    *   Cancelado. Pedido cancelado por el cliente después de ser finalizado.
    */


    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    //Buscar historial
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT p.id_pedido AS ID, p.estado_pedido AS ESTADO, p.fecha_pedido AS FECHA, 
        p.direccion_pedido AS DIRECCION, CONCAT(c.nombre_cliente, " ", c.apellido_cliente) AS CLIENTE, 
        c.foto_cliente AS FOTO
        FROM pedidos p
        INNER JOIN clientes c ON p.id_cliente = c.id_cliente
        WHERE (estado_pedido = "Entregado" OR estado_pedido = "Cancelado") AND (nombre_cliente LIKE ? OR apellido_cliente LIKE ?)
        ORDER BY CLIENTE;';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }
    //Leer historial
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
    //Buscar lista
    public function searchList()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT p.id_pedido AS ID, p.estado_pedido AS ESTADO, p.fecha_pedido AS FECHA, 
        p.direccion_pedido AS DIRECCION, CONCAT(c.nombre_cliente, " ", c.apellido_cliente) AS CLIENTE, 
        c.foto_cliente AS FOTO
        FROM pedidos p
        INNER JOIN clientes c ON p.id_cliente = c.id_cliente
        WHERE estado_pedido = "En camino" AND (nombre_cliente LIKE ? OR apellido_cliente LIKE ?)
        ORDER BY CLIENTE;';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }
    //Leer lista
    public function readAllList()
    {
        $sql = 'SELECT p.id_pedido AS ID, p.estado_pedido AS ESTADO, p.fecha_pedido AS FECHA, 
        p.direccion_pedido AS DIRECCION, CONCAT(c.nombre_cliente, " ", c.apellido_cliente) AS CLIENTE, 
        c.foto_cliente AS FOTO
        FROM pedidos p
        INNER JOIN clientes c ON p.id_cliente = c.id_cliente
        WHERE estado_pedido = "En camino"
        ORDER BY CLIENTE;';
        return Database::getRows($sql);
    }

    //Función para leer un pedido de la lista.
    public function readOneList()
    {
        $sql = 'SELECT p.id_pedido AS ID, p.estado_pedido AS ESTADO, p.fecha_pedido AS FECHA, 
        p.direccion_pedido AS DIRECCION, CONCAT(c.nombre_cliente, " ", c.apellido_cliente) AS CLIENTE, 
        c.foto_cliente AS FOTO
        FROM pedidos p
        INNER JOIN clientes c ON p.id_cliente = c.id_cliente
        WHERE estado_pedido = "En camino" AND id_pedido = ?
        ORDER BY CLIENTE;';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    //Función para leer un pedido del historial.
    public function readOne()
    {
        $sql = 'SELECT p.id_pedido AS ID, p.estado_pedido AS ESTADO, p.fecha_pedido AS FECHA, 
        p.direccion_pedido AS DIRECCION, CONCAT(c.nombre_cliente, " ", c.apellido_cliente) AS CLIENTE, 
        c.foto_cliente AS FOTO
        FROM pedidos p
        INNER JOIN clientes c ON p.id_cliente = c.id_cliente
        WHERE (estado_pedido = "Entregado" OR estado_pedido = "Cancelado") AND id_pedido = ?
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


    //Función para cambiar el estado de un pedido.
    public function changeState()
    {
        $sql = 'CALL actualizar_estado_pedido(?,?);';
        $params = array($this->id, $this->estado);
        return Database::executeRow($sql, $params);
    }

    
    //Verificar que el producto este guardado en favorito
    public function verifySave()
    {
        $sql = 'SELECT COUNT(*) AS CARRITO 
        FROM pedidos p
        INNER JOIN detalles_pedidos dp ON p.id_pedido = dp.id_pedido
        WHERE p.id_cliente = ? AND dp.id_hamaca = ?;';
        $params = array($_SESSION['idCliente'], $this->id);
        return Database::getRows($sql, $params);
    }

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */
    // Método para verificar si existe un pedido en proceso con el fin de iniciar o continuar una compra.
    public function getOrder()
    {
        $this->estado = 'Pendiente';
        $sql = 'SELECT id_pedido
                FROM pedidos
                WHERE estado_pedido = ? AND id_cliente = ?';
        $params = array($this->estado, $_SESSION['idCliente']);
        if ($data = Database::getRow($sql, $params)) {
            $_SESSION['idPedido'] = $data['id_pedido'];
            return true;
        } else {
            return false;
        }
    }

    // Método para iniciar un pedido en proceso.
    public function startOrder()
    {
        if ($this->getOrder()) {
            return true;
        } else {
            $sql = 'INSERT INTO pedidos(direccion_pedido, id_cliente)
                    VALUES((SELECT direccion_cliente FROM clientes WHERE id_cliente = ?), ?)';
            $params = array($_SESSION['idCliente'], $_SESSION['idCliente']);
            // Se obtiene el ultimo valor insertado de la llave primaria en la tabla pedido.
            if ($_SESSION['idPedido'] = Database::getLastRow($sql, $params)) {
                return true;
            } else {
                return false;
            }
        }
    }

    // Método para agregar un producto al carrito de compras.
    public function createDetail()
    {
        // Se realiza una subconsulta para obtener el precio del producto.
        $sql = 'INSERT INTO detalles_pedidos(id_hamaca, precio_producto, cantidad_comprada, id_pedido)
                VALUES(?, (SELECT precio FROM hamacas WHERE id_hamaca = ?), ?, ?)';
        $params = array($this->producto, $this->producto, $this->cantidad, $_SESSION['idPedido']);
        return Database::executeRow($sql, $params);
    }

    // Método para obtener los productos que se encuentran en el carrito de compras.
    public function readDetail()
    {
        $sql = 'SELECT id_detalle, nombre_hamaca, precio_producto, cantidad_comprada
                FROM detalles_pedidos
                INNER JOIN pedidos USING(id_pedido)
                INNER JOIN hamacas USING(id_hamaca)
                WHERE id_pedido = ?';
        $params = array($_SESSION['idPedido']);
        return Database::getRows($sql, $params);
    }

    // Método para finalizar un pedido por parte del cliente.
    public function finishOrder()
    {
        $this->estado = 'En camino';
        $sql = 'UPDATE pedidos
                SET estado_pedido = ?
                WHERE id_pedido = ?';
        $params = array($this->estado, $_SESSION['idPedido']);
        return Database::executeRow($sql, $params);
    }

    // Método para actualizar la cantidad de un producto agregado al carrito de compras.
    public function updateDetail()
    {
        $sql = 'UPDATE detalles_pedidos
                SET cantidad_comprada = ?
                WHERE id_detalles_pedidos = ? AND id_pedido = ?';
        $params = array($this->cantidad, $this->id_detalle, $_SESSION['idPedido']);
        return Database::executeRow($sql, $params);
    }

    // Método para eliminar un producto que se encuentra en el carrito de compras.
    public function deleteDetail()
    {
        $sql = 'DELETE FROM detalles_pedidos
                WHERE id_detalles_pedidos = ? AND id_pedido = ?';
        $params = array($this->id_detalle, $_SESSION['idPedido']);
        return Database::executeRow($sql, $params);
    }
}
