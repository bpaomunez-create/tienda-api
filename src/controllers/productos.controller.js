const Producto = require('../models/producto.model');

const datosValidos = d => d.nombre && Number(d.precio) > 0;
const idValido = id => Number.isInteger(id) && id > 0;

async function listar(req, res) {
  try {
    res.status(200).json(await Producto.listar());
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno' });
  }
}

async function obtener(req, res) {
  try {
    const id = Number(req.params.id);
    if (!idValido(id)) return res.status(400).json({ mensaje: 'Id inválido' });
    const producto = await Producto.buscarPorId(id);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno' });
  }
}

async function crear(req, res) {
  try {
    const datos = req.body || {};
    if (!datosValidos(datos)) return res.status(400).json({ mensaje: 'Datos inválidos' });
    res.status(201).json(await Producto.crear(datos));
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno' });
  }
}

async function actualizar(req, res) {
  try {
    const id = Number(req.params.id);
    const datos = req.body || {};
    if (!idValido(id)) return res.status(400).json({ mensaje: 'Id inválido' });
    const existe = await Producto.buscarPorId(id);
    if (!existe) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    if (!datosValidos(datos)) return res.status(400).json({ mensaje: 'Datos inválidos' });
    res.status(200).json(await Producto.actualizar(id, datos));
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno' });
  }
}

async function eliminar(req, res) {
  try {
    const id = Number(req.params.id);
    if (!idValido(id)) return res.status(400).json({ mensaje: 'Id inválido' });
    const borrado = await Producto.eliminar(id);
    if (!borrado) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno' });
  }
}

module.exports = { listar, obtener, crear, actualizar, eliminar };