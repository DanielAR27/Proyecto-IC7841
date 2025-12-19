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

-- 4. Insertar Proveedores de ejemplo
INSERT INTO proveedores (nombre, contacto_nombre, telefono, email) VALUES 
('Molinos Central', 'Carlos Pérez', '555-0101', 'ventas@molinos.com'),
('Distribuidora Cocoa', 'Ana Martínez', '555-0202', 'pedidos@cocoa.com')
ON CONFLICT (nombre) DO NOTHING;

-- 5. Insertar un Cupón de prueba
INSERT INTO cupones (codigo, descuento_porcentaje, activo, fecha_expiracion) VALUES 
('BIENVENIDA10', 10, true, '2025-12-31')
ON CONFLICT (codigo) DO NOTHING;