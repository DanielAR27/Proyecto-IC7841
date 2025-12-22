const express = require('express');
const router = express.Router();
const unidadController = require('../controllers/unidadController');
const { verifyToken } = require('../middleware/authMiddleware');

// Endpoint: GET /api/unidades
// Protegido para que solo usuarios autenticados vean el catálogo
router.get('/', verifyToken, unidadController.listarUnidades);

module.exports = router;