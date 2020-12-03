const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { getSalesCallbacks, getSalesPromise, getSalesAsync } = require('../controllers/sales');

const sales = Router();

sales.get('/sales_callbacks', (req, res) => {
  getSalesCallbacks(res);
});

sales.get('/sales_promise', (req, res) => {
  getSalesPromise(res);
});

sales.get(
  '/sales_async',
  asyncHandler(async (req, res) => {
    await getSalesAsync(res);
  }),
);

module.exports = sales;
