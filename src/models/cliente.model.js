const pool = require('../config/db.js');

const crearCliente = async (nombre, email, passwordHash, rol = 'cliente') => {
  const query = `
    INSERT INTO clientes (nombre, email, password, rol)
    VALUES ($1, $2, $3, $4)
    RETURNING id, nombre, email, rol, activo, creado_en
  `;
  const { rows } = await pool.query(query, [nombre, email, passwordHash, rol]);
  return rows[0];
};

const buscarPorEmail = async (email) => {
  const query = `SELECT * FROM clientes WHERE email = $1`;
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};

const obtenerClientePorId = async (id) => {
  const query = `
    SELECT id, nombre, email, rol, activo, creado_en
    FROM clientes WHERE id = $1
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

module.exports = { crearCliente, buscarPorEmail, obtenerClientePorId };