const { Router } = require('express');
const { uploadCSV, getFiles, optimizeFile } = require('../controllers/products');

const products = Router();

products.put('/upload', async (req, res) => {
  console.log(req.headers);
  if (req.headers['content-type'] !== 'application/gzip') throw new Error('Wrong file!');
  try {
    await uploadCSV(req, res);
  } catch (err) {
    console.log('Failed to load CSV', err);
    res.statusCode = 500;
    res.write(JSON.stringify({ status: 'error' }));
    res.end();
  }
});

products.get('/get_files', (req, res) => {
  getFiles(res);
});

products.get('/upload/optimize', (req, res) => {
  optimizeFile(res, req.query);
});

module.exports = products;
