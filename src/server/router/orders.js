const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { ordersController } = require('../controllers');

const orders = Router();

orders.get(
  '/get/:id',
  asyncHandler(async (req, res) => {
    await ordersController.getOrder(req, res);
  }),
);

orders.post(
  '/add_product',
  asyncHandler(async (req, res) => {
    await ordersController.addProduct(req, res);
  }),
);

orders.post(
  '/change_status',
  asyncHandler(async (req, res) => {
    await ordersController.changeStatus(req, res);
  }),
);

module.exports = orders;
