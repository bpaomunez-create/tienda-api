const pool = require('../config/db.js');

const crearPedido = async (clienteId, detalles) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Crear la cabecera del pedido (total en 0 por ahora)
    const resPedido = await client.query(
      'INSERT INTO pedidos (cliente_id, total) VALUES ($1, 0) RETURNING id',
      [clienteId]
    );
    const pedidoId = resPedido.rows[0].id;

    let totalCalculado = 0;

    // 2. Insertar cada detalle y calcular subtotales
    for (const item of detalles) {
      // Obtener el precio real del producto desde la BD (NUNCA del body)
      const resProducto = await client.query(
        'SELECT precio FROM productos WHERE id = $1',
        [item.producto_id]
      );
      
      if (resProducto.rows.length === 0) {
        throw new Error(`Producto con id ${item.producto_id} no encontrado`);
      }

      const precioUnitario = resProducto.rows[0].precio;
      const subtotal = precioUnitario * item.cantidad;
      totalCalculado += subtotal;

      await client.query(
        `INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario, subtotal) 
         VALUES ($1, $2, $3, $4, $5)`,
        [pedidoId, item.producto_id, item.cantidad, precioUnitario, subtotal]
      );
    }

    // 3. Actualizar el total en la cabecera
    await client.query(
      'UPDATE pedidos SET total = $1 WHERE id = $2',
      [totalCalculado, pedidoId]
    );

    await client.query('COMMIT');
    return { pedidoId, total: totalCalculado };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const obtenerPedidosPorCliente = async (clienteId) => {
  const query = 'SELECT * FROM pedidos WHERE cliente_id = $1 ORDER BY fecha DESC';
  const { rows } = await pool.query(query, [clienteId]);
  return rows;
};

const obtenerPedidoPorId = async (pedidoId, clienteId) => {
  // Esta consulta asegura que el pedido pertenezca al cliente
  const query = 'SELECT * FROM pedidos WHERE id = $1 AND cliente_id = $2';
  const { rows } = await pool.query(query, [pedidoId, clienteId]);
  
  if (rows.length === 0) return null;

  // Obtener los detalles (JOIN con productos para mostrar el nombre)
  const queryDetalle = `
    SELECT dp.id, dp.producto_id, p.nombre AS producto_nombre, dp.cantidad, dp.precio_unitario, dp.subtotal
    FROM detalle_pedido dp
    JOIN productos p ON dp.producto_id = p.id
    WHERE dp.pedido_id = $1
  `;
  const resDetalle = await pool.query(queryDetalle, [pedidoId]);
  
  return { ...rows[0], detalles: resDetalle.rows };
};

module.exports = { crearPedido, obtenerPedidosPorCliente, obtenerPedidoPorId };