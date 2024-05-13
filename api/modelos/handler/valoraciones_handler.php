<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../auxiliares/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla administrador.
 */
class ValoracionesHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;

    protected $estado = null;

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT * FROM vista_tabla_valoraciones
                WHERE NOMBRE LIKE ?
                ORDER BY NOMBRE;';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT * FROM vista_tabla_valoraciones
                ORDER BY NOMBRE;';
        return Database::getRows($sql);
    }

    //Función para cambiar el estado de un admministrador.
    public function changeState()
    {
        $sql = 'CALL cambiar_estado_valoracion(?);';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }


}
