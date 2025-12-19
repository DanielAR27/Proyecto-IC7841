-- Función que inserta un nuevo perfil al registrar un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.perfiles (id, email, nombre, apellido, telefono, direccion)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'nombre', 
    new.raw_user_meta_data->>'apellido',
    new.raw_user_meta_data->>'telefono',
    new.raw_user_meta_data->>'direccion'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql security definer;

-- Trigger que ejecuta la función después de cada inserción en auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();