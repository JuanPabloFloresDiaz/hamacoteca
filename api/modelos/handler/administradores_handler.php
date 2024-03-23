<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../auxiliares/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla administrador.
 */
class AdministradoresHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $nombre = null;
    protected $apellido = null;
    protected $correo = null;
    protected $alias = null;
    protected $clave = null;
    protected $telefono = null;
    protected $dui = null;
    protected $nacimiento = null;
    protected $rol = null;
    protected $foto = null;

    /*
     *  Métodos para gestionar la cuenta del administrador.
     */

    public function authenticateAdmin($aliasemail, $password)
    {
        //Se llama el procedimiento almacenado
        $sql = 'CALL autentificar_administrador(?, ?);';
        //Se mandan los parametros en el orden que lo pide el procedimiento. Primer parametro: Alias o Correo. Segundo parametro: Clave
        $params = array($aliasemail, $password);
        //Se crea una variable y se le cede la variable de la sentencia sql y los parametros
        $data = Database::getRow($sql, $params);
        // Se verifica si la contraseña coincide con el hash almacenado en la base de datos.
        if (password_verify($password, $data['clave_administrador'])) {
            //Se ceden el id y el alias a una variable de sesión
            $_SESSION['idAdministrador'] = $data['id_administrador'];
            $_SESSION['aliasAdministrador'] = $data['alias_administrador'];
            //Se retorna true si todo sale bien
            return true;
        } else {
            //Se retorna false si falla la autentificación
            return false;
        }
    }

    /*
     *  Métodos para gestionar la cuenta del administrador.
     */
    public function checkUser($username, $password)
    {
        $sql = 'SELECT id_administrador, alias_administrador, clave_administrador
                FROM administrador
                WHERE  alias_administrador = ?';
        $params = array($username);
        $data = Database::getRow($sql, $params);
        if (password_verify($password, $data['clave_administrador'])) {
            $_SESSION['idAdministrador'] = $data['id_administrador'];
            $_SESSION['aliasAdministrador'] = $data['alias_administrador'];
            return true;
        } else {
            return false;
        }
    }

    public function checkPassword($password)
    {
        $sql = 'SELECT clave_administrador
                FROM administradores
                WHERE id_administrador = ?';
        $params = array($_SESSION['idAdministrador']);
        $data = Database::getRow($sql, $params);
        // Se verifica si la contraseña coincide con el hash almacenado en la base de datos.
        if (password_verify($password, $data['clave_administrador'])) {
            return true;
        } else {
            return false;
        }
    }


    public function changePassword()
    {
        $sql = 'UPDATE administradores
                SET clave_administrador = ?
                WHERE id_administrador = ?';
        $params = array($this->clave, $_SESSION['idadministrador']);
        return Database::executeRow($sql, $params);
    }

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT * FROM vista_tabla_administradores
        WHERE NOMBRE LIKE ?
        ORDER BY NOMBRE;';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'CALL actualizar_administrador_validado(?,?,?,?,?,?,?,?,?);';
        $params = array(
            $this->nombre,
            $this->apellido,
            $this->clave,
            $this->correo,
            $this->telefono,
            $this->dui,
            $this->nacimiento,
            $this->rol,
            $this->foto
        );
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT * FROM vista_tabla_administradores
        ORDER BY NOMBRE;';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT * FROM vista_tabla_administradores
        WHERE ID LIKE ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'CALL actualizar_administrador_validado(?,?,?,?,?,?,?,?,?,?);';
        $params = array(
            $this->id,
            $this->nombre,
            $this->apellido,
            $this->clave,
            $this->correo,
            $this->telefono,
            $this->dui,
            $this->nacimiento,
            $this->rol,
            $this->foto
        );
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'CALL eliminar_administrador_validado(?);';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
