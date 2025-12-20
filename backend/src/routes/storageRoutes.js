const express = require('express');
const router = express.Router();
const storageController = require('../controllers/storageController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

/**
 * Solo administradores autenticados pueden pedir firmas de subida.
 * Esto evita que cualquier usuario externo llene tu storage.
 */
router.post('/sign-upload', verifyToken, isAdmin, storageController.generarUrlSubida);

module.exports = router;