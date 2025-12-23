const supabase = require('../config/supabase');

/**
 * LISTAR INGREDIENTES
 * Recupera el listado incluyendo el nombre y abreviatura de la unidad mediante un JOIN.
 */
const listarIngredientes = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ingredientes')
      // Realizamos un JOIN con la tabla unidades_medida
      .select('*, unidades_medida(nombre, abreviatura)')
      .order('nombre', { ascending: true });

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error('Error al listar ingredientes:', error);
    res.status(500).json({ error: 'Error al obtener el listado de ingredientes.' });
  }
};

/**
 * OBTENER INGREDIENTE POR ID
 */
const obtenerIngrediente = async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('ingredientes')
      .select('*, unidades_medida(nombre, abreviatura)')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Ingrediente no encontrado.' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error al obtener ingrediente:', error);
    res.status(500).json({ error: 'Error al buscar el ingrediente.' });
  }
};

/**
 * CREAR INGREDIENTE
 * Ahora recibe 'unidad_id' en lugar de 'unidad_medida'.
 */
const crearIngrediente = async (req, res) => {
  const { nombre, unidad_id, es_ilimitado } = req.body;

  if (!nombre || nombre.trim().length < 2) {
    return res.status(400).json({ error: 'El nombre es obligatorio.' });
  }

  if (!unidad_id) {
    return res.status(400).json({ error: 'Debe seleccionar una unidad de medida válida.' });
  }

  try {
    const { data, error } = await supabase
      .from('ingredientes')
      .insert([{ 
        nombre, 
        unidad_id,
        es_ilimitado: es_ilimitado || false,
        stock_actual: 0 
      }])
      .select('*, unidades_medida(nombre, abreviatura)')
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Ya existe un ingrediente con ese nombre.' });
      }
      throw error;
    }

    res.status(201).json({ mensaje: 'Ingrediente creado con éxito.', ingrediente: data });
  } catch (error) {
    console.error('Error al crear ingrediente:', error);
    res.status(500).json({ error: 'Error interno al registrar el ingrediente.' });
  }
};

/**
 * ACTUALIZAR INGREDIENTE
 */
const actualizarIngrediente = async (req, res) => {
  const { id } = req.params;
  const { nombre, unidad_id, es_ilimitado } = req.body;

  try {
    const { data, error } = await supabase
      .from('ingredientes')
      .update({ nombre, unidad_id, es_ilimitado }) 
      .eq('id', id)
      .select('*, unidades_medida(nombre, abreviatura)')
      .single();

    if (error) throw error;

    res.status(200).json({ mensaje: 'Ingrediente actualizado correctamente.', ingrediente: data });
  } catch (error) {
    console.error('Error al actualizar ingrediente:', error);
    res.status(500).json({ error: 'Error al procesar la actualización del ingrediente.' });
  }
};

/**
 * ELIMINAR INGREDIENTE
 * Intenta eliminar un insumo, manejando la protección de integridad referencial.
 */
const eliminarIngrediente = async (req, res) => {
  const { id } = req.params;

  try {
    // Intentamos borrar directamente el ingrediente
    const { error } = await supabase
      .from('ingredientes')
      .delete()
      .eq('id', id);

    if (error) {
      // Código 23503 = Violación de llave foránea (Integridad Referencial)
      if (error.code === '23503') {
        return res.status(400).json({ 
          error: 'No se puede eliminar: Este ingrediente está asociado a facturas de compra o recetas de productos. El historial de inventario está protegido.' 
        });
      }
      // Si es otro tipo de error de Supabase, lo lanzamos al catch global
      throw error;
    }

    res.status(200).json({ mensaje: 'Ingrediente eliminado correctamente del inventario.' });

  } catch (error) {
    console.error('Error crítico al eliminar ingrediente:', error);
    res.status(500).json({ error: 'Error interno al intentar eliminar el ingrediente.' });
  }
};

module.exports = {
  listarIngredientes,
  obtenerIngrediente,
  crearIngrediente,
  actualizarIngrediente,
  eliminarIngrediente
};