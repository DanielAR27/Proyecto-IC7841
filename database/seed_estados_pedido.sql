-- Script para poblar la tabla estados_pedido con los estados del flujo de pedidos

-- Limpiar estados existentes (solo si es necesario)
-- DELETE FROM estados_pedido;

-- Insertar estados del ciclo de vida del pedido
INSERT INTO estados_pedido (nombre) VALUES
  ('Pendiente de Pago'),      -- id: 1 - Pedido creado, esperando confirmación de pago
  ('Confirmado'),             -- id: 2 - Pago confirmado, pedido en cola
  ('En Producción'),          -- id: 3 - El equipo está preparando el pedido
  ('Listo para Retiro'),      -- id: 4 - Pedido terminado, esperando que el cliente lo recoja
  ('Entregado'),              -- id: 5 - Pedido entregado al cliente
  ('Cancelado');              -- id: 6 - Pedido cancelado (solo si estaba en "Pendiente de Pago")

-- Verificar que los estados se insertaron correctamente
SELECT * FROM estados_pedido ORDER BY id;
