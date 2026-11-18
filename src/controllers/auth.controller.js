const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { crearCliente, buscarPorEmail } = require('../models/cliente.model.js');

const registro = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ mensaje: 'Nombre, email y password son obligatorios' });
    }
    if (password.length < 8) {
      return res.status(400).json({ mensaje: 'La clave debe tener al menos 8 caracteres' });
    }

    const existe = await buscarPorEmail(email);
    if (existe) {
      return res.status(409).json({ mensaje: 'El email ya está registrado' });
    }

    const hash = await bcrypt.hash(password, 10);
    const cliente = await crearCliente(nombre, email, hash);

    return res.status(201).json({ mensaje: 'Cliente registrado correctamente', cliente });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const cliente = await buscarPorEmail(email);
    if (!cliente) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const coincide = await bcrypt.compare(password, cliente.password);
    if (!coincide) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: cliente.id, rol: cliente.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    return res.status(200).json({ mensaje: 'Login exitoso', token, cliente });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

module.exports = { registro, login };