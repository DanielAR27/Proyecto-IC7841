const supabase = require('../config/supabase');

/**
 * LISTAR USUARIOS (VISIBLES)
 * Muestra tanto activos como inactivos.
 * ÚNICA CONDICIÓN: Que no estén "eliminados" (Soft Delete).
 */
const listarUsuarios = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('perfiles')
      .select('*')
      .is('eliminado_el', null) // <--- Solo filtramos los borrados, mostramos los inactivos/suspendidos
      .order('fecha_creacion', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('Error al listar usuarios:', error);
    res.status(500).json({ error: 'Error al obtener el listado de usuarios.' });
  }
};

/**
 * OBTENER UN USUARIO
 */
const obtenerUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Usuario no encontrado.' });
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario.' });
  }
};

/**
 * ACTUALIZAR USUARIO (Incluye Suspender/Reactivar)
 * Aquí manejamos el estado "Activo/Inactivo" sin tocar "eliminado_el".
 */
const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, email, telefono, direccion, rol, activo } = req.body;

    // ID del administrador que está operando (inyectado por tu middleware de auth)
  const adminId = req.user.id;

  try {
    // 1. PREVENCIÓN DE AUTO-DOWNGRADE Y AUTO-BAN
    // Si el admin se está editando a sí mismo, bloqueamos cambios sensibles
    if (id === adminId) {
      if (rol && rol !== 'admin') {
        return res.status(403).json({ 
          error: 'No puedes quitarte el rol de administrador a ti mismo.' 
        });
      }
      if (activo === false) {
        return res.status(403).json({ 
          error: 'No puedes desactivar tu propia cuenta desde el panel de administración.' 
        });
      }
    }

    // 1.5 VALIDAR ÚLTIMO ADMINISTRADOR
    // Si se intenta quitar el rol de admin O desactivar la cuenta
    if ((rol && rol !== 'admin') || activo === false) {
      // Verificamos si el usuario objetivo es actualmente un admin
      const { data: targetUser } = await supabase.from('perfiles').select('rol').eq('id', id).single();
      
      if (targetUser?.rol === 'admin') {
        // Contamos cuántos admins activos quedan en total
        const { count } = await supabase
          .from('perfiles')
          .select('*', { count: 'exact', head: true })
          .eq('rol', 'admin')
          .eq('activo', true)
          .is('eliminado_el', null);

        if (count <= 1) {
          return res.status(400).json({ error: 'Acción bloqueada: No puedes desactivar o degradar al único administrador del sistema.' });
        }
      }
    }

    // 2. SINCRONIZAR EMAIL (Si cambió)
    if (email) {
      const { error: authError } = await supabase.auth.admin.updateUserById(id, { email });
      if (authError) throw authError;
    }

    // 3. SINCRONIZAR SUSPENSIÓN (Ban/Unban)
    // Si 'activo' es false -> Baneamos (Inactivo). Si es true -> Desbaneamos.
    if (activo !== undefined) {
      const banDuration = activo ? 'none' : '876000h'; // 100 años de ban
      const { error: banError } = await supabase.auth.admin.updateUserById(id, { 
        ban_duration: banDuration 
      });
      if (banError) throw banError;
    }

    // --- NUEVA VALIDACIÓN DE TELÉFONO ---
    // Solo validamos si el admin está intentando actualizar el teléfono
    if (telefono) {
      const telefonoRegex = /^[0-9]{8}$/;
      if (!telefonoRegex.test(telefono)) {
        return res.status(400).json({ error: 'El teléfono debe ser un número válido de 8 dígitos.' });
      }
    }

    // 4. ACTUALIZAR DB
    // Actualizamos 'activo' pero JAMÁS tocamos 'eliminado_el' aquí.
    const updates = {
      nombre, apellido, telefono, direccion, rol, email,
      ...(activo !== undefined && { activo }) // Solo actualizamos el flag booleano
    };

    const { error: profileError } = await supabase
      .from('perfiles')
      .update(updates)
      .eq('id', id);

    if (profileError) throw profileError;

    res.status(200).json({ mensaje: 'Usuario actualizado correctamente.' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar el usuario.' });
  }
};

/**
 * ELIMINAR USUARIO (Soft Delete Definitivo)
 */
const eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  const adminId = req.user.id; // ID del admin que hace la petición

  // 1. PREVENCIÓN DE AUTO-ELIMINACIÓN
  if (id === adminId) {
    return res.status(403).json({ 
      error: 'No puedes eliminar tu propia cuenta.' 
    });
  }
  
  try {
    const fechaEliminacion = new Date().toISOString();

    // 2. BLOQUEAR ACCESO (Ban)
    const { error: banError } = await supabase.auth.admin.updateUserById(id, {
      ban_duration: '876000h' 
    });
    if (banError) throw banError;

    // 3. SOFT DELETE
    const { error: dbError } = await supabase
      .from('perfiles')
      .update({ 
        activo: false, 
        eliminado_el: fechaEliminacion 
      })
      .eq('id', id);

    if (dbError) throw dbError;

    res.status(200).json({ mensaje: 'Usuario enviado a la papelera.' });

  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar el usuario.' });
  }
};

module.exports = {
  listarUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario
};