const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const perfilRoutes = require('./routes/perfilRoutes');
const categoriasRoutes = require('./routes/categoriasRoutes');
const productosRoutes = require('./routes/productosRoutes');
const storageRoutes = require('./routes/storageRoutes');


const app = express();

app.use(cors());
app.use(express.json());

// Rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/perfiles', perfilRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/storage', storageRoutes);


module.exports = app;