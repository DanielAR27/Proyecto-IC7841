const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware')

/**
 * RUTAS DE PROVEEDORES
 * Base URL: /api/proveedores
 */

// 1. Obtener lista y detalles (Accesible para todo personal autenticado)
// Es necesario que cualquier empleado pueda verlos para registrar compras
router.get('/', verifyToken, proveedorController.listarProveedores);
router.get('/:id', verifyToken, proveedorController.obtenerProveedor);

// 2. Gestión Administrativa (Protegido solo para Admins)
// Solo el jefe debería poder registrar nuevos contratos o borrar contactos
router.post('/', verifyToken, isAdmin, proveedorController.crearProveedor);
router.put('/:id', verifyToken, isAdmin, proveedorController.actualizarProveedor);
router.delete('/:id', verifyToken, isAdmin, proveedorController.eliminarProveedor);

module.exports = router;