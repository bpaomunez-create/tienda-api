const { crearPedido, obtenerPedidosPorCliente, obtenerPedidoPorId } = require('../models/pedido.model.js');

// POST /pedidos
const crear = async (req, res) => {
  try {
    const clienteId = req.usuario.id; // Dueño SIEMPRE del token
    const { detalles } = req.body;

    if (!detalles || !Array.isArray(detalles) || detalles.length === 0) {
      return res.status(400).json({ mensaje: 'Debe enviar una lista de productos (detalles)' });
    }

    const resultado = await crearPedido(clienteId, detalles);
    
    return res.status(201).json({ 
      mensaje: 'Pedido creado exitosamente', 
      pedido_id: resultado.pedidoId,
      total: resultado.total
    });
  } catch (error) {
    console.error(error);
    if (error.message.includes('no encontrado')) {
      return res.status(400).json({ mensaje: error.message });
    }
    return res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// GET /pedidos
const listar = async (req, res) => {
  try {
    const clienteId = req.usuario.id;
    const pedidos = await obtenerPedidosPorCliente(clienteId);
    return res.status(200).json({ pedidos });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// GET /pedidos/:id
const obtener = async (req, res) => {
  try {
    const clienteId = req.usuario.id;
    const pedidoId = req.params.id;

    const pedido = await obtenerPedidoPorId(pedidoId, clienteId);
    
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }

    return res.status(200).json({ pedido });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

module.exports = { crear, listar, obtener };