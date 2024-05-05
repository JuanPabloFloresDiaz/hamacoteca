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
    protected $estado = null;
    protected $tiempo = null;
    protected $dias = null;
    protected $bloqueo = null;
    protected $condicion = null;


    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../imagenes/administradores/';

    /*
     *  Métodos para gestionar la cuenta del administrador.
     */

    //Función para chequear el usuario de un admministrador en el login, con el procedimiento almacenado.
    public function authenticateAdmin($aliasemail, $password)
    {
        //Se llama el procedimiento almacenado
        $sql = 'CALL autentificar_administrador(?);';
        //Se mandan los parametros en el orden que lo pide el procedimiento. Primer parametro: Alias o Correo. Segundo parametro: Clave
        $params = array($aliasemail);
        //Se crea una variable y se le cede la variable de la sentencia sql y los parametros
        $data = Database::getRow($sql, $params);
        // Se verifica si la contraseña coincide con el hash almacenado en la base de datos.
        if (password_verify($password, $data['clave_administrador'])) {
            //Se ceden el id y el alias a una variable de sesión
            $_SESSION['idAdministrador'] = $data['ID'];
            $_SESSION['aliasAdministrador'] = $data['ALIAS'];
            $_SESSION['fotoAdministrador'] = $data['FOTO'];
            return true;
        } else {
            //Se retorna false si falla la autentificación
            return false;
        }
    }

    //Función para chequear el usuario de un admministrador en el login, sin el procedimiento almacenado.
    public function checkUser($username, $password)
    {
        //Se escribe la consulta
        $sql = 'SELECT id_administrador AS ID, alias_administrador AS ALIAS, 
        clave_administrador AS CLAVE, foto_administrador AS FOTO, estado_administrador AS ESTADO, 
        intentos_administrador AS INTENTOS, DATEDIFF(CURRENT_DATE, fecha_clave) as DIAS, tiempo_intento AS TIEMPO
        FROM administradores WHERE (BINARY alias_administrador = ? OR BINARY correo_administrador = ?)';
        //Se mandan los parametros en el orden que lo pide el procedimiento. Primer parametro: Alias o Correo. Segundo parametro: Clave
        $params = array($username, $username);
        $data = Database::getRow($sql, $params);
        // Se verifica si la contraseña coincide con el hash almacenado en la base de datos.
        if ($data['ESTADO'] == false) {
            //el usuario esta bloqueado
            return $this->condicion = 'bloqueado';
        } elseif ($data['ESTADO'] == true) {
            $timer = null;
            $this->tiempo = $data['TIEMPO'];
            //se verifica si el usuario tiene contador de tiempo
            if (Validator::validateAttemptsTime($data['TIEMPO']) != true) {
                //el usuario tiene contador de tiempo
                $timer = false;
                $this->tiempo = Validator::validateAttemptsTime($data['TIEMPO']);
            } else {
                //el usuario no tiene contador
                $this->alias = $data['ALIAS'];
                $this->resetTimeAttempt(null);
                $timer = true;
            }
            if ($timer == false) {
                //el usuario tiene contador de tiempo
                $this->condicion = 'temporizador';
            } elseif ($data['INTENTOS'] >= 6) {
                //las contraseñas no coinciden, se validan los intentos de sesión para ver si el usuario deberia tener un cotnador
                $this->condicion = 'tiempo';
            } elseif ($data['INTENTOS'] > 30) {
                //las contraseñas no coinciden, se valida los intentos para ver si el usuario debe ser bloqueado
                $this->condicion = 'bloquear';
            } elseif (password_verify($password, $data['CLAVE'])) {
                $_SESSION['idAdministrador'] = $data['ID'];
                $_SESSION['aliasAdministrador'] = $data['ALIAS'];
                $_SESSION['fotoAdministrador'] = $data['FOTO'];
                $this->dias = $data['DIAS'];
                $this->estado = $data['ESTADO'];
                return true;
            } else {
                //Se retorna false si falla la autentificación
                return false;
            }
        } else {
            //Se retorna false si falla la autentificación
            return false;
        }
    }

    public function resetCondition()
    {
        return $this->condicion = null;
    }

    public function checkStatus()
    {
        if ($this->estado) {
            return true;
        } else {
            return false;
        }
    }

    //Función para chequear la contraseña de un admministrador.
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


    //Función para cambiar la contraseña de un admministrador.
    public function changePassword()
    {
        $sql = 'UPDATE administradores
                SET clave_administrador = ?, fecha_clave = NOW()
                WHERE id_administrador = ?';
        $params = array($this->clave, $_SESSION['idadministrador']);
        return Database::executeRow($sql, $params);
    }

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    //Función para buscar un admministrador o varios.
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT * FROM vista_tabla_administradores
        WHERE NOMBRE LIKE ?
        ORDER BY NOMBRE;';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    //Función para insertar un admministrador.
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

    //Función para leer todos los admministradores.
    public function readAll()
    {
        $sql = 'SELECT * FROM vista_tabla_administradores
        ORDER BY NOMBRE;';
        return Database::getRows($sql);
    }

    //Función para leer un administrador.
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

    //Función para leer la imagen del id desde la base.
    public function readFilename()
    {
        $sql = 'SELECT IMAGEN
                FROM vista_tabla_administradores
                WHERE ID = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    //Función para actualizar un admministrador.
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

    //Función para eliminar un admministrador.
    public function deleteRow()
    {
        $sql = 'CALL eliminar_administrador_validado(?);';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    //Función para chequear si el DUI o el CORREO estan duplicados.
    public function checkDuplicate($value)
    {
        $sql = 'SELECT ID
                FROM vista_tabla_administradores
                WHERE DUI = ? OR CORREO = ?';
        $params = array($value, $value);
        return Database::getRow($sql, $params);
    }

    //Función para ingresar el primer usuario.
    public function firstUser()
    {
        $sql = 'CALL insertar_administrador(?,?,?,?,?,?,?,1,?);';
        $params = array(
            $this->nombre,
            $this->apellido,
            $this->clave,
            $this->correo,
            $this->telefono,
            $this->dui,
            $this->nacimiento,
            $this->imagen
        );
        return Database::executeRow($sql, $params);
    }

    //Función para validación de cambio de contraseña cada 90 dias.
    public function readPassDate()
    {
        $sql = 'SELECT DATEDIFF(CURRENT_DATE, fecha_clave) AS DIAS FROM administradores WHERE id_administrador = ?;';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    //Agregar un intento fallido de inicio al usuario
    public function addAttempt()
    {
        $sql = 'UPDATE administradores SET intentos_administrador = intentos_administrador+1 WHERE alias_administrador = ?';
        $params = array($this->alias);
        return Database::executeRow($sql, $params);
    }

    //Reiniciar el contador de intentos a 0
    public function resetAttempts()
    {
        $sql = 'UPDATE administradores SET intentos_administrador = 0 WHERE alias_administrador = ?';
        $params = array($this->alias);
        return Database::executeRow($sql, $params);
    }

    //cambiar el contador de tiempo para incicar sesion nuevamente
    public function uploadTimeAttempt()
    {
        $sql = 'UPDATE administradores SET tiempo_intento = NOW() WHERE alias_administrador = ?';
        $params = array($this->alias);
        return Database::executeRow($sql, $params);
    }

    //cambiar el contador de tiempo para incicar sesion nuevamente
    public function resetTimeAttempt($timer)
    {
        $sql = 'UPDATE administradores SET tiempo_intento = ? WHERE alias_administrador = ?';
        $params = array($timer ,$this->alias);
        return Database::executeRow($sql, $params);
    }

    //bloquear un administrador
    public function blockUser()
    {
        $sql = 'UPDATE administradores SET estado_administrador = 0, fecha_bloqueo = NOW() WHERE alias_administrador = ?';
        $params = array($this->alias);
        return Database::executeRow($sql, $params);
    }
}
