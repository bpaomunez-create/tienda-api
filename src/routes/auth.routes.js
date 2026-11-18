const express = require('express');
const router = express.Router();
const { registro, login } = require('../controllers/auth.controller.js');
const { verificarToken } = require('../middlewares/auth.middleware.js');
const { obtenerClientePorId } = require('../models/cliente.model.js');

router.post('/registro', registro);
router.post('/login', login);

router.get('/perfil', verificarToken, async (req, res) => {
  try {
    const cliente = await obtenerClientePorId(req.usuario.id);
    if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    return res.status(200).json({ cliente });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

module.exports = router;