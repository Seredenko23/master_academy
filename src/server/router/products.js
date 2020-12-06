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

products.get(
  '/get_files',
  asyncHandler(async (req, res) => {
    await productsController.getFiles(res);
  }),
);

products.get(
  '/upload/optimize',
  asyncHandler(async (req, res) => {
    await productsController.optimizeFile(res, req.query);
  }),
);

module.exports = products;
