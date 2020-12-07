const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { productsController } = require('../controllers');

const products = Router();

products.put(
  '/upload',
  asyncHandler(async (req, res) => {
    await productsController.uploadCSVFile(req, res);
  }),
);

module.exports = products;
