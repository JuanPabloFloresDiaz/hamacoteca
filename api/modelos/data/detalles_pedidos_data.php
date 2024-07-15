<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../auxiliares/validator.php');
// Se incluye la clase padre.
require_once('../../modelos/handler/detalles_pedidos_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla detalles_pedidos.
 */
class DetallesPedidosData extends DetallesPedidosHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;
    // Atributo para almacenar el nombre del archivo de imagen.
    private $filename = null;
    /*
     *  Métodos para validar y asignar valores de los atributos.
     */
    // Validación y asignación del ID del detalle de pedido.
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del detalle de pedido es incorrecto';
            return false;
        }
    }
    
    // Validación y asignación del ID del detalle de pedido.
    public function setAño($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->año = $value;
            return true;
        } else {
            $this->data_error = 'El año es incorrecto';
            return false;
        }
    }

    // Asignación del nombre del archivo de imagen del producto.
    public function setFilename()
    {
        if ($data = $this->readFilename()) {
            $this->filename = $data['FOTO'];
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
