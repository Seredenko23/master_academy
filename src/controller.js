const fs = require('fs');
const path = require('path');
const { task1: filter, task2: highestPrice, task3: modify } = require('./task');
const json = require('../data.json');

let store = [];
let isStore = false;

function getSource() {
  return isStore ? store : json;
}

function getFilteredData(response, queryParams) {
  const { field, value } = queryParams;
  response.write(JSON.stringify(filter(getSource(), field, value)));
  response.end();
}

function getHighestPrice(response) {
  const highestPriceProduct = highestPrice(getSource());
  response.write(JSON.stringify(highestPriceProduct));
  response.end();
}

function getModifyData(response) {
  response.write(JSON.stringify(modify(getSource())));
  response.end();
}

function notFound(response) {
  response.write('404 Not Found');
  response.statusCode = 404;
  response.end();
}

function swapSources(response) {
  isStore = !isStore;
  response.write(`Success`);
  response.end();
}

function rewriteStore(response, data) {
  if (isStore) {
    store = data;
  } else {
    console.log(__dirname);
    fs.writeFileSync(path.resolve(`${__dirname}../../`, 'data.json'), JSON.stringify(data));
  }
  response.write(JSON.stringify(getSource()));
  response.end();
}

module.exports = {
  getFilteredData,
  getHighestPrice,
  getModifyData,
  notFound,
  rewriteStore,
  swapSources,
};
