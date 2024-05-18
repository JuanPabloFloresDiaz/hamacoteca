<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../auxiliares/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla administrador.
 */
class ClientesHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */

    // Función para buscar un cliente
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT id_cliente AS ID, nombre_cliente AS NOMBRE, correo_cliente AS CORREO,
         telefono_cliente AS TELEFONO, dui_cliente AS DUI, CASE 
        WHEN estado_cliente = 1 THEN "Activo"
        WHEN estado_cliente = 0 THEN "Bloqueado"
        END AS ESTADO, foto_cliente AS FOTO FROM clientes
                WHERE nombre_cliente LIKE ?
                ORDER BY NOMBRE;';
        $params = array($value);
        return Database::getRows($sql, $params);
    }
    // Función para leer todos los clientes
    public function readAll()
    {
        $sql = 'SELECT id_cliente AS ID, nombre_cliente AS NOMBRE, correo_cliente AS CORREO,
         telefono_cliente AS TELEFONO, dui_cliente AS DUI, CASE 
        WHEN estado_cliente = 1 THEN "Activo"
        WHEN estado_cliente = 0 THEN "Bloqueado"
        END AS ESTADO, foto_cliente AS FOTO FROM clientes
                ORDER BY NOMBRE;';
        return Database::getRows($sql);
    }

    //Función para contar los clientes registrados
    public function totalClients()
    {
        $sql = 'SELECT COUNT(*) AS TOTAL
        FROM clientes;
        ';
        return Database::getRows($sql);
    }

    //Función para contar los bloqueados
    public function totalBlocks()
    {
        $sql = 'SELECT COUNT(*) AS TOTAL
        FROM clientes
        WHERE estado_cliente = 0   
        ';
        return Database::getRows($sql);
    }

    //Función para leer la imagen del id desde la base.
    public function readFilename()
    {
        $sql = 'SELECT foto_cliente AS FOTO 
                FROM clientes
                 WHERE id_cliente = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }


    //Función para cambiar el estado de un cliente.
    public function changeState()
    {
        $sql = 'CALL cambiar_estado_cliente(?);';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
