<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../auxiliares/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla administrador.
 */
class CategoriasHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $nombre = null;
    protected $descripcion = null;
    protected $imagen = null;

    //constante para establecer la ruta de la imágenes.
    const RUTA_IMAGEN = '../../imagenes/categorias/';

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT id_categoria AS ID, nombre_categoria AS NOMBRE, descripcion_categoria AS DESCRIPCION, foto_categoria AS IMAGEN FROM categorias
                WHERE nombre_categoria LIKE ?
                ORDER BY NOMBRE;';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    // Función para insertar una categoría
    public function createRow()
    {
        $sql = 'CALL insertar_categoria(?,?,?);';
        $params = array($this->nombre, $this->descripcion, $this->imagen);
        return Database::executeRow($sql, $params);
    }

    // Función para mostrar todas las categorías
    public function readAll()
    {
        $sql = 'SELECT id_categoria AS ID, nombre_categoria AS NOMBRE, descripcion_categoria AS DESCRIPCION, foto_categoria AS IMAGEN FROM categorias
                ORDER BY NOMBRE;';
        return Database::getRows($sql);
    }

    // Función para mostrar una categoría
    public function readOne()
    {
        $sql = 'SELECT id_categoria AS ID, nombre_categoria AS NOMBRE, descripcion_categoria AS DESCRIPCION, foto_categoria AS IMAGEN FROM categorias
                WHERE id_categoria = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    // Función para actualizar una categoría
    public function updateRow()
    {
        $sql = 'CALL actualizar_categoria(?, ?, ?, ?);';
        $params = array($this->id, $this->nombre, $this->descripcion, $this->imagen);
        return Database::executeRow($sql, $params);
    }

    // Función para eliminar una categoría
    public function deleteRow()
    {
        $sql = 'CALL eliminar_categoria(?);';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    //Función para leer la imagen del id desde la base.
    public function readFilename()
    {
        $sql = 'SELECT foto_categoria AS IMAGEN
                 FROM categorias
                 WHERE id_categoria = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

}
