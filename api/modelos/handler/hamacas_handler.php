<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../auxiliares/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla administrador.
 */
class HamacasHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $nombre = null;
    protected $descripcion = null;
    protected $precio = null;
    protected $estado = null;
    protected $cantidad = null;
    protected $imagen = null;
    protected $administrador = null;
    protected $categoria = null;
    protected $material = null;
    
    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../imagenes/hamacas/';

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT * FROM vista_tabla_hamacas
                WHERE NOMBRE LIKE ?
                ORDER BY NOMBRE;';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'CALL insertar_hamaca(?,?,?,?,?,?,1,?,?);';
        $params = array($this->nombre, $this->descripcion, $this->precio, $this->estado, $this->cantidad, $this->imagen, $this->categoria, $this->material);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT * FROM vista_tabla_hamacas
                ORDER BY NOMBRE;';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT id_hamaca AS ID,
        foto_principal AS IMAGEN, 
        nombre_hamaca AS NOMBRE,
        descripcion_hamaca AS DESCRIPCIÓN, 
        cantidad_hamaca AS CANTIDAD,
        precio AS PRECIO,
        estado_venta AS ESTADO,
        id_administrador AS ADMINISTRADOR,
        id_categoria AS CATEGORIA,
        id_material AS MATERIAL
        FROM hamacas
        WHERE id_hamaca = ?;';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function readFilename()
    {
        $sql = 'SELECT IMAGEN
                FROM vista_tabla_hamacas
                WHERE ID = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'CALL actualizar_hamaca(?,?,?,?,?,?,?,?,?,?);';
        $params = array($this->id, $this->nombre, $this->descripcion, $this->precio, $this->estado, $this->cantidad, $this->imagen, $this->administrador, $this->categoria, $this->material);
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'CALL eliminar_hamaca(?);';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
