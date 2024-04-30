<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../auxiliares/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla materiales.
 */
class MaterialesHandler
{
    /*
    * Declaración de atributos para el manejo de datos.
    */
    protected $id = null;
    protected $nombre = null;
    protected $descripcion = null;
    protected $imagen = null;

    //constante para establecer la ruta de la imágenes.
    const RUTA_IMAGEN = '../../imagenes/administradores/';

    /*
    * Métodos para gestionar los materiales.
    */

    //Función para buscar un material o varios.
    public function searchRows()
    {
        
    }
}