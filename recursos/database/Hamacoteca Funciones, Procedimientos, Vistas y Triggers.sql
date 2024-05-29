
USE Hamacoteca;

#Trigger para actualizar la cantidad de productos - Hecho por: Xochilt Gabriela López Pineda
DROP TRIGGER IF EXISTS actualizar_cantidad_hamacas;

DELIMITER $$

CREATE TRIGGER actualizar_cantidad_hamacas
AFTER INSERT ON detalles_pedidos
FOR EACH ROW
BEGIN
    UPDATE hamacas
    SET cantidad_hamaca = cantidad_hamaca - NEW.cantidad_comprada
    WHERE id_hamaca = NEW.id_hamaca;
END;

$$

#Función que genere un alias para el administrador - Hecho por: Juan Pablo Flores Díaz
DROP FUNCTION IF EXISTS generar_alias_administrador;
DELIMITER //
CREATE FUNCTION generar_alias_administrador(nombre VARCHAR(50), apellido VARCHAR(50), fecha_creacion DATETIME) RETURNS VARCHAR(25)
BEGIN
    DECLARE alias_base VARCHAR(10);
    DECLARE contador INT;
    DECLARE alias_final VARCHAR(25);

    SET alias_base = CONCAT(LEFT(nombre, 1), LEFT(apellido, 1), YEAR(fecha_creacion));

    -- Encuentra el siguiente número disponible para el alias
    SET contador = 1;
    WHILE EXISTS (SELECT 1 FROM administradores WHERE alias_administrador = CONCAT(alias_base, contador)) DO
        SET contador = contador + 1;
    END WHILE;

    -- Concatena el número al alias base para obtener el alias final
    SET alias_final = CONCAT(alias_base, contador);
    RETURN alias_final;
END //

DELIMITER ;

DROP FUNCTION IF EXISTS calcular_total_producto;
#Función para calcular el precio total de los pedidos - Hecho por: Juan Pablo Flores Díaz
DELIMITER $$
CREATE FUNCTION calcular_total_producto(p_id_producto INT, p_cantidad INT)
RETURNS DECIMAL(5, 2)
BEGIN
    DECLARE precio_producto DECIMAL(5, 2);
    DECLARE total DECIMAL(10, 2);
    
    SELECT precio INTO precio_producto
    FROM hamacas
    WHERE id_hamaca = p_id_producto;
    
    SET total = precio_producto * p_cantidad;
    
    RETURN total;
END

$$

DROP PROCEDURE IF EXISTS insertar_rol_administrador;
#Procedimientos almacenados de la tabla roles de administrador - Hecho por: Juan Pablo Flores Díaz
DELIMITER $$
CREATE PROCEDURE insertar_rol_administrador(
   IN p_nombre_rol VARCHAR(60)
)
BEGIN
   INSERT INTO roles_administradores (nombre_rol)
   VALUES(p_nombre_rol);
END;
$$

DROP PROCEDURE IF EXISTS actualizar_rol_administrador;
DELIMITER $$
CREATE PROCEDURE actualizar_rol_administrador(
   IN p_id_rol INT,
   IN p_nombre_rol VARCHAR(60)
)
BEGIN
   UPDATE roles_administradores SET nombre_rol = p_nombre_rol
   WHERE id_rol = p_id_rol;
END;
$$


DROP PROCEDURE IF EXISTS eliminar_rol_administrador;
DELIMITER $$
CREATE PROCEDURE eliminar_rol_administrador(
    IN p_id_rol INT
)
BEGIN
    DELETE FROM roles_administradores
    WHERE id_rol = p_id_rol;
END;
$$

DROP VIEW IF EXISTS vista_roles_administradores;
DELIMITER $$
CREATE VIEW vista_roles_administradores AS
SELECT id_rol AS ID ,nombre_rol AS NOMBRE
FROM roles_administradores;
$$

#Procedimientos almacenados de la tabla administradores - hecho por: Juan Pablo Flores Díaz
-- En el caso de encriptamiento desde la base se puede usar SHA(parametro de la clave, 256), AES_ENCRYPT(parametro de la clave) Y BCRYPT desde el programa

DROP PROCEDURE IF EXISTS insertar_administrador;
DELIMITER $$
CREATE PROCEDURE insertar_administrador(
   IN p_nombre_administrador VARCHAR(50),
   IN p_apellido_administrador VARCHAR(50),
   IN p_clave_administrador VARCHAR(100),
   IN p_correo_administrador VARCHAR(50),
   IN p_telefono_administrador VARCHAR(15),
   IN p_dui_administrador VARCHAR(10),
   IN p_fecha_nacimiento_administrador DATE,
   IN p_id_rol INT,
   IN p_foto_administrador VARCHAR(50)
)
BEGIN
DECLARE p_alias_administrador VARCHAR(25);
-- Generar el alias utilizando la función
SET p_alias_administrador = generar_alias_administrador(p_nombre_administrador, p_apellido_administrador, now());
INSERT INTO administradores 
(nombre_administrador, apellido_administrador, 
clave_administrador, correo_administrador, 
telefono_administrador, dui_administrador, 
fecha_nacimiento_administrador, alias_administrador, 
id_rol, foto_administrador)
VALUES(
p_nombre_administrador, p_apellido_administrador, 
p_clave_administrador, p_correo_administrador, 
p_telefono_administrador, p_dui_administrador, 
p_fecha_nacimiento_administrador, p_alias_administrador, 
p_id_rol, p_foto_administrador);
END;
$$

CALL insertar_administrador('Juan Carlos', 'Castro Mirandez', 'Clave@2024', 'juan@gmail.com', '4568-5878', '64574357-0', '1990-01-01', 3, 'default.jpg');

DROP PROCEDURE IF EXISTS insertar_administrador_validado;
DELIMITER $$
CREATE PROCEDURE insertar_administrador_validado(
   IN p_nombre_administrador VARCHAR(50),
   IN p_apellido_administrador VARCHAR(50),
   IN p_clave_administrador VARCHAR(100),
   IN p_correo_administrador VARCHAR(50),
   IN p_telefono_administrador VARCHAR(15),
   IN p_dui_administrador VARCHAR(10),
   IN p_fecha_nacimiento_administrador DATE,
   IN p_id_rol INT,
   IN p_foto_administrador VARCHAR(50)
)
BEGIN

    DECLARE p_alias_administrador VARCHAR(25);
    
    IF p_correo_administrador REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        IF LENGTH(p_clave_administrador) >= 8
           AND p_clave_administrador REGEXP '[A-Z]'
           AND p_clave_administrador REGEXP '[a-z]'
           AND p_clave_administrador REGEXP '[0-9]'
           AND p_clave_administrador REGEXP '[^a-zA-Z0-9]' THEN
           
            -- Generar el alias utilizando la función
            SET p_alias_administrador = generar_alias_administrador(p_nombre_administrador, p_apellido_administrador, NOW());
            
            INSERT INTO administradores (nombre_administrador, apellido_administrador, clave_administrador, correo_administrador, telefono_administrador, dui_administrador, fecha_nacimiento_administrador, alias_administrador, id_rol, foto_administrador)
            VALUES(p_nombre_administrador, p_apellido_administrador, p_clave_administrador, p_correo_administrador, p_telefono_administrador, p_dui_administrador, p_fecha_nacimiento_administrador, p_alias_administrador, p_id_rol, p_foto_administrador);
        ELSE
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La contraseña no cumple con los requisitos mínimos';
        END IF;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Formato de correo electrónico no válido';
    END IF;
END;
$$

DROP PROCEDURE IF EXISTS actualizar_administrador;
DELIMITER $$
CREATE PROCEDURE actualizar_administrador(
   IN p_id_administrador INT,
   IN p_nombre_administrador VARCHAR(50),
   IN p_apellido_administrador VARCHAR(50),
   IN p_correo_administrador VARCHAR(50),
   IN p_telefono_administrador VARCHAR(15),
   IN p_dui_administrador VARCHAR(10),
   IN p_fecha_nacimiento_administrador DATE,
   IN p_id_rol INT,
   IN p_foto_administrador VARCHAR(50)
)
BEGIN
UPDATE administradores SET nombre_administrador = p_nombre_administrador, apellido_administrador = p_apellido_administrador, correo_administrador = p_correo_administrador,
telefono_administrador = p_telefono_administrador, dui_administrador = p_dui_administrador, fecha_nacimiento_administrador = p_fecha_nacimiento_administrador,
id_rol = p_id_rol, foto_administrador = p_foto_administrador
WHERE id_administrador = p_id_administrador;
END;
$$

DROP PROCEDURE IF EXISTS actualizar_administrador_validado;
DELIMITER $$
CREATE PROCEDURE actualizar_administrador_validado(
   IN p_id_administrador INT,
   IN p_nombre_administrador VARCHAR(50),
   IN p_apellido_administrador VARCHAR(50),
   IN p_correo_administrador VARCHAR(50),
   IN p_telefono_administrador VARCHAR(15),
   IN p_dui_administrador VARCHAR(10),
   IN p_fecha_nacimiento_administrador DATE,
   IN p_id_rol INT,
   IN p_foto_administrador VARCHAR(50)
)
BEGIN
    IF p_correo_administrador REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
            UPDATE administradores SET nombre_administrador = p_nombre_administrador, apellido_administrador = p_apellido_administrador, 
            correo_administrador = p_correo_administrador,
            telefono_administrador = p_telefono_administrador, dui_administrador = p_dui_administrador, fecha_nacimiento_administrador = p_fecha_nacimiento_administrador,
            id_rol = p_id_rol, foto_administrador = p_foto_administrador
            WHERE id_administrador = p_id_administrador;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Formato de correo electrónico no válido';
    END IF;
END;
$$

DROP PROCEDURE IF EXISTS eliminar_administrador_validado;
DELIMITER $$
CREATE PROCEDURE eliminar_administrador_validado(
    IN p_id_administrador INT
)
BEGIN
    DECLARE admin_count INT;

    SELECT COUNT(*)
    INTO admin_count
    FROM hamacas
    WHERE id_administrador = p_id_administrador;

    IF admin_count > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se puede eliminar el administrador porque tiene datos asociados a su cuenta, en la tabla hamacas';
    ELSE
        DELETE FROM administradores
        WHERE id_administrador = p_id_administrador;
    END IF;
END;

$$

DROP PROCEDURE IF EXISTS autentificar_administrador;
DELIMITER $$
CREATE PROCEDURE autentificar_administrador(
  IN p_alias_correo VARCHAR(75)
)
BEGIN
  SELECT id_administrador AS ID, alias_administrador AS ALIAS, clave_administrador AS CLAVE, foto_administrador AS FOTO
  FROM administradores
  WHERE alias_administrador = p_alias_correo OR correo_administrador = p_alias_correo;
END;
$$

DROP VIEW IF EXISTS vista_tabla_administradores;
DELIMITER $$
CREATE VIEW vista_tabla_administradores AS
SELECT id_administrador AS 'ID',
foto_administrador AS 'IMAGEN', 
CONCAT(nombre_administrador, ' ', apellido_administrador) AS 'NOMBRE',
correo_administrador AS 'CORREO', 
telefono_administrador AS 'TELÉFONO',
dui_administrador AS 'DUI',
fecha_nacimiento_administrador AS 'NACIMIENTO',
    CASE 
        WHEN estado_administrador = 1 THEN 'Activo'
        WHEN estado_administrador = 0 THEN 'Bloqueado'
    END AS 'ESTADO'
FROM administradores;
$$

SELECT * FROM vista_tabla_administradores
WHERE NOMBRE LIKE '%%'
ORDER BY NOMBRE;

DROP PROCEDURE IF EXISTS cambiar_estado_administrador;
DELIMITER //
CREATE PROCEDURE cambiar_estado_administrador(IN admin_id INT)
BEGIN
    DECLARE admin_estado BOOLEAN;
    
    -- Obtener el estado actual del administrador
    SELECT estado_administrador INTO admin_estado
    FROM administradores
    WHERE id_administrador = admin_id;
    
    -- Actualizar el estado del administrador
    IF admin_estado = 1 THEN
        UPDATE administradores
        SET estado_administrador = 0
        WHERE id_administrador = admin_id;
    ELSE
        UPDATE administradores
        SET estado_administrador = 1
        WHERE id_administrador = admin_id;
    END IF;
END //

DELIMITER ;


# Procedimientos almacenados de la tabla clientes - Hecho por: Juan Pablo Flores Díaz

DROP PROCEDURE IF EXISTS insertar_cliente_validado;
DELIMITER $$
CREATE PROCEDURE insertar_cliente_validado(
   IN p_nombre_cliente VARCHAR(50),
   IN p_apellido_cliente VARCHAR(50),
   IN p_clave_cliente VARCHAR(100),
   IN p_correo_cliente VARCHAR(50),
   IN p_telefono_cliente VARCHAR(15),
   IN p_dui_cliente VARCHAR(10),
   IN p_fecha_nacimiento_cliente DATE,
   IN p_genero_cliente ENUM('Masculino', 'Femenino', 'No definido'),
   IN p_estado_cliente BOOLEAN,
   IN p_foto_cliente VARCHAR(50),
   IN p_direccion_cliente VARCHAR(100)
)
BEGIN
    IF p_correo_cliente REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        IF LENGTH(p_clave_cliente) >= 8
           AND p_clave_cliente REGEXP '[A-Z]'
           AND p_clave_cliente REGEXP '[a-z]'
           AND p_clave_cliente REGEXP '[0-9]'
           AND p_clave_cliente REGEXP '[^a-zA-Z0-9]' THEN
               INSERT INTO clientes (nombre_cliente, apellido_cliente, clave_cliente, correo_cliente, telefono_cliente, dui_cliente, fecha_nacimiento_cliente, genero_cliente, estado_cliente, foto_cliente, direccion_cliente)
               VALUES(p_nombre_cliente, p_apellido_cliente, p_clave_cliente, p_correo_cliente, p_telefono_cliente, p_dui_cliente, p_fecha_nacimiento_cliente, p_genero_cliente, p_estado_cliente, p_foto_cliente, p_direccion_cliente);
        ELSE
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La contraseña no cumple con los requisitos mínimos';
        END IF;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Formato de correo electrónico no válido';
    END IF;
END;
$$

DROP PROCEDURE IF EXISTS actualizar_cliente_validado;
DELIMITER $$
CREATE PROCEDURE actualizar_cliente_validado(
   IN p_id_cliente INT,
   IN p_nombre_cliente VARCHAR(50),
   IN p_apellido_cliente VARCHAR(50),
   IN p_clave_cliente VARCHAR(100),
   IN p_correo_cliente VARCHAR(50),
   IN p_telefono_cliente VARCHAR(15),
   IN p_dui_cliente VARCHAR(10),
   IN p_fecha_nacimiento_cliente DATE,
   IN p_genero_cliente ENUM('Masculino', 'Femenino', 'No definido'),
   IN p_estado_cliente BOOLEAN,
   IN p_foto_cliente VARCHAR(50),
   IN p_direccion_cliente VARCHAR(100)
)
BEGIN
    IF p_correo_cliente REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        IF LENGTH(p_clave_cliente) >= 8
           AND p_clave_cliente REGEXP '[A-Z]'
           AND p_clave_cliente REGEXP '[a-z]'
           AND p_clave_cliente REGEXP '[0-9]'
           AND p_clave_cliente REGEXP '[^a-zA-Z0-9]' THEN
              UPDATE clientes SET nombre_cliente = p_nombre_cliente, apellido_cliente = p_apellido_cliente, 
              clave_cliente = p_clave_cliente, correo_cliente = p_correo_cliente,
              telefono_cliente = p_telefono_cliente, dui_cliente = p_dui_cliente, fecha_nacimiento_cliente = p_fecha_nacimiento_cliente,
              genero_cliente = p_genero_cliente, estado_cliente = p_estado_cliente, foto_cliente = p_foto_cliente, direccion_cliente = p_direccion_cliente
              WHERE id_cliente = p_id_cliente;
        ELSE
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La contraseña no cumple con los requisitos mínimos';
        END IF;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Formato de correo electrónico no válido';
    END IF;
END;
$$

DROP PROCEDURE IF EXISTS eliminar_cliente_validado;
DELIMITER $$
CREATE PROCEDURE eliminar_cliente_validado(
    IN p_id_cliente INT
)
BEGIN
    DECLARE cliente_count INT;

    SELECT COUNT(*)
    INTO cliente_count
    FROM pedidos
    WHERE id_cliente = p_id_cliente;

    IF cliente_count > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se puede eliminar el cliente porque tiene datos asociados de pedidos a su cuenta';
    ELSE
        DELETE FROM clientes
        WHERE id_cliente = p_id_cliente;
    END IF;
END;

$$


DROP PROCEDURE IF EXISTS autentificar_cliente;
DELIMITER $$
CREATE PROCEDURE autentificar_cliente(
  IN p_correo VARCHAR(75),
  IN p_clave_cliente VARCHAR(120)
)
BEGIN
  SELECT id_cliente ,COUNT(*) as resultado_autentificacion
  FROM clientes
  WHERE correo_cliente = p_correo AND clave_cliente = p_clave_cliente;
END;
$$


DROP VIEW IF EXISTS vista_tabla_clientes;
DELIMITER $$
CREATE VIEW vista_tabla_clientes AS
SELECT foto_cliente AS 'IMAGEN', 
CONCAT(nombre_cliente, ' ', apellido_cliente) AS 'NOMBRE',
correo_cliente AS 'CORREO', 
telefono_cliente AS 'TELÉFONO',
dui_cliente AS 'DUI',
fecha_nacimiento_cliente AS 'FECHA DE NACIMIENTO'
FROM clientes;
$$

DROP PROCEDURE IF EXISTS cambiar_estado_cliente;
DELIMITER $$
CREATE PROCEDURE cambiar_estado_cliente(IN cliente_id INT)
BEGIN
    DECLARE cliente_estado BOOLEAN;
    
    -- Obtener el estado actual del cliente
    SELECT estado_cliente INTO cliente_estado
    FROM clientes
    WHERE id_cliente = cliente_id;
    
    -- Actualizar el estado del cliente
    IF cliente_estado = 1 THEN
        UPDATE clientes
        SET estado_cliente = 0
        WHERE id_cliente = cliente_id;
    ELSE
        UPDATE clientes
        SET estado_cliente = 1
        WHERE id_cliente = cliente_id;
    END IF;
END $$

# Procedimientos almacenados de la tabla categorias - Hecho por: Juan Pablo Flores Díaz

DROP PROCEDURE IF EXISTS insertar_categoria;
DELIMITER $$
CREATE PROCEDURE insertar_categoria(
   IN p_nombre_categoria VARCHAR(60),
   IN p_descripcion_categoria TEXT,
   IN p_foto_categoria  VARCHAR(60)
)
BEGIN
   INSERT INTO categorias (nombre_categoria, descripcion_categoria, foto_categoria)
   VALUES(p_nombre_categoria, p_descripcion_categoria, p_foto_categoria);
END;
$$

DROP PROCEDURE IF EXISTS actualizar_categoria;
DELIMITER $$
CREATE PROCEDURE actualizar_categoria(
   IN p_id_categoria INT,
   IN p_nombre_categoria VARCHAR(60),
   IN p_descripcion_categoria TEXT,
   IN p_foto_categoria  VARCHAR(60)
)
BEGIN
   UPDATE categorias SET nombre_categoria = p_nombre_categoria, descripcion_categoria = p_descripcion_categoria, foto_categoria = p_foto_categoria
   WHERE id_categoria = p_id_categoria;
END;
$$

DROP PROCEDURE IF EXISTS eliminar_categoria;
DELIMITER $$
CREATE PROCEDURE eliminar_categoria(
    IN p_id_categoria INT
)
BEGIN
    DELETE FROM categorias
    WHERE id_categoria = p_id_categoria;
END;
$$

# Procedimientos almacenados de la tabla materiales - Hecho por: Juan Pablo Flores Díaz

DROP PROCEDURE IF EXISTS insertar_material;
DELIMITER $$
CREATE PROCEDURE insertar_material(
   IN p_nombre_material VARCHAR(60),
   IN p_descripcion_material TEXT,
   IN p_foto_material VARCHAR(60)
)
BEGIN
   INSERT INTO materiales (nombre_material, descripcion_material, foto_material)
   VALUES(p_nombre_material, p_descripcion_material, p_foto_material);
END;
$$

DROP PROCEDURE IF EXISTS actualizar_material;
DELIMITER $$
CREATE PROCEDURE actualizar_material(
   IN p_id_material INT,
   IN p_nombre_material VARCHAR(60),
   IN p_descripcion_material TEXT,
   IN p_foto_material VARCHAR(60)
)
BEGIN
   UPDATE materiales SET nombre_material = p_nombre_material, descripcion_material = p_descripcion_material, foto_material = p_foto_material
   WHERE id_material = p_id_material;
END;
$$

DROP PROCEDURE IF EXISTS eliminar_material;
DELIMITER $$
CREATE PROCEDURE eliminar_material(
    IN p_id_material INT
)
BEGIN
    DELETE FROM materiales
    WHERE id_material = p_id_material;
END;
$$

#Procedimientos almacenados de la tabla hamacas - hecho por: Juan Pablo Flores Díaz

DROP PROCEDURE IF EXISTS insertar_hamaca;
DELIMITER $$
CREATE PROCEDURE insertar_hamaca(
   IN p_nombre_hamaca VARCHAR(60),
   IN p_descripcion_hamaca TEXT,
   IN p_precio DECIMAL(5,2),
   IN p_cantidad_hamaca INT,
   IN p_foto_principal VARCHAR(50),
   IN p_id_administrador INT,
   IN p_id_categoria INT,
   IN p_id_material INT
)
BEGIN
   INSERT INTO hamacas (nombre_hamaca, descripcion_hamaca, precio, cantidad_hamaca, foto_principal, id_administrador, id_categoria, id_material)
   VALUES(p_nombre_hamaca, p_descripcion_hamaca, p_precio, p_cantidad_hamaca, p_foto_principal, p_id_administrador, p_id_categoria, p_id_material);
END;
$$

DROP PROCEDURE IF EXISTS actualizar_hamaca;
DELIMITER $$
CREATE PROCEDURE actualizar_hamaca(
   IN p_id_hamaca INT,
   IN p_nombre_hamaca VARCHAR(60),
   IN p_descripcion_hamaca TEXT,
   IN p_precio DECIMAL(5,2),
   IN p_cantidad_hamaca INT,
   IN p_foto_principal VARCHAR(50),
   IN p_id_categoria INT,
   IN p_id_material INT
)
BEGIN
   UPDATE hamacas
   SET nombre_hamaca = p_nombre_hamaca,
       descripcion_hamaca = p_descripcion_hamaca,
       precio = p_precio,
       cantidad_hamaca = p_cantidad_hamaca,
       foto_principal = p_foto_principal,
       id_categoria = p_id_categoria,
       id_material = p_id_material
   WHERE id_hamaca = p_id_hamaca;
END;
$$

DROP PROCEDURE IF EXISTS eliminar_hamaca;
DELIMITER $$
CREATE PROCEDURE eliminar_hamaca(
    IN p_id_hamaca INT
)
BEGIN
    DELETE FROM hamacas
    WHERE id_hamaca = p_id_hamaca;
END;

$$

DROP VIEW IF EXISTS vista_tabla_hamacas;
DELIMITER $$
CREATE VIEW vista_tabla_hamacas AS
SELECT id_hamaca AS ID,
nombre_hamaca AS NOMBRE,
foto_principal AS IMAGEN, 
descripcion_hamaca AS DESCRIPCIÓN, 
cantidad_hamaca AS CANTIDAD,
precio AS PRECIO,
 CASE 
        WHEN estado_venta = 1 THEN 'Disponible'
        WHEN estado_venta = 0 THEN 'No disponible'
END AS ESTADO,
id_administrador AS ADMINISTRADOR,
id_categoria AS CATEGORIA,
id_material AS MATERIAL
FROM hamacas;
$$

DROP PROCEDURE IF EXISTS cambiar_estado_producto;
DELIMITER //
CREATE PROCEDURE cambiar_estado_producto(IN hamaca_id INT)
BEGIN
    DECLARE hamaca_estado BOOLEAN;
    
    -- Obtener el estado actual del administrador
    SELECT estado_venta INTO hamaca_estado
    FROM hamacas
    WHERE id_hamaca = hamaca_id;
    
    -- Actualizar el estado del administrador
    IF hamaca_estado = 1 THEN
        UPDATE hamacas
        SET estado_venta = 0
        WHERE id_hamaca = hamaca_id;
    ELSE
        UPDATE hamacas
        SET estado_venta = 1
        WHERE id_hamaca = hamaca_id;
    END IF;
END //

DELIMITER ;

#Procedimientos almacenados de la tabla fotos - hecho por: Juan Pablo Flores Díaz

DROP PROCEDURE IF EXISTS insertar_foto;
DELIMITER $$
CREATE PROCEDURE insertar_foto(
   IN p_url VARCHAR(60),
   IN p_id_hamaca INT
)
BEGIN
   INSERT INTO fotos (url, id_hamaca)
   VALUES(p_url, p_id_hamaca);
END;
$$

DROP PROCEDURE IF EXISTS actualizar_foto;
DELIMITER $$
CREATE PROCEDURE actualizar_foto(
   IN p_id_foto INT,
   IN p_url VARCHAR(60),
   IN p_id_hamaca INT
)
BEGIN
   UPDATE fotos
   SET url = p_url,
       id_hamaca = p_id_hamaca
   WHERE id_foto = p_id_foto;
END;
$$

DROP PROCEDURE IF EXISTS eliminar_foto;
DELIMITER $$
CREATE PROCEDURE eliminar_foto(
    IN p_id_foto INT
)
BEGIN
    DELETE FROM fotos
    WHERE id_foto = p_id_foto;
END;

$$

#Procedimientos almacenados de la tabla pedidos y detalle pedidos - hecho por: Juan Pablo Flores Díaz

DROP PROCEDURE IF EXISTS insertar_pedido_y_detalle_pedido;
DELIMITER $$
CREATE PROCEDURE insertar_pedido_y_detalle_pedido(
    IN p_estado_pedido ENUM('Entregado', 'En camino', 'Cancelado'),
    IN p_direccion_pedido VARCHAR(50),
    IN p_id_cliente INT,
    IN p_cantidad_comprada INT,
    IN p_id_hamaca INT
)
BEGIN
 DECLARE p_precio_producto DECIMAL(10,2);
 DECLARE p_id_pedido INT;
		-- Calcular el precio utilizando la función
		SET p_precio_producto = calcular_total_producto(p_id_hamaca, p_cantidad_comprada);
    -- Insertar el nuevo registro en la tabla
    INSERT INTO pedidos (estado_pedido, direccion_pedido, id_cliente)
    VALUES (p_estado_pedido, p_direccion_pedido, p_id_cliente);
    -- Obtener el ultimo ID del pedido ingresado
    SET p_id_pedido = LAST_INSERT_ID();
    -- Insertar el nuevo registro en la tabla
    INSERT INTO detalles_pedidos (id_pedido, precio_producto, cantidad_comprada, id_hamaca)
    VALUES (p_id_pedido, p_precio_producto, p_cantidad_comprada, p_id_hamaca);
END
$$

DROP PROCEDURE IF EXISTS actualizar_estado_pedido;
DELIMITER $$
CREATE PROCEDURE actualizar_estado_pedido(
    IN p_id_pedido INT,
    IN p_estado_pedido ENUM('Entregado', 'En camino', 'Cancelado')
)
BEGIN
    -- Actualizar el estado del pedido en la tabla pedidos
    UPDATE pedidos
    SET estado_pedido = p_estado_pedido
    WHERE id_pedido = p_id_pedido;
END
$$


DROP PROCEDURE IF EXISTS actualizar_datos_pedido;
DELIMITER $$
CREATE PROCEDURE actualizar_datos_pedido(
    IN p_id_pedido INT,
    IN p_estado_pedido ENUM('Entregado', 'En camino', 'Cancelado'),
    IN p_direccion_pedido VARCHAR(50),
    IN p_id_cliente INT
)
BEGIN
    -- Actualizar los datos generales del pedido en la tabla pedidos
    UPDATE pedidos
    SET estado_pedido = p_estado_pedido,
        direccion_pedido = p_direccion_pedido,
        id_cliente = p_id_cliente
    WHERE id_pedido = p_id_pedido;
END
$$

DELIMITER $$

DROP PROCEDURE IF EXISTS actualizar_cantidad_y_precio_detalles_pedido;
DELIMITER $$
CREATE PROCEDURE actualizar_cantidad_y_precio_detalles_pedido(
    IN p_id_detalles_pedido INT,
    IN p_cantidad_comprada INT,
    IN p_id_hamaca INT
)
BEGIN
    DECLARE p_precio_producto DECIMAL(10,2);

    -- Calcular el precio utilizando la función
    SET p_precio_producto = calcular_total_producto(p_id_hamaca, p_cantidad_comprada);

    -- Actualizar la cantidad y el precio en la tabla detalles_pedidos
    UPDATE detalles_pedidos
    SET cantidad_comprada = p_cantidad_comprada,
        precio_producto = p_precio_producto
    WHERE id_detalles_pedido = p_id_detalles_pedido;
END
$$

DROP PROCEDURE IF EXISTS eliminar_pedido_y_detalle_pedido;
DELIMITER $$
CREATE PROCEDURE eliminar_pedido_y_detalle_pedido(
    IN p_id_pedido INT
)
BEGIN

    -- Eliminar los detalles del pedido de la tabla detalles_pedidos
    DELETE FROM detalles_pedidos
    WHERE id_pedido = p_id_pedido;
    
    -- Eliminar el pedido de la tabla pedidos
    DELETE FROM pedidos
    WHERE id_pedido = p_id_pedido;
    
END
$$

#Procedimientos almacenados de la tabla pedidos y detalle pedidos - hecho por: Joel Omar Mena Domínguez

DROP PROCEDURE IF EXISTS insertar_valoracion;
-- Insertar datos en la tabla valoraciones
DELIMITER $$
CREATE PROCEDURE insertar_valoracion(
IN p_calificacion INT,
IN p_comentario TEXT,
IN p_id_detalles_pedidos INT)
BEGIN
	INSERT INTO valoraciones(calificacion_producto,comentario_producto,id_detalles_pedidos) 
    VALUES (p_calificacion,p_comentario,p_id_detalles_pedidos);
END
$$
 
DROP PROCEDURE IF EXISTS actualizar_valoracion;
-- actualizar datos en la tablas valoraciones
DELIMITER $$
CREATE PROCEDURE actualizar_valoracion(
IN p_calificacion INT,
IN p_comentario TEXT,
IN p_id_detalles_pedidos INT,
IN p_id_valoracion INT)
BEGIN
	UPDATE valoraciones
    SET calificacion_producto = p_calificacion, comentario_producto = p_comentario, id_detalles_pedidos = p_id_detalles_pedidos
    WHERE id_valoracion = p_id_valoracion;
END
$$
 
DROP PROCEDURE IF EXISTS eliminar_valoraciones;
-- eliminar datos en la tabla valoraciones
DELIMITER $$
CREATE PROCEDURE eliminar_valoraciones(
IN p_id_valoracion INT)
BEGIN
	DELETE FROM valoraciones 
    WHERE id_valoracion = P_id_valoracion;
END
$$


DROP VIEW IF EXISTS vista_tabla_valoraciones;
DELIMITER $$
CREATE VIEW vista_tabla_valoraciones AS
SELECT V.id_valoracion AS 'ID',
foto_cliente AS 'IMAGEN',
CONCAT(nombre_cliente, ' ', apellido_cliente	) AS 'NOMBRE',
nombre_hamaca AS 'PRODUCTO',
comentario_producto AS 'COMENTARIO', 
calificacion_producto AS 'CALIFICACIÓN',
fecha_valoracion AS 'FECHA',
    CASE 
        WHEN estado_comentario = 1 THEN 'Activo'
        WHEN estado_comentario = 0 THEN 'Bloqueado'
    END AS 'ESTADO'
FROM valoraciones v
INNER JOIN detalles_pedidos dp ON dp.id_detalles_pedidos = v.id_detalles_pedidos
INNER JOIN hamacas h ON h.id_hamaca = dp.id_hamaca
INNER JOIN pedidos p ON p.id_pedido = dp.id_pedido
INNER JOIN clientes c ON c.id_cliente = p.id_cliente;
$$
 

DROP PROCEDURE IF EXISTS cambiar_estado_valoracion;
DELIMITER //
CREATE PROCEDURE cambiar_estado_valoracion(IN valora_id INT)
BEGIN
    DECLARE valora_estado BOOLEAN;
    
    -- Obtener el estado actual de la valoracion
    SELECT estado_comentario INTO valora_estado
    FROM valoraciones
    WHERE id_valoracion = valora_id;
    
    -- Actualizar el estado de la valoracion
    IF valora_estado = 1 THEN
        UPDATE valoraciones
        SET estado_comentario = 0
        WHERE id_valoracion = valora_id;
    ELSE
        UPDATE valoraciones
        SET estado_comentario = 1
        WHERE id_valoracion = valora_id;
    END IF;
END //

DELIMITER ;
DROP PROCEDURE IF EXISTS filtrar_hamacas;
DELIMITER //

CREATE PROCEDURE filtrar_hamacas (
    IN categoriaIds VARCHAR(255),
    IN materialIds VARCHAR(255),
    IN precioMin DECIMAL(5,2),
    IN precioMax DECIMAL(5,2)
)
BEGIN
    SET @categoriaQuery := IF(categoriaIds IS NULL OR categoriaIds = '', '', CONCAT(' AND h.id_categoria IN (', categoriaIds, ')'));
    SET @materialQuery := IF(materialIds IS NULL OR materialIds = '', '', CONCAT(' AND h.id_material IN (', materialIds, ')'));
    SET @precioQuery := CONCAT(' AND h.precio BETWEEN ', IF(precioMin IS NULL, '0', precioMin), ' AND ', IF(precioMax IS NULL, '99999.99', precioMax));
    
    SET @sql := CONCAT(
        'SELECT 
            h.id_hamaca AS ID, 
            h.nombre_hamaca AS NOMBRE, 
            h.descripcion_hamaca AS DESCRIPCION, 
            h.precio AS PRECIO, 
            h.foto_principal AS IMAGEN
        FROM 
            hamacas h
        WHERE 1=1',
        @categoriaQuery,
        @materialQuery,
        @precioQuery
    );

    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END //

DELIMITER ;

SELECT ROUTINE_NAME
FROM information_schema.ROUTINES
WHERE ROUTINE_TYPE = 'PROCEDURE' AND ROUTINE_SCHEMA = 'hamacoteca';

SELECT TABLE_NAME
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'hamacoteca';