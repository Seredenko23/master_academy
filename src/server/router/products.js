const { Router } = require('express');
const { uploadCSVFile, getFiles, optimizeFile } = require('../controllers/products');

const products = Router();

products.put('/upload', async (req, res) => {
  await uploadCSVFile(req, res);
});

products.get('/get_files', (req, res) => {
  getFiles(res);
});

products.get('/upload/optimize', (req, res) => {
  optimizeFile(res, req.query);
});

module.exports = products;
