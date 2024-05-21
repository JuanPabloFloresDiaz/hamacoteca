<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../auxiliares/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla materiales.
 */
class FotosHandler
{
    /*
    * Declaración de atributos para el manejo de datos.
    */
    protected $id = null;
    protected $hamaca = null;
    protected $imagen = null;

    //constante para establecer la ruta de la imágenes.
    const RUTA_IMAGEN = '../../imagenes/fotos/';

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    //Función para buscar una foto (no utilizada)
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT id_foto AS ID, id_hamaca AS HAMACA, url AS IMAGEN FROM fotos
                WHERE id_hamaca LIKE ?
                ORDER BY id_hamaca;';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    //Función para insertar una foto
    public function createRow()
    {
        $sql = 'CALL insertar_foto(?,?);';
        $params = array($this->imagen, $this->hamaca);
        return Database::executeRow($sql, $params);
    }

    //Función para mostrar todas las fotos
    public function readAll()
    {
        $sql = 'SELECT id_foto AS ID, id_hamaca AS HAMACA, url AS IMAGEN FROM fotos
                WHERE id_hamaca = ?
                ORDER BY id_hamaca;';
        $params = array($this->hamaca);
        return Database::getRows($sql, $params);
    }

    //Función para traer una foto
    public function readOne()
    {
        $sql = 'SELECT id_foto AS ID, id_hamaca AS HAMACA, url AS IMAGEN FROM fotos
                WHERE id_foto = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    //Función para leer la imagen del id desde la base.
    public function readFilename()
    {
        $sql = 'SELECT url AS IMAGEN 
                FROM fotos
                WHERE id_foto = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    //Función para actualizar una foto
    public function updateRow()
    {
        $sql = 'CALL actualizar_foto(?, ?, ?);';
        $params = array($this->id, $this->imagen, $this->hamaca);
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar una foto
    public function deleteRow()
    {
        $sql = 'CALL eliminar_foto(?);';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
