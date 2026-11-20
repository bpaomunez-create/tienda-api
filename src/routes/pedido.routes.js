const { Router } = require('express');
const ctl = require('../controllers/pedido.controller.js');
const { verificarToken } = require('../middlewares/auth.middleware.js');

const router = Router();

// Las 3 rutas protegidas con el middleware
router.post('/', verificarToken, ctl.crear);
router.get('/', verificarToken, ctl.listar);
router.get('/:id', verificarToken, ctl.obtener);

module.exports = router;