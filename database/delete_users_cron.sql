-- Habilitar extensión
create extension if not exists pg_cron;

-- Crear tarea programada: Todos los días a las 3 AM
select cron.schedule(
  'limpieza-usuarios-viejos', -- nombre tarea
  '0 3 * * *',               -- cron (3:00 AM)
  $$
    -- Borra usuarios de la tabla AUTH (cascada borrará perfiles)
    -- si tienen más de 30 días de haber sido marcados como 'eliminado_el'
    DELETE FROM auth.users 
    WHERE id IN (
      SELECT id FROM public.perfiles 
      WHERE eliminado_el < NOW() - INTERVAL '30 days'
    );
  $$
);