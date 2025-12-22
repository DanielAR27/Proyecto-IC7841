const supabase = require('../config/supabase');

/**
 * LISTAR UNIDADES DE MEDIDA
 * Recupera el catálogo completo de unidades (kg, g, ml, l, u, etc.)
 * para ser utilizado en selectores del frontend.
 */
const listarUnidades = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('unidades_medida')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error('Error al listar unidades:', error);
    res.status(500).json({ error: 'Error al obtener el catálogo de unidades.' });
  }
};

module.exports = {
  listarUnidades
};