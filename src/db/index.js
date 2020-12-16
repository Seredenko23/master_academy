const { Pool } = require('pg');
const { db: dbConfig } = require('../config');
const { generateError } = require('../services/error');

const client = new Pool(dbConfig);

async function testConnection() {
  try {
    console.log('Test connection to database...');
    await client.query('SELECT NOW()');
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function closeDatabase() {
  console.log('Stoping database...');
  client.end();
}

async function createProduct({ type, color, price = 0, quantity = 1 }) {
  try {
    if (!type) throw generateError('No product type defined', 'BadRequestError');
    if (!color) throw generateError('No product color defined', 'BadRequestError');

    const colorId = await getColor(color);
    const typeId = await getType(type);

    const timestamp = new Date();

    const res = await client.query(
      'INSERT INTO products(type, color, price, quantity, created_at, updated_at, deleted_at) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [typeId.id, colorId.id, price, quantity, timestamp, timestamp, null],
    );

    return res.rows[0];
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function getProduct(id) {
  try {
    if (!id) throw generateError('No product id defined', 'BadRequestError');

    const res = await client.query(
      `SELECT products.id, products.price, products.quantity, types.type, colors.color FROM products INNER JOIN types ON (products.type = types.id) INNER JOIN colors ON (products.color = colors.id) WHERE products.id = $1`,
      [id],
    );

    return res.rows[0];
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function updateProduct({ id, ...product }) {
  try {
    if (!id) throw generateError('No product id defined', 'BadRequestError');

    const colorId = await getColor(product.color);
    const typeId = await getType(product.type);

    product.color = colorId.id;
    product.type = typeId.id;

    const query = [];
    const values = [];

    Object.entries(product).forEach((productData, index) => {
      query.push(`${productData[0]} = ${index + 1}`);
      values.push(productData[1]);
    });

    if (!values.length) throw generateError('Nothing to update', 'BadRequestError');

    const res = await client.query(
      `UPDATE products SET ${query.join(',')} WHERE id = $${values.length} RETURNING *`,
      values,
    );

    return res.rows[0];
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function deleteProduct(id) {
  try {
    if (!id) throw generateError('No product id defined', 'BadRequestError');

    const timestamp = new Date();

    await client.query(`UPDATE products SET deleted_at = $1 WHERE id = $2`, [timestamp, id]);

    return true;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function getAllProducts() {
  try {
    const res = await client.query(
      `SELECT products.id, products.price, products.quantity, types.type, colors.color FROM products INNER JOIN types ON (products.type = types.id) INNER JOIN colors ON (products.color = colors.id) WHERE deleted_at IS NULL`,
    );

    return res.rows;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function updateProductsByParams(product) {
  try {
    const { quantity, price, color, type } = product;

    const colorId = await getColor(color);
    const typeId = await getType(type);

    const res = await client.query(
      `UPDATE products SET quantity = quantity + $1 WHERE price = $2 AND color = $3 AND type = $4 RETURNING *`,
      [quantity, price, colorId.id, typeId.id],
    );

    return res.rows[0];
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function getColor(color) {
  try {
    if (!color) throw new Error('No color defined');

    const res = await client.query(`SELECT * FROM colors WHERE color = $1`, [color]);

    if (!res.rows[0]) throw new Error('No type defined in db');

    return res.rows[0];
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function getType(type) {
  try {
    if (!type) throw new Error('No type defined');

    const res = await client.query(`SELECT * FROM types WHERE type = $1`, [type]);

    if (!res.rows[0]) throw new Error('No type defined in db');

    return res.rows[0];
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function createColor(color) {
  try {
    if (!color) throw new Error('No color defined');

    const res = await client.query(`INSERT INTO colors(color) VALUES($1) RETURNING *`, [color]);

    return res.rows[0];
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function createType(type) {
  try {
    if (!type) throw new Error('No type defined');

    const res = await client.query(`INSERT INTO type(type) VALUES($1) RETURNING *`, [type]);

    return res.rows[0];
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function deleteColor(id) {
  try {
    if (!id) throw new Error('No id defined');

    await client.query(`DELETE FROM colors WHERE id = $1`, [id]);

    return true;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function deleteType(id) {
  try {
    if (!id) throw new Error('No id defined');

    await client.query(`DELETE FROM types WHERE id = $1`, [id]);

    return true;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function updateColor(id, color) {
  try {
    if (!id) throw new Error('No id defined');

    await client.query(`UPDATE colors SET color = $1 WHERE id = $2`, [color, id]);

    return true;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function updateType(id, type) {
  try {
    if (!id) throw new Error('No id defined');

    await client.query(`UPDATE types SET type = $1 WHERE id = $2`, [type, id]);

    return true;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

module.exports = {
  testConnection,
  closeDatabase,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  updateProductsByParams,
};
