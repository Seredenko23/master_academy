const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { uploadCSVFile, getFiles, optimizeFile } = require('../controllers/products');

const products = Router();

products.put(
  '/upload',
  asyncHandler(async (req, res) => {
    await uploadCSVFile(req, res);
  }),
);

products.get(
  '/get_files',
  asyncHandler(async (req, res) => {
    await getFiles(res);
  }),
);

products.get(
  '/upload/optimize',
  asyncHandler(async (req, res) => {
    await optimizeFile(res, req.query);
  }),
);

module.exports = products;
