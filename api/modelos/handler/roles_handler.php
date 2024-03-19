<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../auxiliares/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla administrador.
 */
class RolesHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $nombre = null;

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT * FROM vista_roles_administradores
                WHERE NOMBRE LIKE ?
                ORDER BY NOMBRE';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'CALL insertar_rol_administrador(?);';
        $params = array($this->nombre);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT ID, NOMBRE FROM vista_roles_administradores
                ORDER BY NOMBRE;';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT ID, NOMBRE FROM vista_roles_administradores
                WHERE ID = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'CALL actualizar_rol_administrador(?, ?);';
        $params = array($this->id, $this->nombre);
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'CALL eliminar_rol_administrador(?);';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
