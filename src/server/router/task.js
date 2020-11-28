const { Router } = require('express');
const {
  getFilteredData,
  getHighestPrice,
  getModifyData,
  swapSources,
  rewriteStore,
} = require('../controllers/task');

const task = Router();

task.get('/filter', (req, res) => {
  getFilteredData(res, req.query);
});

task.get('/highest_price', (req, res) => {
  getHighestPrice(res);
});

task.get('/modify', (req, res) => {
  getModifyData(res);
});

task.get('/swap', (req, res) => {
  swapSources(res);
});

task.post('/rewrite', (req, res) => {
  rewriteStore(res, req.body);
});

module.exports = task;
