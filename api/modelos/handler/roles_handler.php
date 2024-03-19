<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
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
        $sql = 'SELECT id_administrador, nombre_administrador, apellido_administrador, correo_administrador, alias_administrador
                FROM administrador
                WHERE apellido_administrador LIKE ? OR nombre_administrador LIKE ?
                ORDER BY apellido_administrador';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO administrador(nombre_administrador, apellido_administrador, correo_administrador, alias_administrador, clave_administrador)
                VALUES(?, ?, ?, ?, ?)';
        $params = array($this->nombre);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT id_administrador, nombre_administrador, apellido_administrador, correo_administrador, alias_administrador
                FROM administrador
                ORDER BY apellido_administrador';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT id_administrador, nombre_administrador, apellido_administrador, correo_administrador, alias_administrador
                FROM administrador
                WHERE id_administrador = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'UPDATE administrador
                SET nombre_administrador = ?, apellido_administrador = ?, correo_administrador = ?
                WHERE id_administrador = ?';
        $params = array($this->nombre, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM administrador
                WHERE id_administrador = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

}