const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// --- RUTAS PÚBLICAS (O solo autenticadas) ---
// Cualquier usuario logueado (o incluso sin loguear si quisieras) debería ver el menú
router.get('/', verifyToken, categoriaController.listarCategorias);
router.get('/:id', verifyToken, categoriaController.obtenerCategoria);

// --- RUTAS PROTEGIDAS (Solo Administradores) ---
router.post('/', verifyToken, isAdmin, categoriaController.crearCategoria);
router.put('/:id', verifyToken, isAdmin, categoriaController.actualizarCategoria);
router.delete('/:id', verifyToken, isAdmin, categoriaController.eliminarCategoria);

module.exports = router;