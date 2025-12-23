const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Aseguramos que las variables estén cargadas

/**
 * Genera una URL firmada para permitir la subida de un archivo específico.
 * El ticket expira en 5 minutos por seguridad.
 */
const generarUrlSubida = async (req, res) => {
  const { fileName } = req.body;

  if (!fileName) {
    return res.status(400).json({ error: 'El nombre del archivo es requerido.' });
  }

  try {
    // 1. CREAMOS UNA INSTANCIA LIMPIA Y EXCLUSIVA PARA ESTA OPERACIÓN
    // Esto evita que cualquier sesión de usuario (setSession) que haya ocurrido
    // en los middlewares afecte los permisos de "Service Role" de este cliente.
    const storageClient = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY, // Asegúrate que esta sea la SERVICE_ROLE_KEY
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false, // Importante: No guardar sesiones en memoria
          detectSessionInUrl: false
        }
      }
    );

    // 2. Usamos esta instancia limpia para firmar la URL
    const { data, error } = await storageClient
      .storage
      .from('productos')
      .createSignedUploadUrl(fileName);

    if (error) throw error;

    res.status(200).json({
      signedUrl: data.signedUrl,
      token: data.token,
      path: data.path
    });

  } catch (error) {
    console.error('Error generando firma de storage:', error);
    // Tip: Si el error es 403, confirma que sea por RLS
    if (error.statusCode === '403' || error.status === 400) {
      console.error("🔍 Pista: Verifica que SUPABASE_KEY en el .env sea la SERVICE_ROLE (no la anon).");
    }
    res.status(500).json({ error: 'No se pudo autorizar la subida al storage.' });
  }
};

module.exports = { generarUrlSubida };