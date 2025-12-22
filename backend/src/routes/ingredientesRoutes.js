const express = require('express');
const router = express.Router();
const ingredienteController = require('../controllers/ingredienteController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware')

/**
 * RUTAS ADMINISTRATIVAS DE INGREDIENTES
 * Se aplica el middleware esAdmin para asegurar que solo usuarios con privilegios
 * puedan gestionar el inventario de insumos.
 */

router.get('/', verifyToken, isAdmin, ingredienteController.listarIngredientes);
router.get('/:id', verifyToken, isAdmin, ingredienteController.obtenerIngrediente);
router.post('/', verifyToken, isAdmin, ingredienteController.crearIngrediente);
router.put('/:id', verifyToken, isAdmin, ingredienteController.actualizarIngrediente);
router.delete('/:id', verifyToken, isAdmin, ingredienteController.eliminarIngrediente);

module.exports = router;