const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { ordersController } = require('../controllers');

const orders = Router();

orders.get(
  '/:id',
  asyncHandler(async (req, res) => {
    await ordersController.getOrder(req, res);
  }),
);

orders.get(
  '/:id/delivery-price',
  asyncHandler(async (req, res) => {
    await ordersController.getPrice(req, res);
  }),
);

orders.delete(
  '/:id/cancel',
  asyncHandler(async (req, res) => {
    await ordersController.cancel(req, res);
  }),
);

orders.post(
  '/add-product',
  asyncHandler(async (req, res) => {
    await ordersController.addProduct(req, res);
  }),
);

orders.post(
  '/status',
  asyncHandler(async (req, res) => {
    await ordersController.changeStatus(req, res);
  }),
);

orders.post(
  '/route',
  asyncHandler(async (req, res) => {
    await ordersController.setRoute(req, res);
  }),
);

module.exports = orders;
