<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../auxiliares/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla materiales.
 */
class MaterialesHandler
{
    /*
    * Declaración de atributos para el manejo de datos.
    */
    protected $id = null;
    protected $nombre = null;
    protected $descripcion = null;
    protected $imagen = null;

    //constante para establecer la ruta de la imágenes.
    const RUTA_IMAGEN = '../../imagenes/materiales/';

    /*
    * Métodos para gestionar los materiales.
    */

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    //Función para buscar los materiales
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT id_material AS ID, nombre_material AS NOMBRE, descripcion_material AS DESCRIPCION, foto_material AS IMAGEN FROM materiales
                WHERE nombre_material LIKE ?
                ORDER BY nombre_material;';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    //Función para crear un material
    public function createRow()
    {
        $sql = 'CALL insertar_material(?,?,?);';
        $params = array($this->nombre, $this->descripcion, $this->imagen);
        return Database::executeRow($sql, $params);
    }

    //Función para mostrar todos los materiales
    public function readAll()
    {
        $sql = 'SELECT id_material AS ID, nombre_material AS NOMBRE, descripcion_material AS DESCRIPCION, foto_material AS IMAGEN FROM materiales
                ORDER BY nombre_material;';
        return Database::getRows($sql);
    }

    //Función para mostrar un material
    public function readOne()
    {
        $sql = 'SELECT id_material AS ID, nombre_material AS NOMBRE, descripcion_material AS DESCRIPCION, foto_material AS IMAGEN FROM materiales
                WHERE id_material = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    //Función para leer la imagen del id desde la base.
    public function readFilename()
    {
        $sql = 'SELECT foto_material AS IMAGEN
                 FROM materiales
                 WHERE id_material = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    //Función para actualizar un material
    public function updateRow()
    {
        $sql = 'CALL actualizar_material(?, ?, ?, ?);';
        $params = array($this->id, $this->nombre, $this->descripcion, $this->imagen);
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar un material
    public function deleteRow()
    {
        $sql = 'CALL eliminar_material(?);';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    //Función para generar una gráfica de productos por material
    public function graphic()
    {
        $sql = 'SELECT SUM(cantidad_hamaca) AS TOTAL, nombre_hamaca AS HAMACA FROM hamacas
        WHERE id_material = ? GROUP BY HAMACA;';
        $params = array($this->id);
        return Database::getRows($sql, $params);
    }
}
