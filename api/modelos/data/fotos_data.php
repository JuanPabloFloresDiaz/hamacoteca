<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../auxiliares/validator.php');
// Se incluye la clase padre.
require_once('../../modelos/handler/fotos_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla fotos.
 */
class FotosData extends FotosHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;
    // Atributo para almacenar el nombre del archivo de imagen.
    private $filename = null;

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */
    // Validación y asignación del ID de la foto.
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la foto es incorrecto';
            return false;
        }
    }

    // Validación y asignación del ID de la hamaca.
    public function setHamaca($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->hamaca = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la hamaca es incorrecto';
            return false;
        }
    }

    // Validación y asignación de la imagen de la foto de la hamaca.
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
            $this->imagen = 'default.jpg';
            return true;
        }
    }

    // Asignación del nombre del archivo de imagen de la foto de la hamaca.
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
