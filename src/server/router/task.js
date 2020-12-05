const { Router } = require('express');
const { taskController } = require('../controllers/task');

const task = Router();

task.get('/filter', (req, res) => {
  taskController.getFilteredData(res, req.query);
});

task.get('/highest_price', (req, res) => {
  taskController.getHighestPrice(res);
});

task.get('/modify', (req, res) => {
  taskController.getModifyData(res);
});

task.get('/swap', (req, res) => {
  taskController.swapSources(res);
});

task.post('/rewrite', (req, res) => {
  taskController.rewriteStore(res, req.body);
});

module.exports = task;
