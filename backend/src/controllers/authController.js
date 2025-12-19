const supabase = require('../config/supabase');

const authController = {
  /**
   * Procesa el registro de nuevos usuarios.
   * Incluye validaciones estrictas para cada campo obligatorio antes de contactar a la base de datos.
   */
  registrar: async (req, res) => {
    const { email, password, nombre, apellido, telefono, direccion } = req.body;

    // 1. Validaciones de Campos Obligatorios (Feedback Explícito)
    if (!email) return res.status(400).json({ error: 'El correo electrónico es obligatorio.' });
    if (!password) return res.status(400).json({ error: 'La contraseña es obligatoria.' });
    if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio.' });
    if (!apellido) return res.status(400).json({ error: 'El apellido es obligatorio.' });
    
    // 2. Validación de Contraseña (Mínimo 6 caracteres, por seguridad básica)
    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    // 3. Validación de Formato de Teléfono (Costa Rica - 8 dígitos)
    const telefonoRegex = /^[0-9]{8}$/;
    if (!telefono || !telefonoRegex.test(telefono)) {
      return res.status(400).json({ error: 'El teléfono debe tener exactamente 8 números.' });
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Metadatos para el Trigger de la tabla 'perfiles'
          data: {
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            telefono: telefono.trim(),
            direccion: direccion ? direccion.trim() : null
          }
        }
      });

      if (error) return res.status(400).json({ error: error.message });

      // 4. Respuesta Sanitizada
      // No devuelve todo el objeto de Supabase, solo lo necesario.
      res.status(201).json({ 
        mensaje: 'Usuario registrado exitosamente. Por favor verifique su correo.',
        userId: data.user?.id // Útil si el frontend necesita redirigir o trackear
      });

    } catch (err) {
      console.error('Error en registro:', err);
      res.status(500).json({ error: 'Error interno del servidor al procesar el registro.' });
    }
  },

  /**
   * Inicio de sesión.
   * Retorna el token y una versión simplificada del usuario.
   */
  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Correo y contraseña son requeridos.' });
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) return res.status(401).json({ error: 'Credenciales inválidas.' });

      // Respuesta Filtrada: El frontend usa principalmente el token.
      // Los detalles del perfil se obtienen en una llamada separada (getMiPerfil).
      res.status(200).json({
        token: data.session.access_token,
        expires_at: data.session.expires_at,
        user: {
          id: data.user.id,
          email: data.user.email
        }
      });

    } catch (err) {
      console.error('Error en login:', err);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  },

  /**
   * Gestiona el envío del correo de recuperación
   */
  recuperarPassword: async (req, res) => {
      const { email, redirectTo } = req.body;

      try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: redirectTo,
        });

        if (error) {
          throw error;
        }

        res.status(200).json({ mensaje: 'Correo enviado' });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
  },


  /**
   * Actualiza la contraseña del usuario.
   * Requiere que el usuario esté autenticado (token en header).
   */
  actualizarPassword: async (req, res) => {
    const { password } = req.body;
    // Obtiene el token que el frontend mandó en el header Authorization
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'No autorizado' });
    if (!password) return res.status(400).json({ error: 'La contraseña es requerida' });

    try {
      // 1. Obtiene el usuario dueño del token
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);
      
      if (userError || !user) throw new Error('Token inválido o expirado');

      // 2. Usa el ADMIN de supabase para forzar el cambio de contraseña de ese ID
      const { error } = await supabase.auth.admin.updateUserById(user.id, { password });

      if (error) throw error;

      res.status(200).json({ mensaje: 'Contraseña actualizada correctamente' });
    } catch (error) {
      console.error('Error al actualizar password:', error.message);
      res.status(400).json({ error: 'No se pudo actualizar la contraseña' });
    }
  }
};

module.exports = authController;