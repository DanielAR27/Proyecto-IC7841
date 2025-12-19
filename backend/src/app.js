const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const perfilRoutes = require('./routes/perfilRoutes');
const categoriasRoutes = require('./routes/categoriasRoutes');


const app = express();

app.use(cors());
app.use(express.json());

// Rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/perfiles', perfilRoutes);
app.use('/api/categorias', categoriasRoutes);


module.exports = app;