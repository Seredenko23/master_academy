/* eslint-disable prefer-const */
const { getCitiesIds, calculateDeliveryPrice } = require('../../services/api');
const {
  addProductToOrder,
  changeOrderStatus,
  getOrderById,
  cancelOrder,
  setCargoRoute,
} = require('../../db/index');

async function addProduct(req, res) {
  let { orderId, productId, quantity = 1 } = req.body;

  const data = await addProductToOrder(productId, orderId, quantity);

  res.send({ orderId: data });
}

async function changeStatus(req, res) {
  let { orderId, status } = req.body;

  await changeOrderStatus(orderId, status);

  res.status(202).send();
}

async function getOrder(req, res) {
  let { id } = req.params;

  let data = await getOrderById(id);

  res.send(data);
}

async function cancel(req, res) {
  let { id } = req.params;

  await cancelOrder(id);

  res.status(202).send();
}

async function setRoute(req, res) {
  let { id, addresses } = req.body;

  await setCargoRoute(id, addresses);

  res.status(202).send();
}

async function getPrice(req, res) {
  try {
    let { id } = req.params;

    let order = await getOrderById(id);

    let { from, to, products } = order;

    let citiesId = await getCitiesIds({ from, to });

    let params = { totalWeight: 0, totalPrice: 0, from: citiesId[0], to: citiesId[1] };

    products.forEach((product) => {
      params.totalPrice += product.price * product.quantity;
      params.totalWeight += product.weight * product.quantity;
    });

    let deliveryPrice = await calculateDeliveryPrice(params);

    res.send({ deliveryPrice });
  } catch (err) {
    console.log(err.message || err);
    throw err;
  }
}

module.exports = { addProduct, changeStatus, getOrder, cancel, setRoute, getPrice };
