const productsController = require('./products');
const salesController = require('./sales');
const taskController = require('./task');
const authorizationController = require('./authorization');
const ordersController = require('./orders');

module.exports = {
  taskController,
  salesController,
  productsController,
  authorizationController,
  ordersController,
};
