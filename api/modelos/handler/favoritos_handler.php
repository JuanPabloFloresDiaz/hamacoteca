<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../auxiliares/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla favoritos.
 */
class FavoritosHandler
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
        $sql = 'SELECT CONCAT(c.nombre_cliente, " ", c.apellido_cliente) AS CLIENTE, c.foto_cliente AS FOTO
        FROM  favoritos f INNER JOIN clientes c ON f.id_cliente = c.id_cliente WHERE f.id_hamaca = ?;';
        $params = array($this->id);
        return Database::getRows($sql, $params);
    }

    //Función para leer la imagen del id desde la base.
    public function readFilename()
    {
        $sql = 'SELECT c.foto_cliente AS FOTO
        FROM  favoritos f INNER JOIN clientes c ON f.id_cliente = c.id_cliente WHERE f.id_hamaca = ?;';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    //Función para leer todos los favoritos.
    public function readAll()
    {
        $sql = 'SELECT h.id_hamaca AS ID, 
        h.nombre_hamaca AS NOMBRE, 
        h.descripcion_hamaca AS DESCRIPCION, 
        h.precio AS PRECIO, 
        h.foto_principal AS IMAGEN FROM favoritos f
        INNER JOIN hamacas h USING(id_hamaca)
        WHERE f.id_cliente = ?;';
        $params = array($_SESSION['idCliente']);
        return Database::getRows($sql, $params);
    }

    //Verificar que el producto este guardado en favorito
    public function verifySave()
    {
        $sql = 'SELECT COUNT(*) AS FAVORITO
        FROM  favoritos f INNER JOIN clientes c ON f.id_cliente = c.id_cliente WHERE f.id_hamaca = ? AND f.id_cliente = ?;';
        $params = array($this->id, $_SESSION['idCliente']);
        return Database::getRows($sql, $params);
    }

    //Función para chequear si el producto ya esta en el carrito.
    public function checkDuplicate()
    {
        $sql = 'SELECT COUNT(*) AS VERIFICAR
                   FROM favoritos
                   WHERE id_hamaca = ? AND id_cliente = ?';
        $params = array($this->id, $_SESSION['idCliente']);
        return Database::getRow($sql, $params);
    }

    //Función para guardar en favoritos
    public function createRow()
    {
        $sql = 'INSERT INTO favoritos (id_hamaca, id_cliente) VALUES (?, ?);';
        $params = array($this->id, $_SESSION['idCliente']);
        return Database::executeRow($sql, $params);
    }
}
