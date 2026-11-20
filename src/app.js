const express = require('express');
const productosRoutes = require('./routes/productos.routes');
const authRoutes = require('./routes/auth.routes'); 
const pedidoRoutes = require('./routes/pedido.routes'); 

const app = express();
app.use(express.json()); 

app.use('/pedidos', pedidoRoutes);
app.use('/productos', productosRoutes);
app.use('/auth', authRoutes); 

module.exports = app;