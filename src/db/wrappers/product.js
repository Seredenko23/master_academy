const { knex } = require('../index');
const { generateError } = require('../../services/error');
const { getType } = require('./type');
const { getColor } = require('./color');

async function createProduct(product) {
  try {
    if (!product.type) throw generateError('No product type defined', 'BadRequestError');
    if (!product.color) throw generateError('No product color defined', 'BadRequestError');

    const typeId = await getType(product.type);
    const colorId = await getColor(product.color);

    const timestamp = new Date();

    const modifiedProduct = { ...product };
    modifiedProduct.color = colorId.id;
    modifiedProduct.type = typeId.id;
    modifiedProduct.created_at = timestamp;
    modifiedProduct.updated_at = timestamp;

    const res = await knex('products').insert(modifiedProduct).returning('*');

    return res[0];
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function getProduct(id) {
  try {
    if (!id) throw generateError('No product id defined', 'BadRequestError');

    const res = await knex
      .select(['products.id', 'products.price', 'products.quantity', 'types.type', 'colors.color'])
      .from('products')
      .innerJoin('types', 'products.type', 'types.id')
      .innerJoin('colors', 'products.color', 'colors.id')
      .where('products.id', id);

    return res[0];
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

    const timestamp = new Date();

    product.color = colorId.id;
    product.type = typeId.id;
    product.updated_at = timestamp;

    if (!Object.entries(product).length)
      throw generateError('Nothing to update', 'BadRequestError');

    const res = await knex('products').update(product).where('id', id).returning('*');

    return res[0];
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function deleteProduct(id) {
  try {
    if (!id) throw generateError('No product id defined', 'BadRequestError');

    const timestamp = new Date();

    await knex('products').update({ deleted_at: timestamp }).where('id', id);

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

    const timestamp = new Date();
    const modifiedProduct = { ...product };
    modifiedProduct.color = colorId.id;
    modifiedProduct.type = typeId.id;
    modifiedProduct.updated_at = timestamp;

    console.log('modifiedProduct', modifiedProduct);

    const res = await knex('products')
      .update({ quantity: knex.raw('quantity + ??', [modifiedProduct.quantity]) })
      .where({
        price: modifiedProduct.price,
        color: modifiedProduct.color,
        type: modifiedProduct.type,
      })
      .returning('*');

    return res[0];
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}
module.exports = {
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  updateProductsByParams,
};
