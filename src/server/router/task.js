const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { taskController } = require('../controllers');

const task = Router();

task.get(
  '/filter',
  asyncHandler(async (req, res) => {
    await taskController.getFilteredData(res, req.query);
  }),
);

task.get(
  '/highest_price',
  asyncHandler(async (req, res) => {
    await taskController.getHighestPrice(res);
  }),
);

task.get(
  '/modify',
  asyncHandler(async (req, res) => {
    await taskController.getModifyData(res);
  }),
);

task.get('/swap', (req, res) => {
  taskController.swapSources(res);
});

task.post(
  '/rewrite',
  asyncHandler(async (req, res) => {
    await taskController.rewriteStore(res, req.body);
  }),
);

module.exports = task;
