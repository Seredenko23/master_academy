const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { salesController } = require('../controllers/sales');

const sales = Router();

sales.get('/sales_callbacks', (req, res) => {
  salesController.getSalesCallbacks(res);
});

sales.get('/sales_promise', (req, res) => {
  salesController.getSalesPromise(res);
});

sales.get(
  '/sales_async',
  asyncHandler(async (req, res) => {
    await salesController.getSalesAsync(res);
  }),
);

module.exports = sales;
