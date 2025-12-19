const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/perfilController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

/**
 * Rutas de usuario final
 */
router.get('/me', verifyToken, perfilController.getMiPerfil);
router.patch('/update', verifyToken, perfilController.actualizarPerfil);

/**
 * Rutas exclusivas de administración
 */
router.get('/admin/all', verifyToken, isAdmin, perfilController.listarPerfiles);
router.patch('/admin/update-user/:id', verifyToken, isAdmin, perfilController.adminActualizarPerfil);

module.exports = router;