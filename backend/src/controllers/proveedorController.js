const supabase = require('../config/supabase');

/**
 * LISTAR PROVEEDORES
 * Retorna la lista completa de proveedores ordenada por ID.
 */
const listarProveedores = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('proveedores')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('Error al listar proveedores:', error);
    res.status(500).json({ error: 'Error al obtener la lista de proveedores.' });
  }
};

/**
 * OBTENER PROVEEDOR
 * Busca un proveedor específico por su ID.
 */
const obtenerProveedor = async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('proveedores')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Proveedor no encontrado.' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error al obtener proveedor:', error);
    res.status(500).json({ error: 'Error al obtener el proveedor.' });
  }
};

/**
 * CREAR PROVEEDOR
 * Inserta un nuevo proveedor validando que el nombre no exista previamente.
 */
const crearProveedor = async (req, res) => {
  const { nombre, contacto_nombre, telefono, email } = req.body;

  // Validación básica
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre del proveedor es obligatorio.' });
  }

  try {
    // 1. Verificar duplicados (No se permite repetir nombres)
    const { data: existente } = await supabase
      .from('proveedores')
      .select('id')
      .eq('nombre', nombre)
      .single();

    if (existente) {
      return res.status(400).json({ error: 'Ya existe un proveedor con este nombre.' });
    }

    // 2. Insertar
    const { data, error } = await supabase
      .from('proveedores')
      .insert([{ nombre, contacto_nombre, telefono, email }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);

  } catch (error) {
    console.error('Error al crear proveedor:', error);
    res.status(500).json({ error: 'No se pudo registrar el proveedor.' });
  }
};

/**
 * ACTUALIZAR PROVEEDOR
 * Modifica los datos de un proveedor existente.
 */
const actualizarProveedor = async (req, res) => {
  const { id } = req.params;
  const { nombre, contacto_nombre, telefono, email } = req.body;

  try {
    if (telefono) {
      const telefonoRegex = /^[0-9]{8}$/;
      if (!telefonoRegex.test(telefono)) {
        return res.status(400).json({ error: 'El teléfono debe ser un número válido de 8 dígitos.' });
      }
    }

    // Si se cambia el nombre, verificar que no choque con otro
    if (nombre) {
      const { data: existente } = await supabase
        .from('proveedores')
        .select('id')
        .eq('nombre', nombre)
        .neq('id', id) // Excluir al propio usuario que estamos editando
        .single();

      if (existente) {
        return res.status(400).json({ error: 'El nombre ya está en uso por otro proveedor.' });
      }
    }

    const { data, error } = await supabase
      .from('proveedores')
      .update({ nombre, contacto_nombre, telefono, email })
      .eq('id', id)
      .select();

    if (error) throw error;
    
    if (data.length === 0) {
        return res.status(404).json({ error: 'Proveedor no encontrado.' });
    }

    res.status(200).json(data[0]);

  } catch (error) {
    console.error('Error al actualizar proveedor:', error);
    res.status(500).json({ error: 'Error al actualizar el proveedor.' });
  }
};

/**
 * ELIMINAR PROVEEDOR
 * Depende de la restricción SQL (ON DELETE RESTRICT) para proteger los datos.
 */
const eliminarProveedor = async (req, res) => {
  const { id } = req.params;

  try {
    // Intentamos borrar directamente
    const { error } = await supabase
      .from('proveedores')
      .delete()
      .eq('id', id);

    if (error) {
      // Código 23503 = Violación de llave foránea (RESTRICT saltó en la base de datos)
      if (error.code === '23503') {
        return res.status(400).json({ 
          error: 'No se puede eliminar: Este proveedor tiene facturas registradas. El historial contable está protegido.' 
        });
      }
      // Cualquier otro error inesperado
      throw error;
    }

    res.status(200).json({ mensaje: 'Proveedor eliminado correctamente.' });

  } catch (error) {
    console.error('Error al eliminar proveedor:', error);
    res.status(500).json({ error: 'Error interno al intentar eliminar el proveedor.' });
  }
};

module.exports = {
  listarProveedores,
  obtenerProveedor,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor
};