--Nota: Ejecutar cada uno por aparte para que no de error.

-- 1. Insertar Categorías con descripción
INSERT INTO categorias (nombre, descripcion) VALUES 
('Brownies', 'Nuestros famosos brownies artesanales de chocolate premium.'),
('Galletas', 'Galletas horneadas diariamente con ingredientes frescos.'),
('Gomitas', 'Gomitas de sabores frutales y texturas divertidas.'),
('Bebidas', 'Cafés, tés y bebidas frías para acompañar tus postres.')
ON CONFLICT (nombre) DO NOTHING;

-- 2. Insertar Estados del Pedido 
INSERT INTO estados_pedido (nombre) VALUES 
('Recibido'), 
('En el horno'), 
('En ruta'), 
('Entregado')
ON CONFLICT (nombre) DO NOTHING;

-- 3. Insertar algunos Ingredientes de ejemplo 
INSERT INTO ingredientes (nombre, unidad_medida, stock_actual) VALUES 
('Harina de Trigo', 'Kg', 50.0),
('Chocolate Amargo', 'Kg', 20.0),
('Azúcar Blanca', 'Kg', 30.0),
('Mantequilla', 'Kg', 15.0)
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO ingredientes (nombre, stock_actual, activo, eliminado_el, unidad_id) VALUES
('Azúcar blanca', 32, TRUE, NULL, 1),
('Azúcar moreno', 33, TRUE, NULL, 2),
('Chocolate amargo', 20, TRUE, NULL, 1),
('Galletas', 0, TRUE, NULL, 5),
('Harina de trigo', 50, TRUE, NULL, 1),
('Huevos', 12, TRUE, NULL, 5),
('Leche', 0, TRUE, NULL, 6),
('Mantequilla', 18, TRUE, NULL, 1);



INSERT INTO ingredientes (nombre, stock_actual, activo, eliminado_el, unidad_id) VALUES
('Polvo de hornear', 10, TRUE, NULL, 1),
('Bicarbonato de sodio', 5, TRUE, NULL, 1),
('Sal', 5, TRUE, NULL, 1),
('Esencia de vainilla', 5, TRUE, NULL, 3),
('Cacao en polvo', 20, TRUE, NULL, 1),
('Crema dulce', 250, TRUE, NULL, 3),
('Azúcar glass', 100, TRUE, NULL, 1);


INSERT INTO ingredientes (nombre, stock_actual, activo, eliminado_el, unidad_id) VALUES
('Pan para hamburguesa', 4, TRUE, NULL, 5),
('Carne molida', 500, TRUE, NULL, 1),
('Queso en lonchas', 4, TRUE, NULL, 5),
('Lechuga', 1, TRUE, NULL, 5),
('Tomate', 2, TRUE, NULL, 5),
('Cebolla', 1, TRUE, NULL, 5),
('Mayonesa', 200, TRUE, NULL, 3),
('Ketchup', 200, TRUE, NULL, 3),
('Mostaza', 100, TRUE, NULL, 3);



INSERT INTO categorias_comida (nombre, descripcion) VALUES
('Queques', 'Preparaciones horneadas de textura esponjosa, generalmente dulces, elaboradas a base de harina, huevos y azúcar.'),

('Pasteles', 'Postres elaborados por capas o rellenos, comúnmente cubiertos con crema, chocolate o glaseado.'),

('Panadería', 'Productos elaborados principalmente con masa de harina y levadura, horneados a distintas temperaturas.'),

('Postres fríos', 'Preparaciones dulces que no requieren horneado, como mousses, cheesecakes fríos o gelatinas.'),

('Chocolatería', 'Productos donde el chocolate es el ingrediente principal, en distintas presentaciones y porcentajes.'),

('Repostería fina', 'Preparaciones dulces de mayor detalle y técnica, usualmente de tamaño pequeño y presentación cuidada.'),

('Hamburguesas', 'Preparaciones a base de pan relleno con carne u otros ingredientes, servidas como plato principal.'),

('Sandwiches', 'Comidas elaboradas con pan relleno de ingredientes salados o dulces, frías o calientes.'),

('Acompañamientos', 'Productos que complementan un plato principal, como papas, ensaladas o salsas.'),

('Bebidas', 'Preparaciones líquidas para consumo, tanto frías como calientes, dulces o no.'),

('Desayunos', 'Preparaciones típicas para consumo matutino, dulces o saladas.'),

('Snacks', 'Comidas de porción pequeña, pensadas para consumo rápido o entre comidas.');


-- 4. Insertar Proveedores de ejemplo
INSERT INTO proveedores (nombre, contacto_nombre, telefono, email) VALUES 
('Molinos Central', 'Carlos Pérez', '555-0101', 'ventas@molinos.com'),
('Distribuidora Cocoa', 'Ana Martínez', '555-0202', 'pedidos@cocoa.com')
ON CONFLICT (nombre) DO NOTHING;

-- 5. Insertar un Cupón de prueba
INSERT INTO cupones (codigo, descuento_porcentaje, activo, fecha_expiracion) VALUES 
('BIENVENIDA10', 10, true, '2025-12-31')
ON CONFLICT (codigo) DO NOTHING;