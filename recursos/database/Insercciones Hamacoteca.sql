
USE Hamacoteca;

CALL insertar_rol_administrador('Root');
CALL insertar_rol_administrador('Gestionador de pedidos');
CALL insertar_rol_administrador('Administrador de usuarios');

CALL actualizar_rol_administrador(3, 'Administrador de usuarios');

-- CALL insertar_administrador_validado('Juan Pablo', 'Flores Díaz', 'Clave1@JPFD', 'pablojuanfd@gmail.com', '4568-5678', '12345678-0', '1990-01-01', 1, 'default.jpg');
CALL insertar_administrador_validado('Xochilt Gabriela', 'López Pineda', 'Clave2@XGLP', 'sochii@gmail.com', '1254-5679', '12345689-1', '1991-01-01', 2, 'default.jpg');
CALL insertar_administrador_validado('Joel Omar', 'Mena Domínguez', 'Clave3@JOMD', 'torugam@gmail.com', '1434-5670', '12345689-2', '1992-01-01', 3, 'default.jpg');
CALL insertar_administrador_validado('María', 'González', 'Clave4@MG', 'maria@gmail.com', '5678-1234', '12345678-3', '1993-01-01', 1, 'default.jpg');
CALL insertar_administrador_validado('José', 'Martínez', 'Clave5@JM', 'jose@gmail.com', '9876-5432', '12345678-4', '1994-01-01', 2, 'default.jpg');
CALL insertar_administrador_validado('Ana', 'Rodríguez', 'Clave6@AR', 'ana@gmail.com', '4567-8901', '12345678-5', '1995-01-01', 3, 'default.jpg');
CALL insertar_administrador_validado('Luis', 'Hernández', 'Clave7@LH', 'luis@gmail.com', '3456-7890', '12345678-6', '1996-01-01', 1, 'default.jpg');
CALL insertar_administrador_validado('Laura', 'Gómez', 'Clave8@LG', 'laura@gmail.com', '6789-2345', '12345678-7', '1997-01-01', 2, 'default.jpg');
CALL insertar_administrador_validado('Daniel', 'Pérez', 'Clave9@DP', 'daniel@gmail.com', '2345-6789', '12345678-8', '1998-01-01', 3, 'default.jpg');
CALL insertar_administrador_validado('Sofía', 'Sánchez', 'Clave10@SS', 'sofia@gmail.com', '7890-3456', '12345678-9', '1999-01-01', 1, 'default.jpg');
CALL insertar_administrador_validado('Diego', 'Ramírez', 'Clave11@DR', 'diego@gmail.com', '3219-8765', '12345468-0', '2000-01-01', 2, 'default.jpg');
CALL insertar_administrador_validado('Valentina', 'Torres', 'Clave12@VT', 'valentina@gmail.com', '9876-1234', '24345678-1', '2001-01-01', 3, 'default.jpg');
CALL insertar_administrador_validado('Carlos', 'García', 'Clave13@CG', 'carlos@gmail.com', '4321-9876', '12344568-2', '2002-01-01', 1, 'default.jpg');
CALL insertar_administrador_validado('Martina', 'López', 'Clave14@ML', 'martina@gmail.com', '8765-4321', '45545678-3', '2003-01-01', 2, 'default.jpg');
CALL insertar_administrador_validado('David', 'Herrera', 'Clave15@DH', 'david@gmail.com', '1234-5678', '12355678-4', '2004-01-01', 3, 'default.jpg');
CALL insertar_administrador_validado('Ana', 'Martínez', 'Clave16@AM', 'ana2@gmail.com', '8765-4321', '13445678-5', '2005-01-01', 1, 'default.jpg');
CALL insertar_administrador_validado('Pedro', 'Pérez', 'Clave17@PP', 'pedro@gmail.com', '4321-9876', '12645678-6', '2006-01-01', 2, 'default.jpg');
CALL insertar_administrador_validado('Gabriela', 'Rodríguez', 'Clave18@GR', 'gabriela@gmail.com', '1234-5678', '12545678-7', '2007-01-01', 3, 'default.jpg');
CALL insertar_administrador_validado('Javier', 'Sánchez', 'Clave19@JS', 'javier@gmail.com', '8765-4321', '12345658-8', '2008-01-01', 1, 'default.jpg');
CALL insertar_administrador_validado('Lorena', 'Torres', 'Clave20@LT', 'lorena@gmail.com', '4321-9876', '12345671-9', '2009-01-01', 2, 'default.jpg');
CALL insertar_administrador_validado('Andrés', 'García', 'Clave21@AG', 'andres@gmail.com', '1234-5678', '12345658-0', '2010-01-01', 3, 'default.jpg');
CALL insertar_administrador_validado('Carla', 'López', 'Clave22@CL', 'carla@gmail.com', '8765-4321', '12345358-1', '2011-01-01', 1, 'default.jpg');
CALL insertar_administrador_validado('Fernando', 'Herrera', 'Clave23@FH', 'fernando@gmail.com', '4321-9876', '12005678-2', '2012-01-01', 2, 'default.jpg');
CALL insertar_administrador_validado('Sara', 'Martínez', 'Clave24@SM', 'sara@gmail.com', '1234-5678', '12345000-3', '2013-01-01', 3, 'default.jpg');
CALL insertar_administrador_validado('Manuel', 'Pérez', 'Clave25@MP', 'manuel@gmail.com', '8765-4321', '12300038-4', '2014-01-01', 1, 'default.jpg');
CALL insertar_administrador_validado('Marcos', 'Lopéz', 'Clave26@ML', 'marcos@gmail.com', '6565-4321', '12340038-4', '2004-01-01', 1, 'default.jpg');

CALL insertar_cliente_validado('Carlos', 'Alvarez', 'Clave1@Password', 'carlos@gmail.com', '1234-5678', '12345678-0', '1990-01-01', 'Masculino', true, 'default.jpg', 'Dirección 1');
CALL insertar_cliente_validado('Mario', 'Almeria', 'Clave2@Password', 'mario@gmail.com', '2345-6789', '12345689-1', '1991-01-01', 'Femenino', false, 'default.jpg', 'Dirección 2');
CALL insertar_cliente_validado('Claudio', 'Angelo', 'Clave3@Password', 'claudio@gmail.com', '3456-7890', '12345689-2', '1992-01-01', 'No definido', true, 'default.jpg', 'Dirección 3');
CALL insertar_cliente_validado('Lucía', 'Bárcenas', 'Clave4@Password', 'lucia@gmail.com', '4567-8901', '12345689-3', '1993-01-01', 'Femenino', true, 'default.jpg', 'Dirección 4');
CALL insertar_cliente_validado('Mateo', 'Cabrera', 'Clave5@Password', 'mateo@gmail.com', '5678-9012', '12345689-4', '1994-01-01', 'Masculino', false, 'default.jpg', 'Dirección 5');
CALL insertar_cliente_validado('Mariana', 'Díaz', 'Clave6@Password', 'mariana@gmail.com', '6789-0123', '12345689-5', '1995-01-01', 'Femenino', true, 'default.jpg', 'Dirección 6');
CALL insertar_cliente_validado('Fernando', 'Estrada', 'Clave7@Password', 'fernando@gmail.com', '7890-1234', '12345689-6', '1996-01-01', 'Masculino', false, 'default.jpg', 'Dirección 7');
CALL insertar_cliente_validado('Isabella', 'Fuentes', 'Clave8@Password', 'isabella@gmail.com', '8901-2345', '12345689-7', '1997-01-01', 'Femenino', true, 'default.jpg', 'Dirección 8');
CALL insertar_cliente_validado('Santiago', 'García', 'Clave9@Password', 'santiago@gmail.com', '9012-3456', '12345689-8', '1998-01-01', 'Masculino', false, 'default.jpg', 'Dirección 9');
CALL insertar_cliente_validado('Valeria', 'Hernández', 'Clave10@Password', 'valeria@gmail.com', '0123-4567', '12345689-9', '1999-01-01', 'Femenino', true, 'default.jpg', 'Dirección 10');
CALL insertar_cliente_validado('Alejandro', 'Iglesias', 'Clave11@Password', 'alejandro@gmail.com', '9876-5432', '12355678-0', '2000-01-01', 'Masculino', false, 'default.jpg', 'Dirección 11');
CALL insertar_cliente_validado('Camila', 'Juárez', 'Clave12@Password', 'camila@gmail.com', '8765-4321', '12445678-1', '2001-01-01', 'Femenino', true, 'default.jpg', 'Dirección 12');
CALL insertar_cliente_validado('Nicolás', 'López', 'Clave13@Password', 'nicolas@gmail.com', '7654-3210', '12345678-2', '2002-01-01', 'Masculino', false, 'default.jpg', 'Dirección 13');
CALL insertar_cliente_validado('Victoria', 'Mendoza', 'Clave14@Password', 'victoria@gmail.com', '6543-2109', '52345678-3', '2003-01-01', 'Femenino', true, 'default.jpg', 'Dirección 14');
CALL insertar_cliente_validado('Gabriel', 'Núñez', 'Clave15@Password', 'gabriel@gmail.com', '5432-1098', '12346678-4', '2004-01-01', 'Masculino', false, 'default.jpg', 'Dirección 15');
CALL insertar_cliente_validado('Olivia', 'Ortega', 'Clave16@Password', 'olivia@gmail.com', '4321-0987', '12345478-5', '2005-01-01', 'Femenino', true, 'default.jpg', 'Dirección 16');
CALL insertar_cliente_validado('Joaquín', 'Pérez', 'Clave17@Password', 'joaquin@gmail.com', '3210-9876', '12347678-6', '2006-01-01', 'Masculino', false, 'default.jpg', 'Dirección 17');
CALL insertar_cliente_validado('Sofía', 'Quintero', 'Clave18@Password', 'sofia@gmail.com', '2109-8765', '12343578-7', '2007-01-01', 'Femenino', true, 'default.jpg', 'Dirección 18');
CALL insertar_cliente_validado('Juan', 'Ramírez', 'Clave19@Password', 'juan@gmail.com', '0987-6543', '12345568-8', '2008-01-01', 'Masculino', false, 'default.jpg', 'Dirección 19');
CALL insertar_cliente_validado('Valentina', 'Sánchez', 'Clave20@Password', 'valentina@gmail.com', '9876-5432', '35745678-9', '2009-01-01', 'Femenino', true, 'default.jpg', 'Dirección 20');
CALL insertar_cliente_validado('Martín', 'Torres', 'Clave21@Password', 'martin@gmail.com', '8765-4321', '12346783-0', '2010-01-01', 'Masculino', false, 'default.jpg', 'Dirección 21');
CALL insertar_cliente_validado('Florencia', 'Ureña', 'Clave22@Password', 'florencia@gmail.com', '7654-3210', '13445677-1', '2011-01-01', 'Femenino', true, 'default.jpg', 'Dirección 22');
CALL insertar_cliente_validado('Javier', 'Vásquez', 'Clave23@Password', 'javier@gmail.com', '6543-2109', '12345677-2', '2012-01-01', 'Masculino', false, 'default.jpg', 'Dirección 23');
CALL insertar_cliente_validado('Luisa', 'Zamora', 'Clave24@Password', 'luisa@gmail.com', '5432-1098', '12345642-3', '2013-01-01', 'Femenino', true, 'default.jpg', 'Dirección 24');
CALL insertar_cliente_validado('Diego', 'Álvarez', 'Clave25@Password', 'diego@gmail.com', '4321-0987', '13345567-4', '2014-01-01', 'Masculino', false, 'default.jpg', 'Dirección 25');

CALL insertar_categoria('Colgante', 'Es una hamaca colgante', 'default.png');
CALL insertar_categoria('Silla', 'Es una hamaca silla', 'default.png');
CALL insertar_categoria('Estandar', 'Es una hamaca estandar', 'default.png');
CALL insertar_categoria('Moderna', 'Es una hamaca moderna', 'default.png');

CALL insertar_material('Algodón', 'Material de algodón para mayor comodidad y durabilidad', 'default.jpg');
CALL insertar_material('Seda', 'Material de seda suave y lujoso', 'default.jpg');
CALL insertar_material('Nylon', 'Material resistente y duradero', 'default.jpg');
CALL insertar_material('Poliamida', 'Material de poliamida resistente a la abrasión y al desgaste', 'default.jpg');
CALL insertar_material('Poliéster', 'Material de poliéster resistente a las arrugas y de secado rápido', 'default.jpg');
CALL insertar_material('Acrílico', 'Material acrílico suave y resistente a los rayos UV', 'default.jpg');
CALL insertar_material('Yute', 'Material de yute natural y duradero', 'default.jpg');
CALL insertar_material('Lino', 'Material de lino fresco y transpirable', 'default.jpg');
CALL insertar_material('Rayón', 'Material de rayón suave y sedoso', 'default.jpg');
CALL insertar_material('PVC', 'Material de PVC resistente al agua y fácil de limpiar', 'default.jpg');
CALL insertar_material('Cuero', 'Material de cuero resistente y elegante', 'default.jpg');
CALL insertar_material('Bambú', 'Material de bambú ecológico y resistente', 'default.jpg');
CALL insertar_material('Rafia', 'Material de rafia natural y ligero', 'default.jpg');
CALL insertar_material('Cuerda', 'Material de cuerda resistente y decorativo', 'default.jpg');
CALL insertar_material('Plástico', 'Material de plástico resistente y fácil de limpiar', 'default.jpg');
CALL insertar_material('Madera', 'Material de madera resistente y elegante', 'default.jpg');
CALL insertar_material('Metal', 'Material de metal resistente y duradero', 'default.jpg');
CALL insertar_material('Hierro', 'Material de hierro resistente y versátil', 'default.jpg');
CALL insertar_material('Aluminio', 'Material de aluminio ligero y resistente a la corrosión', 'default.jpg');
CALL insertar_material('Fibra de vidrio', 'Material de fibra de vidrio resistente y ligero', 'default.jpg');
CALL insertar_material('Cerámica', 'Material de cerámica resistente y decorativo', 'default.jpg');
CALL insertar_material('Vidrio', 'Material de vidrio elegante y transparente', 'default.jpg');
CALL insertar_material('Piedra', 'Material de piedra natural y duradero', 'default.jpg');
CALL insertar_material('Terciopelo', 'Material de terciopelo suave y lujoso', 'default.jpg');

CALL insertar_hamaca('Hamaca de lana', 'Hamaca hecha de lana tejida a mano', 99.99, 50, 'default.jpg', 1, 1, 1);
CALL insertar_hamaca('Hamaca de tela', 'Hamaca hecha de tela resistente', 79.99, 30, 'default.jpg', 3, 2, 2);
CALL insertar_hamaca('Hamaca de lona', 'Hamaca de lona con diseños coloridos', 109.99, 40, 'default.jpg', 3, 3, 3);
CALL insertar_hamaca('Hamaca de seda', 'Hamaca de seda suave y lujosa', 149.99, 25, 'default.jpg', 4, 4, 4);
CALL insertar_hamaca('Hamaca de algodón', 'Hamaca cómoda y transpirable de algodón', 89.99, 35, 'default.jpg', 5, 1, 5);
CALL insertar_hamaca('Hamaca de nylon', 'Hamaca resistente al agua y duradera de nylon', 129.99, 20, 'default.jpg', 6, 2, 6);
CALL insertar_hamaca('Hamaca de poliéster', 'Hamaca de poliéster de secado rápido', 69.99, 45, 'default.jpg', 7, 3, 7);
CALL insertar_hamaca('Hamaca de cuero', 'Hamaca de cuero genuino para uso rústico', 199.99, 15, 'default.jpg', 8, 4, 8);
CALL insertar_hamaca('Hamaca de mimbre', 'Hamaca de mimbre tejida a mano', 119.99, 25, 'default.jpg', 9, 1, 9);
CALL insertar_hamaca('Hamaca de bambú', 'Hamaca de bambú ecológica y resistente', 159.99, 30, 'default.jpg', 10, 2, 10);
CALL insertar_hamaca('Hamaca de plástico', 'Hamaca de plástico ligera y fácil de limpiar', 49.99, 50, 'default.jpg', 11, 3, 11);
CALL insertar_hamaca('Hamaca de acero', 'Hamaca de acero inoxidable para uso exterior', 179.99, 10, 'default.jpg', 12, 4, 12);
CALL insertar_hamaca('Hamaca de aluminio', 'Hamaca de aluminio resistente y ligera', 139.99, 20, 'default.jpg', 13, 1, 13);
CALL insertar_hamaca('Hamaca de hierro', 'Hamaca de hierro forjado con diseño elegante', 169.99, 15, 'default.jpg', 14, 2, 14);
CALL insertar_hamaca('Hamaca de madera', 'Hamaca de madera maciza para jardín', 189.99, 10, 'default.jpg', 15, 3, 15);
CALL insertar_hamaca('Hamaca de plástico reciclado', 'Hamaca ecológica de plástico reciclado', 99.99, 30, 'default.jpg', 16, 4, 16);
CALL insertar_hamaca('Hamaca de tela impermeable', 'Hamaca con tela impermeable para uso en la playa', 119.99, 25, 'default.jpg', 17, 1, 17);
CALL insertar_hamaca('Hamaca de tela transpirable', 'Hamaca con tela transpirable para uso en el jardín', 109.99, 20, 'default.jpg', 18, 2, 18);
CALL insertar_hamaca('Hamaca de lona resistente', 'Hamaca de lona resistente para camping', 129.99, 15, 'default.jpg', 19, 3, 19);
CALL insertar_hamaca('Hamaca de algodón orgánico', 'Hamaca de algodón orgánico para uso en interiores', 149.99, 10, 'default.jpg', 20, 4, 20);
CALL insertar_hamaca('Hamaca de seda natural', 'Hamaca de seda natural para uso terapéutico', 199.99, 10, 'default.jpg', 21, 1, 21);
CALL insertar_hamaca('Hamaca de bambú reciclado', 'Hamaca de bambú reciclado para uso sostenible', 139.99, 20, 'default.jpg', 22, 2, 22);
CALL insertar_hamaca('Hamaca de tela de cáñamo', 'Hamaca de tela de cáñamo resistente y duradera', 159.99, 15, 'default.jpg', 23, 3, 23);
CALL insertar_hamaca('Hamaca de nylon de alta resistencia', 'Hamaca de nylon de alta resistencia para exteriores', 179.99, 20, 'default.jpg', 24, 4, 24);
CALL insertar_hamaca('Hamaca de tela de lino', 'Hamaca de tela de lino fresca y transpirable', 169.99, 15, 'default.jpg', 24, 1, 24);


CALL insertar_foto('default.jpg', 1);
CALL insertar_foto('default.jpg', 1);
CALL insertar_foto('default.jpg', 1);
CALL insertar_foto('default.jpg', 1);
CALL insertar_foto('default.jpg', 1);
CALL insertar_foto('default.jpg', 1);
CALL insertar_foto('default.jpg', 2);
CALL insertar_foto('default.jpg', 2);
CALL insertar_foto('default.jpg', 2);
CALL insertar_foto('default.jpg', 2);
CALL insertar_foto('default.jpg', 2);
CALL insertar_foto('default.jpg', 2);
CALL insertar_foto('default.jpg', 3);
CALL insertar_foto('default.jpg', 3);
CALL insertar_foto('default.jpg', 3);
CALL insertar_foto('default.jpg', 3);
CALL insertar_foto('default.jpg', 3);
CALL insertar_foto('default.jpg', 3);
CALL insertar_foto('default.jpg', 4);
CALL insertar_foto('default.jpg', 4);
CALL insertar_foto('default.jpg', 4);

CALL insertar_pedido_y_detalle_pedido('En camino', 'San Salvador', 1, 1, 1);
CALL insertar_pedido_y_detalle_pedido('En camino', 'San Salvador', 2, 2, 2);
CALL insertar_pedido_y_detalle_pedido('En camino', 'San Salvador', 3, 3, 3);
CALL insertar_pedido_y_detalle_pedido('En camino', 'San Salvador', 1, 1, 1);
CALL insertar_pedido_y_detalle_pedido('En camino', 'San Salvador', 2, 2, 2);
CALL insertar_pedido_y_detalle_pedido('En camino', 'San Salvador', 3, 3, 3);
CALL insertar_pedido_y_detalle_pedido('En camino', 'San Salvador', 1, 1, 1);
CALL insertar_pedido_y_detalle_pedido('En camino', 'San Salvador', 2, 2, 2);
CALL insertar_pedido_y_detalle_pedido('En camino', 'San Salvador', 3, 3, 3);
CALL insertar_pedido_y_detalle_pedido('En camino', 'San Salvador', 1, 4, 4);
CALL insertar_pedido_y_detalle_pedido('En camino', 'San Salvador', 2, 4, 4);
CALL insertar_pedido_y_detalle_pedido('En camino', 'San Salvador', 3, 4, 4);


CALL insertar_valoracion(1, 'Horrible compra nunca vuelvo a comprar aquí', 1);
CALL insertar_valoracion(5, 'Muy buena calidad', 2);
CALL insertar_valoracion(1, '(Censurado por el bien de la trama)************', 3);
CALL insertar_valoracion(5, 'Me encanto', 4);

INSERT INTO pedidos (estado_pedido, fecha_pedido, direccion_pedido, id_cliente) VALUES ('Entregado', '2024-03-01', '123 Calle Falsa', 1);
INSERT INTO pedidos (estado_pedido, fecha_pedido, direccion_pedido, id_cliente) VALUES ('En camino', '2024-03-05', '456 Avenida Siempreviva', 2);
INSERT INTO pedidos (estado_pedido, fecha_pedido, direccion_pedido, id_cliente) VALUES ('Cancelado', '2024-03-10', '789 Calle Real', 3);
INSERT INTO pedidos (estado_pedido, fecha_pedido, direccion_pedido, id_cliente) VALUES ('Entregado', '2024-03-15', '1011 Calle Mayor', 4);
INSERT INTO pedidos (estado_pedido, fecha_pedido, direccion_pedido, id_cliente) VALUES ('En camino', '2024-03-20', '1213 Avenida del Sol', 5);
INSERT INTO pedidos (estado_pedido, fecha_pedido, direccion_pedido, id_cliente) VALUES ('Entregado', '2024-03-25', '1415 Calle Luna', 6);
INSERT INTO pedidos (estado_pedido, fecha_pedido, direccion_pedido, id_cliente) VALUES ('En camino', '2024-04-01', '1617 Avenida Estrella', 7);
INSERT INTO pedidos (estado_pedido, fecha_pedido, direccion_pedido, id_cliente) VALUES ('Entregado', '2024-04-05', '1819 Calle Cielo', 8);
INSERT INTO pedidos (estado_pedido, fecha_pedido, direccion_pedido, id_cliente) VALUES ('Cancelado', '2024-04-10', '2021 Avenida Mar', 9);
INSERT INTO pedidos (estado_pedido, fecha_pedido, direccion_pedido, id_cliente) VALUES ('Entregado', '2024-04-15', '2223 Calle Sol', 10);
INSERT INTO pedidos (estado_pedido, fecha_pedido, direccion_pedido, id_cliente) VALUES ('En camino', '2024-04-20', '2425 Avenida Luna', 11);
INSERT INTO pedidos (estado_pedido, fecha_pedido, direccion_pedido, id_cliente) VALUES ('Entregado', '2024-04-25', '2627 Calle Estrella', 12);
INSERT INTO pedidos (estado_pedido, fecha_pedido, direccion_pedido, id_cliente) VALUES ('Cancelado', '2024-05-01', '2829 Avenida Cielo', 13);
INSERT INTO pedidos (estado_pedido, fecha_pedido, direccion_pedido, id_cliente) VALUES ('Entregado', '2024-05-05', '3031 Calle Mar', 14);
INSERT INTO pedidos (estado_pedido, fecha_pedido, direccion_pedido, id_cliente) VALUES ('En camino', '2024-05-10', '3233 Avenida Sol', 15);

INSERT INTO detalles_pedidos (id_pedido, precio_producto, cantidad_comprada, id_hamaca) 
VALUES (1, calcular_total_producto(1, 2), 2, 1);
INSERT INTO detalles_pedidos (id_pedido, precio_producto, cantidad_comprada, id_hamaca) 
VALUES (2, calcular_total_producto(2, 1), 1, 2);
INSERT INTO detalles_pedidos (id_pedido, precio_producto, cantidad_comprada, id_hamaca) 
VALUES (3, calcular_total_producto(3, 1), 1, 3);
INSERT INTO detalles_pedidos (id_pedido, precio_producto, cantidad_comprada, id_hamaca) 
VALUES (4, calcular_total_producto(4, 3), 3, 4);
INSERT INTO detalles_pedidos (id_pedido, precio_producto, cantidad_comprada, id_hamaca) 
VALUES (5, calcular_total_producto(4, 1), 1, 4);
INSERT INTO detalles_pedidos (id_pedido, precio_producto, cantidad_comprada, id_hamaca) 
VALUES (6, calcular_total_producto(4, 2), 2, 3);
INSERT INTO detalles_pedidos (id_pedido, precio_producto, cantidad_comprada, id_hamaca) 
VALUES (7, calcular_total_producto(4, 4), 4, 3);
INSERT INTO detalles_pedidos (id_pedido, precio_producto, cantidad_comprada, id_hamaca) 
VALUES (8, calcular_total_producto(4, 2), 2, 3);
INSERT INTO detalles_pedidos (id_pedido, precio_producto, cantidad_comprada, id_hamaca) 
VALUES (9, calcular_total_producto(4, 1), 1, 3);
INSERT INTO detalles_pedidos (id_pedido, precio_producto, cantidad_comprada, id_hamaca) 
VALUES (10, calcular_total_producto(4, 3), 3, 3);
INSERT INTO detalles_pedidos (id_pedido, precio_producto, cantidad_comprada, id_hamaca) 
VALUES (11, calcular_total_producto(4, 2), 2, 3);
INSERT INTO detalles_pedidos (id_pedido, precio_producto, cantidad_comprada, id_hamaca) 
VALUES (12, calcular_total_producto(4, 1), 1, 4);
INSERT INTO detalles_pedidos (id_pedido, precio_producto, cantidad_comprada, id_hamaca) 
VALUES (13, calcular_total_producto(4, 1), 1, 4);
INSERT INTO detalles_pedidos (id_pedido, precio_producto, cantidad_comprada, id_hamaca) 
VALUES (14, calcular_total_producto(4, 2), 2, 4);
INSERT INTO detalles_pedidos (id_pedido, precio_producto, cantidad_comprada, id_hamaca) 
VALUES (15, calcular_total_producto(4, 1), 1, 4);


SELECT ID, NOMBRE FROM vista_roles_administradores
ORDER BY NOMBRE;

SELECT * FROM administradores;
SELECT * FROM roles_administradores;
SELECT * FROM clientes;
SELECT * FROM categorias;
SELECT * FROM materiales;
SELECT * FROM hamacas;
SELECT * FROM fotos;
SELECT * FROM pedidos;
SELECT * FROM detalles_pedidos;
SELECT * FROM valoraciones;

SELECT fecha_pedido AS FECHA, 
SUM(precio_producto) AS GANANCIAS
FROM detalles_pedidos
INNER JOIN pedidos USING(id_pedido)
WHERE estado_pedido = "Entregado"
GROUP BY FECHA ORDER BY FECHA ASC;

SELECT fecha_pedido, precio_producto, cantidad_comprada
FROM detalles_pedidos
INNER JOIN pedidos USING(id_pedido)
WHERE estado_pedido = 'Entregado';



SELECT id_foto AS ID, id_hamaca AS HAMACA, url AS IMAGEN FROM fotos
                WHERE id_hamaca = 2;
                
                
SELECT fecha_pedido AS FECHA, 
SUM(precio_producto) AS GANANCIAS
FROM detalles_pedidos
INNER JOIN pedidos USING(id_pedido)
WHERE estado_pedido = "Entregado"
GROUP BY FECHA ORDER BY GANANCIAS ASC