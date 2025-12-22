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
      res.status(201).json({ 
        mensaje: 'Usuario registrado exitosamente. Por favor verifique su correo.',
        userId: data.user?.id 
      });

    } catch (err) {
      console.error('Error en registro:', err);
      res.status(500).json({ error: 'Error interno del servidor al procesar el registro.' });
    }
  },

  /**
   * Inicio de sesión.
   * Retorna el token de acceso Y el token de refresco (llave maestra).
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

      // CAMBIO IMPORTANTE: Se incluye refresh_token en la respuesta
      res.status(200).json({
        token: data.session.access_token,       // Token temporal (1 hora)
        refresh_token: data.session.refresh_token, // Token de renovación (larga duración)
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
   * NUEVO: Renueva la sesión utilizando el refresh_token.
   * Permite obtener un nuevo access_token sin pedir credenciales nuevamente.
   */
  refreshSession: async (req, res) => {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({ error: 'Se requiere el refresh token.' });
    }

    try {
      // Solicita a Supabase el intercambio de tokens
      const { data, error } = await supabase.auth.refreshSession({ refresh_token });

      if (error || !data.session) {
        // Si el refresh token también expiró o es inválido, el usuario debe loguearse de cero.
        return res.status(401).json({ error: 'Sesión expirada. Por favor inicie sesión nuevamente.' });
      }

      // Devuelve el nuevo par de llaves
      res.status(200).json({
        token: data.session.access_token,
        refresh_token: data.session.refresh_token, // Supabase suele rotar este token también por seguridad
        expires_at: data.session.expires_at
      });

    } catch (error) {
      console.error('Error al refrescar sesión:', error);
      res.status(500).json({ error: 'Error interno al intentar renovar la sesión.' });
    }
  },

  /**
   * Gestiona el envío del correo de recuperación
   */
recuperarPassword: async (req, res) => {
      const { email, redirectTo } = req.body;

      // --- LOG DE DEPURACIÓN 1: LO QUE LLEGA ---
      console.log("📨 [BACKEND] Petición recibida para recuperar password");
      console.log("   - Email:", email);
      console.log("   - RedirectTo recibido:", redirectTo);
      // -----------------------------------------

      try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: redirectTo,
        });

        // --- LOG DE DEPURACIÓN 2: RESPUESTA DE SUPABASE ---
        if (error) {
            console.error("❌ [BACKEND] Error de Supabase:", error.message);
            throw error;
        } else {
            console.log("✅ [BACKEND] Supabase dice que envió el correo sin error.");
            console.log("   - Data:", data);
        }
        // --------------------------------------------------

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
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'No autorizado' });
    if (!password) return res.status(400).json({ error: 'La contraseña es requerida' });

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);
      
      if (userError || !user) throw new Error('Token inválido o expirado');

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