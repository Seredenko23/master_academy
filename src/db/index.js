const { Pool } = require('pg');
const { db: dbConfig } = require('../config');

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
    if (!type) throw new Error('No product type defined');
    if (!color) throw new Error('No product color defined');
    const timestamp = new Date();

    const res = await client.query(
      'INSERT INTO products(type, color, price, quantity, created_at, updated_at, deleted_at) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [type, color, price, quantity, timestamp, timestamp, null],
    );

    return res.rows[0];
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function getProduct(id) {
  try {
    if (!id) throw new Error('No product id defined');

    const res = await client.query('SELECT * FROM products WHERE id = $1 AND deleted_at IS NULL', [
      id,
    ]);

    return res.rows[0];
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function updateProduct({ id, ...product }) {
  try {
    if (!id) throw new Error('No product id defined');

    const query = [];
    const values = [];

    Object.entries(product).forEach((productData, index) => {
      query.push(`${productData[0]} = ${index + 1}`);
      values.push(productData[1]);
    });

    if (!values.length) throw new Error('Nothing to update');

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
    if (!id) throw new Error('No product id defined');

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
    const res = await client.query(`SELECT * FROM products WHERE deleted_at IS NULL`);

    return res.rows;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function getProductsByParams(product) {
  try {
    const { quantity, price, color, type } = product;
    const res = await client.query(
      `UPDATE products SET quantity = quantity + $1 WHERE price = $2 AND color = $3 AND type = $4 RETURNING *`,
      [quantity, price, color, type],
    );

    return res.rows[0];
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
  getProductsByParams,
};
