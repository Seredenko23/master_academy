const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { productsControlelr } = require('../controllers');

const products = Router();

products.put(
  '/upload',
  asyncHandler(async (req, res) => {
    await productsControlelr.uploadCSVFile(req, res);
  }),
);

products.get(
  '/get_files',
  asyncHandler(async (req, res) => {
    await productsControlelr.getFiles(res);
  }),
);

products.get(
  '/upload/optimize',
  asyncHandler(async (req, res) => {
    await productsControlelr.optimizeFile(res, req.query);
  }),
);

module.exports = products;
