<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../auxiliares/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla administrador.
 */
class HamacasHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $nombre = null;
    protected $descripcion = null;
    protected $precio = null;
    protected $estado = null;
    protected $cantidad = null;
    protected $imagen = null;
    protected $administrador = null;
    protected $categoria = null;
    protected $material = null;
    protected $categorias = null;
    protected $materiales = null;
    protected $minimo = null;
    protected $maximo = null;

    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../imagenes/hamacas/';

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT * FROM vista_tabla_hamacas
                WHERE NOMBRE LIKE ?
                ORDER BY NOMBRE;';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    //Función para crear una hamaca
    public function createRow()
    {
        $sql = 'CALL insertar_hamaca(?,?,?,?,?,?,?,?);';
        $params = array($this->nombre, $this->descripcion, $this->precio, $this->cantidad, $this->imagen, $_SESSION['idAdministrador'], $this->categoria, $this->material);
        return Database::executeRow($sql, $params);
    }

    //Función para mostrar todas las hamacas
    public function readAll()
    {
        $sql = 'SELECT * FROM vista_tabla_hamacas
                ORDER BY NOMBRE;';
        return Database::getRows($sql);
    }

    //Función para mostrar una de las hamacas
    public function readOne()
    {
        $sql = 'SELECT * FROM vista_tabla_hamacas
        WHERE ID = ?;';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    //Función para mostrar la imagen correspondiente de cada una de las hamacas
    public function readFilename()
    {
        $sql = 'SELECT IMAGEN
                FROM vista_tabla_hamacas
                WHERE ID = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    //Función para actualizar una de las hamacas
    public function updateRow()
    {
        $sql = 'CALL actualizar_hamaca(?,?,?,?,?,?,?,?);';
        $params = array($this->id, $this->nombre, $this->descripcion, $this->precio, $this->cantidad, $this->imagen, $this->categoria, $this->material);
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar una de las hamacas
    public function deleteRow()
    {
        $sql = 'CALL eliminar_hamaca(?);';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    //Función para cambiar el estado de una hamaca.
    public function changeState()
    {
        $sql = 'CALL cambiar_estado_producto(?);';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }


    //Función para contar las hamacas registrados
    public function totalProducts()
    {
        $sql = 'SELECT COUNT(*) AS TOTAL
        FROM hamacas;
        ';
        return Database::getRows($sql);
    }

    //Función para contar las hamacas por categoría
    public function productsForCategory()
    {
        $sql = 'SELECT nombre_categoria, ROUND((COUNT(id_hamaca) * 100.0 / (SELECT COUNT(id_hamaca) FROM hamacas)), 2) porcentaje
                FROM hamacas
                INNER JOIN categorias USING(id_categoria)
                GROUP BY nombre_categoria ORDER BY porcentaje DESC';
        return Database::getRows($sql);
    }

    //Función para mostrar los productos mas vendidos
    public function readMostSell(){
        $sql = 'SELECT h.id_hamaca AS ID, h.nombre_hamaca AS NOMBRE, h.descripcion_hamaca AS DESCRIPCION, h.precio AS PRECIO,
        h.cantidad_hamaca AS CANTIDAD, h.foto_principal AS IMAGEN,
        SUM(dp.cantidad_comprada) AS TOTAL
    FROM hamacas h
    JOIN detalles_pedidos dp ON h.id_hamaca = dp.id_hamaca
    JOIN pedidos p ON dp.id_pedido = p.id_pedido
    WHERE p.estado_pedido = "Entregado"
    GROUP BY
        h.id_hamaca,
        h.nombre_hamaca,
        h.descripcion_hamaca,
        h.precio,
        h.cantidad_hamaca,
        h.foto_principal
    ORDER BY TOTAL DESC 
    LIMIT 5;';
        return Database::getRows($sql); 
    }
    
    public function readProductosCategoria()
    {
        $sql = 'SELECT id_hamaca AS ID, foto_principal AS IMAGEN, nombre_hamaca AS NOMBRE, 
                descripcion_hamaca AS DESCRIPCION, precio AS PRECIO, cantidad_hamaca AS CANTIDAD
                FROM hamacas
                INNER JOIN categorias USING(id_categoria)
                WHERE id_categoria = ? AND estado_venta = 1
                ORDER BY NOMBRE';
        $params = array($this->categoria);
        return Database::getRows($sql, $params);
    }
    
    public function readRecommended()
    {
        $sql = 'SELECT id_hamaca AS ID, foto_principal AS IMAGEN, nombre_hamaca AS NOMBRE, 
        descripcion_hamaca AS DESCRIPCION, precio AS PRECIO, cantidad_hamaca AS CANTIDAD
        FROM hamacas INNER JOIN categorias USING(id_categoria) WHERE 
        (id_categoria = (SELECT id_categoria FROM hamacas WHERE id_hamaca = ?) 
        OR id_material = (SELECT id_material FROM hamacas WHERE id_hamaca = ?)) 
        AND id_hamaca <> ? ORDER BY PRECIO ASC LIMIT 5;';
        $params = array($this->id, $this->id, $this->id);
        return Database::getRows($sql, $params);
    }

    //Función para mostrar una de las hamacas
    public function readDetail()
    {
        $sql = 'SELECT h.id_hamaca AS ID, h.nombre_hamaca AS NOMBRE, h.descripcion_hamaca AS DESCRIPCIÓN, h.precio AS PRECIO,
        h.cantidad_hamaca AS CANTIDAD, IFNULL(ROUND(AVG(v.calificacion_producto),2), 0) AS PROMEDIO, h.foto_principal AS IMAGEN,
        c.nombre_categoria AS CATEGORIA, nombre_material AS MATERIAL FROM hamacas h
        INNER JOIN categorias c USING(id_categoria)
        INNER JOIN materiales m USING(id_material)
        LEFT JOIN detalles_pedidos dp ON h.id_hamaca = dp.id_hamaca
        LEFT JOIN valoraciones v ON dp.id_detalles_pedidos = v.id_detalles_pedidos
        WHERE h.id_hamaca = ? GROUP BY h.id_hamaca;';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    //Función para filtrar las hamacas
    public function filterRows()
    {
        $sql = 'CALL filtrar_hamacas(?, ?, ?, ?);';
        $params = array($this->categorias, $this->materiales, $this->minimo, $this->maximo);
        return Database::getRows($sql, $params);
    }
}
