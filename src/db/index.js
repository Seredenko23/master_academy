const Knex = require('knex');
const { db: dbConfig } = require('../config');
const { generateError } = require('../services/error');

console.log('CONFIG', dbConfig);
const knex = new Knex(dbConfig);

async function testConnection() {
  try {
    console.log('Test connection to database...');
    await knex.raw('SELECT NOW()');
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function closeDatabase() {
  console.log('Stoping database...');
}

async function createProduct(product) {
  try {
    if (!product.type) throw generateError('No product type defined', 'BadRequestError');
    if (!product.color) throw generateError('No product color defined', 'BadRequestError');

    const typeId = await getType(product.type);
    const colorId = await getColor(product.color);

    const modifiedProduct = { ...product };
    modifiedProduct.color = colorId.id;
    modifiedProduct.type = typeId.id;

    const [res] = await knex('products').insert(modifiedProduct).returning('*');

    return res;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function getProduct(id) {
  try {
    if (!id) throw generateError('No product id defined', 'BadRequestError');

    const [res] = await knex
      .select(['products.id', 'products.price', 'products.quantity', 'types.type', 'colors.color'])
      .from('products')
      .innerJoin('types', 'products.type', 'types.id')
      .innerJoin('colors', 'products.color', 'colors.id')
      .where('products.id', id);

    return res;
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

    if (!Object.entries(product).length)
      throw generateError('Nothing to update', 'BadRequestError');

    const [res] = await knex('products').update(product).where({ id }).returning('*');

    return res;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function deleteProduct(id) {
  try {
    if (!id) throw generateError('No product id defined', 'BadRequestError');

    const timestamp = new Date();

    await knex('products').update({ deleted_at: timestamp }).where({ id });

    return true;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function getAllProducts() {
  try {
    const res = await knex
      .select(['products.id', 'products.price', 'products.quantity', 'types.type', 'colors.color'])
      .from('products')
      .innerJoin('types', 'products.type', 'types.id')
      .innerJoin('colors', 'products.color', 'colors.id');

    return res;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function updateProductsByParams(product) {
  try {
    const colorId = await getColor(product.color);
    const typeId = await getType(product.type);

    const modifiedProduct = { ...product };
    modifiedProduct.color = colorId.id;
    modifiedProduct.type = typeId.id;

    console.log('modifiedProduct', modifiedProduct);

    const [res] = await knex('products')
      .update({ quantity: knex.raw('quantity + ??', [modifiedProduct.quantity]) })
      .where({
        price: modifiedProduct.price,
        color: modifiedProduct.color,
        type: modifiedProduct.type,
      })
      .returning('*');

    return res;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function getColor(color) {
  try {
    if (!color) throw generateError('No color defined', 'BadRequestError');

    const [res] = await knex('colors').where({ color });

    if (!res) throw new Error('No color defined in db');

    return res;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function getType(type) {
  try {
    if (!type) throw generateError('No type defined', 'BadRequestError');
    console.log('Type', type);
    const [res] = await knex('types').where({ type });

    if (!res) throw new Error('No type defined in db');

    return res;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function createColor(color) {
  try {
    if (!color) throw generateError('No color defined', 'BadRequestError');

    const [res] = await knex('colors').insert({ color }).returning('*');

    return res;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function createType(type) {
  try {
    if (!type) throw generateError('No type defined', 'BadRequestError');

    const [res] = await knex('types').insert({ type }).returning('*');

    return res;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function deleteColor(id) {
  try {
    if (!id) throw generateError('No color id defined', 'BadRequestError');

    await knex('colors').where({ id }).del();

    return true;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function deleteType(id) {
  try {
    if (!id) throw generateError('No type id defined', 'BadRequestError');

    await knex('types').where({ id }).del();

    return true;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function updateColor(id, color) {
  try {
    if (!id) throw generateError('No color id defined', 'BadRequestError');

    const [res] = await knex('colors').update({ color }).where({ id }).returning('*');

    return res;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function updateType(id, type) {
  try {
    if (!id) throw generateError('No type id defined', 'BadRequestError');

    const [res] = await knex('types').update({ type }).where({ id }).returning('*');

    return res;
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
