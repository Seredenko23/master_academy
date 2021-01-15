const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { ordersController } = require('../controllers');

const orders = Router();

orders.get(
  '/:id',
  asyncHandler(async (req, res) => ordersController.getOrder(req, res)),
);

orders.get(
  '/:id/delivery-price',
  asyncHandler(async (req, res) => ordersController.getPrice(req, res)),
);

orders.delete(
  '/:id/cancel',
  asyncHandler(async (req, res) => ordersController.cancel(req, res)),
);

orders.post(
  '/add-product',
  asyncHandler(async (req, res) => ordersController.addProduct(req, res)),
);

orders.post(
  '/status',
  asyncHandler(async (req, res) => ordersController.changeStatus(req, res)),
);

orders.post(
  '/route',
  asyncHandler(async (req, res) => ordersController.setRoute(req, res)),
);

module.exports = orders;
