<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../auxiliares/validator.php');
// Se incluye la clase padre.
require_once('../../modelos/handler/categorias_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla categorias.
 */
class CategoriasData extends CategoriasHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;
    // Atributo para almacenar el nombre del archivo de imagen.
    private $filename = null;


    /*
     *  Métodos para validar y asignar valores de los atributos.
     */
    // Validación y asignación del ID de la categoría.
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la categoría es incorrecto';
            return false;
        }
    }

    // Validación y asignación del nombre de la categoría.
    public function setNombre($value, $min = 2, $max = 60)
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

    // Validación y asignación de la descripción de la categoría.
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

    // Validación y asignación de la imagen del material.
    public function setImagen($file, $filename = null)
    {
        if (Validator::validateImageFile($file, 1000)) {
            $this->imagen = Validator::getFilename();
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
    
    // Asignación del nombre del archivo de imagen del material.
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
