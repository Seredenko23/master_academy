const { knex } = require('../index');
const { generateError } = require('../../services/error');

async function getOrderById(id) {
  try {
    if (!id) throw generateError('No order id defined!', 'BadRequestError');

    const [order] = await knex('orders').select().where({ id });

    if (!order) throw generateError('Invalid id!', 'BadRequestError');

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
      .where({ order_id: id });

    order.products = productsInOrder;
    return order;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function changeQuantity(id, quantity) {
  try {
    if (!id) throw generateError('No id defined', 'BadRequestError');
    const [res] = await knex('products').select('quantity').where({ id });
    let { quantity: originalQuantity } = res;

    originalQuantity += quantity;

    if (originalQuantity <= 0) throw generateError('Not enough products!', 'BadRequestError');

    const [changedQuantity] = await knex('products')
      .update({ quantity })
      .where({ id })
      .returning('quantity');

    if (!res) throw generateError('Nothing to update', 'BadRequestError');
    return changedQuantity;
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

    const promises = order.products.map((product) => changeQuantity(product.id, product.quantity));

    Promise.all(promises);

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
  addProductToOrder,
  changeOrderStatus,
  getOrderById,
  createOrder,
  cancelOrder,
  setCargoRoute,
  changeQuantity,
};
