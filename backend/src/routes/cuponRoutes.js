const express = require('express');
const router = express.Router();
const cuponController = require('../controllers/cuponController');

// Rutas CRUD (Admin)
router.get('/', cuponController.listarCupones);
router.get('/:id', cuponController.obtenerCupon);
router.post('/', cuponController.crearCupon);
router.put('/:id', cuponController.actualizarCupon);
router.delete('/:id', cuponController.eliminarCupon);

// Ruta Pública/Cliente (Para aplicar en el carrito)
router.post('/validar', cuponController.validarCupon);

module.exports = router;