const supabase = require('../config/supabase');

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
    const { data, error } = await supabase
      .storage
      .from('productos') // Nombre del bucket
      .createSignedUploadUrl(fileName);

    if (error) throw error;

    res.status(200).json({
      signedUrl: data.signedUrl,
      token: data.token,
      path: data.path
    });
  } catch (error) {
    console.error('Error generando firma de storage:', error);
    res.status(500).json({ error: 'No se pudo autorizar la subida al storage.' });
  }
};

module.exports = { generarUrlSubida };