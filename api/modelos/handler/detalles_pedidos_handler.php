<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../auxiliares/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla detalles de pedidos.
 */
class DetallesPedidosHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $año = null;

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    //Leer el detalle de pedido
    public function readOne()
    {
        $sql = 'SELECT h.foto_principal AS FOTO, h.nombre_hamaca AS PRODUCTO, 
        dp.cantidad_comprada AS CANTIDAD, dp.precio_producto AS PRECIO
        FROM detalles_pedidos dp INNER JOIN hamacas h ON dp.id_hamaca = h.id_hamaca 
        WHERE id_pedido = ?
        ORDER BY PRODUCTO;';
        $params = array($this->id);
        return Database::getRows($sql, $params);
    }

    //Función para cargar los años disponibles para la gráfica del dashboard
    public function readYears()
    {
        $sql = 'SELECT YEAR(fecha_pedido) AS AÑOS ,YEAR(fecha_pedido) AS AÑO
        FROM detalles_pedidos INNER JOIN pedidos USING(id_pedido) 
        WHERE estado_pedido = "Entregado" GROUP BY AÑO
        ORDER BY AÑO ASC;';
        return Database::getRows($sql);
    }

    //Función para cargar gráfica de ganancias por fecha
    public function profitsForDate()
    {
        $sql = 'SELECT CASE 
        WHEN MONTH(fecha_pedido) = 1 THEN "Enero"
        WHEN MONTH(fecha_pedido) = 2 THEN "Febrero"
        WHEN MONTH(fecha_pedido) = 3 THEN "Marzo"
        WHEN MONTH(fecha_pedido) = 4 THEN "Abril"
        WHEN MONTH(fecha_pedido) = 5 THEN "Mayo"
        WHEN MONTH(fecha_pedido) = 6 THEN "Junio"
        WHEN MONTH(fecha_pedido) = 7 THEN "Julio"
        WHEN MONTH(fecha_pedido) = 8 THEN "Agosto"
        WHEN MONTH(fecha_pedido) = 9 THEN "Septiembre"
        WHEN MONTH(fecha_pedido) = 10 THEN "Octubre"
        WHEN MONTH(fecha_pedido) = 11 THEN "Noviembre"
        WHEN MONTH(fecha_pedido) = 12 THEN "Diciembre"
        END AS MES,
        YEAR(fecha_pedido) AS AÑO,
        SUM(precio_producto) AS GANANCIAS
        FROM detalles_pedidos
        INNER JOIN pedidos USING(id_pedido)
        WHERE estado_pedido = "Entregado"
        GROUP BY AÑO, MES
        ORDER BY AÑO ASC, MONTH(fecha_pedido) ASC;
        ';
        return Database::getRows($sql);
    }

    //Función para cargar gráfica de pentas por categoría y precio promedio
    public function salesByCategoryAndAveragePrice()
    {
        $sql = 'SELECT categorias.nombre_categoria, SUM(detalles_pedidos.cantidad_comprada) AS cantidad_vendida, COUNT(hamacas.id_hamaca) AS cantidad_hamacas, ROUND(AVG(hamacas.precio), 2) AS precio_promedio
        FROM detalles_pedidos
        JOIN hamacas ON detalles_pedidos.id_hamaca = hamacas.id_hamaca
        JOIN categorias ON hamacas.id_categoria = categorias.id_categoria
        GROUP BY categorias.nombre_categoria;
        ';
        return Database::getRows($sql);
    }

    //Función para cargar gráfica de ganancias por fecha
    public function profitsForYear()
    {
        $sql = 'SELECT CASE 
        WHEN MONTH(fecha_pedido) = 1 THEN "Enero"
        WHEN MONTH(fecha_pedido) = 2 THEN "Febrero"
        WHEN MONTH(fecha_pedido) = 3 THEN "Marzo"
        WHEN MONTH(fecha_pedido) = 4 THEN "Abril"
        WHEN MONTH(fecha_pedido) = 5 THEN "Mayo"
        WHEN MONTH(fecha_pedido) = 6 THEN "Junio"
        WHEN MONTH(fecha_pedido) = 7 THEN "Julio"
        WHEN MONTH(fecha_pedido) = 8 THEN "Agosto"
        WHEN MONTH(fecha_pedido) = 9 THEN "Septiembre"
        WHEN MONTH(fecha_pedido) = 10 THEN "Octubre"
        WHEN MONTH(fecha_pedido) = 11 THEN "Noviembre"
        WHEN MONTH(fecha_pedido) = 12 THEN "Diciembre"
        END AS MES,
        YEAR(fecha_pedido) AS AÑO,
        SUM(precio_producto) AS GANANCIAS
        FROM detalles_pedidos
        INNER JOIN pedidos USING(id_pedido)
        WHERE estado_pedido = "Entregado" AND YEAR(fecha_pedido) = ?
        GROUP BY AÑO, MES
        ORDER BY AÑO ASC, MONTH(fecha_pedido) ASC;
        ';
        $params = array($this->año);
        return Database::getRows($sql, $params);
    }

    //Función para leer la imagen del id desde la base.
    public function readFilename()
    {
        $sql = 'SELECT h.foto_principal AS FOTO
        FROM detalles_pedidos dp INNER JOIN hamacas h ON dp.id_hamaca = h.id_hamaca 
        WHERE id_pedido = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    // Función para predecir las ganancias del siguiente año  
    /*  
    Para calcular la línea de regresión 𝑦 = 𝑚𝑥 + 𝑏, necesitamos calcular los coeficientes 𝑚 (pendiente) y 𝑏 (intersección).
    La fórmula para la pendiente 𝑚 y la intersección 𝑏 son:
    𝑚 = (𝑁 * ∑(𝑥𝑦) − ∑(𝑥) * ∑(𝑦)) / (𝑁 * ∑(𝑥^2) − (∑(𝑥))^2)
    𝑏 = (∑(𝑦) − 𝑚 * ∑(𝑥)) / 𝑁

    Donde:
    𝑥 es el tiempo (que se representa como los meses consecutivos)
    𝑦 son las ganancias
    𝑁 es el número de datos  
    */
    public function profitsForDatePrediction()
    {
        // Consulta para traer los datos de la base de datos.
        $sql = 'SELECT 
        CASE 
        WHEN MONTH(fecha_pedido) = 1 THEN "Enero"
        WHEN MONTH(fecha_pedido) = 2 THEN "Febrero"
        WHEN MONTH(fecha_pedido) = 3 THEN "Marzo"
        WHEN MONTH(fecha_pedido) = 4 THEN "Abril"
        WHEN MONTH(fecha_pedido) = 5 THEN "Mayo"
        WHEN MONTH(fecha_pedido) = 6 THEN "Junio"
        WHEN MONTH(fecha_pedido) = 7 THEN "Julio"
        WHEN MONTH(fecha_pedido) = 8 THEN "Agosto"
        WHEN MONTH(fecha_pedido) = 9 THEN "Septiembre"
        WHEN MONTH(fecha_pedido) = 10 THEN "Octubre"
        WHEN MONTH(fecha_pedido) = 11 THEN "Noviembre"
        WHEN MONTH(fecha_pedido) = 12 THEN "Diciembre"
        END AS MES,
        YEAR(fecha_pedido) AS AÑO,
        SUM(precio_producto) AS GANANCIAS
        FROM detalles_pedidos
        INNER JOIN pedidos USING(id_pedido)
        WHERE estado_pedido = "Entregado"
        GROUP BY AÑO, MES
        ORDER BY AÑO ASC, MONTH(fecha_pedido) ASC;';

        // Ejecutar la consulta y almacenar los resultados
        $rows = Database::getRows($sql);

        // Preparar datos para la predicción
        $x = []; // Array para almacenar los meses consecutivos
        $y = []; // Array para almacenar las ganancias correspondientes
        $i = 1;  // Variable para numerar los meses consecutivos

        // Recorrer las filas de los resultados y asignar los datos a los arrays $x y $y
        foreach ($rows as $row) {
            $x[] = $i++;
            $y[] = $row['GANANCIAS'];
        }

        // Aplicar promedio móvil para suavizar los datos
        $window_size = 3;
        $smoothed_y = $this->movingAverage($y, $window_size);

        // Calcular los parámetros de la regresión lineal
        $N = count($x); // Número de datos
        $sumX = array_sum($x); // Suma de todos los valores de $x
        $sumY = array_sum($smoothed_y); // Suma de todos los valores suavizados de $y
        $sumXY = $this->sumProduct($x, $smoothed_y); // Suma del producto de $x y los valores suavizados de $y
        $sumX2 = $this->sumSquare($x); // Suma de los cuadrados de los valores de $x

        // Calcular la pendiente (m) de la línea de regresión
        $m = ($N * $sumXY - $sumX * $sumY) / ($N * $sumX2 - $sumX * $sumX);

        // Calcular la intersección (b) de la línea de regresión
        $b = ($sumY - $m * $sumX) / $N;

        // Imprimir valores para depuración
        /* echo "Pendiente (m): $m\n";
        echo "Intersección (b): $b\n";
        echo "SumX: $sumX\n";
        echo "SumY: $sumY\n";
        echo "SumXY: $sumXY\n";
        echo "SumX2: $sumX2\n"; */

        // Predecir ganancias futuras (por ejemplo, para los próximos 12 meses)
        $predictions = []; // Array para almacenar las predicciones
        $currentYear = intval(date('Y')); // Año actual
        $currentMonth = intval(date('n')); // Mes actual

        // Generar predicciones para los próximos 12 meses
        for ($j = 0; $j < 12; $j++) {
            $predictedMonth = ($currentMonth + $j) % 12 + 1; // Calcular el mes predicho
            $predictedYear = $currentYear + intval(($currentMonth + $j) / 12); // Calcular el año predicho

            // Agregar la predicción al array de predicciones
            $predictions[] = [
                'MES' => $this->numberToMonth($predictedMonth), // Convertir el número de mes a nombre de mes
                'AÑO' => $predictedYear, // Año predicho
                'GANANCIAS' => $m * ($i + $j) + $b // Calcular las ganancias predichas
            ];
        }

        // Retornar el array de predicciones
        return array_merge($predictions);
    }

    // Función para calcular el promedio móvil
    private function movingAverage($data, $window_size)
    {
        $result = []; // Array para almacenar los datos suavizados
        $data_count = count($data); // Número de datos en el array original

        // Calcular el promedio móvil
        for ($i = 0; $i < $data_count; $i++) {
            // Extraer una ventana de datos del array original
            $window = array_slice($data, max(0, $i - $window_size + 1), $window_size);
            // Calcular el promedio de la ventana y agregarlo al array de resultados
            $result[] = array_sum($window) / count($window);
        }

        // Retornar el array de datos suavizados
        return $result;
    }

    // Función para calcular la suma del producto de dos arrays
    private function sumProduct($x, $y)
    {
        $sum = 0; // Variable para almacenar la suma

        // Recorrer los arrays y calcular la suma del producto de sus elementos
        for ($i = 0; $i < count($x); $i++) {
            $sum += $x[$i] * $y[$i];
        }

        // Retornar la suma del producto
        return $sum;
    }

    // Función para calcular la suma de los cuadrados de los elementos de un array
    private function sumSquare($x)
    {
        $sum = 0; // Variable para almacenar la suma

        // Recorrer el array y calcular la suma de los cuadrados de sus elementos
        for ($i = 0; $i < count($x); $i++) {
            $sum += $x[$i] * $x[$i];
        }

        // Retornar la suma de los cuadrados
        return $sum;
    }

    // Función para convertir el nombre de un mes a su número correspondiente
    private function monthToNumber($month)
    {
        // Array de mapeo de nombres de meses a números
        $months = [
            'Enero' => 1,
            'Febrero' => 2,
            'Marzo' => 3,
            'Abril' => 4,
            'Mayo' => 5,
            'Junio' => 6,
            'Julio' => 7,
            'Agosto' => 8,
            'Septiembre' => 9,
            'Octubre' => 10,
            'Noviembre' => 11,
            'Diciembre' => 12
        ];

        // Retornar el número correspondiente al nombre del mes
        return $months[$month];
    }

    // Función para convertir el número de un mes a su nombre correspondiente
    private function numberToMonth($number)
    {
        // Array de mapeo de números de meses a nombres
        $months = [
            1 => 'Enero',
            2 => 'Febrero',
            3 => 'Marzo',
            4 => 'Abril',
            5 => 'Mayo',
            6 => 'Junio',
            7 => 'Julio',
            8 => 'Agosto',
            9 => 'Septiembre',
            10 => 'Octubre',
            11 => 'Noviembre',
            12 => 'Diciembre'
        ];

        // Retornar el nombre correspondiente al número del mes
        return $months[$number];
    }
}
