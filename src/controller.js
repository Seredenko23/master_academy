const fs = require('fs');
const path = require('path');
const { createInterface } = require('readline');
const { createGunzip } = require('zlib');
const {
  repeatPromiseUntilResolved,
  defineAmountOfSales,
  transformCsvToJson,
  promisifiedPipeline,
  promisifiedReaddir,
} = require('./utils');
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
  const newSales = [];
  data.myMap((prod) => getSale(callback, prod));

  function callback(err, value, product) {
    if (err) {
      getSale(callback, product);
      return;
    }

    const limit = defineAmountOfSales(product);
    if (Array.isArray(product.sale)) product.sale.push(value);
    else product.sale = [value];

    if (Array.isArray(product.sale) && product.sale.length === limit) {
      product.sale = product.sale.map((sale) => (100 - sale) / 100).reduce((acc, red) => acc * red);
      newSales.push(product);
    } else {
      getSale(callback, product);
    }

    if (newSales.length !== data.length) return;
    response.write(JSON.stringify(newSales));
    response.end();
  }
}

function getSalesPromise(response) {
  const data = getSource().myMap((product) => {
    const amount = defineAmountOfSales(product);
    const sales = [];
    for (let i = 0; i < amount; i++) sales.push(repeatPromiseUntilResolved(getSalePromisified));
    return Promise.all(sales)
      .then((salesArray) => {
        product.sale = salesArray.map((sale) => (100 - sale) / 100).reduce((acc, red) => acc * red);
        return product;
      })
      .catch(() => {
        response.statusCode = 500;
        response.write({ status: 'error' });
        response.end();
      });
  });
  Promise.all(data)
    .then((result) => {
      response.write(JSON.stringify(result));
      response.end();
    })
    .catch(() => {
      response.statusCode = 500;
      response.write(JSON.stringify({ status: 'error' }));
      response.end();
    });
}

async function getSalesAsync(response) {
  try {
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
  } catch (e) {
    response.statusCode = 500;
    response.write(JSON.stringify({ status: 'error' }));
    response.end();
  }
}

async function getFiles(response) {
  try {
    const fileList = await promisifiedReaddir('./upload');
    response.write(JSON.stringify(fileList));
    response.end();
  } catch (e) {
    response.statusCode = 500;
    response.write(JSON.stringify({ status: 'error' }));
    response.end();
  }
}

async function uploadCSV(inputStream) {
  const gunzip = createGunzip();

  const id = Date.now();
  const filepath = `./upload/${id}.json`;
  const outputStream = fs.createWriteStream(filepath);
  const csvToJson = transformCsvToJson();
  try {
    await promisifiedPipeline(inputStream, gunzip, csvToJson, outputStream);
  } catch (err) {
    console.log('CSV pipeline failed: ', err);
  }
}

async function optimizeFile(response, query) {
  const uniqueProduct = [];
  const { filename } = query;
  const filepath = './upload/';
  const fileStream = fs.createReadStream(filepath + filename);

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  rl.on('line', async (line) => {
    if (line === '[' || line === ']') return;
    if (line[line.length - 1] === ',') line = line.slice(0, -1);
    const product = await JSON.parse(line);
    const str = Object.entries(product);
    str.splice(2, 1);
    for (let i = 0; i < uniqueProduct.length; i++) {
      const uniqueStr = Object.entries(uniqueProduct[i]);
      uniqueStr.splice(2, 1);
      if (str.toString() === uniqueStr.toString()) {
        uniqueProduct[i].quantity += product.quantity;
        return;
      }
    }
    uniqueProduct.push(product);
  }).on('close', () => {
    const writableStream = fs.createWriteStream(`./upload/optimized/${filename}`);
    writableStream.write(JSON.stringify(uniqueProduct));
    response.write(JSON.stringify({ status: 'ok' }));
    response.end();
  });
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
  uploadCSV,
  getFiles,
  optimizeFile,
};
