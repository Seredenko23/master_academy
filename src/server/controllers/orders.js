/* eslint-disable prefer-const */
const { generateError } = require('../../services/error');
const { addProductToOrder, changeOrderStatus, getOrderById } = require('../../db/index');

async function addProduct(req, res) {
  try {
    let { orderId, productId, quantity = 1 } = req.body;

    const data = await addProductToOrder(productId, orderId, quantity);

    res.send({ orderId: data });
  } catch (error) {
    throw generateError('Can`t add product to order');
  }
}

async function changeStatus(req, res) {
  try {
    let { orderId, status } = req.body;

    await changeOrderStatus(orderId, status);

    res.status(202).send();
  } catch (err) {
    throw generateError('Can`t change status of order');
  }
}

async function getOrder(req, res) {
  try {
    let { id } = req.params;

    let data = await getOrderById(id);

    res.send(data);
  } catch (err) {
    throw generateError('Can`t get order!');
  }
}

module.exports = { addProduct, changeStatus, getOrder };
