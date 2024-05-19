DROP DATABASE if EXISTS Hamacoteca;

CREATE DATABASE Hamacoteca;

USE Hamacoteca;

CREATE TABLE roles_administradores(
id_rol INT AUTO_INCREMENT PRIMARY KEY,
nombre_rol VARCHAR(60),
CONSTRAINT uq_nombre_rol_unico UNIQUE(nombre_rol)
);

CREATE TABLE administradores(
id_administrador INT AUTO_INCREMENT PRIMARY KEY,
nombre_administrador VARCHAR(50) NOT NULL,
apellido_administrador VARCHAR(50) NOT NULL,
clave_administrador VARCHAR(100) NOT NULL,
correo_administrador VARCHAR(50) NOT NULL,
CONSTRAINT uq_correo_administrador_unico UNIQUE(correo_administrador),
CONSTRAINT chk_correo_administrador_formato CHECK (correo_administrador REGEXP '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$'),
telefono_administrador VARCHAR(15) NOT NULL,
dui_administrador VARCHAR(10) NOT NULL,
CONSTRAINT uq_dui_administrador_unico UNIQUE(dui_administrador),
fecha_nacimiento_administrador DATE NOT NULL,
alias_administrador VARCHAR(25) NOT NULL,
CONSTRAINT uq_alias_administrador_unico UNIQUE(alias_administrador),
fecha_creacion DATETIME DEFAULT NOW(),
id_rol INT,
CONSTRAINT fk_rol_administradores FOREIGN KEY (id_rol)
REFERENCES roles_administradores(id_rol),
intentos_administrador INT DEFAULT 0,
estado_administrador BOOLEAN DEFAULT 1,
tiempo_intento DATETIME NULL,
fecha_clave DATETIME NULL DEFAULT NOW(),
fecha_bloqueo DATETIME NULL,
foto_administrador VARCHAR(50) NULL,
CONSTRAINT chk_url_foto_administrador CHECK (foto_administrador LIKE '%.jpg' OR foto_administrador LIKE '%.png' OR foto_administrador LIKE '%.jpeg' OR foto_administrador LIKE '%.gif')
);

CREATE TABLE clientes(
id_cliente INT AUTO_INCREMENT PRIMARY KEY,
nombre_cliente VARCHAR(50) NOT NULL,
apellido_cliente VARCHAR(50) NOT NULL,
clave_cliente VARCHAR(50) NOT NULL,
correo_cliente VARCHAR(50) NOT NULL,
CONSTRAINT uq_correo_cliente_unico UNIQUE(correo_cliente),
CONSTRAINT chk_correo_cliente_formato CHECK (correo_cliente REGEXP '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$'),
dui_cliente VARCHAR(10) NOT NULL,
CONSTRAINT uq_dui_cliente_unico UNIQUE(dui_cliente),
genero_cliente ENUM('Masculino', 'Femenino', 'No definido') NOT NULL,
fecha_nacimiento_cliente DATE NOT NULL,
telefono_cliente VARCHAR(15) NOT NULL,
estado_cliente BOOLEAN DEFAULT 1 NULL,
fecha_registro DATETIME DEFAULT NOW(),
direccion_cliente VARCHAR(100) NOT NULL,
foto_cliente VARCHAR(50) NULL,
CONSTRAINT chk_url_foto_cliente CHECK (foto_cliente LIKE '%.jpg' OR foto_cliente LIKE '%.png' OR foto_cliente LIKE '%.jpeg' OR foto_cliente LIKE '%.gif')
);

CREATE TABLE categorias(
id_categoria INT AUTO_INCREMENT PRIMARY KEY,
nombre_categoria VARCHAR(50) NOT NULL,
CONSTRAINT uq_nombre_categoria_unico UNIQUE(nombre_categoria),
descripcion_categoria TEXT NOT NULL
);

CREATE TABLE materiales(
id_material INT AUTO_INCREMENT PRIMARY KEY,
nombre_material VARCHAR(60) NOT NULL,
CONSTRAINT uq_nombre_material_unico UNIQUE(nombre_material),
descripcion_material TEXT NOT NULL,
foto_material VARCHAR(60) NULL,
CONSTRAINT chk_url_foto_material CHECK (foto_material LIKE '%.jpg' OR foto_material LIKE '%.png' OR foto_material LIKE '%.jpeg' OR foto_material LIKE '%.gif')
);

CREATE TABLE hamacas(
id_hamaca INT AUTO_INCREMENT PRIMARY KEY,
nombre_hamaca VARCHAR(60) NOT NULL,
descripcion_hamaca TEXT NOT NULL,
precio DECIMAL(5,2) NOT NULL,
CONSTRAINT chk_precio_mayor_a_cero CHECK (precio >= 0),
estado_venta BOOLEAN NULL DEFAULT 1,
cantidad_hamaca INT NOT NULL,
CONSTRAINT chk_cantidad_hamaca_mayor_a_cero CHECK (cantidad_hamaca >= 0),
foto_principal VARCHAR(50),
CONSTRAINT chk_url_foto_principal CHECK (foto_principal LIKE '%.jpg' OR foto_principal LIKE '%.png' OR foto_principal LIKE '%.jpeg' OR foto_principal LIKE '%.gif'),
id_administrador INT,
CONSTRAINT fk_administrador_de_hamaca FOREIGN KEY (id_administrador)
REFERENCES administradores(id_administrador),
id_categoria INT,
CONSTRAINT fk_categoria_de_la_hamaca FOREIGN KEY (id_categoria)
REFERENCES categorias(id_categoria),
id_material INT,
CONSTRAINT fk_material_de_la_hamaca FOREIGN KEY (id_material)
REFERENCES materiales(id_material)
);

CREATE TABLE fotos(
id_foto INT AUTO_INCREMENT PRIMARY KEY,
url VARCHAR(60) NOT NULL,
CONSTRAINT chk_url_foto CHECK (url LIKE '%.jpg' OR url LIKE '%.png' OR url LIKE '%.jpeg' OR url LIKE '%.gif'),
id_hamaca INT,
CONSTRAINT fk_fotos_de_las_hamacas FOREIGN KEY (id_hamaca)
REFERENCES hamacas(id_hamaca)
);

CREATE TABLE pedidos(
id_pedido INT AUTO_INCREMENT PRIMARY KEY,
estado_pedido ENUM('Entregado', 'En camino', 'Cancelado') NOT NULL,
fecha_pedido DATE DEFAULT NOW(),
direccion_pedido VARCHAR(50) NOT NULL,
id_cliente INT,
CONSTRAINT fk_carrito_del_cliente FOREIGN KEY (id_cliente)
REFERENCES clientes(id_cliente)
);

CREATE TABLE detalles_pedidos(
id_detalles_pedidos INT AUTO_INCREMENT PRIMARY KEY,
id_pedido INT,
CONSTRAINT fk_detalles_pedido FOREIGN KEY (id_pedido)
REFERENCES pedidos(id_pedido),
precio_producto DECIMAL(5,2) NOT NULL,
CONSTRAINT chk_precio_producto_mayor_a_cero CHECK(precio_producto > 0),
cantidad_comprada INT NOT NULL,
CONSTRAINT chk_cantidad_comprada_mayor_a_cero CHECK(cantidad_comprada > 0),
id_hamaca INT,
CONSTRAINT fk_hamacas_en_el_carrito FOREIGN KEY (id_hamaca)
REFERENCES hamacas(id_hamaca)
);

CREATE TABLE valoraciones(
id_valoracion INT AUTO_INCREMENT PRIMARY KEY,
calificacion_producto INT NOT NULL,
CONSTRAINT chk_calificacion_producto_mayor_a_cero CHECK(calificacion_producto > 0),
comentario_producto TEXT NULL,
fecha_valoracion DATETIME DEFAULT NOW(),
estado_comentario BOOLEAN NOT NULL DEFAULT 1,
id_detalles_pedidos INT,
CONSTRAINT fk_valoraciones_de_las_hamacas FOREIGN KEY (id_detalles_pedidos)
REFERENCES detalles_pedidos(id_detalles_pedidos)
);