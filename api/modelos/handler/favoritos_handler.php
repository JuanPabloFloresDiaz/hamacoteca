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
}
