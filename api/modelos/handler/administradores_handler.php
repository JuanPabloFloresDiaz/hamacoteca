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
    protected $imagen = null;

    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../imagenes/administradores/';

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
        $sql = 'SELECT id_administrador AS ID, alias_administrador AS ALIAS, clave_administrador AS CLAVE
                FROM administradores
                WHERE  alias_administrador = ?';
        $params = array($username);
        $data = Database::getRow($sql, $params);
        if (password_verify($password, $data['CLAVE'])) {
            $_SESSION['idAdministrador'] = $data['ID'];
            $_SESSION['aliasAdministrador'] = $data['ALIAS'];
            return true;
        } else {
            return false;
        }
    }

    public function checkPassword($password)
    {
        $sql = 'SELECT clave_administrador AS CLAVE
                FROM administradores
                WHERE id_administrador = ?';
        $params = array($_SESSION['idAdministrador']);
        $data = Database::getRow($sql, $params);
        // Se verifica si la contraseña coincide con el hash almacenado en la base de datos.
        if (password_verify($password, $data['CLAVE'])) {
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
        $sql = 'CALL insertar_administrador(?,?,?,?,?,?,?,?,?);';
        $params = array(
            $this->nombre,
            $this->apellido,
            $this->clave,
            $this->correo,
            $this->telefono,
            $this->dui,
            $this->nacimiento,
            $this->rol,
            $this->imagen
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
        $sql = 'SELECT id_administrador AS ID,
        nombre_administrador AS NOMBRE,
        apellido_administrador AS APELLIDO,
        correo_administrador AS CORREO,
        telefono_administrador AS TELÉFONO,
        dui_administrador AS DUI,
        fecha_nacimiento_administrador AS NACIMIENTO,
        clave_administrador AS CLAVE,
        id_rol AS ROL
        FROM administradores
        WHERE id_administrador LIKE ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }
    
    public function readFilename()
    {
        $sql = 'SELECT IMAGEN
                FROM vista_tabla_administradores
                WHERE ID = ?';
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
            $this->imagen
        );
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'CALL eliminar_administrador_validado(?);';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    public function checkDuplicate($value)
    {
        $sql = 'SELECT ID
                FROM vista_tabla_administradores
                WHERE DUI = ? OR CORREO = ?';
        $params = array($value, $value);
        return Database::getRow($sql, $params);
    }
}
