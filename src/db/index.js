const Knex = require('knex');
const { db: dbConfig } = require('../config');
const { generateError } = require('../services/error');

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

async function getColor(color) {
  try {
    if (!color) throw new Error('No color defined');

    const res = await knex('colors').where('color', color);

    if (!res[0]) throw new Error('No color defined in db');

    return res[0];
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function getType(type) {
  try {
    if (!type) throw new Error('No type defined');
    console.log('Type', type);
    const res = await knex('types').where('type', type);

    if (!res[0]) throw new Error('No type defined in db');

    return res[0];
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function createColor(color) {
  try {
    if (!color) throw new Error('No color defined');

    const res = await knex('colors').insert({ color }).returning('*');

    return res[0];
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function createType(type) {
  try {
    if (!type) throw new Error('No type defined');

    const res = await knex('types').insert({ type }).returning('*');

    return res[0];
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function deleteColor(id) {
  try {
    if (!id) throw new Error('No id defined');

    await knex('colors').where('id', id).del();

    return true;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function deleteType(id) {
  try {
    if (!id) throw new Error('No id defined');

    await knex('types').where('id', id).del();

    return true;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function updateColor(id, color) {
  try {
    if (!id) throw new Error('No id defined');

    const res = await knex('colors').update({ color }).where('id', id).returning('*');

    return res[0];
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function updateType(id, type) {
  try {
    if (!id) throw new Error('No id defined');

    const res = await knex('types').update({ type }).where('id', id).returning('*');

    return res[0];
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function getOrderById(orderId) {
  try {
    if (!orderId) throw generateError('No order id defined!', 'BadRequestError');

    const [order] = await knex('orders').select().where({ id: orderId });

    const productsInOrder = await knex
      .select([
        'products.id',
        'types.type',
        'colors.color',
        'products.price',
        'products.weight',
        'order_items.quantity',
      ])
      .from('order_items')
      .innerJoin('products', 'products.id', 'order_items.product_id')
      .innerJoin('types', 'products.type', 'types.id')
      .innerJoin('colors', 'products.color', 'colors.id')
      .where({ order_id: orderId });

    order.products = productsInOrder;
    return order;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function decreaseQuantity(id, quantity) {
  try {
    if (!id) throw generateError();
    const [res] = await knex('products')
      .update({ quantity: knex.raw(`quantity - ??`, [quantity]) })
      .where({ id })
      .andWhere('quantity', '>', quantity)
      .returning('quantity');

    if (!res) throw generateError('Nothing to update', 'BadRequestError');
    return res;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function increaseQuantity(id, quantity) {
  try {
    const [res] = await knex('products')
      .update({ quantity: knex.raw(`quantity + ??`, [quantity]) })
      .where({ id })
      .returning('quantity');

    if (!res) throw generateError('Nothing to update', 'BadRequestError');
    return res;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function createOrder() {
  try {
    const [res] = await knex('orders').insert({}).returning('id');

    return res;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function addProductToOrder(productId, orderId, quantity = 1) {
  try {
    if (!productId) throw generateError('NO product id defined!', 'BadRequestError');
    if (!orderId) orderId = await createOrder();

    const productQuantity = await decreaseQuantity(productId, quantity);
    if (!productQuantity) throw generateError('Not enough products!', 'BadRequestError');

    const [res] = await knex('order_items')
      .insert({
        order_id: orderId,
        product_id: productId,
        quantity,
      })
      .returning('order_id');

    return res;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function changeOrderStatus(orderId, status) {
  try {
    if (!orderId) throw generateError('NO order id defined!', 'BadRequestError');

    const res = await knex('orders').update({ status }).where({ id: orderId }).returning('*');

    if (!res) throw generateError('No such order in db!', 'BadRequestError');
    return res;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function cancelOrder(orderId) {
  try {
    if (!orderId) throw generateError('NO order id defined!', 'BadRequestError');
    const order = await getOrderById(orderId);

    await knex('orders').del().where({ id: orderId });

    await order.products.forEach(async (product) => {
      await increaseQuantity(product.id, product.quantity);
    });

    return true;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}
async function setCargoRoute(id, { from, to }) {
  try {
    if (!from || !to)
      throw generateError('City sender or city recipient is not defined', 'BadRequestError');

    await knex('orders').update({ from, to }).where({ id });

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
  addProductToOrder,
  changeOrderStatus,
  getOrderById,
  cancelOrder,
  setCargoRoute,
};
