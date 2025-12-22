-- Función mejorada para manejar inserción y borrado
CREATE OR REPLACE FUNCTION gestionar_stock_por_item_compra()
RETURNS TRIGGER AS $$
BEGIN
    -- Si se inserta un item, sumamos al stock
    IF (TG_OP = 'INSERT') THEN
        UPDATE ingredientes
        SET stock_actual = stock_actual + NEW.cantidad
        WHERE id = NEW.ingrediente_id;
        RETURN NEW;

    -- Si se borra un item, restamos la cantidad que se había sumado antes
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE ingredientes
        SET stock_actual = stock_actual - OLD.cantidad
        WHERE id = OLD.ingrediente_id;
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Eliminar el trigger anterior para evitar duplicidad
DROP TRIGGER IF EXISTS trg_actualizar_stock_compra ON compra_items;

-- Crear el nuevo gatillo para ambos eventos
CREATE TRIGGER trg_gestion_stock_compra
AFTER INSERT OR DELETE ON compra_items
FOR EACH ROW
EXECUTE FUNCTION gestionar_stock_por_item_compra();