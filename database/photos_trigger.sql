CREATE OR REPLACE FUNCTION gestionar_imagen_principal()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.es_principal = true THEN
    UPDATE producto_imagenes
    SET es_principal = false
    WHERE producto_id = NEW.producto_id AND id <> NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trigger_unica_principal
AFTER INSERT OR UPDATE OF es_principal ON producto_imagenes
FOR EACH ROW
EXECUTE FUNCTION gestionar_imagen_principal();
