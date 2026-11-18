const express = require('express');
const productosRoutes = require('./routes/productos.routes');
const authRoutes = require('./routes/auth.routes'); // <-- LÍNEA NUEVA

const app = express();
app.use(express.json());
app.use('/productos', productosRoutes);
app.use('/auth', authRoutes); // <-- LÍNEA NUEVA

module.exports = app;