const { Router } = require('express');
const ctl = require('../controllers/productos.controller');
const { verificarToken } = require('../middlewares/auth.middleware'); // <-- LÍNEA NUEVA

const router = Router();
router.get('/', ctl.listar); // Pública
router.get('/:id', ctl.obtener); // Pública
router.post('/', verificarToken, ctl.crear); // <-- PROTEGIDA
router.put('/:id', verificarToken, ctl.actualizar); // <-- PROTEGIDA
router.delete('/:id', verificarToken, ctl.eliminar); // <-- PROTEGIDA

module.exports = router;