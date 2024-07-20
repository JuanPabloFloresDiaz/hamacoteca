<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../auxiliares/database.php');
require_once('../../auxiliares/email.php');
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
    protected $fecha = null;
    protected $fecha_inicial = null;
    protected $fecha_final = null;


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

    //Función que verifica si se actualizo el estado del producto a Entregado
    public function verifyStateAndSendMail()
    {
        $sql = 'SELECT c.correo_cliente AS CORREO, p.fecha_pedido AS FECHA, 
                p.direccion_pedido AS DIRECCIÓN, p.id_pedido AS ID
                FROM pedidos p
                INNER JOIN clientes c ON p.id_cliente = c.id_cliente
                WHERE p.id_pedido = ? AND p.estado_pedido = "Entregado";';
        $params = array($this->id);
        if ($data = Database::getRow($sql, $params)) {
            $titulo = 'Pedido ' . $data['ID'] . ' entregado';
            $mensaje = 'Esperamos que vuelvas a compra en hamacoteca';
            $mailSubject = 'Tu pedido ya ha sido entregado';
            $mailAltBody = '¡Te saludamos de hamacoteca para confirmarte, que tu pedido hecho el ' . $data['FECHA'];
            $mailAltBody2 = ' ya ha sido entregado a ' . $data['DIRECCIÓN'] . '!';
            // Cargar plantilla HTML
            $template = file_get_contents('../../auxiliares/email/email.html');
            // Reemplazar marcadores de posición con co1ntenido dinámico
            $mailBody = str_replace(
                ['{{subject}}', '{{title}}', '{{body}}', '{{bodytwo}}', '{{message}}'],
                [$mailSubject, $titulo, $mailAltBody, $mailAltBody2, $mensaje],
                $template
            );
            return Props::sendMail($data['CORREO'], $mailSubject, $mailBody);
        } else {
            return false;
        }
    }

    //Leer el detalle de pedido
    public function readDetailEmail()
    {
        $sql = 'SELECT h.foto_principal AS FOTO, h.nombre_hamaca AS PRODUCTO, 
        dp.cantidad_comprada AS CANTIDAD, dp.precio_producto AS PRECIO
        FROM detalles_pedidos dp INNER JOIN hamacas h ON dp.id_hamaca = h.id_hamaca 
        WHERE id_pedido = ?
        ORDER BY PRODUCTO;';
        $params = array($this->id);
        return Database::getRows($sql, $params);
    }


    //Verificar que el producto este guardado en favorito
    public function verifySave()
    {
        $sql = 'SELECT COUNT(*) AS CARRITO 
        FROM pedidos p
        INNER JOIN detalles_pedidos dp ON p.id_pedido = dp.id_pedido
        WHERE p.id_cliente = ? AND dp.id_hamaca = ? AND p.estado_pedido = "Pendiente";';
        $params = array($_SESSION['idCliente'], $this->id);
        return Database::getRows($sql, $params);
    }

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */
    // Método en procedimiento, para manipular el detalle de pedido y simplificar el paso a paso
    public function manipulateDetail()
    {
        // Se realiza una subconsulta para obtener el precio del producto.
        $sql = 'CALL insertar_orden_validado(?, ?, ?)';
        $params = array($_SESSION['idCliente'], $this->cantidad, $this->producto);
        return Database::executeRow($sql, $params);
    }

    // Método para obtener los productos que se encuentran en el carrito de compras.
    public function readDetail()
    {
        $sql = 'SELECT dp.id_detalles_pedidos AS ID,
        h.foto_principal AS IMAGEN, h.nombre_hamaca AS NOMBRE,
        dp.cantidad_comprada AS CANTIDAD, dp.precio_producto AS PRECIO,
        ROUND(dp.precio_producto * dp.cantidad_comprada, 2) AS TOTAL FROM  detalles_pedidos dp JOIN  hamacas h ON dp.id_hamaca = h.id_hamaca
        WHERE dp.id_pedido = (SELECT id_pedido FROM pedidos WHERE id_cliente = ? AND estado_pedido = "Pendiente" LIMIT 1);';
        $params = array($_SESSION['idCliente']);
        return Database::getRows($sql, $params);
    }

    // Método para finalizar un pedido por parte del cliente.
    public function finishOrder()
    {
        $this->estado = 'En camino';
        $sql = 'UPDATE pedidos
                SET estado_pedido = ?
                WHERE id_pedido = (SELECT id_pedido FROM pedidos WHERE id_cliente = ? AND estado_pedido = "Pendiente" LIMIT 1);';
        $params = array($this->estado, $_SESSION['idCliente']);
        return Database::executeRow($sql, $params);
    }

    // Método para obtener los productos que se encuentran en el último pedido finalizado realizado.
    public function readDetailReport()
    {
        $sql = 'SELECT dp.id_detalles_pedidos AS ID,
                h.foto_principal AS IMAGEN,
                h.nombre_hamaca AS NOMBRE,
                dp.cantidad_comprada AS CANTIDAD,
                dp.precio_producto AS PRECIO,
                ROUND(dp.precio_producto * dp.cantidad_comprada, 2) AS TOTAL
                FROM detalles_pedidos dp
                JOIN hamacas h ON dp.id_hamaca = h.id_hamaca
                WHERE dp.id_pedido = (
                SELECT id_pedido
                FROM pedidos
                WHERE id_cliente = ? AND estado_pedido = "En camino"
                ORDER BY fecha_pedido DESC
                LIMIT 1
                );';
        $params = array($_SESSION['idCliente']);
        return Database::getRows($sql, $params);
    }


    // Método para actualizar la cantidad de un producto agregado al carrito de compras.
    public function updateDetail()
    {
        $sql = 'CALL actualizar_orden_validado(?,?,?);';
        $params = array($this->cantidad, $this->id_detalle, $_SESSION['idCliente']);
        return Database::executeRow($sql, $params);
    }

    // Método para eliminar un producto que se encuentra en el carrito de compras.
    public function deleteDetail()
    {
        $sql = 'CALL eliminar_orden_validado(?,?)';
        $params = array($this->id_detalle, $_SESSION['idCliente']);
        return Database::executeRow($sql, $params);
    }

    //Función para leer un pedido del historial de compras.
    public function readAllHistory()
    {
        $sql = 'SELECT p.id_pedido AS ID, p.estado_pedido AS ESTADO, p.fecha_pedido AS FECHA, 
        p.direccion_pedido AS DIRECCION, CONCAT(c.nombre_cliente, " ", c.apellido_cliente) AS CLIENTE
        FROM pedidos p
        INNER JOIN clientes c ON p.id_cliente = c.id_cliente
        WHERE (estado_pedido = "En camino" OR estado_pedido = "Entregado" OR estado_pedido = "Cancelado") AND c.id_cliente = ?
        ORDER BY CLIENTE;';
        $params = array($_SESSION['idCliente']);
        return Database::getRows($sql, $params);
    }

    //Función para leer un pedido del historial de compras.
    public function readOneHistory()
    {
        $sql = 'SELECT p.id_pedido AS ID, p.estado_pedido AS ESTADO, p.fecha_pedido AS FECHA, 
        p.direccion_pedido AS DIRECCION, CONCAT(c.nombre_cliente, " ", c.apellido_cliente) AS CLIENTE
        FROM pedidos p
        INNER JOIN clientes c ON p.id_cliente = c.id_cliente
        WHERE (estado_pedido = "En camino" OR estado_pedido = "Entregado" OR estado_pedido = "Cancelado") AND c.id_cliente = ?  AND p.id_pedido = ?
        ORDER BY CLIENTE;';
        $params = array($_SESSION['idCliente'], $this->id_pedido);
        return Database::getRow($sql, $params);
    }

    //Función para cambiar el estado de un pedido.
    public function changeStateCancel()
    {
        $sql = 'CALL cambiar_estado_pedido_cancelado_validado(?)';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
    //Leer fechas
    public function readDates()
    {
        $sql = 'SELECT fecha_pedido AS FECHA, fecha_pedido AS FECHAS
        FROM pedidos
        WHERE estado_pedido = "Entregado"
        GROUP BY FECHAS
        ORDER BY FECHA;';
        return Database::getRows($sql);
    }

    /*
    *   Métodos para generar reportes.
    */
    public function pedidosPorFecha()
    {
        $sql = 'SELECT p.id_pedido AS ID, p.estado_pedido AS ESTADO, p.fecha_pedido AS FECHA, 
        p.direccion_pedido AS DIRECCION, CONCAT(c.nombre_cliente, " ", c.apellido_cliente) AS CLIENTE, 
        c.foto_cliente AS FOTO FROM pedidos p
        INNER JOIN clientes c ON p.id_cliente = c.id_cliente
        WHERE estado_pedido = "Entregado" AND (fecha_pedido BETWEEN ? AND ?)
        ORDER BY CLIENTE;';
        $params = array($this->fecha_inicial, $this->fecha_final);
        return Database::getRows($sql, $params);
    }
}
