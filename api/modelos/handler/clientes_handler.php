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
    protected $nombre = null;
    protected $apellido = null;
    protected $nombre_completo = null;
    protected $correo = null;
    protected $telefono = null;
    protected $dui = null;
    protected $nacimiento = null;
    protected $direccion = null;
    protected $clave = null;
    protected $estado = null;
    protected $genero = null;
    protected $imagen = null;

    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../imagenes/clientes/';

    //Metodos para la privada

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */

    public function createRow()
    {
        $sql = 'CALL insertar_cliente_validado(?,?,?,?,?,?,?,?,?,?)';
        $params = array($this->nombre, $this->apellido, $this->clave, $this->correo, $this->telefono, $this->dui, $this->nacimiento, $this->genero, $this->imagen, $this->direccion);
        return Database::executeRow($sql, $params);
    }


    //Función para actualizar un admministrador.
    public function updateRow()
    {
        $sql = 'CALL actualizar_cliente_validado(?,?,?,?,?,?,?,?,?,?);';
        $params = array(
            $_SESSION['idCliente'],
            $this->nombre,
            $this->apellido,
            $this->correo,
            $this->telefono,
            $this->dui,
            $this->nacimiento,
            $this->genero,
            $this->imagen,
            $this->direccion
        );
        return Database::executeRow($sql, $params);
    }

    // Función para leer un registro
    public function readOne()
    {
        $sql = 'SELECT id_cliente AS ID,
        nombre_cliente AS NOMBRE,
        apellido_cliente AS APELLIDO,
        correo_cliente AS CORREO,
        telefono_cliente AS TELÉFONO,
        dui_cliente AS DUI,
        fecha_nacimiento_cliente AS NACIMIENTO,
        genero_cliente AS GENERO,
        direccion_cliente AS DIRECCION,
        foto_cliente AS FOTO,
        CONCAT(nombre_cliente," ",apellido_cliente) AS NOMBRE_COMPLETO,
        estado_cliente AS ESTADO
        FROM clientes
        WHERE id_cliente LIKE ?';
        $params = array($_SESSION['idCliente']);
        $data = Database::getRow($sql, $params);
        if ($data) {
            $this->id = $data['ID'];
            $this->correo = $data['CORREO'];
            $this->dui = $data['DUI'];
            $this->estado = $data['ESTADO'];
            $this->imagen = $data['FOTO'];
            $this->nombre_completo = $data['NOMBRE_COMPLETO'];
            $this->direccion = $data['DIRECCION'];
            if ($this->checkStatus()) {
                return $data;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }


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
        $sql = 'SELECT id_cliente AS ID, nombre_cliente AS NOMBRE, correo_cliente AS CORREO, apellido_cliente AS APELLIDO, fecha_registro AS FECHA,
         telefono_cliente AS TELEFONO, dui_cliente AS DUI, CASE 
        WHEN estado_cliente = 1 THEN "Activo"
        WHEN estado_cliente = 0 THEN "Bloqueado"
        END AS ESTADO, foto_cliente AS FOTO, CONCAT(nombre_cliente," ",apellido_cliente) AS NOMBRE_COMPLETO
        FROM clientes
                ORDER BY NOMBRE;';
        return Database::getRows($sql);
    }

    // Función para leer todos los clientes bloqueados
    public function readAllBlocks()
    {
        $sql = 'SELECT id_cliente AS ID, nombre_cliente AS NOMBRE, correo_cliente AS CORREO, apellido_cliente AS APELLIDO, fecha_registro AS FECHA,
         telefono_cliente AS TELEFONO, dui_cliente AS DUI, CASE 
        WHEN estado_cliente = 1 THEN "Activo"
        WHEN estado_cliente = 0 THEN "Bloqueado"
        END AS ESTADO, foto_cliente AS FOTO, CONCAT(nombre_cliente," ",apellido_cliente) AS NOMBRE_COMPLETO FROM clientes WHERE estado_cliente = 0
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

    //Metodos para la publica

    /*
    *   Métodos para gestionar la cuenta del cliente.
    */

    public function checkUser($mail, $password)
    {
        $sql = 'SELECT id_cliente, correo_cliente, dui_cliente, clave_cliente, direccion_cliente ,estado_cliente, foto_cliente, CONCAT(nombre_cliente," ",apellido_cliente) AS nombre_completo
                FROM clientes
                WHERE correo_cliente = ?';
        $params = array($mail);
        $data = Database::getRow($sql, $params);
        if (password_verify($password, $data['clave_cliente'])) {
            $this->id = $data['id_cliente'];
            $this->correo = $data['correo_cliente'];
            $this->dui = $data['dui_cliente'];
            $this->estado = $data['estado_cliente'];
            $this->imagen = $data['foto_cliente'];
            $this->nombre_completo = $data['nombre_completo'];
            $this->direccion = $data['direccion_cliente'];
            return true;
        } else {
            return false;
        }
    }

    // Función para chequear el estado de la cuenta y además asígnar las variables de sesión
    public function checkStatus()
    {
        if ($this->estado) {
            $_SESSION['idCliente'] = $this->id;
            $_SESSION['correoCliente'] = $this->correo;
            $_SESSION['duiCliente'] = $this->dui;
            $_SESSION['fotoCliente'] = $this->imagen;
            $_SESSION['direccionCliente'] = $this->direccion;
            $_SESSION['USERNAME'] = $this->nombre_completo;
            return true;
        } else {
            return false;
        }
    }

    // Función para chequear la contraseña
    public function checkPassword($password)
    {
        $sql = 'SELECT clave_cliente AS CLAVE
                FROM clientes
                WHERE id_cliente = ?';
        $params = array($_SESSION['idCliente']);
        $data = Database::getRow($sql, $params);
        // Se verifica si la contraseña coincide con el hash almacenado en la base de datos.
        if (password_verify($password, $data['CLAVE'])) {
            return true;
        } else {
            return false;
        }
    }

    // Función para cambiar la contraseña
    public function changePassword()
    {
        $sql = 'UPDATE clientes
                SET clave_cliente = ?
                WHERE id_cliente = ?';
        $params = array($this->clave, $_SESSION['idCliente']);
        return Database::executeRow($sql, $params);
    }

    // Función para leer el perfil del cliente activo
    public function readProfile()
    {
        $sql = 'SELECT id_cliente, correo_cliente AS EMAIL , clave_cliente, estado_cliente, foto_cliente AS IMAGEN, 
                nombre_cliente AS NOMBRE, CONCAT(nombre_cliente," ",apellido_cliente) AS nombre_completo, dui_cliente, direccion_cliente
                FROM clientes
                WHERE id_cliente = ?';
        $params = array($_SESSION['idCliente']);
        $data = Database::getRow($sql, $params);
        if ($data) {
            $this->id = $data['id_cliente'];
            $this->correo = $data['EMAIL'];
            $this->dui = $data['dui_cliente'];
            $this->estado = $data['estado_cliente'];
            $this->imagen = $data['IMAGEN'];
            $this->nombre_completo = $data['nombre_completo'];
            $this->direccion = $data['direccion_cliente'];
            return $data;
        } else {
            return false;
        }
    }


    // Función para editar el perfil
    public function editProfile()
    {
        $sql = 'UPDATE cliente
                SET nombre_cliente = ?, apellido_cliente = ?, correo_cliente = ?, dui_cliente = ?, telefono_cliente = ?, nacimiento_cliente = ?, direccion_cliente = ?
                WHERE id_cliente = ?';
        $params = array($this->nombre, $this->apellido, $this->correo, $this->dui, $this->telefono, $this->nacimiento, $this->direccion, $this->id);
        return Database::executeRow($sql, $params);
    }

    // Función para cambiar el estado
    public function changeStatus()
    {
        $sql = 'UPDATE cliente
                SET estado_cliente = ?
                WHERE id_cliente = ?';
        $params = array($this->estado, $this->id);
        return Database::executeRow($sql, $params);
    }

    // Función para chequear que el dui y el correo del cliente no esten repetidos
    public function checkDuplicate($value)
    {
        $sql = 'SELECT id_cliente
                FROM clientes
                WHERE dui_cliente = ? OR correo_cliente = ?';
        $params = array($value, $value);
        return Database::getRow($sql, $params);
    }
}
