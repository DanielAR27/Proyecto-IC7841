const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
// Importamos los middlewares de seguridad
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

/**
 * RUTAS ADMINISTRATIVAS DE USUARIOS
 * Todas las operaciones requieren autenticación y rol de administrador.
 */

// Listar todos los usuarios (solo los visibles/activos)
router.get('/', verifyToken, isAdmin, usuarioController.listarUsuarios);

// Obtener detalle de un usuario específico
router.get('/:id', verifyToken, isAdmin, usuarioController.obtenerUsuario);

// Actualizar usuario (rol, datos o suspender/reactivar)
router.put('/:id', verifyToken, isAdmin, usuarioController.actualizarUsuario);

// Eliminar usuario (Soft Delete definitivo)
router.delete('/:id', verifyToken, isAdmin, usuarioController.eliminarUsuario);

module.exports = router;