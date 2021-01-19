const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { productsController } = require('../controllers');

const products = Router();

products.put(
  '/upload',
  asyncHandler((req, res) => productsController.uploadCSVFile(req, res)),
);

products.delete(
  '/:id',
  asyncHandler((req, res) => productsController.deleteProductFromDB(req, res)),
);

products.get(
  '/:id',
  asyncHandler((req, res) => productsController.getProductFromDB(req, res)),
);

module.exports = products;
