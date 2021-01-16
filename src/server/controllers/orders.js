const { getCitiesIds, calculateDeliveryPrice } = require('../../services/api');
const {
  addProductToOrder,
  changeOrderStatus,
  getOrderById,
  cancelOrder,
  setCargoRoute,
} = require('../../db/models/order');

async function addProduct(req, res) {
  const { orderId, productId, quantity = 1 } = req.body;

  const data = await addProductToOrder(productId, orderId, quantity);

  res.send({ orderId: data });
}

async function changeStatus(req, res) {
  const { orderId, status } = req.body;

  await changeOrderStatus(orderId, status);

  res.status(202).send();
}

async function getOrder(req, res) {
  const { id } = req.params;

  const data = await getOrderById(id);

  res.send(data);
}

async function cancel(req, res) {
  const { id } = req.params;

  await cancelOrder(id);

  res.status(202).send();
}

async function setRoute(req, res) {
  const { id, addresses } = req.body;

  await setCargoRoute(id, addresses);

  res.status(202).send();
}

async function getPrice(req, res) {
  try {
    const { id } = req.params;

    const order = await getOrderById(id);

    const { from, to, products } = order;

    const citiesId = await getCitiesIds({ from, to });

    const params = { totalWeight: 0, totalPrice: 0, from: citiesId[0], to: citiesId[1] };

    products.forEach((product) => {
      params.totalPrice += product.price * product.quantity;
      params.totalWeight += product.weight * product.quantity;
    });

    const deliveryPrice = await calculateDeliveryPrice(params);

    res.send({ deliveryPrice });
  } catch (err) {
    console.log(err.message || err);
    throw err;
  }
}

module.exports = { addProduct, changeStatus, getOrder, cancel, setRoute, getPrice };
