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

products.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await productsController.deleteProductFromDB(req, res);
  }),
);

products.get(
  '/:id',
  asyncHandler(async (req, res) => {
    await productsController.getProductFromDB(req, res);
  }),
);

module.exports = products;
