const supabase = require('../config/supabase');

/**
 * LISTAR TODOS LOS CUPONES (Admin)
 */
const listarCupones = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cupones')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('Error al listar cupones:', error);
    res.status(500).json({ error: 'Error al obtener el listado de cupones.' });
  }
};

/**
 * OBTENER UN CUPÓN POR ID (Para edición)
 */
const obtenerCupon = async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('cupones')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Cupón no encontrado.' });
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el cupón.' });
  }
};

/**
 * CREAR CUPÓN
 */
const crearCupon = async (req, res) => {
  const { codigo, descuento_porcentaje, fecha_expiracion, activo } = req.body;

  // 1. Validaciones
  if (!codigo || !descuento_porcentaje) {
    return res.status(400).json({ error: 'El código y el porcentaje son obligatorios.' });
  }
  if (descuento_porcentaje <= 0 || descuento_porcentaje > 100) {
    return res.status(400).json({ error: 'El porcentaje debe estar entre 1 y 100.' });
  }

  try {
    const { data, error } = await supabase
      .from('cupones')
      .insert([{
        codigo: codigo.toUpperCase().trim(), // Guardamos siempre en mayúsculas
        descuento_porcentaje,
        fecha_expiracion: fecha_expiracion || null,
        activo: activo !== undefined ? activo : true
      }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') return res.status(409).json({ error: 'Ya existe un cupón con este código.' });
      throw error;
    }

    res.status(201).json({ mensaje: 'Cupón creado exitosamente.', cupon: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno al crear el cupón.' });
  }
};

/**
 * ACTUALIZAR CUPÓN
 */
const actualizarCupon = async (req, res) => {
  const { id } = req.params;
  const { codigo, descuento_porcentaje, fecha_expiracion, activo } = req.body;

  try {
    const { error } = await supabase
      .from('cupones')
      .update({
        codigo: codigo?.toUpperCase().trim(),
        descuento_porcentaje,
        fecha_expiracion,
        activo
      })
      .eq('id', id);

    if (error) throw error;
    res.status(200).json({ mensaje: 'Cupón actualizado correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el cupón.' });
  }
};

/**
 * ELIMINAR CUPÓN
 */
const eliminarCupon = async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from('cupones').delete().eq('id', id);
    if (error) throw error;
    res.status(200).json({ mensaje: 'Cupón eliminado.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el cupón.' });
  }
};

/**
 * VALIDAR CUPÓN (Para el Checkout / Carrito)
 * Verifica si existe, si está activo y si no ha vencido.
 */
const validarCupon = async (req, res) => {
  const { codigo } = req.body;

  if (!codigo) return res.status(400).json({ error: 'Falta el código.' });

  try {
    // 1. Buscar cupón
    const { data, error } = await supabase
      .from('cupones')
      .select('*')
      .eq('codigo', codigo.toUpperCase().trim())
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Código de cupón inválido.' });
    }

    // 2. Verificar estado activo
    if (!data.activo) {
      return res.status(400).json({ error: 'Este cupón ya no está activo.' });
    }

    // 3. Verificar fecha de expiración
    if (data.fecha_expiracion) {
      // FECHA ACTUAL: La forzamos a ser la fecha en Costa Rica
      const fechaActualCR = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Costa_Rica" }));
      fechaActualCR.setHours(0, 0, 0, 0);

      // FECHA EXPIRACIÓN: Viene de la DB (ej: '2025-12-20')
      const fechaExpiracion = new Date(data.fecha_expiracion + 'T00:00:00');
      fechaExpiracion.setHours(0, 0, 0, 0);

      // COMPARACIÓN:
      if (fechaActualCR.getTime() > fechaExpiracion.getTime()) {
        return res.status(400).json({ error: 'Este cupón ha expirado.' });
      }
    }

    // 4. Retornar éxito con datos del descuento
    res.status(200).json({
      mensaje: 'Cupón aplicado.',
      id: data.id,
      codigo: data.codigo,
      descuento: data.descuento_porcentaje
    });

  } catch (error) {
    console.error('Error validando cupón:', error);
    res.status(500).json({ error: 'Error al validar el cupón.' });
  }
};

module.exports = {
  listarCupones,
  obtenerCupon,
  crearCupon,
  actualizarCupon,
  eliminarCupon,
  validarCupon
};