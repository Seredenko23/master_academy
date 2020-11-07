const {
  task1: filterProducts,
  task2: highestPriceProduct,
  task3: modifyProducts,
} = require('./task');
const json = require('../data.json');

function boot(products, param, value) {
  const filteredProducts = filterProducts(products, param, value);
  console.log('Task1: ', filteredProducts);
  const modifiedProducts = modifyProducts(filteredProducts);
  console.log('Task2: ', modifiedProducts);
  console.log('Task3: ', highestPriceProduct);
}

boot(json, 'type', 'socks');
