<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../auxiliares/validator.php');
// Se incluye la clase padre.
require_once('../../modelos/handler/hamacas_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla hamacas.
 */
class HamacasData extends HamacasHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;
    private $filename = null;

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */
    // Validación y asignación del ID de la hamaca.
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la hamaca es incorrecto';
            return false;
        }
    }

    // Validación y asignación del nombre de la hamaca.
    public function setNombre($value, $min = 2, $max = 50)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'El nombre debe ser un valor alfabético';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->nombre = $value;
            return true;
        } else {
            $this->data_error = 'El nombre debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    // Validación y asignación de la descripción de la hamaca.
    public function setDescripcion($value, $min = 2, $max = 250)
    {
        if (!Validator::validateString($value)) {
            $this->data_error = 'La descripción contiene caracteres prohibidos';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->descripcion = $value;
            return true;
        } else {
            $this->data_error = 'La descripción debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    // Validación y asignación del precio de la hamaca.
    public function setPrecio($value, $min = 10, $max = 1000)
    {
        if (Validator::validateMoney($value)) {
            $this->precio = $value;
            if($this->precio >= $min && $this->precio < $max){
                return true;
            }else{
                $this->data_error = 'El precio debe estar entre $' . $min . ' y $' . $max;
                return false;
            }
        } else {
            $this->data_error = 'El precio debe ser un valor numérico';
            return false;
        }
    }

    // Validación y asignación del estado de la hamaca.
    public function setEstado($value, $min = 2, $max = 50)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'El estado debe ser un valor alfabético';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->nombre = $value;
            return true;
        } else {
            $this->data_error = 'El estado debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    // Validación y asignación de la cantidad de existencias de la hamaca.
    public function setExistencias($value, $min = 1, $max = 1000)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->cantidad = $value;
            if($this->cantidad >= $min && $this->cantidad <= $max){
                return true;
            }else{
                $this->data_error = 'El valor minimo de la cantidad es ' . $min . ' y el maximo ' . $max;
                return false;
            }
        } else {
            $this->data_error = 'El valor de la cantidad debe ser numérico entero';
            return false;
        }
    }

    // Validación y asignación de la imagen de la hamaca.
    public function setImagen($file, $filename = null)
    {
        if (Validator::validateImageFile($file, 1000)) {
            $this->imagen = Validator::getFileName();
            return true;
        } elseif (Validator::getFileError()) {
            $this->data_error = Validator::getFileError();
            return false;
        } elseif ($filename) {
            $this->imagen = $filename;
            return true;
        } else {
            $this->imagen = 'default.png';
            return true;
        }
    }

    // Validación y asignación del identificador del administrador.
    public function setAdministrador($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->administrador = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de el administrador es incorrecto';
            return false;
        }
    }
        
    // Validación y asignación del identificador de la categoría.
    public function setCategoria($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->categoria = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la categoria es incorrecto';
            return false;
        }
    }
        
    // Validación y asignación del identificador del material.
    public function setMaterial($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->material = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de el material es incorrecto';
            return false;
        }
    }
    
    // Asignación del nombre del archivo de imagen de la hamaca.
    public function setFilename()
    {
        if ($data = $this->readFilename()) {
            $this->filename = $data['IMAGEN'];
            return true;
        } else {
            $this->data_error = 'Imagen inexistente';
            return false;
        }
    }

    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }

    // Método para obtener el nombre del archivo de imagen.
    public function getFilename()
    {
        return $this->filename;
    }
}
