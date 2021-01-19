const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { ordersController } = require('../controllers');

const orders = Router();

orders.get(
  '/:id',
  asyncHandler((req, res) => ordersController.getOrder(req, res)),
);

orders.get(
  '/:id/delivery-price',
  asyncHandler((req, res) => ordersController.getPrice(req, res)),
);

orders.delete(
  '/:id/cancel',
  asyncHandler((req, res) => ordersController.cancel(req, res)),
);

orders.post(
  '/product',
  asyncHandler((req, res) => ordersController.addProduct(req, res)),
);

orders.post(
  '/status',
  asyncHandler((req, res) => ordersController.changeStatus(req, res)),
);

orders.post(
  '/route',
  asyncHandler((req, res) => ordersController.setRoute(req, res)),
);

module.exports = orders;
