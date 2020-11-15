const fs = require('fs');
const path = require('path');
const { repeatPromiseUntilResolved, defineAmountOfSales } = require('./utils');
const { getSale, getSalePromisified } = require('./sales');
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

function getSalesCallbacks(response) {
  const data = getSource();
  const newData = [];
  data.forEach((prod) => getSale(callback, prod));
  return newData;

  function callback3(newData) {
    if (newData.length !== data.length) return;
    console.log(newData);
    response.write(JSON.stringify(newData));
    response.end();
  }

  function callback2(value, product) {
    product.sale = value;
    newData.push(product);
    callback3(newData);
  }

  function callback(err, value, product) {
    if (err) return getSale(callback, product);
    callback2(value, product);
  }
}

function getSalesPromise(response) {
  const data = getSource().myMap((product) => {
    const amount = defineAmountOfSales(product);
    const sales = [];
    for (let i = 0; i < amount; i++) sales.push(repeatPromiseUntilResolved(getSalePromisified));
    return Promise.all(sales).then((sales) => {
      product.sale = sales.map((sale) => (100 - sale) / 100).reduce((acc, red) => acc * red);
      return product;
    });
  });
  Promise.all(data).then((result) => {
    response.write(JSON.stringify(result));
    response.end();
  });
}

async function getSalesAsync(response) {
  let data = getSource();
  data = data.myMap(async (product) => {
    const amount = defineAmountOfSales(product);
    let sales = [];
    for (let i = 0; i < amount; i++) sales.push(repeatPromiseUntilResolved(getSalePromisified));
    sales = await Promise.all(sales);
    sales = sales.map((sale) => (100 - sale) / 100).reduce((acc, red) => acc * red);
    product.sale = sales;
    return product;
  });
  data = await Promise.all(data);
  response.write(JSON.stringify(data));
  response.end();
}

module.exports = {
  getFilteredData,
  getHighestPrice,
  getModifyData,
  notFound,
  rewriteStore,
  swapSources,
  getSalesAsync,
  getSalesPromise,
  getSalesCallbacks,
};
