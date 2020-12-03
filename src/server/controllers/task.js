const fs = require('fs');
const path = require('path');
const { task1: filter, task2: highestPrice, task3: modify } = require('../../services/task');
const json = require('../../../data.json');

let store = [];
let isStore = false;

function getSource() {
  return isStore ? store : json;
}

function getFilteredData(response, queryParams) {
  const { field, value } = queryParams;
  const filteredData = filter(getSource(), field, value);
  response.send(filteredData);
}

function getHighestPrice(response) {
  const highestPriceProduct = highestPrice(getSource());
  response.send(highestPriceProduct);
}

function getModifyData(response) {
  response.send(modify(getSource()));
}

function notFound(response) {
  response.status(404).send('404 Not Found');
}

function swapSources(response) {
  isStore = !isStore;
  response.send(`Success`);
}

function rewriteStore(response, data) {
  console.log(data);
  if (isStore) {
    store = data;
  } else {
    console.log(__dirname);
    fs.writeFileSync(path.resolve(`${__dirname}../../../../`, 'data.json'), JSON.stringify(data));
  }
  response.send(getSource());
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
