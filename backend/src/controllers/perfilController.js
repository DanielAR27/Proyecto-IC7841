const supabase = require('../config/supabase');

/**
 * Obtiene el perfil del usuario autenticado.
 * Se seleccionan explícitamente los campos públicos para evitar exponer metadata interna futura.
 */
const getMiPerfil = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('perfiles')
      .select('id, nombre, apellido, email, telefono, direccion, rol, fecha_creacion')
      .eq('id', req.user.id) // req.user.id viene del middleware de autenticación
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'No se pudo obtener la información del perfil.' });
  }
};

/**
 * Actualiza los datos del usuario.
 * Valida que los campos NOT NULL (nombre, apellido, telefono) no lleguen vacíos.
 */
const actualizarPerfil = async (req, res) => {
  const { nombre, apellido, direccion, telefono } = req.body;
  
  // Validaciones Explícitas antes de intentar actualizar
  if (!nombre) return res.status(400).json({ error: 'El nombre no puede estar vacío.' });
  if (!apellido) return res.status(400).json({ error: 'El apellido no puede estar vacío.' });
  
  const telefonoRegex = /^[0-9]{8}$/;
  if (!telefono || !telefonoRegex.test(telefono)) {
    return res.status(400).json({ error: 'El teléfono debe ser un número válido de 8 dígitos.' });
  }

  try {
    const { data, error } = await supabase
      .from('perfiles')
      .update({ 
        nombre: nombre.trim(), 
        apellido: apellido.trim(), 
        direccion: direccion ? direccion.trim() : null, 
        telefono: telefono.trim() 
      })
      .eq('id', req.user.id)
      .select('id, nombre, apellido, email, telefono, direccion, rol') // Retornamos el objeto actualizado limpio
      .single();

    if (error) throw error;

    res.status(200).json({
      mensaje: 'Perfil actualizado correctamente.',
      perfil: data
    });

  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error al intentar actualizar los datos.' });
  }
};

/**
 * Actualización administrativa de perfiles.
 * Permite cambiar roles y datos básicos.
 */
const adminActualizarPerfil = async (req, res) => {
  const { id } = req.params;
  const { rol, nombre, apellido } = req.body;

  if (!id) return res.status(400).json({ error: 'ID de usuario requerido.' });

  try {
    const { data, error } = await supabase
      .from('perfiles')
      .update({ 
        rol, 
        nombre, 
        apellido 
      })
      .eq('id', id)
      .select('id, nombre, apellido, rol')
      .single();

    if (error) throw error;

    res.status(200).json({
      mensaje: 'Perfil de usuario actualizado por administración.',
      perfil: data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Listado de perfiles para el panel de administración.
 * Se limita la información sensible (ej. no traer direcciones si no es necesario para la lista).
 */
const listarPerfiles = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('perfiles')
      .select('id, nombre, apellido, email, rol, telefono, fecha_creacion') // Excluimos dirección para aligerar la lista
      .order('fecha_creacion', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar los usuarios.' });
  }
};

module.exports = {
  getMiPerfil,
  actualizarPerfil,
  adminActualizarPerfil,
  listarPerfiles
};