const supabase = require('../config/supabase');

/**
 * LISTAR CATEGORÍAS (Público)
 * Se usa tanto para el Admin Panel como para el catálogo del cliente.
 */
const listarCategorias = async (req, res) => {
  try {
    // Trae todas las categorías y la cantidad de productos asociados
    const { data, error } = await supabase
      .from('categorias')
      .select('*, productos(count)') 
      .order('nombre', { ascending: true });

    if (error) throw error;
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error al listar categorías:', error);
    res.status(500).json({ error: 'Error al obtener las categorías.' });
  }
};

/**
 * OBTENER UNA CATEGORÍA (Público/Admin)
 * Útil para precargar el formulario de edición.
 */
const obtenerCategoria = async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return res.status(404).json({ error: 'Categoría no encontrada.' });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar la categoría.' });
  }
};

/**
 * CREAR CATEGORÍA (Solo Admin)
 */
const crearCategoria = async (req, res) => {
  const { nombre, descripcion } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre de la categoría es obligatorio.' });
  }

  try {
    const { data, error } = await supabase
      .from('categorias')
      .insert([{ nombre, descripcion }])
      .select()
      .single();

    if (error) {
      // Código de error de Postgres para violación de restricción única
      if (error.code === '23505') {
        return res.status(400).json({ error: `La categoría "${nombre}" ya existe.` });
      }
      throw error;
    }

    res.status(201).json({ mensaje: 'Categoría creada con éxito.', categoria: data });
  } catch (error) {
    console.error('Error creando categoría:', error);
    res.status(500).json({ error: 'No se pudo crear la categoría.' });
  }
};

/**
 * ACTUALIZAR CATEGORÍA (Solo Admin)
 */
const actualizarCategoria = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;

  try {
    // Intentamos actualizar directamente
    const { data, error } = await supabase
      .from('categorias')
      .update({ nombre, descripcion })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      // Si el error es por duplicado (código Postgres 23505)
      if (error.code === '23505') {
        return res.status(409).json({ 
          error: `La categoría "${nombre}" ya existe. Elige otro nombre.` 
        });
      }
      throw error; // Si es otro error, que lo atrape el catch de abajo
    }

    res.status(200).json({ mensaje: 'Categoría actualizada.', categoria: data });

  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({ error: 'Error interno al actualizar la categoría.' });
  }
};

/**
 * ELIMINAR CATEGORÍA (Solo Admin)
 * Nota: Los productos asociados quedarán con categoria_id = NULL
 */
const eliminarCategoria = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('categorias')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({ mensaje: 'Categoría eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la categoría.' });
  }
};

module.exports = {
  listarCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
};