-- B. Crear la tarea de limpieza (pg_cron)
-- Borra físicamente ingredientes que lleven más de 30 días en la papelera
SELECT cron.schedule(
  'limpieza-ingredientes-viejos', 
  '0 3 * * *', 
  $$
    DELETE FROM public.ingredientes 
    WHERE activo = false 
      AND eliminado_el < NOW() - INTERVAL '30 days';
  $$
);