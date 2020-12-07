const { task1: filter, task2: highestPrice, task3: modify } = require('../../services/task');
const { createProduct, getAllProducts } = require('../../db');

const store = [];
let isStore = false;

async function getSource() {
  return isStore ? store : getAllProducts();
}

async function getFilteredData(response, queryParams) {
  try {
    const { field, value } = queryParams;
    const data = await getSource();
    const filteredData = filter(data, field, value);
    response.send(filteredData);
  } catch (error) {
    throw new Error('Can`t get filtered products');
  }
}

async function getHighestPrice(response) {
  try {
    const data = await getSource();
    const highestPriceProduct = highestPrice(data);
    response.send(highestPriceProduct);
  } catch (error) {
    throw new Error('Can`t get highest price product');
  }
}

async function getModifyData(response) {
  try {
    const data = await getSource();
    response.send(modify(data));
  } catch (error) {
    throw new Error('Can`t get modified products');
  }
}

function notFound(response) {
  response.status(404).send('404 Not Found');
}

function swapSources(response) {
  isStore = !isStore;
  response.send(`Success`);
}

async function rewriteStore(response, data) {
  try {
    const normalizedData = modify(data);
    const res = normalizedData.map(async (product) => createProduct(product));
    response.send(await Promise.all(res));
  } catch (err) {
    throw new Error('Can`t create new products');
  }
}

module.exports = {
  getSource,
  getFilteredData,
  getHighestPrice,
  getModifyData,
  notFound,
  rewriteStore,
  swapSources,
};
