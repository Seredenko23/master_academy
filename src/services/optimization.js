/* eslint-disable no-return-await */
const { Transform } = require('stream');
const { getFilesInfo } = require('./files');
const { getProductsByParams, createProduct } = require('../db');

async function defineUnique(obj, store) {
  let str = Object.entries(obj);
  str.splice(2, 1);
  str = str.toString();
  if (store[str]) store[str].quantity += obj.quantity;
  else store[str] = obj;
}

function createOptimizationStream() {
  const uniqueProduct = {};
  const transform = (chunk, encoding, callback) => {
    const data = JSON.parse(chunk);
    data.forEach((product) => defineUnique(product, uniqueProduct));
    callback(null);
  };

  const flush = (callback) => {
    const data = Object.values(uniqueProduct);
    data.forEach(async (product) => {
      try {
        const res = await getProductsByParams(product);
        if (!res) await createProduct(product);
      } catch (e) {
        console.log(e);
      }
    });
    callback(null);
  };

  return new Transform({ transform, flush });
}

module.exports = {
  getFilesInfo,
  defineUnique,
  createOptimizationStream,
};
